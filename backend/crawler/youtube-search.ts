const API_BASE = "https://www.googleapis.com/youtube/v3";

/**
 * No channel whitelist. Discovery is keyword-driven — anything on YouTube
 * matching these AI-related queries is a candidate. New creators/channels
 * surface automatically as they publish relevant content; nothing here
 * needs to be updated when a new channel starts posting AI content.
 *
 * Override at runtime with YOUTUBE_SEARCH_QUERIES="q1|q2|q3" (pipe-separated)
 * without a code change/redeploy.
 */
const DEFAULT_QUERIES = [
  "multimodal AI",
  "vision language model",
  "text to video AI",
  "AI image generation model",
  "any-to-any model AI",
  "large language model",
  "AI agent",
  "autonomous agents AI",
  "new AI model release",
  "open source AI model", 
  "AI assistants",
  "autonomous AI agents",
  "agentic AI",
  "agentic workflows",
  "multi agent systems",
  "tool calling",
  "function calling",
  "Model Context Protocol",
  "MCP server",
  "MCP tools",
  "AI integrations",
  "memory in AI agents",
  "planning AI agents",
];

function getQueries(): string[] {
  const override = process.env.YOUTUBE_SEARCH_QUERIES;
  const full =
    override && override.trim().length > 0
      ? override.split("|").map((q) => q.trim()).filter(Boolean)
      : DEFAULT_QUERIES;

  const batchSize = Number(process.env.YOUTUBE_SEARCH_QUERY_BATCH_SIZE ?? 0);
  // 0 (default) = use every query every run, same as before. Set this to
  // rotate a subset per run instead — e.g. batchSize=8 with 24 total
  // queries means each run only spends 8x100=800 quota units instead of
  // 2400, and a scheduled job running every few hours cycles through the
  // full list across the day for the same total coverage.
  if (batchSize <= 0 || batchSize >= full.length) return full;

  // Deterministic rotation based on wall-clock time, no state to persist:
  // every ~N hours (window size = 24h / number of batches) picks a
  // different slice, so back-to-back runs within the same window return
  // the same slice (harmless — dedup in store.ts skips repeats) while
  // spaced-out scheduled runs naturally cycle through everything.
  const batchCount = Math.ceil(full.length / batchSize);
  const windowMs = 86400000 / batchCount;
  const windowIndex = Math.floor(Date.now() / windowMs) % batchCount;
  const start = windowIndex * batchSize;

  return full.slice(start, start + batchSize);
}

function apiKey() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  return key;
}

/** How far back to search on each run. Keeps the pool fresh + bounded. */
function publishedAfterIso(): string {
  const days = Number(process.env.PUBLISHED_AFTER_DAYS ?? 14);
  return new Date(Date.now() - days * 86400000).toISOString();
}

export type DiscoveredVideo = { videoId: string; publishedAt: string };

/**
 * Open crawl of YouTube via the Data API's search.list, across the whole
 * platform — not limited to any fixed channel list. Replaces the old
 * "only these 14 channels" model with "anything matching these AI terms".
 */
export async function discoverVideos(): Promise<DiscoveredVideo[]> {
  const key = apiKey();
  const publishedAfter = publishedAfterIso();
  const seen = new Map<string, DiscoveredVideo>();

  for (const q of getQueries()) {
    let pageToken: string | undefined;
    let pagesFetched = 0;
    const maxPages = Number(process.env.YOUTUBE_SEARCH_MAX_PAGES ?? 1); // 1 page (~25 results) per query by default

    do {
      const params = new URLSearchParams({
        part: "snippet",
        type: "video",
        order: "date",
        maxResults: "25",
        q,
        publishedAfter,
        key,
      });
      if (pageToken) params.set("pageToken", pageToken);

      const url = `${API_BASE}/search?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error(`[youtube-search] search.list failed for "${q}": ${res.status} ${body.slice(0, 400)}`);
        // Quota exhausted (daily 10k units, or per-100s burst) — every
        // remaining query will fail identically, so stop burning API calls
        // and log the useful part just once.
        if (res.status === 403 || res.status === 429) {
          if (/quotaExceeded|rateLimitExceeded|userRateLimitExceeded/i.test(body)) {
            console.error("[youtube-search] YouTube API quota exhausted — stopping discovery for this run");
            return [...seen.values()];
          }
        }
        break;
      }
      const json = await res.json();

      for (const item of json.items ?? []) {
        const id = item.id?.videoId;
        if (id && !seen.has(id)) {
          seen.set(id, { videoId: id, publishedAt: item.snippet.publishedAt });
        }
      }

      pageToken = json.nextPageToken;
      pagesFetched += 1;
    } while (pageToken && pagesFetched < maxPages);
  }

  return [...seen.values()];
}