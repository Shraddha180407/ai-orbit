import { PrismaClient, Prisma } from '@prisma/client';
import type { ModelsListQuery } from "./models.schema.js";

const RELATED_LIMIT = 6;

export class ModelsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listModels(query: ModelsListQuery) {
    const { page, limit, sort, search, provider, modality, creator } = query;

    const where: Prisma.AIModelWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { creator: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        provider ? { provider: { slug: provider } } : {},
        modality ? { modality: { contains: modality, mode: "insensitive" } } : {},
        creator ? { creator: { equals: creator, mode: "insensitive" } } : {},
      ],
    };

    const orderBy: Prisma.AIModelOrderByWithRelationInput =
      sort === "newest"
        ? { createdAt: "desc" }
        : sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "alphabetical"
        ? { name: "asc" }
        : { releaseDate: "desc" };

    const [items, total, providers, modalityGroups] = await Promise.all([
      this.prisma.aIModel.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          provider: {
            select: { id: true, slug: true, name: true, logoUrl: true },
          },
        },
      }),
      this.prisma.aIModel.count({ where }),
      this.prisma.company.findMany({
        where: { aiModels: { some: {} } },
        orderBy: { name: "asc" },
        select: {
          slug: true,
          name: true,
          _count: { select: { aiModels: true } },
        },
      }),
      this.prisma.aIModel.groupBy({
        by: ["modality"],
        _count: { _all: true },
        orderBy: { modality: "asc" },
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
        providers: providers.map((p) => ({
          slug: p.slug,
          name: p.name,
          count: p._count.aiModels,
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
        provider: {
          select: { id: true, slug: true, name: true, logoUrl: true },
        },
        tasks: {
          include: {
            task: { select: { id: true, slug: true, title: true } },
          },
        },
      },
    });

    if (!model) return null;

    const orClauses: Prisma.AIModelWhereInput[] = [];
    if (model.providerId) orClauses.push({ providerId: model.providerId });
    if (model.modality) {
      orClauses.push({ modality: { equals: model.modality, mode: "insensitive" } });
    }
    if (model.creator) {
      orClauses.push({ creator: { equals: model.creator, mode: "insensitive" } });
    }

    const relatedModels =
      orClauses.length === 0
        ? []
        : await this.prisma.aIModel.findMany({
            where: { id: { not: id }, OR: orClauses },
            take: RELATED_LIMIT,
            orderBy: { createdAt: "desc" },
            include: {
              provider: {
                select: { id: true, slug: true, name: true, logoUrl: true },
              },
            },
          });

    return { ...model, relatedModels };
  }
}
