'use client';

import React, { useEffect, useLayoutEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
let globalHeroScrollPos = 0;
import Search from 'lucide-react/dist/esm/icons/search';
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
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';

import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { SortDropdown } from "@/components/SortDropdown";
import { Logo } from "@/components/ui/Logo";
import { ENTITY_META } from "@/lib/entityMeta";
import { useHomeSearch } from "@/hooks/useHomeSearch";
import type { RealSearchSuggestion } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL, fetchAllCompanies, fetchAllRobots, fetchAllDevices, fetchModels, fetchRepositories, fetchMCPItems, prefetchUrl } from "@/lib/api";
import { fetchTasks as fetchTasksApi } from "@/lib/tasks-api";

// NEW: Import the unified filter dropdown
import { UnifiedFilterDropdown } from "@/components/UnifiedFilterDropdown";
import { scrollChipIntoView } from "@/lib/utils";

function getSuggestionHref(s: RealSearchSuggestion): string {
  const meta = ENTITY_META[s.type];
  if (!s.slug) return `${meta.basePath}?q=${encodeURIComponent(s.title)}`;

  switch (s.type) {
    case "tool": return `/p/tools/${s.slug}`;
    case "company": return `/p/companies/${s.slug}`;
    case "repository": return `/p/repositories/${s.slug}`;
    case "robot": return `/p/robots/${s.slug}`;
    case "device": return `/p/devices/${s.slug}`;
    case "model": return `/models/${s.slug}`;
    case "news": return `/p/news/${s.slug}`;
    case "video": return `/p/videos/${s.slug}`;
    case "task": return `/p/tasks/${s.slug}`;
    case "mcp": return `/p/mcp/${s.slug}`;
    default: return `${meta.basePath}?q=${encodeURIComponent(s.title)}`;
  }
}

const QUICK_LINKS = [
  { label: "Trending", href: "/search/trending", icon: TrendingUp, color: "#34D399" },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy, color: "#FBBF24" },
];

/** Max rows shown per entity-type group before collapsing behind "View N more". */
const MAX_ROWS_PER_GROUP = 4;

/**
 * Groups flat autocomplete suggestions into per-entity-type buckets,
 * preserving the order types first appear in (suggestions already arrive
 * relevance-sorted from the backend), so the most relevant category leads.
 */
function groupSuggestionsByType(
  suggestions: RealSearchSuggestion[]
): [RealSearchSuggestion["type"], RealSearchSuggestion[]][] {
  const groups = new Map<RealSearchSuggestion["type"], RealSearchSuggestion[]>();
  for (const s of suggestions) {
    const bucket = groups.get(s.type);
    if (bucket) {
      bucket.push(s);
    } else {
      groups.set(s.type, [s]);
    }
  }
  return Array.from(groups.entries());
}

// "Browse by type" — mirrors the entity types the backend indexes.
// "Browse by type" section in the empty-query dropdown reuses DIRECTORY_CARDS
// directly (defined below) so its icons/colors always match the nav strip.

const DIRECTORY_CARDS = [
  { name: "New", href: "/", description: "Discover the newest AI additions.", icon: Sparkles, color: "#6E56CF" },
  { name: "Tools", href: "/tools", description: "Browse the full AI tools directory, filter by category and pricing.", icon: Wrench, color: "#FFC53D" },
  { name: "Agents", href: "/agents", description: "Discover autonomous AI agents for business, automation, and research.", icon: Bot, color: "#A855F7" },
  { name: "Tasks", href: "/tasks", description: "Find the right AI tool for a specific job to be done.", icon: ListChecks, color: "#FB923C" },
  { name: "Companies", href: "/companies", description: "Explore the labs and startups building the AI ecosystem.", icon: Building2, color: "#38BDF8" },
  { name: "News", href: "/news", description: "The latest announcements and coverage across the AI world.", icon: Newspaper, color: "#FF6B4A" },
  { name: "Videos", href: "/videos", description: "Watch demos, reviews, and deep dives on the latest AI tools.", icon: PlayCircle, color: "#F87171" },
  { name: "Robots", href: "/robots", description: "Robotics platforms and the companies behind them.", icon: Bot, color: "#2DD4BF" },
  { name: "Devices", href: "/devices", description: "Hardware built for and powered by AI.", icon: Smartphone, color: "#F472B6" },
  { name: "Models", href: "/models", description: "Compare context windows, pricing, and benchmarks across AI models.", icon: Cpu, color: "#A78BFA" },
  { name: "Repositories", href: "/repositories", description: "Trending open-source AI repositories on GitHub.", icon: GitBranch, color: "#22D3EE" },
  { name: "MCP", href: "/mcp", description: "Model Context Protocol servers and integrations.", icon: Plug, color: "#818CF8" },
  { name: "Personal", href: "/personal", description: "AI tools for personal productivity and everyday life.", icon: UserCircle, color: "#FBBF24" },
  { name: "Creativity", href: "/creativity", description: "AI tools for art, design, writing, and creative work.", icon: Palette, color: "#E879F9" },
] as const;

