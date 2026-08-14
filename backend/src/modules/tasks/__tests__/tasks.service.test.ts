import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TasksService } from '../tasks.service.js';

const mockPrisma = {
  task: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
  },
  taskLike: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  taskBookmark: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  taskSubscriber: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  category: {
    findMany: vi.fn(),
  },
};

let service: TasksService;

beforeEach(() => {
  vi.clearAllMocks();
  service = new TasksService(mockPrisma as never);
  mockPrisma.category.findMany.mockResolvedValue([
    { slug: 'ai', name: 'AI', _count: { tasks: 5 } },
  ]);
});

describe('TasksService', () => {
  describe('listTasks', () => {
    beforeEach(() => {
      mockPrisma.task.findMany.mockResolvedValue([]);
      mockPrisma.task.count.mockResolvedValue(0);
    });

    it('returns paginated tasks with defaults', async () => {
      const result = await service.listTasks({});

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 12 }),
      );
      expect(result.page).toBe(1);
      expect(result.sort).toBe('newest');
    });

    it('applies pagination correctly', async () => {
      await service.listTasks({ page: 3 });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 24, take: 12 }),
      );
    });

    it('searches by q', async () => {
      await service.listTasks({ q: 'react' });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { title: { contains: 'react', mode: 'insensitive' } },
              { description: { contains: 'react', mode: 'insensitive' } },
            ],
          }),
        }),
      );
    });

    it('filters by category slug', async () => {
      await service.listTasks({ category: 'ai' });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: { slug: 'ai' } }),
        }),
      );
    });

    it('filters by difficulty', async () => {
      await service.listTasks({ difficulty: 'EASY' });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ difficulty: 'EASY' }),
        }),
      );
    });

    it('filters by pricing', async () => {
      await service.listTasks({ pricing: 'FREE' });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ pricingModel: 'FREE' }),
        }),
      );
    });

    it('filters featured only', async () => {
      await service.listTasks({ featuredOnly: true });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isFeatured: true }),
        }),
      );
    });

    it('sorts by oldest', async () => {
      await service.listTasks({ sort: 'oldest' });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'asc' } }),
      );
    });

    it('sorts by name-asc', async () => {
      await service.listTasks({ sort: 'name-asc' });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { title: 'asc' } }),
      );
    });

    it('sorts by name-desc', async () => {
      await service.listTasks({ sort: 'name-desc' });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { title: 'desc' } }),
      );
    });

    it('sorts by rating', async () => {
      await service.listTasks({ sort: 'rating' });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { likes: { _count: 'desc' } } }),
      );
    });

    it('for-you mode queries likes+bookmarks for category IDs', async () => {
      mockPrisma.taskLike.findMany.mockResolvedValue([
        { task: { categoryId: 'cat1' } },
      ]);
      mockPrisma.taskBookmark.findMany.mockResolvedValue([]);

      await service.listTasks({ filterMode: 'for-you', userId: 'u1' });

      expect(mockPrisma.taskLike.findMany).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        select: { task: { select: { categoryId: true } } },
      });
      expect(mockPrisma.taskBookmark.findMany).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        select: { task: { select: { categoryId: true } } },
      });
    });

    it('for-you returns empty when no categories found', async () => {
      mockPrisma.taskLike.findMany.mockResolvedValue([]);
      mockPrisma.taskBookmark.findMany.mockResolvedValue([]);

      const result = await service.listTasks({ filterMode: 'for-you', userId: 'u1' });
      expect(result.tasks).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('following mode filters by subscribed tasks', async () => {
      await service.listTasks({ filterMode: 'following', userId: 'u1' });
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            subscribers: { some: { userId: 'u1' } },
          }),
        }),
      );
    });

    it('serializes task counts correctly', async () => {
      const updatedAt = new Date('2026-01-01T00:00:00.000Z');
      mockPrisma.task.findMany.mockResolvedValue([
        {
          id: '1', slug: 's', title: 'T', description: 'D', iconUrl: null,
          difficulty: 'EASY', pricingModel: 'FREE', isFeatured: false,
          category: { id: 'c1', slug: 'ai', name: 'AI' },
          updatedAt,
          _count: { tools: 1, models: 0, robots: 0, devices: 0, bookmarks: 1 },
        },
      ]);
      mockPrisma.task.count.mockResolvedValue(1);

      const result = await service.listTasks({});
      expect(result.tasks[0]).toEqual(
        expect.objectContaining({
          toolCount: 1, modelCount: 0, robotCount: 0, deviceCount: 0, saveCount: 1,
          updatedAt: updatedAt.toISOString(),
        }),
      );
    });
  });

  describe('getTaskDetails', () => {
    it('returns null when task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);
      const result = await service.getTaskDetails('nonexistent');
      expect(result).toBeNull();
    });

    it('returns task without interactions when no userId', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({
        id: '1', slug: 's', title: 'T', description: 'D', iconUrl: null,
        difficulty: 'EASY', pricingModel: 'FREE', isFeatured: false,
        updatedAt: new Date(),
        category: { id: 'c1', slug: 'ai', name: 'AI' },
        _count: { tools: 0, models: 0, robots: 0, devices: 0, bookmarks: 0, subscribers: 0 },
        resources: [],
        popularTools: [],
        popularModels: [],
      });

      const result = await service.getTaskDetails('s');
      expect(result).not.toBeNull();
      expect(result!.bookmarked).toBe(false);
      expect(result!.liked).toBe(false);
      expect(result!.subscribed).toBe(false);
    });

    it('returns task with user interactions when userId provided', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({
        id: '1', slug: 's', title: 'T', description: 'D', iconUrl: null,
        difficulty: 'EASY', pricingModel: 'FREE', isFeatured: false,
        updatedAt: new Date(),
        category: { id: 'c1', slug: 'ai', name: 'AI' },
        _count: { tools: 0, models: 0, robots: 0, devices: 0, bookmarks: 1, subscribers: 1 },
        resources: [],
        popularTools: [],
        popularModels: [],
      });
      mockPrisma.taskBookmark.findUnique.mockResolvedValue({ id: 'bm1' });
      mockPrisma.taskLike.findUnique.mockResolvedValue({ taskId: '1', userId: 'u1' });
      mockPrisma.taskSubscriber.findUnique.mockResolvedValue({ taskId: '1', userId: 'u1' });

      const result = await service.getTaskDetails('s', 'u1');
      expect(result!.bookmarked).toBe(true);
      expect(result!.liked).toBe(true);
      expect(result!.subscribed).toBe(true);
    });
  });

  describe('toggleBookmarkBySlug', () => {
    it('returns null when task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);
      const result = await service.toggleBookmarkBySlug('nonexistent', 'u1');
      expect(result).toBeNull();
    });

    it('creates bookmark when not exists', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({ id: 't1' });
      mockPrisma.taskBookmark.findUnique.mockResolvedValue(null);
      mockPrisma.taskBookmark.create = vi.fn().mockResolvedValue({});

      const result = await service.toggleBookmarkBySlug('slug', 'u1');
      expect(result).toBe(true);
      expect(mockPrisma.taskBookmark.create).toHaveBeenCalledWith({
        data: { taskId: 't1', userId: 'u1' },
      });
    });

    it('deletes bookmark when exists', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({ id: 't1' });
      mockPrisma.taskBookmark.findUnique.mockResolvedValue({ id: 'bm1' });
      mockPrisma.taskBookmark.delete = vi.fn().mockResolvedValue({});

      const result = await service.toggleBookmarkBySlug('slug', 'u1');
      expect(result).toBe(false);
      expect(mockPrisma.taskBookmark.delete).toHaveBeenCalledWith({ where: { id: 'bm1' } });
    });
  });

  describe('toggleLikeBySlug', () => {
    it('returns null when task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);
      const result = await service.toggleLikeBySlug('nonexistent', 'u1');
      expect(result).toBeNull();
    });

    it('creates like when not exists', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({ id: 't1' });
      mockPrisma.taskLike.findUnique.mockResolvedValue(null);
      mockPrisma.taskLike.create = vi.fn().mockResolvedValue({});

      const result = await service.toggleLikeBySlug('slug', 'u1');
      expect(result).toBe(true);
    });

    it('removes like when exists', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({ id: 't1' });
      mockPrisma.taskLike.findUnique.mockResolvedValue({ taskId: 't1', userId: 'u1' });
      mockPrisma.taskLike.delete = vi.fn().mockResolvedValue({});

      const result = await service.toggleLikeBySlug('slug', 'u1');
      expect(result).toBe(false);
    });
  });

  describe('toggleSubscribeBySlug', () => {
    it('returns null when task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);
      const result = await service.toggleSubscribeBySlug('nonexistent', 'u1');
      expect(result).toBeNull();
    });

    it('creates subscription when not exists', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({ id: 't1' });
      mockPrisma.taskSubscriber.findUnique.mockResolvedValue(null);
      mockPrisma.taskSubscriber.create = vi.fn().mockResolvedValue({});

      const result = await service.toggleSubscribeBySlug('slug', 'u1');
      expect(result).toBe(true);
    });

    it('removes subscription when exists', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({ id: 't1' });
      mockPrisma.taskSubscriber.findUnique.mockResolvedValue({ taskId: 't1', userId: 'u1' });
      mockPrisma.taskSubscriber.delete = vi.fn().mockResolvedValue({});

      const result = await service.toggleSubscribeBySlug('slug', 'u1');
      expect(result).toBe(false);
    });
  });
});