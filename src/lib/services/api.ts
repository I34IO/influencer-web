// API Service Layer - Direct Supabase Connection
import { 
  Influencer, 
  Ranking, 
  QRScan, 
  Event, 
  Analytics, 
  FilterOptions, 
  SortOption 
} from '@/types';
import { supabase } from '@/lib/supabase/client';

// Map database influencer to our Influencer type
function mapDBInfluencer(dbInfluencer: any): Influencer {
  // Parse social handles - it's a JSON string
  let socialHandles: any = { platform: 'Instagram', followers: '0' };
  
  if (dbInfluencer.socialHandles) {
    try {
      socialHandles = JSON.parse(dbInfluencer.socialHandles);
    } catch (e) {
      console.warn('Failed to parse socialHandles for', dbInfluencer.name, ':', e);
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
    id: dbInfluencer.id,
    username: dbInfluencer.name || '',
    fullName: dbInfluencer.name || '',
    platform: (socialHandles.platform?.toLowerCase() || 'instagram') as any,
    profileImage: dbInfluencer.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbInfluencer.name || 'User')}&size=200&background=random&color=fff&bold=true&format=png`,
    followers: followers,
    following: 0,
    totalPosts: 0,
    bio: dbInfluencer.summary || '',
    verified: dbInfluencer.trustScore >= 80,
    category: dbInfluencer.niche || 'Other',
    location: '',
    email: '',
    phone: '',
    joinedDate: dbInfluencer.createdAt || new Date().toISOString(),
    lastActive: dbInfluencer.lastUpdated || new Date().toISOString(),
    
    // Metrics
    engagementRate: Math.max(0, (dbInfluencer.avgSentiment || 0) * 10 + 5),
    averageLikes: Math.round(followers * 0.05),
    averageComments: Math.round(followers * 0.01),
    averageShares: Math.round(followers * 0.005),
    reachRate: Math.min(100, dbInfluencer.trustScore || 0),
    
    // Scores
    overallScore: dbInfluencer.trustScore || 0,
    engagementScore: Math.min(100, (dbInfluencer.goodActionCount || 0) * 10),
    growthScore: Math.max(0, 100 - (dbInfluencer.dramaCount || 0) * 5),
    consistencyScore: Math.min(100, (dbInfluencer.neutralCount || 0) * 2),
    
    // Growth metrics
    followerGrowth30d: Math.round(followers * 0.05),
    followerGrowth7d: Math.round(followers * 0.01),
    
    // Status
    status: 'active',
    tier: dbInfluencer.trustScore >= 90 ? 'platinum' : 
          dbInfluencer.trustScore >= 75 ? 'gold' : 
          dbInfluencer.trustScore >= 60 ? 'silver' : 'bronze',
  };
  
  return mapped;
}

// ============================================
// INFLUENCERS API
// ============================================

export async function fetchInfluencers(
  filters?: FilterOptions,
  sort?: SortOption
): Promise<Influencer[]> {
  try {
    let query = supabase.from('Influencer').select('*');
    
    // Add sorting
    const sortField = sort?.field || 'trustScore';
    const sortDirection = sort?.direction || 'desc';
    
    // Map frontend sort fields to database columns
    const fieldMap: Record<string, string> = {
      'overallScore': 'trustScore',
      'trustScore': 'trustScore',
      'name': 'name',
      'createdAt': 'createdAt',
      'lastUpdated': 'lastUpdated',
    };
    
    const dbField = fieldMap[sortField] || 'trustScore';
    query = query.order(dbField, { ascending: sortDirection === 'asc' });
    
    // Add filters
    if (filters) {
      if (filters.category?.length) {
        query = query.in('niche', filters.category);
      }
      if (filters.minFollowers || filters.maxFollowers) {
        // Note: Followers are stored in socialHandles JSON, complex filtering
        // For now, we'll fetch all and filter client-side
      }
    }
    
    // Limit results
    query = query.limit(100);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return (data || []).map(mapDBInfluencer);
  } catch (error) {
    console.error('Failed to fetch influencers:', error);
    throw error;
  }
}

export async function fetchInfluencerById(id: string): Promise<Influencer | null> {
  try {
    const { data, error } = await supabase
      .from('Influencer')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return null;
    }
    
    return data ? mapDBInfluencer(data) : null;
  } catch (error) {
    console.error('Failed to fetch influencer:', error);
    return null;
  }
}

export async function createInfluencer(data: Partial<Influencer>): Promise<Influencer> {
  try {
    const { data: newInfluencer, error } = await supabase
      .from('Influencer')
      .insert({
        name: data.fullName || data.username,
        imageUrl: data.profileImage,
        summary: data.bio,
        socialHandles: JSON.stringify({
          platform: data.platform,
          followers: data.followers?.toString() || '0',
        }),
        niche: data.category,
        language: 'fr',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return mapDBInfluencer(newInfluencer);
  } catch (error) {
    console.error('Failed to create influencer:', error);
    throw error;
  }
}

export async function updateInfluencer(id: string, data: Partial<Influencer>): Promise<Influencer> {
  try {
    const updateData: any = {};
    
    if (data.fullName || data.username) {
      updateData.name = data.fullName || data.username;
    }
    if (data.profileImage) {
      updateData.imageUrl = data.profileImage;
    }
    if (data.bio) {
      updateData.summary = data.bio;
    }
    if (data.category) {
      updateData.niche = data.category;
    }
    if (data.overallScore !== undefined) {
      updateData.trustScore = data.overallScore;
    }
    
    updateData.lastUpdated = new Date().toISOString();
    
    const { data: updated, error } = await supabase
      .from('Influencer')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return mapDBInfluencer(updated);
  } catch (error) {
    console.error('Failed to update influencer:', error);
    throw error;
  }
}

export async function deleteInfluencer(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('Influencer')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete influencer:', error);
    throw error;
  }
}

// ============================================
// SEARCH API
// ============================================

export async function searchInfluencers(query: string): Promise<Influencer[]> {
  try {
    const { data, error } = await supabase
      .from('Influencer')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(50);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return (data || []).map(mapDBInfluencer);
  } catch (error) {
    console.error('Failed to search influencers:', error);
    throw error;
  }
}

// ============================================
// STATS API
// ============================================

export async function fetchStats(): Promise<any> {
  try {
    // Get total count
    const { count: totalInfluencers, error: countError } = await supabase
      .from('Influencer')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Supabase error:', countError);
    }
    
    // Get all influencers for calculations
    const { data: influencers, error } = await supabase
      .from('Influencer')
      .select('trustScore, dramaCount, goodActionCount');
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    const totalDramas = influencers?.reduce((sum, i) => sum + (i.dramaCount || 0), 0) || 0;
    const totalGoodActions = influencers?.reduce((sum, i) => sum + (i.goodActionCount || 0), 0) || 0;
    const avgTrustScore = influencers?.length 
      ? influencers.reduce((sum, i) => sum + (i.trustScore || 0), 0) / influencers.length 
      : 0;
    
    return {
      totalInfluencers: totalInfluencers || 0,
      totalDramas,
      totalGoodActions,
      avgTrustScore: Math.round(avgTrustScore * 10) / 10,
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    throw error;
  }
}

// ============================================
// NICHES/CATEGORIES API
// ============================================

export async function fetchNiches(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('Influencer')
      .select('niche')
      .not('niche', 'is', null);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    // Get unique niches
    const niches = [...new Set(data?.map(i => i.niche).filter(Boolean) || [])];
    return niches as string[];
  } catch (error) {
    console.error('Failed to fetch niches:', error);
    throw error;
  }
}

// ============================================
// ANALYTICS API
// ============================================

export async function fetchAnalytics(): Promise<Analytics> {
  try {
    // Fetch top 20 influencers by overall score
    const influencers = await fetchInfluencers(
      undefined,
      { field: 'overallScore', direction: 'desc' }
    );
    
    const stats = await fetchStats();
    
    const activeInfluencers = influencers.filter(i => i.status === 'active').length;
    const totalFollowers = influencers.reduce((sum, i) => sum + (i.followers || 0), 0);
    const avgEngagement = influencers.length > 0 
      ? influencers.reduce((sum, i) => sum + (i.engagementRate || 0), 0) / influencers.length 
      : 0;
    
    return {
      totalInfluencers: stats.totalInfluencers || 0,
      activeInfluencers: activeInfluencers,
      totalFollowers: totalFollowers,
      averageEngagement: avgEngagement,
      topPerformers: influencers.slice(0, 5),
      recentActivity: [],
      growthTrend: [],
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
    const influencers = await fetchInfluencers(
      undefined,
      { field: 'overallScore', direction: 'desc' }
    );
    
    return influencers.map((influencer, index) => ({
      rank: index + 1,
      previousRank: index + 1,
      influencer,
      score: influencer.overallScore,
      change: 0,
      trend: 'stable' as const,
    }));
  } catch (error) {
    console.error('Failed to fetch rankings:', error);
    throw error;
  }
}

// ============================================
// EVENTS API
// ============================================

export async function fetchEvents(): Promise<Event[]> {
  // Events table may not exist yet
  console.warn('Events endpoint not implemented');
  return [];
}

export async function fetchEventById(id: string): Promise<Event | null> {
  console.warn('Events endpoint not implemented');
  return null;
}

// ============================================
// QR SCANS API
// ============================================

export async function fetchQRScans(): Promise<QRScan[]> {
  console.warn('QR Scans endpoint not implemented');
  return [];
}

export async function createQRScan(data: Partial<QRScan>): Promise<QRScan> {
  console.warn('QR Scans endpoint not implemented');
  throw new Error('QR Scans not supported');
}
