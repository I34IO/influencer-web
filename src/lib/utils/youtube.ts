// YouTube API utilities for fetching channel information

/**
 * Search for YouTube channel using Google Custom Search API
 * This is a fallback when we don't have the exact channel handle
 */
export async function searchYouTubeChannel(
  influencerName: string,
  googleApiKey?: string,
  searchEngineId?: string
): Promise<string | null> {
  if (!googleApiKey || !searchEngineId) {
    return null;
  }

  try {
    const query = encodeURIComponent(`${influencerName} YouTube channel`);
    const url = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&q=${query}&num=3`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }

    // Look for YouTube URLs in the results
    for (const item of data.items) {
      const link = item.link || '';
      
      // Check if it's a YouTube channel URL
      if (link.includes('youtube.com/channel/') || 
          link.includes('youtube.com/@') ||
          link.includes('youtube.com/c/') ||
          link.includes('youtube.com/user/')) {
        return link;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error searching for YouTube channel:', error);
    return null;
  }
}

interface YouTubeChannelSnippet {
  title: string;
  description: string;
  thumbnails: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
}

interface YouTubeChannel {
  id: string;
  snippet: YouTubeChannelSnippet;
}

interface YouTubeAPIResponse {
  items: YouTubeChannel[];
}

/**
 * Extract YouTube channel ID or username from various URL formats
 * Supports:
 * - youtube.com/channel/CHANNEL_ID
 * - youtube.com/@username
 * - youtube.com/c/customname
 * - youtube.com/user/username
 * - Plain username or channel ID
 */
export function extractYouTubeIdentifier(input: string): { type: 'id' | 'username' | 'handle', value: string } | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim();
  
  // Check if it's a URL
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    try {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      
      // Channel ID format: /channel/UC...
      const channelMatch = url.pathname.match(/\/channel\/([^\/\?]+)/);
      if (channelMatch) {
        return { type: 'id', value: channelMatch[1] };
      }
      
      // Handle format: /@username
      const handleMatch = url.pathname.match(/\/@([^\/\?]+)/);
      if (handleMatch) {
        return { type: 'handle', value: handleMatch[1] };
      }
      
      // Custom URL format: /c/customname
      const customMatch = url.pathname.match(/\/c\/([^\/\?]+)/);
      if (customMatch) {
        return { type: 'username', value: customMatch[1] };
      }
      
      // User format: /user/username
      const userMatch = url.pathname.match(/\/user\/([^\/\?]+)/);
      if (userMatch) {
        return { type: 'username', value: userMatch[1] };
      }
    } catch (e) {
      console.warn('Failed to parse YouTube URL:', trimmed, e);
    }
  }
  
  // If it starts with @, it's a handle
  if (trimmed.startsWith('@')) {
    return { type: 'handle', value: trimmed.substring(1) };
  }
  
  // If it starts with UC and is 24 chars, likely a channel ID
  if (trimmed.startsWith('UC') && trimmed.length === 24) {
    return { type: 'id', value: trimmed };
  }
  
  // Otherwise treat as username
  return { type: 'username', value: trimmed };
}

/**
 * Fetch YouTube channel profile picture using YouTube Data API v3
 * @param identifier - Channel ID, username, or handle
 * @param apiKey - YouTube Data API key
 * @returns Profile picture URL (high quality) or null if not found
 */
export async function fetchYouTubeProfilePicture(
  identifier: string,
  apiKey: string
): Promise<string | null> {
  if (!apiKey) {
    throw new Error('YouTube API key is required');
  }

  const extracted = extractYouTubeIdentifier(identifier);
  if (!extracted) {
    console.warn('Could not extract YouTube identifier from:', identifier);
    return null;
  }

  try {
    let url: string;
    
    if (extracted.type === 'id') {
      // Direct channel ID lookup
      url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${encodeURIComponent(extracted.value)}&key=${apiKey}`;
    } else if (extracted.type === 'handle') {
      // Handle lookup (new format)
      url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${encodeURIComponent(extracted.value)}&key=${apiKey}`;
    } else {
      // Username lookup (legacy format)
      url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=${encodeURIComponent(extracted.value)}&key=${apiKey}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`YouTube API error (${response.status}):`, errorText);
      return null;
    }

    const data: YouTubeAPIResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.warn('No YouTube channel found for:', identifier);
      return null;
    }

    const channel = data.items[0];
    const thumbnails = channel.snippet.thumbnails;
    
    // Prefer high quality, fall back to medium, then default
    return thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || null;
  } catch (error) {
    console.error('Error fetching YouTube profile picture:', error);
    return null;
  }
}

/**
 * Fetch multiple YouTube channel profile pictures in batch
 * @param identifiers - Array of channel IDs (batch only works with IDs)
 * @param apiKey - YouTube Data API key
 * @returns Map of identifier to profile picture URL
 */
export async function fetchYouTubeProfilePicturesBatch(
  channelIds: string[],
  apiKey: string
): Promise<Map<string, string>> {
  if (!apiKey) {
    throw new Error('YouTube API key is required');
  }

  const results = new Map<string, string>();
  
  if (channelIds.length === 0) {
    return results;
  }

  try {
    // YouTube API allows up to 50 IDs per request
    const batchSize = 50;
    
    for (let i = 0; i < channelIds.length; i += batchSize) {
      const batch = channelIds.slice(i, i + batchSize);
      const ids = batch.join(',');
      
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${encodeURIComponent(ids)}&key=${apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`YouTube API batch error (${response.status}):`, errorText);
        continue;
      }

      const data: YouTubeAPIResponse = await response.json();
      
      if (data.items) {
        for (const channel of data.items) {
          const thumbnails = channel.snippet.thumbnails;
          const profileUrl = thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url;
          
          if (profileUrl) {
            results.set(channel.id, profileUrl);
          }
        }
      }
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < channelIds.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  } catch (error) {
    console.error('Error fetching YouTube profile pictures in batch:', error);
  }

  return results;
}
