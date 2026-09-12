import { PrismaClient, Prisma, PricingModel } from '@prisma/client';

export class AgentsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listAgents(filters: {
    q?: string;
    category?: string;
    pricing?: PricingModel;
    sort?: string;
    page?: number;
    pageSize?: number;
  }) {
    const pageNum = Math.max(1, filters.page || 1);
    const limit = filters.pageSize || 100;
    const skip = (pageNum - 1) * limit;

    const where: Prisma.AgentWhereInput = {};

    if (filters.q && filters.q.trim().length > 0) {
      where.OR = [
        { name: { contains: filters.q.trim(), mode: 'insensitive' } },
        { description: { contains: filters.q.trim(), mode: 'insensitive' } },
        { primaryTask: { contains: filters.q.trim(), mode: 'insensitive' } },
      ];
    }

    if (filters.category && filters.category.trim().length > 0) {
      where.categorySlug = filters.category.trim();
    }

    if (filters.pricing) {
      where.pricingModel = filters.pricing;
    }

    let orderBy: Prisma.AgentOrderByWithRelationInput = { createdAt: 'desc' };

    switch (filters.sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      case 'rating':
      case 'top-rated':
        orderBy = { avgRating: 'desc' };
        break;
      case 'popular':
        orderBy = { upvoteCount: 'desc' };
        break;
      case 'trending':
        orderBy = { isTrending: 'desc' };
        break;
    }

    const [agents, total, categoriesList] = await Promise.all([
      this.prisma.agent.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              AgentReview: true,
              AgentBookmark: true,
            },
          },
        },
      }),
      this.prisma.agent.count({ where }),
      this.listCategories(),
    ]);

    const formattedAgents = agents.map((a) => ({
      ...a,
      isVerified: a.verified,
      ttasks: a.primaryTask ? [{ task: { slug: a.categorySlug, title: a.primaryTask } }] : [],
      avgRating: a.avgRating > 0 ? a.avgRating : null,
    }));

    return {
      agents: formattedAgents,
      // Alias `tools` to `agents` for frontend ToolsClient envelope compatibility
      tools: formattedAgents,
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      sort: filters.sort || 'newest',
      categories: categoriesList,
    };
  }

  async listCategories() {
    const groups = await this.prisma.agent.groupBy({
      by: ['categorySlug', 'category'],
      _count: {
        id: true,
      },
      orderBy: {
        category: 'asc',
      },
    });

    return groups.map((g) => ({
      slug: g.categorySlug,
      name: g.category,
      _count: { agents: g._count.id, tools: g._count.id },
      count: g._count.id,
    }));
  }

  async getAgentBySlug(slug: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            AgentReview: true,
            AgentBookmark: true,
          },
        },
      },
    });

    if (!agent) return null;

    const similarAgents = await this.prisma.agent.findMany({
      where: {
        categorySlug: agent.categorySlug,
        id: { not: agent.id },
      },
      take: 4,
      orderBy: { avgRating: 'desc' },
    });

    return {
      ...agent,
      avgRating: agent.avgRating > 0 ? agent.avgRating : null,
      similarAgents,
    };
  }
}
