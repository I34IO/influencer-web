-- Migration: Transparency Features
-- Description: Add tables for score breakdown, event timeline, and profile claims

-- ============================================
-- 1. SCORE IMPACT LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS score_impact_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('MENTION', 'COMMUNITY_SIGNAL', 'MANUAL_ADJUSTMENT')),
    event_id UUID,
    impact_type TEXT NOT NULL CHECK (impact_type IN ('POSITIVE', 'NEGATIVE', 'NEUTRAL')),
    impact_amount DECIMAL(10,2) NOT NULL,
    old_score DECIMAL(5,2) NOT NULL,
    new_score DECIMAL(5,2) NOT NULL,
    reason TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for score_impact_log
CREATE INDEX idx_score_impact_log_influencer ON score_impact_log(influencer_id);
CREATE INDEX idx_score_impact_log_created ON score_impact_log(created_at DESC);
CREATE INDEX idx_score_impact_log_type ON score_impact_log(event_type);

-- ============================================
-- 2. CLAIM REQUEST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS claim_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    proof_type TEXT,
    proof_url TEXT,
    proof_text TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for claim_request
CREATE INDEX idx_claim_request_influencer ON claim_request(influencer_id);
CREATE INDEX idx_claim_request_user ON claim_request(user_id);
CREATE INDEX idx_claim_request_status ON claim_request(status);
CREATE INDEX idx_claim_request_created ON claim_request(created_at DESC);

