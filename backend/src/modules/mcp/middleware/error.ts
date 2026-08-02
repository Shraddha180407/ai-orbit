import { Context } from 'hono';

export interface APIError {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

export class MCPError extends Error {
  constructor(
    message: string,
    public code: string = 'INTERNAL_ERROR',
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

export const createErrorResponse = (error: string, code?: string, details?: any): APIError => ({
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
      error.statusCode as any
    );
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    if ((error as any).code === 'P2002') {
      // Unique constraint violation
      return c.json(
        createErrorResponse('Resource already exists', 'DUPLICATE_ENTRY'),
        409
      );
    }
    if ((error as any).code === 'P2025') {
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