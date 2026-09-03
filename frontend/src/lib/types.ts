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

export const PAGE_SIZE = 100;

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
  pros: string[];
  cons: string[];
  releaseDate: string | null;
  pricingModel: PricingModel;
  pricingAmount: string | null;
  billingFrequency: BillingFrequency;
  avgRating: number | null;
  reviewCount: number;
  upvoteCount: number;
  isOpenSource: boolean;
  isTrending: boolean;
  verified: boolean;
  compatibility: string[];
  targetUsers: string[];
  hasApi: boolean;
  apiDocsUrl: string | null;
  performanceScore: number | null;
  createdAt: string;
  company: { slug: string; name: string; logoUrl: string | null } | null;
  categories: { category: { slug: string; name: string } }[];
  tags: { tag: { slug: string; name: string } }[];
  integrations: { integration: { slug: string; name: string; logoUrl: string | null } }[];
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
  subCategory?: string;
};

export type CollectionSubCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
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
  title?: string;
  description: string;
  curatedBy?: string;
  creatorType?: string;
  creator?: { id: string; name: string; image?: string | null } | null;
  category?: string;
  categories?: { categoryName?: string; name?: string; slug?: string }[];
  _count?: { relatedModels?: number; relatedCompanies?: number; tools?: number; aiModels?: number };
  featured?: boolean;
  isFeatured?: boolean;
  updatedAt: string;
  toolCount: number;
  previewTools?: { logoUrl: string | null; name: string }[];
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

export type CompanyType = 'AI_NATIVE' | 'MODEL_COMPANIES' | 'UNICORNS' | 'AI_MODEL_PROVIDERS' | 'INFRASTRUCTURE' | 'ENTERPRISE' | 'HEALTHCARE' | 'GENERATIVE_AI' | 'MARKETING' | 'DEVELOPER_TOOLS' | 'ROBOTICS' | 'EDUCATION' | 'OPEN_SOURCE' | 'FINANCE' | 'PROFITABLE' | 'RESEARCH_LABS' | 'BOOTSTRAPPED' | 'ENTERPRISE_AI';

export type Company = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  createdAt?: string;
  description?: string | null;
  website?: string | null;
  websiteUrl?: string | null;
  country?: string | null;
  city?: string | null;
  foundedYear?: number | string | null;
  headquarters?: string | null;
  type?: CompanyType[];
  companyType?: string;
  modelsCount?: number;
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

export type ModelType =
  | "TEXT"
  | "IMAGE"
  | "VIDEO"
  | "MULTIMODAL"
  | "AUDIO"
  | "CODE"
  | "THREE_D"
  | "STRUCTURED_DATA";

const MODEL_TYPE_LABELS: Record<ModelType, string> = {
  TEXT: "Text",
  IMAGE: "Image",
  VIDEO: "Video",
  MULTIMODAL: "Multimodal",
  AUDIO: "Audio",
  CODE: "Code",
  THREE_D: "3D",
  STRUCTURED_DATA: "Structured Data",
};

/**
 * The backend AIModel schema exposes `modelType` (an enum), not `type`.
 * Use this everywhere the UI needs a human-readable label instead of
 * reading a `type` field that doesn't exist on the API response.
 */
export function formatModelType(modelType?: string | null): string | null {
  if (!modelType) return null;
  return MODEL_TYPE_LABELS[modelType as ModelType] ?? modelType;
}

export type AIModel = {
  id: string;
  name: string;
  modality: string;
  description: string;
  creator: string;
  parameterSize: string;
  contextWindow: string;
  releaseDate: string;
  slug?: string;
  provider?: AIModelProvider | null;
  modelType?: ModelType;
  primaryTask?: string;
  openSource?: boolean;
  subCategories?: { id: string; name: string; slug: string }[];
  benchmarks?: { name: string; score: number | string }[];
  tags?: string[];
  similarModels?: AIModel[];
  tasks?: { task: { id: string; title: string; slug: string } }[];
  relatedModels?: AIModel[];
  updatedAt?: string;
};

export type ModelDetail = AIModel;

export type ModelFilterOptions = {
  providers: { slug: string; name: string }[];
  primaryTasks: string[];
  modelTypes: ModelType[];
};

export type ModelsSortOption =
  | "alphabetical"
  | "newest"
  | "oldest"
  | "releaseDate"
  | "downloads"
  | "contextWindow"
  | "parameterSize";

