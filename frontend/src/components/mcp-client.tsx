'use client';

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MCPSubCategory } from "@/lib/types";
import { fetchMCPSubCategories, fetchMCPItems } from "@/lib/api";

type SortKey = "name" | "upvotes" | "views" | "updated";

const COL_TEMPLATE = "grid-cols-[40px_minmax(200px,2.4fr)_minmax(120px,1.2fr)_minmax(100px,1.1fr)_minmax(100px,1.1fr)_minmax(90px,0.9fr)_minmax(110px,1.1fr)]";
const COL_MIN_WIDTH = "min-w-[800px]";

const PRICING_STYLES: Record<string, string> = {
  FREE: "bg-[#1a3a2a] text-[#4ade80] border border-[#2a5a3a]",
  PAID: "bg-[#1a2a3a] text-[#60a5fa] border border-[#2a3a5a]",
  FREEMIUM: "bg-[#2a2a1a] text-[#facc15] border border-[#4a4a2a]",
  OPEN_SOURCE: "bg-[#1a2a2a] text-[#2dd4bf] border border-[#2a4a4a]",
};

function getFaviconUrl(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "").split(" ")[0];
  return `https://www.google.com/s2/favicons?sz=64&domain=${slug}.com`;
}

export function MCPClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mcpItems, setMcpItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [subCategories, setSubCategories] = useState<MCPSubCategory[]>([]);
  const selectedSubCategorySlug = searchParams.get("subCategory") || null;

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch subcategories once on mount
  useEffect(() => {
    async function loadSubCategories() {
      try {
        const data = await fetchMCPSubCategories();
        setSubCategories(data || []);
      } catch (e) {
        console.error("Failed to fetch MCP subcategories:", e);
      }
    }
    loadSubCategories();
  }, []);

  // Fetch MCP items
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const result = await fetchMCPItems({
          subCategory: selectedSubCategorySlug || undefined,
          page: currentPage,
          limit: 20,
        });
        setMcpItems(result.items || []);
        setTotalPages(result.totalPages || 1);
        setTotal(result.total || 0);
      } catch (e) {
        console.error("Failed to fetch MCP items:", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [selectedSubCategorySlug, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubCategorySlug]);

  const handleSelectSubCategory = (slug: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (slug) {
      params.set("subCategory", slug);
    } else {
      params.delete("subCategory");
    }
    router.push(`/mcp?${params.toString()}`);
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        <div className="mx-auto w-full max-w-[1600px] space-y-3">

          {/* Active Subcategory Filter Chip */}
          {selectedSubCategorySlug && (
            <div className="flex items-center gap-2 mb-2 bg-white/[0.02] border border-white/[0.08] px-3.5 py-2 rounded-lg w-fit shadow-md animate-fade-in">
              <span className="text-xs text-white/50">Category:</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/[0.08] text-white">
                {subCategories.find(s => s.slug === selectedSubCategorySlug)?.name || selectedSubCategorySlug}
              </span>
              <button
                onClick={() => handleSelectSubCategory(null)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors ml-2 cursor-pointer font-medium"
              >
                Clear
              </button>
            </div>
          )}

          {/* Subcategory Filter Chips */}
          {subCategories.length > 0 && !selectedSubCategorySlug && (
            <div className="flex flex-wrap gap-2 mb-2">
              {subCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubCategory(sub.slug)}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-[#232326]/60 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#131316] [&::-webkit-scrollbar-thumb]:bg-[#6E56CF]/40 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div style={{ minWidth: '800px' }} className="relative bg-[#000000]">

              {/* Header row */}
              <div className="border-b border-[#232326]/60 bg-[#131316]/40">
                <div className={`grid ${COL_TEMPLATE} items-center gap-4 px-4 py-2`}>
                  <div />
                  <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">NAME</span>
                  <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">PROVIDER</span>
                  <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">TYPE</span>
                  <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">PRICING</span>
                  <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">VIEWS</span>
                  <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">UPVOTES</span>
                </div>
              </div>

              {/* Rows */}
              {isLoading ? (
                <div className="flex flex-col divide-y divide-[#232326]/60">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`grid ${COL_TEMPLATE} items-center gap-4 px-4 py-2.5`}>
                      <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-32 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-2 w-48 animate-pulse rounded bg-[#18181C]" />
                      </div>
                      <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-4 w-16 animate-pulse rounded-full bg-[#18181C]" />
                      <div className="h-3 w-12 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-3 w-16 animate-pulse rounded bg-[#18181C]" />
                    </div>
                  ))}
                </div>
              ) : mcpItems.length === 0 ? (
                <div className="py-20 text-center text-[#52525B] text-sm">No MCP servers found.</div>
              ) : (
                <div role="list" className="flex flex-col">
                  {mcpItems.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/p/mcp/${item.slug}`}
                      role="listitem"
                      className="group grid grid-cols-[40px_minmax(200px,2.4fr)_minmax(120px,1.2fr)_minmax(100px,1.1fr)_minmax(100px,1.1fr)_minmax(90px,0.9fr)_minmax(110px,1.1fr)] items-center gap-4 px-4 py-2.5 transition-all duration-200 focus-visible:outline-none border-b border-[#232326]/60 hover:bg-white/[0.02]"
                    >
                      {/* Logo */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white">
                        {item.logoUrl ? (
                          <img src={item.logoUrl} alt={item.name} className="h-full w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <span className="text-lg font-black text-[#6E56CF]">{item.name?.charAt(0) || '?'}</span>
                        )}
                      </div>

                      {/* Name + description */}
                      <div className="min-w-0">
                        <h3 className="truncate text-[13px] font-semibold text-white">{item.name}</h3>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A1A1AA] leading-snug">
                          {item.shortDescription}
                        </p>
                      </div>

                      {/* Provider */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[12px] font-mono text-[#A1A1AA] truncate">{item.providerName || "—"}</span>
                      </div>

                      {/* Type */}
                      <div className="min-w-0 truncate text-[12px] font-mono text-[#A1A1AA]">
                        {item.itemType || "—"}
                      </div>

                      {/* Pricing */}
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-mono font-semibold ${PRICING_STYLES[item.pricingType] || "bg-[#18181C] text-[#A1A1AA] border border-[#232326]/60"}`}>
                          {item.pricingType || "—"}
                        </span>
                      </div>

                      {/* Views */}
                      <div className="text-[12px] font-mono text-[#A1A1AA]">
                        {item.viewCount ?? "—"}
                      </div>

                      {/* Upvotes */}
                      <div className="text-[12px] font-mono text-[#A1A1AA]">
                        {item.upvoteCount ?? "—"}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 px-4 py-4 border-t border-[#232326]/60">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs rounded-lg border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                    .reduce<(number | string)[]>((acc, p, i, arr) => {
                      if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) => p === "..." ? (
                      <span key={`e-${i}`} className="text-[#52525B] text-xs px-1">...</span>
                    ) : (
                      <button key={p} onClick={() => setCurrentPage(p as number)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${currentPage === p ? "border-[#6E56CF] bg-[#6E56CF] text-white" : "border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF]"}`}>
                        {p}
                      </button>
                    ))}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs rounded-lg border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
