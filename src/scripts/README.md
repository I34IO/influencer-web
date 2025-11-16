# YouTube Profile Picture Update Script

This script fetches profile pictures from YouTube for influencers in the database and updates their `imageUrl` field.

## Prerequisites

### 1. Get a YouTube Data API v3 Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
   - (Optional) Restrict the key to only YouTube Data API v3 for security

### 2. Set Environment Variables

Create a `.env.local` file in the project root (if it doesn't exist) and add:

```bash
YOUTUBE_API_KEY=your_youtube_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

Or export them in your terminal:

```bash
export YOUTUBE_API_KEY="your_youtube_api_key_here"
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_key"
```

## Usage

### Dry Run (Preview Changes)

Test the script without making any database changes:

```bash
npm run update-youtube-profiles -- --dry-run
```

### Limit to a Few Influencers (Testing)

Process only the first 5 influencers:

```bash
npm run update-youtube-profiles -- --dry-run --limit 5
```

### Update Database (Live)

Run the script to actually update the database:

```bash
npm run update-youtube-profiles
```

### Force Update All

Update even influencers that already have profile pictures:

```bash
npm run update-youtube-profiles -- --force
```

## Options

- `--dry-run` - Preview changes without updating the database
- `--limit N` - Process only N influencers (useful for testing)
- `--force` - Update even if imageUrl already exists

## How It Works

1. **Fetches influencers** from the Supabase database
2. **Extracts YouTube identifiers** from the `socialHandles` field or uses the influencer name
3. **Calls YouTube Data API v3** to get channel information
4. **Extracts profile picture URL** (high quality thumbnail)
5. **Updates the database** with the new `imageUrl`

## Supported YouTube Identifier Formats

The script can handle various YouTube URL formats:

- Channel ID: `youtube.com/channel/UC...` or just `UC...`
- Handle: `youtube.com/@username` or `@username`
- Custom URL: `youtube.com/c/customname`
- Legacy username: `youtube.com/user/username`
- Plain username

## Rate Limiting

The script includes:
- 200ms delay between individual requests
- 100ms delay between batch requests
- Supports up to 50 channels per batch request

YouTube Data API v3 has a default quota of **10,000 units per day**. Each channel lookup costs **1 unit**, so you can process up to 10,000 influencers per day.

## Troubleshooting

### "YOUTUBE_API_KEY environment variable is required"

Make sure you've set the `YOUTUBE_API_KEY` environment variable.

### "No YouTube channel found"

The script couldn't find a YouTube channel with the given identifier. This could mean:
- The identifier is incorrect
- The channel doesn't exist
- The channel is private or deleted

### "YouTube API error (403)"

Your API key might be:
- Invalid
- Not enabled for YouTube Data API v3
- Over quota limit
- Restricted to certain domains/IPs

### "Failed to parse socialHandles"

The `socialHandles` field in the database contains invalid JSON. The script will skip this influencer and continue.

## Example Output

```
🚀 YouTube Profile Picture Update Script

Configuration:
  Mode: 🔍 DRY RUN (no changes will be made)
  Force update: No
  Limit: 5 influencers

📥 Fetching influencers from database...
✅ Found 100 influencers

📋 Influencers to process: 5

[1/5] Processing: John Doe
  🔍 YouTube identifier: @johndoe
  📡 Fetching from YouTube API (handle: johndoe)...
  ✅ Found profile picture: https://yt3.ggpht.com/...
  🔍 DRY RUN: Would update imageUrl

[2/5] Processing: Jane Smith
  🔍 YouTube identifier: UCxxx...
  📡 Fetching from YouTube API (id: UCxxx...)...
  ✅ Found profile picture: https://yt3.ggpht.com/...
  🔍 DRY RUN: Would update imageUrl

═══════════════════════════════════════════════════════════
📊 SUMMARY
═══════════════════════════════════════════════════════════
Total processed: 5
✅ Success: 5
⏭️  Skipped: 0
❌ Failed: 0

🔍 This was a DRY RUN - no changes were made to the database
   Run without --dry-run to apply changes

✨ Done!
```
