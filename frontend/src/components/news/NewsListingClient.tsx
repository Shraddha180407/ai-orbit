"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import X from "lucide-react/dist/esm/icons/x";
import Search from "lucide-react/dist/esm/icons/search";
import Newspaper from "lucide-react/dist/esm/icons/newspaper";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import ListChecks from 'lucide-react/dist/esm/icons/list-checks';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import FolderHeart from 'lucide-react/dist/esm/icons/folder-heart';
import GitBranch from 'lucide-react/dist/esm/icons/git-branch';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import Bot from 'lucide-react/dist/esm/icons/bot';
import Plug from 'lucide-react/dist/esm/icons/plug';
import PlayCircle from 'lucide-react/dist/esm/icons/play-circle';
import UserCircle from 'lucide-react/dist/esm/icons/user-circle';
import Palette from 'lucide-react/dist/esm/icons/palette';

import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const DIRECTORY_CARDS = [
  { name: "Tools", href: "/tools", description: "Browse the full AI tools directory, filter by category and pricing.", icon: Wrench, color: "#FFC53D" },
  { name: "Tasks", href: "/tasks", description: "Find the right AI tool for a specific job to be done.", icon: ListChecks, color: "#FB923C" },
  { name: "Companies", href: "/companies", description: "Explore the labs and startups building the AI ecosystem.", icon: Building2, color: "#38BDF8" },
  { name: "News", href: "/news", description: "The latest announcements and coverage across the AI world.", icon: Newspaper, color: "#FF6B4A" },
  { name: "Videos", href: "/videos", description: "Watch demos, reviews, and deep dives on the latest AI tools.", icon: PlayCircle, color: "#F87171" },
  { name: "Robots", href: "/robots", description: "Robotics platforms and the companies behind them.", icon: Bot, color: "#2DD4BF" },
  { name: "Devices", href: "/devices", description: "Hardware built for and powered by AI.", icon: Smartphone, color: "#F472B6" },
  { name: "Models", href: "/models", description: "Compare context windows, pricing, and benchmarks across AI models.", icon: Cpu, color: "#A78BFA" },
  { name: "Repositories", href: "/repositories", description: "Trending open-source AI repositories on GitHub.", icon: GitBranch, color: "#22D3EE" },
  { name: "MCP", href: "/tools", description: "Model Context Protocol servers and integrations.", icon: Plug, color: "#818CF8" },
  { name: "Collections", href: "/collections", description: "Curated bundles of tools grouped by use case.", icon: FolderHeart, color: "#34D399" },
  { name: "Personal", href: "/personal", description: "AI tools for personal productivity and everyday life.", icon: UserCircle, color: "#FBBF24" },
  { name: "Creativity", href: "/creativity", description: "AI tools for art, design, writing, and creative work.", icon: Palette, color: "#E879F9" },
] as const;
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

const NEWS_SUB = [
  "AI Industry News",
  "Product Launches",
  "Research & Innovations",
  "Company Updates",
  "Open Source",
  "Regulations & Policy",
  "Events & Conferences",
  "Tutorials & Guides",
  "Interviews & Opinions",
  "Market Trends"
];

