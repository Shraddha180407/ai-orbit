import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RepositoriesService } from '../repositories.service.js';

function createMockPrisma() {
  return {
    repository: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      groupBy: vi.fn(),
    },
    company: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    $disconnect: vi.fn(),
  };
}

const REPO_ITEM = {
  id: 'repo1',
  slug: 'openai-whisper',
  name: 'whisper',
  owner: 'openai',
  ownerAvatarUrl: 'https://example.com/avatar.png',
  description: 'Robust speech recognition',
  url: 'https://github.com/openai/whisper',
  homepage: null,
  language: 'Python',
  license: 'MIT',
  topics: ['speech', 'ai'],
  stars: 50000,
  forks: 5000,
  openIssues: 100,
  logoUrl: null,
  brandColor: null,
  githubCreatedAt: new Date('2022-09-16'),
  syncedAt: new Date('2025-01-01'),
};

const REPO_DETAIL = {
  ...REPO_ITEM,
  defaultBranch: 'main',
};

describe('RepositoriesService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: RepositoriesService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new RepositoriesService(prisma as never);
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('listRepositories', () => {
    const setupDefaultMocks = (items: typeof REPO_ITEM[] = [REPO_ITEM]) => {
      prisma.repository.findMany.mockResolvedValue(items);
      prisma.repository.count.mockResolvedValue(1);
      prisma.company.findMany.mockResolvedValue([]);
    };

    it('returns items with default params', async () => {
      setupDefaultMocks();
      const result = await service.listRepositories({});

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 21, select: expect.any(Object) }),
      );
      expect(prisma.repository.count).toHaveBeenCalled();
      expect(result.items).toHaveLength(1);
      expect(result.hasMore).toBe(false);
      expect(result.nextCursor).toBeNull();
      expect(result.total).toBe(1);
    });

    it('enriches items with companySlug when company matches', async () => {
      setupDefaultMocks();
      prisma.company.findMany.mockResolvedValue([
        { slug: 'openai', name: 'OpenAI' },
      ]);

      const result = await service.listRepositories({});
      expect(result.items[0].companySlug).toBe('openai');
    });

    it('sets companySlug to null when no company matches', async () => {
      setupDefaultMocks();
      prisma.company.findMany.mockResolvedValue([]);

      const result = await service.listRepositories({});
      expect(result.items[0].companySlug).toBeNull();
    });

    it('matches company case-insensitively by name', async () => {
      setupDefaultMocks();
      prisma.company.findMany.mockResolvedValue([
        { slug: 'openai-org', name: 'OpenAI' },
      ]);

      const result = await service.listRepositories({});
      expect(result.items[0].companySlug).toBe('openai-org');
    });

    it('clamps limit to MAX_LIMIT (50) when exceeding', async () => {
      setupDefaultMocks();
      await service.listRepositories({ limit: 100 });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 51 }),
      );
    });

    it('clamps limit to minimum 1 for zero', async () => {
      setupDefaultMocks();
      await service.listRepositories({ limit: 0 });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 2 }),
      );
    });

    it('clamps limit to minimum 1 for negative values', async () => {
      setupDefaultMocks();
      await service.listRepositories({ limit: -5 });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 2 }),
      );
    });

    it('defaults to 20 for NaN limit', async () => {
      setupDefaultMocks();
      await service.listRepositories({ limit: NaN });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 21 }),
      );
    });

    it('defaults to 20 for undefined limit', async () => {
      setupDefaultMocks();
      await service.listRepositories({ limit: undefined });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 21 }),
      );
    });

    it('sets hasMore and nextCursor when items exceed limit', async () => {
      const items = Array.from({ length: 21 }, (_, i) => ({
        ...REPO_ITEM,
        id: `repo${i}`,
        name: `repo${i}`,
      }));
      prisma.repository.findMany.mockResolvedValue(items);
      prisma.repository.count.mockResolvedValue(25);
      prisma.company.findMany.mockResolvedValue([]);

      const result = await service.listRepositories({ limit: 20 });

      expect(result.hasMore).toBe(true);
      expect(result.items).toHaveLength(20);
      expect(result.nextCursor).toBe('repo19');
    });

    it('returns all items when fewer than limit', async () => {
      const items = [REPO_ITEM];
      prisma.repository.findMany.mockResolvedValue(items);
      prisma.repository.count.mockResolvedValue(1);
      prisma.company.findMany.mockResolvedValue([]);

      const result = await service.listRepositories({ limit: 20 });

      expect(result.hasMore).toBe(false);
      expect(result.items).toHaveLength(1);
      expect(result.nextCursor).toBeNull();
    });

    it('returns empty items and total 0 when no repos exist', async () => {
      prisma.repository.findMany.mockResolvedValue([]);
      prisma.repository.count.mockResolvedValue(0);
      prisma.company.findMany.mockResolvedValue([]);

      const result = await service.listRepositories({});

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
      expect(result.nextCursor).toBeNull();
    });

    it('passes cursor to findMany when provided', async () => {
      setupDefaultMocks();
      await service.listRepositories({ cursor: 'cursor123' });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          cursor: { id: 'cursor123' },
          skip: 1,
        }),
      );
    });

    it('does not pass cursor when undefined', async () => {
      setupDefaultMocks();
      await service.listRepositories({ cursor: undefined });

      const call = prisma.repository.findMany.mock.calls[0][0];
      expect(call.cursor).toBeUndefined();
      expect(call.skip).toBeUndefined();
    });

    it('sorts by stars_desc by default', async () => {
      setupDefaultMocks();
      await service.listRepositories({});

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ stars: 'desc' }, { id: 'asc' }],
        }),
      );
    });

    it('sorts by newest when specified', async () => {
      setupDefaultMocks();
      await service.listRepositories({ sort: 'newest' });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ githubCreatedAt: 'desc' }, { id: 'asc' }],
        }),
      );
    });

    it('sorts by name_asc when specified', async () => {
      setupDefaultMocks();
      await service.listRepositories({ sort: 'name_asc' });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ name: 'asc' }, { id: 'asc' }],
        }),
      );
    });

    it('falls back to stars_desc for invalid sort', async () => {
      setupDefaultMocks();
      await service.listRepositories({ sort: 'invalid_sort' });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ stars: 'desc' }, { id: 'asc' }],
        }),
      );
    });

    it('applies language filter', async () => {
      setupDefaultMocks();
      await service.listRepositories({ language: 'Python' });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { language: { equals: 'Python', mode: 'insensitive' } },
        }),
      );
    });

    it('applies topic filter', async () => {
      setupDefaultMocks();
      await service.listRepositories({ topic: 'ai' });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { topics: { has: 'ai' } },
        }),
      );
    });

    it('applies owner filter with -ai variant', async () => {
      setupDefaultMocks();
      await service.listRepositories({ owner: 'suno' });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { owner: { equals: 'suno', mode: 'insensitive' } },
              { owner: { equals: 'suno-ai', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });

    it('applies q search filter across name, description, and topics', async () => {
      setupDefaultMocks();
      await service.listRepositories({ q: 'speech recognition' });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'speech recognition', mode: 'insensitive' } },
              { description: { contains: 'speech recognition', mode: 'insensitive' } },
              { topics: { has: 'speech recognition' } },
            ],
          },
        }),
      );
    });

    it('trims whitespace from q search term', async () => {
      setupDefaultMocks();
      await service.listRepositories({ q: '  whisper  ' });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { name: { contains: 'whisper', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });

    it('ignores q filter when empty string', async () => {
      setupDefaultMocks();
      await service.listRepositories({ q: '' });

      const call = prisma.repository.findMany.mock.calls[0][0];
      expect(call.where).toEqual({});
    });

    it('ignores q filter when only whitespace', async () => {
      setupDefaultMocks();
      await service.listRepositories({ q: '   ' });

      const call = prisma.repository.findMany.mock.calls[0][0];
      expect(call.where).toEqual({});
    });

    it('combines multiple filters with AND', async () => {
      setupDefaultMocks();
      await service.listRepositories({ language: 'Python', topic: 'ai' });

      expect(prisma.repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              { language: { equals: 'Python', mode: 'insensitive' } },
              { topics: { has: 'ai' } },
            ],
          },
        }),
      );
    });

    it('combines all filters with AND', async () => {
      setupDefaultMocks();
      await service.listRepositories({
        language: 'Python',
        topic: 'ai',
        owner: 'openai',
        q: 'whisper',
      });

      const call = prisma.repository.findMany.mock.calls[0][0];
      expect(call.where.AND).toHaveLength(4);
    });

    it('deduplicates owners when querying companies', async () => {
      const items = [
        { ...REPO_ITEM, owner: 'openai' },
        { ...REPO_ITEM, id: 'repo2', owner: 'openai' },
      ];
      prisma.repository.findMany.mockResolvedValue(items);
      prisma.repository.count.mockResolvedValue(2);
      prisma.company.findMany.mockResolvedValue([]);

      await service.listRepositories({});

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { slug: { in: ['openai'], mode: 'insensitive' } },
              { name: { in: ['openai'], mode: 'insensitive' } },
            ],
          },
        }),
      );
    });

    it('uses LIST_SELECT for findMany', async () => {
      setupDefaultMocks();
      await service.listRepositories({});

      const call = prisma.repository.findMany.mock.calls[0][0];
      expect(call.select).toHaveProperty('id', true);
      expect(call.select).toHaveProperty('slug', true);
      expect(call.select).not.toHaveProperty('readmeHtml');
      expect(call.select).not.toHaveProperty('readmeFetchedAt');
      expect(call.select).not.toHaveProperty('defaultBranch');
    });
  });

  describe('getRepositoryBySlug', () => {
    let mockCache: { match: ReturnType<typeof vi.fn>; put: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      mockCache = {
        match: vi.fn().mockResolvedValue(undefined),
        put: vi.fn().mockResolvedValue(undefined),
      };
      Object.defineProperty(globalThis, 'caches', {
        value: { default: mockCache },
        writable: true,
        configurable: true,
      });
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ content: '', encoding: 'none' }), { status: 404 }),
      );
    });

    afterEach(() => {
      Object.defineProperty(globalThis, 'caches', { value: undefined, writable: true, configurable: true });
    });

    it('returns null when repo not found', async () => {
      prisma.repository.findUnique.mockResolvedValue(null);

      const result = await service.getRepositoryBySlug('nonexistent');

      expect(result).toBeNull();
      expect(prisma.company.findFirst).not.toHaveBeenCalled();
    });

    it('returns repo with companySlug when company matches', async () => {
      prisma.repository.findUnique.mockResolvedValue(REPO_DETAIL);
      prisma.company.findFirst.mockResolvedValue({ slug: 'openai' });

      const result = await service.getRepositoryBySlug('openai-whisper', 'fake-token');

      expect(result).toEqual({
        ...REPO_DETAIL,
        readmeHtml: null,
        readmeFetchedAt: null,
        companySlug: 'openai',
      });
    });

    it('returns repo with null companySlug when no company matches', async () => {
      prisma.repository.findUnique.mockResolvedValue(REPO_DETAIL);
      prisma.company.findFirst.mockResolvedValue(null);

      const result = await service.getRepositoryBySlug('openai-whisper', 'fake-token');

      expect(result).toEqual({
        ...REPO_DETAIL,
        readmeHtml: null,
        readmeFetchedAt: null,
        companySlug: null,
      });
    });

    it('uses DETAIL_SELECT with defaultBranch but without readme fields', async () => {
      prisma.repository.findUnique.mockResolvedValue(null);

      await service.getRepositoryBySlug('test');

      const call = prisma.repository.findUnique.mock.calls[0][0];
      expect(call.select).toHaveProperty('defaultBranch', true);
      expect(call.select).not.toHaveProperty('readmeHtml');
      expect(call.select).not.toHaveProperty('readmeFetchedAt');
    });

    it('fetches readme from GitHub when token is provided', async () => {
      prisma.repository.findUnique.mockResolvedValue(REPO_DETAIL);
      prisma.company.findFirst.mockResolvedValue(null);

      const markdown = Buffer.from('# Hello').toString('base64');
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({ content: markdown, encoding: 'base64' }),
          { status: 200 },
        ),
      );

      const result = await service.getRepositoryBySlug('openai-whisper', 'fake-token');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/openai/whisper/readme',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-token',
          }),
        }),
      );
      expect(result?.readmeHtml).toBe('<h1>Hello</h1>\n');
      expect(result?.readmeFetchedAt).toBeTruthy();
    });

    it('returns readmeHtml null when GitHub fetch fails', async () => {
      prisma.repository.findUnique.mockResolvedValue(REPO_DETAIL);
      prisma.company.findFirst.mockResolvedValue(null);

      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

      const result = await service.getRepositoryBySlug('openai-whisper', 'fake-token');

      expect(result?.readmeHtml).toBeNull();
      expect(result?.readmeFetchedAt).toBeNull();
    });

    it('fetches readme from GitHub unauthenticated when no token is provided', async () => {
      prisma.repository.findUnique.mockResolvedValue(REPO_DETAIL);
      prisma.company.findFirst.mockResolvedValue(null);

      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({
            content: Buffer.from('# Hello').toString('base64'),
            encoding: 'base64',
          }),
        ),
      );

      const result = await service.getRepositoryBySlug('openai-whisper');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/openai/whisper/readme',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String),
          }),
        }),
      );
      expect(result?.readmeHtml).toBe('<h1>Hello</h1>\n');
      expect(result?.readmeFetchedAt).toBeTruthy();
    });

    it('looks up company by owner name case-insensitively', async () => {
      prisma.repository.findUnique.mockResolvedValue(REPO_DETAIL);
      prisma.company.findFirst.mockResolvedValue({ slug: 'OpenAI' });

      await service.getRepositoryBySlug('openai-whisper', 'fake-token');

      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { slug: { equals: 'openai', mode: 'insensitive' } },
            { name: { equals: 'openai', mode: 'insensitive' } },
          ],
        },
        select: { slug: true },
      });
    });

    it('returns cached readme on cache hit without calling GitHub', async () => {
      prisma.repository.findUnique.mockResolvedValue(REPO_DETAIL);
      prisma.company.findFirst.mockResolvedValue(null);

      const cachedHtml = '<h1>Cached README</h1>';
      mockCache.match.mockResolvedValue(
        new Response(JSON.stringify({ readmeHtml: cachedHtml, fetchedAt: '2025-01-01T00:00:00Z' })),
      );

      const result = await service.getRepositoryBySlug('openai-whisper', 'fake-token');

      expect(result?.readmeHtml).toBe(cachedHtml);
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockCache.match).toHaveBeenCalled();
      expect(mockCache.put).not.toHaveBeenCalled();
    });

    it('caches successful GitHub fetch for next request', async () => {
      prisma.repository.findUnique.mockResolvedValue(REPO_DETAIL);
      prisma.company.findFirst.mockResolvedValue(null);

      const markdown = Buffer.from('# Hello').toString('base64');
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({ content: markdown, encoding: 'base64' }),
          { status: 200 },
        ),
      );

      const result = await service.getRepositoryBySlug('openai-whisper', 'fake-token');

      expect(result?.readmeHtml).toBe('<h1>Hello</h1>\n');
      expect(mockCache.put).toHaveBeenCalledWith(
        expect.any(Request),
        expect.any(Response),
      );
    });
  });

  describe('listRepositoryOwners', () => {
    it('returns empty array when no repos exist', async () => {
      prisma.repository.groupBy.mockResolvedValue([]);
      prisma.company.findMany.mockResolvedValue([]);

      const result = await service.listRepositoryOwners();

      expect(result).toEqual([]);
    });

    it('returns owners sorted by repositoryCount descending', async () => {
      prisma.repository.groupBy.mockResolvedValue([
        { owner: 'small-org', _count: { id: 2 } },
        { owner: 'big-org', _count: { id: 10 } },
        { owner: 'mid-org', _count: { id: 5 } },
      ]);
      prisma.company.findMany.mockResolvedValue([]);

      const result = await service.listRepositoryOwners();

      expect(result[0].owner).toBe('big-org');
      expect(result[1].owner).toBe('mid-org');
      expect(result[2].owner).toBe('small-org');
    });

    it('enriches owner with company info when matched by slug', async () => {
      prisma.repository.groupBy.mockResolvedValue([
        { owner: 'openai', _count: { id: 5 } },
      ]);
      prisma.company.findMany.mockResolvedValue([
        { slug: 'openai', name: 'OpenAI', logoUrl: 'https://example.com/logo.png' },
      ]);

      const result = await service.listRepositoryOwners();

      expect(result[0]).toEqual({
        owner: 'openai',
        displayName: 'OpenAI',
        companySlug: 'openai',
        logoUrl: 'https://example.com/logo.png',
        repositoryCount: 5,
      });
    });

    it('enriches owner with company info when matched by name', async () => {
      prisma.repository.groupBy.mockResolvedValue([
        { owner: 'openai', _count: { id: 3 } },
      ]);
      prisma.company.findMany.mockResolvedValue([
        { slug: 'openai-org', name: 'OpenAI', logoUrl: null },
      ]);

      const result = await service.listRepositoryOwners();

      expect(result[0]).toEqual({
        owner: 'openai',
        displayName: 'OpenAI',
        companySlug: 'openai-org',
        logoUrl: null,
        repositoryCount: 3,
      });
    });

    it('strips -ai suffix when matching company', async () => {
      prisma.repository.groupBy.mockResolvedValue([
        { owner: 'suno-ai', _count: { id: 4 } },
      ]);
      prisma.company.findMany.mockResolvedValue([
        { slug: 'suno', name: 'Suno', logoUrl: null },
      ]);

      const result = await service.listRepositoryOwners();

      expect(result[0]).toEqual({
        owner: 'suno-ai',
        displayName: 'Suno',
        companySlug: 'suno',
        logoUrl: null,
        repositoryCount: 4,
      });
    });

    it('returns default values when no company matches', async () => {
      prisma.repository.groupBy.mockResolvedValue([
        { owner: 'unknown-org', _count: { id: 1 } },
      ]);
      prisma.company.findMany.mockResolvedValue([]);

      const result = await service.listRepositoryOwners();

      expect(result[0]).toEqual({
        owner: 'unknown-org',
        displayName: 'unknown-org',
        companySlug: null,
        logoUrl: null,
        repositoryCount: 1,
      });
    });

    it('matches company case-insensitively', async () => {
      prisma.repository.groupBy.mockResolvedValue([
        { owner: 'OpenAI', _count: { id: 3 } },
      ]);
      prisma.company.findMany.mockResolvedValue([
        { slug: 'openai', name: 'OpenAI', logoUrl: null },
      ]);

      const result = await service.listRepositoryOwners();

      expect(result[0].companySlug).toBe('openai');
      expect(result[0].displayName).toBe('OpenAI');
    });

    it('handles multiple owners with mixed company matches', async () => {
      prisma.repository.groupBy.mockResolvedValue([
        { owner: 'openai', _count: { id: 10 } },
        { owner: 'random-user', _count: { id: 1 } },
        { owner: 'suno-ai', _count: { id: 5 } },
      ]);
      prisma.company.findMany.mockResolvedValue([
        { slug: 'openai', name: 'OpenAI', logoUrl: null },
        { slug: 'suno', name: 'Suno', logoUrl: null },
      ]);

      const result = await service.listRepositoryOwners();

      expect(result).toHaveLength(3);
      expect(result[0].companySlug).toBe('openai');
      expect(result[1].companySlug).toBe('suno');
      expect(result[2].companySlug).toBeNull();
    });

    it('queries all companies with correct select fields', async () => {
      prisma.repository.groupBy.mockResolvedValue([]);
      prisma.company.findMany.mockResolvedValue([]);

      await service.listRepositoryOwners();

      expect(prisma.company.findMany).toHaveBeenCalledWith({
        select: { slug: true, name: true, logoUrl: true },
      });
    });
  });
});
