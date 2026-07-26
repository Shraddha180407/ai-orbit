import { describe, it, expect, vi } from 'vitest';
import { errorHandler } from '../error.js';
import { AppError } from '../../lib/error.js';

vi.mock('../../lib/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

function mockContext() {
  let status: number;
  let body: unknown;
  return {
    json: (data: unknown, s?: number) => {
      status = s ?? 200;
      body = data;
      return { status, body };
    },
    get status() { return status; },
    get body() { return body; },
  } as unknown as { json: (data: unknown, s?: number) => unknown; status: number; body: unknown };
}

describe('errorHandler', () => {
  it('returns AppError status code and message', () => {
    const c = mockContext();
    const err = new AppError(404, 'Not Found');
    errorHandler(err, c as never);
    expect(c.status).toBe(404);
    expect(c.body).toEqual({ error: 'Not Found' });
  });

  it('returns 400 for BadRequest', () => {
    const c = mockContext();
    const err = AppError.BadRequest('Invalid input');
    errorHandler(err, c as never);
    expect(c.status).toBe(400);
    expect(c.body).toEqual({ error: 'Invalid input' });
  });

  it('returns 500 for unknown errors', () => {
    const c = mockContext();
    const err = new Error('something broke');
    errorHandler(err, c as never);
    expect(c.status).toBe(500);
    expect(c.body).toEqual({ error: 'An unexpected internal server error occurred.' });
  });
});
