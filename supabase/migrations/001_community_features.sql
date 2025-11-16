-- Migration: Community Features
-- Description: Add tables for community ratings, voting, and signals

-- ============================================
-- 1. COMMUNITY SIGNALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS community_signal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('RATING', 'DRAMA_REPORT', 'POSITIVE_ACTION', 'COMMENT')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    content_hash TEXT,
    is_duplicate BOOLEAN DEFAULT false,
    duplicate_of UUID REFERENCES community_signal(id),
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id),
    verification_result JSONB,
    rejection_reason TEXT,
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMPTZ,
    is_hidden BOOLEAN DEFAULT false,
    hidden_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for community_signal
CREATE INDEX idx_community_signal_influencer ON community_signal(influencer_id);
CREATE INDEX idx_community_signal_user ON community_signal(user_id);
CREATE INDEX idx_community_signal_type ON community_signal(type);
CREATE INDEX idx_community_signal_status ON community_signal(status);
CREATE INDEX idx_community_signal_created ON community_signal(created_at DESC);
CREATE INDEX idx_community_signal_composite ON community_signal(influencer_id, type, status);

-- ============================================
-- 2. COMMUNITY TRUST SCORE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS community_trust_score (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL UNIQUE,
    avg_rating DECIMAL(3,2) DEFAULT 0.0,
    total_ratings INTEGER DEFAULT 0,
    total_drama_reports INTEGER DEFAULT 0,
    total_positive_reports INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    community_score DECIMAL(5,2) DEFAULT 50.0,
    combined_score DECIMAL(5,2) DEFAULT 50.0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for community_trust_score
CREATE INDEX idx_community_trust_score_influencer ON community_trust_score(influencer_id);
CREATE INDEX idx_community_trust_score_community ON community_trust_score(community_score DESC);
CREATE INDEX idx_community_trust_score_combined ON community_trust_score(combined_score DESC);

-- ============================================
-- 3. INFLUENCER RESPONSE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS influencer_response (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL,
    mention_id UUID,
    signal_id UUID REFERENCES community_signal(id) ON DELETE CASCADE,
    response_type TEXT NOT NULL CHECK (response_type IN ('CLARIFICATION', 'REBUTTAL', 'ACKNOWLEDGMENT')),
    response_text TEXT NOT NULL,
    evidence_urls JSONB DEFAULT '[]'::jsonb,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for influencer_response
CREATE INDEX idx_influencer_response_influencer ON influencer_response(influencer_id);
CREATE INDEX idx_influencer_response_signal ON influencer_response(signal_id);
CREATE INDEX idx_influencer_response_created ON influencer_response(created_at DESC);

-- ============================================
-- 4. RESPONSE VOTE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS response_vote (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES influencer_response(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(response_id, user_id)
);

-- Indexes for response_vote
CREATE INDEX idx_response_vote_response ON response_vote(response_id);
CREATE INDEX idx_response_vote_user ON response_vote(user_id);

-- ============================================
-- 5. UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_signal_updated_at
    BEFORE UPDATE ON community_signal
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencer_response_updated_at
    BEFORE UPDATE ON influencer_response
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE community_signal ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_trust_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_response ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_vote ENABLE ROW LEVEL SECURITY;

-- Community Signal Policies
CREATE POLICY "Anyone can view verified signals"
    ON community_signal FOR SELECT
    USING (status = 'VERIFIED' AND is_hidden = false);

CREATE POLICY "Users can view their own signals"
    ON community_signal FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create signals"
    ON community_signal FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending signals"
    ON community_signal FOR UPDATE
    USING (auth.uid() = user_id AND status = 'PENDING');

-- Community Trust Score Policies
CREATE POLICY "Anyone can view trust scores"
    ON community_trust_score FOR SELECT
    USING (true);

-- Influencer Response Policies
CREATE POLICY "Anyone can view verified responses"
    ON influencer_response FOR SELECT
    USING (is_verified = true);

CREATE POLICY "Authenticated users can create responses"
    ON influencer_response FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Response Vote Policies
CREATE POLICY "Anyone can view votes"
    ON response_vote FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can vote"
    ON response_vote FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
    ON response_vote FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to calculate community score
CREATE OR REPLACE FUNCTION calculate_community_score(p_influencer_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    v_avg_rating DECIMAL;
    v_drama_count INTEGER;
    v_positive_count INTEGER;
    v_base_score DECIMAL := 50.0;
    v_rating_impact DECIMAL := 0.0;
    v_drama_impact DECIMAL := 0.0;
    v_positive_impact DECIMAL := 0.0;
    v_final_score DECIMAL;
BEGIN
    -- Get average rating
    SELECT COALESCE(AVG(rating), 3.0)
    INTO v_avg_rating
    FROM community_signal
    WHERE influencer_id = p_influencer_id
      AND type = 'RATING'
      AND status = 'VERIFIED'
      AND is_hidden = false;

    -- Get drama count
    SELECT COUNT(*)
    INTO v_drama_count
    FROM community_signal
    WHERE influencer_id = p_influencer_id
      AND type = 'DRAMA_REPORT'
      AND status = 'VERIFIED'
      AND is_hidden = false;

    -- Get positive count
    SELECT COUNT(*)
    INTO v_positive_count
    FROM community_signal
    WHERE influencer_id = p_influencer_id
      AND type = 'POSITIVE_ACTION'
      AND status = 'VERIFIED'
      AND is_hidden = false;

    -- Calculate impacts
    v_rating_impact := LEAST(GREATEST((v_avg_rating - 3.0) * 10, -20), 20);
    v_drama_impact := LEAST(v_drama_count * 5, 30) * -1;
    v_positive_impact := LEAST(v_positive_count * 5, 30);

    -- Calculate final score
    v_final_score := v_base_score + v_rating_impact + v_drama_impact + v_positive_impact;
    v_final_score := LEAST(GREATEST(v_final_score, 0), 100);

    RETURN v_final_score;
END;
$$ LANGUAGE plpgsql;

-- Function to update community trust score
CREATE OR REPLACE FUNCTION update_community_trust_score(p_influencer_id UUID)
RETURNS void AS $$
DECLARE
    v_avg_rating DECIMAL;
    v_total_ratings INTEGER;
    v_total_drama INTEGER;
    v_total_positive INTEGER;
    v_total_comments INTEGER;
    v_community_score DECIMAL;
BEGIN
    -- Get aggregated data
    SELECT 
        COALESCE(AVG(CASE WHEN type = 'RATING' THEN rating END), 0),
        COUNT(CASE WHEN type = 'RATING' THEN 1 END),
        COUNT(CASE WHEN type = 'DRAMA_REPORT' THEN 1 END),
        COUNT(CASE WHEN type = 'POSITIVE_ACTION' THEN 1 END),
        COUNT(CASE WHEN type = 'COMMENT' THEN 1 END)
    INTO v_avg_rating, v_total_ratings, v_total_drama, v_total_positive, v_total_comments
    FROM community_signal
    WHERE influencer_id = p_influencer_id
      AND status = 'VERIFIED'
      AND is_hidden = false;

    -- Calculate community score
    v_community_score := calculate_community_score(p_influencer_id);

    -- Upsert community trust score
    INSERT INTO community_trust_score (
        influencer_id,
        avg_rating,
        total_ratings,
        total_drama_reports,
        total_positive_reports,
        total_comments,
        community_score,
        last_updated
    ) VALUES (
        p_influencer_id,
        v_avg_rating,
        v_total_ratings,
        v_total_drama,
        v_total_positive,
        v_total_comments,
        v_community_score,
        NOW()
    )
    ON CONFLICT (influencer_id) DO UPDATE SET
        avg_rating = EXCLUDED.avg_rating,
        total_ratings = EXCLUDED.total_ratings,
        total_drama_reports = EXCLUDED.total_drama_reports,
        total_positive_reports = EXCLUDED.total_positive_reports,
        total_comments = EXCLUDED.total_comments,
        community_score = EXCLUDED.community_score,
        last_updated = NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger to update trust score when signal is verified
CREATE OR REPLACE FUNCTION trigger_update_trust_score()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'VERIFIED' AND (OLD.status IS NULL OR OLD.status != 'VERIFIED') THEN
        PERFORM update_community_trust_score(NEW.influencer_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trust_score_on_signal_verify
    AFTER INSERT OR UPDATE ON community_signal
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_trust_score();
