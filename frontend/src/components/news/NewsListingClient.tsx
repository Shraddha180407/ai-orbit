"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import X from "lucide-react/dist/esm/icons/x";
import { Plus } from "lucide-react";
import { NewsSearchBar } from "@/components/ui/NewsSearchBar";
import { FilterChips } from "./FilterChips";
import { TopicChip } from "./TopicChip";
import { NewsList } from "./NewsList";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
import { API_URL } from "@/lib/api";
import { getClientId } from "@/lib/clientId";
import { applySearch, sortArticles } from "@/lib/news/news";
import type { NewsArticle, NewsCategory, NewsFilterChip, NewsSource, SortState } from "@/types/news";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/shadcn-button";

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
 * Same page shape as ToolsClient.tsx: a "Back to Home" link, an
 * `<h1>`+count header, a search bar, a filter-chip row, then the listing
 * table — same classes/spacing throughout (`mx-auto max-w-[1070px] px-6
 * py-10`, `text-2xl font-semibold text-foreground` h1, etc.) so /news reads
 * as the same product as /tools, not a separate visual system.
 *
 * Data fetching itself (pagination/full-list upgrade, filter/sort state) is
 * unchanged from before — only the presentation was rewritten.
 */
export function NewsListingClient({ category, initialTopic }: NewsListingClientProps) {
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopic ? [initialTopic] : []);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [sort] = useState<SortState>({ key: "date", dir: "desc" });

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', slug: '', articleUrl: '', category: 'general', summary: '' });
  const [isSaving, setIsSaving] = useState(false);

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

  const isDefaultView = !category && filter === "all" && !query.trim() && selectedTopics.length === 0 && selectedSources.length === 0;

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

  useEffect(() => {
    if (category || initialTopic) loadFull();
    else loadPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount; category/initialTopic only ever come from the URL at first render
  }, []);

  useEffect(() => {
    if (!isDefaultView && mode === "paginated" && !isLoadingInitial) loadFull();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDefaultView, mode, isLoadingInitial]);

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

  const toggleTopic = (v: string) => setSelectedTopics((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  const toggleSource = (v: string) => setSelectedSources((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  // Admin handlers
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/admin/news/${editingId}` : `${API_URL}/api/admin/news`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), credentials: 'include' });
      if (!res.ok) throw new Error('Failed to save news');
      toast.success(editingId ? 'News updated successfully' : 'News added successfully');
      setIsModalOpen(false);
      if (mode === "paginated") loadPage(1, false);
      else loadFull();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/news/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete news');
      toast.success('News deleted successfully');
      if (mode === "paginated") loadPage(1, false);
      else loadFull();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ title: '', slug: '', articleUrl: '', category: 'general', summary: '' });
    setIsModalOpen(true);
  };

  const openEdit = (news: any) => {
    setEditingId(news.id);
    setFormData({ title: news.headline || '', slug: news.id || '', articleUrl: news.articleUrl || '', category: news.category || 'general', summary: news.dek || news.aiSummary || '' });
    setIsModalOpen(true);
  };

  let list = articles.slice();
  if (category) list = list.filter((a) => a.category === category || a.filters.includes(category));
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
      <main className="mx-auto max-w-[1070px] px-6 py-10">
        <div className="h-24 animate-pulse rounded-lg bg-[#18181C] mb-8" />
        <LoadingSkeleton />
      </main>
    );
  }

  if (initialError) {
    return (
      <main className="mx-auto max-w-[1070px] px-6 py-10">
        <ErrorState onRetry={() => (category || initialTopic ? loadFull() : loadPage(1, false))} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1070px] px-6 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-white transition-colors">
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <header className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{category ? catLabel ?? category : "AI News"}</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {total} {category ? `${catLabel ?? category} ` : ""}stor{total === 1 ? "y" : "ies"} across the AI ecosystem
          </p>
        </div>
        {isAdmin && (
          <Button className="self-start bg-white text-black hover:bg-neutral-200" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add News
          </Button>
        )}
        <NewsSearchBar value={query} onChange={setQuery} />
      </header>

      <div className="space-y-5 mb-8">
        <div className="space-y-2">
          <span className="block text-[10px] font-mono tracking-widest text-foreground-faint uppercase">Filters</span>
          <FilterChips items={filterChips} value={filter} onChange={setFilter} />
        </div>

        {(selectedTopics.length > 0 || selectedSources.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap pt-2">
            {selectedTopics.map((t) => (
              <TopicChip key={"t" + t} active onClick={() => toggleTopic(t)}>
                {t}
                <X size={12} className="ml-1.5" />
              </TopicChip>
            ))}
            {selectedSources.map((s) => (
              <TopicChip key={"s" + s} active onClick={() => toggleSource(s)}>
                {sources[s]?.name}
                <X size={12} className="ml-1.5" />
              </TopicChip>
            ))}
            <button
              onClick={() => {
                setSelectedTopics([]);
                setSelectedSources([]);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground-muted hover:bg-surface-raised hover:text-foreground transition-all active:scale-95"
            >
              <X size={12} aria-hidden="true" />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <NewsList articles={list} sources={sources} emptyKind={emptyKind} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />

        {mode === "paginated" && list.length > 0 && (
          <div ref={sentinelRef} className="flex items-center justify-center py-8">
            {isLoadingMore && <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />}
            {!isLoadingMore && loadMoreError && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground-faint">Couldn&apos;t load more stories.</span>
                <button onClick={() => loadPage(nextPage, true)} className="text-sm font-semibold text-white hover:underline">
                  Retry
                </button>
              </div>
            )}
            {!isLoadingMore && !loadMoreError && !hasMore && <span className="text-sm text-foreground-faint">You&apos;re all caught up</span>}
          </div>
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit News' : 'Add News'} footer={
        <>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="text-xs text-[#8A8F98]">Title *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="Article headline" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Slug</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="article-url-slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Article URL</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="https://..." value={formData.articleUrl} onChange={e => setFormData({...formData, articleUrl: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Category</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. general, llm, robotics" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Summary / Dek</label><textarea className="w-full p-2 text-sm bg-[#111113] border border-[#1C1C1F] text-white rounded-md h-20" placeholder="Brief description..." value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} /></div>
        </div>
      </Modal>
    </main>
  );
}
