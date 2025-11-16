# 🎬 YouTube Profile Picture Update - Setup Guide

This guide will help you set up and run the YouTube profile picture update script to fetch and update influencer profile pictures from YouTube.

---

## 📋 Quick Start Checklist

- [ ] Get YouTube Data API v3 key
- [ ] Set environment variables
- [ ] Test with dry-run mode
- [ ] Run the actual update
- [ ] Verify in the UI

---

## 🔑 Step 1: Get YouTube Data API Key

### Option A: Using Google Cloud Console (Recommended)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click on the project dropdown at the top
   - Click "New Project" or select an existing one
   - Give it a name like "Influencer Tracker"

3. **Enable YouTube Data API v3**
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"

4. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
   - **Important**: Save this key securely!

5. **Restrict the API Key (Optional but Recommended)**
   - Click on the API key you just created
   - Under "API restrictions", select "Restrict key"
   - Check only "YouTube Data API v3"
   - Under "Application restrictions", you can restrict by IP or leave unrestricted for development
   - Click "Save"

### Quota Information

- **Free Quota**: 10,000 units per day
- **Cost per channel lookup**: 1 unit
- **You can process**: ~10,000 influencers per day for free

---

## 🔧 Step 2: Set Environment Variables

### Option A: Using .env.local file (Recommended)

Create or edit `.env.local` in the project root:

```bash
# YouTube API Key
YOUTUBE_API_KEY=AIzaSy...your_key_here

# Supabase (should already be set)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Option B: Export in Terminal (Temporary)

```bash
export YOUTUBE_API_KEY="AIzaSy...your_key_here"
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

**Note**: This only works for the current terminal session.

---

## 🧪 Step 3: Test with Dry Run

Before making any changes to the database, test the script:

### Test with 3 influencers

```bash
npm run update-youtube-profiles -- --dry-run --limit 3
```

This will:
- ✅ Fetch 3 influencers from the database
- ✅ Try to get their YouTube profile pictures
- ✅ Show what would be updated
- ❌ NOT make any database changes

### Expected Output

```
🚀 YouTube Profile Picture Update Script

Configuration:
  Mode: 🔍 DRY RUN (no changes will be made)
  Force update: No
  Limit: 3 influencers

📥 Fetching influencers from database...
✅ Found 100 influencers

📋 Influencers to process: 3

[1/3] Processing: Influencer Name
  🔍 YouTube identifier: @username
  📡 Fetching from YouTube API (handle: username)...
  ✅ Found profile picture: https://yt3.ggpht.com/...
  🔍 DRY RUN: Would update imageUrl

═══════════════════════════════════════════════════════════
📊 SUMMARY
═══════════════════════════════════════════════════════════
Total processed: 3
✅ Success: 3
⏭️  Skipped: 0
❌ Failed: 0

✨ Done!
```

---

## 🚀 Step 4: Run the Actual Update

Once you're satisfied with the dry run results:

### Update all influencers (that don't have profile pictures)

```bash
npm run update-youtube-profiles
```

### Update only 10 influencers (for testing)

```bash
npm run update-youtube-profiles -- --limit 10
```

### Force update ALL influencers (even those with existing pictures)

```bash
npm run update-youtube-profiles -- --force
```

---

## 📊 Step 5: Verify the Updates

### Check in the UI

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Navigate to the influencers page

4. Verify that profile pictures are now showing correctly

### Check in Database

You can also verify directly in Supabase:
1. Go to your Supabase dashboard
2. Navigate to Table Editor > Influencer
3. Check the `imageUrl` column for updated URLs

---

## 🛠️ Command Reference

| Command | Description |
|---------|-------------|
| `npm run update-youtube-profiles -- --dry-run` | Preview changes without updating |
| `npm run update-youtube-profiles -- --limit 5` | Process only 5 influencers |
| `npm run update-youtube-profiles -- --force` | Update even existing pictures |
| `npm run update-youtube-profiles -- --dry-run --limit 3` | Test with 3 influencers |
| `npm run update-youtube-profiles` | Run the actual update |

---

## ❓ Troubleshooting

### Error: "YOUTUBE_API_KEY environment variable is required"

**Solution**: Make sure you've set the `YOUTUBE_API_KEY` in your `.env.local` file or exported it in your terminal.

```bash
# Check if it's set
echo $YOUTUBE_API_KEY

# If empty, set it
export YOUTUBE_API_KEY="your_key_here"
```

---

### Error: "YouTube API error (403)"

**Possible causes**:
1. Invalid API key
2. API key not enabled for YouTube Data API v3
3. Over quota limit (10,000 units/day)
4. API key restricted to certain IPs/domains

**Solution**:
1. Verify your API key is correct
2. Check that YouTube Data API v3 is enabled in Google Cloud Console
3. Check your quota usage in Google Cloud Console
4. Remove IP/domain restrictions for testing

---

### Warning: "No YouTube channel found"

**Possible causes**:
1. The YouTube identifier is incorrect
2. The channel doesn't exist
3. The channel is private or deleted

**Solution**:
- Check the `socialHandles` field in your database
- Make sure it contains valid YouTube channel information
- The script will skip these and continue with others

---

### Error: "Failed to parse socialHandles"

**Cause**: The `socialHandles` field contains invalid JSON.

**Solution**:
- Check the database entry for that influencer
- Fix the JSON format in the `socialHandles` field
- The script will skip invalid entries and continue

---

## 📝 Database Structure

The script expects influencers in the database with:

```typescript
{
  id: string;
  name: string;
  imageUrl?: string;  // This will be updated
  socialHandles?: string;  // JSON string with platform info
}
```

Example `socialHandles` format:

```json
{
  "platform": "youtube",
  "followers": "100K",
  "username": "@channelname",
  "channelId": "UCxxxxxxxxxxxxx",
  "url": "https://youtube.com/@channelname"
}
```

The script will try to extract YouTube identifiers from:
1. `channelId` field (most reliable)
2. `url` field
3. `username` field
4. Fallback to influencer `name`

---

## 🎯 Best Practices

1. **Always test with dry-run first**
   ```bash
   npm run update-youtube-profiles -- --dry-run --limit 5
   ```

2. **Start with a small batch**
   ```bash
   npm run update-youtube-profiles -- --limit 10
   ```

3. **Monitor your API quota**
   - Check usage in Google Cloud Console
   - Each channel lookup = 1 unit
   - Daily limit = 10,000 units

4. **Run during off-peak hours**
   - Less likely to hit rate limits
   - Better API response times

5. **Keep your API key secure**
   - Never commit `.env.local` to git
   - Use environment variables in production
   - Restrict API key to YouTube Data API v3 only

---

## 📚 Additional Resources

- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Script README](./src/scripts/README.md)

---

## 🎉 Success!

Once you've completed all steps, your influencer profile pictures should be updated with high-quality images from YouTube!

If you encounter any issues not covered in this guide, please check the script's detailed README at `src/scripts/README.md`.
