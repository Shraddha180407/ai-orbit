import { PrismaClient } from '@prisma/client';

export class UserService {
  constructor(private prisma: PrismaClient) {}

    async getSavedTools(userId: string) {
        const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId: userId },
      include: {
        tool: {
          include: {
            categories: {
              include: { category: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return bookmarks.map((b) => ({
      id: b.id,
      toolId: b.toolId,
      name: b.tool.name,
      category: b.tool.categories?.[0]?.category?.name || 'Uncategorized',
      createdAt: b.createdAt.toISOString()
    }));
  }

  async removeSavedTool(id: string, userId: string) {
    const user = await this.getOrCreateDemoUser();
    // Verify ownership before deleting
    const bookmark = await this.prisma.bookmark.findUnique({ where: { id } });
    if (!bookmark || bookmark.userId !== userId) return { success: false };

    await this.prisma.bookmark.delete({ where: { id } });
    return { success: true };
  }

  async getHistory(userId: string) {
        const history = await this.prisma.toolHistory.findMany({
      where: { userId: userId },
      include: {
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logoUrl: true,
            pricingModel: true,
            avgRating: true,
            reviewCount: true,
          }
        }
      },
      orderBy: { viewedAt: 'desc' },
      take: 50
    });

    return history.map((h) => ({
      id: h.id,
      toolId: h.toolId,
      viewedAt: h.viewedAt.toISOString(),
      tool: h.tool
    }));
  }

  async recordHistory(toolId: string, userId: string) {
        await this.prisma.toolHistory.upsert({
      where: {
        userId_toolId: {
          userId: userId,
          toolId: toolId
        }
      },
      update: {
        viewedAt: new Date()
      },
      create: {
        userId: userId,
        toolId: toolId
      }
    });

    return { success: true };
  }
}
