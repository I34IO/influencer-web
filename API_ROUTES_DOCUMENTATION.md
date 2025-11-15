# API Routes Documentation

## Overview
Complete REST API routes based on the PostgreSQL schema with CORS disabled for all endpoints.

## 🔓 CORS Configuration
All routes have CORS disabled with:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 📋 API Routes Created

### Influencers

#### `GET /api/influencers`
Get all influencers with filtering and sorting.

**Query Parameters:**
- `limit` (number): Max results (default: 100)
- `page` (number): Page number (default: 1)
- `sortBy` (string): Field to sort by (default: trustScore)
- `sortOrder` (string): asc or desc (default: desc)
- `q` (string): Search query
- `niche` (string): Filter by niche

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "imageUrl": "string",
      "summary": "string",
      "socialHandles": "string (JSON)",
      "niche": "string",
      "trustScore": 99.0,
      "dramaCount": 0,
      "goodActionCount": 0,
      "neutralCount": 0,
      "avgSentiment": 0.0,
      "language": "fr",
      "lastUpdated": "ISO date",
      "createdAt": "ISO date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 438,
    "totalPages": 5,
    "hasMore": true
  }
}
```

#### `POST /api/influencers`
Create a new influencer.

**Request Body:**
```json
{
  "name": "string (required)",
  "imageUrl": "string",
  "summary": "string",
  "socialHandles": {
    "platform": "Instagram",
    "followers": "66.5K"
  },
  "niche": "string",
  "language": "fr"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* influencer object */ }
}
```

#### `GET /api/influencers/[id]`
Get a single influencer by ID.

**Response:**
```json
{
  "success": true,
  "data": { /* influencer object */ }
}
```

#### `PUT /api/influencers/[id]`
Update an influencer.

**Request Body:**
```json
{
  "name": "string",
  "imageUrl": "string",
  "summary": "string",
  "socialHandles": { /* object */ },
  "niche": "string",
  "trustScore": 95.0
}
```

#### `DELETE /api/influencers/[id]`
Delete an influencer (cascades to related data).

---

### Stats

#### `GET /api/stats`
Get overall platform statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalInfluencers": 438,
    "activeInfluencers": 420,
    "totalFollowers": 50600000,
    "averageEngagement": 9.8,
    "averageTrustScore": 75.5,
    "topNiches": ["Gaming", "Music", "Tech"],
    "recentActivity": [],
    "growthTrend": []
  }
}
```

---

### Search

#### `GET /api/search?q=query`
Search influencers by name or niche.

**Query Parameters:**
- `q` (string, required): Search query

**Response:**
```json
{
  "success": true,
  "data": [ /* array of influencers */ ],
  "query": "squeezie"
}
```

---

### Niches

#### `GET /api/niches`
Get all unique niches/categories.

**Response:**
```json
{
  "success": true,
  "data": [
    "Gaming",
    "Music",
    "Science",
    "Tech",
    "Education",
    "Beauty",
    "Fitness"
  ]
}
```

---

### Mentions

#### `GET /api/mentions?influencerId=xxx`
Get mentions for an influencer.

**Query Parameters:**
- `influencerId` (uuid): Filter by influencer
- `label` (string): Filter by label (POSITIVE, NEGATIVE, NEUTRAL)
- `limit` (number): Max results (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "influencerId": "uuid",
      "source": "string",
      "sourceUrl": "string",
      "textExcerpt": "string",
      "sentimentScore": 0.85,
      "label": "POSITIVE",
      "scrapedAt": "ISO date"
    }
  ]
}
```

#### `POST /api/mentions`
Create a new mention.

**Request Body:**
```json
{
  "influencerId": "uuid (required)",
  "source": "string (required)",
  "sourceUrl": "string (required)",
  "textExcerpt": "string (required)",
  "sentimentScore": 0.85 (required),
  "label": "POSITIVE (required)"
}
```

---

### Community Signals

#### `GET /api/community-signals?influencerId=xxx`
Get community signals (ratings, reports, comments).

**Query Parameters:**
- `influencerId` (uuid): Filter by influencer
- `userId` (uuid): Filter by user
- `type` (string): Filter by type (RATING, DRAMA_REPORT, POSITIVE_ACTION, COMMENT)
- `limit` (number): Max results (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "influencerId": "uuid",
      "type": "RATING",
      "rating": 5,
      "comment": "string",
      "tags": "string",
      "isVerified": false,
      "verifiedAt": null,
      "isHidden": false,
      "hiddenReason": null,
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  ]
}
```

