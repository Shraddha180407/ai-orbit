'use client';

import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { API_URL } from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlobalHero } from "@/components/GlobalHero";
import { ToolListView } from "@/components/ToolListView";

import type { SortOption } from "@/lib/types";

const INITIAL_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 12;

export function HomeClient() {
  const searchParams = useSearchParams();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Build params object from URL search params
  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;
  const pricing = searchParams.get("pricing") || undefined;
  const sort = (searchParams.get("sort") || undefined) as SortOption | undefined;

  const queryKey = ["home-tools", { q, category, pricing, sort }];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isPlaceholderData,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const query = new URLSearchParams();
      if (q) query.set("q", q);
      if (category) query.set("category", category);
      if (pricing) query.set("pricing", pricing);
      if (sort) query.set("sort", sort);
      query.set("page", String(pageParam));
      query.set("pageSize", String(pageParam === 1 ? INITIAL_PAGE_SIZE : DEFAULT_PAGE_SIZE));

      const res = await fetch(`${API_URL}/api/v1/tools?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch tools");
      return res.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const currentPage = lastPage?.page || 1;
      const totalPages = lastPage?.totalPages || 1;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  const tools = data?.pages.flatMap((p: any) => p?.tools || []) || [];

  // IntersectionObserver for endless scrolling
  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
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
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      {/* 1. Sticky Header */}
      <Header />

      <GlobalHero />

      {/* Tools Section — full width so the data table can use the whole screen */}
      <div id="tools" className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-2 pb-2">
        <div className={`mx-auto w-full max-w-[1600px] space-y-3 transition-opacity duration-150 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}>
          <ToolListView
            tools={tools}
            loading={isLoading && tools.length === 0}
          />

          {/* Sentinel for infinite scroll */}
          {hasNextPage && (
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