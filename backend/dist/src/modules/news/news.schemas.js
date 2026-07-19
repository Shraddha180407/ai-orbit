import { z } from "zod";
/**
 * Both optional, and only meaningful together — omit both for the full
 * unpaginated list (see NewsService.getArticles). Used by the listing
 * page's default infinite-scroll feed; any active search/topic/source
 * filter or non-default sort still requests the full list instead.
 */
export const newsListingQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((v) => (v ? Math.max(1, parseInt(v, 10) || 1) : undefined)),
    perPage: z
        .string()
        .optional()
        .transform((v) => (v ? Math.max(1, Math.min(50, parseInt(v, 10) || 25)) : undefined)),
    /** Optional — when present, each returned article's `bookmarked` field reflects this clientId's real NewsBookmark rows; absent means every article defaults to bookmarked:false. */
    clientId: z.string().optional(),
});
export const newsSlugParamSchema = z.object({
    slug: z.string().min(1),
});
/** Same optional clientId -> bookmarked meaning as newsListingQuerySchema, for GET /api/news/:slug. */
export const newsDetailQuerySchema = z.object({
    clientId: z.string().optional(),
});
// clientId is an anonymous, client-generated id (no real auth module exists
// yet) — same pattern as NewsVote/NewsBookmark/NewsComment's clientId column.
export const newsVoteBodySchema = z.object({
    clientId: z.string().min(1),
    value: z.union([z.literal(1), z.literal(-1)]),
});
export const newsBookmarkBodySchema = z.object({
    clientId: z.string().min(1),
});
export const newsBookmarkQuerySchema = z.object({
    clientId: z.string().min(1),
});
export const newsCommentBodySchema = z.object({
    clientId: z.string().min(1),
    authorName: z.string().trim().min(1).max(80).optional(),
    body: z.string().trim().min(1).max(2000),
});
