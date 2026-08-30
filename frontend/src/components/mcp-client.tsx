'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";

// Lucide icons
import Globe from 'lucide-react/dist/esm/icons/globe';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Github from 'lucide-react/dist/esm/icons/github';
import SearchX from 'lucide-react/dist/esm/icons/search-x';

import { fetchMCPCategories, fetchMCPSubCategories, fetchMCPItems } from "@/lib/api";
import { FALLBACK_MCP_ITEMS } from "@/data/mcp";
import { EmptyState } from "@/components/EmptyState";
import { CategoryChip } from "@/components/CategoryChip";
import { PricingBadge } from "@/components/PricingBadge";
import type { MCPCategory, MCPSubCategory } from "@/lib/types";

// FIXED: Adjusted desktop Grid 'fr' ratios. Shrank Name/Desc to 2.2fr and expanded Company to 1.2fr to perfectly balance the visual gaps.
const COL_TEMPLATE = "grid-cols-[48px_70px_190px_minmax(130px,1.4fr)_minmax(90px,0.9fr)_minmax(130px,1.4fr)_minmax(110px,1.1fr)_minmax(110px,1.1fr)_minmax(110px,1.1fr)] md:grid-cols-[40px_minmax(220px,2.2fr)_minmax(130px,1.2fr)_minmax(90px,0.9fr)_minmax(130px,1.4fr)_minmax(110px,1.1fr)_minmax(110px,1.1fr)_minmax(110px,1.1fr)]";
const COL_MIN_WIDTH = "min-w-fit md:min-w-[1220px]";
const COLUMN_HEADERS = ["", "MCP ITEM", "COMPANY", "TYPE", "CLASSIFICATION", "PRICING", "RELEASED", "ACTIONS"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatReleased(value?: string | null | Date): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export const MCP_SUBCATEGORIES: MCPSubCategory[] = [
  { id: "1", name: "APIs", slug: "apis", description: "API integrations and service connectors" },
  { id: "2", name: "Browser", slug: "browser", description: "Browser extensions and web-based tools" },
  { id: "3", name: "Cloud", slug: "cloud", description: "Cloud service integrations and deployment tools" },
  { id: "4", name: "Community", slug: "community", description: "Community-driven tools and open-source projects" },
  { id: "5", name: "Databases", slug: "databases", description: "Database integrations for MCP" },
  { id: "6", name: "Developer Tools", slug: "developer-tools", description: "Tools for developers to build and test MCP integrations" },
  { id: "7", name: "File Systems", slug: "file-systems", description: "File system integrations and storage solutions" },
  { id: "8", name: "MCP Servers", slug: "mcp-servers", description: "Model Context Protocol servers that provide tools and capabilities" },
  { id: "9", name: "ML Platforms", slug: "ml-platforms", description: "Machine learning and AI platform integrations" },
  { id: "10", name: "Productivity", slug: "productivity", description: "Productivity and workflow automation tools" },
  { id: "11", name: "Core MCP Servers", slug: "core-mcp-servers", description: "Core MCP server implementations" },
  { id: "12", name: "SDKs & Frameworks", slug: "sdks-frameworks", description: "Software development kits and frameworks" },
  { id: "13", name: "Specialized MCP Servers", slug: "specialized-mcp-servers", description: "Specialized servers for specific domains" },
  { id: "14", name: "Testing Tools", slug: "testing-tools", description: "Testing and debugging tools" },
  { id: "15", name: "Version Control", slug: "version-control", description: "Version control and code management integrations" },
  { id: "16", name: "Automation", slug: "automation", description: "Workflow automation and task scheduling tools" },
  { id: "17", name: "Smart Devices", slug: "smart-devices", description: "IoT and smart device integrations" },
  { id: "18", name: "Data Analytics", slug: "data-analytics", description: "Data analysis, visualization, and business intelligence tools" },
  { id: "19", name: "MCP Clients", slug: "mcp-clients", description: "Client applications for connecting to MCP servers" },
];

export function MCPClient({ defaultCategory = "", defaultSubCategory = "" }: { defaultCategory?: string; defaultSubCategory?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const q = searchParams.get("q") ?? "";

  const initialSub = defaultSubCategory || defaultCategory || searchParams.get("subCategory") || searchParams.get("category") || "";
  const [activeSubCategory, setActiveSubCategory] = useState<string>(initialSub);

  useEffect(() => {
    const currentParam = searchParams.get("subCategory") || searchParams.get("category") || "";
    if (currentParam !== activeSubCategory) {
      setActiveSubCategory(currentParam);
    }
  }, [searchParams]);

  const handleSelectSubCategory = (slug: string | null) => {
    const newSlug = slug === activeSubCategory ? "" : (slug || "");
    
    setActiveSubCategory(newSlug);

    const currentSearch = typeof window !== "undefined" ? window.location.search : searchParams.toString();
    const params = new URLSearchParams(currentSearch);
    params.delete("category");
    params.delete("subCategory");
    
    if (newSlug) {
      params.set("subCategory", newSlug);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/mcp?${queryString}` : `/mcp`;
    
    if (typeof window !== "undefined") {
      window.history.constructor.prototype.replaceState.call(window.history, null, "", newUrl);
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isPlaceholderData,
    error,
  } = useInfiniteQuery({
    queryKey: [
      "mcpItems",
      {
        q,
        subCategory: activeSubCategory,
      },
    ],
    queryFn: async ({ pageParam }) => {
      const apiParams: any = {
        page: pageParam as number,
        limit: 20,
      };
      
      if (q) apiParams.search = q;
      if (activeSubCategory) apiParams.subCategory = activeSubCategory;

      return fetchMCPItems(apiParams);
    },
    retry: false,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  const items = React.useMemo(() => {
    const fetchedItems = data?.pages.flatMap((page) => page.items || []) || [];

    // Use fallback data when API returns nothing (e.g. local dev with empty DB)
    const sourceItems = fetchedItems.length > 0 ? fetchedItems : FALLBACK_MCP_ITEMS;

    return sourceItems.sort((a: any, b: any) => {
      const getScore = (item: any) => {
        if (item.logoUrl && item.shortDescription && item.shortDescription.trim() !== "") return 2;
        return 1;
      };
      return getScore(b) - getScore(a);
    });
  }, [data]);

  const sentinelRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

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
    <div id="mcp" className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-2 pb-8 flex-1">
      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-up-fade {
          animation: slideUpFade 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .transition-active {
          transition: background-color 180ms ease-out, border-color 180ms ease-out, color 180ms ease-out, box-shadow 180ms ease-out, transform 150ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-slide-up-fade {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
      <div className="mx-auto w-full max-w-[1600px] space-y-4 animate-fade-in">
        <div className="mb-2 flex flex-nowrap items-center justify-start gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full px-4 md:px-0">
          <button
            onClick={() => handleSelectSubCategory(null)}
            className={`rounded-full px-3 py-1 text-[10px] font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
              !activeSubCategory
                ? "bg-white text-black border-white shadow-lg shadow-white/5"
                : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
            }`}
          >
            All
          </button>
          {MCP_SUBCATEGORIES.map((sub) => {
            const isSelected = activeSubCategory === sub.slug;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  handleSelectSubCategory(sub.slug);
                }}
                className={`rounded-full px-3 py-1 text-[10px] font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? "bg-white text-black border-white shadow-lg shadow-white/5"
                    : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>

        <div className="pt-0">
          {isLoading && items.length === 0 ? (
            <div className="overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#131316]/10">
              <div className="flex flex-col divide-y divide-[#232326]/60">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 py-2.5`}>
                    <div className="pl-4 md:pl-0"><div className="h-8 w-8 md:h-11 md:w-11 animate-pulse rounded-lg bg-[#18181C]" /></div>
                    
                    {/* Skeleton Mobile Name / Desktop Combined */}
                    <div className="space-y-1.5 pr-2 md:pr-0">
                      <div className="h-3 w-16 md:w-32 animate-pulse rounded bg-[#18181C]" />
                      <div className="hidden md:block h-2.5 w-48 animate-pulse rounded bg-[#18181C]" />
                    </div>
                    {/* Skeleton Mobile Description */}
                    <div className="md:hidden pr-4">
                      <div className="h-2 w-32 animate-pulse rounded bg-[#18181C]" />
                    </div>
                    
                    <div className="h-3 w-20 animate-pulse rounded bg-[#18181C] pl-4 md:pl-0" />
                    <div className="h-4.5 w-16 animate-pulse rounded-full bg-[#18181C]" />
                    <div className="h-4 w-24 animate-pulse rounded bg-[#18181C]" />
                    <div className="h-4.5 w-16 animate-pulse rounded-full bg-[#18181C]" />
                    <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                    <div className="flex items-center gap-1.5 pr-4 md:pr-0">
                      <div className="h-7 w-7 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-7 w-7 animate-pulse rounded bg-[#18181C]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <EmptyState
              title="Failed to Load MCP Items"
              description="An error occurred while communicating with the backend API. Please try again later."
            />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#232326] bg-[#131316]/40 py-16 text-center">
              <SearchX size={28} className="text-[#71717A]" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-white">No items match your filters</p>
                <p className="mt-1 text-xs text-[#A1A1AA]">
                  Try a different search query or clear your selected filters to see results.
                </p>
              </div>
            </div>
          ) : (
            <div className={`overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#131316]/10 transition-opacity duration-150 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}>
              <div className={`flex flex-col relative bg-[#000000] ${COL_MIN_WIDTH}`}>
                
                {/* Column Headers */}
                <div className="border-b border-[#232326]/60 bg-[#131316] sticky top-0 z-30">
                  <div className={`grid ${COL_TEMPLATE} items-center gap-4 py-2`}>
                    {COLUMN_HEADERS.map((h, i) => {
                      if (i === 0) return <div key={i} className="sticky left-0 md:static z-40 bg-[#131316] md:bg-transparent h-full pl-4 shadow-[10px_0_10px_-10px_rgba(0,0,0,0.5)] md:shadow-none" />;
                      
                      if (i === 1) return (
                        <React.Fragment key={i}>
                          <div className="relative flex items-center gap-2 sticky left-[64px] md:static z-40 bg-[#131316] md:bg-transparent shadow-[10px_0_10px_-10px_rgba(0,0,0,0.5)] md:shadow-none h-full pr-2 md:pr-0 before:content-[''] before:absolute before:inset-y-0 before:-left-[16px] before:w-[16px] before:bg-[#131316] md:before:hidden">
                            <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] uppercase">{h}</span>
                          </div>
                          {/* DESCRIPTION col header (Mobile ONLY) */}
                          <span className="md:hidden text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] pr-2">DESCRIPTION</span>
                        </React.Fragment>
                      );
                      
                      if (i === 2) return <span key={i} className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] uppercase pl-4 md:pl-0">{h}</span>;
                      if (i >= 3 && i <= 6) return <span key={i} className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] uppercase text-center block w-full">{h}</span>;
                      if (i === COLUMN_HEADERS.length - 1) return <span key={i} className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] uppercase pr-4 md:pr-0 text-center block w-full">{h}</span>;
                      
                      return <span key={i} className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] uppercase">{h}</span>;
                    })}
                  </div>
                </div>

                {/* Rows */}
                <div role="list" className="flex flex-col divide-y divide-[#232326]/60">
                  {items.map((item) => {
                    const primaryCategory = item.categories?.[0]?.name;
                    const targetUrl = `/p/mcp/${item.slug}`;
                    const prefetchRow = () => {
                      try {
                        router.prefetch(targetUrl);
                      } catch {}
                    };

                    return (
                      <div
                        key={item.id}
                        role="listitem"
                        tabIndex={0}
                        onClick={() => router.push(targetUrl)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            router.push(targetUrl);
                          }
                        }}
                        onMouseEnter={prefetchRow}
                        onTouchStart={prefetchRow}
                        onFocus={prefetchRow}
                        className={`group grid ${COL_TEMPLATE} items-center gap-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none relative cursor-pointer`}
                      >
                        {/* Column 1: Logo */}
                        <div className="sticky left-0 md:static z-20 flex h-full items-center bg-[#000000] md:bg-transparent pl-4 md:pl-0 transition-all duration-200 shadow-[10px_0_10px_-10px_rgba(0,0,0,0.5)] md:shadow-none">
                          <span className="pointer-events-none absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-signal)] transition-all duration-200 group-hover:h-[70%] z-30" />
                          <div className="flex h-8 w-8 md:h-11 md:w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white group-hover:border-[#6E56CF] transition-colors">
                            {item.logoUrl ? (
                              <Image
                                src={item.logoUrl}
                                alt={`${item.name} logo`}
                                width={40}
                                height={40}
                                className="h-6 w-6 md:h-9 md:w-9 object-contain"
                                unoptimized
                              />
                            ) : (
                              <span className="text-[10px] md:text-sm font-bold text-neutral-900">
                                {item.name.charAt(0)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Column 2a: Name */}
                        <div className="min-w-0 sticky left-[64px] md:static z-20 bg-[#000000] group-hover:bg-[#18181C] md:bg-transparent md:group-hover:bg-transparent h-full flex flex-col justify-center before:content-[''] before:absolute before:inset-y-0 before:-left-[16px] before:w-[16px] before:bg-[#000000] group-hover:before:bg-[#18181C] md:before:hidden shadow-[10px_0_10px_-10px_rgba(0,0,0,0.5)] md:shadow-none pr-1 md:pr-0 transition-colors">
                          <span className="text-[11.5px] md:text-[13px] line-clamp-2 md:truncate font-semibold text-white transition-colors duration-200 leading-tight break-words">
                            {item.name}
                          </span>
                          <p className="hidden md:block mt-0.5 text-[11px] text-[#A1A1AA] leading-relaxed pr-2 truncate">
                            {item.shortDescription}
                          </p>
                        </div>

                        {/* Column 2b: Description (Scrollable on mobile) */}
                        <div className="md:hidden min-w-0 flex flex-col justify-center pr-2 h-full">
                          <p className="text-[11px] text-[#A1A1AA] leading-relaxed pr-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.shortDescription}
                          </p>
                        </div>

                        {/* Column 3: Company */}
                        <div className="min-w-0 flex items-center pl-4 md:pl-0">
                          <span className="truncate text-[12px] font-medium text-[#D4D4D8]">
                            {item.providerName || "—"}
                          </span>
                        </div>

                        {/* Column 4: Type */}
                        <div className="flex items-center justify-center w-full">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                            item.itemType === "SERVER"
                              ? "bg-[#6E56CF]/10 text-[#6E56CF] border-[#6E56CF]/30"
                              : "bg-[#FFC53D]/10 text-[#FFC53D] border-[#FFC53D]/30"
                          }`}>
                            {item.itemType}
                          </span>
                        </div>

                        {/* Column 5: Classification */}
                        <div className="min-w-0 flex items-center justify-center w-full">
                          {primaryCategory ? (
                            <CategoryChip label={primaryCategory} />
                          ) : (
                            <span className="text-[#71717A] text-[11px]">—</span>
                          )}
                        </div>

                        {/* Column 6: Pricing */}
                        <div className="flex items-center justify-center w-full">
                          <PricingBadge pricingModel={item.pricingType} />
                        </div>

                        {/* Column 7: Released */}
                        <div className="text-[11px] font-mono text-[#A1A1AA] text-center w-full flex items-center justify-center">
                          {formatReleased(item.launchDate)}
                        </div>

                        {/* Column 8: Actions */}
                        <div className="flex items-center justify-center gap-1.5 z-20 pr-4 md:pr-0 w-full">
                          {item.websiteUrl && (
                            <a
                              href={item.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center rounded-md border border-[#232326]/60 bg-[#18181C] p-1.5 text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors"
                              title="Visit Website"
                              aria-label="Visit Website"
                            >
                              <Globe size={14} />
                            </a>
                          )}
                          {item.documentationUrl && (
                            <a
                              href={item.documentationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center rounded-md border border-[#232326]/60 bg-[#18181C] p-1.5 text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors"
                              title="View Documentation"
                              aria-label="View Documentation"
                            >
                              <FileText size={14} />
                            </a>
                          )}
                          {item.repositoryUrl && (
                            <a
                              href={item.repositoryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center rounded-md border border-[#232326]/60 bg-[#18181C] p-1.5 text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors"
                              title="View Code Repository"
                              aria-label="View Code Repository"
                            >
                              <Github size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && hasNextPage && (
          <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        )}
      </div>
    </div>
  );
}