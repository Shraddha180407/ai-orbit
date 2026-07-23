import { PrismaClient, Prisma, PricingModel, TaskDifficulty } from '@prisma/client';

export class TasksService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listTasks(filters: {
    q?: string;
    category?: string;
    difficulty?: TaskDifficulty;
    pricing?: PricingModel;
    featuredOnly?: boolean;
    sort?: string;
    page?: number;
    filterMode?: 'all' | 'for-you' | 'following';
    userId?: string;
  }) {
    const pageNum = Math.max(1, filters.page || 1);
    const limit = 12;
    const skip = (pageNum - 1) * limit;

    const where: Prisma.TaskWhereInput = {};

    if (filters.q && filters.q.trim().length > 0) {
      where.OR = [
        { title: { contains: filters.q.trim(), mode: 'insensitive' } },
        { description: { contains: filters.q.trim(), mode: 'insensitive' } },
      ];
    }
    if (filters.category) where.category = { slug: filters.category };
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.pricing) where.pricingModel = filters.pricing;
    if (filters.featuredOnly) where.isFeatured = true;

    if (filters.filterMode === 'following' && filters.userId) {
      where.subscribers = { some: { userId: filters.userId } };
    }

    if (filters.filterMode === 'for-you' && filters.userId) {
      const [liked, saved] = await Promise.all([
        this.prisma.taskLike.findMany({
          where: { userId: filters.userId },
          select: { task: { select: { categoryId: true } } },
        }),
        this.prisma.taskBookmark.findMany({
          where: { userId: filters.userId },
          select: { task: { select: { categoryId: true } } },
        }),
      ]);

      const categoryIds = [
        ...new Set([...liked.map((l) => l.task.categoryId), ...saved.map((s) => s.task.categoryId)]),
      ];

      if (categoryIds.length === 0) {
        return {
          tasks: [],
          total: 0,
          page: pageNum,
          totalPages: 1,
          sort: filters.sort || 'newest',
          categories: await this.prisma.category.findMany({
            orderBy: { name: 'asc' },
            select: { slug: true, name: true, _count: { select: { tasks: true } } },
          }),
        };
      }

      where.categoryId = { in: categoryIds };
      where.likes = { none: { userId: filters.userId } };
      where.bookmarks = { none: { userId: filters.userId } };
    }

    let orderBy: Prisma.TaskOrderByWithRelationInput = { createdAt: 'desc' };
    switch (filters.sort) {
      case 'oldest': orderBy = { createdAt: 'asc' }; break;
      case 'alphabetical': orderBy = { title: 'asc' }; break;
      case 'popular': orderBy = { likes: { _count: 'desc' } }; break;
    }

    const selectFields = {
      id: true, slug: true, title: true, description: true, difficulty: true,
      pricingModel: true, isFeatured: true,
      category: { select: { slug: true, name: true } },
      creator: { select: { id: true, name: true, image: true } },
      createdAt: true,
      _count: { select: { likes: true, subscribers: true, bookmarks: true, resources: true, tools: true, models: true, robots: true, devices: true } },
    };

    const [tasks, total, categoriesList] = await Promise.all([
      this.prisma.task.findMany({ where, orderBy, skip, take: limit, select: selectFields }),
      this.prisma.task.count({ where }),
      this.prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { slug: true, name: true, _count: { select: { tasks: true } } },
      }),
    ]);

    return {
      tasks: tasks.map(this.serializeTask),
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      sort: filters.sort || 'newest',
      categories: categoriesList,
    };
  }

  async getTaskDetails(slug: string, userId?: string) {
    const task = await this.prisma.task.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        difficulty: true,
        pricingModel: true,
        isFeatured: true,
        createdAt: true,
        category: { select: { slug: true, name: true } },
        creator: { select: { id: true, name: true, image: true } },
        _count: {
          select: {
            likes: true,
            subscribers: true,
            bookmarks: true,
            resources: true,
            tools: true,
            models: true,
            robots: true,
            devices: true,
          },
        },
      },
    });

    if (!task) return null;

    if (!userId) {
      return {
        task: this.serializeTask(task),
        bookmarked: false,
        liked: false,
        subscribed: false,
      };
    }

    const [bookmark, liked, subscribed] = await Promise.all([
      this.prisma.taskBookmark.findUnique({
        where: { taskId_userId: { taskId: task.id, userId } },
        select: { id: true },
      }),
      this.prisma.taskLike.findUnique({
        where: { taskId_userId: { taskId: task.id, userId } },
      }),
      this.prisma.taskSubscriber.findUnique({
        where: { taskId_userId: { taskId: task.id, userId } },
      }),
    ]);

    return {
      task: this.serializeTask(task),
      bookmarked: Boolean(bookmark),
      liked: Boolean(liked),
      subscribed: Boolean(subscribed),
    };
  }

  // ---- Slug-based toggles (used by routes — slug in URL is sufficient,
  // no need for the client to also send taskId in the body) ----

  async toggleBookmarkBySlug(slug: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { slug }, select: { id: true } });
    if (!task) return null;
    return this.toggleJoinRow(this.prisma.taskBookmark, task.id, userId);
  }

  async toggleLikeBySlug(slug: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { slug }, select: { id: true } });
    if (!task) return null;
    return this.toggleJoinRow(this.prisma.taskLike, task.id, userId, true);
  }

  async toggleSubscribeBySlug(slug: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { slug }, select: { id: true } });
    if (!task) return null;
    return this.toggleJoinRow(this.prisma.taskSubscriber, task.id, userId, true);
  }

  // Shared helper — TaskBookmark uses its own `id` primary key,
  // while TaskLike/TaskSubscriber use a composite (taskId, userId) key.
  // The `compositeKey` flag switches between the two lookup styles.
  private async toggleJoinRow(model: any, taskId: string, userId: string, compositeKey = false) {
    if (compositeKey) {
      const existing = await model.findUnique({
        where: { taskId_userId: { taskId, userId } },
      });
      if (existing) {
        await model.delete({ where: { taskId_userId: { taskId, userId } } });
        return false;
      } else {
        await model.create({ data: { taskId, userId } });
        return true;
      }
    } else {
      const existing = await model.findUnique({
        where: { taskId_userId: { taskId, userId } },
        select: { id: true },
      });
      if (existing) {
        await model.delete({ where: { id: existing.id } });
        return false;
      } else {
        await model.create({ data: { taskId, userId } });
        return true;
      }
    }
  }

  private serializeTask(t: any) {
    return {
      id: t.id,
      slug: t.slug,
      title: t.title,
      description: t.description,
      difficulty: t.difficulty,
      pricingModel: t.pricingModel,
      isFeatured: t.isFeatured,
      category: t.category,
      creator: t.creator,
      createdAt: t.createdAt,
      likes: t._count?.likes ?? 0,
      subscribers: t._count?.subscribers ?? 0,
      saves: t._count?.bookmarks ?? 0,
      resources: t._count?.resources ?? 0,
      tools: t._count?.tools ?? 0,
      models: t._count?.models ?? 0,
      robots: t._count?.robots ?? 0,
      devices: t._count?.devices ?? 0,
    };
  }
}