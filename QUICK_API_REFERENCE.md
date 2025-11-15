# Quick API Reference

## 🚀 Quick Start

### 1. Set Your API URL

Edit `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://your-api-url.com/api/public
```

### 2. Restart Dev Server
```bash
npm run dev
```

That's it! The app will now use your API.

---

## 📋 Current API Configuration

**Default URL:** `http://10.80.222.41:3000/api/public`

**Available Endpoints:**
- ✅ `GET /influencers` - Get influencers list
- ✅ `GET /search?q=query` - Search influencers
- ✅ `GET /stats` - Get statistics
- ✅ `GET /niches` - Get categories

---

## 🔧 Quick Examples

### Test API with curl

```bash
# Get top 20 influencers
curl "http://10.80.222.41:3000/api/public/influencers?limit=20&sortBy=trustScore&sortOrder=desc"

# Search
curl "http://10.80.222.41:3000/api/public/search?q=squeezie"

# Get stats
curl "http://10.80.222.41:3000/api/public/stats"

# Get categories
curl "http://10.80.222.41:3000/api/public/niches"
```

---

## 🐛 Debugging

### Enable Debug Logs

In `.env.local`:
```bash
NEXT_PUBLIC_API_DEBUG=true
```

Then check browser console (F12) for API logs.

### Common Issues

**Problem:** API not loading  
**Solution:** Check if API URL is correct and server is running

**Problem:** CORS errors  
**Solution:** Backend needs to allow your frontend domain

**Problem:** Timeout errors  
**Solution:** Increase timeout in `.env.local`:
```bash
NEXT_PUBLIC_API_TIMEOUT=30000
```

---

## 📁 Files to Know

- **`.env.local`** - Your API configuration (not in git)
- **`.env.example`** - Example configuration (in git)
- **`src/lib/config/api.ts`** - API config and helpers
- **`src/lib/services/api.ts`** - API service functions
- **`API_SETUP.md`** - Full documentation

---

## 🔄 Changing API URL

### Development
Edit `.env.local` and restart server

### Production (Vercel)
```bash
vercel env add NEXT_PUBLIC_API_BASE_URL
# Enter your production API URL
```

### Production (Other)
Set environment variable in your hosting platform

---

## 📞 API Service Usage

```typescript
import { 
  fetchInfluencers, 
  searchInfluencers, 
  fetchStats,
  fetchAnalytics 
} from '@/lib/services/api';

// Get influencers
const influencers = await fetchInfluencers();

// Search
const results = await searchInfluencers('query');

// Get stats
const stats = await fetchStats();

// Get analytics (combines stats + top performers)
const analytics = await fetchAnalytics();
```

---

## ✅ Checklist

- [ ] Created `.env.local` file
- [ ] Set `NEXT_PUBLIC_API_BASE_URL`
- [ ] Restarted dev server
- [ ] Tested API with curl
- [ ] Checked browser console for errors
- [ ] Enabled debug mode if needed

---

## 📚 More Info

See **`API_SETUP.md`** for complete documentation.
