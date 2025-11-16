# Remaining Implementation Tasks

## Overview
This document tracks the remaining work to complete the mobile features integration into the web app.

**Current Progress**: ~50% complete
- ✅ Database migrations (4 files)
- ✅ TypeScript types (4 files)  
- ✅ API routes (8 endpoints)
- ✅ Community components (5 components)
- ✅ ScoreBreakdown component
- ✅ EventTimeline component

---

## Task 1: ClaimProfileButton Component ⏳

**File**: `src/components/transparency/ClaimProfileButton.tsx`

**Description**: Button and modal for influencers to claim their profiles

**Features**:
- Button with 3 states: "Claim Profile", "Pending Review", "Verified"
- Modal with proof submission form
- Check existing claim status on mount
- Submit claim with proof (URL, text, type)
- Authentication required
- Success/error handling

**API Endpoints**:
- GET `/api/transparency/claim?influencerId=X` - Check status
- POST `/api/transparency/claim` - Submit claim

**Props**:
```typescript
interface ClaimProfileButtonProps {
  influencerId: string;
  influencerName: string;
  onSuccess?: () => void;
}
```

**Estimated Lines**: ~250

---

## Task 2: UserStatsWidget Component ⏳

**File**: `src/components/gamification/UserStatsWidget.tsx`

**Description**: Display user's gamification stats (XP, level, achievements)

**Features**:
- Show current level with badge
- XP progress bar to next level
- Display streak with fire icon
- Show total contributions (ratings, reports, comments)
- Display unlocked achievements count
- Link to achievements page
- Fetch from API on mount
- Loading and error states

**API Endpoints**:
- GET `/api/gamification/stats` - Get user stats

**Props**:
```typescript
interface UserStatsWidgetProps {
  userId?: string; // Optional, defaults to current user
  compact?: boolean; // Compact view for header
}
```

**Estimated Lines**: ~200

---

## Task 3: LeaderboardTabs Component ⏳

**File**: `src/components/gamification/LeaderboardTabs.tsx`

**Description**: Tabbed interface for viewing different leaderboards

**Features**:
- 6 tabs: Top Rated, Most Improved, Highest Risk, Trending, Top Contributors, Active Users
- Period selector: Daily, Weekly, Monthly, All Time
- Display rankings with medals (🥇🥈🥉) for top 3
- Show rank, name, score, change indicator
- Fetch data when tab/period changes
- Loading skeleton for each tab
- Empty state
- Click to view influencer/user profile

**API Endpoints**:
- GET `/api/leaderboards/[type]?period=X` - Get leaderboard data

**Props**:
```typescript
interface LeaderboardTabsProps {
  defaultType?: LeaderboardType;
  defaultPeriod?: LeaderboardPeriod;
}
```

**Estimated Lines**: ~300

---

## Task 4: AchievementCard Component ⏳

**File**: `src/components/gamification/AchievementCard.tsx`

**Description**: Display a single achievement with progress

**Features**:
- Show achievement icon, name, description
- Display current level (Bronze/Silver/Gold/Platinum)
- Progress bar if not fully unlocked
- Show unlock date if unlocked
- Locked/unlocked visual states
- Badge color based on level
- Tooltip with details

**Props**:
```typescript
interface AchievementCardProps {
  achievement: UserAchievement;
  definition: Achievement; // From ACHIEVEMENTS constant
}
```

**Estimated Lines**: ~150

---

## Task 5: SubscriptionBanner Component ⏳

**File**: `src/components/subscription/SubscriptionBanner.tsx`

**Description**: Display subscription usage and upgrade prompts

**Features**:
- Show current tier (FREE/PREMIUM/PROFESSIONAL)
- Display usage meter (reports used / limit)
- Warning states:
  - Info: Normal usage
  - Warning: 80% used (yellow)
  - Error: 100% used (red)
- Upgrade button (links to /pricing)
- Dismissible (stores in localStorage)
- Fetch subscription status on mount
- Auto-refresh on usage changes

**API Endpoints**:
- GET `/api/subscription/status` - Get subscription info

**Props**:
```typescript
interface SubscriptionBannerProps {
  showAlways?: boolean; // Show even if not near limit
  compact?: boolean; // Compact view
}
```

**Estimated Lines**: ~200

---

## Task 6: Integrate Components into Influencer Detail Page ⏳

**File**: `src/app/influencers/[id]/page.tsx`

**Changes Needed**:

### 6.1 Add Imports
```typescript
import RatingModal from '@/components/community/RatingModal';
import CommunityStats from '@/components/community/CommunityStats';
import CommunitySignals from '@/components/community/CommunitySignals';
import CommunityVoting from '@/components/community/CommunityVoting';
import ScoreBreakdown from '@/components/transparency/ScoreBreakdown';
import EventTimeline from '@/components/transparency/EventTimeline';
import ClaimProfileButton from '@/components/transparency/ClaimProfileButton';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
```

### 6.2 Add State for Modals
```typescript
const [showRatingModal, setShowRatingModal] = useState(false);
const [showVotingModal, setShowVotingModal] = useState(false);
const [votingType, setVotingType] = useState<'DRAMA_REPORT' | 'POSITIVE_ACTION'>('DRAMA_REPORT');
```

### 6.3 Add Subscription Banner (after header, before content)

### 6.4 Add "Rate This Influencer" Button (in profile header section)

### 6.5 Add Community Section (after Performance Metrics)
- CommunityStats component
- Tab navigation: All Signals, Ratings, Drama Reports, Positive Actions
- CommunitySignals with filter
- Voting buttons (Report Drama / Report Positive)

