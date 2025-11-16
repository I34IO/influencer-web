import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { type } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'ALL_TIME';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Validate leaderboard type
    const validTypes = ['TOP_RATED', 'MOST_IMPROVED', 'HIGHEST_RISK', 'TRENDING', 'TOP_USERS', 'TOP_CONTRIBUTORS'];
    if (!validTypes.includes(type.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid leaderboard type' },
        { status: 400 }
      );
    }

    // Check cache first
    const { data: cache } = await supabase
      .from('leaderboard_cache')
      .select('data, expires_at')
      .eq('leaderboard_type', type.toUpperCase())
      .eq('period', period.toUpperCase())
      .single();

    // If cache exists and not expired, return it
    if (cache && new Date(cache.expires_at) > new Date()) {
      return NextResponse.json({ leaderboard: cache.data });
    }

    // Generate leaderboard based on type
    let leaderboard: any[] = [];

    switch (type.toUpperCase()) {
      case 'TOP_RATED':
        // Get influencers with highest combined scores
        const { data: topRated } = await supabase
          .from('community_trust_score')
          .select(`
            influencer_id,
            combined_score,
            community_score,
            total_ratings
          `)
          .order('combined_score', { ascending: false })
          .limit(limit);

        if (topRated) {
          leaderboard = topRated.map((item, index) => ({
            rank: index + 1,
            id: item.influencer_id,
            score: item.combined_score,
            communityScore: item.community_score,
            totalRatings: item.total_ratings,
          }));
        }
        break;

      case 'TOP_USERS':
      case 'TOP_CONTRIBUTORS':
        // Get users with highest XP/reputation
        const { data: topUsers } = await supabase
          .from('user_engagement_stats')
          .select(`
            user_id,
            level,
            experience_points,
            reputation_score,
            total_ratings,
            total_reports,
            total_comments
          `)
          .order('experience_points', { ascending: false })
          .limit(limit);

        if (topUsers) {
          leaderboard = topUsers.map((item, index) => ({
            rank: index + 1,
            id: item.user_id,
            level: item.level,
            score: item.experience_points,
            reputationScore: item.reputation_score,
            totalRatings: item.total_ratings,
            totalReports: item.total_reports,
            totalComments: item.total_comments,
          }));
        }
        break;

      case 'TRENDING':
        // Get trending influencers
        const { data: trending } = await supabase
          .from('trending_influencer')
          .select(`
            influencer_id,
            trend_score,
            score_change,
            score_change_percent,
            trend_type,
            reason
          `)
          .order('trend_score', { ascending: false })
          .limit(limit);

        if (trending) {
          leaderboard = trending.map((item, index) => ({
            rank: index + 1,
            id: item.influencer_id,
            score: item.trend_score,
            scoreChange: item.score_change,
            scoreChangePercent: item.score_change_percent,
            trendType: item.trend_type,
            reason: item.reason,
          }));
        }
        break;

      default:
        // For other types, return empty for now
        leaderboard = [];
    }

    // Cache the result (expires in 5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    await supabase
      .from('leaderboard_cache')
      .upsert({
        leaderboard_type: type.toUpperCase(),
        period: period.toUpperCase(),
        data: leaderboard,
        expires_at: expiresAt,
      });

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error in GET /api/leaderboards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