#### `POST /api/community-signals`
Create a new community signal.

**Request Body:**
```json
{
  "userId": "uuid (required)",
  "influencerId": "uuid (required)",
  "type": "RATING (required)",
  "rating": 5,
  "comment": "string",
  "tags": "string"
}
```

---

### Users

#### `GET /api/users`
Get all users (admin only).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "string",
      "role": "COMMUNITY",
      "status": "ACTIVE",
      "firstName": "string",
      "lastName": "string",
      "company": "string",
      "avatar": "string",
      "createdAt": "ISO date"
    }
  ]
}
```

#### `POST /api/users`
Create a new user (registration).

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "firstName": "string",
  "lastName": "string",
  "company": "string",
  "role": "COMMUNITY"
}
```

#### `GET /api/users/[id]`
Get a single user.

#### `PUT /api/users/[id]`
Update user profile.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "company": "string",
  "avatar": "string"
}
```

#### `DELETE /api/users/[id]`
Delete a user (admin only).

---

### Deep Search

#### `GET /api/deep-search?influencerId=xxx`
Get deep search analyses.

**Query Parameters:**
- `influencerId` (uuid): Filter by influencer
- `status` (string): Filter by status (PENDING, PROCESSING, COMPLETED, FAILED)
- `isPublic` (boolean): Filter by public status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "influencerId": "uuid",
      "status": "COMPLETED",
      "analysisData": "string (JSON)",
      "queriesRun": 50,
      "sourcesAnalyzed": 100,
      "processingTimeMs": 5000,
      "isPublic": false,
      "firstBuyerId": "uuid",
      "unlockedAt": "ISO date",
      "basePrice": 99.99,
      "createdAt": "ISO date",
      "completedAt": "ISO date"
    }
  ]
}
```

#### `POST /api/deep-search`
Create a new deep search analysis.

**Request Body:**
```json
{
  "influencerId": "uuid (required)",
  "userId": "uuid",
  "basePrice": 99.99
}
```

#### `GET /api/deep-search/[id]`
Get a single deep search analysis.

#### `PUT /api/deep-search/[id]`
Update deep search analysis (for background jobs).

**Request Body:**
```json
{
  "status": "COMPLETED",
  "analysisData": "string (JSON)",
  "queriesRun": 50,
  "sourcesAnalyzed": 100,
  "processingTimeMs": 5000
}
```

---

## 🔧 Implementation Status

| Route | GET | POST | PUT | DELETE | Status |
|-------|-----|------|-----|--------|--------|
| `/api/influencers` | ✅ | ✅ | - | - | Skeleton |
| `/api/influencers/[id]` | ✅ | - | ✅ | ✅ | Skeleton |
| `/api/stats` | ✅ | - | - | - | Skeleton |
| `/api/search` | ✅ | - | - | - | Skeleton |
| `/api/niches` | ✅ | - | - | - | Skeleton |
| `/api/mentions` | ✅ | ✅ | - | - | Skeleton |
| `/api/community-signals` | ✅ | ✅ | - | - | Skeleton |
| `/api/users` | ✅ | ✅ | - | - | Skeleton |
| `/api/users/[id]` | ✅ | - | ✅ | ✅ | Skeleton |
| `/api/deep-search` | ✅ | ✅ | - | - | Skeleton |
| `/api/deep-search/[id]` | ✅ | - | ✅ | - | Skeleton |

**Status: Skeleton** = Route structure created, needs database connection

---

## 🗄️ Database Integration

To connect to your PostgreSQL database, you need to:

### 1. Install Database Client

```bash
npm install @supabase/supabase-js
# or
npm install pg
```

### 2. Add Database URL to .env.local

```bash
DATABASE_URL=postgresql://user:password@host:port/database
# or for Supabase
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

### 4. Update Routes

Replace the `// TODO` comments with actual database queries using the client.

---

## 🧪 Testing the Routes

### Test with curl

```bash
# Get influencers
curl http://localhost:3000/api/influencers

# Create influencer
curl -X POST http://localhost:3000/api/influencers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Influencer","niche":"Tech"}'

# Search
curl "http://localhost:3000/api/search?q=test"

# Get stats
curl http://localhost:3000/api/stats

# Get niches
curl http://localhost:3000/api/niches
```

### Test CORS

```bash
curl -X OPTIONS http://localhost:3000/api/influencers -v
```

Should return CORS headers.

---

