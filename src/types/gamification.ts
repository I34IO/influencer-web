// Gamification System Types

export type AchievementType =
  | 'FIRST_RATING'
  | 'RATING_MASTER'
  | 'DRAMA_DETECTOR'
  | 'POSITIVE_VIBES'
  | 'TRUSTED_VOTER'
  | 'STREAK_KEEPER'
  | 'INFLUENCER_HUNTER';

export type LeaderboardType =
  | 'TOP_RATED'
  | 'MOST_IMPROVED'
  | 'HIGHEST_RISK'
  | 'TRENDING'
  | 'TOP_USERS'
  | 'TOP_CONTRIBUTORS';

export type LeaderboardPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';

export type TrendType = 'RISING' | 'FALLING' | 'CONTROVERSIAL' | 'IMPROVING';

export interface UserEngagementStats {
  id: string;
  userId: string;
  totalRatings: number;
  totalReports: number;
  totalComments: number;
  helpfulVotes: number;
  notHelpfulVotes: number;
  reputationScore: number; // 0-100
  level: number;
  experiencePoints: number;
  streak: number;
  lastActiveDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementType: AchievementType;
  achievementLevel: number; // 1-4
  progress: number;
  progressTarget: number;
  unlockedAt?: string;
  createdAt: string;
}

export interface Achievement {
  type: AchievementType;
  name: string;
  description: string;
  icon: string;
  levels: AchievementLevel[];
}

