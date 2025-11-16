# API Configuration Guide

## Overview

This application uses a **proxy architecture** where:
1. Frontend calls Next.js API routes at `/api/*`
2. Next.js API routes proxy requests to the backend API
3. Backend API URL is configured via environment variable

## Environment Variables

### Required

- `NEXT_PUBLIC_API_BASE_URL` - The backend API base URL
  - **Production**: `https://influencer-web-black.vercel.app/api`
  - **Development**: Same as production (or your local backend if available)

### Optional

- `NEXT_PUBLIC_API_TIMEOUT` - API request timeout in milliseconds (default: 10000)
- `NEXT_PUBLIC_API_DEBUG` - Enable API debug logging (default: false)

## API Endpoints

All frontend requests go through Next.js API routes:

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | Get platform statistics |
| `/api/influencers` | GET | Get all influencers (with filters) |
| `/api/influencers` | POST | Create new influencer |
| `/api/influencers/[id]` | GET | Get single influencer |
| `/api/influencers/[id]/update` | POST | Update influencer |
| `/api/influencers/[id]/delete` | POST | Delete influencer |
| `/api/search?q=query` | GET | Search influencers |
| `/api/niches` | GET | Get available niches/categories |
| `/api/mentions` | GET | Get mentions |
| `/api/community-signals` | GET | Get community signals |
| `/api/deep-search` | GET/POST | Deep search analysis |
| `/api/users` | GET/POST | User management |

## Testing the API

### Using curl

```bash
# Get stats
curl https://influencer-web-black.vercel.app/api/stats

# Get all influencers
curl https://influencer-web-black.vercel.app/api/influencers

# Search influencers
curl "https://influencer-web-black.vercel.app/api/search?q=test"

# Get niches
curl https://influencer-web-black.vercel.app/api/niches

# Create influencer
curl -X POST https://influencer-web-black.vercel.app/api/influencers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Influencer",
    "niche": "Tech",
    "language": "fr"
  }'
```

### Using JavaScript/TypeScript

The application provides a service layer in `src/lib/services/api.ts`:

```typescript
import { fetchInfluencers, searchInfluencers, fetchStats } from '@/lib/services/api';

// Fetch all influencers
const influencers = await fetchInfluencers();

// Search
const results = await searchInfluencers('query');

// Get stats
const stats = await fetchStats();
```

## Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Browser   │─────▶│  Next.js API     │─────▶│  Backend    │
│  (Frontend) │      │  Routes (/api/*) │      │  API        │
└─────────────┘      └──────────────────┘      └─────────────┘
                            │
                            │ Configured via
                            │ NEXT_PUBLIC_API_BASE_URL
                            ▼
```

## Configuration Files

- `.env.local` - Local development environment variables (not committed)
- `.env.example` - Example environment variables (committed)
- `src/lib/config/api.ts` - API configuration and endpoint definitions
- `src/lib/services/api.ts` - API service layer with typed functions

## Security Notes

1. ✅ No hardcoded API URLs in the codebase
2. ✅ All API URLs configured via environment variables
3. ✅ CORS headers properly configured
4. ✅ `.env.local` is in `.gitignore`
5. ✅ API routes validate required environment variables

## Deployment

### Vercel

Set the environment variable in Vercel dashboard:
- `NEXT_PUBLIC_API_BASE_URL` = `https://influencer-web-black.vercel.app/api`

### Other Platforms

Ensure the `NEXT_PUBLIC_API_BASE_URL` environment variable is set before building.
