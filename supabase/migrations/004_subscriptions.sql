-- Migration: Subscription System
-- Description: Add subscription fields to users and create subscription-related tables

-- ============================================
-- 1. ADD SUBSCRIPTION FIELDS TO AUTH.USERS METADATA
-- ============================================
-- Note: Supabase auth.users table is managed by Supabase Auth
-- We'll store subscription data in user metadata (raw_user_meta_data)
-- and create a separate table for subscription management

-- ============================================
-- 2. USER SUBSCRIPTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_subscription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier TEXT DEFAULT 'FREE' CHECK (subscription_tier IN ('FREE', 'PREMIUM', 'PROFESSIONAL')),
    subscription_status TEXT DEFAULT 'ACTIVE' CHECK (subscription_status IN ('ACTIVE', 'CANCELLED', 'EXPIRED', 'TRIAL')),
    subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
    subscription_expiry TIMESTAMPTZ,
    monthly_reports_used INTEGER DEFAULT 0,
    monthly_reports_limit INTEGER DEFAULT 5,
    last_reset_date TIMESTAMPTZ DEFAULT NOW(),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_subscription
CREATE INDEX idx_user_subscription_user ON user_subscription(user_id);
CREATE INDEX idx_user_subscription_tier ON user_subscription(subscription_tier);
CREATE INDEX idx_user_subscription_status ON user_subscription(subscription_status);
CREATE INDEX idx_user_subscription_expiry ON user_subscription(subscription_expiry);

-- ============================================
-- 3. SUBSCRIPTION PLAN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier TEXT NOT NULL UNIQUE CHECK (tier IN ('FREE', 'PREMIUM', 'PROFESSIONAL')),
    name TEXT NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    monthly_reports_limit INTEGER NOT NULL,
    features JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO subscription_plan (tier, name, description, price_monthly, price_yearly, monthly_reports_limit, features) VALUES
('FREE', 'Free', 'Basic access to influencer ratings', 0.00, 0.00, 5, 
    '["View influencer profiles", "Submit ratings", "View leaderboards", "Earn achievements", "Basic search"]'::jsonb),
('PREMIUM', 'Premium', 'Enhanced features for active users', 4.99, 49.99, 50,
    '["Everything in Free", "50 monthly reports", "Advanced statistics", "Priority verification", "No ads", "Export data"]'::jsonb),
('PROFESSIONAL', 'Professional', 'Full access for professionals', 19.99, 199.99, -1,
    '["Everything in Premium", "Unlimited reports", "API access", "Priority support", "Custom analytics", "White-label reports", "Team collaboration"]'::jsonb);

-- ============================================
-- 4. SUBSCRIPTION USAGE LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_usage_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('REPORT', 'API_CALL', 'EXPORT', 'DEEP_SEARCH')),
    resource_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for subscription_usage_log
CREATE INDEX idx_subscription_usage_log_user ON subscription_usage_log(user_id);
CREATE INDEX idx_subscription_usage_log_created ON subscription_usage_log(created_at DESC);
CREATE INDEX idx_subscription_usage_log_action ON subscription_usage_log(action_type);

-- ============================================
-- 5. UPDATED_AT TRIGGERS
-- ============================================
CREATE TRIGGER update_user_subscription_updated_at
    BEFORE UPDATE ON user_subscription
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plan_updated_at
    BEFORE UPDATE ON subscription_plan
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE user_subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage_log ENABLE ROW LEVEL SECURITY;

-- User Subscription Policies
CREATE POLICY "Users can view their own subscription"
    ON user_subscription FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
    ON user_subscription FOR UPDATE
    USING (auth.uid() = user_id);

-- Subscription Plan Policies
CREATE POLICY "Anyone can view active subscription plans"
    ON subscription_plan FOR SELECT
    USING (is_active = true);

-- Subscription Usage Log Policies
CREATE POLICY "Users can view their own usage logs"
    ON subscription_usage_log FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================
-- 7. SUBSCRIPTION HELPER FUNCTIONS
-- ============================================

