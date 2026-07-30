import { z } from "zod";

const CompanyType = z.enum([
  "AI_NATIVE",
  "MODEL_COMPANIES",
  "TOOL_COMPANIES",
  "PROFITABLE",
  "UNICORNS"
]);

export const companySchema = z.object({
  slug: z.string(),
  name: z.string(),
  logoUrl: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),

  website: z.string().url().optional().nullable(),
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  foundedYear: z.number().int().optional().nullable(),

  type: z.array(CompanyType).default([]),
  sector: z.string().optional().nullable(),

  verified: z.boolean().default(false),
  featured: z.boolean().default(false),

  valuation: z.number().optional().nullable(),
  fundingRaised: z.number().optional().nullable(),
  latestFundingRound: z.string().optional().nullable(),
  employeeCount: z.number().int().optional().nullable(),

  linkedinUrl: z.string().url().optional().nullable(),
  twitterUrl: z.string().url().optional().nullable(),

  views: z.number().int().default(0),
  upvotes: z.number().int().default(0),
  impressions: z.number().int().default(0),

  tools: z.array(z.string()).default([]),
  aiModels: z.array(z.string()).default([]),
});

export const companiesIngestPayloadSchema = z.object({
  companies: z.array(companySchema)
});

export type CompanyIngestInput = z.infer<typeof companySchema>;
export type CompaniesIngestPayload = z.infer<typeof companiesIngestPayloadSchema>;
