import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RobotsController } from '../robots.controller.js';

const mockService = {
  listRobots: vi.fn(),
};

vi.mock('../../../lib/prisma.js', () => ({
  getPrisma: vi.fn().mockReturnValue({ $disconnect: vi.fn() }),
}));

vi.mock('../robots.service.js', () => ({
  RobotsService: class RobotsService {
    constructor() {
      return mockService as never;
    }
  },
}));

function createContext() {
  const json = vi.fn().mockReturnThis();
  return {
    req: { query: () => ({}) },
    json,
    _json: json,
  };
}

describe('RobotsController', () => {
  let controller: RobotsController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new RobotsController();
  });

  describe('listRobots', () => {
    it('returns robots on success', async () => {
      const robots = [{ id: 'r1', name: 'Robot1' }];
      mockService.listRobots.mockResolvedValue(robots);

      const c = createContext();
      await controller.listRobots(c as never);

      expect(c.json).toHaveBeenCalledWith(robots);
    });

    it('returns 500 on service error', async () => {
      mockService.listRobots.mockRejectedValue(new Error('DB error'));

      const c = createContext();
      await controller.listRobots(c as never);

      expect(c.json).toHaveBeenCalledWith({ error: 'DB error' }, 500);
    });

    it('always disconnects prisma', async () => {
      mockService.listRobots.mockResolvedValue([]);
      const c = createContext();
      await controller.listRobots(c as never);

      const { getPrisma } = await import('../../../lib/prisma.js');
      const prisma = (getPrisma as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(prisma.$disconnect).toHaveBeenCalled();
    });
  });
});
