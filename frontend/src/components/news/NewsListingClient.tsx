"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import X from "lucide-react/dist/esm/icons/x";
import Search from "lucide-react/dist/esm/icons/search";
import Newspaper from "lucide-react/dist/esm/icons/newspaper";
import { Plus } from "lucide-react";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const cat = category ? categories.find((c) => c.key === category) : null;
  const catLabel = category ? cat?.label ?? category : null;

  if (isLoadingInitial) {
    return (
      <main className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        <div className="h-24 animate-pulse rounded-2xl bg-[#18181C] mb-8" />
        <LoadingSkeleton />
      </main>
    );
  }

  if (initialError) {
    return (
      <main className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        <ErrorState onRetry={() => (category || initialTopic ? loadFull() : loadPage(1, false))} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
      {/* Homepage-style Hero Section for News */}
      <section
        className="relative w-full flex flex-col items-center pt-8 pb-8 px-6 mb-8 rounded-2xl border border-[#232326]/70 bg-[#0d0d10] overflow-hidden shadow-xl"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(35, 35, 38, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* Ambient Signal Glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[240px] rounded-full opacity-[0.14] blur-[100px]"
          style={{ backgroundColor: 'var(--color-signal)' }}
        />

        <div className="mx-auto max-w-[1200px] w-full flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#232326] bg-[#131316] text-[11px] font-semibold text-[#A1A1AA] mb-4 shadow-sm">
            <Newspaper size={13} className="text-[#FF6B4A]" />
            <span>AI NEWS & ANNOUNCEMENTS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-white mb-3 text-balance leading-[1.1]">
            {category ? catLabel ?? category : "The Latest AI Ecosystem News"}
          </h1>

          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xl text-balance mb-6 font-normal">
            Coverage across AI models, research breakthroughs, funding rounds, and industry announcements.
          </p>

          {/* Integrated Search Bar */}
          <div className="relative w-full max-w-[520px]">
            <div className="relative w-full rounded-xl border border-[#232326]/80 bg-[#111113] h-[42px] flex items-center px-4 focus-within:border-[#F5A623] focus-within:ring-2 focus-within:ring-[#F5A623]/20 transition-all duration-150">
              <Search size={14} className="mr-2.5 text-[#71717A] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search AI news, topics, publishers..."
                className="w-full bg-transparent text-xs sm:text-[13px] text-white placeholder:text-[#71717A] focus:outline-none font-sans"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-[#71717A] hover:text-white text-xs font-bold px-1.5 py-0.5 rounded transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar & Filter Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 md:pb-0 flex-1">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-bold select-none pr-1">
            FILTER:
          </span>
          <FilterChips items={filterChips} value={filter} onChange={setFilter} />
        </div>

        {isAdmin && (
          <Button className="bg-white text-black hover:bg-neutral-200 h-8 text-xs font-bold px-3 rounded-lg shrink-0" onClick={openAdd}>
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add News
          </Button>
        )}
      </div>

      {(selectedTopics.length > 0 || selectedSources.length > 0) && (
        <div className="flex items-center gap-2 flex-wrap pb-4">
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#232326] bg-[#131316] px-3 py-1.5 text-xs font-medium text-[#A1A1AA] hover:border-[#F5A623] hover:text-white transition-all active:scale-95"
          >
            <X size={12} aria-hidden="true" />
            Clear all filters
          </button>
        </div>
      )}

      {/* News Table List matching Video Table UI */}
      <div className="space-y-6">
        <NewsList articles={list} sources={sources} emptyKind={emptyKind} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />

        {mode === "paginated" && list.length > 0 && (
          <div ref={sentinelRef} className="flex items-center justify-center py-8">
            {isLoadingMore && <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />}
            {!isLoadingMore && loadMoreError && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#71717A]">Couldn&apos;t load more stories.</span>
                <button onClick={() => loadPage(nextPage, true)} className="text-sm font-semibold text-white hover:underline">
                  Retry
                </button>
              </div>
            )}
            {!isLoadingMore && !loadMoreError && !hasMore && <span className="text-sm text-[#71717A]">You&apos;re all caught up</span>}
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
