-- Enable UUID generation (usually already enabled in Supabase)
create extension if not exists "pgcrypto";

-- ============================================
-- INFLUENCER CORE
-- ============================================

create table "Influencer" (
  "id" uuid primary key default gen_random_uuid(),
  "name" text not null unique,
  "imageUrl" text,
  "summary" text,
  "socialHandles" text,
  "niche" text,
  "trustScore" double precision not null default 50.0,
  "dramaCount" integer not null default 0,
  "goodActionCount" integer not null default 0,
  "neutralCount" integer not null default 0,
  "avgSentiment" double precision not null default 0.0,
  "language" text not null default 'fr',
  "lastUpdated" timestamptz not null default now(),
  "createdAt" timestamptz not null default now()
);

create index "idx_Influencer_trustScore" on "Influencer" ("trustScore");
create index "idx_Influencer_name" on "Influencer" ("name");

create table "Mention" (
  "id" uuid primary key default gen_random_uuid(),
  "influencerId" uuid not null,
  "source" text not null,
  "sourceUrl" text not null,
  "textExcerpt" text not null,
  "sentimentScore" double precision not null,
  "label" text not null,
  "scrapedAt" timestamptz not null default now(),

  constraint "Mention_influencerId_fkey"
    foreign key ("influencerId")
    references "Influencer"("id")
    on delete cascade
);

create index "idx_Mention_influencerId" on "Mention" ("influencerId");
create index "idx_Mention_label" on "Mention" ("label");
create index "idx_Mention_scrapedAt" on "Mention" ("scrapedAt");

create table "AnalysisHistory" (
  "id" uuid primary key default gen_random_uuid(),
  "influencerId" uuid not null,
  "trustScore" double precision not null,
  "dramaCount" integer not null,
  "goodActionCount" integer not null,
  "neutralCount" integer not null,
  "avgSentiment" double precision not null,
  "analyzedAt" timestamptz not null default now(),

  constraint "AnalysisHistory_influencerId_fkey"
    foreign key ("influencerId")
    references "Influencer"("id")
    on delete cascade
);

create index "idx_AnalysisHistory_influencerId" on "AnalysisHistory" ("influencerId");
create index "idx_AnalysisHistory_analyzedAt" on "AnalysisHistory" ("analyzedAt");

-- ============================================
-- USER MANAGEMENT
-- ============================================

create table "User" (
  "id" uuid primary key default gen_random_uuid(),
  "email" text not null unique,
  "passwordHash" text not null,
  "role" text not null default 'COMMUNITY',   -- COMMUNITY, PROFESSIONAL, ADMIN
  "status" text not null default 'ACTIVE',    -- ACTIVE, SUSPENDED, DELETED

  "firstName" text,
  "lastName" text,
  "company" text,
  "avatar" text,

  "subscriptionTier" text,
  "subscriptionStatus" text,
  "subscriptionExpiry" timestamptz,

  "createdAt" timestamptz not null default now(),
  "lastLoginAt" timestamptz,
  "emailVerified" boolean not null default false
);

create index "idx_User_email" on "User" ("email");
create index "idx_User_role" on "User" ("role");

-- ============================================
-- COMMUNITY FEATURES
-- ============================================

create table "CommunitySignal" (
  "id" uuid primary key default gen_random_uuid(),

  "userId" uuid not null,
  "influencerId" uuid not null,

  "type" text not null,          -- RATING, DRAMA_REPORT, POSITIVE_ACTION, COMMENT
  "rating" integer,
  "comment" text,
  "tags" text,

  "isVerified" boolean not null default false,
  "verifiedAt" timestamptz,

  "isHidden" boolean not null default false,
  "hiddenReason" text,

  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),

  constraint "CommunitySignal_userId_fkey"
    foreign key ("userId")
    references "User"("id")
    on delete cascade,

  constraint "CommunitySignal_influencerId_fkey"
    foreign key ("influencerId")
    references "Influencer"("id")
    on delete cascade
);

create index "idx_CommunitySignal_influencerId" on "CommunitySignal" ("influencerId");
create index "idx_CommunitySignal_userId" on "CommunitySignal" ("userId");
create index "idx_CommunitySignal_type" on "CommunitySignal" ("type");
create index "idx_CommunitySignal_createdAt" on "CommunitySignal" ("createdAt");

