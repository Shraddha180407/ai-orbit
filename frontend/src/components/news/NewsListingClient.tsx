"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import X from "lucide-react/dist/esm/icons/x";
import Search from "lucide-react/dist/esm/icons/search";
import { Plus } from "lucide-react";
import { TopicChip } from "./TopicChip";
import { NewsList } from "./NewsList";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
import { API_URL } from "@/lib/api";
import { getClientId } from "@/lib/clientId";
import { applySearch, sortArticles } from "@/lib/news/news";
import type { NewsArticle, NewsCategory, NewsFilterChip, NewsSource } from "@/types/news";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/shadcn-button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 50;

const DEFAULT_NEWS_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "ai-industry", label: "AI Industry" },
  { key: "product-launches", label: "Product Launches" },
  { key: "innovations", label: "Innovations" },
  { key: "company-updates", label: "Company Updates" },
  { key: "open-source", label: "Open Source" },
  { key: "regulations", label: "Regulations" },
  { key: "interviews", label: "Interviews" },
  { key: "market-trends", label: "Market Trends" },
  { key: "breakthroughs", label: "Breakthroughs" },
  { key: "security", label: "Security" },
  { key: "agents", label: "Agents" },
  { key: "llms", label: "LLMs" },
  { key: "technology", label: "Technology" },
];

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

function matchesCategoryFilter(a: NewsArticle, filterKey: string): boolean {
  if (!filterKey || filterKey === "all") return true;
  if (filterKey === "trending") return a.hours <= 48;

  const keyLower = filterKey.toLowerCase();
  const keyWords = keyLower.split(/[-_\s]+/).filter(Boolean);

  const catName = (a.category || "").toLowerCase();
  const headline = (a.headline || "").toLowerCase();
  const dek = (a.dek || a.aiSummary || "").toLowerCase();
  const topicsStr = (a.topics || []).join(" ").toLowerCase();
  const filtersStr = (a.filters || []).join(" ").toLowerCase();

  const fullContent = `${catName} ${topicsStr} ${filtersStr} ${headline} ${dek}`;

  switch (keyLower) {
    case "ai-industry":
      return fullContent.includes("industry") || fullContent.includes("market") || fullContent.includes("enterprise") || fullContent.includes("business") || fullContent.includes("company");
    case "product-launches":
      return fullContent.includes("product") || fullContent.includes("launch") || fullContent.includes("release") || fullContent.includes("announc") || fullContent.includes("introduce");
    case "innovations":
      return fullContent.includes("innovat") || fullContent.includes("new") || fullContent.includes("feature") || fullContent.includes("capability") || fullContent.includes("advance");
    case "company-updates":
      return fullContent.includes("company") || fullContent.includes("corporate") || fullContent.includes("google") || fullContent.includes("openai") || fullContent.includes("microsoft") || fullContent.includes("meta") || fullContent.includes("anthropic");
    case "open-source":
      return fullContent.includes("open source") || fullContent.includes("open-source") || fullContent.includes("github") || fullContent.includes("weights") || fullContent.includes("hugging");
    case "regulations":
      return fullContent.includes("regulation") || fullContent.includes("policy") || fullContent.includes("law") || fullContent.includes("gov") || fullContent.includes("legal") || fullContent.includes("safety") || fullContent.includes("eu");
    case "interviews":
      return fullContent.includes("interview") || fullContent.includes("podcast") || fullContent.includes("talk") || fullContent.includes("q&a") || fullContent.includes("ceo") || fullContent.includes("founder");
    case "market-trends":
      return fullContent.includes("trend") || fullContent.includes("market") || fullContent.includes("report") || fullContent.includes("growth") || fullContent.includes("investment") || fullContent.includes("funding");
    case "breakthroughs":
      return fullContent.includes("breakthrough") || fullContent.includes("benchmark") || fullContent.includes("state-of-the-art") || fullContent.includes("sota") || fullContent.includes("research") || fullContent.includes("paper");
    case "security":
      return fullContent.includes("security") || fullContent.includes("vulnerability") || fullContent.includes("privacy") || fullContent.includes("hack") || fullContent.includes("safety") || fullContent.includes("risk");
    case "agents":
      return fullContent.includes("agent") || fullContent.includes("autonomous") || fullContent.includes("action") || fullContent.includes("workflow");
    case "llms":
      return fullContent.includes("llm") || fullContent.includes("language model") || fullContent.includes("gpt") || fullContent.includes("claude") || fullContent.includes("gemini") || fullContent.includes("llama");
    case "technology":
      return fullContent.includes("tech") || fullContent.includes("model") || fullContent.includes("compute") || fullContent.includes("chip") || fullContent.includes("gpu") || fullContent.includes("infra");
    default:
      return keyWords.some((w) => fullContent.includes(w));
  }
}