-- Function to initialize user subscription
CREATE OR REPLACE FUNCTION initialize_user_subscription(p_user_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO user_subscription (user_id, subscription_tier, monthly_reports_limit)
    VALUES (p_user_id, 'FREE', 5)
    ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can perform action
CREATE OR REPLACE FUNCTION can_user_perform_action(
    p_user_id UUID,
    p_action_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_subscription RECORD;
    v_usage_count INTEGER;
BEGIN
    -- Get user subscription
    SELECT * INTO v_subscription
    FROM user_subscription
    WHERE user_id = p_user_id;

    -- If no subscription, initialize with FREE tier
    IF NOT FOUND THEN
        PERFORM initialize_user_subscription(p_user_id);
        SELECT * INTO v_subscription
        FROM user_subscription
        WHERE user_id = p_user_id;
    END IF;

    -- Check if subscription is active
    IF v_subscription.subscription_status != 'ACTIVE' THEN
        RETURN false;
    END IF;

    -- Check if subscription has expired
    IF v_subscription.subscription_expiry IS NOT NULL 
       AND v_subscription.subscription_expiry < NOW() THEN
        RETURN false;
    END IF;

    -- For PROFESSIONAL tier, unlimited access
    IF v_subscription.subscription_tier = 'PROFESSIONAL' THEN
        RETURN true;
    END IF;

    -- Check monthly limits for specific actions
    IF p_action_type IN ('REPORT', 'DEEP_SEARCH') THEN
        -- Check if monthly reset is needed
        IF v_subscription.last_reset_date < DATE_TRUNC('month', NOW()) THEN
            -- Reset monthly usage
            UPDATE user_subscription
            SET monthly_reports_used = 0,
                last_reset_date = NOW()
            WHERE user_id = p_user_id;
            
            RETURN true;
        END IF;

        -- Check if user has reached limit
        IF v_subscription.monthly_reports_used >= v_subscription.monthly_reports_limit THEN
            RETURN false;
        END IF;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to log usage and increment counter
CREATE OR REPLACE FUNCTION log_subscription_usage(
    p_user_id UUID,
    p_action_type TEXT,
    p_resource_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_can_perform BOOLEAN;
BEGIN
    -- Check if user can perform action
    v_can_perform := can_user_perform_action(p_user_id, p_action_type);

    IF NOT v_can_perform THEN
        RETURN false;
    END IF;

    -- Log the usage
    INSERT INTO subscription_usage_log (user_id, action_type, resource_id)
    VALUES (p_user_id, p_action_type, p_resource_id);

    -- Increment usage counter for relevant actions
    IF p_action_type IN ('REPORT', 'DEEP_SEARCH') THEN
        UPDATE user_subscription
        SET monthly_reports_used = monthly_reports_used + 1
        WHERE user_id = p_user_id;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to upgrade subscription
CREATE OR REPLACE FUNCTION upgrade_subscription(
    p_user_id UUID,
    p_new_tier TEXT,
    p_stripe_subscription_id TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
    v_new_limit INTEGER;
    v_expiry TIMESTAMPTZ;
BEGIN
    -- Get new tier limits
    SELECT monthly_reports_limit INTO v_new_limit
    FROM subscription_plan
    WHERE tier = p_new_tier;

    -- Calculate expiry (30 days from now)
    v_expiry := NOW() + INTERVAL '30 days';

    -- Update subscription
    UPDATE user_subscription
    SET 
        subscription_tier = p_new_tier,
        subscription_status = 'ACTIVE',
        monthly_reports_limit = v_new_limit,
        subscription_expiry = v_expiry,
        stripe_subscription_id = COALESCE(p_stripe_subscription_id, stripe_subscription_id),
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- If no subscription exists, create one
    IF NOT FOUND THEN
        INSERT INTO user_subscription (
            user_id,
            subscription_tier,
            monthly_reports_limit,
            subscription_expiry,
            stripe_subscription_id
        ) VALUES (
            p_user_id,
            p_new_tier,
            v_new_limit,
            v_expiry,
            p_stripe_subscription_id
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to cancel subscription
CREATE OR REPLACE FUNCTION cancel_subscription(p_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_subscription
    SET 
        subscription_status = 'CANCELLED',
        updated_at = NOW()
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get subscription status
CREATE OR REPLACE FUNCTION get_subscription_status(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_subscription RECORD;
    v_plan RECORD;
    v_usage_this_month INTEGER;
    v_result JSONB;
BEGIN
    -- Get subscription
    SELECT * INTO v_subscription
    FROM user_subscription
    WHERE user_id = p_user_id;

    -- If no subscription, return FREE tier defaults
    IF NOT FOUND THEN
        PERFORM initialize_user_subscription(p_user_id);
        SELECT * INTO v_subscription
        FROM user_subscription
        WHERE user_id = p_user_id;
    END IF;

    -- Get plan details
    SELECT * INTO v_plan
    FROM subscription_plan
    WHERE tier = v_subscription.subscription_tier;

    -- Get usage this month
    SELECT COUNT(*) INTO v_usage_this_month
    FROM subscription_usage_log
    WHERE user_id = p_user_id
      AND action_type IN ('REPORT', 'DEEP_SEARCH')
      AND created_at >= DATE_TRUNC('month', NOW());

    -- Build result JSON
    v_result := jsonb_build_object(
        'tier', v_subscription.subscription_tier,
        'status', v_subscription.subscription_status,
        'expiryDate', v_subscription.subscription_expiry,
        'monthlyReportsUsed', v_subscription.monthly_reports_used,
        'monthlyReportsLimit', v_subscription.monthly_reports_limit,
        'reportsRemaining', GREATEST(v_subscription.monthly_reports_limit - v_subscription.monthly_reports_used, 0),
        'usageThisMonth', v_usage_this_month,
        'plan', jsonb_build_object(
            'name', v_plan.name,
            'description', v_plan.description,
            'priceMonthly', v_plan.price_monthly,
            'priceYearly', v_plan.price_yearly,
            'features', v_plan.features
        )
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to initialize subscription on user creation
CREATE OR REPLACE FUNCTION trigger_initialize_subscription()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM initialize_user_subscription(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This trigger would need to be created on auth.users table
-- which requires superuser access. Instead, we'll initialize on first access.
