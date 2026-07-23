import { z } from "zod";

const PricingModel = z.enum(["FREE", "FREEMIUM", "PAID", "FREE_TRIAL"]);
const BillingFrequency = z.enum(["MONTHLY", "YEARLY", "ONE_TIME", "NA"]).default("NA");

export const toolSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  websiteUrl: z.string().url(),
  logoUrl: z.string().url().optional().nullable(),
  screenshots: z.array(z.string().url()).default([]),
  features: z.array(z.string()).default([]),
  
  pricingModel: PricingModel,
  pricingAmount: z.number().optional().nullable(),
  billingFrequency: BillingFrequency,

  isOpenSource: z.boolean().default(false),
  isTrending: z.boolean().default(false),

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
  })).default([])
});

export const toolsIngestPayloadSchema = z.object({
  tools: z.array(toolSchema)
});

export type ToolIngestInput = z.infer<typeof toolSchema>;
export type ToolsIngestPayload = z.infer<typeof toolsIngestPayloadSchema>;
