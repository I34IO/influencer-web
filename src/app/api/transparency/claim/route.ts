import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const { influencerId, proofType, proofUrl, proofText } = body;

    // Validate required fields
    if (!influencerId || !proofType) {
      return NextResponse.json(
        { error: 'Missing required fields: influencerId, proofType' },
        { status: 400 }
      );
    }

    // Check if user already has a pending or approved claim for this influencer
    const { data: existingClaim } = await supabase
      .from('claim_request')
      .select('id, status')
      .eq('influencer_id', influencerId)
      .eq('user_id', user.id)
      .in('status', ['PENDING', 'APPROVED'])
      .single();

    if (existingClaim) {
      return NextResponse.json(
        { 
          error: `You already have a ${existingClaim.status.toLowerCase()} claim for this influencer`,
          existingClaim 
        },
        { status: 409 }
      );
    }

    // Create the claim request
    const { data: claim, error: insertError } = await supabase
      .from('claim_request')
      .insert({
        influencer_id: influencerId,
        user_id: user.id,
        proof_type: proofType,
        proof_url: proofUrl,
        proof_text: proofText,
        status: 'PENDING',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating claim request:', insertError);
      return NextResponse.json(
        { error: 'Failed to create claim request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      claim,
    });
  } catch (error) {
    console.error('Error in POST /api/transparency/claim:', error);
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

    if (!influencerId) {
      return NextResponse.json(
        { error: 'Missing influencerId parameter' },
        { status: 400 }
      );
    }

    // Get approved claim for this influencer
    const { data: claim, error } = await supabase
      .from('claim_request')
      .select('*')
      .eq('influencer_id', influencerId)
      .eq('status', 'APPROVED')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching claim:', error);
      return NextResponse.json(
        { error: 'Failed to fetch claim' },
        { status: 500 }
      );
    }

    return NextResponse.json({ claim: claim || null });
  } catch (error) {
    console.error('Error in GET /api/transparency/claim:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
