import { Context } from 'hono';
import type { ErrorHandler } from 'hono';
import { AppError } from '../lib/error.js';
import { logger } from '../lib/logger.js';

export const errorHandler: ErrorHandler = (err: Error, c: Context) => {
  if (err instanceof AppError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return c.json({ error: err.message }, err.statusCode as any);
  }

  // Handle unexpected errors (e.g. Prisma errors, Syntax errors, etc.)
  logger.error('[Global Error Handler]', err);
  return c.json({ error: 'An unexpected internal server error occurred.' }, 500);
};