### 6.6 Add Transparency Section (after Community)
- Tabs: Score Breakdown, Event Timeline
- ScoreBreakdown component
- EventTimeline component

### 6.7 Replace "Claim This Profile" Button
- Use ClaimProfileButton component instead of placeholder

### 6.8 Add Modals at Bottom
- RatingModal
- CommunityVoting modal

**Estimated Changes**: ~150 lines added

---

## Task 7: Create Leaderboards Page ⏳

**File**: `src/app/leaderboards/page.tsx`

**Description**: Full page for viewing leaderboards

**Features**:
- Page title and description
- Use LeaderboardTabs component
- Responsive layout
- Authentication optional (public page)
- SEO metadata

**Estimated Lines**: ~100

---

## Task 8: Create Profile Page ⏳

**File**: `src/app/profile/page.tsx`

**Description**: User profile page with stats and history

**Features**:
- Require authentication (redirect if not logged in)
- Display user info (name, email, join date)
- UserStatsWidget component
- Contribution history list
- Link to achievements page
- Edit profile button (future)

**Estimated Lines**: ~150

---

## Task 9: Create Achievements Page ⏳

**File**: `src/app/achievements/page.tsx`

**Description**: Display all user achievements

**Features**:
- Require authentication
- Grid of AchievementCard components
- Filter: All, Unlocked, Locked
- Sort by: Progress, Date Unlocked, XP Reward
- Fetch user achievements from API
- Show total XP earned from achievements

**Estimated Lines**: ~200

---

## Task 10: Run Database Migrations ⏳

**Steps**:
1. Open Supabase Dashboard → SQL Editor
2. Run migrations in order:
   - `supabase/migrations/001_community_features.sql`
   - `supabase/migrations/002_gamification.sql`
   - `supabase/migrations/003_transparency.sql`
   - `supabase/migrations/004_subscriptions.sql`
3. Verify tables created (14 tables)
4. Verify functions created (11 functions)
5. Verify RLS policies enabled
6. Test with sample data

**Reference**: See `MIGRATION_GUIDE.md` for detailed instructions

---

## Task 11: Browser Testing ⏳

**Test Cases**:

### Community Features
- [ ] Submit rating (1-5 stars with comment)
- [ ] View community stats
- [ ] View community signals
- [ ] Submit drama report
- [ ] Submit positive action report
- [ ] Filter signals by type

### Transparency Features
- [ ] View score breakdown
- [ ] View event timeline
- [ ] Submit claim request
- [ ] Check claim status

### Gamification
- [ ] View user stats widget
- [ ] Check XP and level display
- [ ] View leaderboards (all types)
- [ ] View achievements
- [ ] Check achievement progress

### Subscription
- [ ] View subscription status
- [ ] Check usage limits
- [ ] See upgrade prompts
- [ ] Test tier restrictions

### General
- [ ] Mobile responsiveness
- [ ] Dark mode toggle
- [ ] Authentication flow
- [ ] Error handling
- [ ] Loading states

---

## Task 12: Bug Fixes and Polish ⏳

**Common Issues to Check**:
- TypeScript compilation errors
- Missing imports
- API endpoint errors
- Authentication issues
- RLS policy problems
- Dark mode inconsistencies
- Mobile layout issues
- Performance optimization

---

## Progress Tracking

| Task | Status | Estimated Time | Actual Time |
|------|--------|----------------|-------------|
| 1. ClaimProfileButton | ⏳ Pending | 30 min | - |
| 2. UserStatsWidget | ⏳ Pending | 30 min | - |
| 3. LeaderboardTabs | ⏳ Pending | 45 min | - |
| 4. AchievementCard | ⏳ Pending | 20 min | - |
| 5. SubscriptionBanner | ⏳ Pending | 30 min | - |
| 6. Integrate Detail Page | ⏳ Pending | 45 min | - |
| 7. Leaderboards Page | ⏳ Pending | 20 min | - |
| 8. Profile Page | ⏳ Pending | 30 min | - |
| 9. Achievements Page | ⏳ Pending | 30 min | - |
| 10. Run Migrations | ⏳ Pending | 30 min | - |
| 11. Browser Testing | ⏳ Pending | 60 min | - |
| 12. Bug Fixes | ⏳ Pending | 60 min | - |
| **Total** | | **~7 hours** | |

---

## How to Use This Document

1. **Pick a task** from the list above
2. **Ask me to implement it** by saying: "Implement Task X" or "Create [component name]"
3. **I will break it down** into smaller steps if needed
4. **I will implement** the component/feature
5. **Mark it complete** by updating the status to ✅
6. **Move to next task**

This approach ensures:
- ✅ No token limit issues
- ✅ Focused, manageable tasks
- ✅ Clear progress tracking
- ✅ Easy to resume work

---

## Quick Commands

- "Implement Task 1" → Create ClaimProfileButton
- "Implement Task 2" → Create UserStatsWidget
- "Implement Task 3" → Create LeaderboardTabs
- "Implement Task 4" → Create AchievementCard
- "Implement Task 5" → Create SubscriptionBanner
- "Implement Task 6" → Integrate into detail page
- "Implement Task 7" → Create leaderboards page
- "Implement Task 8" → Create profile page
- "Implement Task 9" → Create achievements page
- "Run migrations" → Execute database migrations
- "Test features" → Browser testing
- "Fix bugs" → Bug fixes and polish

---

## Notes

- All components use TypeScript with proper types
- All components support dark mode
- All components are mobile responsive
- All components use Tailwind CSS
- All components use Heroicons for icons
- All modals use Headless UI
- All dates use date-fns for formatting
- All API calls include error handling
- All forms include validation
- All protected routes check authentication
