import type { PrismaClient } from '@prisma/client';
import type { WriterSubmissionInput, WriterSubmissionStatusInput } from './writer-submissions.schema.js';

export class WriterSubmissionsService {
  constructor(private readonly prisma: PrismaClient) {}

  create(input: WriterSubmissionInput) {
    return this.prisma.writerSubmission.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        country: input.country,
        websiteUrl: input.websiteUrl || null,
        portfolioUrl: input.portfolioUrl || null,
        authorBio: input.authorBio,
        articleTitle: input.articleTitle,
        topic: input.topic,
        googleDocsUrl: input.googleDocsUrl,
        contributionFrequency: input.contributionFrequency,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });
  }

  list(status?: string) {
    return this.prisma.writerSubmission.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: string, input: WriterSubmissionStatusInput) {
    return this.prisma.writerSubmission.update({
      where: { id },
      data: {
        status: input.status,
        reviewNotes: input.reviewNotes || null,
      },
    });
  }
}
