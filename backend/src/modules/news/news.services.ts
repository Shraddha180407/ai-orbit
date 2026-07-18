import { PrismaClient } from "@prisma/client";
import type { News, Publisher, Topic } from "@prisma/client";
import { GENERIC_TOPIC_FALLBACK, COMPANY_TOPIC_LABELS } from "../ingestion/topicTagging.js";
import type { NewsArticleDTO, NewsCategory, NewsFilterChip, NewsSource } from "./news.types.js";

type ArticleRow = News & { publisher: Publisher; topics: Topic[] };

const ARTICLE_INCLUDE = { publisher: true, topics: true } as const;

const DYNAMIC_CHIP_WINDOW_MS = 48 * 60 * 60 * 1000;
const MAX_DYNAMIC_CHIPS = 5;

/** Logs how long each query takes — shows up in `wrangler tail`, same reason the old app logged it in Vercel's function logs (see /news's multi-second loads). */
async function withTiming<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    return await fn();
  } finally {
    console.log(`[timing] ${label}: ${Date.now() - start}ms`);
  }
}

function labelizeCategory(key: string): string {
  const known: Record<string, string> = {
    openai: "OpenAI",
    anthropic: "Anthropic",
    google: "Google",
    meta: "Meta",
    microsoft: "Microsoft",
    research: "Research",
    robotics: "Robotics",
    agents: "Agents",
    funding: "Funding",
    opensource: "Open Source",
  };
  return known[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

export class NewsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Ranks by net votes (desc) and assigns a stable 0-100 trending score, same
   * formula as the old app. `bookmarkedIds` is keyed by the RAW News.id
   * (cuid) — not the slug the returned DTO exposes as `id` — since that's
   * what NewsBookmark.articleId stores; must be looked up here, before the
   * cuid is discarded in favor of the slug below. Defaults to "nothing
   * bookmarked" when the caller has no clientId (see getArticles/
   * getArticleBySlug) or doesn't care (getRelatedArticles never passes one —
   * related-article rows don't render a Save button).
   */
  private withTrendingScores(rows: ArticleRow[], bookmarkedIds: Set<string> = new Set()): NewsArticleDTO[] {
    const ranked = [...rows].sort((x, y) => y.upvotes - y.downvotes - (x.upvotes - x.downvotes));
    const scoreById = new Map<string, number>();
    const n = ranked.length;
    ranked.forEach((a, i) => {
      scoreById.set(a.id, n > 1 ? Math.round(97 - (i * (97 - 68)) / (n - 1)) : 97);
    });

    return rows.map((a) => ({
      id: a.slug,
      headline: a.title,
      dek: a.dek,
      aiSummary: a.aiSummary,
      articleUrl: a.articleUrl,
      category: a.category,
      topics: a.topics.map((t) => t.name),
      source: a.publisherId,
      hours: Math.max(0, Math.floor((Date.now() - a.publishedAt.getTime()) / 3_600_000)),
      up: a.upvotes,
      down: a.downvotes,
      filters: a.filterTags,
      score: scoreById.get(a.id) ?? 0,
      bookmarked: bookmarkedIds.has(a.id),
    }));
  }

  /** Single query for however many article ids need a bookmark check — empty Set when clientId is absent, never queries for nothing. */
  private async loadBookmarkedIds(articleIds: string[], clientId: string | undefined): Promise<Set<string>> {
    if (!clientId || articleIds.length === 0) return new Set();
    const rows = await this.prisma.newsBookmark.findMany({
      where: { clientId, articleId: { in: articleIds } },
      select: { articleId: true },
    });
    return new Set(rows.map((r) => r.articleId));
  }

  /**
   * Two modes:
   *  - No `paging` arg: full unfiltered/unpaginated list, newest first — used
   *    whenever the listing page has a search/topic/source filter or a
   *    non-default sort active, since those still filter/sort entirely
   *    client-side over the complete set (same as the old app).
   *  - `paging` given: a single page, newest first, for the default
   *    (unfiltered, date-sorted) infinite-scroll feed — see NewsController.
   *    `total` is the full table's row count, for the frontend to know
   *    whether more pages exist.
   *
   * Note: the `score` trending-rank field (see withTrendingScores) is
   * computed relative to whatever set of rows was fetched, so in paginated
   * mode it's only accurate within that page, not globally. Harmless in
   * practice — the frontend's "sort by trending" always requests the
   * unpaginated full list instead of relying on a paginated response's
   * scores.
   */
  async getArticles(paging?: { page: number; perPage: number }, clientId?: string): Promise<{ articles: NewsArticleDTO[]; total: number }> {
    // `id` (cuid, monotonically-ish increasing, always unique) is a required
    // second sort key, not just style — RSS entries frequently share the
    // exact same publishedAt (date-only granularity from the source feed),
    // and Postgres does not guarantee a stable order for tied rows across
    // separate queries. Without this, the same article could land on two
    // different paginated pages (confirmed: caused a duplicate React key /
    // duplicate row while testing infinite scroll before this fix).
    const orderBy = [{ publishedAt: "desc" as const }, { id: "desc" as const }];

    if (!paging) {
      const rows = await withTiming("getArticles db query", () =>
        this.prisma.news.findMany({
          include: ARTICLE_INCLUDE,
          orderBy,
        })
      );
      const bookmarkedIds = await this.loadBookmarkedIds(rows.map((r) => r.id), clientId);
      return { articles: this.withTrendingScores(rows, bookmarkedIds), total: rows.length };
    }

    const { page, perPage } = paging;
    const [rows, total] = await Promise.all([
      withTiming("getArticles db query (paginated)", () =>
        this.prisma.news.findMany({
          include: ARTICLE_INCLUDE,
          orderBy,
          skip: (page - 1) * perPage,
          take: perPage,
        })
      ),
      this.prisma.news.count(),
    ]);
    const bookmarkedIds = await this.loadBookmarkedIds(rows.map((r) => r.id), clientId);
    return { articles: this.withTrendingScores(rows, bookmarkedIds), total };
  }

  async getArticleBySlug(slug: string, clientId?: string): Promise<NewsArticleDTO | null> {
    const row = await withTiming(`getArticleBySlug(${slug}) db query`, () =>
      this.prisma.news.findUnique({ where: { slug }, include: ARTICLE_INCLUDE })
    );
    if (!row) return null;
    const bookmarkedIds = await this.loadBookmarkedIds([row.id], clientId);
    return this.withTrendingScores([row], bookmarkedIds)[0];
  }

  async getRelatedArticles(article: NewsArticleDTO, limit = 4): Promise<NewsArticleDTO[]> {
    const rows = await this.prisma.news.findMany({
      where: {
        slug: { not: article.id },
        OR: [{ category: article.category }, { topics: { some: { name: { in: article.topics } } } }],
      },
      include: ARTICLE_INCLUDE,
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    if (rows.length > 0) return this.withTrendingScores(rows);

    // Fallback: no category/topic overlap found — just show recent stories.
    const fallbackRows = await this.prisma.news.findMany({
      where: { slug: { not: article.id } },
      include: ARTICLE_INCLUDE,
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
    return this.withTrendingScores(fallbackRows);
  }

  /** Sources map keyed by Publisher id, matching NewsArticleDTO.source — the shape every component already expects. */
  async getSourcesMap(): Promise<Record<string, NewsSource>> {
    const publishers = await withTiming("getSourcesMap db query", () => this.prisma.publisher.findMany());
    return Object.fromEntries(
      publishers.map((p) => [
        p.id,
        { name: p.name, domain: p.domain, color: p.colorHex ?? "#8B8FA3", followers: p.followersLabel ?? "", logoUrl: p.logoUrl },
      ])
    );
  }

  async getCategories(): Promise<NewsCategory[]> {
    const grouped = await withTiming("getCategories db query", () =>
      this.prisma.news.groupBy({ by: ["category"], _count: { category: true } })
    );
    return grouped
      .sort((a, b) => b._count.category - a._count.category)
      .map((g) => ({ key: g.category, label: labelizeCategory(g.category), count: g._count.category }));
  }

  /**
   * "All News" and "Trending" are fixed positions; everything after is derived
   * from real topic volume in the last 48h. Excludes the generic "AI"
   * catch-all and single-company topics (OpenAI/Anthropic/...) — naming one
   * company in a filter chip on a general AI aggregator reads as favoritism.
   */
  async getFilterChips(): Promise<NewsFilterChip[]> {
    const since = new Date(Date.now() - DYNAMIC_CHIP_WINDOW_MS);
    const rows = await withTiming(
      "getFilterChips db query",
      () => this.prisma.$queryRaw<{ name: string; count: bigint }[]>`
        SELECT t.name, count(*) as count
        FROM "Topic" t
        JOIN "_NewsToTopic" nt ON t.id = nt."B"
        JOIN "News" a ON a.id = nt."A"
        WHERE a."publishedAt" >= ${since}
        GROUP BY t.name
        ORDER BY count(*) DESC
      `
    );

    const dynamicChips: NewsFilterChip[] = rows
      .filter((r) => r.name !== GENERIC_TOPIC_FALLBACK && !COMPANY_TOPIC_LABELS.has(r.name))
      .slice(0, MAX_DYNAMIC_CHIPS)
      .map((r) => ({ id: r.name, label: r.name }));

    return [{ id: "all", label: "All News" }, { id: "trending", label: "Trending" }, ...dynamicChips];
  }

  /** Top 5 publishers by article count — a real popularity signal instead of a hardcoded list. */
  async getPopularSources(): Promise<string[]> {
    const publishers = await this.prisma.publisher.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { articles: { _count: "desc" } },
      take: 5,
    });
    return publishers.map((p) => p.id);
  }

  /**
   * The public NewsArticleDTO.id is the article's SLUG (see withTrendingScores),
   * not its real database id — so vote/bookmark/comment writes, which foreign-key
   * against News.id, need this to resolve slug -> real id first.
   */
  async getArticleIdBySlug(slug: string): Promise<string | null> {
    const row = await this.prisma.news.findUnique({ where: { slug }, select: { id: true } });
    return row?.id ?? null;
  }

  /**
   * Toggles the clientId's vote: clicking the same direction again removes it
   * (matches the old app's local-toggle UX), clicking the other direction
   * switches it. Recomputes News.upvotes/downvotes from the NewsVote rows
   * after every change, same "aggregate recomputed from source rows" pattern
   * used elsewhere in this stack (see AiOrbit's recomputeToolRating).
   *
   * findUnique + delete/update/create, not upsert — same reason as
   * addBookmark (see its comment): upsert compiles to an implicit
   * transaction, which the HTTP driver can't do. The findUnique here
   * already tells us which of update/create applies, so there's no
   * redundant second lookup. The create() branch still has a narrow TOCTOU
   * race a true upsert would close atomically (two concurrent first-votes
   * for the same clientId); caught via the @@unique constraint's P2002 and
   * folded into an update to the intended value, matching what upsert
   * would have done.
   */
  async setVote(articleId: string, clientId: string, value: 1 | -1) {
    const existing = await this.prisma.newsVote.findUnique({
      where: { articleId_clientId: { articleId, clientId } },
    });

    let myVote: 1 | -1 | null;
    if (existing && existing.value === value) {
      await this.prisma.newsVote.delete({ where: { id: existing.id } });
      myVote = null;
    } else if (existing) {
      await this.prisma.newsVote.update({ where: { id: existing.id }, data: { value } });
      myVote = value;
    } else {
      try {
        await this.prisma.newsVote.create({ data: { articleId, clientId, value } });
      } catch (err: any) {
        if (err?.code !== "P2002") throw err;
        await this.prisma.newsVote.update({ where: { articleId_clientId: { articleId, clientId } }, data: { value } });
      }
      myVote = value;
    }

    const [upvotes, downvotes] = await Promise.all([
      this.prisma.newsVote.count({ where: { articleId, value: 1 } }),
      this.prisma.newsVote.count({ where: { articleId, value: -1 } }),
    ]);
    await this.prisma.news.update({ where: { id: articleId }, data: { upvotes, downvotes } });

    return { upvotes, downvotes, myVote };
  }

  /**
   * findUnique + create, not upsert — upsert's `update: {}` (a true no-op:
   * nothing to change if the bookmark already exists) doesn't compile to a
   * single native INSERT ... ON CONFLICT, so Prisma falls back to an
   * implicit transaction, which the HTTP driver (see news.controller.ts)
   * can't do at all. findUnique/create are each already atomic single
   * statements — confirmed via query-event logging before this was
   * written, not assumed.
   *
   * This does reopen a narrow TOCTOU race upsert closed atomically: two
   * concurrent requests for the same clientId could both see "not found"
   * and both call create(). Same articleId+clientId is a @@unique
   * constraint, so the loser gets a P2002 violation, not silent
   * duplication — caught below and treated as success, since "already
   * bookmarked" is exactly the state the winner just created.
   */
  async addBookmark(articleId: string, clientId: string): Promise<{ bookmarked: true }> {
    const existing = await this.prisma.newsBookmark.findUnique({
      where: { articleId_clientId: { articleId, clientId } },
    });
    if (!existing) {
      try {
        await this.prisma.newsBookmark.create({ data: { articleId, clientId } });
      } catch (err: any) {
        if (err?.code !== "P2002") throw err;
      }
    }
    return { bookmarked: true };
  }

  async removeBookmark(articleId: string, clientId: string): Promise<{ bookmarked: false }> {
    await this.prisma.newsBookmark.deleteMany({ where: { articleId, clientId } });
    return { bookmarked: false };
  }

  async addComment(articleId: string, clientId: string, authorName: string | undefined, body: string) {
    const comment = await this.prisma.newsComment.create({
      data: {
        articleId,
        clientId,
        body,
        ...(authorName ? { authorName } : {}),
      },
    });
    return { id: comment.id, authorName: comment.authorName, body: comment.body, createdAt: comment.createdAt.toISOString() };
  }

  /** Newest first, matching the old (session-only) comment box's display order. Never exposes clientId — that's the anonymous poster's own identifier, not public. */
  async getComments(articleId: string) {
    const rows = await this.prisma.newsComment.findMany({
      where: { articleId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((c) => ({ id: c.id, authorName: c.authorName, body: c.body, createdAt: c.createdAt.toISOString() }));
  }
}
