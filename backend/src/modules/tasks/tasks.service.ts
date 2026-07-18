import { PrismaClient, Prisma, PricingModel, TaskDifficulty } from '@prisma/client';
import { getOrCreateDemoUser } from '../../lib/prisma.js';

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
    if (filters.category) {
      where.category = { slug: filters.category };
    }
    if (filters.difficulty) {
      where.difficulty = filters.difficulty;
    }
    if (filters.pricing) {
      where.pricingModel = filters.pricing;
    }
    if (filters.featuredOnly) {
      where.isFeatured = true;
    }

    let orderBy: Prisma.TaskOrderByWithRelationInput = { createdAt: 'desc' };
    switch (filters.sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'alphabetical':
        orderBy = { title: 'asc' };
        break;
      case 'popular':
        orderBy = { bookmarks: { _count: 'desc' } };
        break;
    }

    const selectFields = {
      id: true,
      slug: true,
      title: true,
      description: true,
      difficulty: true,
      pricingModel: true,
      isFeatured: true,
      category: { select: { slug: true, name: true } },
      primaryTool: { select: { name: true, logoUrl: true } },
      _count: { select: { bookmarks: true } },
      createdAt: true,
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
      tasks,
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      sort: filters.sort || 'newest',
      categories: categoriesList,
    };
  }

  async getTaskDetails(slug: string) {
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
        primaryTool: { select: { slug: true, name: true, logoUrl: true } },
        _count: { select: { bookmarks: true } },
      },
    });

    if (!task) return null;

    const demoUser = await getOrCreateDemoUser(this.prisma);
    const bookmark = await this.prisma.taskBookmark.findUnique({
      where: { taskId_userId: { taskId: task.id, userId: demoUser.id } },
      select: { id: true },
    });

    return { task, bookmarked: Boolean(bookmark) };
  }

  async toggleBookmark(taskId: string) {
    const demoUser = await getOrCreateDemoUser(this.prisma);

    const existing = await this.prisma.taskBookmark.findUnique({
      where: { taskId_userId: { taskId, userId: demoUser.id } },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.taskBookmark.delete({ where: { id: existing.id } });
      return false;
    } else {
      await this.prisma.taskBookmark.create({ data: { taskId, userId: demoUser.id } });
      return true;
    }
  }
}