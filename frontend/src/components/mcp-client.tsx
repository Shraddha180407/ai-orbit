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
import { EmptyState } from "@/components/EmptyState";
import { CategoryChip } from "@/components/CategoryChip";
import { PricingBadge } from "@/components/PricingBadge";
import type { MCPCategory, MCPSubCategory } from "@/lib/types";

// 8-column layout template
const COL_TEMPLATE = "grid-cols-[40px_minmax(200px,2.4fr)_minmax(130px,1.4fr)_minmax(90px,0.9fr)_minmax(130px,1.4fr)_minmax(110px,1.1fr)_minmax(110px,1.1fr)_minmax(110px,1.1fr)]";
const COL_MIN_WIDTH = "min-w-[1220px]";
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
  const paramSubCategory = searchParams.get("subCategory") || searchParams.get("category") || "";
  const selectedSubCategorySlug = defaultSubCategory || defaultCategory || paramSubCategory;

  const handleSelectSubCategory = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("subCategory");
    
    // Add the selected subcategory to the URL parameters
    if (slug && slug !== selectedSubCategorySlug) {
      params.set("subCategory", slug);
    }

    const queryString = params.toString();
    
    // FIXED: Always stay on the exact same page and just change the query string.
    // This prevents the Header (and the Submit Tool button) from remounting and blinking!
    router.push(queryString ? `/mcp?${queryString}` : `/mcp`, { scroll: false });
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
        subCategory: selectedSubCategorySlug,
      },
    ],
    queryFn: async ({ pageParam }) => {
      return fetchMCPItems({
        page: pageParam as number,
        limit: 20,
        search: q || undefined,
        subCategory: selectedSubCategorySlug || undefined,
      });
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
    return data?.pages.flatMap((page) => page.items || []) || [];
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
        {/* Single combined scrollable pill row — categories + subcategories */}
        <div className="mb-2 flex flex-nowrap items-center justify-start gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full px-4 md:px-0">
          <button
            onClick={() => handleSelectSubCategory(null)}
            className={`rounded-full px-3 py-1 text-[10px] font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
              !selectedSubCategorySlug
                ? "bg-white text-black border-white shadow-lg shadow-white/5"
                : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
            }`}
          >
            All
          </button>
          {MCP_SUBCATEGORIES.map((sub) => {
            const isSelected = selectedSubCategorySlug === sub.slug;
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
                  <div key={i} className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2.5`}>
                    <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-36 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-2.5 w-48 animate-pulse rounded bg-[#18181C]" />
                    </div>
                    <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                    <div className="h-4.5 w-16 animate-pulse rounded-full bg-[#18181C]" />
                    <div className="h-4 w-24 animate-pulse rounded bg-[#18181C]" />
                    <div className="h-4.5 w-16 animate-pulse rounded-full bg-[#18181C]" />
                    <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                    <div className="flex items-center gap-1.5">
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
              <div className="flex flex-col">
                {/* Column Headers */}
                <div className="border-b border-[#232326]/60 bg-[#131316]/40">
                  <div className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2`}>
                    {COLUMN_HEADERS.map((h, i) => (
                      <span
                        key={i}
                        className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] uppercase"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rows */}
                <div role="list" className="flex flex-col divide-y divide-[#232326]/60">
                  {items.map((item) => {
                    const primaryCategory = item.categories?.[0]?.name;
                    return (
                      <div
                        key={item.id}
                        role="listitem"
                        tabIndex={0}
                        onClick={() => router.push(`/p/mcp/${item.slug}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            router.push(`/p/mcp/${item.slug}`);
                          }
                        }}
                        className={`group grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none relative cursor-pointer`}
                      >
                        {/* Hover accent line on the left side of the row */}
                        <span className="pointer-events-none absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-signal)] transition-all duration-200 group-hover:h-[70%]" />

                        {/* Column 1: Logo */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white">
                          {item.logoUrl ? (
                            <Image
                              src={item.logoUrl}
                              alt={`${item.name} logo`}
                              width={40}
                              height={40}
                              className="h-9 w-9 object-contain"
                              unoptimized
                            />
                          ) : (
                            <span className="text-sm font-bold text-neutral-900">
                              {item.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Column 2: MCP Item (Name & shortDescription) */}
                        <div className="min-w-0 flex flex-col justify-center">
                          <span className="truncate text-[13px] font-semibold text-white group-hover:text-white transition-colors">
                            {item.name}
                          </span>
                          <p className="mt-0.5 line-clamp-1 text-[11.5px] text-[#A1A1AA] leading-relaxed">
                            {item.shortDescription}
                          </p>
                        </div>

                        {/* Column 3: Company */}
                        <div className="min-w-0 flex items-center">
                          <span className="truncate text-[12px] font-medium text-[#D4D4D8]">
                            {item.providerName || "—"}
                          </span>
                        </div>

                        {/* Column 4: Type */}
                        <div className="flex items-center">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                            item.itemType === "SERVER"
                              ? "bg-[#6E56CF]/10 text-[#6E56CF] border-[#6E56CF]/30"
                              : "bg-[#FFC53D]/10 text-[#FFC53D] border-[#FFC53D]/30"
                          }`}>
                            {item.itemType}
                          </span>
                        </div>

                        {/* Column 5: Classification */}
                        <div className="min-w-0 flex items-center">
                          {primaryCategory ? (
                            <CategoryChip label={primaryCategory} />
                          ) : (
                            <span className="text-[#71717A] text-[11px]">—</span>
                          )}
                        </div>

                        {/* Column 6: Pricing */}
                        <div className="flex items-center">
                          <PricingBadge pricingModel={item.pricingType} />
                        </div>

                        {/* Column 7: Released (Only shows the launch date) */}
                        <div className="text-[11px] font-mono text-[#A1A1AA]">
                          {formatReleased(item.launchDate)}
                        </div>

                        {/* Column 8: Actions (Website, Docs, Repo) */}
                        <div className="flex items-center gap-1.5 z-20">
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

        {/* Sentinel for infinite scroll */}
        {items.length > 0 && hasNextPage && (
          <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        )}
      </div>
    </div>
  );
}