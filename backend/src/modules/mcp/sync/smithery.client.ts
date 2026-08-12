// ============================================================
// Smithery API Client
// ============================================================

import type {
  SmitheryServerDetail,
  SmitheryListResponse,
  SmitheryClientConfig,
} from './types.js';
import { DEFAULT_SMITHERY_CLIENT_CONFIG } from './types.js';

export class SmitheryClient {
  private config: SmitheryClientConfig;

  constructor(config?: Partial<SmitheryClientConfig>) {
    this.config = { ...DEFAULT_SMITHERY_CLIENT_CONFIG, ...config };
  }

  // ----------------------------------------------------------
  // Paginated list
  // ----------------------------------------------------------
  async listServers(page: number, pageSize: number): Promise<SmitheryListResponse> {
    const url = new URL('/servers', this.config.baseUrl);
    url.searchParams.set('page', String(page));
    url.searchParams.set('pageSize', String(pageSize));
    url.searchParams.set('verified', 'true');

    const res = await this.fetchWithRetry(url);
    return (await res.json()) as SmitheryListResponse;
  }

  // ----------------------------------------------------------
  // Single server detail
  // ----------------------------------------------------------
  async getServer(qualifiedName: string): Promise<SmitheryServerDetail> {
    // qualifiedName = "namespace/server" or just "server"
    const path = qualifiedName.includes('/')
      ? `/servers/${qualifiedName}`
      : `/servers/${qualifiedName}`;
    const url = new URL(path, this.config.baseUrl);

    const res = await this.fetchWithRetry(url);
    return (await res.json()) as SmitheryServerDetail;
  }

  // ----------------------------------------------------------
  // Fetch with retry + exponential backoff
  // ----------------------------------------------------------
  private async fetchWithRetry(url: URL): Promise<Response> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.config.timeout);

        const res = await fetch(url.toString(), {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (res.ok) return res;

        if (res.status === 429 || res.status >= 500) {
          const retryAfter = res.headers.get('retry-after');
          const waitMs = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : this.backoffMs(attempt);
          console.warn(
            `[smithery-client] ${res.status} ${res.statusText} for ${url.pathname} — retrying in ${waitMs}ms (attempt ${attempt + 1}/${this.config.maxRetries})`
          );
          await this.sleep(waitMs);
          lastError = new Error(`HTTP ${res.status}: ${res.statusText}`);
          continue;
        }

        throw new Error(`Smithery API error: ${res.status} ${res.statusText}`);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          console.warn(
            `[smithery-client] timeout for ${url.pathname} — attempt ${attempt + 1}/${this.config.maxRetries}`
          );
          await this.sleep(this.backoffMs(attempt));
          lastError = new Error(`Timeout fetching ${url.pathname}`);
          continue;
        }
        throw err;
      }
    }

    throw lastError ?? new Error(`Failed after ${this.config.maxRetries} retries`);
  }

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------
  private backoffMs(attempt: number): number {
    const exp = Math.min(attempt, 10);
    const base = this.config.initialBackoffMs * Math.pow(2, exp);
    return Math.min(base, this.config.maxBackoffMs);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