export interface AchievementLevel {
  level: number;
  name: string;
  description: string;
  target: number;
  xpReward: number;
  badge: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface LeaderboardCache {
  id: string;
  leaderboardType: LeaderboardType;
  period: LeaderboardPeriod;
  data: any; // JSON data
  calculatedAt: string;
  expiresAt: string;
}

export interface TrendingInfluencer {
  id: string;
  influencerId: string;
  trendType: TrendType;
  trendScore: number;
  scoreChange: number;
  scoreChangePercent: number;
  periodStart: string;
  periodEnd: string;
  reason?: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  username?: string;
  profileImage?: string;
  score: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  metadata?: Record<string, any>;
}

export interface UserStats {
  level: number;
  experiencePoints: number;
  xpForNextLevel: number;
  xpProgress: number; // percentage
  totalRatings: number;
  totalReports: number;
  totalComments: number;
  reputationScore: number;
  streak: number;
  achievements: UserAchievement[];
  unlockedAchievements: number;
  totalAchievements: number;
}

// XP Rewards
export const XP_REWARDS = {
  RATING: 5,
  REPORT: 10,
  COMMENT: 3,
  HELPFUL_VOTE: 2,
  STREAK_BONUS: 5,
} as const;

// Achievement Definitions
export const ACHIEVEMENTS: Record<AchievementType, Achievement> = {
  FIRST_RATING: {
    type: 'FIRST_RATING',
    name: 'First Steps',
    description: 'Rate your first influencer',
    icon: '⭐',
    levels: [
      {
        level: 1,
        name: 'First Rating',
        description: 'Rate your first influencer',
        target: 1,
        xpReward: 10,
        badge: 'bronze',
      },
    ],
  },
  RATING_MASTER: {
    type: 'RATING_MASTER',
    name: 'Rating Master',
    description: 'Rate multiple influencers',
    icon: '🌟',
    levels: [
      {
        level: 1,
        name: 'Novice Rater',
        description: 'Rate 10 influencers',
        target: 10,
        xpReward: 50,
        badge: 'bronze',
      },
      {
        level: 2,
        name: 'Experienced Rater',
        description: 'Rate 50 influencers',
        target: 50,
        xpReward: 100,
        badge: 'silver',
      },
      {
        level: 3,
        name: 'Expert Rater',
        description: 'Rate 100 influencers',
        target: 100,
        xpReward: 200,
        badge: 'gold',
      },
      {
        level: 4,
        name: 'Master Rater',
        description: 'Rate 500 influencers',
        target: 500,
        xpReward: 500,
        badge: 'platinum',
      },
    ],
  },
  DRAMA_DETECTOR: {
    type: 'DRAMA_DETECTOR',
    name: 'Drama Detector',
    description: 'Report drama events',
    icon: '🚨',
    levels: [
      {
        level: 1,
        name: 'Watchful Eye',
        description: 'Report 5 drama events',
        target: 5,
        xpReward: 30,
        badge: 'bronze',
      },
      {
        level: 2,
        name: 'Drama Hunter',
        description: 'Report 20 drama events',
        target: 20,
        xpReward: 75,
        badge: 'silver',
      },
      {
        level: 3,
        name: 'Drama Expert',
        description: 'Report 50 drama events',
        target: 50,
        xpReward: 150,
        badge: 'gold',
      },
    ],
  },
  POSITIVE_VIBES: {
    type: 'POSITIVE_VIBES',
    name: 'Positive Vibes',
    description: 'Report positive actions',
    icon: '✨',
    levels: [
      {
        level: 1,
        name: 'Good Finder',
        description: 'Report 5 positive actions',
        target: 5,
        xpReward: 30,
        badge: 'bronze',
      },
      {
        level: 2,
        name: 'Positivity Champion',
        description: 'Report 20 positive actions',
        target: 20,
        xpReward: 75,
        badge: 'silver',
      },
      {
        level: 3,
        name: 'Beacon of Hope',
        description: 'Report 50 positive actions',
        target: 50,
        xpReward: 150,
        badge: 'gold',
      },
    ],
  },
  TRUSTED_VOTER: {
    type: 'TRUSTED_VOTER',
    name: 'Trusted Voter',
    description: 'Earn helpful votes',
    icon: '👍',
    levels: [
      {
        level: 1,
        name: 'Helpful Contributor',
        description: 'Earn 10 helpful votes',
        target: 10,
        xpReward: 40,
        badge: 'bronze',
      },
      {
        level: 2,
        name: 'Trusted Voice',
        description: 'Earn 50 helpful votes',
        target: 50,
        xpReward: 100,
        badge: 'silver',
      },
      {
        level: 3,
        name: 'Community Leader',
        description: 'Earn 100 helpful votes',
        target: 100,
        xpReward: 250,
        badge: 'gold',
      },
    ],
  },
  STREAK_KEEPER: {
    type: 'STREAK_KEEPER',
    name: 'Streak Keeper',
    description: 'Stay active consecutively',
    icon: '🔥',
    levels: [
      {
        level: 1,
        name: 'Week Warrior',
        description: 'Stay active for 7 days',
        target: 7,
        xpReward: 50,
        badge: 'bronze',
      },
      {
        level: 2,
        name: 'Month Master',
        description: 'Stay active for 30 days',
        target: 30,
        xpReward: 150,
        badge: 'silver',
      },
      {
        level: 3,
        name: 'Century Champion',
        description: 'Stay active for 100 days',
        target: 100,
        xpReward: 500,
        badge: 'gold',
      },
    ],
  },
  INFLUENCER_HUNTER: {
    type: 'INFLUENCER_HUNTER',
    name: 'Influencer Hunter',
    description: 'Rate many different influencers',
    icon: '🎯',
    levels: [
      {
        level: 1,
        name: 'Explorer',
        description: 'Rate 20 different influencers',
        target: 20,
        xpReward: 60,
        badge: 'bronze',
      },
      {
        level: 2,
        name: 'Discoverer',
        description: 'Rate 50 different influencers',
        target: 50,
        xpReward: 120,
        badge: 'silver',
      },
      {
        level: 3,
        name: 'Connoisseur',
        description: 'Rate 100 different influencers',
        target: 100,
        xpReward: 300,
        badge: 'gold',
      },
    ],
  },
};

// Helper function to calculate level from XP
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Helper function to calculate XP needed for a level
export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

// Helper function to calculate XP progress percentage
export function calculateXPProgress(currentXP: number, currentLevel: number): number {
  const xpForCurrentLevel = xpForLevel(currentLevel);
  const xpForNextLevel = xpForLevel(currentLevel + 1);
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  return Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);
}
