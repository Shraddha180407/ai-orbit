import { PrismaClient, Prisma, PricingModel, TaskDifficulty } from '@prisma/client';

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'https://aiorbit.club';

type SerializedTaskListRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconUrl: string | null;
  difficulty: TaskDifficulty;
  pricingModel: PricingModel;
  isFeatured: boolean;
  category: { id: string; slug: string; name: string };
  updatedAt: Date;
  _count: {
    tools: number;
    models: number;
    robots: number;
    devices: number;
    bookmarks: number;
  };
};

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
        return { tasks: [], total: 0, page: pageNum, totalPages: 1, sort: filters.sort || 'newest' };
      }

      where.categoryId = { in: categoryIds };
      where.likes = { none: { userId: filters.userId } };
      where.bookmarks = { none: { userId: filters.userId } };
    }

    let orderBy: Prisma.TaskOrderByWithRelationInput = {
  createdAt: "desc",
};

switch (filters.sort) {
  case "oldest":
    orderBy = {
      createdAt: "asc",
    };
    break;

  case "name-asc":
    orderBy = {
      title: "asc",
    };
    break;

  case "name-desc":
    orderBy = {
      title: "desc",
    };
    break;

  case "rating":
    orderBy = {
      likes: {
        _count: "desc",
      },
    };
    break;

  case "newest":
  default:
    orderBy = {
      createdAt: "desc",
    };
}

    const selectFields = {
      id: true, slug: true, title: true, description: true, iconUrl: true,
      difficulty: true, pricingModel: true, isFeatured: true,
      category: { select: { id: true, slug: true, name: true } },
      updatedAt: true,
      _count: { select: { tools: true, models: true, robots: true, devices: true, bookmarks: true } },
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({ where, orderBy, skip, take: limit, select: selectFields }),
      this.prisma.task.count({ where }),
    ]);

    return {
      tasks: tasks.map((t) => this.serializeTaskListItem(t)),
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      sort: filters.sort || 'newest',
    };
  }

  async getTaskDetails(slug: string, userId?: string) {
    const task = await this.prisma.task.findUnique({
      where: { slug },
      select: {
        id: true, slug: true, title: true, description: true, iconUrl: true,
        difficulty: true, pricingModel: true, isFeatured: true, updatedAt: true,
        category: { select: { id: true, slug: true, name: true } },
        _count: { select: { tools: true, models: true, robots: true, devices: true, bookmarks: true, subscribers: true } },
        resources: {
          select: { title: true, url: true, homepage: true, source: true, postedAt: true, stars: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        popularTools: {
          select: {
            slug: true, name: true, logoUrl: true, tagline: true,
            pricingModel: true, rating: true, bookmarkCount: true, visitUrl: true,
          },
        },
        popularModels: {
          select: {
            slug: true, name: true, provider: true, logoUrl: true,
            modelType: true, pricingModel: true, benchmarkScore: true, websiteUrl: true,
          },
        },
      },
    });

    if (!task) return null;

    let bookmarked = false;
    let liked = false;
    let subscribed = false;

    if (userId) {
      const [bookmark, like, subscribe] = await Promise.all([
        this.prisma.taskBookmark.findUnique({
          where: { taskId_userId: { taskId: task.id, userId } },
          select: { id: true },
        }),
        this.prisma.taskLike.findUnique({ where: { taskId_userId: { taskId: task.id, userId } } }),
        this.prisma.taskSubscriber.findUnique({ where: { taskId_userId: { taskId: task.id, userId } } }),
      ]);
      bookmarked = Boolean(bookmark);
      liked = Boolean(like);
      subscribed = Boolean(subscribe);
    }

    return {
      task: this.serializeTaskDetail(task),
      bookmarked,
      liked,
      subscribed,
    };
  }

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

  private async toggleJoinRow(model: unknown, taskId: string, userId: string, compositeKey = false) {
    const m = model as {
      findUnique: (args: { where: { taskId_userId: { taskId: string; userId: string } }; select?: { id: true } }) => Promise<{ id: string } | null>;
      delete: (args: { where: { taskId_userId: { taskId: string; userId: string } } | { id: string } }) => Promise<unknown>;
      create: (args: { data: { taskId: string; userId: string } }) => Promise<unknown>;
    };
    if (compositeKey) {
      const existing = await m.findUnique({ where: { taskId_userId: { taskId, userId } } });
      if (existing) {
        await m.delete({ where: { taskId_userId: { taskId, userId } } });
        return false;
      } else {
        await m.create({ data: { taskId, userId } });
        return true;
      }
    } else {
      const existing = await m.findUnique({ where: { taskId_userId: { taskId, userId } }, select: { id: true } });
      if (existing) {
        await m.delete({ where: { id: existing.id } });
        return false;
      } else {
        await m.create({ data: { taskId, userId } });
        return true;
      }
    }
  }

  // ---- Serialization ----

  private serializeTaskListItem(t: SerializedTaskListRow) {
    return {
      id: t.id,
      title: t.title,
      slug: t.slug,
      description: t.description,
      iconUrl: t.iconUrl,
      category: { id: t.category.id, name: t.category.name, slug: t.category.slug },
      difficulty: t.difficulty,
      pricingModel: t.pricingModel,
      isFeatured: t.isFeatured,
      toolCount: t._count.tools,
      modelCount: t._count.models,
      robotCount: t._count.robots,
      deviceCount: t._count.devices,
      saveCount: t._count.bookmarks,
      updatedAt: t.updatedAt.toISOString(),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private serializeTaskDetail(t: any) {
    return {
      id: t.id,
      title: t.title,
      slug: t.slug,
      description: t.description,
      iconUrl: t.iconUrl,
      bannerUrl: null, // not yet supported — placeholder until asset pipeline exists
      category: { id: t.category.id, name: t.category.name, slug: t.category.slug },
      difficulty: t.difficulty,
      pricingModel: t.pricingModel,
      isFeatured: t.isFeatured,
      toolCount: t._count.tools,
      modelCount: t._count.models,
      robotCount: t._count.robots,
      deviceCount: t._count.devices,
      saveCount: t._count.bookmarks,
      subscriberCount: t._count.subscribers,
      shareUrl: `${FRONTEND_BASE_URL}/tasks/${t.slug}`,
      updatedAt: t.updatedAt.toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resources: t.resources.map((r: any) => ({
        title: r.title,
        url: r.url,
        homepage: r.homepage ?? null,
        source: r.source ?? null,
        postedAt: r.postedAt?.toISOString?.() ?? null,
        stars: r.stars ?? null,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      popularTools: t.popularTools.map((pt: any) => ({
        slug: pt.slug,
        name: pt.name,
        logoUrl: pt.logoUrl,
        tagline: pt.tagline,
        pricingModel: pt.pricingModel,
        rating: pt.rating,
        bookmarkCount: pt.bookmarkCount,
        visitUrl: pt.visitUrl,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      popularModels: t.popularModels.map((pm: any) => ({
        slug: pm.slug,
        name: pm.name,
        provider: pm.provider,
        logoUrl: pm.logoUrl,
        modelType: pm.modelType,
        pricingModel: pm.pricingModel,
        benchmarkScore: pm.benchmarkScore,
        websiteUrl: pm.websiteUrl,
      })),
    };
  }
}