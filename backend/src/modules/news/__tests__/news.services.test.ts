import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsService } from '../news.services.js';

vi.mock('../../../lib/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../ingestion/topicTagging.js', () => ({
  GENERIC_TOPIC_FALLBACK: 'AI',
  COMPANY_TOPIC_LABELS: new Set(['OpenAI', 'Anthropic', 'Google DeepMind', 'Meta AI', 'Microsoft', 'NVIDIA', 'Mistral AI', 'Hugging Face', 'Perplexity']),
}));

function createMockPrisma() {
  return {
    news: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      groupBy: vi.fn(),
    },
    newsVote: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    newsBookmark: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    newsComment: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    publisher: {
      findMany: vi.fn(),
    },
    $queryRaw: vi.fn(),
  };
}

const baseRow = {
  id: 'cuid-1',
  slug: 'test-article',
  title: 'Test Article',
  dek: 'A test dek',
  aiSummary: 'Summary',
  articleUrl: 'https://example.com',
  category: 'openai',
  publishedAt: new Date('2025-01-15'),
  upvotes: 5,
  downvotes: 1,
  filterTags: ['tag1'],
  publisherId: 'pub-1',
  publisher: { id: 'pub-1', name: 'TechCrunch', domain: 'techcrunch.com', colorHex: '#00FF00', followersLabel: '100K', logoUrl: null },
  topics: [{ name: 'OpenAI' }],
};

