/**
 * Local high-speed client-side cache engine with Stale-While-Revalidate (SWR),
 * in-flight request deduplication, and persistent storage support.
 * Serves responses in 0ms to ensure instant page and component loading.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();
const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds default TTL
const MAX_MEMORY_ENTRIES = 500;
const STORAGE_PREFIX = "aiorbit_cache_";

/** Check if window and localStorage/sessionStorage are available */
const isBrowser = typeof window !== "undefined";

function getStorage(): Storage | null {
  if (!isBrowser) return null;
  try {
    return window.sessionStorage || window.localStorage;
  } catch {
    return null;
  }
}

function isEmptyPayload(data: any): boolean {
  if (data === null || data === undefined) return true;
  if (Array.isArray(data) && data.length === 0) return true;
  if (typeof data === "object") {
    if (Array.isArray(data.companies) && data.companies.length === 0) return true;
    if (Array.isArray(data.tools) && data.tools.length === 0) return true;
    if (Array.isArray(data.agents) && data.agents.length === 0) return true;
    if (Array.isArray(data.items) && data.items.length === 0) return true;
    if (data.total === 0 && (!data.items || data.items.length === 0)) return true;
  }
  return false;
}

/** Retrieve item from memory or persistent session storage */
export function getFromCache<T>(key: string): T | null {
  const now = Date.now();
  const entry = memoryCache.get(key);

  if (entry) {
    if (entry.expiresAt > now && !isEmptyPayload(entry.data)) {
      return entry.data as T;
    }
    memoryCache.delete(key);
  }

  // Check persistent storage fallback
  const storage = getStorage();
  if (storage) {
    try {
      const raw = storage.getItem(STORAGE_PREFIX + key);
      if (raw) {
        const parsed: CacheEntry<T> = JSON.parse(raw);
        if (parsed && parsed.expiresAt > now && !isEmptyPayload(parsed.data)) {
          memoryCache.set(key, parsed);
          return parsed.data;
        }
        storage.removeItem(STORAGE_PREFIX + key);
      }
    } catch {
      // Ignore storage errors
    }
  }

  return null;
}

/** Save item to memory and persistent session storage */
export function setInCache<T>(key: string, data: T, ttlMs = DEFAULT_TTL_MS): void {
  if (isEmptyPayload(data)) return;

  const now = Date.now();
  const entry: CacheEntry<T> = {
    data,
    timestamp: now,
    expiresAt: now + ttlMs,
  };

  // LRU eviction if capacity reached
  if (memoryCache.size >= MAX_MEMORY_ENTRIES) {
    const oldestKey = memoryCache.keys().next().value;
    if (oldestKey) memoryCache.delete(oldestKey);
  }

  memoryCache.set(key, entry);

  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
    } catch {
      // Storage might be full, ignore gracefully
    }
  }
}

/** Invalidate cache entries by prefix or exact match */
export function invalidateClientCache(pattern?: string | RegExp): void {
  if (!pattern) {
    memoryCache.clear();
    const storage = getStorage();
    if (storage) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < storage.length; i++) {
          const k = storage.key(i);
          if (k && k.startsWith(STORAGE_PREFIX)) keysToRemove.push(k);
        }
        keysToRemove.forEach((k) => storage.removeItem(k));
      } catch {}
    }
    return;
  }

  for (const key of memoryCache.keys()) {
    if (typeof pattern === "string" ? key.includes(pattern) : pattern.test(key)) {
      memoryCache.delete(key);
      const storage = getStorage();
      if (storage) {
        try {
          storage.removeItem(STORAGE_PREFIX + key);
        } catch {}
      }
    }
  }
}

export interface CachedFetchOptions {
  ttlMs?: number;
  forceRefresh?: boolean;
  swr?: boolean; // Stale-while-revalidate flag (defaults to true)
}

/**
 * Universal cached fetch helper with 0ms instant response on cache hit,
 * in-flight request deduplication, and background revalidation.
 */
export async function cachedFetchJson<T>(
  url: string | URL,
  fallback: T,
  options: CachedFetchOptions = {}
): Promise<T> {
  const urlStr = url.toString();
  const { ttlMs = DEFAULT_TTL_MS, forceRefresh = false, swr = true } = options;

  if (!forceRefresh) {
    const cached = getFromCache<T>(urlStr);
    if (cached !== null) {
      // If SWR is enabled and cache entry is older than half TTL, trigger silent background revalidation
      if (swr && isBrowser) {
        const entry = memoryCache.get(urlStr);
        if (entry && Date.now() - entry.timestamp > ttlMs / 2) {
          // Silent background revalidation
          performFetch<T>(urlStr, fallback, ttlMs).catch(() => {});
        }
      }
      return cached;
    }
  }

  // Deduplicate in-flight requests for identical URLs
  if (inFlightRequests.has(urlStr)) {
    return inFlightRequests.get(urlStr) as Promise<T>;
  }

  const promise = performFetch<T>(urlStr, fallback, ttlMs).finally(() => {
    inFlightRequests.delete(urlStr);
  });

  inFlightRequests.set(urlStr, promise);
  return promise;
}

async function performFetch<T>(urlStr: string, fallback: T, ttlMs: number): Promise<T> {
  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), urlStr.includes(":8787") ? 2500 : 8000) : null;
    let res: Response;
    try {
      res = await fetch(urlStr, {
        signal: controller?.signal,
        headers: {
          Accept: "application/json",
        },
      });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }

    if (!res.ok) {
      if (urlStr.includes(":8787")) {
        const prodUrl = urlStr.replace(/https?:\/\/(localhost|127\.0\.0\.1):8787/, "https://ai-orbit.palamrendra-pm.workers.dev");
        try {
          const prodRes = await fetch(prodUrl, { headers: { Accept: "application/json" } });
          if (prodRes.ok) {
            const prodData = (await prodRes.json()) as T;
            setInCache(urlStr, prodData, ttlMs);
            return prodData;
          }
        } catch {}
      }
      const stale = getFromCache<T>(urlStr);
      if (stale !== null) return stale;
      return fallback;
    }

    const data = (await res.json()) as T;
    setInCache(urlStr, data, ttlMs);
    return data;
  } catch {
    if (urlStr.includes(":8787")) {
      const prodUrl = urlStr.replace(/https?:\/\/(localhost|127\.0\.0\.1):8787/, "https://ai-orbit.palamrendra-pm.workers.dev");
      try {
        const prodRes = await fetch(prodUrl, { headers: { Accept: "application/json" } });
        if (prodRes.ok) {
          const prodData = (await prodRes.json()) as T;
          setInCache(urlStr, prodData, ttlMs);
          return prodData;
        }
      } catch {}
    }
    const stale = getFromCache<T>(urlStr);
    if (stale !== null) return stale;
    return fallback;
  }
}

/** Prefetch a JSON endpoint into memory cache in background */
export function prefetchUrl(url: string | URL, ttlMs = DEFAULT_TTL_MS): void {
  if (!isBrowser) return;
  const urlStr = url.toString();
  if (getFromCache(urlStr) !== null || inFlightRequests.has(urlStr)) return;
  cachedFetchJson(urlStr, null, { ttlMs, swr: false }).catch(() => {});
}
