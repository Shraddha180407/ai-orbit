import { PrismaClient } from '@prisma/client';
import { AppError } from '../../lib/error.js';

export class BookmarksService {
  constructor(private prisma: PrismaClient) {}

  async listBookmarks(userId: string) {
    return this.prisma.linkBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        url: true,
        createdAt: true,
      },
    });
  }

  async createBookmark(userId: string, title: string | undefined, url: string) {
    return this.prisma.linkBookmark.create({
      data: {
        userId,
        title,
        url,
      },
    });
  }

  async deleteBookmark(userId: string, id: string) {
    const bookmark = await this.prisma.linkBookmark.findUnique({ where: { id } });
    if (!bookmark || bookmark.userId !== userId) {
      throw AppError.NotFound("Bookmark not found or unauthorized");
    }
    await this.prisma.linkBookmark.delete({ where: { id } });
    return true;
  }
}
