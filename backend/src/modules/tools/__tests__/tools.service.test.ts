import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToolsService } from '../tools.service.js';

function createMockPrisma() {
  return {
    tool: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
    },
    review: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    bookmark: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  };
}

const mockTool = {
  id: 'tool-1',
  slug: 'test-tool',
  name: 'Test Tool',
  logoUrl: 'https://logo.png',
  description: 'A test tool',
  pricingModel: 'FREE' as const,
  pricingAmount: null,
  billingFrequency: null,
  avgRating: 4.5,
  createdAt: new Date('2024-01-01'),
  isOpenSource: false,
  isTrending: false,
  verified: true,
  upvoteCount: 10,
  categories: [{ category: { slug: 'ai', name: 'AI' } }],
  tags: [{ tag: { slug: 'ml', name: 'Machine Learning' } }],
  _count: { reviews: 5, bookmarks: 3 },
  company: { slug: 'acme', name: 'Acme' },
};

describe('ToolsService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: ToolsService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new ToolsService(prisma as never);
  });

  describe('listTools', () => {
    beforeEach(() => {
      prisma.tool.findMany.mockResolvedValue([mockTool]);
      prisma.tool.count.mockResolvedValue(1);
      prisma.category.findMany.mockResolvedValue([]);
    });

    it('returns tools with default pagination', async () => {
      const result = await service.listTools({});

      expect(result.page).toBe(1);
      expect(result.sort).toBe('newest');
      expect(result.tools).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('calculates totalPages correctly', async () => {
      prisma.tool.count.mockResolvedValue(25);

      const result = await service.listTools({ pageSize: 12 });

      expect(result.totalPages).toBe(3);
    });

    it('clamps page to minimum 1 when given 0', async () => {
      const result = await service.listTools({ page: 0 });

      expect(result.page).toBe(1);
      expect(prisma.tool.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0 }),
      );
    });

    it('clamps page to minimum 1 when given negative', async () => {
      const result = await service.listTools({ page: -5 });

      expect(result.page).toBe(1);
    });

    it('applies category filter', async () => {
      await service.listTools({ category: 'ai' });

      expect(prisma.tool.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categories: { some: { category: { slug: 'ai' } } },
          }),
        }),
      );
    });

    it('applies search query with trimming', async () => {
      await service.listTools({ q: '  test  ' });

      expect(prisma.tool.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { name: { contains: 'test', mode: 'insensitive' } },
              { description: { contains: 'test', mode: 'insensitive' } },
            ],
          }),
        }),
      );
    });

    it('ignores empty search query', async () => {
      await service.listTools({ q: '   ' });

      const call = prisma.tool.findMany.mock.calls[0][0];
      expect(call.where.OR).toBeUndefined();
    });

    it('applies pricing filter', async () => {
      await service.listTools({ pricing: 'FREEMIUM' });

      expect(prisma.tool.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ pricingModel: 'FREEMIUM' }),
        }),
      );
    });

    it('sorts by oldest', async () => {
      await service.listTools({ sort: 'oldest' });

      expect(prisma.tool.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'asc' } }),
      );
    });

    it('sorts by name ascending', async () => {
      await service.listTools({ sort: 'name-asc' });

      expect(prisma.tool.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { name: 'asc' } }),
      );
    });

    it('sorts by name descending', async () => {
      await service.listTools({ sort: 'name-desc' });

      expect(prisma.tool.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { name: 'desc' } }),
      );
    });

    it('sorts by rating', async () => {
      await service.listTools({ sort: 'rating' });

      expect(prisma.tool.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { avgRating: 'desc' } }),
      );
    });

    it('defaults to newest sort for unknown value', async () => {
      await service.listTools({ sort: 'unknown' });

      expect(prisma.tool.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
      );
    });

    it('maps pricingAmount Decimal to string', async () => {
      const toolWithPrice = { ...mockTool, pricingAmount: { toString: () => '29.99' } };
      prisma.tool.findMany.mockResolvedValue([toolWithPrice]);

      const result = await service.listTools({});

      expect(result.tools[0].pricingAmount).toBe('29.99');
    });

    it('maps avgRating 0 to null', async () => {
      const toolZeroRating = { ...mockTool, avgRating: 0 };
      prisma.tool.findMany.mockResolvedValue([toolZeroRating]);

      const result = await service.listTools({});

      expect(result.tools[0].avgRating).toBeNull();
    });

    it('returns empty tools and totalPages 1 when no results', async () => {
      prisma.tool.findMany.mockResolvedValue([]);
      prisma.tool.count.mockResolvedValue(0);

      const result = await service.listTools({});

      expect(result.tools).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(1);
    });

    it('fetches categories list', async () => {
      prisma.category.findMany.mockResolvedValue([{ slug: 'ai', name: 'AI', _count: { tools: 5 } }]);

      const result = await service.listTools({});

      expect(result.categories).toHaveLength(1);
      expect(prisma.category.findMany).toHaveBeenCalled();
    });
  });

  describe('getToolDetails', () => {
    const fullTool = {
      ...mockTool,
      websiteUrl: 'https://example.com',
      screenshots: [],
      features: [],
      pros: [],
      cons: [],
      releaseDate: null,
      reviewCount: 5,
      compatibility: [],
      targetUsers: [],
      hasApi: false,
      apiDocsUrl: null,
      performanceScore: null,
      company: { slug: 'acme', name: 'Acme', logoUrl: 'https://logo.png' },
      integrations: [],
    };

    beforeEach(() => {
      prisma.tool.findUnique
        .mockResolvedValueOnce(fullTool)
        .mockResolvedValueOnce({
          alternatives: [],
          categories: [{ categoryId: 'cat-1' }],
        });
      prisma.tool.findMany.mockResolvedValue([]);
      prisma.review.findMany.mockResolvedValue([]);
      prisma.bookmark.findUnique.mockResolvedValue(null);
    });

    it('returns tool details with reviews and bookmark status', async () => {
      prisma.review.findMany.mockResolvedValue([
        { id: 'r1', rating: 5, comment: 'Great', createdAt: new Date(), user: { name: 'User1' } },
      ]);

      const result = await service.getToolDetails('test-tool', 'user-1');

      expect(result).not.toBeNull();
      expect(result!.tool.slug).toBe('test-tool');
      expect(result!.bookmarked).toBe(false);
      expect(result!.reviews).toHaveLength(1);
    });

    it('returns null when tool not found', async () => {
      prisma.tool.findUnique.mockReset();
      prisma.tool.findUnique.mockResolvedValue(null);

      const result = await service.getToolDetails('nonexistent');

      expect(result).toBeNull();
    });

    it('sets bookmarked to false when no userId', async () => {
      const result = await service.getToolDetails('test-tool');

      expect(result!.bookmarked).toBe(false);
      expect(prisma.bookmark.findUnique).not.toHaveBeenCalled();
    });

    it('sets bookmarked to true when bookmark exists', async () => {
      prisma.bookmark.findUnique.mockResolvedValue({ id: 'bm-1' });

      const result = await service.getToolDetails('test-tool', 'user-1');

      expect(result!.bookmarked).toBe(true);
    });

    it('fetches similar tools from alternatives', async () => {
      prisma.tool.findUnique
        .mockReset()
        .mockResolvedValueOnce(fullTool)
        .mockResolvedValueOnce({
          alternatives: [{ id: 'alt-1' }],
          categories: [{ categoryId: 'cat-1' }],
        });
      prisma.tool.findMany
        .mockResolvedValueOnce([mockTool])
        .mockResolvedValue([]);

      const result = await service.getToolDetails('test-tool');

      expect(result!.similarTools).toHaveLength(1);
    });

    it('backfills similar tools from categories when fewer than 4', async () => {
      prisma.tool.findUnique
        .mockReset()
        .mockResolvedValueOnce(fullTool)
        .mockResolvedValueOnce({
          alternatives: [],
          categories: [{ categoryId: 'cat-1' }],
        });
      prisma.tool.findMany
        .mockReset()
        .mockResolvedValueOnce([mockTool]);
      prisma.review.findMany.mockReset().mockResolvedValue([]);
      prisma.bookmark.findUnique.mockReset().mockResolvedValue(null);

      const result = await service.getToolDetails('test-tool');

      expect(result!.similarTools).toHaveLength(1);
      expect(prisma.tool.findMany).toHaveBeenCalledTimes(1);
    });

    it('does not backfill when 4 or more similar tools exist', async () => {
      const fourTools = Array.from({ length: 4 }, (_, i) => ({
        ...mockTool,
        id: `t-${i}`,
        slug: `tool-${i}`,
        name: `Tool ${i}`,
      }));

      prisma.tool.findUnique
        .mockReset()
        .mockResolvedValueOnce(fullTool)
        .mockResolvedValueOnce({
          alternatives: [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }, { id: 'a4' }],
          categories: [{ categoryId: 'cat-1' }],
        });
      prisma.tool.findMany.mockResolvedValue(fourTools);

      const result = await service.getToolDetails('test-tool');

      expect(result!.similarTools).toHaveLength(4);
      expect(prisma.tool.findMany).toHaveBeenCalledTimes(1);
    });

    it('limits reviews to 20', async () => {
      await service.getToolDetails('test-tool');

      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 20 }),
      );
    });

    it('maps avgRating 0 to null in tool and similar tools', async () => {
      const zeroTool = { ...fullTool, avgRating: 0 };
      prisma.tool.findUnique
        .mockReset()
        .mockResolvedValueOnce(zeroTool)
        .mockResolvedValueOnce({ alternatives: [], categories: [] });

      const result = await service.getToolDetails('test-tool');

      expect(result!.tool.avgRating).toBeNull();
    });

    it('converts review createdAt to ISO string', async () => {
      const date = new Date('2024-06-15T12:00:00Z');
      prisma.review.findMany.mockResolvedValue([
        { id: 'r1', rating: 5, comment: 'Good', createdAt: date, user: { name: 'U' } },
      ]);

      const result = await service.getToolDetails('test-tool');

      expect(result!.reviews[0].createdAt).toBe('2024-06-15T12:00:00.000Z');
    });
  });

  describe('createOrUpdateReview', () => {
    beforeEach(() => {
      prisma.review.upsert.mockResolvedValue({});
      prisma.review.findMany.mockResolvedValue([{ rating: 4 }, { rating: 5 }]);
      prisma.tool.update.mockResolvedValue({});
    });

    it('upserts the review', async () => {
      await service.createOrUpdateReview('tool-1', 'user-1', 5, 'Great!');

      expect(prisma.review.upsert).toHaveBeenCalledWith({
        where: { toolId_userId: { toolId: 'tool-1', userId: 'user-1' } },
        update: { rating: 5, comment: 'Great!' },
        create: { toolId: 'tool-1', userId: 'user-1', rating: 5, comment: 'Great!' },
      });
    });

    it('recomputes tool rating after upsert', async () => {
      await service.createOrUpdateReview('tool-1', 'user-1', 4, 'Ok');

      expect(prisma.review.findMany).toHaveBeenCalledWith({
        where: { toolId: 'tool-1' },
        select: { rating: true },
      });
      expect(prisma.tool.update).toHaveBeenCalledWith({
        where: { id: 'tool-1' },
        data: { avgRating: 4.5, reviewCount: 2 },
      });
    });

    it('sets avgRating to 0 when no reviews exist', async () => {
      prisma.review.findMany.mockResolvedValue([]);

      await service.createOrUpdateReview('tool-1', 'user-1', 3, 'Meh');

      expect(prisma.tool.update).toHaveBeenCalledWith({
        where: { id: 'tool-1' },
        data: { avgRating: 0, reviewCount: 0 },
      });
    });
  });

  describe('toggleBookmark', () => {
    it('creates bookmark and returns true when none exists', async () => {
      prisma.bookmark.findUnique.mockResolvedValue(null);
      prisma.bookmark.create.mockResolvedValue({});

      const result = await service.toggleBookmark('tool-1', 'user-1');

      expect(result).toBe(true);
      expect(prisma.bookmark.create).toHaveBeenCalledWith({
        data: { toolId: 'tool-1', userId: 'user-1' },
      });
      expect(prisma.bookmark.delete).not.toHaveBeenCalled();
    });

    it('deletes bookmark and returns false when it exists', async () => {
      prisma.bookmark.findUnique.mockResolvedValue({ id: 'bm-1' });
      prisma.bookmark.delete.mockResolvedValue({});

      const result = await service.toggleBookmark('tool-1', 'user-1');

      expect(result).toBe(false);
      expect(prisma.bookmark.delete).toHaveBeenCalledWith({ where: { id: 'bm-1' } });
      expect(prisma.bookmark.create).not.toHaveBeenCalled();
    });
  });
});