export function NewsListingClient({ category, initialTopic }: NewsListingClientProps) {
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const searchParams = useSearchParams();
  const sortParam = searchParams.get("sort") || "newest";
  const urlFilterParam = searchParams.get("filter") || searchParams.get("category");

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopic ? [initialTopic] : []);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Update filter state when URL parameter changes
  useEffect(() => {
    if (urlFilterParam) {
      setFilter(urlFilterParam);
    }
  }, [urlFilterParam]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlSource = params.get("source");
      if (urlSource) setSelectedSources([urlSource]);
    }
  }, []);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', slug: '', articleUrl: '', category: 'general', summary: '' });
  const [isSaving, setIsSaving] = useState(false);

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<Record<string, NewsSource>>({});
  const [, setCategories] = useState<NewsCategory[]>([]);

  const [mode, setMode] = useState<"paginated" | "full">("paginated");
  const [nextPage, setNextPage] = useState(1);
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
      const url = `${API_URL}/api/news${clientId ? `?clientId=${encodeURIComponent(clientId)}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch news");
      const json: NewsListingResponse = await res.json();
      setArticles(json.articles || []);
      setSources(json.sources || {});
      setCategories(json.categories || []);
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
      const url = `${API_URL}/api/news?page=${page}&perPage=${PAGE_SIZE}${clientId ? `&clientId=${encodeURIComponent(clientId)}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch news");
      const json: NewsListingResponse = await res.json();
      setArticles((prev) => (append ? [...prev, ...json.articles] : json.articles));
      setSources(json.sources || {});
      setCategories(json.categories || []);
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

  // Enhanced IntersectionObserver with 1200px rootMargin for instantaneous scroll load
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mode !== "paginated" || !hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) loadPage(nextPage, true);
      },
      { rootMargin: "1200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, hasMore, isLoadingMore, nextPage, loadPage]);

  const toggleTopic = (v: string) => setSelectedTopics((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  const toggleSource = (v: string) => setSelectedSources((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  // In-page subcategory filter selection with full dataset loading
  const handleSelectFilter = (fKey: string) => {
    if (fKey === "all") {
      setFilter("all");
      setSelectedTopics([]);
      setSelectedSources([]);
      setQuery("");
      if (typeof window !== "undefined") window.history.pushState(null, "", "/news");
    } else {
      setFilter(fKey);
      if (mode === "paginated") loadFull();
      if (typeof window !== "undefined") window.history.pushState(null, "", `/news/${encodeURIComponent(fKey)}`);
    }
  };

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

  // Comprehensive subcategory filtering
  let list = articles.slice();
  if (category) list = list.filter((a) => a.category === category || (a.filters && a.filters.includes(category)));
  
  if (filter !== "all") {
    list = list.filter((a) => matchesCategoryFilter(a, filter));
  }

  list = applySearch(list, query, sources);
  if (selectedTopics.length) list = list.filter((a) => selectedTopics.some((t) => (a.topics || []).includes(t)));
  if (selectedSources.length) list = list.filter((a) => selectedSources.includes(a.source));
  
  // Sort articles based on reactive top-right SortDropdown parameter (sortParam)
  list = sortArticles(list, sortParam, sources);

  const emptyKind: "search" | "empty" = query || selectedTopics.length || selectedSources.length ? "search" : "empty";

  const activeChipsList = DEFAULT_NEWS_CATEGORIES;

  if (isLoadingInitial) {
    return (
      <main className="w-full px-2 sm:px-4 py-4 flex-1 flex flex-col">
        <LoadingSkeleton />
      </main>
    );
  }

  if (initialError) {
    return (
      <main className="w-full px-2 sm:px-4 py-4 flex-1 flex flex-col">
        <ErrorState onRetry={() => (category || initialTopic ? loadFull() : loadPage(1, false))} />
      </main>
    );
  }

  return (
    <>
      <main className="w-full px-2 sm:px-4 py-3 flex-1 flex flex-col">
        {/* Toolbar & Search & Subcategory Filter Chips */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0 flex-1">
            {activeChipsList.map((chip) => {
              const isSelected = filter === chip.key;
              return (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => handleSelectFilter(chip.key)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[12px] font-semibold border transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5 cursor-pointer",
                    isSelected
                      ? "bg-white text-black border-transparent font-bold shadow-sm"
                      : "bg-[#131316] border-[#232326] text-[#A1A1AA] hover:border-[#F5A623]/50 hover:text-white"
                  )}
                >
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Search Input */}
            <div className="relative w-full max-w-[280px]">
              <div className="relative w-full rounded-lg border border-[#232326]/80 bg-[#111113] h-[34px] flex items-center px-3 focus-within:border-[#F5A623] focus-within:ring-2 focus-within:ring-[#F5A623]/20 transition-all duration-150">
                <Search size={13} className="mr-2 text-[#71717A] shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search news..."
                  className="w-full bg-transparent text-xs text-white placeholder:text-[#71717A] focus:outline-none font-sans"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-[#71717A] hover:text-white text-xs font-bold px-1 py-0.5 rounded transition-colors"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {isAdmin && (
              <Button className="bg-white text-black hover:bg-neutral-200 h-8 text-xs font-bold px-3 rounded-lg shrink-0" onClick={openAdd}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Add News
              </Button>
            )}
          </div>
        </div>

        {(selectedTopics.length > 0 || selectedSources.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap pb-3">
            {selectedTopics.map((t) => (
              <TopicChip key={"t" + t} active onClick={() => toggleTopic(t)}>
                {t}
                <X size={12} className="ml-1.5" />
              </TopicChip>
            ))}
            {selectedSources.map((s) => (
              <TopicChip key={"s" + s} active onClick={() => toggleSource(s)}>
                {sources[s]?.name || s}
                <X size={12} className="ml-1.5" />
              </TopicChip>
            ))}
            <button
              onClick={() => handleSelectFilter("all")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#232326] bg-[#131316] px-3 py-1.5 text-xs font-medium text-[#A1A1AA] hover:border-[#F5A623] hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <X size={12} aria-hidden="true" />
              Clear all filters
            </button>
          </div>
        )}

        {/* News Table List */}
        <div className="space-y-4 w-full">
          <NewsList articles={list} sources={sources} emptyKind={emptyKind} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />

          {mode === "paginated" && list.length > 0 && (
            <div ref={sentinelRef} className="flex items-center justify-center py-6">
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
      </main>

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
    </>
  );
}
