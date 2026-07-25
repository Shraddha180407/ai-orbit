import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jwtMiddleware, adminMiddleware, optionalJwtMiddleware } from '../jwt.js';

vi.mock('hono/cookie', () => ({
  getCookie: vi.fn(),
}));

vi.mock('jsonwebtoken', () => ({
  verify: vi.fn(),
}));

vi.mock('../../lib/prisma.js', () => ({
  getPrisma: vi.fn(),
}));

import { getCookie } from 'hono/cookie';
import { verify } from 'jsonwebtoken';
import { getPrisma } from '../../lib/prisma.js';

function mockContext(cookieValue?: string) {
  let status: number;
  let body: unknown;
  const userSet = { value: undefined as unknown };
  const next = vi.fn();
  return {
    json: (data: unknown, s?: number) => {
      status = s ?? 200;
      body = data;
      return { status, body };
    },
    set: (_key: string, value: unknown) => { userSet.value = value; },
    env: { JWT_SECRET: 'test-secret' },
    get status() { return status; },
    get body() { return body; },
    get setUser() { return userSet.value; },
    next,
  };
}

beforeEach(() => {
  vi.mocked(getCookie).mockReset();
  vi.mocked(verify).mockReset();
  vi.mocked(getPrisma).mockReset();
});

describe('jwtMiddleware', () => {
  it('returns 401 when no cookie', async () => {
    vi.mocked(getCookie).mockReturnValue(undefined);
    const c = mockContext();
    await jwtMiddleware(c as never, c.next);
    expect(c.status).toBe(401);
    expect(c.body).toEqual({ error: 'Unauthorized' });
  });

  it('returns 401 when token is invalid', async () => {
    vi.mocked(getCookie).mockReturnValue('bad-token');
    vi.mocked(verify).mockImplementation(() => { throw new Error('invalid'); });
    const c = mockContext();
    await jwtMiddleware(c as never, c.next);
    expect(c.status).toBe(401);
    expect(c.body).toEqual({ error: 'Invalid or expired token' });
  });

  it('calls next and sets user when token is valid', async () => {
    vi.mocked(getCookie).mockReturnValue('valid-token');
    vi.mocked(verify).mockReturnValue({ id: 'user-1', email: 'a@b.com' } as never);
    const c = mockContext();
    await jwtMiddleware(c as never, c.next);
    expect(c.next).toHaveBeenCalled();
    expect(c.setUser).toEqual({ id: 'user-1', email: 'a@b.com' });
  });
});

describe('adminMiddleware', () => {
  it('returns 401 when no cookie', async () => {
    vi.mocked(getCookie).mockReturnValue(undefined);
    const c = mockContext();
    await adminMiddleware(c as never, c.next);
    expect(c.status).toBe(401);
  });

  it('returns 401 when token invalid', async () => {
    vi.mocked(getCookie).mockReturnValue('bad');
    vi.mocked(verify).mockImplementation(() => { throw new Error('bad'); });
    const c = mockContext();
    await adminMiddleware(c as never, c.next);
    expect(c.status).toBe(401);
  });

  it('returns 404 when user not found in DB', async () => {
    vi.mocked(getCookie).mockReturnValue('valid');
    vi.mocked(verify).mockReturnValue({ id: 'user-1' } as never);
    const mockPrisma = { user: { findUnique: vi.fn().mockResolvedValue(null) } };
    vi.mocked(getPrisma).mockReturnValue(mockPrisma as never);
    const c = mockContext();
    await adminMiddleware(c as never, c.next);
    expect(c.status).toBe(404);
  });

  it('returns 403 when user is BLOCKED', async () => {
    vi.mocked(getCookie).mockReturnValue('valid');
    vi.mocked(verify).mockReturnValue({ id: 'user-1' } as never);
    const mockPrisma = { user: { findUnique: vi.fn().mockResolvedValue({ role: 'USER', status: 'BLOCKED' }) } };
    vi.mocked(getPrisma).mockReturnValue(mockPrisma as never);
    const c = mockContext();
    await adminMiddleware(c as never, c.next);
    expect(c.status).toBe(403);
    expect(c.body).toEqual({ error: 'Your account has been blocked' });
  });

  it('returns 403 when user is not ADMIN', async () => {
    vi.mocked(getCookie).mockReturnValue('valid');
    vi.mocked(verify).mockReturnValue({ id: 'user-1' } as never);
    const mockPrisma = { user: { findUnique: vi.fn().mockResolvedValue({ role: 'USER', status: 'ACTIVE' }) } };
    vi.mocked(getPrisma).mockReturnValue(mockPrisma as never);
    const c = mockContext();
    await adminMiddleware(c as never, c.next);
    expect(c.status).toBe(403);
    expect(c.body).toEqual({ error: 'Forbidden: Admin access required' });
  });

  it('calls next when user is ADMIN', async () => {
    vi.mocked(getCookie).mockReturnValue('valid');
    vi.mocked(verify).mockReturnValue({ id: 'admin-1' } as never);
    const mockPrisma = { user: { findUnique: vi.fn().mockResolvedValue({ role: 'ADMIN', status: 'ACTIVE' }) } };
    vi.mocked(getPrisma).mockReturnValue(mockPrisma as never);
    const c = mockContext();
    await adminMiddleware(c as never, c.next);
    expect(c.next).toHaveBeenCalled();
  });
});

describe('optionalJwtMiddleware', () => {
  it('calls next without setting user when no cookie', async () => {
    vi.mocked(getCookie).mockReturnValue(undefined);
    const c = mockContext();
    await optionalJwtMiddleware(c as never, c.next);
    expect(c.next).toHaveBeenCalled();
    expect(c.setUser).toBeUndefined();
  });

  it('calls next and sets user when token valid', async () => {
    vi.mocked(getCookie).mockReturnValue('valid');
    vi.mocked(verify).mockReturnValue({ id: 'user-1' } as never);
    const c = mockContext();
    await optionalJwtMiddleware(c as never, c.next);
    expect(c.next).toHaveBeenCalled();
    expect(c.setUser).toEqual({ id: 'user-1' });
  });

  it('calls next silently when token invalid', async () => {
    vi.mocked(getCookie).mockReturnValue('bad');
    vi.mocked(verify).mockImplementation(() => { throw new Error('bad'); });
    const c = mockContext();
    await optionalJwtMiddleware(c as never, c.next);
    expect(c.next).toHaveBeenCalled();
    expect(c.setUser).toBeUndefined();
  });
});
