# Database Migration Guide

This guide will help you run the database migrations to add mobile app features to the web application.

## Prerequisites

- Supabase project set up
- Database connection credentials
- Supabase CLI installed (optional but recommended)

## Option 1: Using Supabase Dashboard (Recommended for beginners)

### Step 1: Access SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run Migrations in Order

Run each migration file in the following order. Copy the entire content of each file and execute it:

#### Migration 1: Community Features
```sql
-- Copy and paste content from:
supabase/migrations/001_community_features.sql
```
**What this adds:**
- Community signal table (ratings, reports, comments)
- Community trust score aggregation
- Influencer response system
- Response voting
- Automatic score calculation functions

#### Migration 2: Gamification System
```sql
-- Copy and paste content from:
supabase/migrations/002_gamification.sql
```
**What this adds:**
- User engagement stats (XP, levels, streaks)
- Achievement system
- Leaderboard caching
- Trending influencer tracking
- XP award functions

#### Migration 3: Transparency Features
```sql
-- Copy and paste content from:
supabase/migrations/003_transparency.sql
```
**What this adds:**
- Score impact logging
- Claim request system
- Review request system
- Event timeline functions
- Score breakdown functions

#### Migration 4: Subscription System
```sql
-- Copy and paste content from:
supabase/migrations/004_subscriptions.sql
```
**What this adds:**
- User subscription management
- Subscription plans
- Usage tracking
- Subscription helper functions

### Step 3: Verify Migrations

After running all migrations, verify the tables were created:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'community_signal',
  'community_trust_score',
  'influencer_response',
  'response_vote',
  'user_engagement_stats',
  'user_achievement',
  'leaderboard_cache',
  'trending_influencer',
  'score_impact_log',
  'claim_request',
  'review_request',
  'user_subscription',
  'subscription_plan',
  'subscription_usage_log'
);
```

You should see 14 tables listed.

### Step 4: Verify Functions

Check if all database functions were created:

```sql
-- List all custom functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
AND routine_name IN (
  'calculate_community_score',
  'update_community_trust_score',
  'award_xp',
  'check_achievements',
  'update_user_streak',
  'log_score_impact',
  'get_event_timeline',
  'get_score_breakdown',
  'get_subscription_status',
  'can_user_perform_action',
  'log_subscription_usage'
);
```

### Step 5: Verify RLS Policies

Check if Row Level Security is enabled:

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'community_signal',
  'community_trust_score',
  'user_engagement_stats',
  'user_subscription'
);
```

All tables should have `rowsecurity = true`.

## Option 2: Using Supabase CLI

### Step 1: Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Linux
curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh

# Windows (PowerShell)
scoop install supabase
```

### Step 2: Link to Your Project

```bash
cd influencer-web
supabase link --project-ref YOUR_PROJECT_REF
```

### Step 3: Push Migrations

```bash
supabase db push
```

This will automatically run all migration files in the `supabase/migrations/` directory.

### Step 4: Verify

```bash
supabase db diff
```

Should show no differences if migrations were successful.

## Option 3: Using psql (Advanced)

If you have direct PostgreSQL access:

```bash
# Connect to your database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run migrations
\i supabase/migrations/001_community_features.sql
\i supabase/migrations/002_gamification.sql
\i supabase/migrations/003_transparency.sql
\i supabase/migrations/004_subscriptions.sql
```

## Post-Migration Setup

### 1. Verify Subscription Plans

Check if default subscription plans were created:

```sql
SELECT * FROM subscription_plan;
```

You should see 3 plans: FREE, PREMIUM, PROFESSIONAL.

### 2. Test Community Signal Creation

Try creating a test signal:

```sql
-- Replace USER_ID and INFLUENCER_ID with actual UUIDs
INSERT INTO community_signal (
  user_id,
  influencer_id,
  type,
  rating,
  comment,
  status
) VALUES (
  'YOUR_USER_ID',
  'YOUR_INFLUENCER_ID',
  'RATING',
  5,
  'Test rating',
  'VERIFIED'
);

