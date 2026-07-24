/**
 * Publisher Resolver — real HTML <head> icon extraction plus a one-time
 * download, so a publisher's logo is fetched ONCE and reused forever after.
 * Ported from the old ainews-mod8 app's ingestion/logoResolver.ts.
 *
 *   1. Fetch the publisher's homepage.
 *   2. Parse every icon-shaped <link> in <head> (icon, shortcut icon,
 *      apple-touch-icon, apple-touch-icon-precomposed, mask-icon) plus the
 *      web app manifest's `icons` array, if any.
 *   3. Score every candidate by resolution — SVGs always win (infinite
 *      resolution), otherwise by declared `sizes="WxH"` — and pick the best.
 *   4. Download the actual image bytes and upload them to Cloudinary.
 *   5. Return the secure_url Cloudinary hands back. Nothing is ever
 *      fetched again for that domain.
 *
 * Storage: uploads go straight to Cloudinary over its plain HTTP API (not
 * the `cloudinary` npm SDK — that package shells out to node:fs/streams,
 * which don't exist in the Workers half of this pipeline). A signed
 * upload (SHA-1 of the sorted params + api_secret, via Web Crypto — the
 * same API works in both Workers and plain Node, unlike node:crypto)
 * avoids needing an unsigned upload preset. Everything else — the icon
 * discovery/scoring logic, the bot-protection skip-list — is unchanged.
 */
import * as cheerio from "cheerio";
import { slugify } from "./normalize.js";
import { logger } from "../../lib/logger.js";

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

const DEBUG = false;
function debug(msg: string): void {
  if (DEBUG) logger.debug(`  [logo-debug] ${msg}`);
}

interface IconCandidate {
  url: string;
  score: number;
}

function sizeToScore(sizesAttr: string | undefined, isSvg: boolean): number {
  if (isSvg) return 1_000_000_000; // vector — infinitely scalable, always outranks any finite raster size
  if (!sizesAttr || sizesAttr === "any") return 48; // unspecified raster icon, assume small
  const match = /(\d+)x(\d+)/i.exec(sizesAttr);
  if (!match) return 48;
  return Number(match[1]) * Number(match[2]);
}

function resolveUrl(href: string, base: string): string | null {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

/** Every icon-shaped <link> in <head>, scored by resolution. */
function extractHeadIcons(html: string, pageUrl: string): IconCandidate[] {
  const $ = cheerio.load(html);
  const candidates: IconCandidate[] = [];

  $("link").each((_, el) => {
    const rel = ($(el).attr("rel") || "").toLowerCase();
    if (!/\bicon\b/.test(rel)) return;
    const href = $(el).attr("href");
    if (!href) return;
    const url = resolveUrl(href, pageUrl);
    if (!url) return;
    const type = ($(el).attr("type") || "").toLowerCase();
    const isSvg = type.includes("svg") || url.toLowerCase().endsWith(".svg");
    candidates.push({ url, score: sizeToScore($(el).attr("sizes"), isSvg) });
  });

  return candidates;
}

/** The web app manifest's `icons` array, same scoring approach. */
async function extractManifestIcons(html: string, pageUrl: string): Promise<IconCandidate[]> {
  const $ = cheerio.load(html);
  const manifestHref = $('link[rel="manifest"]').attr("href");
  if (!manifestHref) return [];
  const manifestUrl = resolveUrl(manifestHref, pageUrl);
  if (!manifestUrl) return [];

  try {
    const res = await fetch(manifestUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const manifest = (await res.json()) as { icons?: { src: string; sizes?: string; type?: string }[] };
    if (!Array.isArray(manifest.icons)) return [];

    return manifest.icons
      .map((icon) => {
        const url = resolveUrl(icon.src, manifestUrl);
        if (!url) return null;
        const isSvg = (icon.type || "").includes("svg") || url.toLowerCase().endsWith(".svg");
        return { url, score: sizeToScore(icon.sizes, isSvg) };
      })
      .filter((c): c is IconCandidate => c !== null);
  } catch {
    return [];
  }
}

/** Hex-encoded SHA-1 via Web Crypto — works unchanged in both Workers and plain Node (unlike node:crypto). */
async function sha1Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Signed Cloudinary upload. Params to sign must be alphabetically sorted,
 * joined as key=value pairs (no URL-encoding), with the api_secret appended
 * directly before hashing — see
 * https://cloudinary.com/documentation/authentication_signatures.
 */
async function uploadToCloudinary(cloudinary: CloudinaryConfig, bytes: ArrayBuffer, contentType: string | null, domain: string): Promise<string | null> {
  const publicId = `publishers/${slugify(domain)}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `overwrite=true&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = await sha1Hex(paramsToSign + cloudinary.apiSecret);

  const form = new FormData();
  form.append("file", new Blob([bytes], { type: contentType ?? "application/octet-stream" }));
  form.append("api_key", cloudinary.apiKey);
  form.append("timestamp", String(timestamp));
  form.append("public_id", publicId);
  form.append("overwrite", "true");
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    debug(`  cloudinary upload -> HTTP ${res.status} ${await res.text().catch(() => "")}`);
    return null;
  }
  const data = (await res.json()) as { secure_url?: string };
  return data.secure_url ?? null;
}

/** Downloads the chosen icon and uploads it to Cloudinary, returning the hosted secure_url. */
async function downloadAndStore(cloudinary: CloudinaryConfig, url: string, domain: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000), headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      debug(`  download candidate ${url} -> HTTP ${res.status} ${res.statusText}`);
      return null;
    }
    const bytes = await res.arrayBuffer();
    if (bytes.byteLength < 32) {
      debug(`  download candidate ${url} -> only ${bytes.byteLength} bytes, rejected as suspiciously tiny`);
      return null; // suspiciously tiny — likely a broken/placeholder response
    }

    const contentType = res.headers.get("content-type");
    const hosted = await uploadToCloudinary(cloudinary, bytes, contentType, domain);
    if (!hosted) {
      debug(`  download candidate ${url} -> Cloudinary upload failed`);
      return null;
    }

    debug(`  download candidate ${url} -> HTTP ${res.status}, ${bytes.byteLength} bytes, content-type ${contentType} -> ${hosted}`);
    return hosted;
  } catch (err) {
    debug(`  download candidate ${url} -> exception: ${(err as Error).name}: ${(err as Error).message}`);
    return null;
  }
}

