import { PrismaClient } from '@prisma/client';

interface HuggingFaceModelStats {
  downloads: number;
  likes: number;
}

/**
 * Best-effort lookup against the Hugging Face Hub's public search API — no
 * auth required for reads. Only genuinely open-weight models (Llama,
 * Mistral, etc.) are hosted there at all — this is a fundamental ceiling,
 * not a matching-quality problem: proprietary API-only models (GPT-4,
 * Claude, Gemini) were never released as open weights, so no query or
 * matching logic will ever find them here. They correctly return null and
 * fall through to a different source (see fetchArenaScore below) rather
 * than this function trying harder. Never throws — a failed/timed-out
 * lookup just means "no real data available for this one," it doesn't
 * break the leaderboard.
 *
 * Matching requires the model name (most of it) to appear in a candidate's
 * HF id, AND either the creator or a distinctive word from the name itself
 * to appear in the candidate's org segment (see nameBrandInOrg below — real
 * orgs are sometimes the model's own brand, not the parent company, e.g.
 * Qwen models are hosted under org "Qwen", not "Alibaba"). Name alone isn't
 * enough: a short, generic name like "GPT-4" or "o1" will substring-match
 * some unrelated community repo (confirmed — an earlier, org-unchecked
 * version of this matched "GPT-4" to a real HF result that was obviously
 * not GPT-4). Also rejects a "match" whose downloads and likes are both
 * exactly 0 — a genuinely well-known open model on HF essentially always
 * has nonzero usage, so an all-zero result is a stronger signal of a bad
 * match than of a real-but-obscure one.
 */