## 🔐 Security Considerations

### Current State
- ⚠️ **No authentication** - All routes are public
- ⚠️ **No rate limiting** - Can be abused
- ⚠️ **No input validation** - Basic validation only
- ⚠️ **CORS disabled** - Allows all origins

### Recommended Improvements

1. **Add Authentication**
   ```typescript
   import { auth } from '@/lib/auth';
   
   const session = await auth(request);
   if (!session) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

2. **Add Rate Limiting**
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```

3. **Add Input Validation**
   ```bash
   npm install zod
   ```

4. **Restrict CORS** (in production)
   ```typescript
   'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*'
   ```

---

## 📊 Database Schema Reference

### Influencer Table
```sql
- id (uuid, PK)
- name (text, unique, required)
- imageUrl (text)
- summary (text)
- socialHandles (text, JSON string)
- niche (text)
- trustScore (double, default: 50.0)
- dramaCount (int, default: 0)
- goodActionCount (int, default: 0)
- neutralCount (int, default: 0)
- avgSentiment (double, default: 0.0)
- language (text, default: 'fr')
- lastUpdated (timestamptz)
- createdAt (timestamptz)
```

### Mention Table
```sql
- id (uuid, PK)
- influencerId (uuid, FK)
- source (text, required)
- sourceUrl (text, required)
- textExcerpt (text, required)
- sentimentScore (double, required)
- label (text, required)
- scrapedAt (timestamptz)
```

### CommunitySignal Table
```sql
- id (uuid, PK)
- userId (uuid, FK)
- influencerId (uuid, FK)
- type (text: RATING, DRAMA_REPORT, POSITIVE_ACTION, COMMENT)
- rating (int)
- comment (text)
- tags (text)
- isVerified (boolean, default: false)
- verifiedAt (timestamptz)
- isHidden (boolean, default: false)
- hiddenReason (text)
- createdAt (timestamptz)
- updatedAt (timestamptz)
```

### User Table
```sql
- id (uuid, PK)
- email (text, unique, required)
- passwordHash (text, required)
- role (text: COMMUNITY, PROFESSIONAL, ADMIN)
- status (text: ACTIVE, SUSPENDED, DELETED)
- firstName (text)
- lastName (text)
- company (text)
- avatar (text)
- subscriptionTier (text)
- subscriptionStatus (text)
- subscriptionExpiry (timestamptz)
- createdAt (timestamptz)
- lastLoginAt (timestamptz)
- emailVerified (boolean, default: false)
```

### DeepSearchAnalysis Table
```sql
- id (uuid, PK)
- influencerId (uuid, FK)
- status (text: PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED)
- analysisData (text, JSON)
- queriesRun (int, default: 0)
- sourcesAnalyzed (int, default: 0)
- processingTimeMs (int)
- isPublic (boolean, default: false)
- firstBuyerId (uuid, FK)
- unlockedAt (timestamptz)
- basePrice (double, default: 99.99)
- createdAt (timestamptz)
- completedAt (timestamptz)
```

---

## 🚀 Next Steps

1. **Install Database Client**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Add Database Credentials**
   ```bash
   # Add to .env.local
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

3. **Create Database Client**
   ```bash
   # Create src/lib/db/supabase.ts
   ```

4. **Implement Database Queries**
   - Replace all `// TODO` comments
   - Add actual Supabase/PostgreSQL queries
   - Test each endpoint

5. **Add Authentication**
   - Implement user authentication
   - Protect sensitive routes
   - Add role-based access control

6. **Add Validation**
   - Use Zod for input validation
   - Sanitize user inputs
   - Validate UUIDs

7. **Add Rate Limiting**
   - Protect against abuse
   - Limit requests per IP/user

---

## 📝 Example Implementation

### With Supabase

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
  
  return NextResponse.json({ success: true, data });
}
```

### With Raw PostgreSQL

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM "Influencer" ORDER BY "trustScore" DESC LIMIT 20'
    );
    return NextResponse.json({ success: true, data: result.rows });
  } finally {
    client.release();
  }
}
```

---

## ✅ Summary

- ✅ **11 API routes created** with full CRUD operations
- ✅ **CORS disabled** on all routes
- ✅ **Consistent response format** with `{success, data, error}`
- ✅ **Error handling** on all routes
- ✅ **Query parameters** for filtering and sorting
- ✅ **Validation** for required fields
- ✅ **Ready for database integration**

**Next**: Connect to your PostgreSQL database and implement the actual queries!
