import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HomepageService } from '../homepage.service.js';

function createMockPrisma() {
  return {
    company: {
      findMany: vi.fn(),
    },
    aIModel: {
      findMany: vi.fn(),
    },
    repository: {
      findMany: vi.fn(),
    },
    news: {
      findMany: vi.fn(),
    },
  };
}

describe('HomepageService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: HomepageService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new HomepageService(prisma as never);
    vi.clearAllMocks();
  });

  describe('getHomepageData', () => {
    it('returns topCompanies, topModels, topRepos, topNews each limited to 4', async () => {
      prisma.company.findMany.mockResolvedValue([
        { id: 'c1', name: 'Company1' },
        { id: 'c2', name: 'Company2' },
        { id: 'c3', name: 'Company3' },
        { id: 'c4', name: 'Company4' },
      ]);
      prisma.aIModel.findMany.mockResolvedValue([
        { id: 'm1', name: 'Model1' },
        { id: 'm2', name: 'Model2' },
        { id: 'm3', name: 'Model3' },
        { id: 'm4', name: 'Model4' },
      ]);
      prisma.repository.findMany.mockResolvedValue([
        { id: 'r1', name: 'Repo1' },
        { id: 'r2', name: 'Repo2' },
        { id: 'r3', name: 'Repo3' },
        { id: 'r4', name: 'Repo4' },
      ]);
      prisma.news.findMany.mockResolvedValue([
        { id: 'n1', title: 'News1' },
        { id: 'n2', title: 'News2' },
        { id: 'n3', title: 'News3' },
        { id: 'n4', title: 'News4' },
      ]);

      const result = await service.getHomepageData();

      expect(result).toHaveProperty('topCompanies');
      expect(result).toHaveProperty('topModels');
      expect(result).toHaveProperty('topRepos');
      expect(result).toHaveProperty('topNews');

      expect(result.topCompanies).toHaveLength(4);
      expect(result.topModels).toHaveLength(4);
      expect(result.topRepos).toHaveLength(4);
      expect(result.topNews).toHaveLength(4);
    });

    it('calls each prisma method with take 4 and orderBy createdAt desc', async () => {
      prisma.company.findMany.mockResolvedValue([]);
      prisma.aIModel.findMany.mockResolvedValue([]);
      prisma.repository.findMany.mockResolvedValue([]);
      prisma.news.findMany.mockResolvedValue([]);

      await service.getHomepageData();

      expect(prisma.company.findMany).toHaveBeenCalledWith({
        take: 4,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.aIModel.findMany).toHaveBeenCalledWith({
        take: 4,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.repository.findMany).toHaveBeenCalledWith({
        take: 4,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.news.findMany).toHaveBeenCalledWith({
        take: 4,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          publishedAt: true,
          publisher: { select: { name: true } },
        },
      });
    });

    it('returns empty arrays when no data exists', async () => {
      prisma.company.findMany.mockResolvedValue([]);
      prisma.aIModel.findMany.mockResolvedValue([]);
      prisma.repository.findMany.mockResolvedValue([]);
      prisma.news.findMany.mockResolvedValue([]);

      const result = await service.getHomepageData();

      expect(result.topCompanies).toEqual([]);
      expect(result.topModels).toEqual([]);
      expect(result.topRepos).toEqual([]);
      expect(result.topNews).toEqual([]);
    });
  });
});
