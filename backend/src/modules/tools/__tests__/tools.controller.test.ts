import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from 'hono';
import { ToolsController } from '../tools.controller.js';

const mockService = {
  listTools: vi.fn(),
  getToolDetails: vi.fn(),
  createOrUpdateReview: vi.fn(),
  toggleBookmark: vi.fn(),
};

vi.mock('../tools.service.js', () => ({
  ToolsService: class ToolsService {
    constructor() { return mockService as never; }
  },
}));

vi.mock('../../../lib/prisma.js', () => ({
  getPrisma: vi.fn().mockReturnValue({ $disconnect: vi.fn() }),
}));

function createContext(overrides: Partial<{
  query: Record<string, string>;
  param: Record<string, string>;
  json: unknown;
  user: { id: string } | undefined;
  status: number;
}> = {}) {
  const jsonFn = vi.fn().mockReturnValue(new Response());
  const statusFn = vi.fn().mockReturnValue({ json: jsonFn });

  return {
    req: {
      query: vi.fn().mockImplementation((key?: string) => {
        if (!key) return overrides.query ?? {};
        return overrides.query?.[key] ?? '';
      }),
      param: vi.fn().mockImplementation((key: string) => overrides.param?.[key] ?? ''),
      json: vi.fn().mockResolvedValue(overrides.json ?? {}),
    },
    get: vi.fn().mockImplementation((key: string) => {
      if (key === 'user') return overrides.user;
      return undefined;
    }),
    json: jsonFn,
    status: statusFn,
    env: { DATABASE_URL: 'postgres://test' },
  } as unknown as Context;
}

describe('ToolsController', () => {
  let controller: ToolsController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new ToolsController();
  });

  describe('listTools', () => {
    it('returns tools on valid query', async () => {
      mockService.listTools.mockResolvedValue({ tools: [], total: 0 });
      const c = createContext({ query: { q: '', sort: 'newest', page: '1' } });

      await controller.listTools(c);

      expect(mockService.listTools).toHaveBeenCalled();
      expect(c.json).toHaveBeenCalledWith({ tools: [], total: 0 });
    });

    it('returns 400 on invalid query', async () => {
      mockService.listTools.mockResolvedValue({ tools: [] });
      const c = createContext({ query: { sort: 'invalid-sort' } });

      await controller.listTools(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid parameters' }),
        400,
      );
    });

    it('returns 500 on service error', async () => {
      mockService.listTools.mockRejectedValue(new Error('DB error'));
      const c = createContext({ query: {} });

      await controller.listTools(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'DB error' }),
        500,
      );
    });
  });

  describe('getToolDetails', () => {
    it('returns tool when found', async () => {
      mockService.getToolDetails.mockResolvedValue({ tool: { slug: 'test' } });
      const c = createContext({ param: { slug: 'test' }, user: { id: 'u1' } });

      await controller.getToolDetails(c);

      expect(c.json).toHaveBeenCalledWith({ tool: { slug: 'test' } });
    });

    it('returns 404 when not found', async () => {
      mockService.getToolDetails.mockResolvedValue(null);
      const c = createContext({ param: { slug: 'missing' } });

      await controller.getToolDetails(c);

      expect(c.json).toHaveBeenCalledWith({ error: 'Tool not found' }, 404);
    });

    it('works without user', async () => {
      mockService.getToolDetails.mockResolvedValue({ tool: { slug: 'test' } });
      const c = createContext({ param: { slug: 'test' }, user: undefined });

      await controller.getToolDetails(c);

      expect(mockService.getToolDetails).toHaveBeenCalledWith('test', undefined);
    });

    it('returns 500 on error', async () => {
      mockService.getToolDetails.mockRejectedValue(new Error('fail'));
      const c = createContext({ param: { slug: 'test' } });

      await controller.getToolDetails(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'fail' }),
        500,
      );
    });
  });

  describe('submitReview', () => {
    it('creates review on valid body', async () => {
      mockService.createOrUpdateReview.mockResolvedValue(undefined);
      const c = createContext({ json: { toolId: 't1', rating: 5, comment: 'Great tool' }, user: { id: 'u1' } });

      await controller.submitReview(c);

      expect(mockService.createOrUpdateReview).toHaveBeenCalledWith('t1', 'u1', 5, 'Great tool');
      expect(c.json).toHaveBeenCalledWith({ status: 'success', message: expect.any(String) });
    });

    it('returns 400 on invalid body', async () => {
      const c = createContext({ json: { toolId: '', rating: 10, comment: 'hi' }, user: { id: 'u1' } });

      await controller.submitReview(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid input data' }),
        400,
      );
    });

    it('returns 500 on error', async () => {
      mockService.createOrUpdateReview.mockRejectedValue(new Error('fail'));
      const c = createContext({ json: { toolId: 't1', rating: 4, comment: 'Nice tool!' }, user: { id: 'u1' } });

      await controller.submitReview(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'fail' }),
        500,
      );
    });
  });

  describe('toggleBookmark', () => {
    it('toggles bookmark on valid body', async () => {
      mockService.toggleBookmark.mockResolvedValue(true);
      const c = createContext({ json: { toolId: 't1' }, user: { id: 'u1' } });

      await controller.toggleBookmark(c);

      expect(mockService.toggleBookmark).toHaveBeenCalledWith('t1', 'u1');
      expect(c.json).toHaveBeenCalledWith({ bookmarked: true });
    });

    it('returns 400 on invalid body', async () => {
      const c = createContext({ json: {}, user: { id: 'u1' } });

      await controller.toggleBookmark(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid input data' }),
        400,
      );
    });

    it('returns 500 on error', async () => {
      mockService.toggleBookmark.mockRejectedValue(new Error('fail'));
      const c = createContext({ json: { toolId: 't1' }, user: { id: 'u1' } });

      await controller.toggleBookmark(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'fail' }),
        500,
      );
    });
  });
});
