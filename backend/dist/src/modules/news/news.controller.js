import { Context } from "hono";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { NewsService } from "./news.services.js";
/**
 * PrismaNeonHttp (Neon's stateless HTTP driver), not the WS-based
 * PrismaNeon. Two earlier attempts at removing the per-request
 * connection-establishment cost (~1.5-2s, confirmed real) were reverted
 * after real testing caught real breakage:
 *   1. Module-scope-caching the WS-based client: violates Cloudflare
 *      Workers' rule against reusing I/O objects across requests.
 *   2. Swapping to PrismaNeonHttp outright: newsBookmark.upsert()'s
 *      `update: {}` no-op doesn't compile to a single native
 *      INSERT ... ON CONFLICT, so Prisma wrapped it in an implicit
 *      transaction, which HTTP mode hard-rejects.
 * This time, every write in the news module (addBookmark first, then
 * setVote/addComment) was rewritten to findUnique/create/update/delete —
 * confirmed via Prisma's query-event log to each compile to a single
 * atomic statement with no transaction, before this driver was swapped
 * back in. See news.services.ts for the per-method detail.
 */
function getService(c) {
    const adapter = new PrismaNeonHttp(c.env.DATABASE_URL, {});
    const prisma = new PrismaClient({ adapter });
    return new NewsService(prisma);
}
export class NewsController {
    /**
     * GET /api/news — bundles the article list plus everything the listing
     * page's client-side filter/sort/search needs. With ?page=&perPage=, only
     * that page of the default (newest-first) feed is returned, plus a
     * `pagination` block; omit both for the full unpaginated list (used
     * whenever a filter/search/non-default sort is active — see
     * NewsListingClient).
     */
    static async getListing(c) {
        try {
            const query = c.req.valid("query");
            const service = getService(c);
            const paging = query.page && query.perPage ? { page: query.page, perPage: query.perPage } : undefined;
            const [{ articles, total }, sources, categories, filterChips] = await Promise.all([
                service.getArticles(paging, query.clientId),
                service.getSourcesMap(),
                service.getCategories(),
                service.getFilterChips(),
            ]);
            const pagination = paging
                ? { page: paging.page, perPage: paging.perPage, total, hasMore: paging.page * paging.perPage < total }
                : undefined;
            return c.json({ articles, sources, categories, filterChips, pagination });
        }
        catch (error) {
            console.error("News listing error:", error);
            return c.json({ error: "Internal server error." }, 500);
        }
    }
    /** GET /api/news/:slug — a single article plus related stories, sources, and popular sources for the sidebar. */
    static async getDetail(c) {
        try {
            const { slug } = c.req.valid("param");
            const { clientId } = c.req.valid("query");
            const service = getService(c);
            const article = await service.getArticleBySlug(slug, clientId);
            if (!article) {
                return c.json({ error: "Article not found" }, 404);
            }
            const articleId = await service.getArticleIdBySlug(slug);
            const [related, sources, popularSources, comments] = await Promise.all([
                service.getRelatedArticles(article),
                service.getSourcesMap(),
                service.getPopularSources(),
                articleId ? service.getComments(articleId) : Promise.resolve([]),
            ]);
            return c.json({ article, related, sources, popularSources, comments });
        }
        catch (error) {
            console.error("News detail error:", error);
            return c.json({ error: "Internal server error." }, 500);
        }
    }
    /** POST /api/news/:slug/vote — clientId-keyed upvote/downvote; clicking the same direction again removes it. */
    static async postVote(c) {
        try {
            const { slug } = c.req.valid("param");
            const { clientId, value } = c.req.valid("json");
            const service = getService(c);
            const articleId = await service.getArticleIdBySlug(slug);
            if (!articleId) {
                return c.json({ error: "Article not found" }, 404);
            }
            const result = await service.setVote(articleId, clientId, value);
            return c.json(result);
        }
        catch (error) {
            console.error("News vote error:", error);
            return c.json({ error: "Internal server error." }, 500);
        }
    }
    /** POST /api/news/:slug/bookmark — clientId-keyed save. */
    static async postBookmark(c) {
        try {
            const { slug } = c.req.valid("param");
            const { clientId } = c.req.valid("json");
            const service = getService(c);
            const articleId = await service.getArticleIdBySlug(slug);
            if (!articleId) {
                return c.json({ error: "Article not found" }, 404);
            }
            const result = await service.addBookmark(articleId, clientId);
            return c.json(result);
        }
        catch (error) {
            console.error("News bookmark create error:", error);
            return c.json({ error: "Internal server error." }, 500);
        }
    }
    /** DELETE /api/news/:slug/bookmark?clientId=... — removes the clientId's save. */
    static async deleteBookmark(c) {
        try {
            const { slug } = c.req.valid("param");
            const { clientId } = c.req.valid("query");
            const service = getService(c);
            const articleId = await service.getArticleIdBySlug(slug);
            if (!articleId) {
                return c.json({ error: "Article not found" }, 404);
            }
            const result = await service.removeBookmark(articleId, clientId);
            return c.json(result);
        }
        catch (error) {
            console.error("News bookmark delete error:", error);
            return c.json({ error: "Internal server error." }, 500);
        }
    }
    /** POST /api/news/:slug/comments — real persistence, replacing the old session-only comment box. */
    static async postComment(c) {
        try {
            const { slug } = c.req.valid("param");
            const { clientId, authorName, body } = c.req.valid("json");
            const service = getService(c);
            const articleId = await service.getArticleIdBySlug(slug);
            if (!articleId) {
                return c.json({ error: "Article not found" }, 404);
            }
            const comment = await service.addComment(articleId, clientId, authorName, body);
            return c.json({ comment }, 201);
        }
        catch (error) {
            console.error("News comment create error:", error);
            return c.json({ error: "Internal server error." }, 500);
        }
    }
}
