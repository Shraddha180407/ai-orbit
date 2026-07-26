import { z } from "zod";

const PricingModel = z.enum(["FREE", "FREEMIUM", "PAID", "FREE_TRIAL"]);
const BillingFrequency = z.enum(["MONTHLY", "YEARLY", "ONE_TIME", "NA"]).default("NA");
const Platform = z.enum(["WEB", "WINDOWS", "MACOS", "LINUX", "IOS", "ANDROID", "CHROME_EXTENSION"]);
const UserPersona = z.enum(["DEVELOPERS", "DESIGNERS", "STUDENTS", "MARKETERS", "WRITERS", "RESEARCHERS", "EDUCATORS", "SALES", "ENTERPRISE", "CONTENT_CREATORS"]);

export const toolSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  websiteUrl: z.string().url(),
  logoUrl: z.string().url().optional().nullable(),
  screenshots: z.array(z.string().url()).default([]),
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

  company: z.object({
    slug: z.string(),
    name: z.string(),
    logoUrl: z.string().url().optional().nullable(),
  }).optional().nullable(),

  categories: z.array(z.object({
    slug: z.string(),
    name: z.string()
  })).default([]),

  tags: z.array(z.object({
    slug: z.string(),
    name: z.string()
  })).default([]),

  integrations: z.array(z.object({
    slug: z.string(),
    name: z.string(),
    logoUrl: z.string().url().optional().nullable()
  })).default([])
});

export const toolsIngestPayloadSchema = z.object({
  tools: z.array(toolSchema)
});

export type ToolIngestInput = z.infer<typeof toolSchema>;
export type ToolsIngestPayload = z.infer<typeof toolsIngestPayloadSchema>;