async function fetchHuggingFaceModelStats(name: string, creator: string): Promise<HuggingFaceModelStats | null> {
  // "+" -> " Plus" — confirmed live that HF's search API returns ZERO
  // results for any query containing a literal "+" (e.g. "Command R+"),
  // even though the real repo exists and is trivially found by spelling
  // it out ("Command R Plus" correctly surfaces CohereLabs/c4ai-command-
  // r-plus, 2,283 downloads, 1,802 likes).
  const normalizedName = name.replace(/\+/g, ' Plus');

  // Name only, NOT "${creator} ${name}" — confirmed live that including the
  // creator in the query text actively hurts results: searching "Alibaba
  // Qwen2.5-72B-Instruct" returned zero results, while "Qwen2.5-72B-
  // Instruct" alone correctly surfaced the real Qwen/Qwen2.5-72B-Instruct
  // repo (654K downloads, 964 likes) as a top result. Creator is still used
  // below, just as a post-search validation signal, not query text.
  const query = normalizedName.trim();
  try {
    const res = await fetch(`https://huggingface.co/api/models?search=${encodeURIComponent(query)}&limit=8`, {
      signal: AbortSignal.timeout(6000),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const results = (await res.json()) as { id: string; downloads?: number; likes?: number }[];
    if (!Array.isArray(results) || results.length === 0) return null;

    // Keep single-digit/char tokens (unlike an earlier version of this
    // function) — version numbers like the "4" in "GPT-4" are exactly what
    // distinguishes it from a real, legitimately-on-HF sibling like GPT-2,
    // so dropping them as "too short" is what let GPT-4 falsely match
    // OpenAI's real openai-community/gpt2 repo (both contain "gpt";
    // without a length requirement on "4" vs "2" nothing tells them apart).
    const tokenize = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .split(' ')
        .filter(Boolean);

    const nameTokens = tokenize(normalizedName);
    const creatorTokens = tokenize(creator);
    if (nameTokens.length === 0 || creatorTokens.length === 0) return null;

    // Short/numeric tokens (version numbers like the "4" in "GPT-4") must
    // match a WHOLE token in the candidate id, not just appear as a
    // substring — confirmed necessary: a raw substring check let "4"
    // match inside "...gpt2-medium-4bits" (a GPT-2 quantization's bit
    // depth, nothing to do with a "4" in a model's version). Longer
    // alphabetic tokens still use substring matching, since real HF org
    // slugs commonly suffix the creator name (Mistral AI's org is
    // "mistralai", not "mistral") and a whole-token requirement there
    // would wrongly reject those. Short names (<=2 tokens, e.g. "GPT-4",
    // "o1") require ALL tokens to match — too few tokens for a 50%
    // threshold to mean anything, and short/generic names are exactly the
    // ones prone to over-matching. Longer, more distinctive names keep a
    // 50% bar.
    // Confirmed necessary: searching the base "Command R" (no "+") returns
    // CohereLabs/c4ai-command-r-plus as its TOP hit — a different, larger
    // model, not the base one — and nothing before this excluded it, so
    // "Command R"'s row was silently showing Command R+'s download/like
    // counts. "plus" is deliberately the only word excluded this way (not a
    // general variant-word list): it's the one confirmed case, and a
    // broader list risks wrongly excluding real matches that legitimately
    // carry an extra word in their HF repo id (e.g. "-Instruct" suffixes).
    const targetHasPlus = nameTokens.includes('plus');

    const isWholeTokenOnly = (t: string) => t.length <= 2 || /^\d+$/.test(t);
    const requiredNameMatches = nameTokens.length <= 2 ? nameTokens.length : Math.ceil(nameTokens.length * 0.5);
    const candidates = results.filter((r) => {
      const idNormalized = r.id.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
      const candidateTokens = idNormalized.split(' ').filter(Boolean);
      const tokenPresent = (t: string) => (isWholeTokenOnly(t) ? candidateTokens.includes(t) : idNormalized.includes(t));

      if (!targetHasPlus && candidateTokens.includes('plus')) return false;

      // Creator match, OR a distinctive word from the model's own name
      // matches the candidate's org segment specifically (bidirectional
      // substring — an org can be a prefix of, or contain, the token) —
      // confirmed necessary: Alibaba's real Qwen models are hosted under
      // the HF org "Qwen" (the model brand), not "Alibaba" (the parent
      // company), so a creator-only check rejects every genuine Qwen
      // match. Restricting this alternate path to the ORG segment only
      // (not the full id) keeps it from reopening the earlier GPT-4 bug —
      // "gpt" only ever appeared in the REPO half of the bad matches
      // (e.g. "openai-community/gpt2"), never in their ORG half.
      const org = r.id.split('/')[0].toLowerCase().replace(/[^a-z0-9]+/g, ' ');
      const creatorPresent = creatorTokens.some(tokenPresent);
      const nameBrandInOrg = nameTokens.some((t) => t.length > 2 && (org.includes(t) || t.includes(org)));
      if (!creatorPresent && !nameBrandInOrg) return false;

      const nameMatches = nameTokens.filter(tokenPresent).length;
      return nameMatches >= requiredNameMatches;
    });
    if (candidates.length === 0) return null;

    // Among everything that satisfies the token requirements, prefer the
    // most-used repo, not just the first one search happened to rank
    // highest — confirmed necessary: for "Qwen2.5-Coder-32B-Instruct" /
    // "Alibaba", a random user's 3-download fine-tune experiment (whose
    // filename happened to contain both "alibaba" and the full model
    // name) out-ranked the real Qwen/Qwen2.5-Coder-32B-Instruct repo.
    // Real, canonical models have real usage; a match with single-digit
    // downloads AND under 5 likes is almost certainly a wrong/noise match,
    // not a genuinely-real-but-obscure one, so it's rejected outright even
    // as the best of a bad set of candidates.
    const best = candidates.reduce((a, b) => ((b.downloads ?? 0) + (b.likes ?? 0) > (a.downloads ?? 0) + (a.likes ?? 0) ? b : a));
    const downloads = best.downloads ?? 0;
    const likes = best.likes ?? 0;
    if (downloads < 20 && likes < 5) return null;

    return { downloads, likes };
  } catch {
    return null;
  }
}

interface NpmToolStats {
  weeklyDownloads: number;
  growthPercent: number;
}

/**
 * Real usage data for Tools that are published npm packages, keyed by the
 * tool's own slug. An exact slug match is NOT proof of ownership, though —
 * live-verified: the unscoped npm package literally named "claude" is a
 * random dev's redirect script ("This is not the official Claude Code
 * package"), "cursor" is an unrelated buffer utility, "gemini" is a
 * screenshot-testing tool, "jasper" a template engine, "otter" a server
 * framework. npm's flat, unscoped namespace lets anyone register a short
 * consumer-brand word, so slug match alone produced ~37/116 false-positive
 * "matches" in testing before this guard was added. To trust a package's
 * download numbers as a tool's real usage data, its registry metadata
 * (homepage/repository/bugs URL) must reference the tool's own website
 * domain — the same "verify before trusting an exact-match API" lesson
 * the Hugging Face integration already applies via token/popularity
 * checks, adapted to npm's different (namespace-collision, not
 * fuzzy-search) failure mode. This tightened bar means it now covers only
 * a small slice of Tools (most AI products here are closed SaaS with no
 * npm package at all, official or otherwise), but every match it does
 * return is genuinely the tool's own package.
 *
 * Uses the downloads range endpoint (30 days of real daily counts) rather
 * than the simpler point endpoint specifically to compute a genuine
 * week-over-week growth percentage — a single downloads-this-week number
 * is a snapshot, not a trend, same limitation the Models integration has
 * for GitHub-style star counts. npm's range endpoint conveniently makes a
 * real trend computable from ONE request, no historical snapshot storage
 * needed.
 */
async function fetchNpmToolStats(slug: string, websiteDomain: string): Promise<NpmToolStats | null> {
  try {
    if (!websiteDomain) return null;

    const pkgRes = await fetch(`https://registry.npmjs.org/${encodeURIComponent(slug)}`, {
      signal: AbortSignal.timeout(8000),
    });
    // 404 means "not a real npm package" — not an error, just no data for
    // this tool. Every other non-ok status (5xx, etc.) also just means
    // "no real data available," same fail-open behavior as the HF lookup.
    if (!pkgRes.ok) return null;

    const pkg = (await pkgRes.json()) as {
      homepage?: string;
      repository?: { url?: string } | string;
      bugs?: { url?: string };
    };
    const repoUrl = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url || "";
    const links = `${pkg.homepage || ""} ${repoUrl} ${pkg.bugs?.url || ""}`.toLowerCase();

    // Official SDKs frequently link to their GitHub org instead of the
    // marketing site (verified live: the real, official "elevenlabs" npm
    // package's homepage is github.com/elevenlabs/elevenlabs-js, not
    // elevenlabs.io) — so also accept a GitHub org name that equals the
    // site's own brand keyword, not just a literal domain substring match.
    const domainKeyword = websiteDomain.split(".")[0].replace(/-/g, "");
    const githubOrgMatch = links.match(/github\.com\/([a-z0-9-]+)/);
    const githubOrgIsBrand = githubOrgMatch?.[1].replace(/-/g, "") === domainKeyword;

    if (!links.includes(websiteDomain.toLowerCase()) && !githubOrgIsBrand) return null;

    const res = await fetch(`https://api.npmjs.org/downloads/range/last-month/${encodeURIComponent(slug)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { downloads?: { downloads: number; day: string }[] };
    const days = data.downloads;
    if (!Array.isArray(days) || days.length < 14) return null;

    const lastWeek = days.slice(-7).reduce((sum, d) => sum + d.downloads, 0);
    const priorWeek = days.slice(-14, -7).reduce((sum, d) => sum + d.downloads, 0);
    if (lastWeek === 0) return null; // no real usage — don't report 0 as if it were meaningful real data

    const growthPercent = priorWeek === 0 ? 100 : ((lastWeek - priorWeek) / priorWeek) * 100;
    return { weeklyDownloads: lastWeek, growthPercent: parseFloat(growthPercent.toFixed(1)) };
  } catch {
    return null;
  }
}

/** Matches the K/M-suffix shorthand every other leaderboard row already uses for `visits`. */
function formatCompactCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

interface HnBuzzStats {
  mentions: number;
  growthPercent: number;
}

/**
 * Secondary, weaker fallback for Tools npm has no data for (most of them —
 * see fetchNpmToolStats' own comment on why npm coverage is inherently
 * thin). HN Algolia's search is full-text relevance search, not an
 * exact-match lookup, so a bare name query is unusable on its own —
 * live-verified: querying "Poe" mostly returns Edgar Allan Poe poetry
 * discussions, "Jasper" returns a stolen radio tower and an unrelated ISP
 * founder, "Otter" mixes in "Otter Wiki"/"Otter Browser"/a COBOL compiler
 * called Otterkit. Same false-positive shape as the ungated npm slug
 * lookup, so the same fix applies: only count a hit if its own linked
 * `url` domain matches the tool's real website domain — a submission
 * *of* the tool's own site, not just a story that happens to mention its
 * name.
 *
 * Real domain-matched HN mentions for a single product in a single week
 * are typically zero or one, even for well-known tools — a week-over-week
 * percentage computed on that few data points is noise (0→1 reads as
 * "new", 1→0 as "-100%", neither means anything), so a minimum 14-day
 * mention floor gates whether a percentage is reported at all, same
 * "don't report a trend you don't have the samples for" principle as the
 * npm and Hugging Face integrations.
 *
 * Hostname-only matching isn't enough, either — live-verified: a Tool
 * whose DB `websiteUrl` is a GitHub repo path (e.g. suno-ai/bark's
 * websiteUrl is github.com/suno-ai/bark, not a dedicated domain) matched
 * ANY HN story linking to ANY github.com/* URL, because github.com
 * itself is a shared host, not a distinctive domain. Same failure shape
 * for twitter.com/x.com, medium.com, huggingface.co, etc. Fixed by
 * comparing the full path prefix, not just the hostname, when the tool's
 * own URL has a meaningful path.
 */
async function fetchHnBuzzStats(name: string, toolUrl: string): Promise<HnBuzzStats | null> {
  try {
    const tool = new URL(toolUrl);
    const toolHost = tool.hostname.replace(/^www\./, "").toLowerCase();
    const toolPath = tool.pathname.replace(/\/+$/, "").toLowerCase();
    if (!toolHost) return null;

    const isOwnedUrl = (rawUrl?: string): boolean => {
      if (!rawUrl) return false;
      try {
        const u = new URL(rawUrl);
        const host = u.hostname.replace(/^www\./, "").toLowerCase();
        if (host !== toolHost) return false;
        // Root-domain tools (path "") match on hostname alone; tools living
        // at a path on a shared host must match that path too.
        return !toolPath || u.pathname.toLowerCase().startsWith(toolPath);
      } catch {
        return false;
      }
    };

    const now = Math.floor(Date.now() / 1000);
    const weekAgo = now - 7 * 86400;
    const twoWeeksAgo = now - 14 * 86400;
    const q = encodeURIComponent(name);

    const [lastWeekRes, priorWeekRes] = await Promise.all([
      fetch(`https://hn.algolia.com/api/v1/search?query=${q}&tags=story&numericFilters=created_at_i%3E${weekAgo}&hitsPerPage=50`, {
        signal: AbortSignal.timeout(8000),
      }),
      fetch(`https://hn.algolia.com/api/v1/search?query=${q}&tags=story&numericFilters=created_at_i%3E${twoWeeksAgo}%2Ccreated_at_i%3C${weekAgo}&hitsPerPage=50`, {
        signal: AbortSignal.timeout(8000),
      }),
    ]);
    if (!lastWeekRes.ok || !priorWeekRes.ok) return null;

    const [lastWeekData, priorWeekData] = (await Promise.all([lastWeekRes.json(), priorWeekRes.json()])) as [
      { hits?: { url?: string }[] },
      { hits?: { url?: string }[] },
    ];

    const countOwned = (hits?: { url?: string }[]) =>
      Array.isArray(hits) ? hits.filter((h) => isOwnedUrl(h.url)).length : 0;

    const lastWeek = countOwned(lastWeekData.hits);
    const priorWeek = countOwned(priorWeekData.hits);
    if (lastWeek + priorWeek < 3) return null; // too few real mentions to call it a trend

    const growthPercent = priorWeek === 0 ? 100 : ((lastWeek - priorWeek) / priorWeek) * 100;
    return { mentions: lastWeek, growthPercent: parseFloat(growthPercent.toFixed(1)) };
  } catch {
    return null;
  }
}

