import { PrismaClient, Prisma, PricingModel } from '@prisma/client';

type ToolCard = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  description: string;
  pricingModel: PricingModel;
  pricingAmount: string | null;
  billingFrequency: string | null;
  avgRating: number | null;
  createdAt: Date;
  releaseDate: Date | null;
  isOpenSource: boolean;
  isTrending: boolean;
  verified: boolean;
  upvoteCount: number;
  categories: { category: { slug: string; name: string } }[];
  tags: { tag: { slug: string; name: string } }[];
  ttasks?: { task: { slug: string; title: string } }[];
  _count: { reviews: number; bookmarks: number };
  company: { slug: string; name: string } | null;
};

export class ToolsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listTools(filters: {
    q?: string;
    category?: string;
    pricing?: PricingModel;
    sort?: string;
    page?: number;
    pageSize?: number;
  }) {
    const pageNum = Math.max(1, filters.page || 1);
    const limit = filters.pageSize || 12;
    const skip = (pageNum - 1) * limit;

    const where: Prisma.ToolWhereInput = {};

    if (filters.q && filters.q.trim().length > 0) {
      where.OR = [
        { name: { contains: filters.q.trim(), mode: 'insensitive' } },
        { description: { contains: filters.q.trim(), mode: 'insensitive' } },
      ];
    }

    if (filters.category) {
      where.categories = { some: { category: { slug: filters.category } } };
    }

    if (filters.pricing) {
      where.pricingModel = filters.pricing;
    }

    let orderBy: Prisma.ToolOrderByWithRelationInput = { createdAt: 'desc' };
    switch (filters.sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      case 'rating':
        orderBy = { avgRating: 'desc' };
        break;
    }

    const selectFields = {
      id: true,
      slug: true,
      name: true,
      logoUrl: true,
      description: true,
      pricingModel: true,
      pricingAmount: true,
      billingFrequency: true,
      avgRating: true,
      createdAt: true,
      releaseDate: true,
      isOpenSource: true,
      isTrending: true,
      verified: true,
      upvoteCount: true,
      compatibility: true,
      launchDate: true,
      hasApi: true,
      useCases: true,
      categories: { select: { category: { select: { slug: true, name: true } } } },
      tags: { select: { tag: { select: { slug: true, name: true } } } },
      ttasks: { select: { task: { select: { slug: true, title: true } } } },
      _count: { select: { reviews: true, bookmarks: true } },
      company: { select: { slug: true, name: true } }
    };

    const [tools, total, categoriesList] = await Promise.all([
      this.prisma.tool.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: selectFields,
      }),
      this.prisma.tool.count({ where }),
      this.prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: {
          slug: true,
          name: true,
          _count: { select: { tools: true } },
        },
      }),
    ]);

    return {
      tools: tools.map((t) => ({
        ...t,
        pricingAmount: t.pricingAmount?.toString() ?? null,
        avgRating: t.avgRating > 0 ? t.avgRating : null,
      })),
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      sort: filters.sort || 'newest',
      categories: categoriesList,
    };
  }

  async getToolDetails(slug: string, userId?: string) {
    const tool = await this.prisma.tool.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        logoUrl: true,
        description: true,
        websiteUrl: true,
        screenshots: true,
        features: true,
        pros: true,
        cons: true,
        releaseDate: true,
        pricingModel: true,
        pricingAmount: true,
        billingFrequency: true,
        avgRating: true,
        reviewCount: true,
        upvoteCount: true,
        isOpenSource: true,
        isTrending: true,
        verified: true,
        compatibility: true,
        targetUsers: true,
        hasApi: true,
        apiDocsUrl: true,
        performanceScore: true,
        createdAt: true,

        // --- NEW FIELDS SELECTED FOR API ---
        longDescription: true,
        videoUrl: true,
        releasedBy: true,
        country: true,
        launchDate: true,
        views: true,
        useCases: true,
        pricingTiers: true,
        verdict: true,
        linkedInUrl: true,
        twitterUrl: true,
        githubUrl: true,
        alternativeIds: true,

        company: { select: { slug: true, name: true, logoUrl: true } },
        categories: { select: { category: { select: { slug: true, name: true } } } },
        tags: { select: { tag: { select: { slug: true, name: true } } } },
        ttasks: { select: { task: { select: { slug: true, title: true } } } },
        integrations: { select: { integration: { select: { slug: true, name: true, logoUrl: true } } } },
        _count: { select: { reviews: true, bookmarks: true } },
      },
    });

    if (!tool) return null;

    // Fetch similar tools
    const withRelations = await this.prisma.tool.findUnique({
      where: { id: tool.id },
      select: {
        alternatives: { select: { id: true } },
        categories: { select: { categoryId: true } },
      },
    });

    let similarTools: ToolCard[] = [];
    if (withRelations) {
      const alternativeIds = withRelations.alternatives.map((a) => a.id);
      const categoryIds = withRelations.categories.map((cat) => cat.categoryId);

      const cardSelect = {
        id: true,
        slug: true,
        name: true,
        logoUrl: true,
        description: true,
        pricingModel: true,
        pricingAmount: true,
        billingFrequency: true,
        avgRating: true,
        createdAt: true,
        releaseDate: true,
        isOpenSource: true,
        isTrending: true,
        verified: true,
        upvoteCount: true,
        categories: { select: { category: { select: { slug: true, name: true } } } },
        tags: { select: { tag: { select: { slug: true, name: true } } } },
        ttasks: { select: { task: { select: { slug: true, title: true } } } },
        _count: { select: { reviews: true, bookmarks: true } },
        company: { select: { slug: true, name: true } }
      };

      const curated = alternativeIds.length
        ? await this.prisma.tool.findMany({ where: { id: { in: alternativeIds } }, select: cardSelect })
        : [];

      similarTools = curated.map((t) => ({
        ...t,
        pricingAmount: t.pricingAmount?.toString() ?? null,
        avgRating: t.avgRating > 0 ? t.avgRating : null,
      }));

      if (similarTools.length < 4 && categoryIds.length > 0) {
        const excludeIds = [tool.id, ...similarTools.map((t) => t.id)];
        const fillers = await this.prisma.tool.findMany({
          where: {
            id: { notIn: excludeIds },
            categories: { some: { categoryId: { in: categoryIds } } },
          },
          orderBy: { avgRating: 'desc' },
          take: 4 - similarTools.length,
          select: cardSelect,
        });
        similarTools = [
          ...similarTools,
          ...fillers.map((t) => ({
            ...t,
            pricingAmount: t.pricingAmount?.toString() ?? null,
            avgRating: t.avgRating > 0 ? t.avgRating : null,
          }))
        ];
      }
    }

    const reviews = await this.prisma.review.findMany({
      where: { toolId: tool.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    });

    let bookmarked = false;
    if (userId) {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: { toolId_userId: { toolId: tool.id, userId } },
        select: { id: true },
      });
      bookmarked = Boolean(bookmark);
    }

    return {
      tool: {
        ...tool,
        pricingAmount: tool.pricingAmount?.toString() ?? null,
        avgRating: tool.avgRating > 0 ? tool.avgRating : null,
      },
      similarTools,
      reviews: reviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
      bookmarked,
    };
  }

  async createOrUpdateReview(toolId: string, userId: string, rating: number, comment: string) {
    await this.prisma.review.upsert({
      where: { toolId_userId: { toolId, userId } },
      update: { rating, comment },
      create: { toolId, userId, rating, comment },
    });

    await this.recomputeToolRating(toolId);
  }

  async toggleBookmark(toolId: string, userId: string) {
    const existing = await this.prisma.bookmark.findUnique({
      where: { toolId_userId: { toolId, userId } },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.bookmark.delete({ where: { id: existing.id } });
      return false;
    } else {
      await this.prisma.bookmark.create({ data: { toolId, userId } });
      return true;
    }
  }

  private async recomputeToolRating(toolId: string) {
    const reviews = await this.prisma.review.findMany({ where: { toolId }, select: { rating: true } });
    const count = reviews.length;
    const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    await this.prisma.tool.update({ where: { id: toolId }, data: { avgRating: avg, reviewCount: count } });
  }
}