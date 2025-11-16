-- Migration: Gamification System
-- Description: Add tables for XP, levels, achievements, and leaderboards

-- ============================================
-- 1. USER ENGAGEMENT STATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_engagement_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    total_ratings INTEGER DEFAULT 0,
    total_reports INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    helpful_votes INTEGER DEFAULT 0,
    not_helpful_votes INTEGER DEFAULT 0,
    reputation_score DECIMAL(5,2) DEFAULT 50.0,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    last_active_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_engagement_stats
CREATE INDEX idx_user_engagement_stats_user ON user_engagement_stats(user_id);
CREATE INDEX idx_user_engagement_stats_level ON user_engagement_stats(level DESC);
CREATE INDEX idx_user_engagement_stats_xp ON user_engagement_stats(experience_points DESC);
CREATE INDEX idx_user_engagement_stats_reputation ON user_engagement_stats(reputation_score DESC);

-- ============================================
-- 2. USER ACHIEVEMENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL CHECK (achievement_type IN (
        'FIRST_RATING',
        'RATING_MASTER',
        'DRAMA_DETECTOR',
        'POSITIVE_VIBES',
        'TRUSTED_VOTER',
        'STREAK_KEEPER',
        'INFLUENCER_HUNTER'
    )),
    achievement_level INTEGER DEFAULT 1 CHECK (achievement_level >= 1 AND achievement_level <= 4),
    progress INTEGER DEFAULT 0,
    progress_target INTEGER NOT NULL,
    unlocked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

-- Indexes for user_achievement
CREATE INDEX idx_user_achievement_user ON user_achievement(user_id);
CREATE INDEX idx_user_achievement_type ON user_achievement(achievement_type);
CREATE INDEX idx_user_achievement_unlocked ON user_achievement(unlocked_at DESC NULLS LAST);

-- ============================================
-- 3. LEADERBOARD CACHE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leaderboard_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leaderboard_type TEXT NOT NULL CHECK (leaderboard_type IN (
        'TOP_RATED',
        'MOST_IMPROVED',
        'HIGHEST_RISK',
        'TRENDING',
        'TOP_USERS',
        'TOP_CONTRIBUTORS'
    )),
    period TEXT NOT NULL CHECK (period IN ('DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME')),
    data JSONB NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    UNIQUE(leaderboard_type, period)
);

-- Indexes for leaderboard_cache
CREATE INDEX idx_leaderboard_cache_type ON leaderboard_cache(leaderboard_type);
CREATE INDEX idx_leaderboard_cache_expires ON leaderboard_cache(expires_at);

-- ============================================
-- 4. TRENDING INFLUENCER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS trending_influencer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL,
    trend_type TEXT NOT NULL CHECK (trend_type IN ('RISING', 'FALLING', 'CONTROVERSIAL', 'IMPROVING')),
    trend_score DECIMAL(10,2) NOT NULL,
    score_change DECIMAL(10,2) NOT NULL,
    score_change_percent DECIMAL(10,2) NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for trending_influencer
CREATE INDEX idx_trending_influencer_id ON trending_influencer(influencer_id);
CREATE INDEX idx_trending_influencer_type ON trending_influencer(trend_type);
CREATE INDEX idx_trending_influencer_score ON trending_influencer(trend_score DESC);
CREATE INDEX idx_trending_influencer_created ON trending_influencer(created_at DESC);

-- ============================================
-- 5. UPDATED_AT TRIGGER
-- ============================================
CREATE TRIGGER update_user_engagement_stats_updated_at
    BEFORE UPDATE ON user_engagement_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE user_engagement_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievement ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_influencer ENABLE ROW LEVEL SECURITY;

-- User Engagement Stats Policies
CREATE POLICY "Users can view their own stats"
    ON user_engagement_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view leaderboard stats"
    ON user_engagement_stats FOR SELECT
    USING (true);

-- User Achievement Policies
CREATE POLICY "Users can view their own achievements"
    ON user_achievement FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view unlocked achievements"
    ON user_achievement FOR SELECT
    USING (unlocked_at IS NOT NULL);

-- Leaderboard Cache Policies
CREATE POLICY "Anyone can view leaderboards"
    ON leaderboard_cache FOR SELECT
    USING (true);

-- Trending Influencer Policies
CREATE POLICY "Anyone can view trending influencers"
    ON trending_influencer FOR SELECT
    USING (true);

