// Core Types for Influencer Tracking App

export interface Influencer {
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

export interface Ranking {
  rank: number;
  previousRank: number;
  influencer: Influencer;
  score: number;
  change: number; // positive or negative
  trend: 'up' | 'down' | 'stable';
}

export interface Post {
  id: string;
  influencerId: string;
  platform: string;
  content: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'carousel';
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagement: number;
  postedAt: string;
  hashtags: string[];
}

export interface QRScan {
  id: string;
  influencerId: string;
  influencerName: string;
  eventId: string;
  eventName: string;
  scannedAt: string;
  location: string;
  verified: boolean;
  points?: number;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  type: 'conference' | 'meetup' | 'workshop' | 'launch';
  status: 'upcoming' | 'ongoing' | 'completed';
  attendees: number;
  qrCode: string;
}

export interface Analytics {
  totalInfluencers: number;
  activeInfluencers: number;
  totalFollowers: number;
  averageEngagement: number;
  topPerformers: Influencer[];
  recentActivity: Activity[];
  growthTrend: GrowthData[];
}

export interface Activity {
  id: string;
  type: 'new_influencer' | 'rank_change' | 'milestone' | 'qr_scan' | 'post';
  influencerId: string;
  influencerName: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface GrowthData {
  date: string;
  followers: number;
  engagement: number;
  posts: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  avatar?: string;
  preferences: {
    notifications: boolean;
    emailAlerts: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface FilterOptions {
  platform?: string[];
  category?: string[];
  tier?: string[];
  status?: string[];
  minFollowers?: number;
  maxFollowers?: number;
  minEngagement?: number;
  maxEngagement?: number;
}

export interface SortOption {
  field: keyof Influencer;
  direction: 'asc' | 'desc';
}

// Export new feature types
export * from './community';
export * from './gamification';
export * from './transparency';
export * from './subscription';
