import { Context } from 'hono';
import type { ErrorHandler } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import { AppError } from '../lib/error.js';
import { logger } from '../lib/logger.js';

export const errorHandler: ErrorHandler = (err: Error, c: Context) => {
  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.statusCode as StatusCode);
  }

  // Handle unexpected errors (e.g. Prisma errors, Syntax errors, etc.)
  logger.error('[Global Error Handler]', err);
  return c.json({ error: 'An unexpected internal server error occurred.' }, 500);
};
