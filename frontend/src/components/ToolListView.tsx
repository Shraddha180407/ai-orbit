'use client';

import React, { useState, useTransition, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchX from 'lucide-react/dist/esm/icons/search-x';
import GitCompare from 'lucide-react/dist/esm/icons/git-compare';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import Star from 'lucide-react/dist/esm/icons/star';
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import BadgeCheck from 'lucide-react/dist/esm/icons/badge-check';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';
import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down';
import { PricingBadge } from "@/components/PricingBadge";
import { CategoryChip } from "@/components/CategoryChip";
import type { ToolCardData } from "@/lib/types";
import { useUser } from "@/hooks/use-user";
import { toggleBookmark } from "@/lib/actions";

const MAX_COMPARE = 2;

/**
 * 
 * 
 * Loose tool shape — extends `ToolCardData` with optional fields the backend
 * may or may not return. Optional fields default to safe values so the row
 * renders even if the API doesn't include them yet.
 */
type ListTool = ToolCardData & {
  createdAt?: string | null;
  isOpenSource?: boolean;
  openSource?: boolean;
  isTrending?: boolean;
  trending?: boolean;
  hasApi?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  compatibility?: string[];
  websiteUrl?: string | null;
};

type ToolListViewProps = {
  tools: ListTool[];
  loading?: boolean;
  skeletonRows?: number;
};

// Formatters ----------------------------------------------------------------

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatReleased(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function isTruthy(...vals: Array<unknown>): boolean {
  return vals.some((v) => v === true || v === "true" || v === 1 || v === "1");
}

// Boolean pill ---------------------------------------------------------------

function BoolPill({
  value,
  trueLabel,
  falseLabel,
  trueColor = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  falseColor = "text-[#71717A] bg-[#18181C] border-[#232326]/60",
}: {
  value: boolean;
  trueLabel: string;
  falseLabel: string;
  trueColor?: string;
  falseColor?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold ${value ? trueColor : falseColor
        }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

// Column grid template ------------------------------------------------------
// 11 columns, justified to fill the row. Logo & Name are content-sized (auto),
// the rest are flex-1 with per-column min-widths to stay readable.
//
// Layout weights roughly proportional to data density:
//   Logo:        auto (40px)
//   Name+desc:   2.4fr  (widest — most info)
//   Task:        1fr
//   Released:    1fr
//   Price:       0.8fr
//   Reviews:     1fr
//   Open-Source: 0.9fr
//   Trending:    0.8fr
//   Pricing:     1.2fr (badge needs room)
//   Compare:     0.9fr
//
// Horizontal scroll only kicks in below ~1024px (min-w-[960px] on the inner
// grid), so on desktop the table fills the available width.

const HOME_COL_TEMPLATE =
  "grid-cols-[40px_minmax(220px,2.5fr)_minmax(120px,1.2fr)_minmax(150px,1.5fr)_minmax(120px,1.2fr)_minmax(100px,1fr)_minmax(90px,0.8fr)]";

const HOME_COL_MIN_WIDTH = "min-w-[850px]";

// Column header -------------------------------------------------------------

const HOME_COLUMN_HEADERS = [
  { label: "LOGO", align: "" },
  { label: "TOOL", align: "" },
  { label: "CATEGORY", align: "" },
  { label: "TAGS", align: "" },
  { label: "RELEASED BY", align: "" },
  { label: "PRICE", align: "" },
  { label: "BOOKMARK", align: "text-right" },
];

const DEFAULT_COL_TEMPLATE =
  "grid-cols-[40px_minmax(280px,4fr)_minmax(120px,1.2fr)_minmax(120px,1.2fr)_minmax(80px,0.8fr)_minmax(100px,1fr)_minmax(120px,1.2fr)_minmax(100px,1fr)_60px_75px]";

const DEFAULT_COL_MIN_WIDTH = "min-w-[1080px]";

const DEFAULT_COLUMN_HEADERS = [
  { label: "", align: "" },
  { label: "TOOL", align: "" },
  { label: "TASK", align: "" },
  { label: "PRICING", align: "", sortKey: "price" },
  { label: "API", align: "" },
  { label: "OPEN-SOURCE", align: "" },
  { label: "COMPATIBILITY", align: "" },
  { label: "RELEASED", align: "", sortKey: "released" },
  { label: "SHARE", align: "" },
  { label: "BOOKMARK", align: "text-center" },
];

// Share Button ---------------------------------------------------------------

function ShareButton({ tool }: { tool: ListTool }) {
  const [copied, setCopied] = useState(false);
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/tools/${tool.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors ${copied
          ? "border-[var(--color-signal)] text-[var(--color-signal)]"
          : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
        }`}
      aria-label={`Share ${tool.name}`}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
    </button>
  );
}

// Bookmark Button for Home --------------------------------------------------

function HomeBookmarkButton({ tool }: { tool: ListTool }) {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const [bookmarked, setBookmarked] = useState<boolean>(!!(tool as any).bookmarked);
  const [isPending, startTransition] = useTransition();

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);

    startTransition(async () => {
      try {
        const result = await toggleBookmark(tool.id, tool.slug);
        setBookmarked(result.bookmarked);
      } catch {
        setBookmarked(bookmarked);
      }
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleBookmark}
      className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors disabled:opacity-60 ${bookmarked
          ? "border-[var(--color-signal)] text-[var(--color-signal)]"
          : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
        }`}
      aria-label={bookmarked ? `Remove bookmark for ${tool.name}` : `Bookmark ${tool.name}`}
      aria-pressed={bookmarked}
    >
      {bookmarked ? <Check size={14} /> : <Bookmark size={14} />}
    </button>
  );
}

// Row renderer ---------------------------------------------------------------

function ToolRow({
  tool,
  isSelected,
  isCompareFull,
  onToggleCompare,
  basePath = "/tools",
  isHome = false
}: {
  tool: ListTool;
  isSelected: boolean;
  isCompareFull: boolean;
  onToggleCompare: (tool: ListTool) => void;
  basePath?: string;
  isHome?: boolean;
}) {
  const primaryCategory = tool.categories[0]?.category;
  const isOpenSource = isTruthy(tool.isOpenSource, tool.openSource);
  const isTrending = isTruthy(tool.isTrending, tool.trending);
  const reviewCount = tool._count?.reviews ?? 0;
  const showAmount =
    tool.pricingModel !== "FREE" &&
    tool.pricingAmount !== null &&
    tool.pricingAmount !== undefined &&
    Number(tool.pricingAmount) > 0;

  const template = isHome ? HOME_COL_TEMPLATE : DEFAULT_COL_TEMPLATE;
  const minWidth = isHome ? HOME_COL_MIN_WIDTH : DEFAULT_COL_MIN_WIDTH;

  return (
    <Link
      href={`${basePath}/${tool.slug}`}
      className={`group relative grid ${template} ${minWidth} items-center gap-4 bg-transparent px-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none`}
    >
      {/* Hover marker — grows from the left edge, mirrors the video rows */}
      <span className="pointer-events-none absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-signal)] transition-all duration-200 group-hover:h-[70%]" />

      {/* Column 1: Logo */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white">
        {tool.logoUrl ? (
          <Image
            src={tool.logoUrl}
            alt={`${tool.name} logo`}
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
          />
        ) : (
          <span className="text-sm font-bold text-neutral-900">
            {tool.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Column 2: Name + Description */}
      <div className="min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 min-w-0 w-full">
          <h3 className="truncate text-[13px] font-semibold text-white group-hover:text-white">
            {tool.name}
          </h3>
          {!isHome && tool.isVerified && (
            <BadgeCheck size={14} className="shrink-0 text-blue-400" aria-label="Verified" />
          )}
          {!isHome && tool.isFeatured && (
            <Sparkles size={14} className="shrink-0 text-amber-400 fill-amber-400" aria-label="Featured" />
          )}
          {!isHome && (
            tool.websiteUrl ? (
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#71717A] hover:text-white transition-colors shrink-0"
                aria-label={`Visit ${tool.name} website`}
              >
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="text-[#71717A] opacity-50 shrink-0">
                <ExternalLink size={14} />
              </span>
            )
          )}
          {!isHome && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare(tool);
              }}
              className={`ml-auto mr-4 transition-colors shrink-0 ${isSelected ? "text-[var(--color-signal)]" : "text-[#71717A] hover:text-white"
                }`}
              aria-label={isSelected ? `Remove ${tool.name} from compare` : `Add ${tool.name} to compare`}
            >
              <GitCompare size={14} />
            </button>
          )}
        </div>
        <p className="mt-0.5 truncate text-[11px] text-[#A1A1AA] leading-snug w-full pr-4">
          {tool.description}
        </p>
      </div>

      {isHome ? (
        <>
          {/* Column 3: Category */}
          <div className="min-w-0 truncate">
            {tool.categories?.[0]?.category?.name ? (
              <CategoryChip label={tool.categories[0].category.name} />
            ) : (
              <span className="text-[11px] text-[#71717A]">—</span>
            )}
          </div>

          {/* Column 4: Tags */}
          <div className="min-w-0 flex flex-wrap gap-1">
            {tool.tags && tool.tags.length > 0 ? (
              <>
                {tool.tags.slice(0, 2).map((t, i) => (
                  <span key={i} className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                    {t.tag.name}
                  </span>
                ))}
                {tool.tags.length > 2 && (
                  <span className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                    +{tool.tags.length - 2}
                  </span>
                )}
              </>
            ) : (
              <span className="text-[11px] text-[#71717A]">—</span>
            )}
          </div>

          {/* Column 5: Released By */}
          <div className="min-w-0 truncate text-[12px] text-[#A1A1AA]">
            {tool.company?.name ? (
              <span className="truncate">{tool.company.name}</span>
            ) : (
              <span className="text-[#71717A]">—</span>
            )}
          </div>

          {/* Column 6: Price */}
          <div className="hidden sm:block">
            <PricingBadge
              pricingModel={tool.pricingModel}
              pricingAmount={tool.pricingAmount}
              billingFrequency={tool.billingFrequency}
            />
          </div>

          {/* Column 7: Bookmark */}
          <div className="hidden text-right sm:block">
            <HomeBookmarkButton tool={tool} />
          </div>
        </>
      ) : (
        <>
          {/* Column 3: Task */}
          <div className="min-w-0 truncate">
            {tool.ttasks && tool.ttasks.length > 0 ? (
              <CategoryChip label={tool.ttasks[0].task.title} />
            ) : (
              <span className="text-[11px] text-[#71717A]">—</span>
            )}
          </div>

          {/* Column 4: Pricing */}
          <div className="hidden sm:block">
            <PricingBadge
              pricingModel={tool.pricingModel}
              pricingAmount={tool.pricingAmount}
              billingFrequency={tool.billingFrequency}
            />
          </div>

          {/* Column 5: API */}
          <div className="hidden sm:block">
            {tool.hasApi !== undefined ? (
              <BoolPill value={tool.hasApi} trueLabel="YES" falseLabel="NO" />
            ) : (
              <span className="text-[11px] text-[#71717A] font-mono">—</span>
            )}
          </div>

          {/* Column 6: Open-Source */}
          <div className="hidden sm:block">
            <BoolPill value={isOpenSource} trueLabel="YES" falseLabel="NO" />
          </div>

          {/* Column 7: Compatibility */}
          <div className="hidden sm:block min-w-0 truncate">
            {tool.compatibility && tool.compatibility.length > 0 ? (
              <div className="flex gap-1">
                {tool.compatibility.slice(0, 2).map((c, i) => (
                  <span key={i} className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                    {c}
                  </span>
                ))}
                {tool.compatibility.length > 2 && (
                  <span className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                    +{tool.compatibility.length - 2}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[11px] text-[#71717A] font-mono">—</span>
            )}
          </div>

          {/* Column 8: Released */}
          <div className="hidden text-[11px] font-mono text-[#A1A1AA] sm:block">
            {formatReleased(tool.releaseDate)}
          </div>

          {/* Column 9: Share */}
          <div className="hidden sm:block">
            <ShareButton tool={tool} />
          </div>

          {/* Column 10: Bookmark */}
          <div className="hidden text-center sm:block">
            <HomeBookmarkButton tool={tool} />
          </div>
        </>
      )}
    </Link>
  );
}

// Memoize ToolRow for better performance with large lists
const MemoizedToolRow = React.memo(ToolRow);

// Main component ------------------------------------------------------------

function ToolListViewInner({
  tools,
  loading = false,
  skeletonRows = 4,
}: ToolListViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHome = pathname === "/";
  const template = isHome ? HOME_COL_TEMPLATE : DEFAULT_COL_TEMPLATE;
  const minWidth = isHome ? HOME_COL_MIN_WIDTH : DEFAULT_COL_MIN_WIDTH;
  const headers = isHome ? HOME_COLUMN_HEADERS : DEFAULT_COLUMN_HEADERS;
  const [compareSet, setCompareSet] = useState<ListTool[]>([]);

  let basePath = "/tools";
  if (pathname === "/personal" || pathname === "/creativity") {
    basePath = pathname;
  }

  const toggleCompare = (tool: ListTool) => {
    setCompareSet((prev) => {
      const exists = prev.some((t) => t.id === tool.id);
      if (exists) return prev.filter((t) => t.id !== tool.id);
      if (prev.length >= MAX_COMPARE) return prev; // full — no-op
      return [...prev, tool];
    });
  };

  const clearCompare = () => setCompareSet([]);

  const goToCompare = () => {
    if (compareSet.length !== MAX_COMPARE) return;
    const slugs = compareSet.map((t) => t.slug).join(",");
    router.push(`/tools/compare?slugs=${slugs}`);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#131316]/10">
        <div className="flex flex-col divide-y divide-[#232326]/60">
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div
              key={i}
              className={`grid ${template} ${minWidth} items-center gap-4 px-4 py-2.5`}
            >
              <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
              <div className="space-y-1.5">
                <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
                <div className="h-2 w-64 animate-pulse rounded bg-[#18181C]" />
              </div>
              {isHome ? (
                <>
                  <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
                  <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                  <div className="h-4 w-16 animate-pulse rounded-full bg-[#18181C]" />
                  <div className="h-5 w-20 animate-pulse rounded-full bg-[#18181C]" />
                  <div className="ml-auto h-5 w-16 animate-pulse rounded-md bg-[#18181C]" />
                </>
              ) : (
                <>
                  <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
                  <div className="h-5 w-20 animate-pulse rounded-full bg-[#18181C]" />
                  <div className="h-4 w-10 animate-pulse rounded-full bg-[#18181C]" />
                  <div className="h-4 w-12 animate-pulse rounded-full bg-[#18181C]" />
                  <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
                  <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                  <div className="h-7 w-7 animate-pulse rounded-md bg-[#18181C]" />
                  <div className="ml-auto h-7 w-7 animate-pulse rounded-md bg-[#18181C]" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#232326] bg-[#131316]/40 py-16 text-center">
        <SearchX size={28} className="text-[#71717A]" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-white">No tools match your filters</p>
          <p className="mt-1 text-xs text-[#A1A1AA]">
            Try a different search term or clear a filter to see more results.
          </p>
        </div>
      </div>
    );
  }

  // Real rows
  return (
    <>
      <div className="flex flex-col rounded-lg border border-[#232326]/60 bg-[#131316]/10 overflow-hidden">
        {/* Column header row */}
        <div className="overflow-x-auto">
          <div className="border-b border-[#232326]/60 bg-[#131316]/40">
            <div className={`grid ${template} ${minWidth} items-center gap-4 px-4 py-2`}>
              {headers.map((h, i) => {
                const isActiveSort = searchParams.get("sort")?.startsWith(h.sortKey || "");
                const isDesc = searchParams.get("sort") === `${h.sortKey}-desc`;

                return (
                  <span
                    key={h.label || `header-${i}`}
                    className={`text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] ${h.align}`}
                  >
                    {h.sortKey ? (
                      <button
                        type="button"
                        onClick={() => {
                          const nextSort = isDesc ? `${h.sortKey}-asc` : `${h.sortKey}-desc`;
                          const newParams = new URLSearchParams(searchParams.toString());
                          newParams.set("sort", nextSort);
                          router.push(`${pathname}?${newParams.toString()}`);
                        }}
                        className="flex items-center gap-1 hover:text-white transition-colors uppercase tracking-wider"
                      >
                        {h.label}
                        {isActiveSort ? (
                          isDesc ? <ArrowDown size={12} /> : <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} className="opacity-30" />
                        )}
                      </button>
                    ) : (
                      h.label
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          <div role="list" className="flex flex-col divide-y divide-[#232326]/60">
            {tools.map((tool) => {
              const isSelected = compareSet.some((t) => t.id === tool.id);
              return (
                <div key={tool.id} role="listitem">
                  <MemoizedToolRow
                    tool={tool}
                    isSelected={isSelected}
                    isCompareFull={compareSet.length >= MAX_COMPARE}
                    onToggleCompare={toggleCompare}
                    basePath={basePath}
                    isHome={isHome}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky compare bar — only shows once at least 1 tool is selected */}
      {compareSet.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-[#232326]/70 bg-[#111113]/95 backdrop-blur px-4 py-3 shadow-2xl shadow-black/40">
            <div className="flex flex-1 items-center gap-2 min-w-0">
              {Array.from({ length: MAX_COMPARE }).map((_, i) => {
                const tool = compareSet[i];
                return (
                  <div
                    key={i}
                    className={`flex flex-1 items-center gap-2 rounded-lg border px-2.5 py-1.5 min-w-0 ${tool ? "border-[#232326]/70 bg-[#18181C]" : "border-dashed border-[#232326]/50"
                      }`}
                  >
                    {tool ? (
                      <>
                        <span className="truncate text-[12px] font-semibold text-white">{tool.name}</span>
                        <button
                          type="button"
                          onClick={() => toggleCompare(tool)}
                          aria-label={`Remove ${tool.name} from compare`}
                          className="ml-auto shrink-0 text-[#71717A] hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-[#71717A]">Select another tool&hellip;</span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goToCompare}
              disabled={compareSet.length !== MAX_COMPARE}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-semibold transition-colors ${compareSet.length === MAX_COMPARE
                  ? "text-black"
                  : "cursor-not-allowed bg-[#18181C] text-[#4a4a4d]"
                }`}
              style={compareSet.length === MAX_COMPARE ? { backgroundColor: "var(--color-signal)" } : undefined}
            >
              <GitCompare size={13} />
              Compare
            </button>

            <button
              type="button"
              onClick={clearCompare}
              aria-label="Clear compare selection"
              className="shrink-0 text-[#71717A] hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function ToolListView(props: ToolListViewProps) {
  return (
    <Suspense fallback={<div className="min-h-[400px] w-full rounded-lg border border-[#232326]/60 bg-[#131316]/10 animate-pulse" />}>
      <ToolListViewInner {...props} />
    </Suspense>
  );
}