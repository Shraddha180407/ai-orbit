'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

// Lucide icons
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';
import Eye from 'lucide-react/dist/esm/icons/eye';
import SearchX from 'lucide-react/dist/esm/icons/search-x';

import { fetchMCPSubCategories, fetchMCPItems } from "@/lib/api";
import { EmptyState } from "@/components/EmptyState";
import { CategoryChip } from "@/components/CategoryChip";
import { PricingBadge } from "@/components/PricingBadge";
import { Breadcrumb } from "@/components/news/Breadcrumb";
import type { MCPSubCategory } from "@/lib/types";

const CATEGORIES = [
  { name: "All", slug: "" },
  { name: "MCP Servers", slug: "mcp-servers" },
  { name: "Developer Tools", slug: "developer-tools" },
  { name: "Databases", slug: "databases" },
  { name: "File Systems", slug: "file-systems" },
  { name: "Productivity", slug: "productivity" },
  { name: "APIs", slug: "apis" },
  { name: "Cloud", slug: "cloud" },
  { name: "ML Platforms", slug: "ml-platforms" },
  { name: "Browser", slug: "browser" },
  { name: "Version Control", slug: "version-control" },
  { name: "Automation", slug: "automation" },
  { name: "Smart Devices", slug: "smart-devices" },
  { name: "Data Analytics", slug: "data-analytics" },
  { name: "Community", slug: "community" },
  { name: "MCP Clients", slug: "mcp-clients" },
] as const;

// 8-column layout matching upstream premium layout
const COL_TEMPLATE = "grid-cols-[44px_minmax(180px,2.5fr)_minmax(100px,1fr)_minmax(110px,1.1fr)_minmax(120px,1.2fr)_minmax(90px,0.9fr)_minmax(80px,0.8fr)_minmax(80px,0.8fr)]";
const COL_MIN_WIDTH = "min-w-[900px]";
const COLUMN_HEADERS = ["", "NAME & DESCRIPTION", "TYPE", "CATEGORIES", "PROVIDER", "PRICING", "UPVOTES", "VIEWS"];

