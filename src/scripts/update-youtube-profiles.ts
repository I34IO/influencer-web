#!/usr/bin/env tsx
/**
 * Script to update influencer profile pictures from YouTube
 * 
 * Usage:
 *   npm run update-youtube-profiles -- [options]
 * 
 * Options:
 *   --dry-run    Preview changes without updating database
 *   --limit N    Limit to N influencers (for testing)
 *   --force      Update even if imageUrl already exists
 * 
 * Environment Variables:
 *   YOUTUBE_API_KEY              - Required: YouTube Data API v3 key
 *   NEXT_PUBLIC_SUPABASE_URL     - Required: Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY    - Required: Supabase service role key
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fetchYouTubeProfilePicture, extractYouTubeIdentifier, searchYouTubeChannel } from '../lib/utils/youtube';
import { getYouTubeHandle } from '../lib/data/known-youtubers';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 && args[limitIndex + 1] ? parseInt(args[limitIndex + 1]) : undefined;

// Validate environment variables
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY; // Optional
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID; // Optional

if (!YOUTUBE_API_KEY) {
  console.error('❌ Error: YOUTUBE_API_KEY environment variable is required');
  console.error('   Get your API key from: https://console.cloud.google.com/apis/credentials');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Supabase environment variables are required');
  console.error('   NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface DBInfluencer {
  id: string;
  name: string;
  imageUrl?: string;
  socialHandles?: string;
}

interface SocialHandles {
  platform?: string;
  followers?: string;
  url?: string;
  username?: string;
  channelId?: string;
}

interface UpdateResult {
  id: string;
  name: string;
  oldImageUrl: string | null;
  newImageUrl: string | null;
  status: 'success' | 'skipped' | 'failed';
  reason?: string;
}

/**
 * Parse social handles JSON and extract YouTube identifier
 * Enhanced with known YouTubers database
 */
function getYouTubeIdentifier(influencer: DBInfluencer): string | null {
  // First, check our known YouTubers database
  const knownHandle = getYouTubeHandle(influencer.name);
  if (knownHandle) {
    console.log(`  💡 Found in known YouTubers database: ${knownHandle}`);
    return knownHandle;
  }
  
  // Try to parse socialHandles
  if (influencer.socialHandles) {
    try {
      const handles: SocialHandles = JSON.parse(influencer.socialHandles);
      
      // Check if platform is YouTube
      if (handles.platform?.toLowerCase().includes('youtube') || 
          handles.platform?.toLowerCase().includes('ytb')) {
        
        // Try different fields
        if (handles.channelId) return handles.channelId;
        if (handles.url) return handles.url;
        if (handles.username) return handles.username;
      }
    } catch (e) {
      console.warn(`  ⚠️  Failed to parse socialHandles for ${influencer.name}`);
    }
  }
  
  // Fallback: use the influencer name as potential username
  return influencer.name;
}

/**
 * Main function to update YouTube profile pictures
 */
