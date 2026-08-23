import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockService = {
  listBookmarks: vi.fn(),
  createBookmark: vi.fn(),
  deleteBookmark: vi.fn(),
};

vi.mock('../bookmarks.service.js', () => ({
  BookmarksService: class BookmarksService {
    constructor() {
      return mockService as never;
    }
  },
}));

vi.mock('../../../lib/prisma.js', () => ({
  getPrisma: vi.fn().mockReturnValue({ $disconnect: vi.fn() }),
}));

vi.mock('../../../lib/error.js', () => {
  class AppError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'AppError';
    }
    static BadRequest(m: string) { return new AppError(400, m); }
    static NotFound(m: string) { return new AppError(404, m); }
  }
  return { AppError };
});

import { BookmarksController } from '../bookmarks.controller.js';
import { getPrisma } from '../../../lib/prisma.js';

function mockContext(body?: unknown, params: Record<string, string> = {}) {
  let status: number;
  let jsonBody: unknown;
  return {
    json: (data: unknown, s?: number) => {
      status = s ?? 200;
      jsonBody = data;
      return { status, body: data };
    },
    req: {
      json: vi.fn().mockResolvedValue(body),
      param: (key: string) => params[key] || '',
    },
    env: {},
    get: vi.fn(),
    set: vi.fn(),
    get status() { return status; },
    get jsonBody() { return jsonBody; },
  };
}

describe('BookmarksController', () => {
  const controller = new BookmarksController();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(mockService).forEach(fn => fn.mockReset());
  });

  describe('listBookmarks', () => {
    it('returns 200 with bookmarks', async () => {
      const bookmarks = [{ id: 'bm-1', title: 'Test', url: 'https://example.com' }];
      mockService.listBookmarks.mockResolvedValue(bookmarks);

      const c = mockContext();
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'user-1' });
      await controller.listBookmarks(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(bookmarks);
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.listBookmarks.mockRejectedValue(new Error('fail'));

      const c = mockContext();
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'user-1' });
      await controller.listBookmarks(c as never).catch(() => {});

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });

  describe('createBookmark', () => {
    it('returns 200 with created bookmark', async () => {
      const bookmark = { id: 'bm-1', title: 'Test', url: 'https://example.com' };
      mockService.createBookmark.mockResolvedValue(bookmark);

      const c = mockContext({ title: 'Test', url: 'https://example.com' });
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'user-1' });
      await controller.createBookmark(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(bookmark);
    });

    it('throws BadRequest when no url', async () => {
      const c = mockContext({ title: 'Test' });
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'user-1' });

      await expect(controller.createBookmark(c as never)).rejects.toThrow('url is required');
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.createBookmark.mockRejectedValue(new Error('fail'));

      const c = mockContext({ url: 'https://example.com' });
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'user-1' });
      await controller.createBookmark(c as never).catch(() => {});

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });

  describe('deleteBookmark', () => {
    it('returns 200 with success', async () => {
      mockService.deleteBookmark.mockResolvedValue(true);

      const c = mockContext(undefined, { id: 'bm-1' });
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'user-1' });
      await controller.deleteBookmark(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.deleteBookmark.mockRejectedValue(new Error('fail'));

      const c = mockContext(undefined, { id: 'bm-1' });
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'user-1' });
      await controller.deleteBookmark(c as never).catch(() => {});

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });
});