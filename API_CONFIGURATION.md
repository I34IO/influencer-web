# API Configuration Guide

## Overview

This application uses **direct Supabase database connection**:
- Frontend calls Supabase client directly from the browser
- No proxy API routes (except for authentication)
- Real-time data access with Supabase

## Architecture

```
┌─────────────┐      ┌─────────────────┐
│   Browser   │─────▶│    Supabase     │
│  (Frontend) │      │    Database     │
└─────────────┘      └─────────────────┘
```

## Environment Variables

### Required

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

### Optional

- `DATABASE_URL` - Direct PostgreSQL connection (if needed)
- `NEXT_PUBLIC_API_TIMEOUT` - API request timeout in milliseconds (default: 10000)
- `NEXT_PUBLIC_API_DEBUG` - Enable API debug logging (default: false)

## Database Tables

The application uses the following Supabase tables:

| Table | Description |
|-------|-------------|
| `Influencer` | Main influencer data |
| `Mention` | Social media mentions |
| `AnalysisHistory` | Historical trust score data |
| `User` | User accounts |
| `CommunitySignal` | Community ratings and reports |
| `CommunityTrustScore` | Aggregated community scores |
| `DeepSearchAnalysis` | Deep search analysis results |
| `DeepSearchOrder` | Payment orders |
| `Payment` | Payment transactions |

## API Service Layer

The application provides a service layer in `src/lib/services/api.ts`:

```typescript
import { 
  fetchInfluencers, 
  searchInfluencers, 
  fetchStats,
  createInfluencer,
  updateInfluencer,
  deleteInfluencer
} from '@/lib/services/api';

// Fetch all influencers
const influencers = await fetchInfluencers();

// Search
const results = await searchInfluencers('query');

// Get stats
const stats = await fetchStats();

// Create influencer
const newInfluencer = await createInfluencer({
  fullName: 'John Doe',
  category: 'Tech',
  platform: 'instagram',
});

// Update influencer
await updateInfluencer(id, { fullName: 'Jane Doe' });

// Delete influencer
await deleteInfluencer(id);
```

## Supabase Clients

### Client-Side (Browser)
```typescript
import { supabase } from '@/lib/supabase/client';

// Use for client-side queries
const { data, error } = await supabase
  .from('Influencer')
  .select('*');
```

### Server-Side (API Routes)
```typescript
import { supabaseAdmin } from '@/lib/supabase/server';

// Use for server-side queries (bypasses RLS)
const { data, error } = await supabaseAdmin
  .from('Influencer')
  .select('*');
```

## Authentication API Routes

The following API routes are available for authentication:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Get all users (admin only) |
| `/api/users` | POST | Create new user (registration) |
| `/api/users/[id]` | GET | Get single user |
| `/api/users/[id]/update` | POST | Update user profile |
| `/api/users/[id]/delete` | POST | Delete user (admin only) |

## Testing the Connection

### Test Supabase Connection

Create a test file to verify the connection:

```typescript
// test-supabase.ts
import { supabase } from '@/lib/supabase/client';

async function testConnection() {
  const { data, error } = await supabase
    .from('Influencer')
    .select('count');
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful!', data);
  }
}

testConnection();
```

### Using curl (for auth endpoints)

```bash
# Get all users (requires authentication)
curl https://your-domain.vercel.app/api/users

# Create user
curl -X POST https://your-domain.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## Security Notes

1. ✅ Direct Supabase connection with Row Level Security (RLS)
2. ✅ Service role key only used server-side
3. ✅ Anonymous key safe for client-side use
4. ✅ `.env.local` is in `.gitignore`
5. ✅ No hardcoded credentials in codebase

## Row Level Security (RLS)

Make sure to configure RLS policies in Supabase for:
- Public read access to `Influencer` table
- Authenticated write access for community features
- Admin-only access for user management

Example RLS policy:
```sql
-- Allow public read access to influencers
CREATE POLICY "Public read access" ON "Influencer"
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert community signals
CREATE POLICY "Authenticated insert" ON "CommunitySignal"
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");
```

## Deployment

### Vercel

Set the following environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Other Platforms

Ensure all required environment variables are set before building.

## Migration from Proxy Architecture

The application has been migrated from a proxy architecture to direct Supabase connection:

**Before:**
- Frontend → Next.js API Routes → Backend API → Database

**After:**
- Frontend → Supabase Client → Database

**Benefits:**
- ✅ Faster data access (no proxy overhead)
- ✅ Real-time capabilities with Supabase
- ✅ Simplified architecture
- ✅ Better scalability
- ✅ Built-in authentication with Supabase Auth
