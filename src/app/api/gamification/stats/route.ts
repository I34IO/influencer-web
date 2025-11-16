import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
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

    // Get or create user engagement stats
    let { data: stats, error: statsError } = await supabase
      .from('user_engagement_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (statsError && statsError.code === 'PGRST116') {
      // User stats don't exist, create them
      const { data: newStats, error: createError } = await supabase
        .from('user_engagement_stats')
        .insert({
          user_id: user.id,
          level: 1,
          experience_points: 0,
          reputation_score: 50,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user stats:', createError);
        return NextResponse.json(
          { error: 'Failed to create user stats' },
          { status: 500 }
        );
      }

      stats = newStats;
    } else if (statsError) {
      console.error('Error fetching user stats:', statsError);
      return NextResponse.json(
        { error: 'Failed to fetch user stats' },
        { status: 500 }
      );
    }

    // Get user achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievement')
      .select('*')
      .eq('user_id', user.id);

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
    }

    // Calculate XP for next level
    const currentLevel = stats.level;
    const currentXP = stats.experience_points;
    const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
    const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
    const xpInCurrentLevel = currentXP - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const xpProgress = Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);

    const unlockedAchievements = achievements?.filter(a => a.unlocked_at !== null).length || 0;
    const totalAchievements = 7; // Total number of achievement types

    const userStats = {
      level: stats.level,
      experiencePoints: stats.experience_points,
      xpForNextLevel: xpForNextLevel,
      xpProgress: Math.round(xpProgress),
      totalRatings: stats.total_ratings,
      totalReports: stats.total_reports,
      totalComments: stats.total_comments,
      reputationScore: stats.reputation_score,
      streak: stats.streak,
      helpfulVotes: stats.helpful_votes,
      achievements: achievements || [],
      unlockedAchievements,
      totalAchievements,
    };

    return NextResponse.json({ stats: userStats });
  } catch (error) {
    console.error('Error in GET /api/gamification/stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
