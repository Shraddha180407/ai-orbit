'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Search from 'lucide-react/dist/esm/icons/search';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import ListChecks from 'lucide-react/dist/esm/icons/list-checks';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import FolderHeart from 'lucide-react/dist/esm/icons/folder-heart';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';
import GitBranch from 'lucide-react/dist/esm/icons/git-branch';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import Bot from 'lucide-react/dist/esm/icons/bot';
import Plug from 'lucide-react/dist/esm/icons/plug';
import PlayCircle from 'lucide-react/dist/esm/icons/play-circle';
import UserCircle from 'lucide-react/dist/esm/icons/user-circle';
import Palette from 'lucide-react/dist/esm/icons/palette';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";

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

const TASKS_SUB = [
  "Content Creation",
  "Image Creation",
  "Video Creation",
  "Audio & Music",
  "Coding & Development",
  "Data Analysis",
  "Research & Summarization",
  "Productivity & Automation",
  "Marketing & Sales",
  "Customer Support"
];

const SUBCATEGORY_SLUG_MAP: Record<string, string> = {
  "contentcreation": "productivity",
  "imagecreation": "image-generation",
  "videocreation": "video",
  "audiomusic": "audio",
  "codingdevelopment": "productivity",
  "dataanalysis": "productivity",
  "researchsummarization": "chatbots",
  "productivityautomation": "productivity",
  "marketingsales": "marketing",
  "customersupport": "customer-support"
};