-- Check if trust score was updated
SELECT * FROM community_trust_score 
WHERE influencer_id = 'YOUR_INFLUENCER_ID';
```

### 3. Test XP Award Function

```sql
-- Award XP to a user
SELECT award_xp(
  'YOUR_USER_ID'::uuid,
  10,
  'RATING'
);

-- Check user stats
SELECT * FROM user_engagement_stats 
WHERE user_id = 'YOUR_USER_ID';
```

### 4. Test Score Breakdown Function

```sql
-- Get score breakdown for an influencer
SELECT get_score_breakdown('YOUR_INFLUENCER_ID'::uuid);
```

## Troubleshooting

### Error: "relation already exists"

If you see this error, it means the table already exists. You can either:
1. Drop the existing table: `DROP TABLE table_name CASCADE;`
2. Skip that part of the migration

### Error: "function already exists"

```sql
-- Drop the function and recreate
DROP FUNCTION IF EXISTS function_name CASCADE;
```

### Error: "permission denied"

Make sure you're using the service role key or have sufficient permissions.

### RLS Policies Not Working

Check if RLS is enabled:

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Triggers Not Firing

Verify triggers exist:

```sql
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## Rollback (If Needed)

If you need to rollback the migrations:

```sql
-- Drop all new tables (WARNING: This will delete all data!)
DROP TABLE IF EXISTS subscription_usage_log CASCADE;
DROP TABLE IF EXISTS subscription_plan CASCADE;
DROP TABLE IF EXISTS user_subscription CASCADE;
DROP TABLE IF EXISTS review_request CASCADE;
DROP TABLE IF EXISTS claim_request CASCADE;
DROP TABLE IF EXISTS score_impact_log CASCADE;
DROP TABLE IF EXISTS trending_influencer CASCADE;
DROP TABLE IF EXISTS leaderboard_cache CASCADE;
DROP TABLE IF EXISTS user_achievement CASCADE;
DROP TABLE IF EXISTS user_engagement_stats CASCADE;
DROP TABLE IF EXISTS response_vote CASCADE;
DROP TABLE IF EXISTS influencer_response CASCADE;
DROP TABLE IF EXISTS community_trust_score CASCADE;
DROP TABLE IF EXISTS community_signal CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS calculate_community_score CASCADE;
DROP FUNCTION IF EXISTS update_community_trust_score CASCADE;
DROP FUNCTION IF EXISTS award_xp CASCADE;
DROP FUNCTION IF EXISTS check_achievements CASCADE;
DROP FUNCTION IF EXISTS update_user_streak CASCADE;
DROP FUNCTION IF EXISTS log_score_impact CASCADE;
DROP FUNCTION IF EXISTS get_event_timeline CASCADE;
DROP FUNCTION IF EXISTS get_score_breakdown CASCADE;
DROP FUNCTION IF EXISTS get_subscription_status CASCADE;
DROP FUNCTION IF EXISTS can_user_perform_action CASCADE;
DROP FUNCTION IF EXISTS log_subscription_usage CASCADE;
```

## Next Steps

After successful migration:

1. ✅ Update your `.env` file with Supabase credentials
2. ✅ Run `npm install` to ensure all dependencies are installed
3. ✅ Run `npm run build` to verify TypeScript compilation
4. ✅ Run `npm run dev` to start the development server
5. ✅ Test the API endpoints using the browser or Postman
6. ✅ Integrate components into your pages

## Testing Checklist

- [ ] All 14 tables created successfully
- [ ] All 11 functions created successfully
- [ ] RLS policies enabled on all tables
- [ ] Triggers created and firing correctly
- [ ] Default subscription plans inserted
- [ ] Test signal creation works
- [ ] Test XP award function works
- [ ] Test score calculation works
- [ ] API routes return 200 status
- [ ] Authentication works with API routes

## Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Review the migration files for syntax errors
3. Verify your PostgreSQL version (should be 14+)
4. Check the IMPLEMENTATION_STATUS.md file for known issues

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
