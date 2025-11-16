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

    // Call the database function to get score breakdown
    const { data, error } = await supabase.rpc('get_score_breakdown', {
      p_influencer_id: influencerId,
    });

    if (error) {
      console.error('Error fetching score breakdown:', error);
      return NextResponse.json(
        { error: 'Failed to fetch score breakdown' },
        { status: 500 }
      );
    }

    return NextResponse.json({ breakdown: data });
  } catch (error) {
    console.error('Error in GET /api/transparency/breakdown:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
