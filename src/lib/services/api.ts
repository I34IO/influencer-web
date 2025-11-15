// API Service Layer
// Connects to the real backend API

import { 
  Influencer, 
  Ranking, 
  QRScan, 
  Event, 
  Analytics, 
  FilterOptions, 
  SortOption 
} from '@/types';
import { API_CONFIG, API_ENDPOINTS, buildURL, logAPI, logAPIError } from '@/lib/config/api';

// Generic fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.baseURL}${endpoint}`;
  
  logAPI(options?.method || 'GET', url, options?.body);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Handle wrapped response format {success: true, data: [...]}
    if (result.success && result.data !== undefined) {
      return result.data as T;
    }
    
    return result as T;
  } catch (error) {
    logAPIError(options?.method || 'GET', url, error);
    throw error;
  }
}

// Map API influencer to our Influencer type
function mapAPIInfluencer(apiInfluencer: any): Influencer {
  if (API_CONFIG.debug) {
    console.log('Mapping influencer:', apiInfluencer);
  }
  
  // Parse social handles - it's a JSON string
  let socialHandles: any = { platform: 'Instagram', followers: '0' };
  
  if (apiInfluencer.socialHandles) {
    try {
      // The API returns a JSON string, parse it directly
      socialHandles = JSON.parse(apiInfluencer.socialHandles);
      if (API_CONFIG.debug) {
        console.log('Parsed socialHandles:', socialHandles);
      }
    } catch (e) {
      console.warn('Failed to parse socialHandles for', apiInfluencer.name, ':', e);
    }
  }
  
  // Parse followers count (e.g., "66.5K" -> 66500)
  const parseFollowers = (str: string): number => {
    if (!str) return 0;
    const cleanStr = str.replace(/[^0-9.KM]/gi, '');
    const num = parseFloat(cleanStr);
    if (isNaN(num)) return 0;
    if (cleanStr.toUpperCase().includes('M')) return Math.round(num * 1000000);
    if (cleanStr.toUpperCase().includes('K')) return Math.round(num * 1000);
    return Math.round(num);
  };
  
  const followers = parseFollowers(socialHandles.followers || '0');
  
  const mapped: Influencer = {
    id: apiInfluencer.id,
    username: apiInfluencer.name || '',
    fullName: apiInfluencer.name || '',
    platform: (socialHandles.platform?.toLowerCase() || 'instagram') as any,
    profileImage: apiInfluencer.imageUrl || '',
    followers: followers,
    following: 0, // Not provided by API
    totalPosts: 0, // Not provided by API
    bio: '',
    verified: apiInfluencer.trustScore >= 80,
    category: apiInfluencer.niche || 'Other',
    location: '',
    email: '',
    phone: '',
    joinedDate: apiInfluencer.createdAt || new Date().toISOString(),
    lastActive: apiInfluencer.lastUpdated || new Date().toISOString(),
    
    // Metrics - calculated from available data
    engagementRate: Math.max(0, (apiInfluencer.avgSentiment || 0) * 10 + 5), // Convert sentiment to engagement
    averageLikes: Math.round(followers * 0.05), // Estimate
    averageComments: Math.round(followers * 0.01), // Estimate
    averageShares: Math.round(followers * 0.005), // Estimate
    reachRate: Math.min(100, apiInfluencer.trustScore || 0),
    
    // Scores
    overallScore: apiInfluencer.trustScore || 0,
    engagementScore: Math.min(100, (apiInfluencer.goodActionCount || 0) * 10),
    growthScore: Math.max(0, 100 - (apiInfluencer.dramaCount || 0) * 5),
    consistencyScore: Math.min(100, (apiInfluencer.neutralCount || 0) * 2),
    
    // Growth metrics
    followerGrowth30d: Math.round(followers * 0.05), // Estimate 5% growth
    followerGrowth7d: Math.round(followers * 0.01), // Estimate 1% growth
    
    // Status
    status: 'active',
    tier: apiInfluencer.trustScore >= 90 ? 'platinum' : 
          apiInfluencer.trustScore >= 75 ? 'gold' : 
          apiInfluencer.trustScore >= 60 ? 'silver' : 'bronze',
  };
  
  if (API_CONFIG.debug) {
    console.log('Mapped influencer result:', mapped);
  }
  
  return mapped;
}

// ============================================
// INFLUENCERS API
// ============================================

export async function fetchInfluencers(
  filters?: FilterOptions,
  sort?: SortOption
): Promise<Influencer[]> {
  const params: Record<string, any> = {
    limit: 100, // Default limit
  };
  
  // Add sorting
  if (sort) {
    params.sortBy = sort.field;
    params.sortOrder = sort.direction;
  } else {
    // Default sort by trust score
    params.sortBy = 'trustScore';
    params.sortOrder = 'desc';
  }
  
  // Add filters
  if (filters) {
    if (filters.platform?.length) {
      params.platform = filters.platform.join(',');
    }
    if (filters.category?.length) {
      params.category = filters.category.join(',');
    }
    if (filters.tier?.length) {
      params.tier = filters.tier.join(',');
    }
    if (filters.status?.length) {
      params.status = filters.status.join(',');
    }
    if (filters.minFollowers) {
      params.minFollowers = filters.minFollowers;
    }
    if (filters.maxFollowers) {
      params.maxFollowers = filters.maxFollowers;
    }
    if (filters.minEngagement) {
      params.minEngagement = filters.minEngagement;
    }
    if (filters.maxEngagement) {
      params.maxEngagement = filters.maxEngagement;
    }
  }
  
  const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.influencers}`;
  const fullUrl = buildURL(url, params);
  const apiInfluencers = await apiFetch<any[]>(fullUrl);
  
  // Map API response to our Influencer type
  return apiInfluencers.map(mapAPIInfluencer);
}

export async function fetchInfluencerById(id: string): Promise<Influencer | null> {
  try {
    const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.influencerById(id)}`;
    return await apiFetch<Influencer>(url);
  } catch (error) {
    console.error('Failed to fetch influencer:', error);
    return null;
  }
}