create table "CommunityTrustScore" (
  "id" uuid primary key default gen_random_uuid(),
  "influencerId" uuid not null unique,

  "avgRating" double precision not null default 0.0,
  "totalRatings" integer not null default 0,
  "totalDramaReports" integer not null default 0,
  "totalPositiveReports" integer not null default 0,
  "totalComments" integer not null default 0,

  "communityScore" double precision not null default 50.0,
  "combinedScore" double precision not null default 50.0,

  "lastUpdated" timestamptz not null default now(),

  constraint "CommunityTrustScore_influencerId_fkey"
    foreign key ("influencerId")
    references "Influencer"("id")
    on delete cascade
);

create index "idx_CommunityTrustScore_communityScore" on "CommunityTrustScore" ("communityScore");
create index "idx_CommunityTrustScore_combinedScore" on "CommunityTrustScore" ("combinedScore");

-- ============================================
-- DEEPSEARCH ANALYSIS
-- ============================================

create table "DeepSearchAnalysis" (
  "id" uuid primary key default gen_random_uuid(),

  "influencerId" uuid not null,
  "status" text not null default 'PENDING',     -- PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED
  "analysisData" text,

  "queriesRun" integer not null default 0,
  "sourcesAnalyzed" integer not null default 0,
  "processingTimeMs" integer,

  "isPublic" boolean not null default false,
  "firstBuyerId" uuid,
  "unlockedAt" timestamptz,

  "basePrice" double precision not null default 99.99,

  "createdAt" timestamptz not null default now(),
  "completedAt" timestamptz,

  constraint "DeepSearchAnalysis_influencerId_fkey"
    foreign key ("influencerId")
    references "Influencer"("id")
    on delete cascade,

  constraint "DeepSearchAnalysis_firstBuyerId_fkey"
    foreign key ("firstBuyerId")
    references "User"("id")
    on delete set null
);

create index "idx_DeepSearchAnalysis_influencerId" on "DeepSearchAnalysis" ("influencerId");
create index "idx_DeepSearchAnalysis_status" on "DeepSearchAnalysis" ("status");
create index "idx_DeepSearchAnalysis_isPublic" on "DeepSearchAnalysis" ("isPublic");

-- ============================================
-- PAYMENT & ORDERS
-- ============================================

create table "DeepSearchOrder" (
  "id" uuid primary key default gen_random_uuid(),

  "userId" uuid not null,
  "deepSearchId" uuid not null,

  "status" text not null default 'PENDING',     -- PENDING, PAID, FAILED, REFUNDED, CANCELLED

  "amount" double precision not null,
  "currency" text not null default 'EUR',
  "platformFee" double precision not null,

  "isFirstBuyer" boolean not null default false,
  "wasFree" boolean not null default false,

  "createdAt" timestamptz not null default now(),
  "paidAt" timestamptz,

  constraint "DeepSearchOrder_userId_fkey"
    foreign key ("userId")
    references "User"("id")
    on delete cascade,

  constraint "DeepSearchOrder_deepSearchId_fkey"
    foreign key ("deepSearchId")
    references "DeepSearchAnalysis"("id")
    on delete cascade
);

create index "idx_DeepSearchOrder_userId" on "DeepSearchOrder" ("userId");
create index "idx_DeepSearchOrder_deepSearchId" on "DeepSearchOrder" ("deepSearchId");
create index "idx_DeepSearchOrder_status" on "DeepSearchOrder" ("status");

create table "Payment" (
  "id" uuid primary key default gen_random_uuid(),

  "orderId" uuid not null unique,
  "userId" uuid not null,

  "provider" text not null,              -- STRIPE, PAYPAL, MOCK
  "providerPaymentId" text,

  "amount" double precision not null,
  "currency" text not null default 'EUR',

  "status" text not null,
  "metadata" text,

  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),

  constraint "Payment_orderId_fkey"
    foreign key ("orderId")
    references "DeepSearchOrder"("id")
    on delete cascade,

  constraint "Payment_userId_fkey"
    foreign key ("userId")
    references "User"("id")
    on delete cascade
);

create index "idx_Payment_userId" on "Payment" ("userId");
create index "idx_Payment_status" on "Payment" ("status");