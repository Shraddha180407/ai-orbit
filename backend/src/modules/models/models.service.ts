import { PrismaClient, Prisma } from '@prisma/client';
import type { ModelsListQuery } from './models.schema.js';

const RELATED_LIMIT = 6;

const providerSelect = {
  id: true,
  slug: true,
  name: true,
  logoUrl: true,
} as const;

export class ModelsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listModels(query: ModelsListQuery) {
    const { page, limit, sort, search, provider, modality, creator, modelType, openSource, primaryTask } = query;

    const and: Prisma.AIModelWhereInput[] = [];

    if (search && search.trim().length > 0) {
      const term = search.trim();
      and.push({
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { creator: { contains: term, mode: 'insensitive' } },
        ],
      });
    }

    if (provider) {
      and.push({ provider: { slug: provider } });
    }

    if (modality) {
      and.push({ modality: { contains: modality, mode: 'insensitive' } });
    }

    if (creator) {
      and.push({ creator: { equals: creator, mode: 'insensitive' } });
    }

    const where: Prisma.AIModelWhereInput = {
      AND: [
        search ? { OR: [
          { name: { contains: search, mode: "insensitive" } },
          { creator: { contains: search, mode: "insensitive" } },
        ]} : {},
        provider ? { provider: { slug: provider } } : {},
        modality ? { modality: { contains: modality, mode: "insensitive" } } : {},
        creator ? { creator: { equals: creator, mode: "insensitive" } } : {},
        modelType ? { modelType } : {},
        openSource !== undefined ? { openSource } : {},
        primaryTask ? { primaryTask: { equals: primaryTask, mode: "insensitive" } } : {},
      ],
    };
    let orderBy: Prisma.AIModelOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'alphabetical':
        orderBy = { name: 'asc' };
        break;
      case 'releaseDate':
        orderBy = { releaseDate: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [items, total, companies, modalityGroups] = await Promise.all([
      this.prisma.aIModel.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          provider: { select: providerSelect },
        },
      }),
      this.prisma.aIModel.count({ where }),
      this.prisma.company.findMany({
        where: { aiModels: { some: {} } },
        orderBy: { name: 'asc' },
        select: {
          slug: true,
          name: true,
          _count: { select: { aiModels: true } },
        },
      }),
      this.prisma.aIModel.groupBy({
        by: ['modality'],
        _count: { _all: true },
        orderBy: { modality: 'asc' },
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasMore: page * limit < total,
      },
      filters: {
        providers: companies.map((c) => ({
          slug: c.slug,
          name: c.name,
          count: c._count.aiModels,
        })),
        modalities: modalityGroups.map((g) => ({
          modality: g.modality,
          count: g._count._all,
        })),
      },
    };
  }

  async getModelById(id: string) {
    const model = await this.prisma.aIModel.findUnique({
      where: { id },
      include: {
        provider: { select: providerSelect },
        tasks: {
          include: {
            task: { select: { id: true, slug: true, title: true } },
          },
        },
      },
    });

    if (!model) return null;

    const orClauses: Prisma.AIModelWhereInput[] = [];

    if (model.providerId) {
      orClauses.push({ providerId: model.providerId });
    } else if (model.provider?.id) {
      orClauses.push({ providerId: model.provider.id });
    }

    if (model.modality) {
      orClauses.push({
        modality: { equals: model.modality, mode: 'insensitive' },
      });
    }

    if (model.creator) {
      orClauses.push({
        creator: { equals: model.creator, mode: 'insensitive' },
      });
    }

    const relatedModels =
      orClauses.length === 0
        ? []
        : await this.prisma.aIModel.findMany({
            where: {
              id: { not: id },
              OR: orClauses,
            },
            take: RELATED_LIMIT,
            orderBy: { createdAt: 'desc' },
            include: {
              provider: { select: providerSelect },
            },
          });

    return { ...model, relatedModels };
  }

  async getFilterOptions() {
  const [providers, primaryTasks] = await Promise.all([
    this.prisma.company.findMany({
      where: { aiModels: { some: {} } },   // ← fixed
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    }),
    this.prisma.aIModel.findMany({
      where: { primaryTask: { not: null } },
      select: { primaryTask: true },
      distinct: ["primaryTask"],
    }),
  ]);

  return {
    providers,
    primaryTasks: primaryTasks.map((m) => m.primaryTask).filter(Boolean),
    modelTypes: ["TEXT", "IMAGE", "VIDEO", "MULTIMODAL", "AUDIO", "CODE", "THREE_D", "STRUCTURED_DATA"],
  };
}

  async compareModels(ids: string[]) {
      if (ids.length === 0) return [];
      if (ids.length > 5) throw new Error("Cannot compare more than 5 models at once");

      return this.prisma.aIModel.findMany({
        where: { id: { in: ids } },
        include: {
          provider: { select: { id: true, slug: true, name: true, logoUrl: true } },
        },
      });
    }
  async listModelSubCategories() {
    return this.prisma.modelSubCategory.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, description: true },
    });
  }
}
