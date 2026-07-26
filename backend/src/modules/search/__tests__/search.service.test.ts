import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchService } from '../search.service.js';

const mockPrisma = {
  tool: { findMany: vi.fn() },
  company: { findMany: vi.fn() },
  aIModel: { findMany: vi.fn() },
  repository: { findMany: vi.fn() },
  robot: { findMany: vi.fn() },
  device: { findMany: vi.fn() },
};

let service: SearchService;

beforeEach(() => {
  vi.clearAllMocks();
  service = new SearchService(mockPrisma as never);
});

describe('SearchService', () => {
  describe('autocomplete', () => {
    beforeEach(() => {
      mockPrisma.tool.findMany.mockResolvedValue([]);
      mockPrisma.company.findMany.mockResolvedValue([]);
      mockPrisma.aIModel.findMany.mockResolvedValue([]);
      mockPrisma.repository.findMany.mockResolvedValue([]);
      mockPrisma.robot.findMany.mockResolvedValue([]);
      mockPrisma.device.findMany.mockResolvedValue([]);
    });

    it('returns empty array for empty q', async () => {
      const result = await service.autocomplete('');
      expect(result).toEqual([]);
      expect(mockPrisma.tool.findMany).not.toHaveBeenCalled();
    });

    it('returns empty for whitespace-only q', async () => {
      const result = await service.autocomplete('   ');
      expect(result).toEqual([]);
    });

    it('queries all 6 entity types in parallel', async () => {
      await service.autocomplete('test');

      expect(mockPrisma.tool.findMany).toHaveBeenCalledOnce();
      expect(mockPrisma.company.findMany).toHaveBeenCalledOnce();
      expect(mockPrisma.aIModel.findMany).toHaveBeenCalledOnce();
      expect(mockPrisma.repository.findMany).toHaveBeenCalledOnce();
      expect(mockPrisma.robot.findMany).toHaveBeenCalledOnce();
      expect(mockPrisma.device.findMany).toHaveBeenCalledOnce();
    });

    it('returns merged sorted results with prefix matches first', async () => {
      mockPrisma.tool.findMany.mockResolvedValue([
        { id: 't1', name: 'TestApp', slug: 'testapp', categories: [{ category: { name: 'AI' } }] },
      ]);
      mockPrisma.company.findMany.mockResolvedValue([
        { id: 'c1', name: 'TestingCo', slug: 'testing-co' },
      ]);
      mockPrisma.aIModel.findMany.mockResolvedValue([
        { id: 'm1', name: 'testModel', creator: 'OpenAI' },
      ]);
      mockPrisma.repository.findMany.mockResolvedValue([]);
      mockPrisma.robot.findMany.mockResolvedValue([]);
      mockPrisma.device.findMany.mockResolvedValue([]);

      const result = await service.autocomplete('test');

      expect(result.length).toBe(3);
      expect(result[0].title).toBe('TestApp');
      expect(result[0].type).toBe('tool');
      expect(result[0].category).toBe('AI');
      expect(result[1].title).toBe('TestingCo');
      expect(result[1].type).toBe('company');
      expect(result[2].title).toBe('testModel');
      expect(result[2].type).toBe('model');
      expect(result[2].slug).toBeNull();
    });

    it('sorts prefix matches before contains matches, then by length', async () => {
      mockPrisma.tool.findMany.mockResolvedValue([
        { id: 't1', name: 'Atest', slug: 'atest', categories: [{ category: { name: 'X' } }] },
      ]);
      mockPrisma.company.findMany.mockResolvedValue([
        { id: 'c1', name: 'BestTestCompany', slug: 'btc' },
        { id: 'c2', name: 'Test', slug: 'test' },
      ]);
      mockPrisma.aIModel.findMany.mockResolvedValue([]);
      mockPrisma.repository.findMany.mockResolvedValue([]);
      mockPrisma.robot.findMany.mockResolvedValue([]);
      mockPrisma.device.findMany.mockResolvedValue([]);

      const result = await service.autocomplete('test');

      expect(result[0].title).toBe('Test');
      expect(result[1].title).toBe('Atest');
      expect(result[2].title).toBe('BestTestCompany');
    });

    it('respects the limit parameter', async () => {
      mockPrisma.tool.findMany.mockResolvedValue([
        { id: 't1', name: 'Test1', slug: 't1', categories: [] },
        { id: 't2', name: 'Test2', slug: 't2', categories: [] },
        { id: 't3', name: 'Test3', slug: 't3', categories: [] },
      ]);
      mockPrisma.company.findMany.mockResolvedValue([
        { id: 'c1', name: 'TestCo', slug: 'tc' },
      ]);

      const result = await service.autocomplete('test', 2);
      expect(result).toHaveLength(2);
    });

    it('maps tool category correctly when categories array is empty', async () => {
      mockPrisma.tool.findMany.mockResolvedValue([
        { id: 't1', name: 'TestTool', slug: 'tt', categories: [] },
      ]);

      const result = await service.autocomplete('test');
      expect(result[0].category).toBe('Tool');
    });
  });

  describe('popular', () => {
    beforeEach(() => {
      mockPrisma.tool.findMany.mockReset();
    });

    it('returns top tools by avgRating', async () => {
      mockPrisma.tool.findMany
        .mockResolvedValueOnce([{ name: 'Alpha' }, { name: 'Beta' }])
        .mockResolvedValueOnce([]);

      const result = await service.popular(6);
      expect(result).toEqual(['Alpha', 'Beta']);
      expect(mockPrisma.tool.findMany).toHaveBeenNthCalledWith(1, {
        orderBy: [{ avgRating: 'desc' }, { reviewCount: 'desc' }],
        take: 6,
        select: { name: true },
      });
    });

    it('falls back to newest when no rated tools exist', async () => {
      mockPrisma.tool.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ name: 'Newest1' }, { name: 'Newest2' }]);

      const result = await service.popular(6);
      expect(result).toEqual(['Newest1', 'Newest2']);
      expect(mockPrisma.tool.findMany).toHaveBeenNthCalledWith(2, {
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { name: true },
      });
    });

    it('returns empty array when no tools exist at all', async () => {
      mockPrisma.tool.findMany.mockResolvedValue([]);
      const result = await service.popular(6);
      expect(result).toEqual([]);
    });
  });

  describe('featured', () => {
    beforeEach(() => {
      mockPrisma.tool.findMany.mockReset();
    });

    it('returns tools with category info from top-rated', async () => {
      mockPrisma.tool.findMany
        .mockResolvedValueOnce([
          { id: '1', slug: 's1', name: 'Tool1', categories: [{ category: { name: 'AI' } }] },
        ])
        .mockResolvedValueOnce([]);

      const result = await service.featured(6);
      expect(result).toEqual([
        { id: '1', type: 'tool', title: 'Tool1', category: 'AI', slug: 's1' },
      ]);
    });

    it('falls back to newest when no rated tools exist', async () => {
      mockPrisma.tool.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { id: '2', slug: 's2', name: 'NewTool', categories: [{ category: { name: 'Dev' } }] },
        ]);

      const result = await service.featured(6);
      expect(result).toEqual([
        { id: '2', type: 'tool', title: 'NewTool', category: 'Dev', slug: 's2' },
      ]);
      expect(mockPrisma.tool.findMany).toHaveBeenCalledTimes(2);
    });

    it('returns empty array when no tools exist', async () => {
      mockPrisma.tool.findMany.mockResolvedValue([]);
      const result = await service.featured(6);
      expect(result).toEqual([]);
    });

    it('defaults category to Tool when no categories', async () => {
      mockPrisma.tool.findMany
        .mockResolvedValueOnce([
          { id: '1', slug: 's1', name: 'BareTool', categories: [] },
        ])
        .mockResolvedValueOnce([]);

      const result = await service.featured(6);
      expect(result[0].category).toBe('Tool');
    });
  });
});
