'use client';

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { API_URL } from "@/lib/api";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSearchBar } from "@/components/HeroSearchBar";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { HeroCategoryPills } from "@/components/HeroCategoryPills";
import { SortDropdown } from "@/components/SortDropdown";
import { ToolListView } from "@/components/ToolListView";

import type { SortOption } from "@/lib/types";

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
          {/* Eyebrow: live signal pulse */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#232326]/60 bg-[#111113]/80 px-3 py-1 select-none">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: 'var(--color-signal)' }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-signal)' }}
              />
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-[#A1A1AA]">
              Live directory &middot; updated daily
            </span>
          </div>

          <h1 className="max-w-[820px] text-4xl sm:text-5xl lg:text-[64px] font-black tracking-tight leading-[1.05] mb-4 select-none text-white text-balance">
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

          <div className="w-full flex justify-center">
            <HeroCategoryPills />
          </div>
        </div>
      </section>

      <div className="border-b border-[#232326]/40 w-full z-10 relative" />

      {/* Tools Section — full width so the data table can use the whole screen */}
      <div id="tools" className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="mx-auto w-full max-w-[1600px] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-[#232326]/60 pb-2">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Featured AI Tools
              </h2>
              <p className="text-[11px] text-[#A1A1AA] leading-snug">
                Filter and sort the absolute best active AI tools in the directory database.
              </p>
            </div>
            <SortDropdown />
          </div>

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