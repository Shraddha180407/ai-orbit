"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Breadcrumb } from "./Breadcrumb";
import { NewsSearchBar } from "@/components/ui/NewsSearchBar";
import { FilterChips } from "./FilterChips";
import { TopicChip } from "./TopicChip";
import { NewsList } from "./NewsList";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
import { API_URL } from "@/lib/api";
import { getClientId } from "@/lib/clientId";
import { applySearch, buildSourceOptions, buildTopicOptions, nextSortState, sortArticles } from "@/lib/news/news";
import type { NewsArticle, NewsCategory, NewsFilterChip, NewsSource, SortState } from "@/types/news";

const PAGE_SIZE = 25;

interface NewsListingResponse {
  articles: NewsArticle[];
  sources: Record<string, NewsSource>;
  categories: NewsCategory[];
  filterChips: NewsFilterChip[];
  pagination?: { page: number; perPage: number; total: number; hasMore: boolean };
}

interface NewsListingClientProps {
  category?: string;
  initialTopic?: string;
}

/**
 * Owns its own data fetching (moved here from NewsPageClient) because the
 * fetch strategy now depends on filter state, which lives here: the default
 * feed (no category, no search/topic/source filter, default date sort) is
 * fetched page-by-page as the user scrolls (GET /api/news?page=&perPage=).
 * The moment any filter/search/non-default sort is touched, or the page was
 * reached already scoped to a category/topic, the FULL article list is
 * fetched once (GET /api/news, unchanged from the old app) and every filter
 * below runs entirely client-side over that complete set, same as before.
 * Once upgraded to the full set, it stays that way for the rest of the
 * session — clearing filters again just re-reveals more of what's already
 * loaded, it doesn't drop back to paginated fetching.
 */