export async function createInfluencer(data: Partial<Influencer>): Promise<Influencer> {
  const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.influencers}`;
  return apiFetch<Influencer>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateInfluencer(id: string, data: Partial<Influencer>): Promise<Influencer> {
  const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.influencerById(id)}`;
  return apiFetch<Influencer>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteInfluencer(id: string): Promise<void> {
  const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.influencerById(id)}`;
  await apiFetch<void>(url, {
    method: 'DELETE',
  });
}

// ============================================
// SEARCH API
// ============================================

export async function searchInfluencers(query: string): Promise<Influencer[]> {
  const baseUrl = `${API_CONFIG.baseURL}${API_ENDPOINTS.search}`;
  const url = buildURL(baseUrl, { q: query });
  const apiInfluencers = await apiFetch<any[]>(url);
  return apiInfluencers.map(mapAPIInfluencer);
}

// ============================================
// STATS API
// ============================================

export async function fetchStats(): Promise<any> {
  const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.stats}`;
  return apiFetch<any>(url);
}

// ============================================
// NICHES/CATEGORIES API
// ============================================

export async function fetchNiches(): Promise<string[]> {
  const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.niches}`;
  return apiFetch<string[]>(url);
}

// ============================================
// ANALYTICS API (Combines stats and top influencers)
// ============================================

export async function fetchAnalytics(): Promise<Analytics> {
  try {
    // Fetch top 20 influencers by trust score (as specified)
    // Use fetchInfluencers to get properly mapped data
    const influencers = await fetchInfluencers(
      undefined,
      { field: 'overallScore', direction: 'desc' }
    );
    
    // Limit to top 20
    const top20 = influencers.slice(0, 20);
    
    // Try to fetch stats, but don't fail if not available
    let stats: any = {};
    try {
      stats = await fetchStats();
    } catch (error) {
      console.warn('Stats endpoint not available, calculating from influencers');
      
      // Calculate stats from influencers data
      const activeInfluencers = influencers.filter(i => i.status === 'active').length;
      const totalFollowers = influencers.reduce((sum, i) => sum + (i.followers || 0), 0);
      const avgEngagement = influencers.reduce((sum, i) => sum + (i.engagementRate || 0), 0) / influencers.length;
      
      stats = {
        totalInfluencers: influencers.length,
        activeInfluencers,
        totalFollowers,
        averageEngagement: avgEngagement,
      };
    }
    
    // Transform API response to match Analytics interface
    return {
      totalInfluencers: stats.totalInfluencers || influencers.length,
      activeInfluencers: stats.activeInfluencers || influencers.filter(i => i.status === 'active').length,
      totalFollowers: stats.totalFollowers || influencers.reduce((sum, i) => sum + (i.followers || 0), 0),
      averageEngagement: stats.averageEngagement || 0,
      topPerformers: influencers.slice(0, 5), // Top 5 from the 20 fetched
      recentActivity: stats.recentActivity || [],
      growthTrend: stats.growthTrend || [],
    };
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    throw error;
  }
}

// ============================================
// RANKINGS API
// ============================================

export async function fetchRankings(): Promise<Ranking[]> {
  try {
    const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.rankings}`;
    return await apiFetch<Ranking[]>(url);
  } catch (error) {
    console.error('Rankings endpoint not available, generating from influencers');
    
    // Fallback: Generate rankings from influencers
    const influencers = await fetchInfluencers(
      undefined,
      { field: 'overallScore', direction: 'desc' }
    );
    
    return influencers.map((influencer, index) => ({
      rank: index + 1,
      previousRank: index + 1, // TODO: Track historical ranks
      influencer,
      score: influencer.overallScore,
      change: 0,
      trend: 'stable' as const,
    }));
  }
}

// ============================================
// EVENTS API (May not be available in backend)
// ============================================

export async function fetchEvents(): Promise<Event[]> {
  try {
    const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.events}`;
    return await apiFetch<Event[]>(url);
  } catch (error) {
    console.error('Events endpoint not available');
    return [];
  }
}

export async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.eventById(id)}`;
    return await apiFetch<Event>(url);
  } catch (error) {
    console.error('Failed to fetch event:', error);
    return null;
  }
}

// ============================================
// QR SCANS API (May not be available in backend)
// ============================================

export async function fetchQRScans(): Promise<QRScan[]> {
  // This endpoint may not exist in the backend
  // Return empty array for now
  console.warn('QR Scans endpoint not implemented in backend');
  return [];
}

export async function createQRScan(data: Partial<QRScan>): Promise<QRScan> {
  // This endpoint may not exist in the backend
  console.warn('QR Scans endpoint not implemented in backend');
  throw new Error('QR Scans not supported by backend');
}
