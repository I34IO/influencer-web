import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ influencerId: string }> }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { influencerId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Call the database function to get event timeline
    const { data, error } = await supabase.rpc('get_event_timeline', {
      p_influencer_id: influencerId,
      p_limit: limit + 1, // Fetch one extra to check if there are more
      p_offset: offset,
    });

    if (error) {
      console.error('Error fetching event timeline:', error);
      return NextResponse.json(
        { error: 'Failed to fetch event timeline' },
        { status: 500 }
      );
    }

    const events = data || [];
    const hasMore = events.length > limit;
    const timeline = hasMore ? events.slice(0, limit) : events;

    return NextResponse.json({ 
      timeline,
      hasMore 
    });
  } catch (error) {
    console.error('Error in GET /api/transparency/timeline:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
