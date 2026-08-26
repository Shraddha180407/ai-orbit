import type { MiddlewareHandler } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

interface CacheEntry {
  body: string;
  status: number;
  headers: Record<string, string>;
  expiresAt: number;
}

// In-memory cache map for high-frequency GET queries (5 minutes TTL by default)
const memoryCache = new Map<string, CacheEntry>();
const MAX_CACHE_ENTRIES = 2000;

export function invalidateCache(pattern?: string | RegExp) {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)) {
      memoryCache.delete(key);
    }
  }
}

/**
 * High-performance in-memory cache middleware for Hono GET endpoints.
 * Returns cached responses in < 1ms, dramatically reducing database load
 * and eliminating loading delays for the frontend.
 */
export function cacheMiddleware(ttlSeconds = 300): MiddlewareHandler {
  return async (c, next) => {
    // Only cache GET requests
    if (c.req.method !== 'GET') {
      // Invalidate cache on mutations (POST, PUT, PATCH, DELETE)
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(c.req.method)) {
        const path = c.req.path;
        if (path.includes('/tools')) invalidateCache('tools');
        else if (path.includes('/companies')) invalidateCache('companies');
        else if (path.includes('/models')) invalidateCache('models');
        else if (path.includes('/repositories')) invalidateCache('repositories');
        else if (path.includes('/robots')) invalidateCache('robots');
        else if (path.includes('/devices')) invalidateCache('devices');
        else if (path.includes('/tasks')) invalidateCache('tasks');
        else if (path.includes('/news')) invalidateCache('news');
        else if (path.includes('/videos')) invalidateCache('videos');
        else if (path.includes('/mcps')) invalidateCache('mcps');
        else if (path.includes('/collections')) invalidateCache('collections');
      }
      return next();
    }

    // Do not cache authenticated or private user routes
    const path = c.req.path;
    const isPrivate = (
      path.startsWith('/api/auth') ||
      path.startsWith('/api/user') ||
      path.startsWith('/api/admin') ||
      path.includes('/user/') ||
      path.includes('/bookmarks') ||
      path.includes('/favorites') ||
      path.includes('/personal/user')
    );

    if (isPrivate) {
      c.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return next();
    }

    const cacheKey = `${c.req.url}`;
    const now = Date.now();
    const cached = memoryCache.get(cacheKey);

    if (cached && cached.expiresAt > now) {
      c.header('X-Cache', 'HIT');
      c.header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      for (const [k, v] of Object.entries(cached.headers)) {
        if (k.toLowerCase() !== 'content-length' && k.toLowerCase() !== 'cache-control') {
          c.header(k, v);
        }
      }
      return c.newResponse(cached.body, cached.status as StatusCode);
    }

    // Cache miss - execute handler
    await next();

    // Only cache successful JSON responses
    if (c.res.status === 200) {
      try {
        const cloned = c.res.clone();
        const body = await cloned.text();

        // Evict oldest if capacity reached (LRU eviction)
        if (memoryCache.size >= MAX_CACHE_ENTRIES) {
          const firstKey = memoryCache.keys().next().value;
          if (firstKey) memoryCache.delete(firstKey);
        }

        const headers: Record<string, string> = {
          'Content-Type': c.res.headers.get('Content-Type') || 'application/json',
        };

        memoryCache.set(cacheKey, {
          body,
          status: c.res.status,
          headers,
          expiresAt: now + ttlSeconds * 1000,
        });

        c.header('X-Cache', 'MISS');
        c.header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      } catch {
        // Continue normally if caching fails
      }
    }
  };
}
