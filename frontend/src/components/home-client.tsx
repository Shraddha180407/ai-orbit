'use client';

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
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

import { API_URL } from "@/lib/api";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSearchBar } from "@/components/HeroSearchBar";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { SortDropdown } from "@/components/SortDropdown";
import { ToolListView } from "@/components/ToolListView";

import type { SortOption } from "@/lib/types";

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
] as const;

export function HomeClient() {
  const searchParams = useSearchParams();

  const [tools, setTools] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

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
        className="relative w-full flex flex-col items-center pt-16 pb-10 px-6"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(35, 35, 38, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* ambient signal glow behind headline — clipped to this layer only,
            so it doesn't constrain the search dropdown's overlay below */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.12] blur-[100px]"
            style={{ backgroundColor: 'var(--color-signal)' }}
          />
        </div>

        <div className="mx-auto max-w-[1440px] w-full flex flex-col items-center text-center relative z-10">
          <h1 className="max-w-[820px] text-3xl sm:text-5xl lg:text-[64px] font-black tracking-tight leading-[1.05] mb-6 sm:mb-8 select-none text-white text-balance">
            The best AI, in one signal.
          </h1>

          <p className="max-w-xl text-[15px] sm:text-base text-[#A1A1AA] leading-relaxed mb-8 select-none">
            Cut through the noise. Discover, compare, and track the AI tools,
            models, and companies that actually matter.
          </p>

          <HeroSearchBar defaultValue={params.q} />

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

      {/* Directory nav strip — single row, evenly spread, sits just above the tools list */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-1">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex flex-nowrap items-stretch gap-1.5 sm:gap-2 overflow-x-auto">
            {DIRECTORY_CARDS.map((card) => {
              const Icon = card.icon;
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
                  <span className="text-[10px] sm:text-[11.5px] font-bold tracking-tight text-white whitespace-nowrap">
                    {card.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

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