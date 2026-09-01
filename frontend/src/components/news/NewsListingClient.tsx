"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import X from "lucide-react/dist/esm/icons/x";
import { Plus } from "lucide-react";
import { TopicChip } from "./TopicChip";
import { NewsTable, NewsTableEmpty, NewsTableSkeleton } from "./NewsTable";
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
import { Pagination } from "@/components/Pagination";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 100;

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
  const searchParams = useSearchParams();
  const sortParam = searchParams.get("sort") || "newest";
  const urlFilter = searchParams.get("filter");

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<Record<string, NewsSource>>({});
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [initialError, setInitialError] = useState(false);

  const [filter, setFilter] = useState<string>(category || urlFilter || "all");
  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopic ? [initialTopic] : []);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);

  // Admin Modal State
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN" || user?.email === "admin@aiorbit.org";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', slug: '', articleUrl: '', category: 'general', summary: '' });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoadingInitial(true);
    setInitialError(false);
    try {
      const clientId = getClientId();
      const res = await fetch(`${API_URL}/api/news${clientId ? `?clientId=${encodeURIComponent(clientId)}` : ""}`);
      if (!res.ok) throw new Error(String(res.status));
      const json: NewsListingResponse = await res.json();
      setArticles(json.articles || []);
      setSources(json.sources || {});
      setCategories(json.categories || []);
    } catch {
      setInitialError(true);
    } finally {
      setIsLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      if (typeof window !== "undefined") window.history.pushState(null, "", `/news?filter=${encodeURIComponent(fKey)}`);
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
      loadData();
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
      loadData();
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

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const visibleArticles = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
        <ErrorState onRetry={() => loadData()} />
      </main>
    );
  }

  return (
    <>
      <main className="w-full px-2 sm:px-4 py-3 flex-1 flex flex-col">
        {/* Clean Subcategory Filter Chips Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0 flex-1 w-full">
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

          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <Button className="bg-white text-black hover:bg-neutral-200 h-8 text-xs font-bold px-3 rounded-lg shrink-0" onClick={openAdd}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Add News
              </Button>
            </div>
          )}
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
        {list.length === 0 ? (
          <NewsTableEmpty searchActive={Boolean(query || filter !== "all")} />
        ) : (
          <NewsTable articles={visibleArticles} sources={sources} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />
        )}

        {/* Unified Floating Pill Pagination */}
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={list.length}
          onPageChange={(p) => {
            setCurrentPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setCurrentPage(1);
          }}
        />
      </main>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit News' : 'Add News'} footer={
        <>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="text-xs text-[#8A8F98]">Title *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. OpenAI announces GPT-5" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Article URL *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="https://..." value={formData.articleUrl} onChange={e => setFormData({...formData, articleUrl: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Summary</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="Short description..." value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} /></div>
        </div>
      </Modal>
    </>
  );
}
