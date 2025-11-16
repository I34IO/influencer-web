// Subscription System Types

export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'PROFESSIONAL';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL';
export type UsageActionType = 'REPORT' | 'API_CALL' | 'EXPORT' | 'DEEP_SEARCH';

export interface UserSubscription {
  id: string;
  userId: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStartDate: string;
  subscriptionExpiry?: string;
  monthlyReportsUsed: number;
  monthlyReportsLimit: number;
  lastResetDate: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description?: string;
  priceMonthly: number;
  priceYearly?: number;
  monthlyReportsLimit: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionUsageLog {
  id: string;
  userId: string;
  actionType: UsageActionType;
  resourceId?: string;
  createdAt: string;
}

export interface UserSubscriptionStatus {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  expiryDate?: string;
  monthlyReportsUsed: number;
  monthlyReportsLimit: number;
  reportsRemaining: number;
  usageThisMonth: number;
  plan: {
    name: string;
    description?: string;
    priceMonthly: number;
    priceYearly?: number;
    features: string[];
  };
}

// Subscription tier limits and features
export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, SubscriptionPlan> = {
  FREE: {
    id: 'free',
    tier: 'FREE',
    name: 'Free',
    description: 'Basic access to influencer ratings',
    priceMonthly: 0,
    priceYearly: 0,
    monthlyReportsLimit: 5,
    features: [
      'View influencer profiles',
      'Submit ratings',
      'View leaderboards',
      'Earn achievements',
      'Basic search',
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  PREMIUM: {
    id: 'premium',
    tier: 'PREMIUM',
    name: 'Premium',
    description: 'Enhanced features for active users',
    priceMonthly: 4.99,
    priceYearly: 49.99,
    monthlyReportsLimit: 50,
    features: [
      'Everything in Free',
      '50 monthly reports',
      'Advanced statistics',
      'Priority verification',
      'No ads',
      'Export data',
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  PROFESSIONAL: {
    id: 'professional',
    tier: 'PROFESSIONAL',
    name: 'Professional',
    description: 'Full access for professionals',
    priceMonthly: 19.99,
    priceYearly: 199.99,
    monthlyReportsLimit: -1, // Unlimited
    features: [
      'Everything in Premium',
      'Unlimited reports',
      'API access',
      'Priority support',
      'Custom analytics',
      'White-label reports',
      'Team collaboration',
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// API Request/Response Types
export interface UpgradeSubscriptionRequest {
  tier: SubscriptionTier;
  billingPeriod: 'monthly' | 'yearly';
  paymentMethodId?: string;
}

export interface CheckUsageLimitRequest {
  actionType: UsageActionType;
}

export interface CheckUsageLimitResponse {
  canPerform: boolean;
  reason?: string;
  reportsRemaining?: number;
  upgradeRequired?: boolean;
}
