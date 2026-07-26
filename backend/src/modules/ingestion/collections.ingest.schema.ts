import { z } from "zod";

export const collectionsIngestPayloadSchema = z.object({
  collections: z.array(z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    isFeatured: z.boolean().optional().default(false),
    isCurated: z.boolean().optional().default(false),
    creatorType: z.enum(['EDITORIAL', 'COMMUNITY']).optional().default('EDITORIAL'),
    creatorId: z.string(),
    categories: z.array(z.string()).optional().default([]),
    toolIds: z.array(z.string()).optional().default([]),
    modelIds: z.array(z.string()).optional().default([]),
    companyIds: z.array(z.string()).optional().default([]),
  })).min(1),
});

export type CollectionsIngestPayload = z.infer<typeof collectionsIngestPayloadSchema>;
