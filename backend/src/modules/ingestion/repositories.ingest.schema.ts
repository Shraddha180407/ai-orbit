import { z } from "zod";

export const repositorySchema = z.object({
  githubId: z.number().int().positive(),
  slug: z.string().min(1),
  name: z.string().min(1),
  owner: z.string().min(1),
  ownerAvatarUrl: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  url: z.string().url(),
  homepage: z.string().url().optional().nullable(),
  language: z.string().optional().nullable(),
  license: z.string().optional().nullable(),
  topics: z.array(z.string()).default([]),
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  openIssues: z.number().int().nonnegative(),
  defaultBranch: z.string().default("main"),
  logoUrl: z.string().url().optional().nullable(),
  brandColor: z.string().optional().nullable(),
  githubCreatedAt: z.coerce.date(),
  syncedAt: z.coerce.date(),
});

export const repositoriesIngestPayloadSchema = z.object({
  repositories: z.array(repositorySchema),
});

export type RepositoryIngestInput = z.infer<typeof repositorySchema>;
export type RepositoriesIngestPayload = z.infer<typeof repositoriesIngestPayloadSchema>;
