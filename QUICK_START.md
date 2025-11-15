# 🚀 Quick Start Guide - InfluenceTracker

## Get Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
cd influencer-app
npm install
```

### 2️⃣ Start Development Server
```bash
npm run dev
```

### 3️⃣ Open in Browser
Open [http://localhost:3000](http://localhost:3000)

---

## ✅ What's Working Now

### Current Features (with Mock Data)
- ✅ **Dashboard** - Overview with stats, top performers, recent activity
- ✅ **Mock Data** - 10 realistic influencer profiles
- ✅ **API Layer** - Ready for backend integration (see TODO comments)
- ✅ **Responsive Design** - Mobile-first layout
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Utility-first styling

### Pages Ready to Build
- `/` - Dashboard (✅ DONE)
- `/influencers` - Influencer list (TODO)
- `/influencers/[id]` - Influencer detail (TODO)
- `/rankings` - Leaderboard (TODO)
- `/qr/scan` - QR scanner (TODO)
- `/qr/help` - QR help (TODO)
- `/profile` - User profile (TODO)
- `/admin` - Admin panel (TODO)

---

## 🎯 Next Steps

### Phase 1: Complete Core Pages (Priority)
1. **Influencers List Page** (`/influencers`)
   - Table/grid view toggle
   - Search and filters
   - Sort options
   - Pagination

2. **Influencer Detail Page** (`/influencers/[id]`)
   - Full profile
   - Metrics and charts
   - Activity timeline

3. **Rankings Page** (`/rankings`)
   - Leaderboard table
   - Rank changes
   - Score breakdown

### Phase 2: Add Navigation
1. **Sidebar** (desktop)
   - Logo
   - Navigation links
   - User menu

2. **Mobile Bottom Nav** (mobile)
   - Home, Influencers, Rankings, QR, Profile
   - Active state indicators

3. **Header**
   - Search bar
   - Notifications
   - User avatar

### Phase 3: QR Features
1. **QR Scanner** (`/qr/scan`)
   - Camera access
   - QR code detection
   - Manual entry fallback

2. **QR Help** (`/qr/help`)
   - Instructions
   - Sample QR codes
   - Troubleshooting

### Phase 4: User Features
1. **Profile Page** (`/profile`)
   - User info
   - Settings
   - Preferences

2. **Admin Panel** (`/admin`)
   - Manage influencers
   - Configure scoring
   - View logs

---

## 🔌 Connecting to Your Backend

All API calls are in `src/lib/services/api.ts` with **TODO comments**.

### Example: Replace Mock Data with Real API

**Find this in `api.ts`:**
```typescript
export async function fetchInfluencers() {
  await delay(500); // Simulate network delay
  
  // TODO: Replace with real API call
  // const response = await fetch('/api/influencers');
  // return response.json();
  
  return MOCK_INFLUENCERS; // Using mock data
}
```

**Replace with:**
```typescript
export async function fetchInfluencers() {
  const response = await fetch('https://your-api.com/api/influencers', {
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

### API Endpoints Needed

| Function | Endpoint | Method |
|----------|----------|--------|
| `fetchInfluencers()` | `/api/influencers` | GET |
| `fetchInfluencerById(id)` | `/api/influencers/:id` | GET |
| `createInfluencer(data)` | `/api/influencers` | POST |
| `updateInfluencer(id, data)` | `/api/influencers/:id` | PUT |
| `deleteInfluencer(id)` | `/api/influencers/:id` | DELETE |
| `fetchRankings()` | `/api/rankings` | GET |
| `fetchQRScans()` | `/api/qr-scans` | GET |
| `createQRScan(data)` | `/api/qr-scans` | POST |
| `fetchEvents()` | `/api/events` | GET |
| `fetchAnalytics()` | `/api/analytics` | GET |
| `searchInfluencers(query)` | `/api/search?q=` | GET |

---

## 📁 Project Structure

```
influencer-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Dashboard ✅
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/
│   │   │   └── Button.tsx      # Button component ✅
│   │   ├── layout/             # Navigation (TODO)
│   │   ├── influencer/         # Influencer components (TODO)
│   │   ├── rankings/           # Ranking components (TODO)
│   │   └── qr/                 # QR components (TODO)
│   ├── lib/
│   │   ├── services/
│   │   │   ├── api.ts          # API layer ✅
│   │   │   └── mockData.ts     # Mock data ✅
│   │   ├── hooks/              # Custom hooks (TODO)
│   │   └── utils/
│   │       └── index.ts        # Utilities ✅
│   └── types/
│       └── index.ts            # TypeScript types ✅
└── public/                     # Static assets
```

---

## 🎨 Design System

### Colors
```typescript
Primary (Indigo): #4F46E5
Secondary (Emerald): #10B981
Accent (Amber): #F59E0B
```

### Components Available
- ✅ `Button` - Primary, secondary, success, danger, ghost
- TODO: `Card`, `Input`, `Select`, `Modal`, `Toast`, `Badge`, `Avatar`

### Utilities
- ✅ `formatNumber()` - 1000 → 1K
- ✅ `formatPercentage()` - 8.5 → 8.5%
- ✅ `formatRelativeTime()` - "2 hours ago"
- ✅ `getTierColor()`, `getStatusColor()`, `getPlatformColor()`

---

## 🧪 Testing the Dashboard

1. **Start the dev server**: `npm run dev`
2. **Open**: http://localhost:3000
3. **You should see**:
   - 4 stat cards (Total Influencers, Followers, Engagement, Top Performers)
   - Top 5 performers grid
   - Recent activity feed
   - Quick action buttons

4. **Check the console**: You'll see mock data being loaded

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors
Check `src/types/index.ts` for type definitions

---

## 📚 Resources

- **Full README**: See `README.md` for complete documentation
- **Mock Data**: Check `src/lib/services/mockData.ts`
- **API Layer**: See `src/lib/services/api.ts`
- **Types**: Review `src/types/index.ts`

---

## 🎯 Your Mission

1. ✅ Get the dashboard running
2. 🔨 Build the remaining pages
3. 🎨 Add navigation components
4. 🔌 Connect to your real backend
5. 🚀 Deploy and test

**The foundation is ready. Now build the rest!** 💪
