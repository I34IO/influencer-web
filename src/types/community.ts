// Community Features Types

export type SignalType = 'RATING' | 'DRAMA_REPORT' | 'POSITIVE_ACTION' | 'COMMENT';
export type SignalStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type ResponseType = 'CLARIFICATION' | 'REBUTTAL' | 'ACKNOWLEDGMENT';

export interface CommunitySignal {
  id: string;
  userId: string;
  influencerId: string;
  type: SignalType;
  rating?: number; // 1-5 for RATING type
  comment?: string;
  tags?: string[];
  contentHash?: string;
  isDuplicate: boolean;
  duplicateOf?: string;
  status: SignalStatus;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationResult?: any;
  rejectionReason?: string;
  emailSent: boolean;
  emailSentAt?: string;
  isHidden: boolean;
  hiddenReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityTrustScore {
  id: string;
  influencerId: string;
  avgRating: number;
  totalRatings: number;
  totalDramaReports: number;
  totalPositiveReports: number;
  totalComments: number;
  communityScore: number; // 0-100
  combinedScore: number; // 0-100 (60% AI + 40% Community)
  lastUpdated: string;
}

export interface InfluencerResponse {
  id: string;
  influencerId: string;
  mentionId?: string;
  signalId?: string;
  responseType: ResponseType;
  responseText: string;
  evidenceUrls?: string[];
  helpfulCount: number;
  notHelpfulCount: number;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseVote {
  id: string;
  responseId: string;
  userId: string;
  isHelpful: boolean;
  createdAt: string;
}

export interface CommunityStats {
  totalRatings: number;
  averageRating: number;
  totalDramaReports: number;
  totalPositiveReports: number;
  totalComments: number;
  communityScore: number;
  combinedScore: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentSignals: CommunitySignal[];
}

// API Request/Response Types
export interface SubmitRatingRequest {
  influencerId: string;
  rating: number;
  comment?: string;
  tags?: string[];
}

export interface SubmitReportRequest {
  influencerId: string;
  type: 'DRAMA_REPORT' | 'POSITIVE_ACTION';
  comment: string;
  tags?: string[];
}

export interface SubmitCommentRequest {
  influencerId: string;
  comment: string;
  tags?: string[];
}

export interface VerifySignalRequest {
  signalId: string;
  isVerified: boolean;
  rejectionReason?: string;
}
