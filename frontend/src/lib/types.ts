export type PricingModel = "FREE" | "FREEMIUM" | "PAID" | "FREE_TRIAL";
export type BillingFrequency = "MONTHLY" | "YEARLY" | "ONE_TIME" | "NA";

export type ToolCardData = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  description: string;
  pricingModel: PricingModel;
  pricingAmount: string | null;
  billingFrequency: BillingFrequency;
  categories: { category: { slug: string; name: string } }[];
  tags: { tag: { slug: string; name: string } }[];
  _count: { reviews: number; bookmarks: number };
  avgRating: number | null;
  company: { slug: string; name: string } | null;
  createdAt: string;
  isOpenSource: boolean;
  isTrending: boolean;
};

export type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "rating";

export type ToolsSearchParams = {
  q?: string;
  category?: string;
  pricing?: string;
  sort?: SortOption;
  page?: string;
};

export const PAGE_SIZE = 80;

// ---------------------------------------------------------------------------
// Detail page types (Step 3)
// ---------------------------------------------------------------------------

export type ReviewData = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string | null;
  };
};

export type ToolDetailData = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  description: string;
  websiteUrl: string;
  screenshots: string[];
  features: string[];
  pricingModel: PricingModel;
  pricingAmount: string | null;
  billingFrequency: BillingFrequency;
  avgRating: number | null;
  reviewCount: number;
  createdAt: string;
  company: { slug: string; name: string; logoUrl: string | null } | null;
  categories: { category: { slug: string; name: string } }[];
  tags: { tag: { slug: string; name: string } }[];
  _count: { reviews: number; bookmarks: number };
  isOpenSource: boolean;
  isTrending: boolean;
};

export type SimilarToolData = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  description: string;
  pricingModel: PricingModel;
  avgRating: number | null;
};

// ============================================================
// APPEND THIS to the END of frontend/src/lib/types.ts
// Do not remove or modify any existing type above it (ToolCardData,
// ToolDetailData, etc. belong to Module 3).
// ============================================================

export type CollectionsSearchParams = {
  category?: string;
  page?: string;
};

export type CollectionFilterParams = {
  search?: string;
  creatorType?: string;
  hasRelatedModels?: boolean;
  hasRelatedCompanies?: boolean;
  featured?: boolean;
  updatedWithin?: string;
  sort?: string;
  cursor?: string;
  category?: string[];
};

export type CollectionsApiResponse = {
  items: CollectionListItem[];
  nextCursor?: string | null;
  total?: number;
  error?: string;
};

export type CollectionListItem = {
  id: string;
  slug: string;
  name?: string;
  title: string;
  description: string;
  curatedBy: string;
  category: string;
  featured: boolean;
  isFeatured?: boolean;
  updatedAt: string;
  toolCount: number;
  previewTools: { logoUrl: string | null; name: string }[];
};

export type CollectionDetailData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  curatedBy: string;
  category: string;
  featured: boolean;
  updatedAt: string;
  toolCount: number;
  tools: ToolCardData[]; // reuses Module 3's existing ToolCardData shape
};

export type CompanyType = 'AI_NATIVE' | 'MODEL_COMPANIES' | 'TOOL_COMPANIES' | 'PROFITABLE' | 'UNICORNS';

export type Company = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  description?: string | null;
  website?: string | null;
  websiteUrl?: string | null;
  country?: string | null;
  city?: string | null;
  foundedYear?: number | string | null;
  headquarters?: string | null;
  type?: CompanyType[];
  sector?: string | null;
  verified?: boolean;
  featured?: boolean;
  valuation?: string | null;
  fundingRaised?: string | null;
  latestFundingRound?: string | null;
  employeeCount?: number | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  views?: number;
  upvotes?: number;
  impressions?: number;
  tools?: {
    id: string;
    slug: string;
    name: string;
    logoUrl?: string | null;
    pricingModel?: string;
    description?: string;
    avgRating?: number;
    _count?: { reviews: number };
  }[];
  aiModels?: {
    id: string;
    slug?: string;
    name: string;
    description?: string;
    contextWindow?: string;
    parameterSize?: string;
    modality?: string;
    releaseDate?: string;
  }[];
  _count?: {
    tools: number;
    aiModels: number;
    collectionCompanies?: number;
  };
};

export type AIModelProvider = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
};

export type AIModel = {
  id: string;
  name: string;
  modality: string;
  description: string;
  creator: string;
  parameterSize: string;
  contextWindow: string;
  releaseDate: string;
};

export type News = {
  id: string;
  url: string;
  category: string;
  source: string;
  title: string;
  summary: string;
  publishedAt: string;
  readTime: string;
};

export type Repository = {
  id: string;
  url: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  language: string;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
  ownerAvatarUrl?: string | null;
  homepage?: string | null;
  license?: string | null;
  topics?: string[];
  forks?: number;
  openIssues?: number;
  logoUrl?: string | null;
  brandColor?: string | null;
  githubCreatedAt?: string;
  syncedAt?: string;
  readmeHtml?: string;
  readmeFetchedAt?: string;
  defaultBranch?: string;
};

export type RepositoryListResponse = {
  items: Repository[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
};

export type RepositoryDetailResponse = Repository & {
  readmeHtml?: string;
  readmeFetchedAt?: string;
  defaultBranch?: string;
};

export type Video = {
  id: string;
  url: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  publishedAt: string;
};

export type RobotListItem = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  thumbnailUrl: string | null;
  company: string;
  country: string | null;
  category: string;
  availability: string;
  price: string | null;
  releaseDate: string | null;
  mainTask: string | null;
  autonomyLevel: string | null;
  primaryUseCases: string[];
  websiteUrl: string | null;
  about: string;
  specs: string | null;
  mediaUrls: string[];
  tasks: { id: string; title: string; slug: string }[];
  createdAt?: string;
  updatedAt?: string;
};

export type Robot = RobotListItem & {
  tasks: {
    id: string;
    slug: string;
    title: string;
    description?: string;
    category?: { slug: string; name: string };
  }[];
};

export type Device = {
  id: string;
  slug?: string;
  name: string;
  category: string;
  manufacturer: string;
  year: string;
  description: string;
  availability?: "Available" | "Pre-order" | "Announced" | "Discontinued" | null;
  price?: string | null;
  month?: string | null;
  imageUrl?: string | null;
  manufacturerLogoUrl?: string | null;
  mainTask?: string | null;
  mainTaskColor?: string | null;
  formFactor?: string | null;
  country?: string | null;
  ram?: string | null;
  aiFeatures?: string[];
  primaryUseCases?: string[];
  additionalInfo?: string | null;
  buyUrl?: string | null;
  images?: string[];
  videoUrl?: string | null;
};
