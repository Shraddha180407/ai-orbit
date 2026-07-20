import { PrismaClient, Prisma } from '@prisma/client';
import type { ModelsListQuery } from "./models.schema.js";

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

    const [items, total] = await Promise.all([
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
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async getModelById(id: string) {
    return this.prisma.aIModel.findUnique({
      where: { id },
      include: {
        provider: {
          select: { id: true, slug: true, name: true, logoUrl: true },
        },
        TaskModel: {
          include: {
            Task: { select: { id: true, slug: true, title: true } },
          },
        },
      },
    });
  }
}