-- ============================================
-- 3. REVIEW REQUEST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS review_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL,
    mention_id UUID,
    signal_id UUID REFERENCES community_signal(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL CHECK (request_type IN ('DISPUTE', 'CORRECTION', 'REMOVAL')),
    reason TEXT NOT NULL,
    evidence TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    resolution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for review_request
CREATE INDEX idx_review_request_influencer ON review_request(influencer_id);
CREATE INDEX idx_review_request_user ON review_request(requested_by);
CREATE INDEX idx_review_request_status ON review_request(status);
CREATE INDEX idx_review_request_created ON review_request(created_at DESC);

-- ============================================
-- 4. UPDATED_AT TRIGGERS
-- ============================================
CREATE TRIGGER update_claim_request_updated_at
    BEFORE UPDATE ON claim_request
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_request_updated_at
    BEFORE UPDATE ON review_request
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE score_impact_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_request ENABLE ROW LEVEL SECURITY;

-- Score Impact Log Policies
CREATE POLICY "Anyone can view score impact logs"
    ON score_impact_log FOR SELECT
    USING (true);

-- Claim Request Policies
CREATE POLICY "Users can view their own claim requests"
    ON claim_request FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view approved claims"
    ON claim_request FOR SELECT
    USING (status = 'APPROVED');

CREATE POLICY "Authenticated users can create claim requests"
    ON claim_request FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending claims"
    ON claim_request FOR UPDATE
    USING (auth.uid() = user_id AND status = 'PENDING');

-- Review Request Policies
CREATE POLICY "Users can view their own review requests"
    ON review_request FOR SELECT
    USING (auth.uid() = requested_by);

CREATE POLICY "Authenticated users can create review requests"
    ON review_request FOR INSERT
    WITH CHECK (auth.uid() = requested_by);

-- ============================================
-- 6. TRANSPARENCY HELPER FUNCTIONS
-- ============================================

-- Function to log score impact
CREATE OR REPLACE FUNCTION log_score_impact(
    p_influencer_id UUID,
    p_event_type TEXT,
    p_event_id UUID,
    p_impact_type TEXT,
    p_impact_amount DECIMAL,
    p_old_score DECIMAL,
    p_new_score DECIMAL,
    p_reason TEXT,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO score_impact_log (
        influencer_id,
        event_type,
        event_id,
        impact_type,
        impact_amount,
        old_score,
        new_score,
        reason,
        details
    ) VALUES (
        p_influencer_id,
        p_event_type,
        p_event_id,
        p_impact_type,
        p_impact_amount,
        p_old_score,
        p_new_score,
        p_reason,
        p_details
    )
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get event timeline for influencer
CREATE OR REPLACE FUNCTION get_event_timeline(
    p_influencer_id UUID,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    event_id UUID,
    event_type TEXT,
    event_date TIMESTAMPTZ,
    impact_type TEXT,
    impact_amount DECIMAL,
    score_change DECIMAL,
    description TEXT,
    details JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sil.id as event_id,
        sil.event_type,
        sil.created_at as event_date,
        sil.impact_type,
        sil.impact_amount,
        (sil.new_score - sil.old_score) as score_change,
        sil.reason as description,
        sil.details
    FROM score_impact_log sil
    WHERE sil.influencer_id = p_influencer_id
    ORDER BY sil.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get score breakdown
CREATE OR REPLACE FUNCTION get_score_breakdown(p_influencer_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_ai_score DECIMAL;
    v_community_score DECIMAL;
    v_combined_score DECIMAL;
    v_drama_count INTEGER;
    v_positive_count INTEGER;
    v_avg_rating DECIMAL;
    v_total_ratings INTEGER;
    v_breakdown JSONB;
BEGIN
    -- Get AI score (from Influencer table - assuming it exists)
    -- This is a placeholder - adjust based on your actual schema
    v_ai_score := 50.0;

    -- Get community metrics
    SELECT 
        community_score,
        combined_score,
        total_drama_reports,
        total_positive_reports,
        avg_rating,
        total_ratings
    INTO 
        v_community_score,
        v_combined_score,
        v_drama_count,
        v_positive_count,
        v_avg_rating,
        v_total_ratings
    FROM community_trust_score
    WHERE influencer_id = p_influencer_id;

    -- If no community score exists, use defaults
    v_community_score := COALESCE(v_community_score, 50.0);
    v_combined_score := COALESCE(v_combined_score, 50.0);
    v_drama_count := COALESCE(v_drama_count, 0);
    v_positive_count := COALESCE(v_positive_count, 0);
    v_avg_rating := COALESCE(v_avg_rating, 0.0);
    v_total_ratings := COALESCE(v_total_ratings, 0);

    -- Build breakdown JSON
    v_breakdown := jsonb_build_object(
        'aiScore', jsonb_build_object(
            'value', v_ai_score,
            'weight', 0.6,
            'components', jsonb_build_object(
                'baseScore', 50.0,
                'dramaImpact', v_drama_count * -5,
                'positiveImpact', v_positive_count * 5,
                'sentimentAdjustment', 0
            )
        ),
        'communityScore', jsonb_build_object(
            'value', v_community_score,
            'weight', 0.4,
            'components', jsonb_build_object(
                'averageRating', v_avg_rating,
                'totalRatings', v_total_ratings,
                'dramaReports', v_drama_count,
                'positiveReports', v_positive_count,
                'ratingImpact', (v_avg_rating - 3.0) * 10,
                'dramaImpact', v_drama_count * -5,
                'positiveImpact', v_positive_count * 5
            )
        ),
        'combinedScore', jsonb_build_object(
            'value', v_combined_score,
            'calculation', '(AI × 0.6) + (Community × 0.4)'
        ),
        'metadata', jsonb_build_object(
            'totalDramaReports', v_drama_count,
            'totalPositiveReports', v_positive_count,
            'totalRatings', v_total_ratings,
            'averageRating', v_avg_rating
        )
    );

    RETURN v_breakdown;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log score changes from community signals
CREATE OR REPLACE FUNCTION trigger_log_community_score_impact()
RETURNS TRIGGER AS $$
DECLARE
    v_old_score DECIMAL;
    v_new_score DECIMAL;
    v_impact_type TEXT;
    v_reason TEXT;
BEGIN
    IF NEW.status = 'VERIFIED' AND (OLD.status IS NULL OR OLD.status != 'VERIFIED') THEN
        -- Get old and new scores
        SELECT community_score INTO v_old_score
        FROM community_trust_score
        WHERE influencer_id = NEW.influencer_id;

        v_old_score := COALESCE(v_old_score, 50.0);

        -- Calculate new score (this will be done by update_community_trust_score)
        v_new_score := calculate_community_score(NEW.influencer_id);

        -- Determine impact type and reason
        IF NEW.type = 'RATING' THEN
            IF NEW.rating >= 4 THEN
                v_impact_type := 'POSITIVE';
                v_reason := format('Positive rating (%s stars) from community', NEW.rating);
            ELSIF NEW.rating <= 2 THEN
                v_impact_type := 'NEGATIVE';
                v_reason := format('Negative rating (%s stars) from community', NEW.rating);
            ELSE
                v_impact_type := 'NEUTRAL';
                v_reason := format('Neutral rating (%s stars) from community', NEW.rating);
            END IF;
        ELSIF NEW.type = 'DRAMA_REPORT' THEN
            v_impact_type := 'NEGATIVE';
            v_reason := 'Drama report from community';
        ELSIF NEW.type = 'POSITIVE_ACTION' THEN
            v_impact_type := 'POSITIVE';
            v_reason := 'Positive action report from community';
        ELSE
            v_impact_type := 'NEUTRAL';
            v_reason := 'Community comment';
        END IF;

        -- Log the impact
        PERFORM log_score_impact(
            NEW.influencer_id,
            'COMMUNITY_SIGNAL',
            NEW.id,
            v_impact_type,
            v_new_score - v_old_score,
            v_old_score,
            v_new_score,
            v_reason,
            jsonb_build_object(
                'signalType', NEW.type,
                'rating', NEW.rating,
                'userId', NEW.user_id
            )
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_community_score_impact
    AFTER INSERT OR UPDATE ON community_signal
    FOR EACH ROW
    EXECUTE FUNCTION trigger_log_community_score_impact();
