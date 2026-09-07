import type { FilterOption, NewsArticle, NewsArticleRecord, NewsSource, SortState } from "@/types/news";

/** The specific original article URL at the source — never the publisher's homepage. */
export function articleSourceUrl(article: Pick<NewsArticleRecord, "articleUrl">): string {
  return article.articleUrl;
}

export function sortArticles(
  list: NewsArticle[],
  sort: string | SortState,
  sources: Record<string, NewsSource> = {}
): NewsArticle[] {
  const l = list.slice();
  if (typeof sort === "object" && sort !== null) {
    const { key, dir } = sort;
    const mult = dir === "asc" ? 1 : -1;
    switch (key) {
      case "date":
        // asc: oldest first (highest hours), desc: newest first (lowest hours)
        return l.sort((a, b) => mult * (b.hours - a.hours));
      case "title":
        return l.sort((a, b) => mult * (a.headline || "").localeCompare(b.headline || ""));
      case "source": {
        return l.sort((a, b) => {
          const sA = sources[a.source]?.name || a.source;
          const sB = sources[b.source]?.name || b.source;
          return mult * sA.localeCompare(sB);
        });
      }
      case "trending": {
        return l.sort((a, b) => {
          const scoreA = a.score ?? a.up ?? 0;
          const scoreB = b.score ?? b.up ?? 0;
          return mult * (scoreA - scoreB);
        });
      }
      case "topics": {
        return l.sort((a, b) => {
          const tA = a.topics[0] || "";
          const tB = b.topics[0] || "";
          return mult * tA.localeCompare(tB);
        });
      }
      default:
        return l;
    }
  }

  switch (sort) {
    case "oldest":
      // Oldest first: largest hours ago first
      return l.sort((a, b) => b.hours - a.hours);
    case "rating":
      // Top rated: highest score / up votes first
      return l.sort((a, b) => (b.up ?? b.score ?? 0) - (a.up ?? a.score ?? 0));
    case "name-asc":
      // Headline A-Z
      return l.sort((a, b) => (a.headline || "").localeCompare(b.headline || ""));
    case "name-desc":
      // Headline Z-A
      return l.sort((a, b) => (b.headline || "").localeCompare(a.headline || ""));
    case "newest":
    default:
      // Newest first: smallest hours ago first
      return l.sort((a, b) => a.hours - b.hours);
  }
}

export function applySearch(list: NewsArticle[], query: string, sources: Record<string, NewsSource>): NewsArticle[] {
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter(
    (a) =>
      a.headline.toLowerCase().includes(q) ||
      a.dek.toLowerCase().includes(q) ||
      (a.aiSummary || "").toLowerCase().includes(q) ||
      a.topics.some((t) => t.toLowerCase().includes(q)) ||
      (sources[a.source]?.name || a.source).toLowerCase().includes(q)
  );
}

export function defaultSortDir(key: SortState["key"]): SortState["dir"] {
  return key === "title" || key === "source" || key === "topics" ? "asc" : "desc";
}

export function nextSortState(current: SortState, key: SortState["key"]): SortState {
  if (current.key === key) {
    return { key, dir: current.dir === "asc" ? "desc" : "asc" };
  }
  return { key, dir: defaultSortDir(key) };
}

export function buildTopicOptions(articles: NewsArticle[]): FilterOption[] {
  const counts: Record<string, number> = {};
  articles.forEach((a) => a.topics.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
  return Object.keys(counts)
    .sort()
    .map((t) => ({ value: t, label: t, count: counts[t] }));
}

export function buildSourceOptions(articles: NewsArticle[], sources: Record<string, NewsSource>): FilterOption[] {
  const counts: Record<string, number> = {};
  articles.forEach((a) => (counts[a.source] = (counts[a.source] || 0) + 1));
  return Object.keys(counts)
    .sort((x, y) => (sources[x]?.name || x).localeCompare(sources[y]?.name || y))
    .map((s) => ({ value: s, label: sources[s]?.name || s, count: counts[s] }));
}
