import { 
  MCPItemType, 
  MCPPricingType, 
  BillingCycle, 
  EditorialGrade 
} from '@prisma/client';

export interface MCPItem {
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
  launchDate?: Date;
  lastUpdatedDate: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface MCPDirectoryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface MCPDirectorySubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId: string;
  category?: MCPDirectoryCategory;
}

export interface MCPDirectoryTag {
  id: string;
  slug: string;
  name: string;
}

export interface TechnicalSpec {
  id: string;
  supportedPlatforms: string[];
  compatibility: string;
  integrations: string[];
  localBindingControls: string;
}

export interface InstallationGuide {
  id: string;
  stepNumber: number;
  title: string;
  codeSnippet: string;
  instructions: string;
}

export interface MCPDirectoryFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface MCPFeature {
  id: string;
  title: string;
  icon?: string;
  description: string;
  badge?: string;
}

export interface MCPUseCase {
  id: string;
  title: string;
  description: string;
  applications: string[];
}

// DTOs for proper type handling
export interface PricingPlanDTO {
  id: string;
  planName: string;
  price: number;
  billingCycle: BillingCycle;
  featuresList: string[];
}

export interface PricingPlan {
  id: string;
  planName: string;
  price: string; // Keep as Decimal from Prisma
  billingCycle: BillingCycle;
  featuresList: string[];
}

export interface MCPDirectoryReview {
  id: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface MCPDirectoryEditorialReview {
  id: string;
  grade: EditorialGrade;
  verdict: string;
  reviewDate: Date;
  badge?: string;
  notes?: string;
}

export interface MCPDirectoryDiscussion {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
  replies?: MCPDirectoryDiscussionReply[];
}

export interface MCPDirectoryDiscussionReply {
  id: string;
  content: string;
  upvotes: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface MCPDirectoryUpvote {
  id: string;
  createdAt: Date;
  userId: string;
}

export interface MCPDirectorySavedMCP {
  id: string;
  createdAt: Date;
  userId: string;
}

export interface MCPDirectoryClaim {
  id: string;
  name: string;
  email: string;
  relationship: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MCPDirectoryReport {
  id: string;
  reporterId: string;
  reportedMCPItemId: string;
  reason: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MCPItemWithRelations extends MCPItem {
  categories?: MCPDirectoryCategory[];
  subCategories?: MCPDirectorySubCategory[];
  tags?: MCPDirectoryTag[];
  technicalSpecs?: TechnicalSpec[];
  installationGuides?: InstallationGuide[];
  features?: MCPFeature[];
  useCases?: MCPUseCase[];
  pricingPlans?: PricingPlanDTO[];
  reviews?: MCPDirectoryReview[];
  editorialReviews?: MCPDirectoryEditorialReview[];
  discussions?: MCPDirectoryDiscussion[];
  faqs?: MCPDirectoryFAQ[];
  alternatives?: MCPItem[];
}
// DTOs for API responses
export interface ReviewResponseDTO {
  reviews: MCPDirectoryReview[];
  statistics: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DiscussionResponseDTO {
  discussions: MCPDirectoryDiscussion[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}