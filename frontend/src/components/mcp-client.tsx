'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

// Lucide icons
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import Globe from 'lucide-react/dist/esm/icons/globe';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Github from 'lucide-react/dist/esm/icons/github';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Check from 'lucide-react/dist/esm/icons/check';
import BadgeCheck from 'lucide-react/dist/esm/icons/badge-check';
import SearchX from 'lucide-react/dist/esm/icons/search-x';

import { fetchMCPCategories, fetchMCPSubCategories, fetchMCPItems } from "@/lib/api";
import { EmptyState } from "@/components/EmptyState";
import { CategoryChip } from "@/components/CategoryChip";
import { PricingBadge } from "@/components/PricingBadge";
import { Breadcrumb } from "@/components/news/Breadcrumb";
import type { MCPCategory, MCPSubCategory } from "@/lib/types";

// 5-column layout template
const COL_TEMPLATE = "grid-cols-[40px_minmax(240px,3.2fr)_minmax(180px,2.4fr)_minmax(180px,2.4fr)_minmax(120px,1.2fr)]";
const COL_MIN_WIDTH = "min-w-[960px]";
const COLUMN_HEADERS = ["", "MCP ITEM", "TYPE & CLASSIFICATION", "METADATA", "ACTIONS"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatReleased(value?: string | null | Date): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// Custom Share Button copying link to clipboard
function ShareButton({ slug, name }: { slug: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/p/mcp/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors ${
        copied
          ? "border-[var(--color-signal,#6E56CF)] text-[var(--color-signal,#6E56CF)]"
          : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
      }`}
      title="Share Link"
      aria-label={`Share ${name}`}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
    </button>
  );
}

export function MCPClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "";
  const initialSubCategory = searchParams.get("subCategory") ?? "";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSubCategory, setActiveSubCategory] = useState<string>(initialSubCategory);

  // Synchronize state when URL query parameters change (e.g. browser back/forward buttons)
  useEffect(() => {
    const categoryParam = searchParams.get("category") ?? "";
    const subCategoryParam = searchParams.get("subCategory") ?? "";
    setActiveCategory(categoryParam);
    setActiveSubCategory(subCategoryParam);
  }, [searchParams]);


  // Helper to update URL search parameters without losing other queries (like search)
  const updateUrl = (category: string, subCategory: string = "") => {
    const params = new URLSearchParams(searchParams.toString());
    
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
    
    router.replace(`/mcp?${params.toString()}`);
  };

  // Fetch categories from API
  const { data: categoriesData } = useQuery({
    queryKey: ["mcpCategories"],
    queryFn: fetchMCPCategories,
  });
  const categories = categoriesData || [];

  // Fetch subcategories based on active category
  const { data: subCategoriesData } = useQuery({
    queryKey: ["mcpSubCategories", activeCategory],
    queryFn: () => fetchMCPSubCategories(activeCategory || undefined),
  });
  const subCategories = subCategoriesData || [];

  // React Query fetch pattern with useInfiniteQuery
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [
      "mcpItems",
      {
        q,
        category: activeCategory,
        subCategory: activeSubCategory,
        type: "SERVER",
      },
    ],
    queryFn: async ({ pageParam }) => {
      return fetchMCPItems({
        page: pageParam as number,
        limit: 20,
        search: q || undefined,
        category: activeCategory || undefined,
        subCategory: activeSubCategory || undefined,
        type: "SERVER",
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
  });

  const items = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.items || []) || [];
  }, [data]);

  const sentinelRef = React.useRef<HTMLDivElement>(null);

  // IntersectionObserver for infinite scroll
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
        {/* Breadcrumb Navigation */}
        <div className="flex justify-start">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "MCP", href: "/mcp" },
              { label: "MCP Servers" }
            ]}
          />
        </div>

        {/* Top Sliding Category + Subcategory Row */}
        <div className="mb-2 flex flex-nowrap items-center justify-start gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full">
          {[{ name: "All", slug: "" }, ...categories].map((topic) => {
            const isSelected = activeCategory === topic.slug;
            return (
              <button
                key={topic.slug || "all"}
                onClick={(e) => {
                  setActiveCategory(topic.slug);
                  updateUrl(topic.slug, activeSubCategory);
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
          {subCategories.length > 0 && !activeSubCategory && subCategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSubCategory(sub.slug);
                updateUrl(activeCategory, sub.slug);
              }}
              className="whitespace-nowrap text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
            >
              {sub.name}
            </button>
          ))}
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
                updateUrl(activeCategory, "");
              }}
              className="text-xs text-red-400 hover:text-red-300 transition-colors ml-2 cursor-pointer font-medium"
            >
              Clear
            </button>
          </div>
        )}
        {/* Dynamic content rendering based on loading/error/data states */}
        <div className="pt-0">
          {isLoading && items.length === 0 ? (
            <div className="overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#131316]/10">
              <div className="flex flex-col divide-y divide-[#232326]/60">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2.5`}>
                    <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-2.5 w-64 animate-pulse rounded bg-[#18181C]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-14 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-4.5 w-20 animate-pulse rounded-full bg-[#18181C]" />
                      <div className="h-4.5 w-16 animate-pulse rounded-full bg-[#18181C]" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-3 w-28 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-2 w-20 animate-pulse rounded bg-[#18181C]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-7 w-7 animate-pulse rounded bg-[#18181C]" />
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

                        {/* Column 2: Left Section (Name, shortDescription, providerName) */}
                        <div className="min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-[13px] font-semibold text-white group-hover:text-white transition-colors">
                              {item.name}
                            </span>
                            {item.isVerified && (
                              <BadgeCheck size={14} className="shrink-0 text-blue-400" aria-label="Verified" />
                            )}
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-[11.5px] text-[#A1A1AA] leading-relaxed">
                            {item.shortDescription}
                          </p>
                          <span className="text-[11px] text-[#71717A] mt-0.5">
                            by {item.providerName}
                          </span>
                        </div>

                        {/* Column 3: Middle Section (Type pill, primaryCategory, PricingBadge) */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                            item.itemType === "SERVER"
                              ? "bg-[#6E56CF]/10 text-[#6E56CF] border-[#6E56CF]/30"
                              : "bg-[#FFC53D]/10 text-[#FFC53D] border-[#FFC53D]/30"
                          }`}>
                            {item.itemType}
                          </span>
                          {primaryCategory ? (
                            <CategoryChip label={primaryCategory} />
                          ) : (
                            <span className="text-[#71717A] text-[11px]">—</span>
                          )}
                          <PricingBadge pricingModel={item.pricingType} />
                        </div>

                        {/* Column 4: Right Section (Upvotes, Views, Saves, Launch, Updated) */}
                        <div className="flex flex-col gap-1 text-[11px] font-mono text-[#A1A1AA] py-1">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <ArrowUp size={11} className="text-[#A1A1AA]" />
                              <span>{item.upvoteCount}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Eye size={11} className="text-[#A1A1AA]" />
                              <span>{item.viewCount}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Bookmark size={11} className="text-[#A1A1AA]" />
                              <span>{item.saveCount}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-0.5 text-[10px] text-[#71717A] mt-0.5">
                            <span>Launch: {formatReleased(item.launchDate)}</span>
                            <span>Updated: {formatReleased(item.lastUpdatedDate)}</span>
                          </div>
                        </div>

                        {/* Column 5: Actions (Website, Docs, Repo, Share) */}
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
                          <ShareButton slug={item.slug} name={item.name} />
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
