import type { Video } from "./types.js";
import { categorize, isLikelyAiRelated } from "./categorize.js";
import { logger } from "./logger.js";

const API_BASE = "https://www.googleapis.com/youtube/v3";

function apiKey() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  return key;
}

function parseIsoDuration(iso: string | undefined | null): number {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

export const MIN_DURATION_SECONDS = 120; // drop Shorts / sub-2-minute clips

/**
 * Unicode ranges for non-Latin scripts. Used as a fallback signal when
 * YouTube doesn't report defaultAudioLanguage/defaultLanguage (very common
 * — most uploaders never set it), since we can't call a translation/
 * language-detection API per video without adding real cost and latency.
 */
const NON_LATIN_SCRIPT_RE =
  // eslint-disable-next-line no-misleading-character-class
  /[\u0400-\u04FF\u0600-\u06FF\u0900-\u097F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\u0E00-\u0E7F\u0590-\u05FF\u0530-\u058F\u10A0-\u10FF]/g;

/**
 * True if the video is very likely English. Prefers YouTube's own language
 * metadata when present (reliable); falls back to a lightweight script
 * heuristic on the title when it's not (common, since most uploaders never
 * set defaultAudioLanguage/defaultLanguage).
 */
export function isLikelyEnglish(
  title: string,
  description: string,
  defaultAudioLanguage?: string | null,
  defaultLanguage?: string | null
): boolean {
  const declared = defaultAudioLanguage ?? defaultLanguage;
  if (declared) return declared.toLowerCase().startsWith("en");

  const text = `${title} ${description}`;
  const letters = text.replace(/[^\p{L}]/gu, "");
  if (letters.length === 0) return true; // nothing to judge, don't wrongly drop it

  const nonLatinCount = (text.match(NON_LATIN_SCRIPT_RE) ?? []).length;
  return nonLatinCount / letters.length < 0.15; // mostly Latin script -> treat as English
}

function slugify(title: string, videoId: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base}-${videoId.slice(0, 6)}`;
}

const ACCENTS = ["#5e6ad2", "#d85a30", "#1d9e75", "#d4537e", "#378add", "#ba7517", "#639922", "#7f77dd"];
function accentFor(videoId: string) {
  const hash = videoId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ACCENTS[hash % ACCENTS.length];
}

/**
 * Turns discovered video IDs into full metadata records. Category and
 * AI-relevance are both determined locally via keyword matching
 * (see categorize.ts) — no LLM call. Videos that don't clear the basic
 * AI-relevance floor are dropped here (search.list results are loose and
 * sometimes return unrelated videos even for AI-specific queries).
 */
export async function enrichVideos(videoIds: string[]): Promise<Video[]> {
  const results: Video[] = [];

  const batches: string[][] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    batches.push(videoIds.slice(i, i + 50));
  }

  for (const batch of batches) {
    const url = `${API_BASE}/videos?part=snippet,contentDetails,statistics&id=${batch.join(
      ","
    )}&key=${apiKey()}`;
    const res = await fetch(url);
    if (!res.ok) {
      logger.error(`[youtube-enrich] videos.list failed: ${res.status}`);
      continue;
    }
    const json = await res.json();

    for (const item of json.items ?? []) {
      // Deleted/private/region-restricted videos sometimes come back with
      // a partial object (no snippet at all) — skip those outright.
      if (!item.snippet) continue;

      const title: string = item.snippet.title ?? "";
      const videoId: string = item.id;
      const description: string = item.snippet.description ?? "";

      if (!isLikelyAiRelated(title, description)) continue;

      const durationSeconds = parseIsoDuration(item.contentDetails?.duration);
      if (durationSeconds > 0 && durationSeconds < MIN_DURATION_SECONDS) continue; // Shorts / <2min

      if (
        !isLikelyEnglish(
          title,
          description,
          item.snippet.defaultAudioLanguage,
          item.snippet.defaultLanguage
        )
      ) {
        continue;
      }

      const toolCategory = categorize(title, description);

      results.push({
        id: videoId,
        slug: slugify(title, videoId),
        title,
        description,
        toolName: item.snippet.channelTitle ?? "Unknown",
        toolCategory,
        youtubeId: videoId,
        thumbnail:
          // maxres is intentionally excluded: YouTube's API sometimes
          // reports a maxres thumbnail in metadata even when the file
          // doesn't actually exist at that URL, causing 404s downstream.
          // high/default are reliably present for every video.
          item.snippet.thumbnails?.high?.url ??
          item.snippet.thumbnails?.default?.url ??
          "",
        // contentDetails can be missing (live streams, some restricted
        // videos) — parseIsoDuration handles undefined/null safely.
        durationSeconds,
        views: Number(item.statistics?.viewCount ?? 0),
        likes: Number(item.statistics?.likeCount ?? 0),
        publishedAt: (item.snippet.publishedAt ?? new Date().toISOString()).slice(0, 10),
        author: {
          name: item.snippet.channelTitle ?? "Unknown",
          avatar: (item.snippet.channelTitle ?? "??").slice(0, 2).toUpperCase(),
        },
        channelId: item.snippet.channelId ?? null,
        tags: [toolCategory],
        accent: accentFor(videoId),
      });
    }
  }

  return results;
}