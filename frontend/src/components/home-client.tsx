'use client';

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Search from 'lucide-react/dist/esm/icons/search';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import FolderHeart from 'lucide-react/dist/esm/icons/folder-heart';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';
import GitBranch from 'lucide-react/dist/esm/icons/git-branch';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import Bot from 'lucide-react/dist/esm/icons/bot';
import Landmark from 'lucide-react/dist/esm/icons/landmark';

import { API_URL } from "@/lib/api";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { SortDropdown } from "@/components/SortDropdown";
import { ToolListView } from "@/components/ToolListView";

import type { SortOption } from "@/lib/types";

const DIRECTORY_CARDS = [
  { name: "Tools", href: "/tools", description: "Browse the full AI tools directory, filter by category and pricing.", icon: Wrench, color: "#FFC53D" },
  { name: "Models", href: "/models", description: "Compare context windows, pricing, and benchmarks across AI models.", icon: Cpu, color: "#A78BFA" },
  { name: "Companies", href: "/companies", description: "Explore the labs and startups building the AI ecosystem.", icon: Building2, color: "#38BDF8" },
  { name: "Collections", href: "/collections", description: "Curated bundles of tools grouped by use case.", icon: FolderHeart, color: "#34D399" },
  { name: "News", href: "/news", description: "The latest announcements and coverage across the AI world.", icon: Newspaper, color: "#FF6B4A" },
  { name: "Repositories", href: "/repositories", description: "Trending open-source AI repositories on GitHub.", icon: GitBranch, color: "#22D3EE" },
  { name: "Devices", href: "/devices", description: "Hardware built for and powered by AI.", icon: Smartphone, color: "#F472B6" },
  { name: "Robots", href: "/robots", description: "Robotics platforms and the companies behind them.", icon: Bot, color: "#2DD4BF" },
  { name: "Investors", href: "/investors", description: "Who's funding the AI ecosystem, and where the money's going.", icon: Landmark, color: "#818CF8" },
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
        className="relative w-full flex flex-col items-center pt-16 pb-10 px-6 overflow-hidden"
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
          <h1 className="max-w-[820px] text-4xl sm:text-5xl lg:text-[64px] font-black tracking-tight leading-[1.05] mb-8 select-none text-white text-balance">
            The best AI, in one signal.
          </h1>

          <form action="/tools" method="GET" className="relative w-full max-w-[640px] mx-auto mb-5 group">
            <div
              className="relative w-full rounded-xl border border-[#232326]/70 bg-[#111113] h-[52px] flex items-center px-5 pr-[4.5rem] transition-colors duration-150"
              style={{ borderColor: undefined }}
            >
              <Search size={16} className="mr-3 text-[#71717A] shrink-0" />
              <input
                type="text"
                name="q"
                defaultValue={params.q}
                placeholder="Search AI tools, models, companies…"
                className="w-full bg-transparent text-[14px] text-white placeholder:text-[#71717A] focus:outline-none"
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
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mx-auto w-full max-w-[1600px] flex justify-end">
          <SortDropdown />
        </div>
      </div>

      {/* Directory nav strip — single row, evenly spread, sits just above the tools list */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-3 pb-4">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex flex-nowrap items-stretch gap-3 overflow-x-auto">
            {DIRECTORY_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <a
                  key={card.name}
                  href={card.href}
                  className="group relative flex flex-1 min-w-[110px] shrink-0 flex-row items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-[#232326]/60 bg-[#0d0d10] px-5 py-3 text-center transition-all duration-200 hover:border-[color:var(--card-color)] hover:-translate-y-0.5"
                  style={{ ["--card-color" as string]: card.color }}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                    style={{ backgroundColor: `${card.color}1a`, borderColor: `${card.color}40` }}
                  >
                    <Icon size={15} strokeWidth={1.75} style={{ color: card.color }} />
                  </div>
                  <span className="text-[12.5px] font-bold tracking-tight text-white whitespace-nowrap">
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