const DIRECTORY_CARD_BY_NAME: Record<string, (typeof DIRECTORY_CARDS)[number]> = Object.fromEntries(
  DIRECTORY_CARDS.map((c) => [c.name, c])
);
export function GlobalHero({ searchAction = "/tools" }: { searchAction?: string } = {}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const q = searchParams.get("q") || "";
  const hoverTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Scroll active nav tab to center on mobile when pathname changes
  const navStripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;
    // Double rAF: wait for React to paint the new active tab before measuring
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = navStripRef.current;
        if (!container) return;
        const activeBtn = container.querySelector<HTMLElement>('[data-active="true"]');
        if (!activeBtn) return;
        const cRect = container.getBoundingClientRect();
        const bRect = activeBtn.getBoundingClientRect();
        const bLeft = bRect.left - cRect.left + container.scrollLeft;
        const scrollTarget = bLeft - (container.clientWidth / 2) + (bRect.width / 2);
        container.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
      });
    });
  }, [pathname]);

  const prefetchCategory = (cardName: string, href: string) => {
    // ... [Prefetch logic remains identical]
    switch (cardName) {
      case "New":
        queryClient.prefetchInfiniteQuery({
          queryKey: ["home-tools", { q: undefined, category: undefined, pricing: undefined, sort: undefined }],
          queryFn: async () => {
            const res = await fetch(`${API_URL}/api/v1/tools?page=1&pageSize=50`);
            return res.ok ? res.json() : { tools: [], totalPages: 1, page: 1 };
          },
          initialPageParam: 1,
          staleTime: 10 * 60 * 1000,
        }).catch(() => { });
        break;
      case "Tools":
      case "Agents":
      case "Personal":
      case "Creativity":
        queryClient.prefetchInfiniteQuery({
          queryKey: ["tools", cardName.toLowerCase(), "", undefined, undefined, undefined],
          queryFn: async () => {
            const res = await fetch(`${API_URL}/api/v1/tools?page=1`);
            return res.ok ? res.json() : { tools: [], totalPages: 1, page: 1 };
          },
          initialPageParam: 1,
          staleTime: 15 * 60 * 1000,
        }).catch(() => { });
        break;
      case "Companies":
        queryClient.prefetchQuery({ queryKey: ["companies"], queryFn: fetchAllCompanies, staleTime: 10 * 60 * 1000 }).catch(() => { });
        break;
      case "Robots":
        queryClient.prefetchQuery({ queryKey: ["robots"], queryFn: async () => { const r = await fetchAllRobots(); return r && r.length > 0 ? r : null; }, staleTime: 10 * 60 * 1000 }).catch(() => { });
        break;
      case "Devices":
        queryClient.prefetchQuery({ queryKey: ["devices"], queryFn: async () => { const d = await fetchAllDevices({}); return d && d.length > 0 ? d : null; }, staleTime: 10 * 60 * 1000 }).catch(() => { });
        break;
      case "Models":
        queryClient.prefetchInfiniteQuery({
          queryKey: ["models", { subCategory: null, sort: "newest" }],
          queryFn: () => fetchModels({ page: 1, sort: "newest" as any }),
          initialPageParam: 1,
          staleTime: 10 * 60 * 1000,
        }).catch(() => { });
        break;
      case "News":
        queryClient.prefetchQuery({
          queryKey: ["news-list", "all", undefined],
          queryFn: async () => {
            const res = await fetch(`${API_URL}/api/news?page=1&perPage=50`);
            return res.ok ? res.json() : null;
          },
          staleTime: 10 * 60 * 1000,
        }).catch(() => { });
        break;
      case "Videos":
        queryClient.prefetchQuery({
          queryKey: ["videos", { sort: "latest", page: 1 }],
          queryFn: async () => {
            const res = await fetch(`${API_URL}/api/videos?sort=latest&limit=24&offset=0`);
            return res.ok ? res.json() : [];
          },
          staleTime: 10 * 60 * 1000,
        }).catch(() => { });
        break;
      case "Tasks":
        queryClient.prefetchInfiniteQuery({
          queryKey: ["tasks", { sort: "newest", filter: "all", category: undefined }],
          queryFn: () => fetchTasksApi({ sort: "newest", filter: "all", page: 1 }),
          initialPageParam: 1,
          staleTime: 10 * 60 * 1000,
        }).catch(() => { });
        break;
      case "Repositories":
        queryClient.prefetchInfiniteQuery({
          queryKey: ["repositories", { q: "", sort: "stars", order: "desc", topic: undefined, owner: undefined, subCategory: undefined }],
          queryFn: () => fetchRepositories({ sort: "stars_desc", limit: 15 }),
          initialPageParam: null,
          staleTime: 10 * 60 * 1000,
        }).catch(() => { });
        break;
      case "MCP":
        queryClient.prefetchInfiniteQuery({
          queryKey: ["mcpItems", { q: "", subCategory: "" }],
          queryFn: () => fetchMCPItems({ page: 1, limit: 20 }),
          initialPageParam: 1,
          staleTime: 10 * 60 * 1000,
        }).catch(() => { });
        break;
    }
  };

  const handlePointerEnter = (cardName: string, href: string) => {
    try { router.prefetch(href); } catch { }
    if (hoverTimeoutRef.current[cardName]) clearTimeout(hoverTimeoutRef.current[cardName]);
    hoverTimeoutRef.current[cardName] = setTimeout(() => {
      prefetchCategory(cardName, href);
    }, 75);
  };

  const handlePointerLeave = (cardName: string) => {
    if (hoverTimeoutRef.current[cardName]) {
      clearTimeout(hoverTimeoutRef.current[cardName]);
      delete hoverTimeoutRef.current[cardName];
    }
  };

  useEffect(() => {
    // Immediately prefetch Next.js JS route bundles for all directory cards
    DIRECTORY_CARDS.forEach((card) => {
      try { router.prefetch(card.href); } catch { }
    });

    // Prefetch API data for directory cards in background after short idle delay
    const timer = setTimeout(() => {
      DIRECTORY_CARDS.forEach((card) => {
        prefetchCategory(card.name, card.href);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [router]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(q);
  const searchContainerRef = useRef<HTMLFormElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { suggestions: rawSuggestions, isLoading } = useHomeSearch(searchValue);
  // Collections aren't surfaced in the search dropdown.
  const suggestions = rawSuggestions.filter((s) => s.type !== "collection");
  const showSuggestions = searchValue.trim().length > 0;

  const runSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set("q", query);
    else params.delete("q");
    setSearchOpen(false);
    router.push(`${searchAction}?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    runSearch(searchValue);
  };

  useEffect(() => {
    if (!searchOpen) return;
    function handleClick(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        searchInputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [searchOpen]);

  useEffect(() => {
    function handleShortcut(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isCardActive = (card: (typeof DIRECTORY_CARDS)[number]) => {
    if (!pathname) return false;
    if (card.name === "New") {
      return pathname === "/";
    }
    const categoryParam = searchParams.get("category");
    if (card.name === "Tools") {
      return (
        (pathname === "/tools" || (pathname.startsWith("/tools") && !pathname.startsWith("/tools/mcp") && !pathname.startsWith("/tools/compare") && categoryParam !== "agents")) ||
        pathname.startsWith("/p/tools/")
      );
    }
    if (card.name === "Agents") {
      return pathname === "/agents" || pathname.startsWith("/agents") || pathname.startsWith("/p/agents/") || (pathname.startsWith("/tools") && categoryParam === "agents");
    }
    if (card.name === "Tasks") {
      return (pathname === "/tasks" || pathname.startsWith("/p/tasks/")) && pathname !== "/tasks/personal" && pathname !== "/tasks/creativity";
    }
    if (card.name === "Personal") {
      return pathname === "/tasks/personal" || pathname === "/personal" || pathname.startsWith("/personal") || pathname.startsWith("/p/personal/");
    }
    if (card.name === "Creativity") {
      return pathname === "/tasks/creativity" || pathname === "/creativity" || pathname.startsWith("/creativity") || pathname.startsWith("/p/creativity/");
    }
    const entityName = card.href.replace("/", "");
    return pathname.startsWith(card.href) || pathname.startsWith(`/p/${entityName}`);
  };  const SCROLL_KEY = "global_hero_card_scroll_x";

  const handleContainerScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      globalHeroScrollPos = container.scrollLeft;
      try {
        sessionStorage.setItem(SCROLL_KEY, container.scrollLeft.toString());
      } catch {}
    }
  };

  const saveScrollPos = () => {
    const container = scrollContainerRef.current;
    if (container) {
      globalHeroScrollPos = container.scrollLeft;
      try {
        sessionStorage.setItem(SCROLL_KEY, container.scrollLeft.toString());
      } catch {}
    }
  };

  const setScrollContainerRef = useCallback((el: HTMLDivElement | null) => {
    scrollContainerRef.current = el;
    if (el) {
      let targetPos = globalHeroScrollPos;
      if (!targetPos) {
        try {
          const savedPos = sessionStorage.getItem(SCROLL_KEY);
          if (savedPos !== null && !isNaN(Number(savedPos))) {
            targetPos = Number(savedPos);
          }
        } catch {}
      }
      if (targetPos) {
        el.scrollLeft = targetPos;
      }
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let targetPos = globalHeroScrollPos;
    if (!targetPos) {
      try {
        const savedPos = sessionStorage.getItem(SCROLL_KEY);
        if (savedPos !== null && !isNaN(Number(savedPos))) {
          targetPos = Number(savedPos);
        }
      } catch {}
    }

    if (targetPos) {
      container.scrollLeft = targetPos;
    } else {
      const activeIndex = DIRECTORY_CARDS.findIndex((c) => isCardActive(c));
      if (activeIndex !== -1 && cardRefs.current[activeIndex]) {
        scrollChipIntoView(container, cardRefs.current[activeIndex]!, false);
      }
    }
  }, [pathname]);

  // Helper to render the actual pill card UI
  const renderCard = (card: typeof DIRECTORY_CARDS[number], index: number) => {
    const Icon = card.icon;
    const isSelected = isCardActive(card);
    const isNew = card.name === "New";

    return (
      <Link
        href={card.href}
        prefetch={true}
        scroll={false}
        onPointerDown={() => {
          saveScrollPos();
          try { router.prefetch(card.href); } catch { }
          prefetchCategory(card.name, card.href);
        }}
        onTouchStart={() => {
          saveScrollPos();
          try { router.prefetch(card.href); } catch { }
          prefetchCategory(card.name, card.href);
        }}
        onClick={(e) => {
          saveScrollPos();
          e.currentTarget.blur();
          const container = scrollContainerRef.current;
          if (container && globalHeroScrollPos > 0) {
            container.scrollLeft = globalHeroScrollPos;
          }
        }}
        className={`group flex flex-1 min-w-[76px] sm:min-w-[92px] shrink-0 flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-lg border px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center transition-all duration-200 relative overflow-hidden ${isNew && isSelected ? "border-transparent" : "border-[#232326]/60 bg-[#0d0d10]"
          }`}
        data-active={isSelected ? "true" : undefined}
        onPointerEnter={(e) => {
          handlePointerEnter(card.name, card.href);
          if (!(isNew && isSelected)) e.currentTarget.style.borderColor = card.color;
          e.currentTarget.style.boxShadow = `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55`;
        }}
        onPointerLeave={(e) => {
          handlePointerLeave(card.name);
          if (!isSelected) {
            e.currentTarget.style.borderColor = "";
            e.currentTarget.style.boxShadow = "";
          }
        }}
        onFocus={() => handlePointerEnter(card.name, card.href)}
        style={
          isSelected && !isNew
            ? { borderColor: card.color, boxShadow: `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55` }
            : undefined
        }
      >
        {isNew && isSelected && (
          <>
            <div
              className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] opacity-70"
              style={{ background: `conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 60%, ${card.color} 100%)` }}
            />
            <div className="absolute inset-[1px] rounded-[7px] bg-[#0d0d10]" />
          </>
        )}
        <div
          className="relative z-10 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md border transition-colors"
          style={{ backgroundColor: `${card.color}1a`, borderColor: `${card.color}40` }}
        >
          <Icon size={10} strokeWidth={1.75} style={{ color: card.color }} />
        </div>
        <span className="relative z-10 text-[9px] sm:text-[10.5px] font-bold tracking-tight text-white whitespace-nowrap">
          {card.name}
        </span>
      </Link>
    );
  };

  return (
    <section
      className="relative z-30 w-full flex flex-col items-center pb-2 max-w-full overflow-x-clip"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(35, 35, 38, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] sm:h-[450px] rounded-full opacity-[0.11] blur-[100px] sm:blur-[130px]"
          style={{ backgroundColor: 'var(--color-signal)' }}
        />
      </div>

      {/* Hero Header & Search Section */}
      <div className="w-full flex flex-col items-center pt-4 pb-4 px-3 sm:px-6 relative z-30">
        <div className="mx-auto max-w-[1440px] w-full flex flex-col items-center text-center relative z-20">
          <h1 className="max-w-[820px] text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.15] mb-3.5 sm:mb-6 select-none text-white text-balance">
            The Home of Everything AI
          </h1>

          <form
            action={searchAction}
            method="GET"
            onSubmit={handleSubmit}
            ref={searchContainerRef}
            className="relative z-40 w-full max-w-[520px] mx-auto mb-4 sm:mb-5 group"
          >
            <div
              className="relative w-full rounded-xl border border-[#232326]/70 bg-[#111113] h-[38px] sm:h-[42px] flex items-center px-3.5 sm:px-4 pr-[4.5rem] transition-colors duration-150"
              style={{ borderColor: undefined }}
            >
              <Search size={13} className="mr-2 sm:mr-2.5 text-[#71717A] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                name="q"
                autoComplete="off"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search AI tools, models, companies…"
                onFocus={() => setSearchOpen(true)}
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

            {searchOpen && (
              <div className="search-scope absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[min(380px,calc(100vh-200px))] overflow-y-auto overscroll-contain rounded-xl border border-search-border bg-search-bg shadow-2xl shadow-black/60 text-left">
                {showSuggestions ? (
                  <div className="p-2">
                    {isLoading ? (
                      <div className="space-y-2 p-2">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="h-9 w-full animate-pulse rounded-md bg-search-surface-active" />
                        ))}
                      </div>
                    ) : suggestions.length === 0 ? (
                      <div className="p-6 text-center text-sm text-search-text-secondary">
                        No matches for &ldquo;{searchValue}&rdquo;.{" "}
                        <button
                          type="button"
                          onClick={() => runSearch(searchValue)}
                          className="text-search-accent hover:text-search-accent-hover"
                        >
                          Search anyway
                        </button>
                      </div>
                    ) : (
                      <>
                        {groupSuggestionsByType(suggestions).map(([type, items]) => {
                          const meta = ENTITY_META[type];
                          const dirCard = DIRECTORY_CARD_BY_NAME[meta.plural];
                          const GroupIcon = dirCard?.icon ?? meta.icon;
                          const groupColor = dirCard?.color ?? meta.solidColor;
                          const visible = items.slice(0, MAX_ROWS_PER_GROUP);
                          const remaining = items.length - visible.length;
                          return (
                            <div key={type} className="mb-1 last:mb-0">
                              {/* Section header, e.g. "Companies" — icon + badge match the nav strip (DIRECTORY_CARDS) exactly */}
                              <div className="sticky top-0 z-10 mb-1 flex items-center gap-2 rounded-md border-y border-search-border/60 bg-search-surface-active px-2.5 py-2 text-[11px] font-bold uppercase tracking-wider text-search-text-secondary">
                                <span
                                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border"
                                  style={{ backgroundColor: `${groupColor}1a`, borderColor: `${groupColor}40` }}
                                >
                                  <GroupIcon size={14} style={{ color: groupColor }} aria-hidden="true" />
                                </span>
                                {meta.plural}
                              </div>
                              {visible.map((s) => (
                                <Link
                                  key={`${s.type}-${s.id}`}
                                  href={getSuggestionHref(s)}
                                  // 👇 OUR PREFETCH LOGIC MERGED INTO THE NEW UI
                                  onPointerEnter={() => {
                                    if (s.slug) {
                                      if (s.type === "tool") prefetchUrl(`${API_URL}/api/v1/tools/${s.slug}`);
                                      else if (s.type === "company") prefetchUrl(`${API_URL}/api/v1/companies/${s.slug}`);
                                      else if (s.type === "model") prefetchUrl(`${API_URL}/api/v1/models/${encodeURIComponent(s.slug)}`);
                                      else if (s.type === "robot") prefetchUrl(`${API_URL}/api/v1/robots/${s.slug}`);
                                      else if (s.type === "device") prefetchUrl(`${API_URL}/api/v1/devices/${s.slug}`);
                                      else if (s.type === "repository") prefetchUrl(`${API_URL}/api/v1/repositories/${s.slug}`);
                                    }
                                  }}
                                  onClick={() => setSearchOpen(false)}
                                  className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm hover:bg-search-surface-hover"
                                >
                                  <Logo
                                    src={s.logoUrl}
                                    name={s.title}
                                    size={22}
                                    className="shrink-0 rounded-md"
                                  />
                                  <span className="flex-1 truncate text-search-text-primary">{s.title}</span>
                                </Link>
                              ))}
                              {remaining > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchOpen(false);
                                    const params = new URLSearchParams(searchParams.toString());
                                    if (searchValue.trim()) params.set("q", searchValue);
                                    router.push(`${meta.basePath}?${params.toString()}`);
                                  }}
                                  className="flex w-full items-center justify-center rounded-md px-2.5 py-1.5 text-xs text-search-text-tertiary hover:bg-search-surface-hover hover:text-search-text-primary"
                                >
                                  View {remaining} more
                                </button>
                              )}
                            </div>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => runSearch(searchValue)}
                          className="mt-1 flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm text-search-accent hover:bg-search-surface-hover"
                        >
                          See all results for &ldquo;{searchValue}&rdquo;
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="border-b border-search-border p-2">
                      {QUICK_LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-search-text-primary hover:bg-search-surface-hover"
                          >
                            <span
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border"
                              style={{ backgroundColor: `${link.color}1a`, borderColor: `${link.color}40` }}
                            >
                              <Icon size={14} style={{ color: link.color }} />
                            </span>
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="p-2">
                      {DIRECTORY_CARDS.filter((card) => card.name !== "New").map((card) => {
                        const Icon = card.icon;
                        return (
                          <Link
                            key={card.name}
                            href={card.href}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-search-text-primary hover:bg-search-surface-hover"
                          >
                            <span
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border"
                              style={{ backgroundColor: `${card.color}1a`, borderColor: `${card.color}40` }}
                            >
                              <Icon size={14} style={{ color: card.color }} />
                            </span>
                            {card.name}
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </form>

          <div className="mb-3">
            <HeroFeatureChips />
          </div>
        </div>
      </div>

      <div className="border-b border-[#232326]/40 w-full z-10 relative" />

      {/* Directory nav strip */}
      <div className="w-full px-3 sm:px-6 lg:px-8 pt-2 pb-1 relative z-10 max-w-full overflow-hidden flex justify-center">
        <div className="mx-auto w-full max-w-[1600px] overflow-hidden flex justify-center">
          <div
            ref={setScrollContainerRef}
            onScroll={handleContainerScroll}
            className="flex flex-nowrap items-stretch gap-1.5 sm:gap-2 touch-scroll-x scrollbar-none w-full max-w-full overflow-x-auto py-1 scroll-px-0 overscroll-x-contain"
          >
            {DIRECTORY_CARDS.map((card, index) => {
              const cardEl = renderCard(card, index);
              if (card.name === "New") {
                return (
                  <div
                    key={card.name}
                    ref={(el) => { cardRefs.current[index] = el; }}
                    className="shrink-0 flex items-stretch"
                  >
                    <UnifiedFilterDropdown>
                      {cardEl}
                    </UnifiedFilterDropdown>
                  </div>
                );
              }
              return (
                <div
                  key={card.name}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  className="shrink-0 flex items-stretch"
                >
                  {cardEl}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}