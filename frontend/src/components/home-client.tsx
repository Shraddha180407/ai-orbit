'use client';

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchHomeFeed } from "@/lib/home-feed";
import { GlobalHero } from "@/components/GlobalHero";
import { ToolListView } from "@/components/ToolListView";
import { Pagination } from "@/components/Pagination";

export function HomeClient() {
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const pageFromUrl = searchParams.get("page");
    return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
  });

  const [pageSize, setPageSize] = useState<number>(() => {
    const sizeFromUrl = searchParams.get("pageSize");
    return sizeFromUrl ? parseInt(sizeFromUrl, 10) : 25;
  });

  const showParam = searchParams.get("show");
  // Only include entity types whose detail pages are currently available.
  // News remains accessible from its dedicated News section.
  const show = showParam !== null ? showParam : "tools,devices,robots,models";
  const sort = searchParams.get("sort") || undefined;
  const pricing = searchParams.get("pricing") || undefined;

  // Reset to page 1 whenever key filters change
  const prevShowRef = React.useRef(show);
  React.useEffect(() => {
    if (prevShowRef.current !== show) {
      prevShowRef.current = show;
      setCurrentPage(1);
    }
  }, [show]);
  const queryKey = ["unified-feed", { show, sort, pricing, page: currentPage, pageSize }];

  const {
    data,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey,
    queryFn: () => fetchHomeFeed({ show, sort, pricing, page: currentPage, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });

  const tools = data?.items || data?.tools || [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col flex-1">
      
      {/* FIXED: Wrapped GlobalHero in a very high z-index so any dropdowns inside it will float above the table below */}
      <div className="relative z-[60]">
        <GlobalHero />
      </div>

      {/* FIXED: Confined the table wrapper to a lower z-index (z-10) so its sticky columns can never overlap the Hero */}
      <div id="tools" className="relative z-10 scroll-mt-28 w-full px-0 pt-2 pb-8">
        <div className={`mx-auto w-full max-w-none space-y-4 transition-opacity duration-150 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}>
          
          {/* Feed the unified items directly into your full-width table */}
          <ToolListView
            tools={tools}
            loading={isLoading && tools.length === 0}
          />

          {/* Unified Floating Pill Pagination */}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={total}
            onPageChange={(p) => {
              setCurrentPage(p);
              const target = document.getElementById("tools");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

    </div>
  );
}
