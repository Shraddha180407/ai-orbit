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

export interface CreatorProfile {
  id: string;
  name: string;
  image: string | null;
}

export interface CollectionCategory {
  categoryName: string;
}

export interface CollectionListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  creatorType: "EDITORIAL" | "COMMUNITY";
  toolCount: number;
  updatedAt: string;
  creator: CreatorProfile;
  categories: CollectionCategory[];
  isBookmarked?: boolean;   // ← add this
  _count: {
    relatedModels: number;
    relatedCompanies: number;
  };
}

export interface CollectionsApiResponse {
  items: CollectionListItem[];
  nextCursor: string | null;
  error?: string;
}

export interface CollectionFilterParams {
  search?: string;
  category?: string[];
  creatorType?: "EDITORIAL" | "COMMUNITY";
  hasRelatedModels?: boolean;
  hasRelatedCompanies?: boolean;
  featured?: boolean;
  updatedWithin?: string;
  sort?: string;
  cursor?: string;
}

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
};


export type CreatorType = "EDITORIAL" | "COMMUNITY";

export type CollectionSort =
  | "recently_updated"
  | "oldest_updated"
  | "name_asc"
  | "name_desc"
  | "most_tools"
  | "fewest_tools"
  | "most_bookmarked"
  | "most_related_models"
  | "most_related_companies"
  | "featured_first";