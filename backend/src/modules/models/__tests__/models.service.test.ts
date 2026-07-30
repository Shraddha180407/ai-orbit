import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModelsService } from '../models.service.js';

function createMockPrisma() {
  return {
    aIModel: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    company: {
      findMany: vi.fn(),
    },
  };
}

const baseModel = {
  id: 'm1',
  name: 'GPT-4',
  creator: 'OpenAI',
  modality: 'Text',
  parameterSize: '1.76 Trillion',
  contextWindow: '128K',
  description: 'A large language model',
  releaseDate: new Date('2024-01-01'),
  createdAt: new Date('2024-01-01'),
  provider: { id: 'p1', slug: 'openai', name: 'OpenAI', logoUrl: null },
};

describe('ModelsService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: ModelsService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new ModelsService(prisma as never);
  });

  describe('listModels', () => {
    beforeEach(() => {
      prisma.aIModel.findMany.mockResolvedValue([baseModel]);
      prisma.aIModel.count.mockResolvedValue(1);
      prisma.company.findMany.mockResolvedValue([]);
      prisma.aIModel.groupBy.mockResolvedValue([]);
    });

    it('returns paginated results', async () => {
      const result = await service.listModels({ page: 1, limit: 20, sort: 'newest' });

      expect(result.items).toHaveLength(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.hasMore).toBe(false);
    });

    it('applies search on name and creator', async () => {
      await service.listModels({ page: 1, limit: 20, sort: 'newest', search: 'GPT' });

      expect(prisma.aIModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                OR: expect.arrayContaining([
                  { name: { contains: 'GPT', mode: 'insensitive' } },
                  { creator: { contains: 'GPT', mode: 'insensitive' } },
                ]),
              }),
            ]),
          }),
        }),
      );
    });

    it('applies provider filter', async () => {
      await service.listModels({ page: 1, limit: 20, sort: 'newest', provider: 'openai' });

      expect(prisma.aIModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { provider: { slug: 'openai' } },
            ]),
          }),
        }),
      );
    });

    it('applies modality filter', async () => {
      await service.listModels({ page: 1, limit: 20, sort: 'newest', modality: 'Text' });

      expect(prisma.aIModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { modality: { contains: 'Text', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });

    it('applies creator filter', async () => {
      await service.listModels({ page: 1, limit: 20, sort: 'newest', creator: 'OpenAI' });

      expect(prisma.aIModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { creator: { equals: 'OpenAI', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });

    it('sorts by newest', async () => {
      await service.listModels({ page: 1, limit: 20, sort: 'newest' });
      expect(prisma.aIModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
      );
    });

    it('sorts by oldest', async () => {
      await service.listModels({ page: 1, limit: 20, sort: 'oldest' });
      expect(prisma.aIModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'asc' } }),
      );
    });

    it('sorts by alphabetical', async () => {
      await service.listModels({ page: 1, limit: 20, sort: 'alphabetical' });
      expect(prisma.aIModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { name: 'asc' } }),
      );
    });

    it('sorts by releaseDate', async () => {
      await service.listModels({ page: 1, limit: 20, sort: 'releaseDate' });
      expect(prisma.aIModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { releaseDate: 'desc' } }),
      );
    });
  });

  describe('getModelById', () => {
    it('returns model with provider and tasks when found', async () => {
      const fullModel = { ...baseModel, tasks: [{ task: { id: 't1', slug: 'chat', title: 'Chat' } }] };
      prisma.aIModel.findUnique.mockResolvedValue(fullModel);

      const result = await service.getModelById('m1');

      expect(result).toEqual(fullModel);
      expect(prisma.aIModel.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'm1' } }),
      );
    });

    it('returns null when not found', async () => {
      prisma.aIModel.findUnique.mockResolvedValue(null);

      const result = await service.getModelById('nonexistent');

      expect(result).toBeNull();
    });
  });
});
