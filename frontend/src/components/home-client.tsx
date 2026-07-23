'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import User from 'lucide-react/dist/esm/icons/user';
import Palette from 'lucide-react/dist/esm/icons/palette';

import { API_URL } from "@/lib/api";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { SortDropdown } from "@/components/SortDropdown";
import { ToolListView } from "@/components/ToolListView";

import type { SortOption } from "@/lib/types";

const DIRECTORY_CARDS = [
  { name: "Tools", href: "/tools", description: "Browse the full AI tools directory, filter by category and pricing.", icon: Wrench, color: "#FFC53D" },
  { name: "Tasks", href: "/tasks", description: "Find the right AI tool for a specific job to be done.", icon: ListChecks, color: "#FB923C" },
  { name: "Personal", href: "/tasks/personal", description: "Browse Personal AI Tasks.", icon: User, color: "#A78BFA" },
  { name: "Creativity", href: "/tasks/creativity", description: "Browse Creative AI Tasks.", icon: Palette, color: "#FFC53D" },
  { name: "Companies", href: "/companies", description: "Explore the labs and startups building the AI ecosystem.", icon: Building2, color: "#38BDF8" },
  { name: "News", href: "/news", description: "The latest announcements and coverage across the AI world.", icon: Newspaper, color: "#FF6B4A" },
  { name: "Videos", href: "/videos", description: "Watch demos, reviews, and deep dives on the latest AI tools.", icon: PlayCircle, color: "#F87171" },
  { name: "Robots", href: "/robots", description: "Robotics platforms and the companies behind them.", icon: Bot, color: "#2DD4BF" },
  { name: "Devices", href: "/devices", description: "Hardware built for and powered by AI.", icon: Smartphone, color: "#F472B6" },
  { name: "Models", href: "/models", description: "Compare context windows, pricing, and benchmarks across AI models.", icon: Cpu, color: "#A78BFA" },
  { name: "Repositories", href: "/repositories", description: "Trending open-source AI repositories on GitHub.", icon: GitBranch, color: "#22D3EE" },
  { name: "MCP", href: "/tools", description: "Model Context Protocol servers and integrations.", icon: Plug, color: "#818CF8" },
  { name: "Collections", href: "/collections", description: "Curated bundles of tools grouped by use case.", icon: FolderHeart, color: "#34D399" },
  // { name: "Personal", href: "/tools?category=personal", description: "AI tools for personal productivity and everyday life.", icon: UserCircle, color: "#FBBF24" },
  // { name: "Creativity", href: "/tools?category=creativity", description: "AI tools for art, design, writing, and creative work.", icon: Palette, color: "#E879F9" },
] as const;

const PERSONAL_CATEGORIES = [
  "Productivity",
  "Chatbots",
  "Writing",
  "Audio",
  "Customer Support",
  "Video",
  "Image Generation",
  "Marketing"
];

const CREATIVITY_CATEGORIES = [
  "Image Generation",
  "Video",
  "Audio",
  "Marketing",
  "Design",
  "Productivity",
  "Chatbots",
  "Customer Support"
];

