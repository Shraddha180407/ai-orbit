import { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { Prisma } from '@prisma/client';

export interface APIError {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export class MCPError extends Error {
  constructor(
    message: string,
    public code: string = 'INTERNAL_ERROR',
    public statusCode: ContentfulStatusCode = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

export const createErrorResponse = (error: string, code?: string, details?: unknown): APIError => ({
  success: false,
  error,
  code,
  details,
});

export const errorHandler = (error: Error, c: Context) => {
  console.error('MCP Error:', error);

  if (error instanceof MCPError) {
    return c.json(
      createErrorResponse(error.message, error.code, error.details),
      error.statusCode
    );
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      return c.json(
        createErrorResponse('Resource already exists', 'DUPLICATE_ENTRY'),
        409
      );
    }
    if (error.code === 'P2025') {
      // Record not found
      return c.json(
        createErrorResponse('Resource not found', 'NOT_FOUND'),
        404
      );
    }
  }

  // Handle validation errors
  if (error.name === 'ZodError') {
    return c.json(
      createErrorResponse('Invalid request data', 'VALIDATION_ERROR', error.message),
      400
    );
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return c.json(
      createErrorResponse('Invalid token', 'INVALID_TOKEN'),
      401
    );
  }

  if (error.name === 'TokenExpiredError') {
    return c.json(
      createErrorResponse('Token expired', 'TOKEN_EXPIRED'),
      401
    );
  }

  // Default error
  return c.json(
    createErrorResponse('Internal server error', 'INTERNAL_ERROR'),
    500
  );
};

type Handler = (c: Context) => Promise<Response>;

export const asyncHandler = (fn: Handler) => {
  return (c: Context) => {
    return fn(c).catch((error: Error) => errorHandler(error, c));
  };
};