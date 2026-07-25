import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookmarksService } from '../bookmarks.service.js';

vi.mock('../../../lib/error.js', () => {
  class AppError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'AppError';
    }
    static NotFound(m: string) { return new AppError(404, m); }
    static BadRequest(m: string) { return new AppError(400, m); }
  }
  return { AppError };
});

function createMockPrisma() {
  return {
    linkBookmark: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  };
}

const MOCK_BOOKMARK = {
  id: 'bm-1',
  title: 'Test',
  url: 'https://example.com',
  createdAt: new Date('2025-01-01'),
  userId: 'user-1',
};

describe('BookmarksService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: BookmarksService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new BookmarksService(prisma as never);
    vi.clearAllMocks();
  });

  describe('listBookmarks', () => {
    it('returns bookmarks for user ordered by createdAt desc', async () => {
      const bookmarks = [
        { id: 'bm-2', title: 'Second', url: 'https://b.com', createdAt: new Date('2025-02-01') },
        { id: 'bm-1', title: 'First', url: 'https://a.com', createdAt: new Date('2025-01-01') },
      ];
      prisma.linkBookmark.findMany.mockResolvedValue(bookmarks);

      const result = await service.listBookmarks('user-1');

      expect(prisma.linkBookmark.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          url: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(bookmarks);
    });

    it('returns empty array when user has no bookmarks', async () => {
      prisma.linkBookmark.findMany.mockResolvedValue([]);

      const result = await service.listBookmarks('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('createBookmark', () => {
    it('creates with correct data', async () => {
      prisma.linkBookmark.create.mockResolvedValue(MOCK_BOOKMARK);

      const result = await service.createBookmark('user-1', 'Test', 'https://example.com');

      expect(prisma.linkBookmark.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          title: 'Test',
          url: 'https://example.com',
        },
      });
      expect(result).toEqual(MOCK_BOOKMARK);
    });

    it('creates bookmark with undefined title', async () => {
      prisma.linkBookmark.create.mockResolvedValue({ ...MOCK_BOOKMARK, title: undefined });

      await service.createBookmark('user-1', undefined, 'https://example.com');

      expect(prisma.linkBookmark.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          title: undefined,
          url: 'https://example.com',
        },
      });
    });
  });

  describe('deleteBookmark', () => {
    it('returns true when owner matches', async () => {
      prisma.linkBookmark.findUnique.mockResolvedValue(MOCK_BOOKMARK);
      prisma.linkBookmark.delete.mockResolvedValue({});

      const result = await service.deleteBookmark('user-1', 'bm-1');

      expect(prisma.linkBookmark.findUnique).toHaveBeenCalledWith({ where: { id: 'bm-1' } });
      expect(prisma.linkBookmark.delete).toHaveBeenCalledWith({ where: { id: 'bm-1' } });
      expect(result).toBe(true);
    });

    it('throws NotFound when bookmark does not exist', async () => {
      prisma.linkBookmark.findUnique.mockResolvedValue(null);

      await expect(service.deleteBookmark('user-1', 'bm-999')).rejects.toThrow('Bookmark not found or unauthorized');
    });

    it('throws NotFound when userId does not match', async () => {
      prisma.linkBookmark.findUnique.mockResolvedValue({ ...MOCK_BOOKMARK, userId: 'user-2' });

      await expect(service.deleteBookmark('user-1', 'bm-1')).rejects.toThrow('Bookmark not found or unauthorized');
    });
  });
});
