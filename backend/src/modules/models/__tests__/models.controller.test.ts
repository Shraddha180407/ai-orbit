import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from 'hono';
import { ModelsController } from '../models.controller.js';

const mockService = {
  listModels: vi.fn(),
  getModelById: vi.fn(),
};

vi.mock('../models.service.js', () => ({
  ModelsService: class ModelsService {
    constructor() { return mockService as never; }
  },
}));

vi.mock('../../../lib/prisma.js', () => ({
  getPrisma: vi.fn().mockReturnValue({ $disconnect: vi.fn() }),
}));

function createContext(overrides: Partial<{
  query: Record<string, string>;
  param: Record<string, string>;
  status: number;
}> = {}) {
  const jsonFn = vi.fn().mockReturnValue(new Response());
  return {
    req: {
      query: vi.fn().mockImplementation((key?: string) => {
        if (!key) return overrides.query ?? {};
        return overrides.query?.[key] ?? '';
      }),
      param: vi.fn().mockImplementation((key: string) => overrides.param?.[key] ?? ''),
    },
    json: jsonFn,
    status: vi.fn().mockReturnValue({ json: jsonFn }),
    env: { DATABASE_URL: 'postgres://test' },
  } as unknown as Context;
}

describe('ModelsController', () => {
  let controller: ModelsController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new ModelsController();
  });

  describe('listModels', () => {
    it('returns models on valid query', async () => {
      mockService.listModels.mockResolvedValue({ items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: false } });
      const c = createContext({ query: {} });

      await controller.listModels(c);

      expect(c.json).toHaveBeenCalledWith(expect.objectContaining({ items: [] }));
    });

    it('returns 400 on invalid query', async () => {
      const c = createContext({ query: { limit: '-1' } });

      await controller.listModels(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid query parameters' }),
        400,
      );
    });

    it('returns 500 on error', async () => {
      mockService.listModels.mockRejectedValue(new Error('DB fail'));
      const c = createContext({ query: {} });

      await controller.listModels(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'DB fail' }),
        500,
      );
    });
  });

  describe('getModel', () => {
    it('returns model when found', async () => {
      mockService.getModelById.mockResolvedValue({ id: 'm1', name: 'GPT-4' });
      const c = createContext({ param: { id: 'm1' } });

      await controller.getModel(c);

      expect(c.json).toHaveBeenCalledWith({ id: 'm1', name: 'GPT-4' });
    });

    it('returns 400 when id missing', async () => {
      const c = createContext({ param: {} });

      await controller.getModel(c);

      expect(c.json).toHaveBeenCalledWith({ error: 'Model ID is required' }, 400);
    });

    it('returns 404 when not found', async () => {
      mockService.getModelById.mockResolvedValue(null);
      const c = createContext({ param: { id: 'nonexistent' } });

      await controller.getModel(c);

      expect(c.json).toHaveBeenCalledWith({ error: 'Model not found' }, 404);
    });

    it('returns 500 on error', async () => {
      mockService.getModelById.mockRejectedValue(new Error('DB fail'));
      const c = createContext({ param: { id: 'm1' } });

      await controller.getModel(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'DB fail' }),
        500,
      );
    });
  });
});