export function NewsListingClient({ category, initialTopic }: NewsListingClientProps) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopic ? [initialTopic] : []);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [sort, setSort] = useState<SortState>({ key: "date", dir: "desc" });

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<Record<string, NewsSource>>({});
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [filterChips, setFilterChips] = useState<NewsFilterChip[]>([]);

  const [mode, setMode] = useState<"paginated" | "full">("paginated");
  const [nextPage, setNextPage] = useState(1);
  const [serverTotal, setServerTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialError, setInitialError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);

  const isDefaultView =
    !category && filter === "all" && !query.trim() && selectedTopics.length === 0 && selectedSources.length === 0 && sort.key === "date" && sort.dir === "desc";

  const loadFull = useCallback(async () => {
    setInitialError(false);
    setLoadMoreError(false);
    try {
      const clientId = getClientId();
      const res = await fetch(`${API_URL}/api/news${clientId ? `?clientId=${encodeURIComponent(clientId)}` : ""}`);
      if (!res.ok) throw new Error(String(res.status));
      const json: NewsListingResponse = await res.json();
      setArticles(json.articles);
      setSources(json.sources);
      setCategories(json.categories);
      setFilterChips(json.filterChips);
      setMode("full");
      setHasMore(false);
    } catch {
      setInitialError(true);
    } finally {
      setIsLoadingInitial(false);
    }
  }, []);

  const loadPage = useCallback(async (page: number, append: boolean) => {
    if (append) {
      setIsLoadingMore(true);
      setLoadMoreError(false);
    } else {
      setInitialError(false);
    }
    try {
      const clientId = getClientId();
      const res = await fetch(`${API_URL}/api/news?page=${page}&perPage=${PAGE_SIZE}${clientId ? `&clientId=${encodeURIComponent(clientId)}` : ""}`);
      if (!res.ok) throw new Error(String(res.status));
      const json: NewsListingResponse = await res.json();
      setArticles((prev) => (append ? [...prev, ...json.articles] : json.articles));
      setSources(json.sources);
      setCategories(json.categories);
      setFilterChips(json.filterChips);
      setServerTotal(json.pagination?.total ?? json.articles.length);
      setHasMore(json.pagination?.hasMore ?? false);
      setNextPage(page + 1);
    } catch {
      if (append) setLoadMoreError(true);
      else setInitialError(true);
    } finally {
      setIsLoadingInitial(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Initial load, once.
  useEffect(() => {
    if (category || initialTopic) loadFull();
    else loadPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount; category/initialTopic only ever come from the URL at first render
  }, []);

  // Upgrade from paginated to the full dataset the moment a filter, search,
  // or non-default sort is touched — see the doc comment above.
  useEffect(() => {
    if (!isDefaultView && mode === "paginated" && !isLoadingInitial) loadFull();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDefaultView, mode, isLoadingInitial]);

  // Scroll-triggered fetch of the next page — only active in paginated mode.
  // Appending to the end of `articles` (never replacing/reordering earlier
  // rows) is what keeps scroll position stable; nothing above the sentinel
  // ever re-renders differently.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mode !== "paginated" || !hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) loadPage(nextPage, true);
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, hasMore, isLoadingMore, nextPage, loadPage]);

  const onSort = (key: SortState["key"]) => setSort((s) => nextSortState(s, key));

  const topicOptions = useMemo(() => buildTopicOptions(articles), [articles]);
  const sourceOptions = useMemo(() => buildSourceOptions(articles, sources), [articles, sources]);

  const toggleTopic = (v: string) =>
    setSelectedTopics((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  const toggleSource = (v: string) =>
    setSelectedSources((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  const tableFilters = {
    topicOptions,
    selectedTopics,
    onToggleTopic: toggleTopic,
    onClearTopics: () => setSelectedTopics([]),
    sourceOptions,
    selectedSources,
    onToggleSource: toggleSource,
    onClearSources: () => setSelectedSources([]),
  };

  let list = articles.slice();
  if (category) list = list.filter((a) => a.category === category || a.filters.includes(category));
  // "Trending" = real articles from the last 48h — not the old fixed 80-percentile
  // rank-score cut, which was an artifact of array order and meaningless once
  // every real article starts at 0 votes. Other chips are dynamic topic names
  // (see getFilterChips()), so they filter on the real `topics` field.
  if (filter === "trending") list = list.filter((a) => a.hours <= 48);
  else if (filter !== "all") list = list.filter((a) => a.topics.includes(filter));
  list = applySearch(list, query, sources);
  if (selectedTopics.length) list = list.filter((a) => selectedTopics.some((t) => a.topics.includes(t)));
  if (selectedSources.length) list = list.filter((a) => selectedSources.includes(a.source));
  list = sortArticles(list, sort, sources);

  const emptyKind: "search" | "empty" = query || selectedTopics.length || selectedSources.length ? "search" : "empty";
  const total = mode === "paginated" ? serverTotal : list.length;

  const cat = category ? categories.find((c) => c.key === category) : null;
  const catLabel = category ? cat?.label ?? category : null;

  if (isLoadingInitial) {
    return (
      <div>
        <div style={{ height: 24 }} />
        <LoadingSkeleton />
      </div>
    );
  }

  if (initialError) {
    return <ErrorState onRetry={() => (category || initialTopic ? loadFull() : loadPage(1, false))} />;
  }

  return (
    <div>
      {category && (
        <div style={{ marginBottom: 18 }}>
          <Breadcrumb
            items={[
              { label: "AI News", href: "/news" },
              { label: catLabel ?? category },
            ]}
          />
        </div>
      )}

      <header>
        <div style={{ minWidth: 0 }}>
          <h1
            className="text-[40px] leading-[1.1] lg:text-[54px] lg:leading-[1.05]"
            style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", letterSpacing: "-0.03em", color: "var(--text-primary)", margin: 0 }}
          >
            {category ? catLabel ?? category : "AI News"}
          </h1>
          {category ? (
            <p
              className="text-[18px] leading-[1.3] mt-[10px] lg:text-[24px] lg:leading-[1.2] lg:mt-[14px]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-medium)", letterSpacing: "-0.02em", color: "var(--text-secondary)" }}
            >
              {total} {catLabel ?? category} stories across the AI ecosystem
            </p>
          ) : (
            <p
              className="text-[15px] leading-[1.5] mt-3 lg:text-[18px] lg:leading-[1.65] lg:mt-4"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--fw-regular)",
                letterSpacing: "-0.01em",
                color: "var(--text-secondary)",
                maxWidth: 940,
              }}
            >
              Curated news covering the most critical breakthroughs, investments, research, and models across the artificial intelligence landscape.
            </p>
          )}
        </div>
      </header>

      <div className="mt-5 lg:mt-8">
        <NewsSearchBar value={query} onChange={setQuery} />
      </div>

      <div className="mt-4 lg:mt-7">
        <FilterChips items={filterChips} value={filter} onChange={setFilter} />
      </div>

      {(selectedTopics.length > 0 || selectedSources.length > 0) && (
        <div className="mt-3 lg:mt-4" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {selectedTopics.map((t) => (
            <TopicChip key={"t" + t} active onClick={() => toggleTopic(t)}>
              {t} ✕
            </TopicChip>
          ))}
          {selectedSources.map((s) => (
            <TopicChip key={"s" + s} active onClick={() => toggleSource(s)}>
              {sources[s].name} ✕
            </TopicChip>
          ))}
          <button
            onClick={() => {
              setSelectedTopics([]);
              setSelectedSources([]);
            }}
            style={{ font: "var(--fw-medium) var(--fs-xs)/1 var(--font-sans)", color: "var(--text-secondary)", padding: "2px 4px" }}
          >
            Clear all
          </button>
        </div>
      )}

      {list.length > 0 && (
        <div
          className="mt-4 mb-[10px] lg:mt-7 lg:mb-5"
          style={{
            font: "var(--fw-semibold) var(--fs-xs)/1 var(--font-sans)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-primary)",
          }}
        >
          {/* Always the real DB total, not how many are loaded/rendered so far — same phrasing in both modes. Infinite-scroll fetching itself (25 at a time) is unaffected; this is display-only. */}
          Showing {total} {total === 1 ? "story" : "stories"}
        </div>
      )}

      <div style={{ height: list.length ? 8 : 20 }} />

      <div
        className="px-3 lg:px-5"
        style={{
          borderRadius: "var(--radius-xl)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--highlight-top)",
          paddingTop: 8,
          paddingBottom: 12,
        }}
      >
        <NewsList articles={list} sources={sources} emptyKind={emptyKind} sort={sort} onSort={onSort} filters={tableFilters} />

        {mode === "paginated" && list.length > 0 && (
          <div ref={sentinelRef} style={{ padding: "18px 0 8px" }}>
            {isLoadingMore && (
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
            {!isLoadingMore && loadMoreError && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, padding: "12px 0" }}>
                <span style={{ font: "var(--fw-regular) var(--fs-sm)/1 var(--font-sans)", color: "var(--text-quaternary)" }}>
                  Couldn't load more stories.
                </span>
                <button
                  onClick={() => loadPage(nextPage, true)}
                  style={{ font: "var(--fw-semibold) var(--fs-sm)/1 var(--font-sans)", color: "var(--purple-text)" }}
                >
                  Retry
                </button>
              </div>
            )}
            {!isLoadingMore && !loadMoreError && !hasMore && (
              <div
                style={{
                  textAlign: "center",
                  padding: "12px 0",
                  font: "var(--fw-medium) var(--fs-sm)/1 var(--font-sans)",
                  color: "var(--text-quaternary)",
                }}
              >
                You're all caught up
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
