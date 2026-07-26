import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockService = {
  getAnalytics: vi.fn(),
  getUsers: vi.fn(),
  updateUserRole: vi.fn(),
  updateUserStatus: vi.fn(),
  getReports: vi.fn(),
  updateReport: vi.fn(),
  getCollections: vi.fn(),
  createCollection: vi.fn(),
  updateCollection: vi.fn(),
  deleteCollection: vi.fn(),
  getTools: vi.fn(),
  createTool: vi.fn(),
  updateTool: vi.fn(),
  deleteTool: vi.fn(),
  getNews: vi.fn(),
  createNews: vi.fn(),
  updateNews: vi.fn(),
  deleteNews: vi.fn(),
  getCompanies: vi.fn(),
  createCompany: vi.fn(),
  updateCompany: vi.fn(),
  deleteCompany: vi.fn(),
  getModels: vi.fn(),
  createModel: vi.fn(),
  updateModel: vi.fn(),
  deleteModel: vi.fn(),
  getVideos: vi.fn(),
  createVideo: vi.fn(),
  updateVideo: vi.fn(),
  deleteVideo: vi.fn(),
};

const mockPrisma = {
  user: {
    findFirst: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  $disconnect: vi.fn(),
};

vi.mock('../admin.service.js', () => ({
  AdminService: class AdminService {
    constructor() {
      return mockService as never;
    }
  },
}));

vi.mock('../../../lib/prisma.js', () => ({
  getPrisma: vi.fn(),
}));

vi.mock('../../../lib/logger.js', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

import { AdminController } from '../admin.controller.js';
import { getPrisma } from '../../../lib/prisma.js';
import { logger } from '../../../lib/logger.js';

function mockContext(
  body?: unknown,
  queryParams: Record<string, string> = {},
  params: Record<string, string> = {},
  user?: { id: string },
) {
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
      query: (key: string) => queryParams[key] || '',
      param: (key: string) => params[key] || '',
    },
    env: {},
    get: vi.fn().mockReturnValue(user),
    get status() { return status; },
    get jsonBody() { return jsonBody; },
  };
}

function createP2003Error(message = 'Foreign key constraint') {
  const err = new Error(message) as Error & { code: string };
  err.code = 'P2003';
  return err;
}

beforeEach(() => {
  vi.clearAllMocks();
  Object.values(mockService).forEach(fn => fn.mockReset());
  mockPrisma.user.findFirst.mockReset();
  mockPrisma.user.update.mockReset();
  mockPrisma.user.create.mockReset();
  mockPrisma.$disconnect.mockReset();
  vi.mocked(getPrisma).mockReturnValue(mockPrisma as never);
});

