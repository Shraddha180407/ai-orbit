import { describe, it, expect, vi } from 'vitest';
import { requireIngestionToken, requireCollectionsIngestionToken } from '../auth.js';

vi.mock('../../lib/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

function mockMiddlewareContext(overrides: { token?: string; header?: string; env?: Record<string, string | undefined> }) {
  let status: number;
  let body: unknown;
  const next = vi.fn();
  return {
    json: (data: unknown, s?: number) => {
      status = s ?? 200;
      body = data;
      return { status, body };
    },
    req: {
      header: (name: string) => {
        if (name === 'authorization') return overrides.header ?? null;
        return null;
      },
    },
    env: overrides.env ?? {},
    get status() { return status; },
    get body() { return body; },
    next,
  };
}

describe('requireIngestionToken', () => {
  it('returns 500 when INGESTION_TOKEN is not configured', async () => {
    const c = mockMiddlewareContext({ env: {} });
    await requireIngestionToken(c as never, c.next);
    expect(c.status).toBe(500);
    expect(c.body).toEqual({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Authorization is misconfigured on the server',
    });
  });

  it('returns 401 when no Authorization header', async () => {
    const c = mockMiddlewareContext({ env: { INGESTION_TOKEN: 'secret' } });
    await requireIngestionToken(c as never, c.next);
    expect(c.status).toBe(401);
    expect(c.body).toEqual({
      error: 'UNAUTHORIZED',
      message: 'Missing or invalid authentication token',
    });
  });

  it('returns 401 when header does not start with Bearer', async () => {
    const c = mockMiddlewareContext({ env: { INGESTION_TOKEN: 'secret' }, header: 'Basic abc' });
    await requireIngestionToken(c as never, c.next);
    expect(c.status).toBe(401);
  });

  it('returns 403 when token does not match', async () => {
    const c = mockMiddlewareContext({ env: { INGESTION_TOKEN: 'secret' }, header: 'Bearer wrong' });
    await requireIngestionToken(c as never, c.next);
    expect(c.status).toBe(403);
    expect(c.body).toEqual({
      error: 'FORBIDDEN',
      message: 'Invalid ingestion privileges',
    });
  });

  it('calls next when token matches', async () => {
    const c = mockMiddlewareContext({ env: { INGESTION_TOKEN: 'secret' }, header: 'Bearer secret' });
    await requireIngestionToken(c as never, c.next);
    expect(c.next).toHaveBeenCalled();
    expect(c.status).toBeUndefined();
  });

  it('trims whitespace from the token', async () => {
    const c = mockMiddlewareContext({ env: { INGESTION_TOKEN: 'secret' }, header: 'Bearer   secret  ' });
    await requireIngestionToken(c as never, c.next);
    expect(c.next).toHaveBeenCalled();
  });
});

describe('requireCollectionsIngestionToken', () => {
  it('returns 500 when INGESTION_TOKEN_COLLECTIONS is not configured', async () => {
    const c = mockMiddlewareContext({ env: {} });
    await requireCollectionsIngestionToken(c as never, c.next);
    expect(c.status).toBe(500);
    expect(c.body).toEqual({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Authorization is misconfigured on the server',
    });
  });

  it('returns 401 when no Authorization header', async () => {
    const c = mockMiddlewareContext({ env: { INGESTION_TOKEN_COLLECTIONS: 'secret' } });
    await requireCollectionsIngestionToken(c as never, c.next);
    expect(c.status).toBe(401);
    expect(c.body).toEqual({
      error: 'UNAUTHORIZED',
      message: 'Missing or invalid authentication token',
    });
  });

  it('returns 401 when header does not start with Bearer', async () => {
    const c = mockMiddlewareContext({ env: { INGESTION_TOKEN_COLLECTIONS: 'secret' }, header: 'Basic abc' });
    await requireCollectionsIngestionToken(c as never, c.next);
    expect(c.status).toBe(401);
  });

  it('returns 403 when token does not match', async () => {
    const c = mockMiddlewareContext({ env: { INGESTION_TOKEN_COLLECTIONS: 'secret' }, header: 'Bearer wrong' });
    await requireCollectionsIngestionToken(c as never, c.next);
    expect(c.status).toBe(403);
    expect(c.body).toEqual({
      error: 'FORBIDDEN',
      message: 'Invalid ingestion privileges',
    });
  });

  it('calls next when token matches', async () => {
    const c = mockMiddlewareContext({ env: { INGESTION_TOKEN_COLLECTIONS: 'secret' }, header: 'Bearer secret' });
    await requireCollectionsIngestionToken(c as never, c.next);
    expect(c.next).toHaveBeenCalled();
    expect(c.status).toBeUndefined();
  });

  it('trims whitespace from the token', async () => {
    const c = mockMiddlewareContext({ env: { INGESTION_TOKEN_COLLECTIONS: 'secret' }, header: 'Bearer   secret  ' });
    await requireCollectionsIngestionToken(c as never, c.next);
    expect(c.next).toHaveBeenCalled();
  });

  it('rejects INGESTION_TOKEN for collections endpoint', async () => {
    const c = mockMiddlewareContext({
      env: { INGESTION_TOKEN: 'wrong', INGESTION_TOKEN_COLLECTIONS: 'correct' },
      header: 'Bearer wrong',
    });
    await requireCollectionsIngestionToken(c as never, c.next);
    expect(c.status).toBe(403);
  });
});