export function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedMode, setExpandedMode] = useState<'personal' | 'creativity' | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [tools, setTools] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const toSlug = (name: string): string => {
    return name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");
  };

  const toggleExpanded = (mode: 'personal' | 'creativity', e: React.MouseEvent<HTMLButtonElement>) => {
    const next = expandedMode === mode ? null : mode;
    setExpandedMode(next);
    setActiveSubcategory(null);
    const search = new URLSearchParams(window.location.search);
    search.delete("category");
    router.push(`/?${search.toString()}`);
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  };

  const handleInlineCategoryClick = (categoryName: string, e: React.MouseEvent<HTMLButtonElement>) => {
    let slug = toSlug(categoryName);
    if (categoryName === "Writing") slug = "productivity";
    if (categoryName === "Design") slug = "image-generation";

    const nextSub = activeSubcategory === categoryName ? null : categoryName;
    setActiveSubcategory(nextSub);

    const search = new URLSearchParams(window.location.search);
    if (nextSub === null) {
      search.delete("category");
    } else {
      search.set("category", slug);
    }
    router.push(`/?${search.toString()}`);
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  };


  // Build params object from URL search params
  const params = {
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    pricing: searchParams.get("pricing") || undefined,
    sort: (searchParams.get("sort") || undefined) as SortOption | undefined,
  };

  const filterKey = `${params.q || ''}-${params.category || ''}-${params.pricing || ''}-${params.sort || ''}`;

  // Reset page and tools when filters change
  useEffect(() => {
    // eslint-disable-next-line
    setTools([]);
    setPage(1);
    setTotalPages(1);
  }, [filterKey]);

  useEffect(() => {
    async function fetchData() {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }
      try {
        const query = new URLSearchParams();
        if (params.q) query.set("q", params.q);
        if (params.category) query.set("category", params.category);
        if (params.pricing) query.set("pricing", params.pricing);
        if (params.sort) query.set("sort", params.sort);
        query.set("page", page.toString());

        const toolsRes = await fetch(`${API_URL}/api/v1/tools?${query.toString()}`);

        if (toolsRes.ok) {
          const toolsData = await toolsRes.json();
          if (page === 1) {
            setTools(toolsData.tools || []);
          } else {
            setTools(prev => [...prev, ...(toolsData.tools || [])]);
          }
          setTotalPages(toolsData.totalPages || 1);
        }
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  // IntersectionObserver for endless scrolling
  useEffect(() => {
    if (isLoading || isFetchingMore || page >= totalPages) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [isLoading, isFetchingMore, page, totalPages]);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Hero Section */}
      <section
        className="relative w-full flex flex-col items-center pt-6 pb-10 px-6 overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(35, 35, 38, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* ambient signal glow behind headline */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.12] blur-[100px]"
          style={{ backgroundColor: 'var(--color-signal)' }}
        />

        <div className="mx-auto max-w-[1440px] w-full flex flex-col items-center text-center relative z-10">
          <h1 className="max-w-[820px] text-2xl sm:text-4xl lg:text-[48px] font-black tracking-tight leading-[1.1] mb-6 sm:mb-8 select-none text-white text-balance">
            The best AI, in one signal.
          </h1>

          <form action="/tools" method="GET" className="relative w-full max-w-[640px] mx-auto mb-4 sm:mb-5 group">
            <div
              className="relative w-full rounded-xl border border-[#232326]/70 bg-[#111113] h-[44px] sm:h-[52px] flex items-center px-4 sm:px-5 pr-[4.5rem] transition-colors duration-150"
              style={{ borderColor: undefined }}
            >
              <Search size={15} className="mr-2.5 sm:mr-3 text-[#71717A] shrink-0" />
              <input
                type="text"
                name="q"
                defaultValue={params.q}
                placeholder="Search AI tools, models, companies…"
                className="w-full bg-transparent text-[13px] sm:text-[14px] text-white placeholder:text-[#71717A] focus:outline-none"
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
          <SortDropdown />
        </div>
      </div>

        {/* Directory nav strip — single row, sits just above the tools list */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-1">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex flex-nowrap items-stretch gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none w-full">
            {DIRECTORY_CARDS.map((card) => {
              const Icon = card.icon;
              const isPersonal = card.name === "Personal";
              const isCreativity = card.name === "Creativity";

              if (isPersonal || isCreativity) {
                const isSelected = expandedMode === (isPersonal ? "personal" : "creativity");
                return (
                  <button
                    key={card.name}
                    type="button"
                    onClick={(e) => toggleExpanded(isPersonal ? "personal" : "creativity", e)}
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
                    <span className="text-[10px] sm:text-[11.5px] font-bold tracking-tight text-white whitespace-nowrap">
                      {card.name}
                    </span>
                  </button>
                );
              }

              return (
                <a
                  key={card.name}
                  href={card.href}
                  className="group flex flex-1 min-w-[76px] sm:min-w-[92px] shrink-0 flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-[#232326]/60 bg-[#0d0d10] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center transition-colors duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
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
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Parallel Secondary Categories Row */}
      {expandedMode !== null && (
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-2.5 pb-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="mx-auto w-full max-w-[1600px] flex justify-start md:justify-center">
            <div className={`flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-none py-2 bg-[#0d0d10] border rounded-xl px-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] max-w-full transition-all duration-300 ${
              expandedMode === "personal" ? "border-[#A78BFA]/30" : "border-[#FFC53D]/30"
            }`}>
              {(expandedMode === "personal" ? PERSONAL_CATEGORIES : CREATIVITY_CATEGORIES).map((cat) => {
                const isSelected = activeSubcategory === cat;
                const activeBg = expandedMode === "personal" ? "bg-[#A78BFA]" : "bg-[#FFC53D]";
                const activeShadow = expandedMode === "personal" ? "shadow-[0_2px_8px_rgba(167,139,250,0.4)]" : "shadow-[0_2px_8px_rgba(255,197,61,0.4)]";
                const hoverBorder = expandedMode === "personal" ? "hover:border-[#A78BFA]/40" : "hover:border-[#FFC53D]/40";

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={(e) => handleInlineCategoryClick(cat, e)}
                    className={`rounded-full px-3 py-1 text-[9.5px] font-bold whitespace-nowrap transition-colors duration-200 border ${
                      isSelected
                        ? `${activeBg} text-black border-transparent ${activeShadow}`
                        : `text-neutral-400 hover:text-white bg-transparent border-transparent ${hoverBorder} hover:bg-white/[0.02]`
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tools Section — full width so the data table can use the whole screen */}
      <div id="tools" className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-2 pb-2">
        <div className="mx-auto w-full max-w-[1600px] space-y-3">
          <ToolListView
            tools={tools}
            loading={isLoading && page === 1}
          />

          {/* Sentinel for infinite scroll */}
          {tools.length > 0 && page < totalPages && (
            <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          )}
        </div>
      </div>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}