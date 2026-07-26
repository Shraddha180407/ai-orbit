import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RobotsService } from '../robots.service.js';

const mockPrisma = {
  robot: { findMany: vi.fn() },
};

let service: RobotsService;

beforeEach(() => {
  vi.clearAllMocks();
  service = new RobotsService(mockPrisma as never);
});

describe('RobotsService', () => {
  describe('listRobots', () => {
    it('returns robots ordered by createdAt desc', async () => {
      const robots = [
        { id: 'r1', name: 'Robot1', createdAt: new Date('2024-01-02') },
        { id: 'r2', name: 'Robot2', createdAt: new Date('2024-01-01') },
      ];
      mockPrisma.robot.findMany.mockResolvedValue(robots);

      const result = await service.listRobots();

      expect(mockPrisma.robot.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(robots);
    });

    it('returns empty array when no robots', async () => {
      mockPrisma.robot.findMany.mockResolvedValue([]);

      const result = await service.listRobots();
      expect(result).toEqual([]);
    });
  });
});
