import { z } from 'zod';
import type { PricingModel } from '@prisma/client';

export const GetToolsQuerySchema = z.object({
  q: z.string().optional().default(''),
  category: z.string().optional(),
  pricing: z.enum(['FREE', 'FREEMIUM', 'PAID', 'FREE_TRIAL']).optional(),
  sort: z.enum(['newest', 'oldest', 'name-asc', 'name-desc', 'rating']).optional().default('newest'),
  page: z.string().optional().default('1'),
});

export const CreateReviewSchema = z.object({
  toolId: z.string().min(1, "toolId is required"),
  rating: z.union([z.number(), z.string()]).transform(val => Number(val)).refine(val => val >= 1 && val <= 5, "Rating must be between 1 and 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

export const BookmarkToggleSchema = z.object({
  toolId: z.string().min(1, "toolId is required"),
});
