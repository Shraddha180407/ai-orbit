import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TasksController } from '../tasks.controller.js';
import { getCookie } from 'hono/cookie';
import { verify } from 'jsonwebtoken';

const mockService = {
  listTasks: vi.fn(),
  getTaskDetails: vi.fn(),
  toggleBookmarkBySlug: vi.fn(),
  toggleLikeBySlug: vi.fn(),
  toggleSubscribeBySlug: vi.fn(),
};

vi.mock('../tasks.service.js', () => ({
  TasksService: class TasksService {
    constructor() {
      return mockService as never;
    }
  },
}));

vi.mock('../../../lib/prisma.js', () => {
  const mockDisconnect = vi.fn();
  return {
    getPrisma: vi.fn().mockReturnValue({ $disconnect: mockDisconnect }),
  };
});

vi.mock('hono/cookie', () => ({
  getCookie: vi.fn(),
}));

vi.mock('jsonwebtoken', () => ({
  verify: vi.fn(),
}));

vi.mock('../../../lib/logger.js', () => ({
  logger: { error: vi.fn() },
}));

vi.mock('../tasks.schema.js', () => ({
  GetTasksQuerySchema: {
    safeParse: vi.fn((data: Record<string, unknown>) => {
      if (data.sort === 'INVALID_SORT') {
        return { success: false, error: { issues: [{ message: 'invalid sort' }] } };
      }
      return { success: true, data };
    }),
  },
}));

function createListContext(query: Record<string, string> = {}, cookieToken?: string) {
  const json = vi.fn().mockReturnThis();
  return {
    req: {
      query: () => query,
      param: vi.fn(),
    },
    env: { JWT_SECRET: 'secret' },
    json,
    _json: json,
    get: vi.fn(),
    _cookieToken: cookieToken,
  } as never;
}

function createDetailContext(slug: string, cookieToken?: string) {
  const json = vi.fn().mockReturnThis();
  return {
    req: {
      query: () => ({}),
      param: vi.fn().mockReturnValue(slug),
    },
    env: { JWT_SECRET: 'secret' },
    json,
    _json: json,
    get: vi.fn(),
    _cookieToken: cookieToken,
  } as never;
}