/**
 * Domains verified (via debug logging during the old app's development) to
 * sit behind enterprise bot protection that a plain fetch() cannot pass —
 * DataDome (Reuters), Vercel Security Checkpoint (VentureBeat), Cloudflare/
 * WAF 403s (The Information, Fast Company, Axios, WSJ, FT, ghacks.net,
 * techdirt.com). These aren't timeouts or missing-icon cases a retry would
 * fix, so we skip straight to the favicon-aggregator fallback (see
 * publisherRegistry.ts) instead of burning a 10s timeout on every ingestion
 * run.
 */
const KNOWN_BOT_PROTECTED_DOMAINS = new Set([
  "reuters.com",
  "venturebeat.com",
  "theinformation.com",
  "fastcompany.com",
  "axios.com",
  "wsj.com",
  "ft.com",
  "whbl.com",
  "ghacks.net",
  "techdirt.com",
]);

/**
 * Full resolver: fetch the publisher's homepage once, parse every declared
 * icon source (head links + manifest), pick the highest-resolution
 * candidate, download it, and upload it to Cloudinary. Returns null if
 * every step fails — the caller falls back to a live favicon/aggregator
 * URL rather than hard-failing publisher creation.
 */
export async function resolvePublisherLogo(cloudinary: CloudinaryConfig, domain: string, homepageUrlOverride?: string): Promise<string | null> {
  if (!homepageUrlOverride && KNOWN_BOT_PROTECTED_DOMAINS.has(domain)) {
    debug(`skipping fetch for ${domain} — known bot-protected domain, going straight to fallback`);
    return null;
  }

  const homepageUrl = homepageUrlOverride ?? `https://${domain}/`;
  debug(`fetching homepage: ${homepageUrl}`);

  let html: string;
  try {
    const res = await fetch(homepageUrl, {
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (res.redirected) debug(`  redirected to: ${res.url}`);
    if (!res.ok) {
      debug(`  homepage fetch -> HTTP ${res.status} ${res.statusText}`);
      return null;
    }
    html = await res.text();
    debug(`  homepage fetch -> HTTP ${res.status}, ${html.length} chars of HTML`);
  } catch (err) {
    debug(`  homepage fetch -> exception: ${(err as Error).name}: ${(err as Error).message}`);
    return null;
  }

  const effectiveUrl = homepageUrl;
  const [headIcons, manifestIcons] = await Promise.all([Promise.resolve(extractHeadIcons(html, effectiveUrl)), extractManifestIcons(html, effectiveUrl)]);
  debug(`  found ${headIcons.length} <head> icon link(s), ${manifestIcons.length} manifest icon(s)`);

  const all = [...headIcons, ...manifestIcons].sort((a, b) => b.score - a.score);
  if (all.length === 0) {
    debug(`  no declared icons at all — falling back to /favicon.ico`);
    all.push({ url: `https://${domain}/favicon.ico`, score: 0 });
  }

  for (const candidate of all) {
    const stored = await downloadAndStore(cloudinary, candidate.url, domain);
    if (stored) {
      debug(`  chosen icon: ${candidate.url} (score ${candidate.score})`);
      return stored;
    }
  }

  debug(`  all ${all.length} candidate(s) failed — giving up`);
  return null;
}
