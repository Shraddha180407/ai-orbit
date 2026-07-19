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


// lib/types.ts

export interface CreatorProfile {
  id: string;
  name: string;
  image: string | null;
}

export interface CollectionCategory {
  categoryName: string;
}

export interface CollectionCounts {
  relatedModels: number;
  relatedCompanies: number;
}

export interface CollectionListItem {
  id: string;
  name: string;
  slug: string;

  description: string;

  isFeatured: boolean;
  isCurated: boolean;

  toolCount: number;

  // Backend sorts/filters using this.
  // Ask backend to include it if it isn't already returned.
  updatedAt: string;

  creatorType: "EDITORIAL" | "COMMUNITY";

  creator: CreatorProfile;

  categories: CollectionCategory[];

  _count: CollectionCounts;

  // Optional until backend sends it
  bookmarked?: boolean;
}

export interface CollectionsListResponse {
  items: CollectionListItem[];
  nextCursor: string | null;
}

export interface CollectionDetailsResponse {
  collection: CollectionListItem & {
    tools: any[];
    relatedModels: any[];
    relatedCompanies: any[];
  };

  nextToolCursor: string | null;
}

export type CollectionSortOption =
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

export const SORT_OPTIONS: {
  value: CollectionSortOption;
  label: string;
}[] = [
  {
    value: "recently_updated",
    label: "Recently Updated",
  },
  {
    value: "oldest_updated",
    label: "Oldest Updated",
  },
  {
    value: "name_asc",
    label: "Name (A-Z)",
  },
  {
    value: "name_desc",
    label: "Name (Z-A)",
  },
  {
    value: "most_tools",
    label: "Most Tools",
  },
  {
    value: "fewest_tools",
    label: "Fewest Tools",
  },
  {
    value: "most_bookmarked",
    label: "Most Bookmarked",
  },
  {
    value: "most_related_models",
    label: "Most Related Models",
  },
  {
    value: "most_related_companies",
    label: "Most Related Companies",
  },
  {
    value: "featured_first",
    label: "Featured First",
  },
];

export interface CollectionsQueryParams {
  search?: string;
  sort?: SortOption;
  category?: string[];
  creatorType?: "EDITORIAL" | "COMMUNITY";
  featured?: boolean;
  hasRelatedModels?: boolean;
  hasRelatedCompanies?: boolean;
  updatedWithin?: "7d" | "30d" | "90d";
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


