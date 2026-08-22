import { z } from "zod";

const PricingModel = z.enum(["FREE", "FREEMIUM", "PAID", "FREE_TRIAL"]);
const BillingFrequency = z.enum(["MONTHLY", "YEARLY", "ONE_TIME", "NA"]).default("NA");
const Platform = z.enum(["WEB", "WINDOWS", "MACOS", "LINUX", "IOS", "ANDROID", "CHROME_EXTENSION"]);
const UserPersona = z.enum([
  "DEVELOPERS",
  "DESIGNERS",
  "STUDENTS",
  "MARKETERS",
  "WRITERS",
  "RESEARCHERS",
  "EDUCATORS",
  "SALES",
  "ENTERPRISE",
  "CONTENT_CREATORS"
]);
const ToolCategoryEnum = z.enum([
  "WRITING",
  "IMAGE_GENERATION",
  "VIDEO_GENERATION",
  "AUDIO",
  "CHATBOTS",
  "CODING",
  "MARKETING",
  "PRODUCTIVITY",
  "BUSINESS",
  "EDUCATION",
  "AGENTS",
  "PRESENTATIONS",
  "THREE_D_GENERATION",
  "NO_CODE_AI_BUILDERS",
  "WORKFLOW_AUTOMATION"
]);

export const PricingTierSchema = z.object({
  name: z.string(),
  price: z.string(),
  description: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  isPopular: z.boolean().default(false)
});

export const toolSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  websiteUrl: z.string().url(),
  logoUrl: z.string().url().optional().nullable(),
  screenshots: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),

  releaseDate: z.coerce.date().optional().nullable(),

  pricingModel: PricingModel,
  pricingAmount: z.number().optional().nullable(),
  billingFrequency: BillingFrequency,

  isOpenSource: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  verified: z.boolean().default(false),

  compatibility: z.array(Platform).default([]),
  targetUsers: z.array(UserPersona).default([]),

  hasApi: z.boolean().default(false),
  apiDocsUrl: z.string().url().optional().nullable(),

  performanceScore: z.number().optional().nullable(),

  // New fields from the specification
  longDescription: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  releasedBy: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  launchDate: z.string().optional().nullable(),
  views: z.number().int().default(0),
  reviewCount: z.number().int().optional(),
  useCases: z.union([z.array(z.string()), z.string()]).default([]),
  pricingTiers: z.array(PricingTierSchema).optional().nullable(),
  verdict: z.string().optional().nullable(),
  linkedInUrl: z.string().optional().nullable(),
  twitterUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  alternativeIds: z.array(z.string()).default([]),

  company: z
    .object({
      slug: z.string(),
      name: z.string(),
      logoUrl: z.string().url().optional().nullable()
    })
    .optional()
    .nullable(),

  categories: z
    .array(
      z.object({
        slug: z.string(),
        name: z.string()
      })
    )
    .default([]),
  toolCategories: z.array(ToolCategoryEnum).default([]),

  tags: z
    .array(
      z.object({
        slug: z.string(),
        name: z.string()
      })
    )
    .default([]),

  integrations: z
    .array(
      z.object({
        slug: z.string(),
        name: z.string(),
        logoUrl: z.string().url().optional().nullable()
      })
    )
    .default([]),

  tasks: z
    .array(
      z.object({
        slug: z.string(),
        name: z.string().optional()
      })
    )
    .default([])
});

export const toolsIngestPayloadSchema = z.object({
  tools: z.array(toolSchema)
});

export type ToolIngestInput = z.infer<typeof toolSchema>;
export type ToolsIngestPayload = z.infer<typeof toolsIngestPayloadSchema>;