describe('NewsService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: NewsService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new NewsService(prisma as never);
  });

  describe('getArticles', () => {
    it('returns all articles without paging', async () => {
      prisma.news.findMany.mockResolvedValue([baseRow]);
      prisma.newsBookmark.findMany.mockResolvedValue([]);

      const result = await service.getArticles();

      expect(result.articles).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.articles[0].score).toBe(97);
      expect(result.articles[0].bookmarked).toBe(false);
    });

    it('returns paginated results with paging', async () => {
      prisma.news.findMany.mockResolvedValue([baseRow]);
      prisma.news.count.mockResolvedValue(25);
      prisma.newsBookmark.findMany.mockResolvedValue([]);

      const result = await service.getArticles({ page: 2, perPage: 10 });

      expect(result.total).toBe(25);
      expect(prisma.news.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
    });

    it('marks bookmarked articles when clientId provided', async () => {
      prisma.news.findMany.mockResolvedValue([baseRow]);
      prisma.news.count.mockResolvedValue(1);
      prisma.newsBookmark.findMany.mockResolvedValue([{ articleId: 'cuid-1' }]);

      const result = await service.getArticles(undefined, 'client-abc');

      expect(result.articles[0].bookmarked).toBe(true);
    });

    it('defaults bookmarked to false without clientId', async () => {
      prisma.news.findMany.mockResolvedValue([baseRow]);
      prisma.newsBookmark.findMany.mockResolvedValue([]);

      const result = await service.getArticles();

      expect(result.articles[0].bookmarked).toBe(false);
    });
  });

  describe('getArticleBySlug', () => {
    it('returns article with bookmark when clientId provided', async () => {
      prisma.news.findUnique.mockResolvedValue(baseRow);
      prisma.newsBookmark.findMany.mockResolvedValue([{ articleId: 'cuid-1' }]);

      const result = await service.getArticleBySlug('test-article', 'client-1');

      expect(result).not.toBeNull();
      expect(result!.bookmarked).toBe(true);
    });

    it('returns article without bookmark when no clientId', async () => {
      prisma.news.findUnique.mockResolvedValue(baseRow);
      prisma.newsBookmark.findMany.mockResolvedValue([]);

      const result = await service.getArticleBySlug('test-article');

      expect(result).not.toBeNull();
      expect(result!.bookmarked).toBe(false);
    });

    it('returns null when not found', async () => {
      prisma.news.findUnique.mockResolvedValue(null);

      const result = await service.getArticleBySlug('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getRelatedArticles', () => {
    it('finds related by category/topic overlap', async () => {
      prisma.news.findMany.mockResolvedValue([baseRow]);

      const article = { ...baseRow, id: 'test-article', topics: ['OpenAI'] } as never;
      const result = await service.getRelatedArticles(article);

      expect(result).toHaveLength(1);
      expect(prisma.news.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ category: 'openai' }),
            ]),
          }),
        }),
      );
    });

    it('falls back to recent when no overlap', async () => {
      prisma.news.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([baseRow]);

      const article = { ...baseRow, id: 'test-article', category: 'robotics', topics: ['Robotics'] } as never;
      const result = await service.getRelatedArticles(article);

      expect(result).toHaveLength(1);
      expect(prisma.news.findMany).toHaveBeenCalledTimes(2);
    });
  });

  describe('getSourcesMap', () => {
    it('returns publisher map keyed by id', async () => {
      prisma.publisher.findMany.mockResolvedValue([
        { id: 'pub-1', name: 'TC', domain: 'tc.com', colorHex: '#FFF', followersLabel: '10K', logoUrl: null },
      ]);

      const result = await service.getSourcesMap();

      expect(result['pub-1']).toEqual({
        name: 'TC',
        domain: 'tc.com',
        color: '#FFF',
        followers: '10K',
        logoUrl: null,
      });
    });

    it('defaults color to #8B8FA3 when null', async () => {
      prisma.publisher.findMany.mockResolvedValue([
        { id: 'pub-1', name: 'TC', domain: 'tc.com', colorHex: null, followersLabel: null, logoUrl: null },
      ]);

      const result = await service.getSourcesMap();

      expect(result['pub-1'].color).toBe('#8B8FA3');
      expect(result['pub-1'].followers).toBe('');
    });
  });

  describe('getCategories', () => {
    it('returns grouped categories sorted by count desc', async () => {
      prisma.news.groupBy.mockResolvedValue([
        { category: 'research', _count: { category: 10 } },
        { category: 'openai', _count: { category: 5 } },
      ]);

      const result = await service.getCategories();

      expect(result).toHaveLength(2);
      expect(result[0].key).toBe('research');
      expect(result[0].count).toBe(10);
      expect(result[0].label).toBe('Research');
    });
  });

  describe('getFilterChips', () => {
    it('returns static chips plus dynamic from topics', async () => {
      prisma.$queryRaw.mockResolvedValue([
        { name: 'Robotics', count: 10n },
        { name: 'OpenAI', count: 5n },
        { name: 'Funding', count: 3n },
      ]);

      const result = await service.getFilterChips();

      expect(result[0]).toEqual({ id: 'all', label: 'All News' });
      expect(result[1]).toEqual({ id: 'trending', label: 'Trending' });
      const dynamicIds = result.slice(2).map(c => c.id);
      expect(dynamicIds).toContain('Robotics');
      expect(dynamicIds).toContain('Funding');
      expect(dynamicIds).not.toContain('OpenAI');
      expect(dynamicIds).not.toContain('AI');
    });

    it('respects cache across calls', async () => {
      vi.resetModules();
      const { NewsService: FreshNewsService } = await import('../news.services.js');
      const freshPrisma = createMockPrisma();
      const freshService = new FreshNewsService(freshPrisma as never);

      freshPrisma.$queryRaw.mockResolvedValue([
        { name: 'Robotics', count: 10n },
      ]);

      await freshService.getFilterChips();
      await freshService.getFilterChips();

      expect(freshPrisma.$queryRaw).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPopularSources', () => {
    it('returns top 5 publisher ids by article count', async () => {
      prisma.publisher.findMany.mockResolvedValue(
        Array.from({ length: 5 }, (_, i) => ({ id: `pub-${i}` })),
      );

      const result = await service.getPopularSources();

      expect(result).toHaveLength(5);
      expect(result[0]).toBe('pub-0');
    });
  });

  describe('getArticleIdBySlug', () => {
    it('returns id when found', async () => {
      prisma.news.findUnique.mockResolvedValue({ id: 'cuid-real' });

      const result = await service.getArticleIdBySlug('some-slug');

      expect(result).toBe('cuid-real');
    });

    it('returns null when not found', async () => {
      prisma.news.findUnique.mockResolvedValue(null);

      const result = await service.getArticleIdBySlug('missing');

      expect(result).toBeNull();
    });
  });

  describe('setVote', () => {
    it('creates vote when none exists', async () => {
      prisma.newsVote.findUnique.mockResolvedValue(null);
      prisma.newsVote.create.mockResolvedValue({});
      prisma.newsVote.count.mockResolvedValueOnce(1).mockResolvedValueOnce(0);

      const result = await service.setVote('article-1', 'client-1', 1);

      expect(result).toEqual({ upvotes: 1, downvotes: 0, myVote: 1 });
      expect(prisma.newsVote.create).toHaveBeenCalled();
    });

    it('toggles same direction (removes vote)', async () => {
      prisma.newsVote.findUnique.mockResolvedValue({ id: 'v1', value: 1 });
      prisma.newsVote.delete.mockResolvedValue({});
      prisma.newsVote.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);

      const result = await service.setVote('article-1', 'client-1', 1);

      expect(result.myVote).toBeNull();
      expect(prisma.newsVote.delete).toHaveBeenCalled();
    });

    it('switches direction', async () => {
      prisma.newsVote.findUnique.mockResolvedValue({ id: 'v1', value: 1 });
      prisma.newsVote.update.mockResolvedValue({});
      prisma.newsVote.count.mockResolvedValueOnce(0).mockResolvedValueOnce(1);

      const result = await service.setVote('article-1', 'client-1', -1);

      expect(result.myVote).toBe(-1);
      expect(prisma.newsVote.update).toHaveBeenCalled();
    });

    it('recomputes upvotes/downvotes', async () => {
      prisma.newsVote.findUnique.mockResolvedValue(null);
      prisma.newsVote.create.mockResolvedValue({});
      prisma.newsVote.count.mockResolvedValueOnce(3).mockResolvedValueOnce(2);

      await service.setVote('article-1', 'client-1', 1);

      expect(prisma.news.update).toHaveBeenCalledWith({
        where: { id: 'article-1' },
        data: { upvotes: 3, downvotes: 2 },
      });
    });
  });

  describe('addBookmark', () => {
    it('creates bookmark when none exists', async () => {
      prisma.newsBookmark.findUnique.mockResolvedValue(null);
      prisma.newsBookmark.create.mockResolvedValue({});

      const result = await service.addBookmark('article-1', 'client-1');

      expect(result).toEqual({ bookmarked: true });
      expect(prisma.newsBookmark.create).toHaveBeenCalled();
    });

    it('is idempotent on duplicate', async () => {
      prisma.newsBookmark.findUnique.mockResolvedValue({ id: 'bm-1' });

      const result = await service.addBookmark('article-1', 'client-1');

      expect(result).toEqual({ bookmarked: true });
      expect(prisma.newsBookmark.create).not.toHaveBeenCalled();
    });
  });

  describe('removeBookmark', () => {
    it('removes bookmark', async () => {
      prisma.newsBookmark.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.removeBookmark('article-1', 'client-1');

      expect(result).toEqual({ bookmarked: false });
      expect(prisma.newsBookmark.deleteMany).toHaveBeenCalledWith({
        where: { articleId: 'article-1', clientId: 'client-1' },
      });
    });
  });

  describe('addComment', () => {
    it('creates comment with authorName', async () => {
      prisma.newsComment.create.mockResolvedValue({
        id: 'c1',
        authorName: 'Alice',
        body: 'Great post',
        createdAt: new Date('2025-01-15T12:00:00Z'),
      });

      const result = await service.addComment('article-1', 'client-1', 'Alice', 'Great post');

      expect(result.id).toBe('c1');
      expect(result.createdAt).toBe('2025-01-15T12:00:00.000Z');
    });

    it('creates comment without authorName', async () => {
      prisma.newsComment.create.mockResolvedValue({
        id: 'c2',
        authorName: null,
        body: 'Nice',
        createdAt: new Date('2025-01-15T12:00:00Z'),
      });

      const result = await service.addComment('article-1', 'client-1', undefined, 'Nice');

      expect(result.authorName).toBeNull();
    });
  });

  describe('getComments', () => {
    it('returns results in order returned by prisma (newest first)', async () => {
      prisma.newsComment.findMany.mockResolvedValue([
        { id: 'c2', authorName: 'B', body: 'new', createdAt: new Date('2025-01-02') },
        { id: 'c1', authorName: 'A', body: 'old', createdAt: new Date('2025-01-01') },
      ]);

      const result = await service.getComments('article-1');

      expect(result).toHaveLength(2);
      expect(result[0].createdAt).toBe('2025-01-02T00:00:00.000Z');
      expect(result[1].createdAt).toBe('2025-01-01T00:00:00.000Z');
    });
  });
});