describe('AdminController', () => {
  const controller = new AdminController();

  describe('getAnalytics', () => {
    it('returns 200 with data', async () => {
      const data = { users: 10, repos: 5 };
      mockService.getAnalytics.mockResolvedValue(data);
      const c = mockContext();
      await controller.getAnalytics(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(data);
    });

    it('returns 500 on error', async () => {
      mockService.getAnalytics.mockRejectedValue(new Error('fail'));
      const c = mockContext();
      await controller.getAnalytics(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('getUsers', () => {
    it('returns 200 with default params', async () => {
      const data = { items: [], total: 0 };
      mockService.getUsers.mockResolvedValue(data);
      const c = mockContext();
      await controller.getUsers(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(data);
      expect(mockService.getUsers).toHaveBeenCalledWith(1, '');
    });

    it('passes page and search params', async () => {
      mockService.getUsers.mockResolvedValue({ items: [] });
      const c = mockContext(undefined, { page: '3', q: 'test' });
      await controller.getUsers(c as never);
      expect(mockService.getUsers).toHaveBeenCalledWith(3, 'test');
    });

    it('returns 500 on error', async () => {
      mockService.getUsers.mockRejectedValue(new Error('fail'));
      const c = mockContext();
      await controller.getUsers(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('inviteAdmin', () => {
    it('returns 400 when email is missing', async () => {
      const c = mockContext({});
      await controller.inviteAdmin(c as never);
      expect(c.status).toBe(400);
      expect(c.jsonBody).toEqual({ error: 'Email is required' });
    });

    it('returns 400 when email is empty string', async () => {
      const c = mockContext({ email: '' });
      await controller.inviteAdmin(c as never);
      expect(c.status).toBe(400);
      expect(c.jsonBody).toEqual({ error: 'Email is required' });
    });

    it('updates existing user role to ADMIN', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ id: 'user1', email: 'test@example.com' });
      mockPrisma.user.update.mockResolvedValue({});
      const c = mockContext({ email: 'test@example.com' });
      await controller.inviteAdmin(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: { equals: 'test@example.com', mode: 'insensitive' } },
      });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user1' },
        data: { role: 'ADMIN' },
      });
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('creates new user when not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({});
      const c = mockContext({ email: 'new@example.com' });
      await controller.inviteAdmin(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@example.com',
          role: 'ADMIN',
          name: 'New Admin',
        },
      });
    });

    it('returns 500 on error', async () => {
      mockPrisma.user.findFirst.mockRejectedValue(new Error('db fail'));
      const c = mockContext({ email: 'test@example.com' });
      await controller.inviteAdmin(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'db fail' });
    });
  });

  describe('updateUserRole', () => {
    it('returns 200 on success', async () => {
      mockService.updateUserRole.mockResolvedValue(undefined);
      const c = mockContext({ role: 'ADMIN' }, {}, { id: 'user1' }, { id: 'admin1' });
      await controller.updateUserRole(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
      expect(mockService.updateUserRole).toHaveBeenCalledWith('user1', 'ADMIN');
    });

    it('returns 400 for invalid role', async () => {
      const c = mockContext({ role: 'SUPERADMIN' }, {}, { id: 'user1' }, { id: 'admin1' });
      await controller.updateUserRole(c as never);
      expect(c.status).toBe(400);
      expect(c.jsonBody).toEqual({ error: 'Invalid role' });
      expect(mockService.updateUserRole).not.toHaveBeenCalled();
    });

    it('returns 403 when user tries to revoke own admin role', async () => {
      const c = mockContext({ role: 'USER' }, {}, { id: 'admin1' }, { id: 'admin1' });
      await controller.updateUserRole(c as never);
      expect(c.status).toBe(403);
      expect(c.jsonBody).toEqual({ error: 'Cannot revoke your own admin role' });
      expect(mockService.updateUserRole).not.toHaveBeenCalled();
    });

    it('allows setting own role to ADMIN (no self-demotion)', async () => {
      mockService.updateUserRole.mockResolvedValue(undefined);
      const c = mockContext({ role: 'ADMIN' }, {}, { id: 'admin1' }, { id: 'admin1' });
      await controller.updateUserRole(c as never);
      expect(c.status).toBe(200);
      expect(mockService.updateUserRole).toHaveBeenCalledWith('admin1', 'ADMIN');
    });

    it('returns 500 on error', async () => {
      mockService.updateUserRole.mockRejectedValue(new Error('db fail'));
      const c = mockContext({ role: 'USER' }, {}, { id: 'user1' }, { id: 'admin1' });
      await controller.updateUserRole(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'db fail' });
    });
  });

  describe('updateUserStatus', () => {
    it('returns 200 on success', async () => {
      mockService.updateUserStatus.mockResolvedValue(undefined);
      const c = mockContext({ status: 'BLOCKED' }, {}, { id: 'user1' }, { id: 'admin1' });
      await controller.updateUserStatus(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
      expect(mockService.updateUserStatus).toHaveBeenCalledWith('user1', 'BLOCKED');
    });

    it('returns 400 for invalid status', async () => {
      const c = mockContext({ status: 'INACTIVE' }, {}, { id: 'user1' }, { id: 'admin1' });
      await controller.updateUserStatus(c as never);
      expect(c.status).toBe(400);
      expect(c.jsonBody).toEqual({ error: 'Invalid status' });
      expect(mockService.updateUserStatus).not.toHaveBeenCalled();
    });

    it('returns 403 when user tries to block own account', async () => {
      const c = mockContext({ status: 'BLOCKED' }, {}, { id: 'admin1' }, { id: 'admin1' });
      await controller.updateUserStatus(c as never);
      expect(c.status).toBe(403);
      expect(c.jsonBody).toEqual({ error: 'Cannot block your own account' });
      expect(mockService.updateUserStatus).not.toHaveBeenCalled();
    });

    it('allows setting own status to ACTIVE', async () => {
      mockService.updateUserStatus.mockResolvedValue(undefined);
      const c = mockContext({ status: 'ACTIVE' }, {}, { id: 'admin1' }, { id: 'admin1' });
      await controller.updateUserStatus(c as never);
      expect(c.status).toBe(200);
      expect(mockService.updateUserStatus).toHaveBeenCalledWith('admin1', 'ACTIVE');
    });

    it('returns 500 on error', async () => {
      mockService.updateUserStatus.mockRejectedValue(new Error('db fail'));
      const c = mockContext({ status: 'BLOCKED' }, {}, { id: 'user1' }, { id: 'admin1' });
      await controller.updateUserStatus(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'db fail' });
    });
  });

  describe('getReports', () => {
    it('returns 200 with default params', async () => {
      const data = { items: [], total: 0 };
      mockService.getReports.mockResolvedValue(data);
      const c = mockContext();
      await controller.getReports(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(data);
      expect(mockService.getReports).toHaveBeenCalledWith(1, 'ALL');
    });

    it('passes page and status params', async () => {
      mockService.getReports.mockResolvedValue({ items: [] });
      const c = mockContext(undefined, { page: '2', status: 'PENDING' });
      await controller.getReports(c as never);
      expect(mockService.getReports).toHaveBeenCalledWith(2, 'PENDING');
    });

    it('returns 500 on error', async () => {
      mockService.getReports.mockRejectedValue(new Error('fail'));
      const c = mockContext();
      await controller.getReports(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('updateReport', () => {
    it('returns 200 on success', async () => {
      mockService.updateReport.mockResolvedValue(undefined);
      const c = mockContext({ status: 'RESOLVED' }, {}, { id: 'report1' });
      await controller.updateReport(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
      expect(mockService.updateReport).toHaveBeenCalledWith('report1', 'RESOLVED');
    });

    it('returns 500 on error', async () => {
      mockService.updateReport.mockRejectedValue(new Error('fail'));
      const c = mockContext({ status: 'RESOLVED' }, {}, { id: 'report1' });
      await controller.updateReport(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('getCollections', () => {
    it('returns 200 with data', async () => {
      const data = [{ id: 'c1', name: 'Test' }];
      mockService.getCollections.mockResolvedValue(data);
      const c = mockContext();
      await controller.getCollections(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(data);
    });

    it('returns 500 on error', async () => {
      mockService.getCollections.mockRejectedValue(new Error('fail'));
      const c = mockContext();
      await controller.getCollections(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('createCollection', () => {
    it('returns 200 with created data', async () => {
      const body = { name: 'New Collection' };
      const result = { id: 'c1', ...body };
      mockService.createCollection.mockResolvedValue(result);
      const c = mockContext(body, {}, {}, { id: 'user1' });
      await controller.createCollection(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.createCollection).toHaveBeenCalledWith(body, 'user1');
    });

    it('returns 500 on error', async () => {
      mockService.createCollection.mockRejectedValue(new Error('fail'));
      const c = mockContext({ name: 'Test' }, {}, {}, { id: 'user1' });
      await controller.createCollection(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('updateCollection', () => {
    it('returns 200 with updated data', async () => {
      const body = { name: 'Updated' };
      const result = { id: 'c1', ...body };
      mockService.updateCollection.mockResolvedValue(result);
      const c = mockContext(body, {}, { id: 'c1' });
      await controller.updateCollection(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.updateCollection).toHaveBeenCalledWith('c1', body);
    });

    it('returns 500 on error', async () => {
      mockService.updateCollection.mockRejectedValue(new Error('fail'));
      const c = mockContext({ name: 'Test' }, {}, { id: 'c1' });
      await controller.updateCollection(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('deleteCollection', () => {
    it('returns 200 on success', async () => {
      mockService.deleteCollection.mockResolvedValue(undefined);
      const c = mockContext(undefined, {}, { id: 'c1' });
      await controller.deleteCollection(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
      expect(mockService.deleteCollection).toHaveBeenCalledWith('c1');
    });

    it('returns 409 on P2003 error', async () => {
      mockService.deleteCollection.mockRejectedValue(createP2003Error());
      const c = mockContext(undefined, {}, { id: 'c1' });
      await controller.deleteCollection(c as never);
      expect(c.status).toBe(409);
      expect(c.jsonBody).toEqual({
        error: 'Cannot delete this record because it is currently in use or referenced by other items.',
      });
    });

    it('returns 500 on non-P2003 error', async () => {
      mockService.deleteCollection.mockRejectedValue(new Error('fail'));
      const c = mockContext(undefined, {}, { id: 'c1' });
      await controller.deleteCollection(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('getTools', () => {
    it('returns 200 with default params', async () => {
      const data = { items: [], total: 0 };
      mockService.getTools.mockResolvedValue(data);
      const c = mockContext();
      await controller.getTools(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(data);
      expect(mockService.getTools).toHaveBeenCalledWith(1, '');
    });

    it('passes page and search params', async () => {
      mockService.getTools.mockResolvedValue({ items: [] });
      const c = mockContext(undefined, { page: '2', q: 'tool' });
      await controller.getTools(c as never);
      expect(mockService.getTools).toHaveBeenCalledWith(2, 'tool');
    });

    it('returns 500 on error', async () => {
      mockService.getTools.mockRejectedValue(new Error('fail'));
      const c = mockContext();
      await controller.getTools(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('createTool', () => {
    it('returns 200 with created data', async () => {
      const body = { name: 'Tool', url: 'https://example.com' };
      const result = { id: 't1', ...body };
      mockService.createTool.mockResolvedValue(result);
      const c = mockContext(body);
      await controller.createTool(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.createTool).toHaveBeenCalledWith(body);
    });

    it('returns 500 on error', async () => {
      mockService.createTool.mockRejectedValue(new Error('fail'));
      const c = mockContext({ name: 'Tool' });
      await controller.createTool(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('updateTool', () => {
    it('returns 200 with updated data', async () => {
      const body = { name: 'Updated Tool' };
      const result = { id: 't1', ...body };
      mockService.updateTool.mockResolvedValue(result);
      const c = mockContext(body, {}, { id: 't1' });
      await controller.updateTool(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.updateTool).toHaveBeenCalledWith('t1', body);
    });

    it('returns 500 on error', async () => {
      mockService.updateTool.mockRejectedValue(new Error('fail'));
      const c = mockContext({ name: 'Tool' }, {}, { id: 't1' });
      await controller.updateTool(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('deleteTool', () => {
    it('returns 200 on success', async () => {
      mockService.deleteTool.mockResolvedValue(undefined);
      const c = mockContext(undefined, {}, { id: 't1' });
      await controller.deleteTool(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
      expect(mockService.deleteTool).toHaveBeenCalledWith('t1');
    });

    it('returns 409 on P2003 error', async () => {
      mockService.deleteTool.mockRejectedValue(createP2003Error());
      const c = mockContext(undefined, {}, { id: 't1' });
      await controller.deleteTool(c as never);
      expect(c.status).toBe(409);
      expect(c.jsonBody).toEqual({
        error: 'Cannot delete this record because it is currently in use or referenced by other items.',
      });
    });

    it('returns 500 on non-P2003 error', async () => {
      mockService.deleteTool.mockRejectedValue(new Error('fail'));
      const c = mockContext(undefined, {}, { id: 't1' });
      await controller.deleteTool(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('getNews', () => {
    it('returns 200 with default params', async () => {
      const data = { items: [], total: 0 };
      mockService.getNews.mockResolvedValue(data);
      const c = mockContext();
      await controller.getNews(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(data);
      expect(mockService.getNews).toHaveBeenCalledWith(1, '');
    });

    it('passes page and search params', async () => {
      mockService.getNews.mockResolvedValue({ items: [] });
      const c = mockContext(undefined, { page: '2', q: 'news' });
      await controller.getNews(c as never);
      expect(mockService.getNews).toHaveBeenCalledWith(2, 'news');
    });

    it('returns 500 on error', async () => {
      mockService.getNews.mockRejectedValue(new Error('fail'));
      const c = mockContext();
      await controller.getNews(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('deleteNews', () => {
    it('returns 200 on success', async () => {
      mockService.deleteNews.mockResolvedValue(undefined);
      const c = mockContext(undefined, {}, { id: 'n1' });
      await controller.deleteNews(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
      expect(mockService.deleteNews).toHaveBeenCalledWith('n1');
    });

    it('returns 409 on P2003 error', async () => {
      mockService.deleteNews.mockRejectedValue(createP2003Error());
      const c = mockContext(undefined, {}, { id: 'n1' });
      await controller.deleteNews(c as never);
      expect(c.status).toBe(409);
      expect(c.jsonBody).toEqual({
        error: 'Cannot delete this record because it is currently in use or referenced by other items.',
      });
    });

    it('logs error on failure', async () => {
      const err = new Error('fail');
      mockService.deleteNews.mockRejectedValue(err);
      const c = mockContext(undefined, {}, { id: 'n1' });
      await controller.deleteNews(c as never);
      expect(logger.error).toHaveBeenCalledWith('DELETE NEWS ERROR:', err);
    });

    it('returns 500 on non-P2003 error', async () => {
      mockService.deleteNews.mockRejectedValue(new Error('fail'));
      const c = mockContext(undefined, {}, { id: 'n1' });
      await controller.deleteNews(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('createNews', () => {
    it('returns 200 with created data', async () => {
      const body = { title: 'News Title', content: 'Content' };
      const result = { id: 'n1', ...body };
      mockService.createNews.mockResolvedValue(result);
      const c = mockContext(body);
      await controller.createNews(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.createNews).toHaveBeenCalledWith(body);
    });

    it('returns 500 on error', async () => {
      mockService.createNews.mockRejectedValue(new Error('fail'));
      const c = mockContext({ title: 'News' });
      await controller.createNews(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('updateNews', () => {
    it('returns 200 with updated data', async () => {
      const body = { title: 'Updated News' };
      const result = { id: 'n1', ...body };
      mockService.updateNews.mockResolvedValue(result);
      const c = mockContext(body, {}, { id: 'n1' });
      await controller.updateNews(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.updateNews).toHaveBeenCalledWith('n1', body);
    });

    it('returns 500 on error', async () => {
      mockService.updateNews.mockRejectedValue(new Error('fail'));
      const c = mockContext({ title: 'News' }, {}, { id: 'n1' });
      await controller.updateNews(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('getCompanies', () => {
    it('returns 200 with default params', async () => {
      const data = { items: [], total: 0 };
      mockService.getCompanies.mockResolvedValue(data);
      const c = mockContext();
      await controller.getCompanies(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(data);
      expect(mockService.getCompanies).toHaveBeenCalledWith(1, '');
    });

    it('passes page and search params', async () => {
      mockService.getCompanies.mockResolvedValue({ items: [] });
      const c = mockContext(undefined, { page: '2', q: 'corp' });
      await controller.getCompanies(c as never);
      expect(mockService.getCompanies).toHaveBeenCalledWith(2, 'corp');
    });

    it('returns 500 on error', async () => {
      mockService.getCompanies.mockRejectedValue(new Error('fail'));
      const c = mockContext();
      await controller.getCompanies(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('createCompany', () => {
    it('returns 200 with created data', async () => {
      const body = { name: 'Acme', slug: 'acme' };
      const result = { id: 'co1', ...body };
      mockService.createCompany.mockResolvedValue(result);
      const c = mockContext(body);
      await controller.createCompany(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.createCompany).toHaveBeenCalledWith(body);
    });

    it('returns 500 on error', async () => {
      mockService.createCompany.mockRejectedValue(new Error('fail'));
      const c = mockContext({ name: 'Acme' });
      await controller.createCompany(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('updateCompany', () => {
    it('returns 200 with updated data', async () => {
      const body = { name: 'Updated Co' };
      const result = { id: 'co1', ...body };
      mockService.updateCompany.mockResolvedValue(result);
      const c = mockContext(body, {}, { id: 'co1' });
      await controller.updateCompany(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.updateCompany).toHaveBeenCalledWith('co1', body);
    });

    it('returns 500 on error', async () => {
      mockService.updateCompany.mockRejectedValue(new Error('fail'));
      const c = mockContext({ name: 'Co' }, {}, { id: 'co1' });
      await controller.updateCompany(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('deleteCompany', () => {
    it('returns 200 on success', async () => {
      mockService.deleteCompany.mockResolvedValue(undefined);
      const c = mockContext(undefined, {}, { id: 'co1' });
      await controller.deleteCompany(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
      expect(mockService.deleteCompany).toHaveBeenCalledWith('co1');
    });

    it('returns 409 on P2003 error', async () => {
      mockService.deleteCompany.mockRejectedValue(createP2003Error());
      const c = mockContext(undefined, {}, { id: 'co1' });
      await controller.deleteCompany(c as never);
      expect(c.status).toBe(409);
      expect(c.jsonBody).toEqual({
        error: 'Cannot delete this record because it is currently in use or referenced by other items.',
      });
    });

    it('returns 500 on non-P2003 error', async () => {
      mockService.deleteCompany.mockRejectedValue(new Error('fail'));
      const c = mockContext(undefined, {}, { id: 'co1' });
      await controller.deleteCompany(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('getModels', () => {
    it('returns 200 with default params', async () => {
      const data = { items: [], total: 0 };
      mockService.getModels.mockResolvedValue(data);
      const c = mockContext();
      await controller.getModels(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(data);
      expect(mockService.getModels).toHaveBeenCalledWith(1, '');
    });

    it('passes page and search params', async () => {
      mockService.getModels.mockResolvedValue({ items: [] });
      const c = mockContext(undefined, { page: '3', q: 'gpt' });
      await controller.getModels(c as never);
      expect(mockService.getModels).toHaveBeenCalledWith(3, 'gpt');
    });

    it('returns 500 on error', async () => {
      mockService.getModels.mockRejectedValue(new Error('fail'));
      const c = mockContext();
      await controller.getModels(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('createModel', () => {
    it('returns 200 with created data', async () => {
      const body = { name: 'GPT-4', provider: 'openai' };
      const result = { id: 'm1', ...body };
      mockService.createModel.mockResolvedValue(result);
      const c = mockContext(body);
      await controller.createModel(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.createModel).toHaveBeenCalledWith(body);
    });

    it('returns 500 on error', async () => {
      mockService.createModel.mockRejectedValue(new Error('fail'));
      const c = mockContext({ name: 'Model' });
      await controller.createModel(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('updateModel', () => {
    it('returns 200 with updated data', async () => {
      const body = { name: 'Updated Model' };
      const result = { id: 'm1', ...body };
      mockService.updateModel.mockResolvedValue(result);
      const c = mockContext(body, {}, { id: 'm1' });
      await controller.updateModel(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.updateModel).toHaveBeenCalledWith('m1', body);
    });

    it('returns 500 on error', async () => {
      mockService.updateModel.mockRejectedValue(new Error('fail'));
      const c = mockContext({ name: 'Model' }, {}, { id: 'm1' });
      await controller.updateModel(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('deleteModel', () => {
    it('returns 200 on success', async () => {
      mockService.deleteModel.mockResolvedValue(undefined);
      const c = mockContext(undefined, {}, { id: 'm1' });
      await controller.deleteModel(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
      expect(mockService.deleteModel).toHaveBeenCalledWith('m1');
    });

    it('returns 409 on P2003 error', async () => {
      mockService.deleteModel.mockRejectedValue(createP2003Error());
      const c = mockContext(undefined, {}, { id: 'm1' });
      await controller.deleteModel(c as never);
      expect(c.status).toBe(409);
      expect(c.jsonBody).toEqual({
        error: 'Cannot delete this record because it is currently in use or referenced by other items.',
      });
    });

    it('returns 500 on non-P2003 error', async () => {
      mockService.deleteModel.mockRejectedValue(new Error('fail'));
      const c = mockContext(undefined, {}, { id: 'm1' });
      await controller.deleteModel(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('getVideos', () => {
    it('returns 200 with default params', async () => {
      const data = { items: [], total: 0 };
      mockService.getVideos.mockResolvedValue(data);
      const c = mockContext();
      await controller.getVideos(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(data);
      expect(mockService.getVideos).toHaveBeenCalledWith(1, '');
    });

    it('passes page and search params', async () => {
      mockService.getVideos.mockResolvedValue({ items: [] });
      const c = mockContext(undefined, { page: '2', q: 'demo' });
      await controller.getVideos(c as never);
      expect(mockService.getVideos).toHaveBeenCalledWith(2, 'demo');
    });

    it('returns 500 on error', async () => {
      mockService.getVideos.mockRejectedValue(new Error('fail'));
      const c = mockContext();
      await controller.getVideos(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('createVideo', () => {
    it('returns 200 with created data', async () => {
      const body = { title: 'Demo', url: 'https://youtube.com' };
      const result = { id: 'v1', ...body };
      mockService.createVideo.mockResolvedValue(result);
      const c = mockContext(body);
      await controller.createVideo(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.createVideo).toHaveBeenCalledWith(body);
    });

    it('returns 500 on error', async () => {
      mockService.createVideo.mockRejectedValue(new Error('fail'));
      const c = mockContext({ title: 'Video' });
      await controller.createVideo(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('updateVideo', () => {
    it('returns 200 with updated data', async () => {
      const body = { title: 'Updated Video' };
      const result = { id: 'v1', ...body };
      mockService.updateVideo.mockResolvedValue(result);
      const c = mockContext(body, {}, { id: 'v1' });
      await controller.updateVideo(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(result);
      expect(mockService.updateVideo).toHaveBeenCalledWith('v1', body);
    });

    it('returns 500 on error', async () => {
      mockService.updateVideo.mockRejectedValue(new Error('fail'));
      const c = mockContext({ title: 'Video' }, {}, { id: 'v1' });
      await controller.updateVideo(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });

  describe('deleteVideo', () => {
    it('returns 200 on success', async () => {
      mockService.deleteVideo.mockResolvedValue(undefined);
      const c = mockContext(undefined, {}, { id: 'v1' });
      await controller.deleteVideo(c as never);
      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual({ success: true });
      expect(mockService.deleteVideo).toHaveBeenCalledWith('v1');
    });

    it('returns 409 on P2003 error', async () => {
      mockService.deleteVideo.mockRejectedValue(createP2003Error());
      const c = mockContext(undefined, {}, { id: 'v1' });
      await controller.deleteVideo(c as never);
      expect(c.status).toBe(409);
      expect(c.jsonBody).toEqual({
        error: 'Cannot delete this record because it is currently in use or referenced by other items.',
      });
    });

    it('returns 500 on non-P2003 error', async () => {
      mockService.deleteVideo.mockRejectedValue(new Error('fail'));
      const c = mockContext(undefined, {}, { id: 'v1' });
      await controller.deleteVideo(c as never);
      expect(c.status).toBe(500);
      expect(c.jsonBody).toEqual({ error: 'fail' });
    });
  });
});