-- ============================================
-- 7. GAMIFICATION HELPER FUNCTIONS
-- ============================================

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN FLOOR(SQRT(xp::DECIMAL / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate XP needed for next level
CREATE OR REPLACE FUNCTION xp_for_level(level INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN ((level - 1) * (level - 1)) * 100;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to award XP to user
CREATE OR REPLACE FUNCTION award_xp(p_user_id UUID, p_xp_amount INTEGER, p_action_type TEXT)
RETURNS void AS $$
DECLARE
    v_new_xp INTEGER;
    v_new_level INTEGER;
    v_old_level INTEGER;
BEGIN
    -- Get current stats or create if not exists
    INSERT INTO user_engagement_stats (user_id, experience_points, level)
    VALUES (p_user_id, 0, 1)
    ON CONFLICT (user_id) DO NOTHING;

    -- Update XP and calculate new level
    UPDATE user_engagement_stats
    SET 
        experience_points = experience_points + p_xp_amount,
        level = calculate_level(experience_points + p_xp_amount),
        last_active_date = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING experience_points, level INTO v_new_xp, v_new_level;

    -- Update action counters
    IF p_action_type = 'RATING' THEN
        UPDATE user_engagement_stats
        SET total_ratings = total_ratings + 1
        WHERE user_id = p_user_id;
    ELSIF p_action_type = 'REPORT' THEN
        UPDATE user_engagement_stats
        SET total_reports = total_reports + 1
        WHERE user_id = p_user_id;
    ELSIF p_action_type = 'COMMENT' THEN
        UPDATE user_engagement_stats
        SET total_comments = total_comments + 1
        WHERE user_id = p_user_id;
    ELSIF p_action_type = 'HELPFUL_VOTE' THEN
        UPDATE user_engagement_stats
        SET helpful_votes = helpful_votes + 1
        WHERE user_id = p_user_id;
    END IF;

    -- Check and update achievements
    PERFORM check_achievements(p_user_id);
END;
$$ LANGUAGE plpgsql;

-- Function to check and unlock achievements
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_stats RECORD;
    v_achievement RECORD;
BEGIN
    -- Get user stats
    SELECT * INTO v_stats
    FROM user_engagement_stats
    WHERE user_id = p_user_id;

    -- Check FIRST_RATING
    IF v_stats.total_ratings >= 1 THEN
        INSERT INTO user_achievement (user_id, achievement_type, achievement_level, progress, progress_target, unlocked_at)
        VALUES (p_user_id, 'FIRST_RATING', 1, v_stats.total_ratings, 1, NOW())
        ON CONFLICT (user_id, achievement_type) DO UPDATE
        SET progress = v_stats.total_ratings,
            unlocked_at = COALESCE(user_achievement.unlocked_at, NOW());
    END IF;

    -- Check RATING_MASTER levels
    IF v_stats.total_ratings >= 10 THEN
        INSERT INTO user_achievement (user_id, achievement_type, achievement_level, progress, progress_target, unlocked_at)
        VALUES (p_user_id, 'RATING_MASTER', 1, v_stats.total_ratings, 10, NOW())
        ON CONFLICT (user_id, achievement_type) DO UPDATE
        SET progress = v_stats.total_ratings,
            achievement_level = CASE
                WHEN v_stats.total_ratings >= 500 THEN 4
                WHEN v_stats.total_ratings >= 100 THEN 3
                WHEN v_stats.total_ratings >= 50 THEN 2
                ELSE 1
            END,
            progress_target = CASE
                WHEN v_stats.total_ratings >= 500 THEN 500
                WHEN v_stats.total_ratings >= 100 THEN 500
                WHEN v_stats.total_ratings >= 50 THEN 100
                ELSE 50
            END,
            unlocked_at = COALESCE(user_achievement.unlocked_at, NOW());
    END IF;

    -- Check DRAMA_DETECTOR levels
    IF v_stats.total_reports >= 5 THEN
        INSERT INTO user_achievement (user_id, achievement_type, achievement_level, progress, progress_target, unlocked_at)
        VALUES (p_user_id, 'DRAMA_DETECTOR', 1, v_stats.total_reports, 5, NOW())
        ON CONFLICT (user_id, achievement_type) DO UPDATE
        SET progress = v_stats.total_reports,
            achievement_level = CASE
                WHEN v_stats.total_reports >= 50 THEN 3
                WHEN v_stats.total_reports >= 20 THEN 2
                ELSE 1
            END,
            progress_target = CASE
                WHEN v_stats.total_reports >= 50 THEN 50
                WHEN v_stats.total_reports >= 20 THEN 50
                ELSE 20
            END,
            unlocked_at = COALESCE(user_achievement.unlocked_at, NOW());
    END IF;

    -- Check TRUSTED_VOTER levels
    IF v_stats.helpful_votes >= 10 THEN
        INSERT INTO user_achievement (user_id, achievement_type, achievement_level, progress, progress_target, unlocked_at)
        VALUES (p_user_id, 'TRUSTED_VOTER', 1, v_stats.helpful_votes, 10, NOW())
        ON CONFLICT (user_id, achievement_type) DO UPDATE
        SET progress = v_stats.helpful_votes,
            achievement_level = CASE
                WHEN v_stats.helpful_votes >= 100 THEN 3
                WHEN v_stats.helpful_votes >= 50 THEN 2
                ELSE 1
            END,
            progress_target = CASE
                WHEN v_stats.helpful_votes >= 100 THEN 100
                WHEN v_stats.helpful_votes >= 50 THEN 100
                ELSE 50
            END,
            unlocked_at = COALESCE(user_achievement.unlocked_at, NOW());
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_last_active DATE;
    v_current_streak INTEGER;
BEGIN
    SELECT last_active_date::DATE, streak
    INTO v_last_active, v_current_streak
    FROM user_engagement_stats
    WHERE user_id = p_user_id;

    IF v_last_active IS NULL THEN
        -- First activity
        UPDATE user_engagement_stats
        SET streak = 1, last_active_date = NOW()
        WHERE user_id = p_user_id;
    ELSIF v_last_active = CURRENT_DATE THEN
        -- Already active today, no change
        RETURN;
    ELSIF v_last_active = CURRENT_DATE - INTERVAL '1 day' THEN
        -- Consecutive day, increment streak
        UPDATE user_engagement_stats
        SET streak = streak + 1, last_active_date = NOW()
        WHERE user_id = p_user_id;
    ELSE
        -- Streak broken, reset to 1
        UPDATE user_engagement_stats
        SET streak = 1, last_active_date = NOW()
        WHERE user_id = p_user_id;
    END IF;

    -- Check streak achievements
    PERFORM check_achievements(p_user_id);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update streak on signal creation
CREATE OR REPLACE FUNCTION trigger_update_streak()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_user_streak(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_streak_on_signal
    AFTER INSERT ON community_signal
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_streak();
