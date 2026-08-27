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
  creator: { id: string; name: string | null; image: string | null } | null;
  createdAt: Date;
  toolCount: number;
  modelCount: number;
  robotCount: number;
  deviceCount: number;
  saveCount: number;
  likeCount: number;
  subscriberCount: number;
  _count: {
    resources: number;
  };
};

const taskDetailSelect = {
  id: true, slug: true, title: true, description: true, iconUrl: true,
  difficulty: true, pricingModel: true, isFeatured: true, createdAt: true, updatedAt: true,
  category: { select: { id: true, slug: true, name: true } },
  creator: { select: { id: true, name: true, image: true } },
  toolCount: true, modelCount: true, robotCount: true, deviceCount: true,
  saveCount: true, likeCount: true, subscriberCount: true,
  resources: {
    select: { title: true, url: true, homepage: true, source: true, postedAt: true, stars: true, createdAt: true },
    orderBy: { createdAt: 'desc' as const },
    take: 20,
  },
    tools: {
    select: {
      tool: {
        select: {
          slug: true,
          name: true,
          logoUrl: true,
          pricingModel: true,
          websiteUrl: true,
        },
      },
    },
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
} satisfies Prisma.TaskSelect;

type SerializedTaskDetailRow = Prisma.TaskGetPayload<{ select: typeof taskDetailSelect }>;

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
        return { tasks: [], total: 0, page: pageNum, totalPages: 1, sort: filters.sort || 'newest', categories: [] };
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
  case "alphabetical":
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
  case "popular":
    orderBy = {
      likeCount: "desc",
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
      creator: { select: { id: true, name: true, image: true } },
      createdAt: true,
      toolCount: true, modelCount: true, robotCount: true, deviceCount: true,
      saveCount: true, likeCount: true, subscriberCount: true,
      _count: { select: { resources: true } },
    };

    const [tasks, total, categories] = await Promise.all([
      this.prisma.task.findMany({ where, orderBy, skip, take: limit, select: selectFields }),
      this.prisma.task.count({ where }),
      this.prisma.taskCategory.findMany({ select: { slug: true, name: true }, orderBy: { name: 'asc' } }),
    ]);

    return {
      tasks: tasks.map((t) => this.serializeTaskListItem(t)),
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      sort: filters.sort || 'newest',
      categories,
    };
  }

  async getTaskDetails(slug: string, userId?: string) {
    const task = await this.prisma.task.findUnique({
      where: { slug },
      select: taskDetailSelect,
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
    return this.toggleWithCounter({
      taskId: task.id,
      userId,
      counterField: 'saveCount',
      findExisting: () =>
        this.prisma.taskBookmark.findUnique({
          where: { taskId_userId: { taskId: task.id, userId } },
          select: { id: true },
        }),
      createRow: (tx) => tx.taskBookmark.create({ data: { taskId: task.id, userId } }),
      deleteRow: (tx, existing) => tx.taskBookmark.delete({ where: { id: (existing as { id: string }).id } }),
    });
  }

  async toggleLikeBySlug(slug: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { slug }, select: { id: true } });
    if (!task) return null;
    return this.toggleWithCounter({
      taskId: task.id,
      userId,
      counterField: 'likeCount',
      findExisting: () =>
        this.prisma.taskLike.findUnique({ where: { taskId_userId: { taskId: task.id, userId } } }),
      createRow: (tx) => tx.taskLike.create({ data: { taskId: task.id, userId } }),
      deleteRow: (tx) => tx.taskLike.delete({ where: { taskId_userId: { taskId: task.id, userId } } }),
    });
  }

  async toggleSubscribeBySlug(slug: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { slug }, select: { id: true } });
    if (!task) return null;
    return this.toggleWithCounter({
      taskId: task.id,
      userId,
      counterField: 'subscriberCount',
      findExisting: () =>
        this.prisma.taskSubscriber.findUnique({ where: { taskId_userId: { taskId: task.id, userId } } }),
      createRow: (tx) => tx.taskSubscriber.create({ data: { taskId: task.id, userId } }),
      deleteRow: (tx) => tx.taskSubscriber.delete({ where: { taskId_userId: { taskId: task.id, userId } } }),
    });
  }

  /**
   * Toggles a user's join-table row (like/subscribe/bookmark) and keeps the
   * matching literal counter column on Task in sync, atomically, so the
   * counter never drifts from the actual number of join rows. The counter
   * is decremented with a floor of 0 to guard against double-processed
   * requests (e.g. a retried network call) ever pushing it negative.
   */
  private async toggleWithCounter(args: {
    taskId: string;
    userId: string;
    counterField: 'likeCount' | 'subscriberCount' | 'saveCount';
    findExisting: () => Promise<unknown>;
    createRow: (tx: Prisma.TransactionClient) => Promise<unknown>;
    deleteRow: (tx: Prisma.TransactionClient, existing: unknown) => Promise<unknown>;
  }): Promise<boolean> {
    const existing = await args.findExisting();

    return this.prisma.$transaction(async (tx) => {
      if (existing) {
        await args.deleteRow(tx, existing);
        await tx.task.update({
          where: { id: args.taskId },
          data: { [args.counterField]: { decrement: 1 } },
        });
        // Clamp to 0 in case of any prior drift — never show a negative count.
        await tx.task.updateMany({
          where: { id: args.taskId, [args.counterField]: { lt: 0 } },
          data: { [args.counterField]: 0 },
        });
        return false;
      } else {
        await args.createRow(tx);
        await tx.task.update({
          where: { id: args.taskId },
          data: { [args.counterField]: { increment: 1 } },
        });
        return true;
      }
    });
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
      creator: t.creator
        ? { id: t.creator.id, name: t.creator.name ?? '', avatarUrl: t.creator.image ?? undefined }
        : null,
      difficulty: t.difficulty,
      pricingModel: t.pricingModel,
      isFeatured: t.isFeatured,
      createdAt: t.createdAt.toISOString(),
      likes: t.likeCount,
      subscribers: t.subscriberCount,
      saves: t.saveCount,
      resources: t._count.resources,
      tools: t.toolCount,
      models: t.modelCount,
      robots: t.robotCount,
      devices: t.deviceCount,
    };
  }

  private serializeTaskDetail(t: SerializedTaskDetailRow) {
    return {
      id: t.id,
      title: t.title,
      slug: t.slug,
      description: t.description,
      iconUrl: t.iconUrl,
      bannerUrl: null, // not yet supported — placeholder until asset pipeline exists
      category: { id: t.category.id, name: t.category.name, slug: t.category.slug },
      creator: t.creator
        ? { id: t.creator.id, name: t.creator.name ?? '', avatarUrl: t.creator.image ?? undefined }
        : null,
      difficulty: t.difficulty,
      pricingModel: t.pricingModel,
      isFeatured: t.isFeatured,
      tools: t.toolCount,
      models: t.modelCount,
      robots: t.robotCount,
      devices: t.deviceCount,
      saves: t.saveCount,
      likes: t.likeCount,
      subscribers: t.subscriberCount,
      shareUrl: `${FRONTEND_BASE_URL}/tasks/${t.slug}`,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      resources: t.resources.map((r) => ({
        title: r.title,
        url: r.url,
        homepage: r.homepage ?? null,
        source: r.source ?? null,
        postedAt: r.postedAt?.toISOString?.() ?? null,
        stars: r.stars ?? null,
      })),
            toolItems: t.tools.map((tt) => ({
        slug: tt.tool.slug,
        name: tt.tool.name,
        logoUrl: tt.tool.logoUrl,
        tagline: null,
        pricingModel: tt.tool.pricingModel,
        rating: null,
        bookmarkCount: null,
        visitUrl: tt.tool.websiteUrl,
      })),
      popularTools: t.popularTools.map((pt) => ({
        slug: pt.slug,
        name: pt.name,
        logoUrl: pt.logoUrl,
        tagline: pt.tagline,
        pricingModel: pt.pricingModel,
        rating: pt.rating,
        bookmarkCount: pt.bookmarkCount,
        visitUrl: pt.visitUrl,
      })),
      popularModels: t.popularModels.map((pm) => ({
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