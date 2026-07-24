import { Context } from 'hono';
import type { ErrorHandler } from 'hono';
import { AppError } from '../lib/error.js';

export const errorHandler: ErrorHandler = (err: Error, c: Context) => {
  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.statusCode as any);
  }

  // Handle unexpected errors (e.g. Prisma errors, Syntax errors, etc.)
  console.error('[Global Error Handler]', err);
  return c.json({ error: 'An unexpected internal server error occurred.' }, 500);
};
