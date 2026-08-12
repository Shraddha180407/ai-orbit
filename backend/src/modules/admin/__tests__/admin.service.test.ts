import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminService } from '../admin.service.js';

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn(),
    PricingModel: {},
  };
});

function createMockPrisma() {
  return {
    user: {
      count: vi.fn().mockResolvedValue(0),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({}),
    },
    tool: {
      count: vi.fn().mockResolvedValue(0),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    news: {
      count: vi.fn().mockResolvedValue(0),
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    collection: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    company: {
      count: vi.fn().mockResolvedValue(0),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    aIModel: {
      count: vi.fn().mockResolvedValue(0),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    video: {
      count: vi.fn().mockResolvedValue(0),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    publisher: {
      findFirst: vi.fn().mockResolvedValue(null),
    },
    newsBookmark: {
      deleteMany: vi.fn().mockResolvedValue({}),
    },
    newsVote: {
      deleteMany: vi.fn().mockResolvedValue({}),
    },
    newsComment: {
      deleteMany: vi.fn().mockResolvedValue({}),
    },
    $transaction: vi.fn().mockImplementation((ops: unknown[]) => Promise.all(ops)),
  };
}

describe('AdminService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: AdminService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new AdminService(prisma as never);
  });

  // ─── getAnalytics ────────────────────────────────────────────────

  describe('getAnalytics', () => {
    it('returns counts and growthTrend', async () => {
      (prisma.user.count as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(5);
      (prisma.tool.count as ReturnType<typeof vi.fn>).mockResolvedValueOnce(7);
      (prisma.news.count as ReturnType<typeof vi.fn>).mockResolvedValueOnce(4);

      const result = await service.getAnalytics();

      expect(result.totalUsers).toBe(10);
      expect(result.totalTools).toBe(7);
      expect(result.activeUsers).toBe(3);
      expect(result.totalNews).toBe(4);
      expect(Array.isArray(result.growthTrend)).toBe(true);
    });

    it('returns empty growthTrend when before June 2026', async () => {
      const beforeJune2026 = new Date(2025, 0, 1);
      vi.useFakeTimers({ now: beforeJune2026 });

      (prisma.user.count as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(5);
      (prisma.tool.count as ReturnType<typeof vi.fn>).mockResolvedValueOnce(7);
      (prisma.news.count as ReturnType<typeof vi.fn>).mockResolvedValueOnce(4);

      const result = await service.getAnalytics();
      expect(result.growthTrend).toEqual([]);

      vi.useRealTimers();
    });
  });

  // ─── getUsers ────────────────────────────────────────────────────

  describe('getUsers', () => {
    it('returns paginated users without search', async () => {
      const fakeUsers = [{ id: '1' }, { id: '2' }];
      (prisma.user.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(fakeUsers);
      (prisma.user.count as ReturnType<typeof vi.fn>).mockResolvedValue(45);

      const result = await service.getUsers(1, '');

      expect(result.users).toBe(fakeUsers);
      expect(result.total).toBe(45);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(3); // ceil(45/20)
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20 }),
      );
    });

    it('calculates correct skip for page 2', async () => {
      (prisma.user.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      (prisma.user.count as ReturnType<typeof vi.fn>).mockResolvedValue(25);

      await service.getUsers(2, '');

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 20 }),
      );
    });

    it('applies name/email search filter', async () => {
      (prisma.user.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      (prisma.user.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      await service.getUsers(1, 'alice');

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'alice', mode: 'insensitive' } },
              { email: { contains: 'alice', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });
  });

  // ─── updateUserRole / updateUserStatus ────────────────────────────

  describe('updateUserRole', () => {
    it('calls user.update with role', async () => {
      await service.updateUserRole('u1', 'ADMIN');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { role: 'ADMIN' },
      });
    });
  });

  describe('updateUserStatus', () => {
    it('calls user.update with status', async () => {
      await service.updateUserStatus('u1', 'INACTIVE');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { status: 'INACTIVE' },
      });
    });
  });

  // ─── getReports / updateReport ───────────────────────────────────

  describe('getReports', () => {
    it('returns empty stub', async () => {
      const result = await service.getReports(1, 'OPEN');
      expect(result.reports).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('updateReport', () => {
    it('throws Report model removed', async () => {
      await expect(service.updateReport('r1', 'RESOLVED')).rejects.toThrow('Report model removed');
    });
  });

  // ─── getCollections ──────────────────────────────────────────────

  describe('getCollections', () => {
    it('returns collections with tool count', async () => {
      const fakeCollections = [
        { id: 'c1', name: 'Col 1', _count: { tools: 5 } },
      ];
      (prisma.collection.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(fakeCollections);

      const result = await service.getCollections();
      expect(result.collections).toBe(fakeCollections);
      expect(prisma.collection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
          include: { _count: { select: { tools: true } } },
        }),
      );
    });
  });

  // ─── createCollection ────────────────────────────────────────────

  describe('createCollection', () => {
    it('creates with EDITORIAL type', async () => {
      (prisma.collection.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'c1' });

      const result = await service.createCollection(
        { name: 'My Col', slug: 'my-col', description: 'desc' },
        'creator-1',
      );

      expect(prisma.collection.create).toHaveBeenCalledWith({
        data: {
          name: 'My Col',
          slug: 'my-col',
          description: 'desc',
          creatorType: 'EDITORIAL',
          creatorId: 'creator-1',
        },
      });
      expect(result).toEqual({ id: 'c1' });
    });
  });

  // ─── updateCollection ────────────────────────────────────────────

  describe('updateCollection', () => {
    it('updates only provided fields', async () => {
      (prisma.collection.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateCollection('c1', { name: 'New Name' });

      expect(prisma.collection.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { name: 'New Name' },
      });
    });

    it('updates multiple fields', async () => {
      (prisma.collection.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateCollection('c1', { name: 'X', description: 'Y', slug: 'z' });

      expect(prisma.collection.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { name: 'X', slug: 'z', description: 'Y' },
      });
    });

    it('ignores undefined fields', async () => {
      (prisma.collection.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateCollection('c1', { name: 'X', slug: undefined });

      expect(prisma.collection.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { name: 'X' },
      });
    });
  });

  // ─── deleteCollection ────────────────────────────────────────────

  describe('deleteCollection', () => {
    it('deletes successfully', async () => {
      (prisma.collection.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});
      await expect(service.deleteCollection('c1')).resolves.toBeUndefined();
      expect(prisma.collection.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
    });

    it('throws descriptive error for P2003', async () => {
      const err = new Error('foreign key') as Error & { code: string };
      err.code = 'P2003';
      (prisma.collection.delete as ReturnType<typeof vi.fn>).mockRejectedValue(err);

      await expect(service.deleteCollection('c1')).rejects.toThrow(
        'Cannot delete this collection because it is referenced by other items.',
      );
    });

    it('re-throws non-P2003 errors', async () => {
      (prisma.collection.delete as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('other'));

      await expect(service.deleteCollection('c1')).rejects.toThrow('other');
    });
  });

  // ─── getTools ────────────────────────────────────────────────────

  describe('getTools', () => {
    it('returns paginated tools with company', async () => {
      const tools = [{ id: 't1', company: { name: 'Acme' } }];
      (prisma.tool.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(tools);
      (prisma.tool.count as ReturnType<typeof vi.fn>).mockResolvedValue(40);

      const result = await service.getTools(1, '');

      expect(result.tools).toBe(tools);
      expect(result.total).toBe(40);
      expect(result.totalPages).toBe(2);
      expect(prisma.tool.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { company: { select: { name: true } } },
        }),
      );
    });

    it('applies name/description search', async () => {
      (prisma.tool.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      (prisma.tool.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      await service.getTools(1, 'design');

      expect(prisma.tool.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'design', mode: 'insensitive' } },
              { description: { contains: 'design', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });
  });

  // ─── deleteTool ──────────────────────────────────────────────────

  describe('deleteTool', () => {
    it('deletes successfully', async () => {
      (prisma.tool.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});
      await expect(service.deleteTool('t1')).resolves.toBeUndefined();
    });

    it('throws descriptive error for P2003', async () => {
      const err = new Error('fk') as Error & { code: string };
      err.code = 'P2003';
      (prisma.tool.delete as ReturnType<typeof vi.fn>).mockRejectedValue(err);

      await expect(service.deleteTool('t1')).rejects.toThrow(
        'Cannot delete this tool because it is referenced by other items.',
      );
    });

    it('re-throws non-P2003 errors', async () => {
      (prisma.tool.delete as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('other'));
      await expect(service.deleteTool('t1')).rejects.toThrow('other');
    });
  });

  // ─── getNews ─────────────────────────────────────────────────────

  describe('getNews', () => {
    it('returns paginated news with publisher', async () => {
      const news = [{ id: 'n1', publisher: { name: 'BBC' } }];
      (prisma.news.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(news);
      (prisma.news.count as ReturnType<typeof vi.fn>).mockResolvedValue(60);

      const result = await service.getNews(1, '');

      expect(result.news).toBe(news);
      expect(result.total).toBe(60);
      expect(result.totalPages).toBe(3);
      expect(prisma.news.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { publisher: { select: { name: true } } },
        }),
      );
    });

    it('applies title search', async () => {
      (prisma.news.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      (prisma.news.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      await service.getNews(1, 'launch');

      expect(prisma.news.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { title: { contains: 'launch', mode: 'insensitive' } },
        }),
      );
    });
  });

  // ─── deleteNews ──────────────────────────────────────────────────

  describe('deleteNews', () => {
    it('throws if article not found', async () => {
      (prisma.news.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(service.deleteNews('nonexistent')).rejects.toThrow('News article not found');
    });

    it('deletes article and related records in transaction', async () => {
      (prisma.news.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'news-1' });
      (prisma.$transaction as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      await service.deleteNews('news-1');

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.newsBookmark.deleteMany).toHaveBeenCalledWith({ where: { articleId: 'news-1' } });
      expect(prisma.newsVote.deleteMany).toHaveBeenCalledWith({ where: { articleId: 'news-1' } });
      expect(prisma.newsComment.deleteMany).toHaveBeenCalledWith({ where: { articleId: 'news-1' } });
      expect(prisma.news.delete).toHaveBeenCalledWith({ where: { id: 'news-1' } });
    });

    it('finds by slug when no id matches', async () => {
      (prisma.news.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'news-2', slug: 'my-article' });
      (prisma.$transaction as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      await service.deleteNews('my-article');

      expect(prisma.news.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { id: 'my-article' },
            { slug: 'my-article' },
          ],
        },
      });
    });
  });

  // ─── createTool ──────────────────────────────────────────────────

  describe('createTool', () => {
    it('generates slug from name', async () => {
      (prisma.tool.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createTool({ name: 'My Cool Tool!' });

      expect(prisma.tool.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: 'my-cool-tool',
          name: 'My Cool Tool!',
          pricingModel: 'FREE',
        }),
      });
    });

    it('uses provided slug when available', async () => {
      (prisma.tool.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createTool({ name: 'A', slug: 'custom-slug' });

      expect(prisma.tool.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ slug: 'custom-slug' }),
      });
    });

    it('generates fallback slug when name missing', async () => {
      vi.spyOn(Date, 'now').mockReturnValue(999);
      (prisma.tool.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createTool({});

      expect(prisma.tool.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ slug: 'tool-999', name: 'Untitled Tool' }),
      });

      vi.restoreAllMocks();
    });

    it('uses provided pricingModel', async () => {
      (prisma.tool.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createTool({ name: 'X', pricingModel: 'FREEMIUM' });

      expect(prisma.tool.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ pricingModel: 'FREEMIUM' }),
      });
    });
  });

  // ─── updateTool ──────────────────────────────────────────────────

  describe('updateTool', () => {
    it('updates only allowed fields', async () => {
      (prisma.tool.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateTool('t1', { name: 'New', slug: 'new', description: 'd', extra: 'ignore' });

      expect(prisma.tool.update).toHaveBeenCalledWith({
        where: { id: 't1' },
        data: { name: 'New', slug: 'new', description: 'd' },
      });
    });

    it('ignores undefined allowed fields', async () => {
      (prisma.tool.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateTool('t1', { name: 'X', description: undefined });

      expect(prisma.tool.update).toHaveBeenCalledWith({
        where: { id: 't1' },
        data: { name: 'X' },
      });
    });
  });

  // ─── getCompanies ────────────────────────────────────────────────

  describe('getCompanies', () => {
    it('returns paginated companies', async () => {
      const companies = [{ id: 'co1' }];
      (prisma.company.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(companies);
      (prisma.company.count as ReturnType<typeof vi.fn>).mockResolvedValue(30);

      const result = await service.getCompanies(1, '');

      expect(result.companies).toBe(companies);
      expect(result.total).toBe(30);
      expect(result.totalPages).toBe(2);
    });

    it('applies name search', async () => {
      (prisma.company.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      (prisma.company.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      await service.getCompanies(1, 'google');

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: { contains: 'google', mode: 'insensitive' } },
        }),
      );
    });
  });

  describe('createCompany', () => {
    it('creates company with name, slug, logoUrl', async () => {
      (prisma.company.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'co1' });

      await service.createCompany({ name: 'Acme', slug: 'acme', logoUrl: 'http://logo.png' });

      expect(prisma.company.create).toHaveBeenCalledWith({
        data: { name: 'Acme', slug: 'acme', logoUrl: 'http://logo.png' },
      });
    });

    it('sets logoUrl to null when not provided', async () => {
      (prisma.company.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createCompany({ name: 'X', slug: 'x' });

      expect(prisma.company.create).toHaveBeenCalledWith({
        data: { name: 'X', slug: 'x', logoUrl: null },
      });
    });
  });

  describe('updateCompany', () => {
    it('updates only provided fields', async () => {
      (prisma.company.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateCompany('co1', { name: 'New' });

      expect(prisma.company.update).toHaveBeenCalledWith({
        where: { id: 'co1' },
        data: { name: 'New' },
      });
    });

    it('sets logoUrl to null explicitly', async () => {
      (prisma.company.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateCompany('co1', { logoUrl: '' });

      expect(prisma.company.update).toHaveBeenCalledWith({
        where: { id: 'co1' },
        data: { logoUrl: null },
      });
    });
  });

  describe('deleteCompany', () => {
    it('deletes successfully', async () => {
      (prisma.company.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});
      await expect(service.deleteCompany('co1')).resolves.toBeUndefined();
    });

    it('throws descriptive error for P2003', async () => {
      const err = new Error('fk') as Error & { code: string };
      err.code = 'P2003';
      (prisma.company.delete as ReturnType<typeof vi.fn>).mockRejectedValue(err);

      await expect(service.deleteCompany('co1')).rejects.toThrow(
        'Cannot delete this company because it is referenced by other items.',
      );
    });

    it('re-throws non-P2003 errors', async () => {
      (prisma.company.delete as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('x'));
      await expect(service.deleteCompany('co1')).rejects.toThrow('x');
    });
  });

  // ─── getModels ───────────────────────────────────────────────────

  describe('getModels', () => {
    it('returns paginated models', async () => {
      const models = [{ id: 'm1' }];
      (prisma.aIModel.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(models);
      (prisma.aIModel.count as ReturnType<typeof vi.fn>).mockResolvedValue(55);

      const result = await service.getModels(1, '');

      expect(result.models).toBe(models);
      expect(result.total).toBe(55);
      expect(result.totalPages).toBe(3); // ceil(55/20)
    });

    it('applies name search', async () => {
      (prisma.aIModel.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      (prisma.aIModel.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      await service.getModels(1, 'gpt');

      expect(prisma.aIModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: { contains: 'gpt', mode: 'insensitive' } },
        }),
      );
    });
  });

  describe('createModel', () => {
    it('creates model with all fields', async () => {
      (prisma.aIModel.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createModel({
        name: 'GPT-4',
        creator: 'OpenAI',
        contextWindow: '128k',
        parameterSize: '1.7T',
        modality: 'multimodal',
        releaseDate: '2023-03',
        description: 'Large language model',
      });

      expect(prisma.aIModel.create).toHaveBeenCalledWith({
        data: {
          slug: 'gpt-4',
          name: 'GPT-4',
          creator: 'OpenAI',
          contextWindow: '128k',
          parameterSize: '1.7T',
          modality: 'multimodal',
          releaseDate: '2023-03',
          description: 'Large language model',
        },
      });
    });
  });

  describe('updateModel', () => {
    it('updates only provided fields', async () => {
      (prisma.aIModel.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateModel('m1', { name: 'GPT-5', creator: 'OpenAI' });

      expect(prisma.aIModel.update).toHaveBeenCalledWith({
        where: { id: 'm1' },
        data: { name: 'GPT-5', creator: 'OpenAI' },
      });
    });

    it('ignores undefined fields', async () => {
      (prisma.aIModel.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateModel('m1', { name: 'X', contextWindow: undefined });

      expect(prisma.aIModel.update).toHaveBeenCalledWith({
        where: { id: 'm1' },
        data: { name: 'X' },
      });
    });
  });

  describe('deleteModel', () => {
    it('deletes successfully', async () => {
      (prisma.aIModel.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});
      await expect(service.deleteModel('m1')).resolves.toBeUndefined();
    });

    it('throws descriptive error for P2003', async () => {
      const err = new Error('fk') as Error & { code: string };
      err.code = 'P2003';
      (prisma.aIModel.delete as ReturnType<typeof vi.fn>).mockRejectedValue(err);

      await expect(service.deleteModel('m1')).rejects.toThrow(
        'Cannot delete this AI model because it is referenced by other items.',
      );
    });

    it('re-throws non-P2003 errors', async () => {
      (prisma.aIModel.delete as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('x'));
      await expect(service.deleteModel('m1')).rejects.toThrow('x');
    });
  });

  // ─── getVideos ───────────────────────────────────────────────────

  describe('getVideos', () => {
    it('returns paginated videos', async () => {
      const videos = [{ id: 'v1' }];
      (prisma.video.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(videos);
      (prisma.video.count as ReturnType<typeof vi.fn>).mockResolvedValue(3);

      const result = await service.getVideos(1, '');

      expect(result.videos).toBe(videos);
      expect(result.total).toBe(3);
      expect(result.totalPages).toBe(1);
    });

    it('applies title search', async () => {
      (prisma.video.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      (prisma.video.count as ReturnType<typeof vi.fn>).mockResolvedValue(0);

      await service.getVideos(1, 'tutorial');

      expect(prisma.video.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { title: { contains: 'tutorial', mode: 'insensitive' } },
        }),
      );
    });
  });

  describe('createVideo', () => {
    it('generates slug from title', async () => {
      (prisma.video.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createVideo({ title: 'My Cool Video!' });

      expect(prisma.video.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: 'my-cool-video',
          title: 'My Cool Video!',
          toolCategory: 'general-ai',
          authorName: 'Unknown',
          accent: '#6E56CF',
          tags: [],
        }),
      });
    });

    it('uses provided slug when available', async () => {
      (prisma.video.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createVideo({ title: 'A', slug: 'custom' });

      expect(prisma.video.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ slug: 'custom' }),
      });
    });

    it('generates fallback slug when title missing', async () => {
      vi.spyOn(Date, 'now').mockReturnValue(1234);
      (prisma.video.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createVideo({});

      expect(prisma.video.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ slug: 'video-1234', title: 'Untitled Video' }),
      });

      vi.restoreAllMocks();
    });

    it('uses numeric defaults for durationSeconds, views, likes', async () => {
      (prisma.video.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createVideo({ durationSeconds: '120', views: '500', likes: '10' });

      expect(prisma.video.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          durationSeconds: 120,
          views: 500,
          likes: 10,
        }),
      });
    });

    it('defaults numeric fields to 0 when missing', async () => {
      (prisma.video.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createVideo({});

      expect(prisma.video.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          durationSeconds: 0,
          views: 0,
          likes: 0,
        }),
      });
    });

    it('uses null for channelId when not provided', async () => {
      (prisma.video.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createVideo({});

      expect(prisma.video.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ channelId: null }),
      });
    });
  });

  describe('updateVideo', () => {
    it('updates only allowed fields', async () => {
      (prisma.video.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateVideo('v1', {
        title: 'New',
        description: 'd',
        toolName: 't',
        toolCategory: 'cat',
        thumbnail: 'thumb',
        durationSeconds: 10,
        views: 100,
        likes: 5,
        publishedAt: '2024-01-01',
        authorName: 'A',
        authorAvatar: 'av',
        channelId: 'ch',
        tags: ['a'],
        accent: '#fff',
        slug: 'new-slug',
        extra: 'ignore',
      });

      expect(prisma.video.update).toHaveBeenCalledWith({
        where: { id: 'v1' },
        data: {
          title: 'New',
          description: 'd',
          toolName: 't',
          toolCategory: 'cat',
          thumbnail: 'thumb',
          durationSeconds: 10,
          views: 100,
          likes: 5,
          publishedAt: '2024-01-01',
          authorName: 'A',
          authorAvatar: 'av',
          channelId: 'ch',
          tags: ['a'],
          accent: '#fff',
          slug: 'new-slug',
        },
      });
    });
  });

  describe('deleteVideo', () => {
    it('deletes successfully', async () => {
      (prisma.video.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});
      await expect(service.deleteVideo('v1')).resolves.toBeUndefined();
    });

    it('throws descriptive error for P2003', async () => {
      const err = new Error('fk') as Error & { code: string };
      err.code = 'P2003';
      (prisma.video.delete as ReturnType<typeof vi.fn>).mockRejectedValue(err);

      await expect(service.deleteVideo('v1')).rejects.toThrow(
        'Cannot delete this video because it is referenced by other items.',
      );
    });

    it('re-throws non-P2003 errors', async () => {
      (prisma.video.delete as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('x'));
      await expect(service.deleteVideo('v1')).rejects.toThrow('x');
    });
  });

  // ─── createNews ──────────────────────────────────────────────────

  describe('createNews', () => {
    it('throws when no publisher exists', async () => {
      (prisma.publisher.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(service.createNews({ title: 'Test' })).rejects.toThrow(
        'No publisher found. Please create a publisher first.',
      );
    });

    it('creates news with publisher fallback', async () => {
      (prisma.publisher.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'pub-1' });
      (prisma.news.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createNews({ title: 'AI News' });

      expect(prisma.news.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'AI News',
          publisherId: 'pub-1',
          slug: 'ai-news',
          category: 'general',
          filterTags: [],
        }),
      });
    });

    it('uses provided publisherId when available', async () => {
      (prisma.publisher.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'pub-1' });
      (prisma.news.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createNews({ title: 'X', publisherId: 'pub-custom' });

      expect(prisma.news.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ publisherId: 'pub-custom' }),
      });
    });

    it('generates fallback slug when title missing', async () => {
      vi.spyOn(Date, 'now').mockReturnValue(5678);
      (prisma.publisher.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'pub-1' });
      (prisma.news.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createNews({});

      expect(prisma.news.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ slug: 'news-5678', title: 'Untitled' }),
      });

      vi.restoreAllMocks();
    });

    it('uses summary as dek/aiSummary shorthand', async () => {
      (prisma.publisher.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'pub-1' });
      (prisma.news.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createNews({ title: 'X', summary: 'My summary' });

      expect(prisma.news.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          dek: 'My summary',
          aiSummary: 'My summary',
        }),
      });
    });

    it('prefers dek/aiSummary over summary shorthand', async () => {
      (prisma.publisher.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'pub-1' });
      (prisma.news.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createNews({ title: 'X', summary: 'short', dek: 'dek', aiSummary: 'ai' });

      expect(prisma.news.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          dek: 'dek',
          aiSummary: 'ai',
        }),
      });
    });

    it('uses provided articleUrl', async () => {
      (prisma.publisher.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'pub-1' });
      (prisma.news.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createNews({ title: 'X', articleUrl: 'https://example.com' });

      expect(prisma.news.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ articleUrl: 'https://example.com' }),
      });
    });

    it('uses provided slug', async () => {
      (prisma.publisher.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'pub-1' });
      (prisma.news.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.createNews({ title: 'X', slug: 'custom-slug' });

      expect(prisma.news.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ slug: 'custom-slug' }),
      });
    });
  });

  // ─── updateNews ──────────────────────────────────────────────────

  describe('updateNews', () => {
    it('updates allowed fields', async () => {
      (prisma.news.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateNews('n1', {
        title: 'New',
        dek: 'dek',
        aiSummary: 'ai',
        articleUrl: 'url',
        category: 'cat',
        filterTags: ['tag'],
        publishedAt: '2024-01-01',
        slug: 'new-slug',
      });

      expect(prisma.news.update).toHaveBeenCalledWith({
        where: { id: 'n1' },
        data: {
          title: 'New',
          dek: 'dek',
          aiSummary: 'ai',
          articleUrl: 'url',
          category: 'cat',
          filterTags: ['tag'],
          publishedAt: '2024-01-01',
          slug: 'new-slug',
        },
      });
    });

    it('uses summary as dek/aiSummary shorthand', async () => {
      (prisma.news.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateNews('n1', { summary: 'My summary' });

      expect(prisma.news.update).toHaveBeenCalledWith({
        where: { id: 'n1' },
        data: {
          dek: 'My summary',
          aiSummary: 'My summary',
        },
      });
    });

    it('prefers explicit dek over summary shorthand', async () => {
      (prisma.news.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateNews('n1', { summary: 's', dek: 'explicit' });

      expect(prisma.news.update).toHaveBeenCalledWith({
        where: { id: 'n1' },
        data: { dek: 'explicit', aiSummary: 's' },
      });
    });

    it('prefers explicit aiSummary over summary shorthand', async () => {
      (prisma.news.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateNews('n1', { summary: 's', aiSummary: 'explicit' });

      expect(prisma.news.update).toHaveBeenCalledWith({
        where: { id: 'n1' },
        data: { dek: 's', aiSummary: 'explicit' },
      });
    });

    it('ignores undefined and extra fields', async () => {
      (prisma.news.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await service.updateNews('n1', { title: 'X', slug: undefined, extra: 'nope' });

      expect(prisma.news.update).toHaveBeenCalledWith({
        where: { id: 'n1' },
        data: { title: 'X' },
      });
    });
  });
});
