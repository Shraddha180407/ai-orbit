import { PrismaClient } from '@prisma/client';

export class HomepageService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getHomepageData() {
    const [topCompanies, topModels, topRepos, topNews] = await Promise.all([
      this.prisma.company.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.aIModel.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.repository.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.news.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          publishedAt: true,
          publisher: { select: { name: true } },
        },
      }),
    ]);

    return {
      topCompanies,
      topModels,
      topRepos,
      topNews,
    };
  }
}
