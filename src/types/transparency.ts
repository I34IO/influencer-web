// Transparency Features Types

export type EventType = 'MENTION' | 'COMMUNITY_SIGNAL' | 'MANUAL_ADJUSTMENT';
export type ImpactType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ReviewRequestType = 'DISPUTE' | 'CORRECTION' | 'REMOVAL';

export interface ScoreImpactLog {
  id: string;
  influencerId: string;
  eventType: EventType;
  eventId?: string;
  impactType: ImpactType;
  impactAmount: number;
  oldScore: number;
  newScore: number;
  reason: string;
  details?: any;
  createdAt: string;
}

export interface ClaimRequest {
  id: string;
  influencerId: string;
  userId: string;
  status: ClaimStatus;
  proofType?: string;
  proofUrl?: string;
  proofText?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  id: string;
  influencerId: string;
  mentionId?: string;
  signalId?: string;
  requestedBy: string;
  requestType: ReviewRequestType;
  reason: string;
  evidence?: string;
  status: ClaimStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventTimelineEntry {
  eventId: string;
  eventType: EventType;
  eventDate: string;
  impactType: ImpactType;
  impactAmount: number;
  scoreChange: number;
  description: string;
  details?: any;
}

export interface ScoreBreakdown {
  aiScore: {
    value: number;
    weight: number;
    components: {
      baseScore: number;
      dramaImpact: number;
      positiveImpact: number;
      sentimentAdjustment: number;
    };
  };
  communityScore: {
    value: number;
    weight: number;
    components: {
      averageRating: number;
      totalRatings: number;
      dramaReports: number;
      positiveReports: number;
      ratingImpact: number;
      dramaImpact: number;
      positiveImpact: number;
    };
  };
  combinedScore: {
    value: number;
    calculation: string;
  };
  metadata: {
    totalDramaReports: number;
    totalPositiveReports: number;
    totalRatings: number;
    averageRating: number;
  };
}

// API Request/Response Types
export interface SubmitClaimRequest {
  influencerId: string;
  proofType: string;
  proofUrl?: string;
  proofText?: string;
}

export interface SubmitReviewRequest {
  influencerId: string;
  mentionId?: string;
  signalId?: string;
  requestType: ReviewRequestType;
  reason: string;
  evidence?: string;
}

export interface GetTimelineRequest {
  influencerId: string;
  limit?: number;
  offset?: number;
}
