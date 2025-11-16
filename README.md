# 🎯 Trust Influencer - Influencer Monitoring Dashboard

A modern, mobile-first dashboard for tracking and managing influencer performance, rankings, and event check-ins.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📁 Project Structure

```
influencer-app/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Dashboard (/)
│   │   ├── influencers/          # Influencer list & detail
│   │   ├── rankings/             # Leaderboard
│   │   ├── qr/                   # QR scanner & help
│   │   ├── profile/              # User profile
│   │   └── admin/                # Admin panel
│   ├── components/
│   │   ├── layout/               # Navigation, Sidebar, MobileNav
│   │   ├── ui/                   # Reusable UI components
│   │   ├── influencer/           # Influencer-specific components
│   │   ├── rankings/             # Ranking components
│   │   └── qr/                   # QR scanner components
│   ├── lib/
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API service layer
│   │   │   ├── api.ts            # API functions (with TODO markers)
│   │   │   └── mockData.ts       # Mock data for testing
│   │   └── utils/                # Utility functions
│   ├── types/                    # TypeScript type definitions
│   └── styles/                   # Global styles
├── public/                       # Static assets
└── package.json
```

---

## 🎨 Design System

### Colors
- **Primary (Indigo)**: Main actions, links, highlights
- **Secondary (Emerald)**: Success states, positive metrics
- **Accent (Amber)**: Warnings, highlights
- **Neutral (Gray)**: Text, backgrounds, borders

### Typography
- **Headings**: Plus Jakarta Sans (bold)
- **Body**: Inter (regular, medium, semibold)
- **Sizes**: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 40px

### Spacing
- **Base unit**: 4px (0.25rem)
- **Scale**: 4, 8, 12, 16, 24, 32, 48, 64px

---

## 📱 Pages & Features

### 1. Dashboard (/)
**Features:**
- Overview stats (total influencers, followers, engagement)
- Top performers grid
- Recent activity feed
- Growth trend chart
- Quick actions

**Components:**
- `StatsCard` - Metric display cards
- `TopPerformersGrid` - Featured influencers
- `ActivityFeed` - Recent events
- `GrowthChart` - Line chart with Recharts

### 2. Influencers (/influencers)
**Features:**
- Searchable influencer list
- Advanced filters (platform, category, tier, followers)
- Sortable table/grid view
- Pagination or infinite scroll
- Quick actions (view, edit, delete)

**Components:**
- `InfluencerTable` - Data table view
- `InfluencerCard` - Grid card view
- `SearchBar` - Search input with debounce
- `FilterPanel` - Advanced filtering
- `SortDropdown` - Sort options

### 3. Influencer Detail (/influencers/[id])
**Features:**
- Full profile information
- Detailed metrics and scores
- Engagement history chart
- Recent posts
- Activity timeline
- Edit/manage actions

**Components:**
- `ProfileHeader` - Avatar, name, stats
- `MetricsGrid` - Score breakdown
- `EngagementChart` - Historical data
- `PostsGrid` - Recent content
- `ActivityTimeline` - Event history

### 4. Rankings (/rankings)
**Features:**
- Leaderboard view
- Rank changes (up/down/stable)
- Score breakdown
- Filter by category/platform
- Export rankings

**Components:**
- `LeaderboardTable` - Ranked list
- `RankBadge` - Position indicator
- `TrendIndicator` - Up/down arrows
- `ScoreBreakdown` - Score components

### 5. QR Scanner (/qr/scan)
**Features:**
- Camera access for QR scanning
- Manual code entry
- Scan history
- Success/error feedback
- Event verification

**Components:**
- `QRScanner` - Camera interface
- `ScanResult` - Success/error display
- `ManualEntry` - Text input fallback
- `ScanHistory` - Recent scans

### 6. QR Help (/qr/help)
**Features:**
- Instructions for QR usage
- Sample QR codes
- Troubleshooting guide
- FAQ section

### 7. Profile (/profile)
**Features:**
- User information
- Notification preferences
- Theme settings
- Account management

**Components:**
- `ProfileForm` - Edit user info
- `PreferencesPanel` - Settings
- `ThemeToggle` - Light/dark mode

### 8. Admin (/admin) [Optional]
**Features:**
- Add/edit/delete influencers
- Manage events
- Configure scoring rules
- View system logs

---

## 🔌 API Integration Guide

All API calls are in `src/lib/services/api.ts` with **TODO comments** marking where to replace mock data with real API calls.

### Example: Fetching Influencers

**Current (Mock Data):**
```typescript
export async function fetchInfluencers() {
  await delay(500);
  return MOCK_INFLUENCERS;
}
```

**Replace with Real API:**
```typescript
export async function fetchInfluencers() {
  const response = await fetch('/api/influencers', {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch influencers');
  }
  
  return response.json();
}
```

### API Endpoints to Implement

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `fetchInfluencers()` | GET | `/api/influencers` | Get all influencers with filters |
| `fetchInfluencerById(id)` | GET | `/api/influencers/:id` | Get single influencer |
| `createInfluencer(data)` | POST | `/api/influencers` | Create new influencer |
| `updateInfluencer(id, data)` | PUT | `/api/influencers/:id` | Update influencer |
| `deleteInfluencer(id)` | DELETE | `/api/influencers/:id` | Delete influencer |
| `fetchRankings()` | GET | `/api/rankings` | Get current rankings |
| `fetchQRScans()` | GET | `/api/qr-scans` | Get QR scan history |
| `createQRScan(data)` | POST | `/api/qr-scans` | Record new QR scan |
| `fetchEvents()` | GET | `/api/events` | Get all events |
| `fetchAnalytics()` | GET | `/api/analytics` | Get dashboard analytics |
| `searchInfluencers(query)` | GET | `/api/search?q=` | Search influencers |

