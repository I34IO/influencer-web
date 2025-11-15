# API Setup Guide

## Overview
This application connects to a backend API to fetch influencer data, statistics, and more.

## Configuration

### 1. Environment Variables

Create a `.env.local` file in the root directory (already created):

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://10.80.222.41:3000/api/public

# Optional: API timeout in milliseconds
NEXT_PUBLIC_API_TIMEOUT=10000

# Optional: Enable API logging in development
NEXT_PUBLIC_API_DEBUG=true
```

### 2. Update API URL

When you have your own API URL, simply update the `.env.local` file:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api/public
```

**Important:** After changing the `.env.local` file, restart the development server:

```bash
npm run dev
```

## API Endpoints

The application uses the following endpoints:

### Influencers
```bash
# Get influencers with filters and sorting
GET /influencers?limit=20&sortBy=trustScore&sortOrder=desc

# Get single influencer
GET /influencers/:id

# Create influencer (if supported)
POST /influencers

# Update influencer (if supported)
PUT /influencers/:id

# Delete influencer (if supported)
DELETE /influencers/:id
```

### Search
```bash
# Search influencers
GET /search?q=squeezie
```

### Statistics
```bash
# Get overall statistics
GET /stats
```

### Categories/Niches
```bash
# Get available categories
GET /niches
```

### Rankings (Optional)
```bash
# Get rankings (if available)
GET /rankings
```

### Events (Optional)
```bash
# Get events (if available)
GET /events

# Get single event
GET /events/:id
```

## API Response Format

### Expected Influencer Object
```typescript
{
  id: string;
  username: string;
  fullName: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  profileImage: string;
  followers: number;
  following: number;
  totalPosts: number;
  bio?: string;
  verified: boolean;
  category: string;
  location?: string;
  email?: string;
  phone?: string;
  joinedDate: string;
  lastActive: string;
  
  // Metrics
  engagementRate: number;
  averageLikes: number;
  averageComments: number;
  averageShares: number;
  reachRate: number;
  
  // Scores
  overallScore: number;
  engagementScore: number;
  growthScore: number;
  consistencyScore: number;
  
  // Growth metrics
  followerGrowth30d: number;
  followerGrowth7d: number;
  
  // Status
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}
```

### Expected Stats Object
```typescript
{
  totalInfluencers: number;
  activeInfluencers: number;
  totalFollowers: number;
  averageEngagement: number;
  recentActivity?: Activity[];
  growthTrend?: GrowthData[];
}
```

## Query Parameters

### Influencers Endpoint

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `limit` | number | Maximum number of results | `limit=20` |
| `sortBy` | string | Field to sort by | `sortBy=trustScore` |
| `sortOrder` | string | Sort direction (asc/desc) | `sortOrder=desc` |
| `platform` | string | Filter by platform | `platform=instagram` |
| `category` | string | Filter by category | `category=gaming` |
| `tier` | string | Filter by tier | `tier=platinum` |
| `status` | string | Filter by status | `status=active` |
| `minFollowers` | number | Minimum followers | `minFollowers=10000` |
| `maxFollowers` | number | Maximum followers | `maxFollowers=1000000` |
| `minEngagement` | number | Minimum engagement rate | `minEngagement=5` |
| `maxEngagement` | number | Maximum engagement rate | `maxEngagement=20` |

### Search Endpoint

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` | string | Search query | `q=squeezie` |

## Error Handling

The API service includes comprehensive error handling:

1. **Network Errors**: Caught and logged
2. **Timeout**: Configurable timeout (default 10 seconds)
3. **HTTP Errors**: Status codes handled appropriately
4. **Fallbacks**: Graceful degradation when endpoints are unavailable

## Testing the API

### Using curl

```bash
# Test influencers endpoint
curl "http://10.80.222.41:3000/api/public/influencers?limit=5"

# Test search
curl "http://10.80.222.41:3000/api/public/search?q=test"

# Test stats
curl "http://10.80.222.41:3000/api/public/stats"

# Test niches
curl "http://10.80.222.41:3000/api/public/niches"
```

### Using the Browser

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the browser console (F12)

3. Check for API logs (if `NEXT_PUBLIC_API_DEBUG=true`)

4. Look for any error messages

## Debugging

### Enable Debug Mode

Set in `.env.local`:
```bash
NEXT_PUBLIC_API_DEBUG=true
```

This will log all API requests and responses to the console.

### Common Issues

1. **CORS Errors**
   - Ensure the backend API allows requests from your frontend domain
   - Check CORS headers on the backend

2. **Network Errors**
   - Verify the API URL is correct
   - Check if the API server is running
   - Test the API directly with curl

3. **Timeout Errors**
   - Increase timeout in `.env.local`
   - Check API server performance

4. **404 Errors**
   - Verify endpoint paths match the backend
   - Check API documentation

## API Configuration Files

- **`.env.local`**: Local environment variables (not committed to git)
- **`.env.example`**: Example environment file (committed to git)
- **`src/lib/config/api.ts`**: API configuration and helpers
- **`src/lib/services/api.ts`**: API service layer with all endpoints

## Switching Between Mock and Real API

The application now uses the real API by default. If you need to switch back to mock data for testing:

1. Keep the old mock data file: `src/lib/services/mockData.ts`
2. Modify `src/lib/services/api.ts` to use mock data instead of API calls

## Production Deployment

For production, set the environment variable in your hosting platform:

### Vercel
```bash
vercel env add NEXT_PUBLIC_API_BASE_URL
```

### Netlify
Add to `netlify.toml`:
```toml
[build.environment]
  NEXT_PUBLIC_API_BASE_URL = "https://your-api-domain.com/api/public"
```

### Docker
Add to `docker-compose.yml`:
```yaml
environment:
  - NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api/public
```

## Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use HTTPS in production** - Always use secure connections
3. **API Keys**: If your API requires authentication, add it to `.env.local`:
   ```bash
   NEXT_PUBLIC_API_KEY=your-api-key-here
   ```
4. **Rate Limiting**: Be aware of API rate limits

## Support

If you encounter issues:
1. Check the browser console for errors
2. Enable debug mode (`NEXT_PUBLIC_API_DEBUG=true`)
3. Test the API directly with curl
4. Verify environment variables are loaded correctly

## Example Usage

```typescript
import { fetchInfluencers, searchInfluencers, fetchStats } from '@/lib/services/api';

// Fetch top influencers
const influencers = await fetchInfluencers(
  undefined,
  { field: 'overallScore', direction: 'desc' }
);

// Search
const results = await searchInfluencers('squeezie');

// Get stats
const stats = await fetchStats();
```
