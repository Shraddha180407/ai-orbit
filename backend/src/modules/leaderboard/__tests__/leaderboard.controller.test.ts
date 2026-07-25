import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from 'hono';
import { LeaderboardController } from '../leaderboard.controller.js';

const mockService = {
  listTools: vi.fn(),
  listModels: vi.fn(),
  listCompanies: vi.fn(),
};

vi.mock('../leaderboard.service.js', () => ({
  LeaderboardService: class LeaderboardService {
    constructor() { return mockService as never; }
  },
}));

vi.mock('@prisma/adapter-neon', () => ({
  PrismaNeon: class PrismaNeon {},
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class PrismaClient {},
}));

function createContext(overrides: Partial<{
  query: Record<string, string>;
}> = {}) {
  const jsonFn = vi.fn().mockReturnValue(new Response());
  return {
    req: {
      query: vi.fn().mockImplementation((key?: string) => {
        if (!key) return overrides.query ?? {};
        return overrides.query?.[key] ?? '';
      }),
    },
    json: jsonFn,
    env: { DATABASE_URL: 'postgres://test' },
  } as unknown as Context;
}

describe('LeaderboardController', () => {
  let controller: LeaderboardController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new LeaderboardController();
  });

  describe('getTools', () => {
    it('returns tools on success with category', async () => {
      mockService.listTools.mockResolvedValue([{ rank: 1, name: 'Tool' }]);
      const c = createContext({ query: { category: 'AI' } });

      await controller.getTools(c);

      expect(mockService.listTools).toHaveBeenCalledWith('AI');
      expect(c.json).toHaveBeenCalledWith([{ rank: 1, name: 'Tool' }]);
    });

    it('returns 500 on error', async () => {
      mockService.listTools.mockRejectedValue(new Error('fail'));
      const c = createContext({ query: {} });

      await controller.getTools(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'fail' }),
        500,
      );
    });
  });

  describe('getModels', () => {
    it('returns models on success with category', async () => {
      mockService.listModels.mockResolvedValue([{ rank: 1, name: 'Model' }]);
      const c = createContext({ query: { category: 'Text' } });

      await controller.getModels(c);

      expect(mockService.listModels).toHaveBeenCalledWith('Text');
      expect(c.json).toHaveBeenCalledWith([{ rank: 1, name: 'Model' }]);
    });

    it('returns 500 on error', async () => {
      mockService.listModels.mockRejectedValue(new Error('fail'));
      const c = createContext({ query: {} });

      await controller.getModels(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'fail' }),
        500,
      );
    });
  });

  describe('getCompanies', () => {
    it('returns companies on success', async () => {
      mockService.listCompanies.mockResolvedValue([{ rank: 1, name: 'Company' }]);
      const c = createContext();

      await controller.getCompanies(c);

      expect(mockService.listCompanies).toHaveBeenCalled();
      expect(c.json).toHaveBeenCalledWith([{ rank: 1, name: 'Company' }]);
    });

    it('returns 500 on error', async () => {
      mockService.listCompanies.mockRejectedValue(new Error('fail'));
      const c = createContext();

      await controller.getCompanies(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'fail' }),
        500,
      );
    });
  });
});
