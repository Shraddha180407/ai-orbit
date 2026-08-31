import { describe, expect, it } from 'vitest';
import { writerSubmissionSchema, writerSubmissionStatusSchema } from '../writer-submissions.schema.js';

const validSubmission = {
  firstName: 'Ava',
  lastName: 'Sharma',
  email: 'ava@example.com',
  country: 'India',
  websiteUrl: 'https://example.com',
  portfolioUrl: '',
  authorBio: 'AI researcher and technical writer focused on useful, evidence-led explanations.',
  articleTitle: 'How smaller language models are changing edge AI',
  topic: 'AI Research & Models',
  googleDocsUrl: 'https://docs.google.com/document/d/example/edit',
  contributionFrequency: 'MONTHLY',
  acceptedGuidelines: true,
  company: '',
};

describe('writerSubmissionSchema', () => {
  it('accepts a complete submission', () => {
    expect(writerSubmissionSchema.safeParse(validSubmission).success).toBe(true);
  });

  it('normalizes the email address', () => {
    const result = writerSubmissionSchema.parse({ ...validSubmission, email: '  AVA@EXAMPLE.COM ' });
    expect(result.email).toBe('ava@example.com');
  });

  it('requires a Google Docs document URL', () => {
    const result = writerSubmissionSchema.safeParse({ ...validSubmission, googleDocsUrl: 'https://example.com/article' });
    expect(result.success).toBe(false);
  });

  it('requires acceptance of the guidelines', () => {
    const result = writerSubmissionSchema.safeParse({ ...validSubmission, acceptedGuidelines: false });
    expect(result.success).toBe(false);
  });

  it('rejects a populated honeypot field', () => {
    const result = writerSubmissionSchema.safeParse({ ...validSubmission, company: 'spam' });
    expect(result.success).toBe(false);
  });
});

describe('writerSubmissionStatusSchema', () => {
  it('accepts known editorial states and rejects unknown ones', () => {
    expect(writerSubmissionStatusSchema.safeParse({ status: 'IN_REVIEW' }).success).toBe(true);
    expect(writerSubmissionStatusSchema.safeParse({ status: 'PUBLISHED' }).success).toBe(false);
  });
});
