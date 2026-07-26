import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LeaderboardService } from '../leaderboard.service.js';

const originalFetch = globalThis.fetch;

function mockFetch(responses: Array<{ ok?: boolean; json?: () => Promise<unknown>; status?: number }>) {
  let callIndex = 0;
  globalThis.fetch = vi.fn().mockImplementation(async () => {
    const resp = responses[callIndex] ?? { ok: true, json: async () => [] };
    callIndex++;
    return resp;
  }) as never;
}

function createMockPrisma() {
  return {
    tool: {
      findMany: vi.fn(),
    },
    aIModel: {
      findMany: vi.fn(),
    },
    company: {
      findMany: vi.fn(),
    },
  };
}

const baseTool = {
  slug: 'test-tool',
  name: 'Test Tool',
  websiteUrl: 'https://testtool.com',
  description: 'A great tool',
  pricingModel: { toString: () => 'FREE' },
  avgRating: 4.5,
  createdAt: new Date('2024-01-01'),
  isOpenSource: false,
  isTrending: false,
  verified: true,
  categories: [{ category: { name: 'AI' } }],
  tags: [{ tag: { name: 'ml' } }],
  bookmarks: [{ id: 'b1' }],
  reviews: [{ id: 'r1', rating: 5 }],
};

const baseModel = {
  name: 'GPT-4',
  creator: 'OpenAI',
  modality: 'Text',
  parameterSize: '1.76 Trillion',
  contextWindow: '128K',
  description: 'A large language model',
};

const baseCompany = {
  slug: 'openai',
  name: 'OpenAI',
  tools: [{ websiteUrl: 'https://openai.com' }],
};

describe('LeaderboardService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: LeaderboardService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new LeaderboardService(prisma as never);
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as never;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('listTools', () => {
    beforeEach(() => {
      prisma.tool.findMany.mockResolvedValue([baseTool]);
      mockFetch([{ ok: true, json: async () => [] }]);
    });

    it('returns ranked tools with ratings', async () => {
      const result = await service.listTools();

      expect(result).toHaveLength(1);
      expect(result[0].rank).toBe(1);
      expect(result[0].rating).toBe(4.5);
    });

    it('filters by category', async () => {
      const result = await service.listTools('AI');

      expect(result).toHaveLength(1);
    });

    it('excludes tools not matching category', async () => {
      prisma.tool.findMany.mockResolvedValue([
        { ...baseTool, categories: [{ category: { name: 'Productivity' } }] },
      ]);

      const result = await service.listTools('AI');

      expect(result).toHaveLength(0);
    });

    it('sorts by rating desc then saves desc', async () => {
      prisma.tool.findMany.mockResolvedValue([
        { ...baseTool, name: 'Tool A', avgRating: 3.0, bookmarks: [{ id: 'b1' }, { id: 'b2' }] },
        { ...baseTool, name: 'Tool B', avgRating: 5.0, bookmarks: [{ id: 'b3' }] },
      ]);

      const result = await service.listTools();

      expect(result[0].name).toBe('Tool B');
      expect(result[1].name).toBe('Tool A');
    });
  });

  describe('listModels', () => {
    beforeEach(() => {
      prisma.aIModel.findMany.mockResolvedValue([baseModel]);
      mockFetch([{ ok: true, json: async () => [] }]);
    });

    it('returns ranked models', async () => {
      const result = await service.listModels();

      expect(result).toHaveLength(1);
      expect(result[0].rank).toBe(1);
    });

    it('sorts by eloRating desc', async () => {
      prisma.aIModel.findMany.mockResolvedValue([
        { ...baseModel, name: 'Small' },
        { ...baseModel, name: 'Large' },
      ]);

      const result = await service.listModels();

      const eloA = result.find(m => m.name === 'Small')?.eloRating ?? 0;
      const eloB = result.find(m => m.name === 'Large')?.eloRating ?? 0;
      expect(eloA).toBeGreaterThanOrEqual(eloB);
    });

    it('filters by category', async () => {
      prisma.aIModel.findMany.mockResolvedValue([
        { ...baseModel, modality: 'Text' },
        { ...baseModel, name: 'Vision', modality: 'Multimodal' },
      ]);

      const result = await service.listModels('Text');

      expect(result.every(m => m.category.includes('Text'))).toBe(true);
    });
  });

  describe('listCompanies', () => {
    beforeEach(() => {
      prisma.company.findMany.mockResolvedValue([baseCompany]);
    });

    it('returns ranked companies', async () => {
      const result = await service.listCompanies();

      expect(result).toHaveLength(1);
      expect(result[0].rank).toBe(1);
    });

    it('sorts by votes desc', async () => {
      prisma.company.findMany.mockResolvedValue([
        { ...baseCompany, slug: 'small', tools: [{ websiteUrl: 'https://small.com' }] },
        { ...baseCompany, slug: 'large', tools: [{ websiteUrl: 'https://large.com' }] },
      ]);

      const result = await service.listCompanies();

      const votes0 = result[0].votes;
      const votes1 = result[1].votes;
      expect(votes0).toBeGreaterThanOrEqual(votes1);
    });
  });
});
