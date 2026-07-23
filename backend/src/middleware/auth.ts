import { createMiddleware } from 'hono/factory';

type Bindings = {
  INGESTION_TOKEN: string;
};

/**
 * Hono middleware to enforce ingestion authentication.
 * Checks the Authorization header against the configured INGESTION_TOKEN.
 * Fails safely if the environment is missing the INGESTION_TOKEN.
 */
export const requireIngestionToken = createMiddleware<{
  Bindings: Bindings;
}>(async (c, next) => {
  const ingestionToken = c.env.INGESTION_TOKEN;

  if (!ingestionToken) {
    console.error('INGESTION_TOKEN is not configured in the environment variables');
    return c.json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Authorization is misconfigured on the server',
    }, 500);
  }

  const authHeader = c.req.header('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      error: 'UNAUTHORIZED',
      message: 'Missing or invalid authentication token',
    }, 401);
  }

  const token = authHeader.substring(7).trim();
  if (token !== ingestionToken) {
    return c.json({
      error: 'FORBIDDEN',
      message: 'Invalid ingestion privileges',
    }, 403);
  }

  await next();
});