function formatSubcategoryPath(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

import {
  fetchTasks,
  AuthRequiredError,
  type Task,
  type Category,
  type Difficulty,
  type PricingModel,
  type SortOption,
  type FilterOption,
  type TaskListResponse,
} from "@/lib/tasks-api";
import { TaskFilters, type ShowFilter } from "./TaskFilters";
import { TaskCard } from "./TaskCard";
import { TaskSkeleton } from "./TaskSkeleton";
import { EmptyTasks } from "./EmptyTasks";
import { TaskErrorState } from "./TaskErrorState";
import { TaskAuthRequired } from "./TaskAuthRequired";

type TasksClientProps = {
  initialData?: TaskListResponse;
};

const COLUMN_LABELS = ["SUBSCRIBERS", "SAVES", "TOOLS", "MODELS", "ROBOTS", "DEVICES"];

function showFilterToApiFilter(show: ShowFilter): FilterOption {
  switch (show) {
    case "For You":
      return "for-you";
    case "Following":
      return "following";
    case "All Tasks":
    default:
      return "all";
  }
}

export function TasksClient({ initialData }: TasksClientProps) {
  const routeParams = useParams();
  const activeSubcategoryPath = routeParams?.category as string | undefined;
  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>(activeSubcategoryPath);

  useEffect(() => {
    setActiveSubcategory(activeSubcategoryPath);
  }, [activeSubcategoryPath]);

  const [tasks, setTasks] = useState<Task[]>(initialData?.tasks ?? []);
const [categories, setCategories] = useState<Category[]>(initialData?.categories ?? []);
const [total, setTotal] = useState(initialData?.total ?? 0);
const [page, setPage] = useState(initialData?.page ?? 1);
const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 1);

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState<ShowFilter>("All Tasks");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "ALL">("ALL");
  const [pricing, setPricing] = useState<PricingModel | "ALL">("ALL");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("newest");

  const sentinelRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categoryParam = activeSubcategory ? (SUBCATEGORY_SLUG_MAP[activeSubcategory] || activeSubcategory) : category;

  const queryParams = useMemo(
    () => ({
      q: search.trim() || undefined,
      category: categoryParam || undefined,
      difficulty: difficulty === "ALL" ? undefined : difficulty,
      pricing: pricing === "ALL" ? undefined : pricing,
      featuredOnly: featuredOnly || undefined,
      sort,
      filter: showFilterToApiFilter(showFilter),
    }),
    [search, categoryParam, category, difficulty, pricing, featuredOnly, sort, showFilter]
  );

  const loadPage = useCallback(
    async (pageNum: number, append: boolean) => {
      setIsFetching(true);
      setError(null);
      setAuthRequired(false);
      try {
        const data = await fetchTasks({ ...queryParams, page: pageNum });
        setTasks((prev) => (append ? [...prev, ...data.tasks] : data.tasks));
        setTotal(data.total);
        setPage(data.page);
        setTotalPages(data.totalPages);
        if (data.categories?.length) setCategories(data.categories);
      } catch (e) {
        if (e instanceof AuthRequiredError) {
          setAuthRequired(true);
          setTasks([]);
          setTotal(0);
        } else {
          setError(e instanceof Error ? e.message : "Failed to load tasks.");
        }
      } finally {
        setIsFetching(false);
      }
    },
    [queryParams]
  );

  useEffect(() => {
  if (initialData && search === "" && !category) {
    return;
  }

  if (debounceRef.current) clearTimeout(debounceRef.current);

  debounceRef.current = setTimeout(() => {
    loadPage(1, false);
  }, 300);

  return () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };
}, [queryParams]);

  const loadMore = useCallback(() => {
    if (isFetching || page >= totalPages) return;
    loadPage(page + 1, true);
  }, [isFetching, page, totalPages, loadPage]);

  useEffect(() => {
    if (isFetching || page >= totalPages || authRequired) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [isFetching, page, totalPages, loadMore, authRequired]);

  const isInitialLoading =
  isFetching &&
  tasks.length === 0 &&
  !error &&
  !authRequired;

  const subtitle = useMemo(() => {
    if (authRequired) return null;
    if (!category) {
      return (
        <>
          <span className="text-[#A1A1AA] font-medium tabular-nums">{total.toLocaleString()}</span> Tasks across all
          categories
        </>
      );
    }
    const activeCategory = categories.find((c) => c.slug === category);
    const categoryName = activeCategory?.name ?? category;
    return (
      <>
        <span className="text-[#A1A1AA] font-medium tabular-nums">{total.toLocaleString()}</span> {categoryName}{" "}
        Tasks
      </>
    );
  }, [category, categories, total, authRequired]);

  const emptyMessage = useMemo(() => {
    if (showFilter === "For You") {
      return "Like or save a few tasks and we'll start recommending more like them.";
    }
    if (showFilter === "Following") {
      return "You haven't subscribed to any tasks yet.";
    }
    return undefined;
  }, [showFilter]);

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

      {/* Sort control — now sits above the directory nav strip */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mx-auto w-full max-w-[1600px] flex justify-end">
          <div className="flex items-center gap-2 select-none">
            <span className="text-xs text-[#71717A]">
              Sort by
            </span>
            <div className="relative inline-flex items-center">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-xs font-semibold text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-7"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="alphabetical">Alphabetical</option>
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
              const isSelected = card.name.toLowerCase() === "tasks";

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



      <main className="w-full max-w-none px-6 lg:px-10 xl:px-14 py-4 flex-1">

        <header className="mb-4">
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="mt-1 text-sm text-[#A1A1AA]">{subtitle}</p>
        </header>

        <div className="mb-4">
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            showFilter={showFilter}
            onShowFilterChange={setShowFilter}
            categories={categories}
            category={category}
            onCategoryChange={setCategory}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            pricing={pricing}
            onPricingChange={setPricing}
            featuredOnly={featuredOnly}
            onFeaturedOnlyChange={setFeaturedOnly}
            sort={sort}
            onSortChange={setSort}
          />
        </div>

        {isInitialLoading ? (
          <TaskSkeleton />
        ) : authRequired ? (
          <TaskAuthRequired
            message={
              showFilter === "For You"
                ? "Sign in to see tasks picked for you."
                : "Sign in to see tasks you're following."
            }
          />
        ) : error && tasks.length === 0 ? (
          <TaskErrorState message={error} onRetry={() => loadPage(1, false)} />
        ) : tasks.length === 0 ? (
          <EmptyTasks message={emptyMessage} />
        ) : (
          <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#131316]/60 to-[#0D0D10]/60 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_20px_60px_-30px_rgba(0,0,0,0.8)] ring-1 ring-[#232326]/70">
            <div className="grid grid-cols-[48px_minmax(220px,1.6fr)_repeat(6,minmax(90px,1fr))] items-center gap-4 px-5 py-2.5 border-b border-[#232326]/70 bg-[#0A0A0C]/90 backdrop-blur-sm sticky top-0 z-10">
              <span />
              <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A]">Task</span>
              {COLUMN_LABELS.map((label) => (
                <span
                  key={label}
                  className="text-right text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A]"
                >
                  {label}
                </span>
              ))}
            </div>

            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {error && tasks.length > 0 && (
              <div className="px-5 py-3 text-xs text-red-400 border-t border-[#232326]/60">
                Failed to load more tasks: {error}
              </div>
            )}

            {page < totalPages && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-[#A78BFA]" />
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}