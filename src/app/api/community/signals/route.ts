import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { influencerId, type, rating, comment, tags } = body;

    // Validate required fields
    if (!influencerId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: influencerId, type' },
        { status: 400 }
      );
    }

    // Validate signal type
    const validTypes = ['RATING', 'DRAMA_REPORT', 'POSITIVE_ACTION', 'COMMENT'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid signal type' },
        { status: 400 }
      );
    }

    // Validate rating if type is RATING
    if (type === 'RATING' && (!rating || rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Generate content hash for duplicate detection
    const contentString = `${influencerId}-${type}-${rating || ''}-${comment || ''}`;
    const contentHash = crypto.createHash('sha256').update(contentString).digest('hex');

    // Check for duplicates (same user, same influencer, same type, within 24 hours)
    const { data: existingSignals } = await supabase
      .from('community_signal')
      .select('id')
      .eq('user_id', user.id)
      .eq('influencer_id', influencerId)
      .eq('type', type)
      .eq('content_hash', contentHash)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (existingSignals && existingSignals.length > 0) {
      return NextResponse.json(
        { error: 'Duplicate signal detected. Please wait 24 hours before submitting the same signal.' },
        { status: 409 }
      );
    }

    // Create the signal
    const { data: signal, error: insertError } = await supabase
      .from('community_signal')
      .insert({
        user_id: user.id,
        influencer_id: influencerId,
        type,
        rating: type === 'RATING' ? rating : null,
        comment,
        tags: tags || [],
        content_hash: contentHash,
        status: 'PENDING', // Will be verified by AI
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating signal:', insertError);
      return NextResponse.json(
        { error: 'Failed to create signal' },
        { status: 500 }
      );
    }

    // Award XP to user
    const xpAmount = type === 'RATING' ? 5 : type === 'COMMENT' ? 3 : 10;
    await supabase.rpc('award_xp', {
      p_user_id: user.id,
      p_xp_amount: xpAmount,
      p_action_type: type === 'RATING' ? 'RATING' : 'REPORT',
    });

    // TODO: Trigger AI verification in background
    // For now, auto-verify (in production, this should be async)
    await supabase
      .from('community_signal')
      .update({
        status: 'VERIFIED',
        is_verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq('id', signal.id);

    return NextResponse.json({
      success: true,
      signal,
      xpAwarded: xpAmount,
    });
  } catch (error) {
    console.error('Error in POST /api/community/signals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const influencerId = searchParams.get('influencerId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!influencerId) {
      return NextResponse.json(
        { error: 'Missing influencerId parameter' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('community_signal')
      .select('*')
      .eq('influencer_id', influencerId)
      .eq('status', 'VERIFIED')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('type', type);
    }

    const { data: signals, error } = await query;

    if (error) {
      console.error('Error fetching signals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch signals' },
        { status: 500 }
      );
    }

    return NextResponse.json({ signals });
  } catch (error) {
    console.error('Error in GET /api/community/signals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