---

## 🎣 Custom Hooks

### useInfluencers
```typescript
const { influencers, loading, error, refetch } = useInfluencers(filters, sort);
```

### useRankings
```typescript
const { rankings, loading, error } = useRankings();
```

### useQRScanner
```typescript
const { scan, scanning, result, error } = useQRScanner();
```

### useSearch
```typescript
const { results, search, loading } = useSearch();
```

---

## 🧩 Key Components

### UI Components (`src/components/ui/`)
- `Button` - Primary, secondary, success, danger variants
- `Card` - Container with shadow and border
- `Input` - Text input with validation states
- `Select` - Dropdown select
- `Modal` - Dialog overlay
- `Toast` - Notification messages
- `Badge` - Status indicators
- `Avatar` - User/influencer images
- `Spinner` - Loading indicator
- `Skeleton` - Loading placeholder
- `Tabs` - Tab navigation
- `Dropdown` - Menu dropdown

### Layout Components (`src/components/layout/`)
- `Sidebar` - Desktop navigation (hidden on mobile)
- `MobileNav` - Bottom navigation bar (mobile only)
- `Header` - Top bar with search and user menu
- `PageHeader` - Page title and actions
- `Container` - Content wrapper

### Influencer Components (`src/components/influencer/`)
- `InfluencerCard` - Grid view card
- `InfluencerRow` - Table row
- `InfluencerStats` - Metrics display
- `InfluencerAvatar` - Profile image with platform badge
- `FollowerCount` - Formatted follower number
- `EngagementRate` - Percentage display
- `TierBadge` - Platinum/Gold/Silver/Bronze

### Ranking Components (`src/components/rankings/`)
- `LeaderboardRow` - Ranked item
- `RankBadge` - Position number
- `TrendArrow` - Up/down indicator
- `ScoreBar` - Progress bar for scores

---

## 📊 Mock Data

All mock data is in `src/lib/services/mockData.ts`:

- **10 Influencers** with realistic profiles
- **Rankings** derived from influencer scores
- **QR Scans** with event check-ins
- **Events** (upcoming and past)
- **Analytics** with aggregated metrics
- **Activities** for recent events feed

---

## 🎯 Mobile-First Design

### Responsive Breakpoints
- **Mobile**: < 768px (default)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Bottom navigation bar (fixed)
- Hamburger menu for secondary nav
- Touch-friendly tap targets (min 44px)
- Swipe gestures for cards
- Pull-to-refresh on lists
- Optimized images for mobile

### Desktop Features
- Sidebar navigation (fixed)
- Multi-column layouts
- Hover states
- Keyboard shortcuts
- Larger data tables

---

## 🔧 Utilities

### Formatting Functions (`src/lib/utils/`)
- `formatNumber(num)` - 1000 → 1K, 1000000 → 1M
- `formatPercentage(num)` - 8.5 → 8.5%
- `formatRelativeTime(date)` - "2 hours ago"
- `formatDate(date)` - "Nov 15, 2024"
- `formatDateTime(date)` - "Nov 15, 2024, 2:30 PM"

### Helper Functions
- `getTierColor(tier)` - Returns Tailwind classes
- `getStatusColor(status)` - Returns Tailwind classes
- `getPlatformColor(platform)` - Returns Tailwind classes
- `calculateGrowth(current, previous)` - Growth percentage
- `truncate(text, length)` - Truncate with ellipsis
- `debounce(func, wait)` - Debounce function calls

---

## 🧪 Testing Checklist

### Navigation
- [ ] Sidebar navigation works on desktop
- [ ] Mobile bottom nav works on mobile
- [ ] All links navigate correctly
- [ ] Active page is highlighted

### Dashboard
- [ ] Stats cards display correct data
- [ ] Top performers grid renders
- [ ] Activity feed shows recent events
- [ ] Growth chart displays

### Influencers
- [ ] List view displays all influencers
- [ ] Search filters results
- [ ] Filters work (platform, category, tier)
- [ ] Sort options work
- [ ] Click influencer opens detail page

### Influencer Detail
- [ ] Profile information displays
- [ ] Metrics and scores show
- [ ] Charts render correctly
- [ ] Back button works

### Rankings
- [ ] Leaderboard displays in order
- [ ] Rank changes show (up/down arrows)
- [ ] Scores display correctly
- [ ] Filters work

### QR Scanner
- [ ] Camera permission requested
- [ ] QR code scanning works (use test QR)
- [ ] Manual entry works
- [ ] Success message displays
- [ ] Scan history shows

### Profile
- [ ] User info displays
- [ ] Settings can be changed
- [ ] Save button works

### Responsive Design
- [ ] Mobile (375px) - All content readable
- [ ] Tablet (768px) - Layout adjusts
- [ ] Desktop (1440px) - Full layout
- [ ] Bottom nav shows on mobile only
- [ ] Sidebar shows on desktop only

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_APP_NAME=TrustInfluencer
```

---

## 📦 PWA Configuration

To make the app installable:

1. Add `manifest.json` to `/public`
2. Add service worker
3. Configure in `next.config.ts`
4. Test with Lighthouse

---

## 🎨 Customization

### Change Brand Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    // Your brand color
  }
}
```

### Change App Name
Edit throughout the app and in `package.json`

### Add New Page
1. Create folder in `src/app/`
2. Add `page.tsx`
3. Update navigation in `Sidebar` and `MobileNav`

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Build Errors
```bash
rm -rf .next
npm run build
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Charts**: Recharts
- **State**: React Context + Hooks
- **Date Handling**: date-fns

---

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

---

## 📄 License

Proprietary and confidential.

---

**Built with ❤️ for Influencer Tracking**
# hp-gap
