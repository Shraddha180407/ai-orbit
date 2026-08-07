import { z } from "zod";

const MCPItemType = z.enum(["SERVER", "CLIENT"]);
const MCPPricingType = z.enum(["FREE", "FREEMIUM", "PAID"]);
const BillingCycle = z.enum(["MONTHLY", "YEARLY", "ONE_TIME"]);

const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

const subCategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  categorySlug: z.string(),
});

const tagSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

const technicalSpecSchema = z.object({
  supportedPlatforms: z.array(z.string()).default([]),
  compatibility: z.string(),
  integrations: z.array(z.string()).default([]),
  localBindingControls: z.string(),
}).nullable();

const installationGuideSchema = z.object({
  stepNumber: z.number().int(),
  title: z.string(),
  codeSnippet: z.string(),
  instructions: z.string(),
});

const featureSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  badge: z.string().optional(),
});

const useCaseSchema = z.object({
  title: z.string(),
  description: z.string(),
  applications: z.array(z.string()).default([]),
});

const pricingPlanSchema = z.object({
  planName: z.string(),
  price: z.number(),
  billingCycle: BillingCycle,
  featuresList: z.array(z.string()).default([]),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const mcpItemSchema = z.object({
  itemType: MCPItemType,
  name: z.string(),
  slug: z.string(),
  logoUrl: z.string().url().nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
  shortDescription: z.string(),
  fullDescription: z.string(),
  providerName: z.string(),
  providerUrl: z.string().url().nullable().optional(),
  license: z.string().nullable().optional(),
  pricingType: MCPPricingType,
  startingPrice: z.number().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  launchDate: z.string().nullable().optional(),
  lastUpdatedDate: z.string().optional(),
  websiteUrl: z.string().url().nullable().optional(),
  documentationUrl: z.string().url().nullable().optional(),
  repositoryUrl: z.string().url().nullable().optional(),
  qualityScore: z.number().nullable().optional(),
  easeOfUseScore: z.number().nullable().optional(),
  globalRank: z.number().int().nullable().optional(),
  leaderboardRank: z.number().int().nullable().optional(),
  editorialVerdict: z.string().nullable().optional(),
  viewCount: z.number().int().default(0),
  monthlyVisits: z.number().int().default(0),
  upvoteCount: z.number().int().default(0),
  saveCount: z.number().int().default(0),

  categories: z.array(categorySchema).default([]),
  subCategories: z.array(subCategorySchema).default([]),
  tags: z.array(tagSchema).default([]),
  technicalSpecs: z.array(technicalSpecSchema).default([]),
  installationGuides: z.array(installationGuideSchema).default([]),
  features: z.array(featureSchema).default([]),
  useCases: z.array(useCaseSchema).default([]),
  pricingPlans: z.array(pricingPlanSchema).default([]),
  faqs: z.array(faqSchema).default([]),
});

export const mcpIngestPayloadSchema = z.object({
  items: z.array(mcpItemSchema),
});

export type MCPItemIngestInput = z.infer<typeof mcpItemSchema>;
export type MCPIngestPayload = z.infer<typeof mcpIngestPayloadSchema>;