async function updateYouTubeProfiles() {
  console.log('🚀 YouTube Profile Picture Update Script\n');
  console.log('Configuration:');
  console.log(`  Mode: ${isDryRun ? '🔍 DRY RUN (no changes will be made)' : '✍️  LIVE UPDATE'}`);
  console.log(`  Force update: ${isForce ? 'Yes' : 'No'}`);
  console.log(`  Limit: ${limit ? `${limit} influencers` : 'All influencers'}`);
  console.log('');

  // Fetch influencers from database
  console.log('📥 Fetching influencers from database...');
  
  let query = supabase
    .from('Influencer')
    .select('id, name, imageUrl, socialHandles');
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data: influencers, error } = await query;
  
  if (error) {
    console.error('❌ Error fetching influencers:', error);
    process.exit(1);
  }
  
  if (!influencers || influencers.length === 0) {
    console.log('ℹ️  No influencers found in database');
    process.exit(0);
  }
  
  console.log(`✅ Found ${influencers.length} influencers\n`);
  
  // Filter influencers that need updating
  const toUpdate = influencers.filter(inf => {
    if (isForce) return true;
    return !inf.imageUrl || inf.imageUrl.trim() === '';
  });
  
  console.log(`📋 Influencers to process: ${toUpdate.length}`);
  if (!isForce) {
    console.log(`   (${influencers.length - toUpdate.length} already have profile pictures)\n`);
  }
  console.log('');
  
  // Process each influencer
  const results: UpdateResult[] = [];
  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  
  for (let i = 0; i < toUpdate.length; i++) {
    const influencer = toUpdate[i];
    const progress = `[${i + 1}/${toUpdate.length}]`;
    
    console.log(`${progress} Processing: ${influencer.name}`);
    
    // Get YouTube identifier
    const youtubeId = getYouTubeIdentifier(influencer);
    
    if (!youtubeId) {
      console.log(`  ⏭️  Skipped: No YouTube identifier found`);
      results.push({
        id: influencer.id,
        name: influencer.name,
        oldImageUrl: influencer.imageUrl || null,
        newImageUrl: null,
        status: 'skipped',
        reason: 'No YouTube identifier',
      });
      skippedCount++;
      console.log('');
      continue;
    }
    
    console.log(`  🔍 YouTube identifier: ${youtubeId}`);
    
    // Validate it's a YouTube identifier
    const extracted = extractYouTubeIdentifier(youtubeId);
    if (!extracted) {
      console.log(`  ⏭️  Skipped: Invalid YouTube identifier`);
      results.push({
        id: influencer.id,
        name: influencer.name,
        oldImageUrl: influencer.imageUrl || null,
        newImageUrl: null,
        status: 'skipped',
        reason: 'Invalid YouTube identifier',
      });
      skippedCount++;
      console.log('');
      continue;
    }
    
    console.log(`  📡 Fetching from YouTube API (${extracted.type}: ${extracted.value})...`);
    
    try {
      // Fetch profile picture from YouTube
      let profilePictureUrl = await fetchYouTubeProfilePicture(youtubeId, YOUTUBE_API_KEY!);
      
      // If failed and Google Search API is available, try searching
      if (!profilePictureUrl && GOOGLE_SEARCH_API_KEY && GOOGLE_SEARCH_ENGINE_ID) {
        console.log(`  🔎 Trying Google Search as fallback...`);
        const searchResult = await searchYouTubeChannel(influencer.name, GOOGLE_SEARCH_API_KEY, GOOGLE_SEARCH_ENGINE_ID);
        
        if (searchResult) {
          console.log(`  💡 Found via search: ${searchResult}`);
          profilePictureUrl = await fetchYouTubeProfilePicture(searchResult, YOUTUBE_API_KEY!);
        }
      }
      
      if (!profilePictureUrl) {
        console.log(`  ❌ Failed: Could not fetch profile picture from YouTube`);
        results.push({
          id: influencer.id,
          name: influencer.name,
          oldImageUrl: influencer.imageUrl || null,
          newImageUrl: null,
          status: 'failed',
          reason: 'YouTube API returned no profile picture',
        });
        failedCount++;
        console.log('');
        continue;
      }
      
      console.log(`  ✅ Found profile picture: ${profilePictureUrl.substring(0, 60)}...`);
      
      // Update database (unless dry run)
      if (!isDryRun) {
        const { error: updateError } = await supabase
          .from('Influencer')
          .update({ 
            imageUrl: profilePictureUrl,
            lastUpdated: new Date().toISOString(),
          })
          .eq('id', influencer.id);
        
        if (updateError) {
          console.log(`  ❌ Failed to update database: ${updateError.message}`);
          results.push({
            id: influencer.id,
            name: influencer.name,
            oldImageUrl: influencer.imageUrl || null,
            newImageUrl: profilePictureUrl,
            status: 'failed',
            reason: `Database update failed: ${updateError.message}`,
          });
          failedCount++;
        } else {
          console.log(`  💾 Database updated successfully`);
          results.push({
            id: influencer.id,
            name: influencer.name,
            oldImageUrl: influencer.imageUrl || null,
            newImageUrl: profilePictureUrl,
            status: 'success',
          });
          successCount++;
        }
      } else {
        console.log(`  🔍 DRY RUN: Would update imageUrl to: ${profilePictureUrl}`);
        results.push({
          id: influencer.id,
          name: influencer.name,
          oldImageUrl: influencer.imageUrl || null,
          newImageUrl: profilePictureUrl,
          status: 'success',
        });
        successCount++;
      }
      
      console.log('');
      
      // Add a small delay to avoid rate limiting
      if (i < toUpdate.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error instanceof Error ? error.message : String(error)}`);
      results.push({
        id: influencer.id,
        name: influencer.name,
        oldImageUrl: influencer.imageUrl || null,
        newImageUrl: null,
        status: 'failed',
        reason: error instanceof Error ? error.message : String(error),
      });
      failedCount++;
      console.log('');
    }
  }
  
  // Print summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total processed: ${toUpdate.length}`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log('');
  
  if (isDryRun) {
    console.log('🔍 This was a DRY RUN - no changes were made to the database');
    console.log('   Run without --dry-run to apply changes');
  }
  
  // Print failed items if any
  if (failedCount > 0) {
    console.log('');
    console.log('Failed items:');
    results
      .filter(r => r.status === 'failed')
      .forEach(r => {
        console.log(`  - ${r.name}: ${r.reason}`);
      });
  }
  
  console.log('');
  console.log('✨ Done!');
}

// Run the script
updateYouTubeProfiles().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
