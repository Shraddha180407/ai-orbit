import { z } from 'zod';

const optionalUrl = z.union([
  z.literal(''),
  z.string().url('Enter a valid URL').max(500, 'URL is too long'),
]).optional();

export const writerSubmissionSchema = z.object({
  firstName: z.string().trim().min(2, 'First name is required').max(80),
  lastName: z.string().trim().min(2, 'Last name is required').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email address').max(254),
  country: z.string().trim().min(2, 'Country is required').max(100),
  websiteUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  authorBio: z.string().trim().min(50, 'Author bio must be at least 50 characters').max(1200),
  articleTitle: z.string().trim().min(8, 'Article title must be at least 8 characters').max(180),
  topic: z.string().trim().min(2, 'Select an article topic').max(120),
  googleDocsUrl: z.string().trim().url('Enter a valid Google Docs URL').max(500).refine(
    (value) => /^https:\/\/docs\.google\.com\/document\/d\//i.test(value),
    'Use a Google Docs document link',
  ),
  contributionFrequency: z.enum(['ONE_TIME', 'MONTHLY', 'TWICE_MONTHLY', 'WEEKLY']),
  acceptedGuidelines: z.literal(true, { error: 'You must accept the writing guidelines' }),
  company: z.string().max(0).optional(),
});

export const writerSubmissionStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_REVIEW', 'ACCEPTED', 'CHANGES_REQUESTED', 'REJECTED']),
  reviewNotes: z.string().trim().max(2000).optional(),
});

export type WriterSubmissionInput = z.infer<typeof writerSubmissionSchema>;
export type WriterSubmissionStatusInput = z.infer<typeof writerSubmissionStatusSchema>;
