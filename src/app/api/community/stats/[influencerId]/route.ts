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

    // Get community trust score
    const { data: trustScore, error: trustError } = await supabase
      .from('community_trust_score')
      .select('*')
      .eq('influencer_id', influencerId)
      .single();

    if (trustError && trustError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is okay
      console.error('Error fetching trust score:', trustError);
    }

    // Get rating distribution
    const { data: ratings, error: ratingsError } = await supabase
      .from('community_signal')
      .select('rating')
      .eq('influencer_id', influencerId)
      .eq('type', 'RATING')
      .eq('status', 'VERIFIED')
      .eq('is_hidden', false)
      .not('rating', 'is', null);

    if (ratingsError) {
      console.error('Error fetching ratings:', ratingsError);
    }

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (ratings) {
      ratings.forEach((r: any) => {
        if (r.rating >= 1 && r.rating <= 5) {
          ratingDistribution[r.rating as keyof typeof ratingDistribution]++;
        }
      });
    }

    // Get recent signals
    const { data: recentSignals, error: signalsError } = await supabase
      .from('community_signal')
      .select('*')
      .eq('influencer_id', influencerId)
      .eq('status', 'VERIFIED')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .limit(10);

    if (signalsError) {
      console.error('Error fetching recent signals:', signalsError);
    }

    const stats = {
      totalRatings: trustScore?.total_ratings || 0,
      averageRating: trustScore?.avg_rating || 0,
      totalDramaReports: trustScore?.total_drama_reports || 0,
      totalPositiveReports: trustScore?.total_positive_reports || 0,
      totalComments: trustScore?.total_comments || 0,
      communityScore: trustScore?.community_score || 50,
      combinedScore: trustScore?.combined_score || 50,
      ratingDistribution,
      recentSignals: recentSignals || [],
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error in GET /api/community/stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