function createToggleContext(slug: string, user?: { id: string }) {
  const json = vi.fn().mockReturnThis();
  return {
    req: {
      query: () => ({}),
      param: vi.fn().mockReturnValue(slug),
    },
    env: { JWT_SECRET: 'secret' },
    json,
    _json: json,
    get: vi.fn().mockReturnValue(user),
  } as never;
}

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new TasksController();
  });

  describe('listTasks', () => {
    it('returns tasks on valid query', async () => {
      mockService.listTasks.mockResolvedValue({
        tasks: [{ id: '1', title: 'Task1' }],
        total: 1,
        page: 1,
        totalPages: 1,
        sort: 'newest',
        categories: [],
      });

      const c = createListContext({ q: 'react' });
      await controller.listTasks(c as never);

      expect(mockService.listTasks).toHaveBeenCalled();
      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ tasks: [expect.objectContaining({ title: 'Task1' })] }),
      );
    });

    it('returns 400 for invalid query', async () => {
      const c = createListContext({ sort: 'INVALID_SORT' });
      await controller.listTasks(c as never);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid parameters' }),
        400,
      );
    });

    it('returns 401 for for-you without auth', async () => {
      vi.mocked(getCookie).mockReturnValue(undefined);

      const c = createListContext({ filter: 'for-you' });
      await controller.listTasks(c as never);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Unauthorized' }),
        401,
      );
    });

    it('returns 401 for for-you with invalid token', async () => {
      vi.mocked(getCookie).mockReturnValue('bad-token');
      vi.mocked(verify).mockImplementation(() => { throw new Error('bad'); });

      const c = createListContext({ filter: 'for-you' });
      await controller.listTasks(c as never);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid or expired token' }),
        401,
      );
    });

    it('passes userId for for-you with valid token', async () => {
      vi.mocked(getCookie).mockReturnValue('valid-token');
      vi.mocked(verify).mockReturnValue({ id: 'user1' } as never);

      mockService.listTasks.mockResolvedValue({
        tasks: [], total: 0, page: 1, totalPages: 1, sort: 'newest', categories: [],
      });

      const c = createListContext({ filter: 'for-you' });
      await controller.listTasks(c as never);

      expect(mockService.listTasks).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user1', filterMode: 'for-you' }),
      );
    });

    it('returns 500 on service error', async () => {
      mockService.listTasks.mockRejectedValue(new Error('DB fail'));

      const c = createListContext({});
      await controller.listTasks(c as never);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'DB fail' }),
        500,
      );
    });
  });

  describe('getTaskDetails', () => {
    it('returns task when found', async () => {
      vi.mocked(getCookie).mockReturnValue(undefined);
      mockService.getTaskDetails.mockResolvedValue({
        task: { id: '1', slug: 'task-1' },
        bookmarked: false,
        liked: false,
        subscribed: false,
      });

      const c = createDetailContext('task-1');
      await controller.getTaskDetails(c as never);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ task: expect.objectContaining({ slug: 'task-1' }) }),
      );
    });

    it('returns 404 when task not found', async () => {
      vi.mocked(getCookie).mockReturnValue(undefined);
      mockService.getTaskDetails.mockResolvedValue(null);

      const c = createDetailContext('nonexistent');
      await controller.getTaskDetails(c as never);

      expect(c.json).toHaveBeenCalledWith({ error: 'Task not found' }, 404);
    });

    it('extracts userId from valid cookie', async () => {
      vi.mocked(getCookie).mockReturnValue('valid-token');
      vi.mocked(verify).mockReturnValue({ id: 'user1' } as never);
      mockService.getTaskDetails.mockResolvedValue({
        task: { id: '1' },
        bookmarked: true,
        liked: false,
        subscribed: false,
      });

      const c = createDetailContext('task-1');
      await controller.getTaskDetails(c as never);

      expect(mockService.getTaskDetails).toHaveBeenCalledWith('task-1', 'user1');
    });

    it('treats invalid cookie as anonymous', async () => {
      vi.mocked(getCookie).mockReturnValue('bad-token');
      vi.mocked(verify).mockImplementation(() => { throw new Error('bad'); });
      mockService.getTaskDetails.mockResolvedValue({
        task: { id: '1' },
        bookmarked: false,
        liked: false,
        subscribed: false,
      });

      const c = createDetailContext('task-1');
      await controller.getTaskDetails(c as never);

      expect(mockService.getTaskDetails).toHaveBeenCalledWith('task-1', undefined);
    });

    it('returns 500 on service error', async () => {
      vi.mocked(getCookie).mockReturnValue(undefined);
      mockService.getTaskDetails.mockRejectedValue(new Error('oops'));

      const c = createDetailContext('task-1');
      await controller.getTaskDetails(c as never);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'oops' }),
        500,
      );
    });
  });

  describe('toggleBookmark', () => {
    it('returns bookmarked on success', async () => {
      mockService.toggleBookmarkBySlug.mockResolvedValue(true);
      const c = createToggleContext('task-1', { id: 'user1' });
      await controller.toggleBookmark(c as never);

      expect(c.json).toHaveBeenCalledWith({ bookmarked: true });
    });

    it('returns 401 when no user', async () => {
      const c = createToggleContext('task-1');
      await controller.toggleBookmark(c as never);

      expect(c.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, 401);
    });

    it('returns 404 when task not found', async () => {
      mockService.toggleBookmarkBySlug.mockResolvedValue(null);
      const c = createToggleContext('task-1', { id: 'user1' });
      await controller.toggleBookmark(c as never);

      expect(c.json).toHaveBeenCalledWith({ error: 'Task not found' }, 404);
    });

    it('returns 500 on error', async () => {
      mockService.toggleBookmarkBySlug.mockRejectedValue(new Error('fail'));
      const c = createToggleContext('task-1', { id: 'user1' });
      await controller.toggleBookmark(c as never);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'fail' }),
        500,
      );
    });
  });

  describe('toggleLike', () => {
    it('returns liked on success', async () => {
      mockService.toggleLikeBySlug.mockResolvedValue(true);
      const c = createToggleContext('task-1', { id: 'user1' });
      await controller.toggleLike(c as never);

      expect(c.json).toHaveBeenCalledWith({ liked: true });
    });

    it('returns 401 when no user', async () => {
      const c = createToggleContext('task-1');
      await controller.toggleLike(c as never);

      expect(c.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, 401);
    });

    it('returns 404 when task not found', async () => {
      mockService.toggleLikeBySlug.mockResolvedValue(null);
      const c = createToggleContext('task-1', { id: 'user1' });
      await controller.toggleLike(c as never);

      expect(c.json).toHaveBeenCalledWith({ error: 'Task not found' }, 404);
    });

    it('returns 500 on error', async () => {
      mockService.toggleLikeBySlug.mockRejectedValue(new Error('fail'));
      const c = createToggleContext('task-1', { id: 'user1' });
      await controller.toggleLike(c as never);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'fail' }),
        500,
      );
    });
  });

  describe('toggleSubscribe', () => {
    it('returns subscribed on success', async () => {
      mockService.toggleSubscribeBySlug.mockResolvedValue(true);
      const c = createToggleContext('task-1', { id: 'user1' });
      await controller.toggleSubscribe(c as never);

      expect(c.json).toHaveBeenCalledWith({ subscribed: true });
    });

    it('returns 401 when no user', async () => {
      const c = createToggleContext('task-1');
      await controller.toggleSubscribe(c as never);

      expect(c.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, 401);
    });

    it('returns 404 when task not found', async () => {
      mockService.toggleSubscribeBySlug.mockResolvedValue(null);
      const c = createToggleContext('task-1', { id: 'user1' });
      await controller.toggleSubscribe(c as never);

      expect(c.json).toHaveBeenCalledWith({ error: 'Task not found' }, 404);
    });

    it('returns 500 on error', async () => {
      mockService.toggleSubscribeBySlug.mockRejectedValue(new Error('fail'));
      const c = createToggleContext('task-1', { id: 'user1' });
      await controller.toggleSubscribe(c as never);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'fail' }),
        500,
      );
    });
  });
});
