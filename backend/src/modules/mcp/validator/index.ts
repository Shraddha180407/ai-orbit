import { z } from 'zod';
import { MCPItemType, MCPPricingType } from '@prisma/client';

export const MCPItemQuerySchema = z.object({
  type: z.nativeEnum(MCPItemType).optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  pricingType: z.nativeEnum(MCPPricingType).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['trending', 'top-rated', 'most-upvoted', 'recently-updated']).optional(),
  page: z.string().default('1'),
  limit: z.string().default('20'),
});

export const MCPItemSlugSchema = z.object({
  slug: z.string().min(1),
});

export const UpvoteSchema = z.object({
  id: z.string().min(1),
});

export const SaveSchema = z.object({
  id: z.string().min(1),
});

export const ViewSchema = z.object({
  id: z.string().min(1),
});

export const ReviewParamSchema = z.object({
  slug: z.string().min(1),
});

export const ReviewBodySchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const ReviewResponseSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string().nullable(),
  createdAt: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
});

export const DiscussionParamSchema = z.object({
  slug: z.string().min(1),
});

export const DiscussionBodySchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});

export const DiscussionResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
  replies: z.array(z.object({
    id: z.string(),
    content: z.string(),
    createdAt: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string(),
    }),
  })),
});

export const DiscussionReplyParamSchema = z.object({
  discussionId: z.string().min(1),
});

export const DiscussionReplyBodySchema = z.object({
  content: z.string().min(1),
});

export const DiscussionReplyResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
});

export const ClaimParamSchema = z.object({
  slug: z.string().min(1),
});

export const ClaimBodySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  relationship: z.string().min(1).max(100),
  message: z.string().min(1).max(2000),
});

export const ClaimResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  relationship: z.string(),
  message: z.string(),
  status: z.string(),
  createdAt: z.string(),
});

export const ReportParamSchema = z.object({
  slug: z.string().min(1),
});

export const ReportBodySchema = z.object({
  reason: z.string().min(1).max(500),
  description: z.string().optional(),
});

export const ReportResponseSchema = z.object({
  id: z.string(),
  reason: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  reporter: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
});

export type MCPItemQuery = z.infer<typeof MCPItemQuerySchema>;
export type MCPItemSlug = z.infer<typeof MCPItemSlugSchema>;
export type UpvoteData = z.infer<typeof UpvoteSchema>;
export type SaveData = z.infer<typeof SaveSchema>;
export type ViewData = z.infer<typeof ViewSchema>;
export type ReviewParamData = z.infer<typeof ReviewParamSchema>;
export type ReviewBodyData = z.infer<typeof ReviewBodySchema>;
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
export type DiscussionParamData = z.infer<typeof DiscussionParamSchema>;
export type DiscussionBodyData = z.infer<typeof DiscussionBodySchema>;
export type DiscussionResponse = z.infer<typeof DiscussionResponseSchema>;
export type DiscussionReplyParamData = z.infer<typeof DiscussionReplyParamSchema>;
export type DiscussionReplyBodyData = z.infer<typeof DiscussionReplyBodySchema>;
export type DiscussionReplyResponse = z.infer<typeof DiscussionReplyResponseSchema>;
export type ClaimParamData = z.infer<typeof ClaimParamSchema>;
export type ClaimBodyData = z.infer<typeof ClaimBodySchema>;
export type ClaimResponse = z.infer<typeof ClaimResponseSchema>;
export type ReportParamData = z.infer<typeof ReportParamSchema>;
export type ReportBodyData = z.infer<typeof ReportBodySchema>;
export type ReportResponse = z.infer<typeof ReportResponseSchema>;