#!/usr/bin/env tsx
/**
 * Helper script to add YouTube channel URLs to influencers
 * 
 * This script helps you manually add YouTube channel information to influencers
 * so that the update-youtube-profiles script can fetch their profile pictures.
 * 
 * Usage:
 *   npm run add-youtube-channels
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { KNOWN_YOUTUBERS } from '../lib/data/known-youtubers';

// Load environment variables from .env.local
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Supabase environment variables are required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Use the comprehensive database from known-youtubers.ts
const KNOWN_YOUTUBE_CHANNELS = KNOWN_YOUTUBERS;

async function addYouTubeChannels() {
  console.log('🎬 Adding YouTube Channel Information\n');
  
  // Fetch all YouTube influencers
  const { data: influencers, error } = await supabase
    .from('Influencer')
    .select('id, name, socialHandles')
    .ilike('socialHandles', '%YouTube%');
  
  if (error) {
    console.error('❌ Error fetching influencers:', error);
    process.exit(1);
  }
  
  if (!influencers || influencers.length === 0) {
    console.log('ℹ️  No YouTube influencers found');
    process.exit(0);
  }
  
  console.log(`Found ${influencers.length} YouTube influencers\n`);
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const influencer of influencers) {
    const youtubeChannel = KNOWN_YOUTUBE_CHANNELS[influencer.name];
    
    if (!youtubeChannel) {
      console.log(`⏭️  ${influencer.name} - No channel info available (add to KNOWN_YOUTUBE_CHANNELS)`);
      skippedCount++;
      continue;
    }
    
    try {
      // Parse existing socialHandles
      const handles = influencer.socialHandles ? JSON.parse(influencer.socialHandles) : {};
      
      // Add YouTube channel info
      handles.username = youtubeChannel;
      handles.url = youtubeChannel.startsWith('@') 
        ? `https://youtube.com/${youtubeChannel}`
        : youtubeChannel.startsWith('UC')
        ? `https://youtube.com/channel/${youtubeChannel}`
        : youtubeChannel;
      
      // Update database
      const { error: updateError } = await supabase
        .from('Influencer')
        .update({
          socialHandles: JSON.stringify(handles),
          lastUpdated: new Date().toISOString(),
        })
        .eq('id', influencer.id);
      
      if (updateError) {
        console.log(`❌ ${influencer.name} - Failed to update: ${updateError.message}`);
      } else {
        console.log(`✅ ${influencer.name} - Added channel: ${youtubeChannel}`);
        updatedCount++;
      }
    } catch (e) {
      console.log(`❌ ${influencer.name} - Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total YouTube influencers: ${influencers.length}`);
  console.log(`✅ Updated: ${updatedCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
  console.log('');
  console.log('💡 Tip: Add more channels to KNOWN_YOUTUBE_CHANNELS in the script');
  console.log('   Then run: npm run update-youtube-profiles');
  console.log('');
  console.log('✨ Done!');
}

addYouTubeChannels().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
