import { z } from 'zod';

export const GetAgentsQuerySchema = z.object({
  q: z.string().optional().default(''),
  category: z.string().optional(),
  pricing: z.enum(['FREE', 'FREEMIUM', 'PAID', 'FREE_TRIAL']).optional(),
  sort: z.enum(['newest', 'oldest', 'name-asc', 'name-desc', 'rating', 'popular', 'trending']).optional().default('newest'),
  page: z.string().optional().default('1'),
  limit: z.string().optional(),
  pageSize: z.string().optional().default('100'),
});

export type GetAgentsQuery = z.infer<typeof GetAgentsQuerySchema>;
