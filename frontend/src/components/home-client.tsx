'use client';

import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { API_URL } from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlobalHero } from "@/components/GlobalHero";
import { ToolListView } from "@/components/ToolListView";

const INITIAL_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 12;

export function HomeClient() {
  const searchParams = useSearchParams();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const showParam = searchParams.get("show");
  const show = showParam !== null ? showParam : "tools,devices,robots,news,models";
  const queryKey = ["unified-feed", { show }];

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
      query.set("show", show);
      query.set("page", String(pageParam));
      query.set("pageSize", String(pageParam === 1 ? INITIAL_PAGE_SIZE : DEFAULT_PAGE_SIZE));

      // Hitting the new UNION ALL feed endpoint
      const res = await fetch(`${API_URL}/api/v1/feed?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch feed");
      return res.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.hasNextPage) return lastPage.page + 1;
      return undefined;
    },
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  const tools = data?.pages.flatMap((p: any) => p?.items || p?.tools || []) || [];

  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col flex-1">

      
      {/* FIXED: Wrapped GlobalHero in a very high z-index so any dropdowns inside it will float above the table below */}
      <div className="relative z-[60]">
        <GlobalHero />
      </div>

      {/* FIXED: Confined the table wrapper to a lower z-index (z-10) so its sticky columns can never overlap the Hero */}
      <div id="tools" className="relative z-10 scroll-mt-28 w-full px-3 sm:px-6 lg:px-8 pt-2 pb-2">
        <div className={`mx-auto w-full max-w-[1600px] space-y-3 transition-opacity duration-150 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}>
          
          {/* Feed the unified items directly into your full-width table */}
          <ToolListView
            tools={tools}
            loading={isLoading && tools.length === 0}
          />

          {hasNextPage && (
            <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          )}
        </div>
      </div>


    </div>
  );
}