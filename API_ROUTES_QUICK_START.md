# API Routes - Quick Start Guide

## ✅ What Was Created

**11 API routes** based on your PostgreSQL schema with **CORS disabled**.

## 📋 Available Routes

### Influencers
- `GET /api/influencers` - List all influencers
- `POST /api/influencers` - Create influencer
- `GET /api/influencers/[id]` - Get one influencer
- `PUT /api/influencers/[id]` - Update influencer
- `DELETE /api/influencers/[id]` - Delete influencer

### Search & Stats
- `GET /api/search?q=query` - Search influencers
- `GET /api/stats` - Get statistics
- `GET /api/niches` - Get categories

### Mentions
- `GET /api/mentions?influencerId=xxx` - Get mentions
- `POST /api/mentions` - Create mention

### Community
- `GET /api/community-signals?influencerId=xxx` - Get signals
- `POST /api/community-signals` - Create signal

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user (register)
- `GET /api/users/[id]` - Get user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Deep Search
- `GET /api/deep-search?influencerId=xxx` - Get analyses
- `POST /api/deep-search` - Create analysis
- `GET /api/deep-search/[id]` - Get one analysis
- `PUT /api/deep-search/[id]` - Update analysis

## 🧪 Test the Routes

```bash
# Test influencers endpoint
curl http://localhost:3000/api/influencers

# Test stats
curl http://localhost:3000/api/stats

# Test search
curl "http://localhost:3000/api/search?q=test"

# Test niches
curl http://localhost:3000/api/niches

# Test CORS
curl -X OPTIONS http://localhost:3000/api/influencers -v
```

## 🔓 CORS is Disabled

All routes return these headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## ⚠️ Current Status

**Routes are SKELETONS** - They return mock/empty data.

To make them work, you need to:

### 1. Install Database Client

```bash
npm install @supabase/supabase-js
```

### 2. Add Database Credentials

In `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create Database Client

Create `src/lib/db/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 4. Implement Queries

In each route file, replace the `// TODO` comments with actual database queries.

**Example** (`src/app/api/influencers/route.ts`):
```typescript
import { supabase } from '@/lib/db/supabase';

export async function GET(request: NextRequest) {
  const { data, error } = await supabase
    .from('Influencer')
    .select('*')
    .order('trustScore', { ascending: false })
    .limit(20);
  
  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json(
    { success: true, data },
    { headers: { 'Access-Control-Allow-Origin': '*' } }
  );
}
```

## 📊 Response Format

All routes use consistent format:

**Success:**
```json
{
  "success": true,
  "data": [ /* your data */ ]
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔐 Security Notes

⚠️ **Current state is NOT production-ready!**

Missing:
- ❌ Authentication
- ❌ Authorization
- ❌ Rate limiting
- ❌ Input validation
- ❌ SQL injection protection (use parameterized queries)

**Before production:**
1. Add authentication (NextAuth.js recommended)
2. Add rate limiting (@upstash/ratelimit)
3. Add input validation (Zod)
4. Restrict CORS to your domain
5. Add API key authentication

## 📁 Files Created

```
src/app/api/
├── influencers/
│   ├── route.ts              # GET, POST
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE
├── stats/
│   └── route.ts              # GET
├── search/
│   └── route.ts              # GET
├── niches/
│   └── route.ts              # GET
├── mentions/
│   └── route.ts              # GET, POST
├── community-signals/
│   └── route.ts              # GET, POST
├── users/
│   ├── route.ts              # GET, POST
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE
└── deep-search/
    ├── route.ts              # GET, POST
    └── [id]/
        └── route.ts          # GET, PUT
```

## ✅ Build Status

✅ **Build successful** - All routes compiled  
✅ **TypeScript** - No type errors  
✅ **11 API routes** - All created  
✅ **CORS disabled** - All routes accessible  

## 🚀 Next Steps

1. **Connect Database**: Add Supabase or PostgreSQL client
2. **Implement Queries**: Replace TODO comments
3. **Test Routes**: Use curl or Postman
4. **Add Auth**: Protect sensitive routes
5. **Add Validation**: Validate all inputs
6. **Deploy**: Deploy to production

See **API_ROUTES_DOCUMENTATION.md** for complete details!
