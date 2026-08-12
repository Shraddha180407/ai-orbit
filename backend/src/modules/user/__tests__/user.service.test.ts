import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../user.service.js';

const mockPrisma = {
  bookmark: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
  toolHistory: {
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
};

let service: UserService;

beforeEach(() => {
  vi.clearAllMocks();
  service = new UserService(mockPrisma as never);
});

describe('UserService', () => {
  describe('getSavedTools', () => {
    it('returns mapped bookmarks with tool name and category', async () => {
      mockPrisma.bookmark.findMany.mockResolvedValue([
        {
          id: 'bm1',
          toolId: 't1',
          createdAt: new Date('2024-01-01'),
          tool: {
            name: 'React',
            categories: [{ category: { name: 'Framework' } }],
          },
        },
      ]);

      const result = await service.getSavedTools('u1');

      expect(mockPrisma.bookmark.findMany).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        include: {
          tool: {
            include: {
              categories: { include: { category: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([
        {
          id: 'bm1',
          toolId: 't1',
          name: 'React',
          category: 'Framework',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ]);
    });

    it('defaults category to Uncategorized when no categories', async () => {
      mockPrisma.bookmark.findMany.mockResolvedValue([
        {
          id: 'bm2',
          toolId: 't2',
          createdAt: new Date('2024-01-02'),
          tool: { name: 'Tool2', categories: [] },
        },
      ]);

      const result = await service.getSavedTools('u1');
      expect(result[0].category).toBe('Uncategorized');
    });

    it('returns empty array when no bookmarks', async () => {
      mockPrisma.bookmark.findMany.mockResolvedValue([]);
      const result = await service.getSavedTools('u1');
      expect(result).toEqual([]);
    });
  });

  describe('removeSavedTool', () => {
    it('deletes bookmark when owner matches', async () => {
      mockPrisma.bookmark.findUnique.mockResolvedValue({ id: 'bm1', userId: 'u1' });
      mockPrisma.bookmark.delete.mockResolvedValue({});

      const result = await service.removeSavedTool('bm1', 'u1');
      expect(result).toEqual({ success: true });
      expect(mockPrisma.bookmark.delete).toHaveBeenCalledWith({ where: { id: 'bm1' } });
    });

    it('throws NotFound when bookmark not found', async () => {
      mockPrisma.bookmark.findUnique.mockResolvedValue(null);

      await expect(service.removeSavedTool('bm1', 'u1')).rejects.toThrow('Saved tool not found or unauthorized');
    });

    it('throws NotFound when userId does not match', async () => {
      mockPrisma.bookmark.findUnique.mockResolvedValue({ id: 'bm1', userId: 'other' });

      await expect(service.removeSavedTool('bm1', 'u1')).rejects.toThrow('Saved tool not found or unauthorized');
    });
  });

  describe('getHistory', () => {
    it('returns history ordered by viewedAt desc', async () => {
      mockPrisma.toolHistory.findMany.mockResolvedValue([
        {
          id: 'h1',
          toolId: 't1',
          viewedAt: new Date('2024-01-02'),
          tool: { id: 't1', name: 'React', slug: 'react', description: 'A JS lib', logoUrl: null, pricingModel: 'FREE', avgRating: 4.5, reviewCount: 10 },
        },
      ]);

      const result = await service.getHistory('u1');

      expect(mockPrisma.toolHistory.findMany).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        include: {
          tool: {
            select: {
              id: true, name: true, slug: true, description: true, logoUrl: true,
              pricingModel: true, avgRating: true, reviewCount: true,
            },
          },
        },
        orderBy: { viewedAt: 'desc' },
        take: 50,
      });
      expect(result).toEqual([
        {
          id: 'h1',
          toolId: 't1',
          viewedAt: '2024-01-02T00:00:00.000Z',
          tool: { id: 't1', name: 'React', slug: 'react', description: 'A JS lib', logoUrl: null, pricingModel: 'FREE', avgRating: 4.5, reviewCount: 10 },
        },
      ]);
    });

    it('returns empty array when no history', async () => {
      mockPrisma.toolHistory.findMany.mockResolvedValue([]);
      const result = await service.getHistory('u1');
      expect(result).toEqual([]);
    });
  });

  describe('recordHistory', () => {
    it('upserts history entry', async () => {
      mockPrisma.toolHistory.upsert.mockResolvedValue({});

      const result = await service.recordHistory('t1', 'u1');

      expect(mockPrisma.toolHistory.upsert).toHaveBeenCalledWith({
        where: {
          userId_toolId: { userId: 'u1', toolId: 't1' },
        },
        update: { viewedAt: expect.any(Date) },
        create: { userId: 'u1', toolId: 't1' },
      });
      expect(result).toEqual({ success: true });
    });
  });
});