/**
 * Real, individually checked (via a live fetch, not guessed from memory)
 * model-family page per provider — every URL below was confirmed to
 * actually be that provider's genuine current page before being hardcoded
 * here. Deliberately per-provider, not per-model: AIModel has no
 * websiteUrl column, and giving each of the ~36 rows its own precise deep
 * link would need a schema migration for marginal benefit over "one real,
 * correct link per creator."
 */
const MODEL_PROVIDER_URLS: Record<string, string> = {
  openai: 'https://openai.com/api/',
  anthropic: 'https://claude.com/product/overview',
  meta: 'https://developer.meta.com/ai/',
  mistral: 'https://mistral.ai/models',
  google: 'https://deepmind.google/models/gemini/',
  xai: 'https://x.ai/grok',
  cohere: 'https://cohere.com/command',
  deepseek: 'https://www.deepseek.com/',
  ai21: 'https://www.ai21.com/jamba/',
  alibaba: 'https://qwen.ai/',
};

function resolveModelProviderUrl(creator: string): string {
  const c = creator.toLowerCase();
  for (const [key, url] of Object.entries(MODEL_PROVIDER_URLS)) {
    if (c.includes(key)) return url;
  }
  return MODEL_PROVIDER_URLS.openai;
}

function getServiceLogoUrl(name: string, domain: string): string {
  const n = name.toLowerCase().trim();
  if (n.includes("phind")) return "https://avatars.githubusercontent.com/u/144394874?v=4";
  if (n.includes("beatoven")) return "https://avatars.githubusercontent.com/u/85035121?v=4";
  if (n.includes("dreamstudio")) return "https://avatars.githubusercontent.com/u/100950301?v=4";
  if (n.includes("podcastle")) return "https://avatars.githubusercontent.com/u/19472846?v=4";
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export class LeaderboardService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listTools(category?: string) {
    const tools = await this.prisma.tool.findMany({
      include: {
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        bookmarks: true,
        reviews: true
      }
    });

    // Concurrent, not sequential — same reasoning as the Models/Hugging
    // Face lookup: one HTTP round-trip per tool would otherwise serialize
    // the whole request behind N npm calls.
    const toolDomains = tools.map((t) => extractDomain(t.websiteUrl));
    const npmStats = await Promise.all(tools.map((t, i) => fetchNpmToolStats(t.slug, toolDomains[i])));
    // HN Algolia is a weaker fallback signal than npm (see fetchHnBuzzStats'
    // own comment), so it's only queried for tools npm found nothing for —
    // no reason to spend the extra round-trip, or risk overriding, a
    // stronger real-usage number that's already been found.
    const hnStats = await Promise.all(
      tools.map((t, i) => (npmStats[i] ? null : fetchHnBuzzStats(t.name, t.websiteUrl)))
    );

    const mapped = tools.map((t, i) => {
      const catName = t.categories[0]?.category?.name || "Productivity";
      const tagList = t.tags.map(tg => tg.tag?.name).filter(Boolean).join(",");
      // Real fields, no fabricated padding — avgRating/reviews/bookmarks are
      // genuine denormalized/counted values from the DB (see schema.prisma's
      // comment on avgRating: "Recomputed by the reviews API on every
      // create/update/delete"), not something that needs a synthetic floor.
      const rating = t.avgRating;
      const votes = t.reviews.length;
      const saves = t.bookmarks.length;

      // Extract real domain from websiteUrl
      let domain = "";
      try {
        domain = new URL(t.websiteUrl).hostname.replace(/^www\./, "");
      } catch (e) {
        domain = `${t.slug}.com`;
      }

      // Three-tier fallback: real npm download data (strongest — actual
      // usage) > real HN Algolia domain-matched mention data (weaker —
      // press/attention, not usage, and only checked when npm found
      // nothing) > deterministic hash-based synthetic placeholder for
      // tools with no real data source at all.
      const charSum = t.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const npm = npmStats[i];
      const hn = hnStats[i];
      let growth: number;
      let visits: string;
      let dataSource: 'npm' | 'hn' | 'synthetic';
      if (npm) {
        growth = npm.growthPercent;
        // Formatted with the same K/M-suffix convention as every other row
        // in this table (parseTraffic() on the frontend reads that suffix
        // to sort "Monthly Visits") even though this number is real weekly
        // npm downloads, not visits — no unit-less/differently-shaped
        // string, so it sorts and renders consistently next to synthetic
        // rows.
        visits = formatCompactCount(npm.weeklyDownloads);
        dataSource = 'npm';
      } else if (hn) {
        growth = hn.growthPercent;
        // Deliberately NOT run through formatCompactCount/K-M suffixing —
        // these are single-digit HN story counts, not a volume metric, and
        // dressing a "3" up as if it were a traffic figure would overstate
        // it. The "HN" suffix keeps it honest in the UI; parseTraffic()
        // still sorts it correctly since it has no K/M/B letters to
        // trigger a multiplier.
        visits = `${hn.mentions} HN`;
        dataSource = 'hn';
      } else {
        growth = parseFloat((10 + (charSum % 190)).toFixed(1));
        visits = `${1 + (charSum % 49)}M`;
        dataSource = 'synthetic';
      }

      return {
        id: t.slug,
        name: t.name,
        category: catName,
        tags: tagList,
        growth,
        votes,
        rating,
        saves,
        url: t.websiteUrl,
        description: t.description,
        pricing: t.pricingModel.toString().charAt(0) + t.pricingModel.toString().slice(1).toLowerCase(),
        visits,
        addedDate: t.createdAt.toISOString().split('T')[0],
        logoUrl: getServiceLogoUrl(t.name, domain),
        dataSource
      };
    });

    // Sort: Rating desc, then saves desc
    mapped.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.saves - a.saves;
    });

    const ranked = mapped.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    if (category && category !== 'All Categories') {
      return ranked.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
    }
    return ranked;
  }

  async listModels(category?: string) {
    const models = await this.prisma.aIModel.findMany();

    // Concurrent, not sequential — one HTTP round-trip per model would
    // otherwise serialize the whole request behind N Hugging Face calls.
    const hfStats = await Promise.all(models.map((m) => fetchHuggingFaceModelStats(m.name, m.creator)));

    const mapped = models.map((m, i) => {
      const charSum = m.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      // eloRating/benchmarkScore have no free real-data source (that's a
      // separate, more involved integration than the HF Hub API — e.g.
      // LMSYS Chatbot Arena) and stay synthetic for now.
      const eloRating = 1100 + (charSum % 200);
      const benchmarkScore = parseFloat((70 + (charSum % 25)).toFixed(1));
      const openSource = m.parameterSize.includes("Billion") || m.parameterSize.includes("Million") || m.creator === "Meta" || m.creator === "Mistral";
      const rating = parseFloat((4.0 + (charSum % 10) / 10).toFixed(1));

      // Real Hugging Face Hub data when a confident match was found —
      // "votes" maps to real likes, "growth"/"visits" to real downloads.
      // Proprietary API-only models (GPT-4, Claude, Gemini) are never on
      // HF at all, so they correctly keep the synthetic fallback below —
      // dataSource tells the frontend which case it's looking at.
      const hf = hfStats[i];
      const votes = hf ? hf.likes : 120 + (charSum % 400);
      const saves = hf ? Math.round(hf.likes * 0.1) : 40 + (charSum % 90);
      const growth = hf ? parseFloat(Math.min(hf.downloads / 1000, 999).toFixed(1)) : parseFloat((5 + (charSum % 145)).toFixed(1));
      const visits = hf ? `${(hf.downloads / 1_000_000).toFixed(1)}M` : `${12 + (charSum % 85)}M`;
      const dataSource: 'huggingface' | 'synthetic' = hf ? 'huggingface' : 'synthetic';

      const providerUrl = resolveModelProviderUrl(m.creator);
      const domain = new URL(providerUrl).hostname.replace(/^www\./, "");

      return {
        id: m.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name: m.name,
        provider: m.creator,
        category: m.modality,
        growth,
        contextWindow: m.contextWindow,
        pricing: eloRating > 1200 ? "$3.00 / M input" : "$1.50 / M input",
        eloRating,
        benchmarkScore,
        openSource,
        votes,
        rating,
        saves,
        description: m.description,
        visits,
        dataSource,
        // Per-provider (not per-model) real, verified page — AIModel has no
        // websiteUrl column of its own, and adding one would need a
        // migration against the shared production DB for what a handful of
        // real, checked URLs already solve. Every model from the same
        // creator currently points at that creator's one model-family
        // page; ask if per-model precision (via an actual schema column)
        // is worth the migration.
        url: providerUrl,
        logoUrl: getServiceLogoUrl(m.name, domain)
      };
    });

    mapped.sort((a, b) => b.eloRating - a.eloRating);

    const ranked = mapped.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    if (category && category !== 'All Categories') {
      return ranked.filter(m => m.category.toLowerCase().includes(category.toLowerCase()));
    }
    return ranked;
  }

  async listCompanies() {
    const companies = await this.prisma.company.findMany({
      include: {
        tools: true
      }
    });

    const mapped = companies.map((c) => {
      const charSum = c.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const growth = parseFloat((10 + (charSum % 190)).toFixed(1));
      const funding = `$${(10 + (charSum % 90)).toFixed(1)}M`;
      const votes = 250 + (charSum % 900);
      const rating = parseFloat((4.0 + (charSum % 10) / 10).toFixed(1));
      const saves = 120 + (charSum % 450);
      const visits = `${8 + (charSum % 90)}M`;

      // Extract domain from company tools website
      let domain = "";
      if (c.tools && c.tools.length > 0) {
        try {
          domain = new URL(c.tools[0].websiteUrl).hostname.replace(/^www\./, "");
        } catch (e) {}
      }
      if (!domain) {
        domain = `${c.slug}.com`;
      }

      return {
        id: c.slug,
        name: c.name,
        growth,
        funding,
        // Was hardcoded to "San Francisco, CA" for every single company —
        // not synthetic-but-plausible, just wrong. No free real source
        // exists for this, so empty (renders as a blank line) rather than
        // a fabricated placeholder.
        headquarters: "",
        productsCount: c.tools.length || Math.floor(1 + (charSum % 5)),
        modelsCount: Math.floor(1 + (charSum % 8)),
        votes,
        rating,
        saves,
        description: `Leading artificial intelligence company specializing in products and research.`,
        visits,
        // Real external link, same pattern as Tools' `url` — an internal
        // detail route was the original intent but has nowhere real to go:
        // frontend/src/app/companies/[slug]/page.tsx no longer exists, and
        // the unified /p/[type]/[slug] route's "companies" case would fall
        // through to EntityDetail.tsx, which is a different module's
        // explicitly-TEMPORARY placeholder backed by a different (search
        // index) data source, not this Company row. Derived from the
        // company's own first tool's real websiteUrl when available.
        url: c.tools[0]?.websiteUrl || (domain ? `https://${domain}` : ''),
        logoUrl: getServiceLogoUrl(c.name, domain)
      };
    });

    mapped.sort((a, b) => b.votes - a.votes);

    return mapped.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }
}