function formatSubcategoryPath(name: string): string {
  if (name === "Product Launches") return "productlunch"; // support requested mapping
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const SUBCATEGORY_SLUG_MAP: Record<string, string> = {
  "aiindustrynews": "productivity",
  "productlaunches": "productivity",
  "productlunch": "productivity",
  "researchinnovations": "chatbots",
  "companyupdates": "productivity",
  "opensource": "productivity",
  "regulationspolicy": "productivity",
  "eventsconferences": "productivity",
  "tutorialsguides": "productivity",
  "interviewsopinions": "chatbots",
  "markettrends": "marketing",
};

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
  const router = useRouter();
  const routeParams = useParams();
  const activeSubcategoryPath = routeParams?.category as string | undefined;

  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>(activeSubcategoryPath);

  useEffect(() => {
    setActiveSubcategory(activeSubcategoryPath);
  }, [activeSubcategoryPath]);

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopic ? [initialTopic] : []);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [sort, setSort] = useState<SortState>({ key: "date", dir: "desc" });

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

  const currentCategory = activeSubcategory ? (SUBCATEGORY_SLUG_MAP[activeSubcategory] || activeSubcategory) : category;

  let list = articles.slice();
  if (currentCategory) list = list.filter((a) => a.category === currentCategory || a.filters.includes(currentCategory));
  if (filter === "trending") list = list.filter((a) => a.hours <= 48);
  else if (filter !== "all") list = list.filter((a) => a.topics.includes(filter));
  list = applySearch(list, query, sources);
  if (selectedTopics.length) list = list.filter((a) => selectedTopics.some((t) => a.topics.includes(t)));
  if (selectedSources.length) list = list.filter((a) => selectedSources.includes(a.source));
  list = sortArticles(list, sort, sources);

  const emptyKind: "search" | "empty" = query || selectedTopics.length || selectedSources.length ? "search" : "empty";
  const cat = currentCategory ? categories.find((c) => c.key === currentCategory) : null;
  const catLabel = currentCategory ? cat?.label ?? currentCategory : null;



  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Hero Section */}
      <section
        className="relative w-full flex flex-col items-center pt-4 pb-6 px-6"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(35, 35, 38, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.12] blur-[100px]"
            style={{ backgroundColor: 'var(--color-signal)' }}
          />
        </div>

        <div className="mx-auto max-w-[1440px] w-full flex flex-col items-center text-center relative z-10">
          <h1 className="max-w-[820px] text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.1] mb-4 sm:mb-6 select-none text-white text-balance">
            The Home of Everything AI
          </h1>

          <form action="/tools" method="GET" className="relative w-full max-w-[520px] mx-auto mb-4 sm:mb-5 group">
            <div
              className="relative w-full rounded-xl border border-[#232326]/70 bg-[#111113] h-[38px] sm:h-[42px] flex items-center px-3.5 sm:px-4 pr-[4.5rem] transition-colors duration-150"
            >
              <Search size={13} className="mr-2 sm:mr-2.5 text-[#71717A] shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Search AI tools, models, companies…"
                className="w-full bg-transparent text-[12px] sm:text-[13px] text-white placeholder:text-[#71717A] focus:outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-0.5 rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 font-mono text-[10px] text-[#71717A] pointer-events-none">
                  <span>⌘</span>K
                </kbd>
              </div>
            </div>
            <style jsx>{`
              form:focus-within > div {
                border-color: var(--color-signal) !important;
                box-shadow: 0 0 0 3px var(--color-signal-dim);
              }
            `}</style>
          </form>

          <div className="mb-3">
            <HeroFeatureChips />
          </div>
        </div>
      </section>

      <div className="border-b border-[#232326]/40 w-full z-10 relative" />

      {/* Sort control */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mx-auto w-full max-w-[1600px] flex justify-end">
          <div className="flex items-center gap-2 select-none">
            <span className="text-xs text-[#71717A]">
              Sort by
            </span>
            <div className="relative inline-flex items-center">
              <select
                value={sort.key === "date" ? (sort.dir === "desc" ? "newest" : "oldest") : "popular"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "newest") setSort({ key: "date", dir: "desc" });
                  else if (val === "oldest") setSort({ key: "date", dir: "asc" });
                  else if (val === "popular") setSort({ key: "trending", dir: "desc" });
                }}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-xs font-semibold text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-7"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Popular</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 text-[#71717A] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Directory nav strip */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-1">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex flex-nowrap items-stretch gap-1.5 sm:gap-2 overflow-x-auto">
            {DIRECTORY_CARDS.map((card) => {
              const Icon = card.icon;
              const isSelected = card.name.toLowerCase() === "news";

              return (
                <Link
                  key={card.name}
                  href={card.href}
                  className="group flex flex-1 min-w-[76px] sm:min-w-[92px] shrink-0 flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-[#232326]/60 bg-[#0d0d10] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center transition-colors duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.boxShadow = "";
                    }
                  }}
                  style={
                    isSelected
                      ? { borderColor: card.color, boxShadow: `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55` }
                      : undefined
                  }
                >
                  <div
                    className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md border"
                    style={{ backgroundColor: `${card.color}1a`, borderColor: `${card.color}40` }}
                  >
                    <Icon size={10} strokeWidth={1.75} style={{ color: card.color }} />
                  </div>
                  <span className="text-[9px] sm:text-[10.5px] font-bold tracking-tight text-white whitespace-nowrap">
                    {card.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">

        {isAdmin && (
          <div className="flex justify-end mb-6">
            <Button className="bg-white text-black hover:bg-neutral-200 h-8 text-xs font-bold px-3 rounded-lg shrink-0" onClick={openAdd}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add News
            </Button>
          </div>
        )}

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

        {initialError ? (
          <div className="flex-1 flex flex-col justify-center items-center py-20 border border-[#232326] bg-[#131316]/20 rounded-xl">
            <ErrorState onRetry={() => (category || initialTopic ? loadFull() : loadPage(1, false))} />
          </div>
        ) : isLoadingInitial ? (
          <LoadingSkeleton />
        ) : list.length === 0 ? (
          <div className="text-center py-20 border border-[#232326] bg-[#131316] rounded-xl flex-1 flex flex-col justify-center items-center">
            <Newspaper className="h-8 w-8 text-[#52525B] mb-3" />
            <p className="text-[#A1A1AA] text-sm">No stories found matching your criteria.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <NewsList
              articles={list}
              sources={sources}
              emptyKind={emptyKind}
              isAdmin={isAdmin}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

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

      <Footer />
    </div>
  );
}
