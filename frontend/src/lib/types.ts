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

export type CollectionListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  curatedBy: string;
  category: string;
  featured: boolean;
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

export type Company = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
  websiteUrl: string | null;
  foundedYear: string | null;
  headquarters: string | null;
  tools?: {
    id: string;
    slug: string;
    name: string;
    logoUrl: string | null;
    pricingModel: string;
    description: string;
    avgRating: number;
    _count: { reviews: number };
  }[];
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

export type Robot = {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  year: string;
  description: string;
};

export type Device = {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  year: string;
  description: string;
};

