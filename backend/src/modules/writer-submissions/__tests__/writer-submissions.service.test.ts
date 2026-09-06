import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WriterSubmissionsService } from '../writer-submissions.service.js';

const input = {
  firstName: 'Ava',
  lastName: 'Sharma',
  email: 'ava@example.com',
  country: 'India',
  websiteUrl: '',
  portfolioUrl: 'https://example.com/portfolio',
  authorBio: 'AI researcher and technical writer focused on useful, evidence-led explanations.',
  articleTitle: 'How smaller language models are changing edge AI',
  topic: 'AI Research & Models',
  googleDocsUrl: 'https://docs.google.com/document/d/example/edit',
  contributionFrequency: 'MONTHLY' as const,
  acceptedGuidelines: true as const,
  company: '',
};

describe('WriterSubmissionsService', () => {
  const prisma = {
    writerSubmission: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  };
  const service = new WriterSubmissionsService(prisma as never);

  beforeEach(() => vi.clearAllMocks());

  it('stores a normalized public submission without form-only fields', async () => {
    prisma.writerSubmission.create.mockResolvedValue({ id: 'submission-1', status: 'PENDING' });

    await service.create(input);

    expect(prisma.writerSubmission.create).toHaveBeenCalledWith({
      data: {
        firstName: 'Ava',
        lastName: 'Sharma',
        email: 'ava@example.com',
        country: 'India',
        websiteUrl: null,
        portfolioUrl: 'https://example.com/portfolio',
        authorBio: input.authorBio,
        articleTitle: input.articleTitle,
        topic: input.topic,
        googleDocsUrl: input.googleDocsUrl,
        contributionFrequency: 'MONTHLY',
      },
      select: { id: true, status: true, createdAt: true },
    });
  });

  it('lists newest submissions first and supports a status filter', async () => {
    prisma.writerSubmission.findMany.mockResolvedValue([]);
    await service.list('PENDING');
    expect(prisma.writerSubmission.findMany).toHaveBeenCalledWith({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('updates editorial status and notes', async () => {
    prisma.writerSubmission.update.mockResolvedValue({ id: 'submission-1', status: 'ACCEPTED' });
    await service.updateStatus('submission-1', { status: 'ACCEPTED', reviewNotes: 'Strong fit.' });
    expect(prisma.writerSubmission.update).toHaveBeenCalledWith({
      where: { id: 'submission-1' },
      data: { status: 'ACCEPTED', reviewNotes: 'Strong fit.' },
    });
  });
});
