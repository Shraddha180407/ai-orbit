import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockService = {
  listRepositories: vi.fn(),
  getRepositoryBySlug: vi.fn(),
  listRepositoryOwners: vi.fn(),
};

vi.mock('../repositories.service.js', () => ({
  RepositoriesService: class RepositoriesService {
    constructor() {
      return mockService as never;
    }
  },
}));

vi.mock('../../../lib/prisma.js', () => ({
  getPrisma: vi.fn().mockReturnValue({ $disconnect: vi.fn() }),
}));

vi.mock('../../../lib/logger.js', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

import { RepositoriesController } from '../repositories.controller.js';
import { getPrisma } from '../../../lib/prisma.js';

import { logger } from '../../../lib/logger.js';

function mockContext(queryParams: Record<string, string> = {}, params: Record<string, string> = {}) {
  let status: number;
  let jsonBody: unknown;
  return {
    json: (data: unknown, s?: number) => {
      status = s ?? 200;
      jsonBody = data;
      return { status, body: data };
    },
    req: {
      query: (key: string) => queryParams[key] || '',
      param: (key: string) => params[key] || '',
    },
    env: {},
    get status() { return status; },
    get jsonBody() { return jsonBody; },
  };
}

describe('RepositoriesController', () => {
  const controller = new RepositoriesController();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(mockService).forEach(fn => fn.mockReset());
  });

  describe('listRepositories', () => {
    it('returns 200 with result', async () => {
      const result = { items: [], nextCursor: null, hasMore: false, total: 0 };
      mockService.listRepositories.mockResolvedValue(result);

      const c = mockContext();
      await controller.listRepositories(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
    });

    it('passes query params to service', async () => {
      mockService.listRepositories.mockResolvedValue({ items: [], nextCursor: null, hasMore: false, total: 0 });

      const c = mockContext({ sort: 'newest', limit: '10', language: 'Python', topic: 'ai', q: 'search', owner: 'openai', cursor: 'c1' });
      await controller.listRepositories(c as never);

      expect(mockService.listRepositories).toHaveBeenCalledWith({
        sort: 'newest',
        limit: 10,
        language: 'Python',
        topic: 'ai',
        q: 'search',
        owner: 'openai',
        cursor: 'c1',
      });
    });

    it('returns 400 for invalid sort', async () => {
      const c = mockContext({ sort: 'invalid' });
      await controller.listRepositories(c as never);

      expect(c.status).toBe(400);
      expect(c.jsonBody).toHaveProperty('error');
      expect((c.jsonBody as Record<string, unknown>).error).toContain('Invalid sort');
    });

    it('returns 500 on service error', async () => {
      mockService.listRepositories.mockRejectedValue(new Error('DB failure'));

      const c = mockContext();
      await controller.listRepositories(c as never);

      expect(c.status).toBe(500);
      expect(c.jsonBody).toHaveProperty('error', 'Failed to fetch repositories');
    });

    it('logs error on service failure', async () => {
      const err = new Error('DB failure');
      mockService.listRepositories.mockRejectedValue(err);

      const c = mockContext();
      await controller.listRepositories(c as never);

      expect(logger.error).toHaveBeenCalledWith('Error listing repositories:', err);
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.listRepositories.mockRejectedValue(new Error('fail'));

      const c = mockContext();
      await controller.listRepositories(c as never);

      expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it('does not pass empty query params as empty strings', async () => {
      mockService.listRepositories.mockResolvedValue({ items: [], nextCursor: null, hasMore: false, total: 0 });

      const c = mockContext({});
      await controller.listRepositories(c as never);

      expect(mockService.listRepositories).toHaveBeenCalledWith({
        sort: undefined,
        limit: undefined,
        language: undefined,
        topic: undefined,
        q: undefined,
        owner: undefined,
        cursor: undefined,
      });
    });

    it('parses limit as integer', async () => {
      mockService.listRepositories.mockResolvedValue({ items: [], nextCursor: null, hasMore: false, total: 0 });

      const c = mockContext({ limit: '25' });
      await controller.listRepositories(c as never);

      expect(mockService.listRepositories).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 25 }),
      );
    });

    it('handles NaN limit gracefully', async () => {
      mockService.listRepositories.mockResolvedValue({ items: [], nextCursor: null, hasMore: false, total: 0 });

      const c = mockContext({ limit: 'abc' });
      await controller.listRepositories(c as never);

      expect(mockService.listRepositories).toHaveBeenCalledWith(
        expect.objectContaining({ limit: NaN }),
      );
    });
  });

  describe('getRepositoryBySlug', () => {
    it('returns 200 with repo', async () => {
      const repo = { slug: 'test', companySlug: 'org' };
      mockService.getRepositoryBySlug.mockResolvedValue(repo);

      const c = mockContext({}, { slug: 'test' });
      await controller.getRepositoryBySlug(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(repo);
    });

    it('returns 404 when not found', async () => {
      mockService.getRepositoryBySlug.mockResolvedValue(null);

      const c = mockContext({}, { slug: 'nonexistent' });
      await controller.getRepositoryBySlug(c as never);

      expect(c.status).toBe(404);
      expect(c.jsonBody).toHaveProperty('error', 'Repository not found');
    });

    it('returns 500 on service error', async () => {
      mockService.getRepositoryBySlug.mockRejectedValue(new Error('DB error'));

      const c = mockContext({}, { slug: 'test' });
      await controller.getRepositoryBySlug(c as never);

      expect(c.status).toBe(500);
      expect(c.jsonBody).toHaveProperty('error', 'Failed to fetch repository');
    });

    it('logs error on failure', async () => {
      const err = new Error('DB error');
      mockService.getRepositoryBySlug.mockRejectedValue(err);

      const c = mockContext({}, { slug: 'test' });
      await controller.getRepositoryBySlug(c as never);

      expect(logger.error).toHaveBeenCalledWith('Error fetching repository:', err);
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.getRepositoryBySlug.mockRejectedValue(new Error('fail'));

      const c = mockContext({}, { slug: 'test' });
      await controller.getRepositoryBySlug(c as never);

      expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it('defaults slug to empty string when missing', async () => {
      mockService.getRepositoryBySlug.mockResolvedValue(null);

      const c = mockContext({}, {});
      await controller.getRepositoryBySlug(c as never);

      expect(mockService.getRepositoryBySlug).toHaveBeenCalledWith('', undefined);
    });
  });

  describe('listRepositoryOwners', () => {
    it('returns 200 with owners', async () => {
      const owners = [{ owner: 'org', displayName: 'Org', companySlug: null, logoUrl: null, repositoryCount: 5 }];
      mockService.listRepositoryOwners.mockResolvedValue(owners);

      const c = mockContext();
      await controller.listRepositoryOwners(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(owners);
    });

    it('returns 500 on service error', async () => {
      mockService.listRepositoryOwners.mockRejectedValue(new Error('DB error'));

      const c = mockContext();
      await controller.listRepositoryOwners(c as never);

      expect(c.status).toBe(500);
      expect(c.jsonBody).toHaveProperty('error', 'Failed to fetch repository owners');
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.listRepositoryOwners.mockRejectedValue(new Error('fail'));

      const c = mockContext();
      await controller.listRepositoryOwners(c as never);

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });
});