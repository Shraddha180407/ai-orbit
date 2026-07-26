import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockService = {
  signup: vi.fn(),
  login: vi.fn(),
  verifyEmail: vi.fn(),
  resendVerification: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  deleteAccount: vi.fn(),
  getMe: vi.fn(),
  getSettings: vi.fn(),
  updatePassword: vi.fn(),
};

vi.mock('../auth.service.js', () => ({
  AuthService: class AuthService {
    constructor() {
      return mockService as never;
    }
  },
}));

vi.mock('../../../lib/rate-limit.js', () => ({
  rateLimit: vi.fn().mockReturnValue({ success: true }),
  getIp: vi.fn().mockReturnValue('127.0.0.1'),
}));

vi.mock('../../../lib/prisma.js', () => ({
  getPrisma: vi.fn(),
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
    static Unauthorized(m: string) { return new AppError(401, m); }
    static Forbidden(m: string) { return new AppError(403, m); }
    static NotFound(m: string) { return new AppError(404, m); }
    static Conflict(m: string) { return new AppError(409, m); }
  }
  return { AppError };
});

vi.mock('hono/cookie', () => ({
  setCookie: vi.fn(),
  deleteCookie: vi.fn(),
}));

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn().mockReturnValue('jwt-token'),
}));

import { AuthController } from '../auth.controller.js';
import { rateLimit } from '../../../lib/rate-limit.js';
import { setCookie, deleteCookie } from 'hono/cookie';

function mockContext(body?: unknown) {
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
      url: 'http://localhost:8787/api/auth/signup',
      raw: { headers: { get: vi.fn() } },
    },
    env: { JWT_SECRET: 'test-secret', DATABASE_URL: 'postgresql://test' },
    get: vi.fn(),
    set: vi.fn(),
    get status() { return status; },
    get jsonBody() { return jsonBody; },
  };
}

beforeEach(() => {
  vi.mocked(rateLimit).mockReturnValue({ success: true } as never);
  vi.mocked(setCookie).mockReset();
  vi.mocked(deleteCookie).mockReset();
  Object.values(mockService).forEach(fn => fn.mockReset());
});

describe('AuthController', () => {
  const controller = new AuthController();

  describe('signup', () => {
    it('returns 201 on success', async () => {
      mockService.signup.mockResolvedValue({});
      const c = mockContext({ email: 'a@b.com', password: '123456' });
      const result = await controller.signup(c as never);
      expect(result.status).toBe(201);
    });

    it('returns 429 when rate limited', async () => {
      vi.mocked(rateLimit).mockReturnValue({ success: false, retryAfter: 30 } as never);
      const c = mockContext({ email: 'a@b.com', password: '123456' });
      const result = await controller.signup(c as never);
      expect(result.status).toBe(429);
    });

    it('throws on invalid body', async () => {
      const c = mockContext({ email: 'bad' });
      await expect(controller.signup(c as never)).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('returns 200 with user and sets cookie', async () => {
      mockService.login.mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'A', role: 'USER' });
      const c = mockContext({ email: 'a@b.com', password: 'pass' });
      const result = await controller.login(c as never);
      expect(result.status).toBe(200);
      expect(setCookie).toHaveBeenCalled();
    });

    it('returns 429 when rate limited', async () => {
      vi.mocked(rateLimit).mockReturnValue({ success: false, retryAfter: 60 } as never);
      const c = mockContext({ email: 'a@b.com', password: 'pass' });
      const result = await controller.login(c as never);
      expect(result.status).toBe(429);
    });
  });

  describe('logout', () => {
    it('deletes cookie and returns success', async () => {
      const c = mockContext();
      const result = await controller.logout(c as never);
      expect(result.status).toBe(200);
      expect(deleteCookie).toHaveBeenCalled();
    });
  });

  describe('getMe', () => {
    it('returns user profile', async () => {
      mockService.getMe.mockResolvedValue({ id: 'u1', name: 'A' });
      const c = mockContext();
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'u1' });
      const result = await controller.getMe(c as never);
      expect(result.status).toBe(200);
    });
  });

  describe('verifyEmail', () => {
    it('returns 200 and sets cookie', async () => {
      mockService.verifyEmail.mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'A', role: 'USER' });
      const c = mockContext({ email: 'a@b.com', token: 'abc' });
      const result = await controller.verifyEmail(c as never);
      expect(result.status).toBe(200);
      expect(setCookie).toHaveBeenCalled();
    });
  });

  describe('resendVerification', () => {
    it('returns 200 with message', async () => {
      mockService.resendVerification.mockResolvedValue({ message: 'Email resent.' });
      const c = mockContext({ email: 'a@b.com' });
      const result = await controller.resendVerification(c as never);
      expect(result.status).toBe(200);
    });

    it('returns 429 when rate limited', async () => {
      vi.mocked(rateLimit).mockReturnValue({ success: false, retryAfter: 45 } as never);
      const c = mockContext({ email: 'a@b.com' });
      const result = await controller.resendVerification(c as never);
      expect(result.status).toBe(429);
    });
  });

  describe('forgotPassword', () => {
    it('returns 200 with message', async () => {
      mockService.forgotPassword.mockResolvedValue({ message: 'Reset email sent.' });
      const c = mockContext({ email: 'a@b.com' });
      const result = await controller.forgotPassword(c as never);
      expect(result.status).toBe(200);
    });

    it('returns 429 when rate limited', async () => {
      vi.mocked(rateLimit).mockReturnValue({ success: false, retryAfter: 15 } as never);
      const c = mockContext({ email: 'a@b.com' });
      const result = await controller.forgotPassword(c as never);
      expect(result.status).toBe(429);
    });
  });

  describe('resetPassword', () => {
    it('returns 200 on success', async () => {
      mockService.resetPassword.mockResolvedValue(undefined);
      const c = mockContext({ email: 'a@b.com', token: 'tok', newPassword: '123456' });
      const result = await controller.resetPassword(c as never);
      expect(result.status).toBe(200);
    });

    it('returns 429 when rate limited', async () => {
      vi.mocked(rateLimit).mockReturnValue({ success: false, retryAfter: 20 } as never);
      const c = mockContext({ email: 'a@b.com', token: 'tok', newPassword: '123456' });
      const result = await controller.resetPassword(c as never);
      expect(result.status).toBe(429);
    });
  });

  describe('deleteAccount', () => {
    it('deletes account and clears cookie', async () => {
      mockService.deleteAccount.mockResolvedValue(undefined);
      const c = mockContext();
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'u1' });
      const result = await controller.deleteAccount(c as never);
      expect(result.status).toBe(200);
      expect(deleteCookie).toHaveBeenCalled();
    });
  });

  describe('getSettings', () => {
    it('returns settings', async () => {
      mockService.getSettings.mockResolvedValue({ hasPassword: true, connectedProviders: [] });
      const c = mockContext();
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'u1' });
      const result = await controller.getSettings(c as never);
      expect(result.status).toBe(200);
    });
  });

  describe('updatePassword', () => {
    it('returns 200 on success', async () => {
      mockService.updatePassword.mockResolvedValue(undefined);
      const c = mockContext({ newPassword: '123456' });
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'u1' });
      const result = await controller.updatePassword(c as never);
      expect(result.status).toBe(200);
    });

    it('throws when password too short', async () => {
      const c = mockContext({ newPassword: '12345' });
      (c.get as ReturnType<typeof vi.fn>).mockReturnValue({ id: 'u1' });
      await expect(controller.updatePassword(c as never)).rejects.toThrow('at least 6');
    });
  });
});