export type ModelsListResponse = {
  items: AIModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters: {
    providers: any[];
    modalities: string[];
  };
};

export type RepositoryOwnerListItem = {
  owner: string;
  count: number;
  avatarUrl?: string;
  displayName?: string;
  companySlug?: string;
  repositoryCount?: number;
  searchText?: string;
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
  companySlug?: string | null;
  subCategories?: { id: string; name: string; slug: string }[];
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

export type RepositorySubCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type ModelSubCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type MCPCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
};

export type MCPSubCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  categoryId?: string;
};

export type DeviceSubCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type Video = {
  id: string;
  url: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  publishedAt: string;
  youtubeId?: string;
  authorName?: string;
  toolCategory?: string;
  description?: string;
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
  tasks: {
    id: string;
    slug: string;
    title: string;
    description?: string;
    category?: { slug: string; name: string };
  }[];
  createdAt?: string;
  updatedAt?: string;
};

export type Robot = RobotListItem;

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
  // extended fields
  longDescription?: string | null;
  processor?: string | null;
  storage?: string | null;
  battery?: string | null;
  display?: string | null;
  connectivity?: string[] | null;
  weight?: string | null;
  aiModel?: string | null;
  processingType?: "On-device" | "Cloud" | "Hybrid" | null;
  bestFor?: string[] | null;
  qualityScore?: number | null;
  verdict?: string | null;
  subcategory?: string | null;
  platform?: string | null;
  officialWebsite?: string | null;
  officialProductUrl?: string | null;
  regionsSupported?: string[] | null;
  officialSource?: string | null;
  secondarySource?: string | null;
  lastVerifiedDate?: string | null;
  verificationNotes?: string | null;
};

// ---------------------------------------------------------------------------
// MCP Directory Page Types
// ---------------------------------------------------------------------------
export type MCPItemType = "SERVER" | "CLIENT";
export type MCPPricingType = "FREE" | "FREEMIUM" | "PAID";

export type InstallationGuide = {
  id: string;
  mcpItemId: string;
  stepNumber: number;
  title: string;
  codeSnippet: string;
  instructions: string;
};

export type TechnicalSpec = {
  id: string;
  mcpItemId: string;
  supportedPlatforms: string[];
  compatibility: string;
  integrations: string[];
  localBindingControls: string;
};

export type MCPFeature = {
  id: string;
  mcpItemId: string;
  title: string;
  description: string;
};

export type MCPItem = {
  id: string;
  itemType: MCPItemType;
  name: string;
  slug: string;
  logoUrl?: string;
  coverImageUrl?: string;
  shortDescription: string;
  fullDescription: string;
  providerName: string;
  providerUrl?: string;
  license?: string;
  pricingType: MCPPricingType;
  startingPrice?: number;
  isFeatured: boolean;
  isVerified: boolean;
  launchDate?: string;
  lastUpdatedDate: string;
  websiteUrl?: string;
  documentationUrl?: string;
  repositoryUrl?: string;
  qualityScore?: number;
  easeOfUseScore?: number;
  globalRank?: number;
  leaderboardRank?: number;
  editorialVerdict?: string;
  viewCount: number;
  monthlyVisits: number;
  upvoteCount: number;
  saveCount: number;
  createdAt: string;
  updatedAt: string;
  categories?: { name: string; slug: string }[];
  subCategories?: { name: string; slug: string }[];
  tags?: { name: string; slug: string }[];
  releases?: MCPRelease[];
  useCases?: MCPUseCase[];
  recommendations?: MCPItem[];
  similarItems?: MCPItem[];
  installationGuides?: InstallationGuide[];
  technicalSpecs?: TechnicalSpec[];
  features?: MCPFeature[];
  reviews?: { id: string; rating: number; comment?: string; user?: { name?: string } }[];
  pricingPlans?: { billingCycle?: string; price?: number; planName?: string }[];
};

export type MCPUseCase = {
  id: string;
  mcpItemId: string;
  title: string;
  description: string;
  applications: string[];
};

export type MCPRelease = {
  id: string;
  versionName: string;
  releaseDate?: string;
  summary?: string;
  description?: string;
  improvements?: string[];
};

export type MCPListResponse = {
  items: MCPItem[];
  total: number;
  page: number;
  totalPages: number;
};