export function MCPClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") ?? "";
  const initialType = (searchParams.get("type")?.toUpperCase() === "CLIENT" ? "CLIENT" : "SERVER") as "SERVER" | "CLIENT";
  const initialCategory = searchParams.get("category") ?? "";
  const initialSubCategory = searchParams.get("subCategory") ?? "";

  // State variables for tab switch and category selection
  const [activeType, setActiveType] = useState<"SERVER" | "CLIENT">(initialType);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSubCategory, setActiveSubCategory] = useState<string>(initialSubCategory);
  const [currentPage, setCurrentPage] = useState(1);

  // Synchronize state when URL query parameters change (e.g. browser back/forward buttons)
  useEffect(() => {
    const typeParam = searchParams.get("type")?.toUpperCase() === "CLIENT" ? "CLIENT" : "SERVER";
    const categoryParam = searchParams.get("category") ?? "";
    const subCategoryParam = searchParams.get("subCategory") ?? "";
    setActiveType(typeParam);
    setActiveCategory(categoryParam);
    setActiveSubCategory(subCategoryParam);
  }, [searchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeType, activeCategory, activeSubCategory, q]);

  // Helper to update URL search parameters without losing other queries (like search)
  const updateUrl = (type: "SERVER" | "CLIENT", category: string, subCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type.toLowerCase());
    
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (subCategory) {
      params.set("subCategory", subCategory);
    } else {
      params.delete("subCategory");
    }
    
    router.replace(`/tools/mcp?${params.toString()}`);
  };

  // Fetch subcategories once on mount with React Query
  const { data: subCategoriesData } = useQuery({
    queryKey: ["mcpSubCategories"],
    queryFn: fetchMCPSubCategories,
  });
  const subCategories = subCategoriesData || [];

  // React Query fetch pattern
  const { data, isLoading, error } = useQuery({
    queryKey: ["mcpItems", { q, category: activeCategory, subCategory: activeSubCategory, type: activeType, page: currentPage }],
    queryFn: () =>
      fetchMCPItems({
        page: currentPage,
        limit: 20,
        search: q || undefined,
        category: activeCategory || undefined,
        subCategory: activeSubCategory || undefined,
        type: activeType,
      }),
  });

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div id="mcp" className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-2 pb-8 flex-1">
      <div className="mx-auto w-full max-w-[1600px] space-y-4 animate-fade-in">
        {/* Breadcrumb Navigation */}
        <div className="flex justify-start">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "MCP", href: "/tools/mcp" },
              { label: activeType === "SERVER" ? "MCP Servers" : "MCP Clients" }
            ]}
          />
        </div>

        {/* Segmented Switch (SERVER / CLIENT) */}
        <div className="flex justify-start">
          <div className="flex items-center gap-1 rounded-xl bg-[#131316]/50 border border-[#232326]/60 p-1">
            <button
              onClick={() => {
                setActiveType("SERVER");
                updateUrl("SERVER", activeCategory, activeSubCategory);
              }}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-200 border ${
                activeType === "SERVER"
                  ? "bg-white text-black border-white shadow-lg shadow-white/5"
                  : "text-neutral-400 hover:text-white border-transparent bg-transparent"
              }`}
            >
              MCP Servers
            </button>
            <button
              onClick={() => {
                setActiveType("CLIENT");
                updateUrl("CLIENT", activeCategory, activeSubCategory);
              }}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-200 border ${
                activeType === "CLIENT"
                  ? "bg-white text-black border-white shadow-lg shadow-white/5"
                  : "text-neutral-400 hover:text-white border-transparent bg-transparent"
              }`}
            >
              MCP Clients
            </button>
          </div>
        </div>

        {/* Top Sliding Category Row */}
        <div className="mb-2 flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full">
          {CATEGORIES.map((topic) => {
            const isSelected = activeCategory === topic.slug;
            return (
              <button
                key={topic.name}
                onClick={(e) => {
                  setActiveCategory(topic.slug);
                  updateUrl(activeType, topic.slug, activeSubCategory);
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                  });
                }}
                className={`rounded-full px-3 py-1 text-[10px] font-bold whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? "bg-white text-black border-white shadow-lg shadow-white/5"
                    : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                }`}
              >
                {topic.name}
              </button>
            );
          })}
        </div>

        {/* Active Subcategory Filter Chip */}
        {activeSubCategory && (
          <div className="flex items-center gap-2 mb-2 bg-white/[0.02] border border-white/[0.08] px-3.5 py-2 rounded-lg w-fit shadow-md animate-fade-in">
            <span className="text-xs text-white/50">Subcategory:</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/[0.08] text-white">
              {subCategories.find(s => s.slug === activeSubCategory)?.name || activeSubCategory}
            </span>
            <button
              onClick={() => {
                setActiveSubCategory("");
                updateUrl(activeType, activeCategory, "");
              }}
              className="text-xs text-red-400 hover:text-red-300 transition-colors ml-2 cursor-pointer font-medium"
            >
              Clear
            </button>
          </div>
        )}

        {/* Subcategory Filter Chips */}
        {subCategories.length > 0 && !activeSubCategory && (
          <div className="flex flex-wrap gap-2 mb-2">
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setActiveSubCategory(sub.slug);
                  updateUrl(activeType, activeCategory, sub.slug);
                }}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic content rendering based on loading/error/data states */}
        <div className="pt-2">
          {isLoading ? (
            <div className="overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#131316]/10">
              <div className="flex flex-col divide-y divide-[#232326]/60">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2.5`}>
                    <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-2.5 w-64 animate-pulse rounded bg-[#18181C]" />
                    </div>
                    <div className="h-4 w-12 animate-pulse rounded-full bg-[#18181C]" />
                    <div className="h-5 w-20 animate-pulse rounded-full bg-[#18181C]" />
                    <div className="h-3.5 w-24 animate-pulse rounded bg-[#18181C]" />
                    <div className="h-5 w-20 animate-pulse rounded-full bg-[#18181C]" />
                    <div className="h-3 w-10 animate-pulse rounded bg-[#18181C]" />
                    <div className="h-3 w-10 animate-pulse rounded bg-[#18181C]" />
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
            <EmptyState
              title={q ? "No matching MCP items found" : "No MCP Items Found"}
              description={
                q
                  ? `We couldn't find any MCP servers or clients matching "${q}". Try checking your spelling or using a different query.`
                  : "No Model Context Protocol (MCP) items are available right now."
              }
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#131316]/10">
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
                      <Link
                        key={item.id}
                        href={`/tools/mcp/${item.slug}`}
                        role="listitem"
                        className={`group grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none relative`}
                      >
                        {/* Hover accent line on the left side of the row */}
                        <span className="pointer-events-none absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[#6E56CF] transition-all duration-200 group-hover:h-[70%]" />

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

                        {/* Column 2: Name & Description */}
                        <div className="min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-[13px] font-semibold text-white">
                              {item.name}
                            </span>
                            {item.isVerified && (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[8px] font-medium text-emerald-400 border border-emerald-500/20">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-[11.5px] text-[#A1A1AA] leading-relaxed">
                            {item.shortDescription}
                          </p>
                        </div>

                        {/* Column 3: Type */}
                        <div className="text-[12px] text-[#A1A1AA] font-medium">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                            item.itemType === "SERVER"
                              ? "bg-[#6E56CF]/10 text-[#6E56CF] border-[#6E56CF]/30"
                              : "bg-[#FFC53D]/10 text-[#FFC53D] border-[#FFC53D]/30"
                          }`}>
                            {item.itemType}
                          </span>
                        </div>

                        {/* Column 4: Categories */}
                        <div className="min-w-0 truncate">
                          {primaryCategory ? (
                            <CategoryChip label={primaryCategory} />
                          ) : (
                            <span className="text-[#71717A] text-[11px]">—</span>
                          )}
                        </div>

                        {/* Column 5: Provider */}
                        <div className="min-w-0 text-[11.5px] text-[#A1A1AA] truncate">
                          <span>{item.providerName}</span>
                        </div>

                        {/* Column 6: Pricing */}
                        <div className="flex items-center">
                          <PricingBadge pricingModel={item.pricingType} />
                        </div>

                        {/* Column 7: Upvotes */}
                        <div className="flex items-center gap-1 text-[11px] font-mono text-[#A1A1AA]">
                          <ArrowUp size={11} className="text-[#A1A1AA]" />
                          <span>{item.upvoteCount}</span>
                        </div>

                        {/* Column 8: Views */}
                        <div className="flex items-center gap-1 text-[11px] font-mono text-[#A1A1AA]">
                          <Eye size={11} className="text-[#A1A1AA]" />
                          <span>{item.viewCount}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-4 py-4 border-t border-[#232326]/60">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .reduce<(number | string)[]>((acc, p, i, arr) => {
                if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`ellip-${i}`} className="text-[#52525B] text-xs px-1 select-none">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      currentPage === p
                        ? "border-[#6E56CF] bg-[#6E56CF] text-white"
                        : "border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF]"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs rounded-lg border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
