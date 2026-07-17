'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SearchX from 'lucide-react/dist/esm/icons/search-x';
import GitCompare from 'lucide-react/dist/esm/icons/git-compare';
import Star from 'lucide-react/dist/esm/icons/star';
import { PricingBadge } from "@/components/PricingBadge";
import { CategoryChip } from "@/components/CategoryChip";
import type { ToolCardData } from "@/lib/types";

/**
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
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold ${
        value ? trueColor : falseColor
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

const COL_TEMPLATE =
  "grid-cols-[40px_minmax(220px,2.4fr)_minmax(110px,1fr)_minmax(110px,1fr)_minmax(90px,0.8fr)_minmax(110px,1fr)_minmax(110px,0.9fr)_minmax(95px,0.8fr)_minmax(150px,1.2fr)_minmax(110px,0.9fr)]";

const COL_MIN_WIDTH = "min-w-[960px]";

// Column header -------------------------------------------------------------

const COLUMN_HEADERS = [
  { label: "TOOL", align: "" },
  { label: "NAME", align: "" },
  { label: "TASK", align: "" },
  { label: "RELEASED", align: "" },
  { label: "PRICE", align: "" },
  { label: "REVIEWS", align: "" },
  { label: "OPEN-SOURCE", align: "" },
  { label: "TRENDING", align: "" },
  { label: "PRICING", align: "" },
  { label: "COMPARE", align: "text-right" },
];

// Row renderer ---------------------------------------------------------------

function ToolRow({ tool }: { tool: ListTool }) {
  const primaryCategory = tool.categories[0]?.category;
  const isOpenSource = isTruthy(tool.isOpenSource, tool.openSource);
  const isTrending = isTruthy(tool.isTrending, tool.trending);
  const reviewCount = tool._count?.reviews ?? 0;
  const showAmount =
    tool.pricingModel !== "FREE" &&
    tool.pricingAmount !== null &&
    tool.pricingAmount !== undefined &&
    Number(tool.pricingAmount) > 0;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 bg-transparent px-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none`}
    >
      {/* Column 1: Logo */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#232326]/60 bg-white">
        {tool.logoUrl ? (
          <Image
            src={tool.logoUrl}
            alt={`${tool.name} logo`}
            width={28}
            height={28}
            className="h-6 w-6 object-contain"
          />
        ) : (
          <span className="text-xs font-bold text-neutral-900">
            {tool.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Column 2: Name + Description */}
      <div className="min-w-0">
        <h3 className="truncate text-[13px] font-semibold text-white group-hover:text-white">
          {tool.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A1A1AA] leading-snug">
          {tool.description}
        </p>
      </div>

      {/* Column 3: Task (primary category) */}
      <div className="min-w-0 truncate">
        {primaryCategory ? (
          <CategoryChip label={primaryCategory.name} />
        ) : (
          <span className="text-[11px] text-[#71717A]">—</span>
        )}
      </div>

      {/* Column 4: Released */}
      <div className="hidden text-[11px] font-mono text-[#A1A1AA] sm:block">
        {formatReleased(tool.createdAt)}
      </div>

      {/* Column 5: Price (compact) */}
      <div className="hidden text-[12px] font-mono text-white sm:block">
        {tool.pricingModel === "FREE" ? (
          <span className="text-emerald-400">Free</span>
        ) : showAmount ? (
          <span>
            ${tool.pricingAmount}
            <span className="text-[#71717A]">/mo</span>
          </span>
        ) : tool.pricingModel === "FREEMIUM" ? (
          <span className="text-[#A1A1AA]">Freemium</span>
        ) : (
          <span className="text-[#71717A]">—</span>
        )}
      </div>

      {/* Column 6: Reviews */}
      <div className="hidden items-center gap-1 text-[11px] font-mono text-[#A1A1AA] sm:flex">
        <Star size={11} className="fill-amber-400 text-amber-400" />
        <span className="text-white">{tool.avgRating?.toFixed(1) ?? "—"}</span>
        <span className="text-[#71717A]">({reviewCount})</span>
      </div>

      {/* Column 7: Open-Source */}
      <div className="hidden sm:block">
        <BoolPill value={isOpenSource} trueLabel="YES" falseLabel="NO" />
      </div>

      {/* Column 8: Trending */}
      <div className="hidden sm:block">
        <BoolPill
          value={isTrending}
          trueLabel="HOT"
          falseLabel="—"
          trueColor="text-orange-400 bg-orange-400/10 border-orange-400/20"
        />
      </div>

      {/* Column 9: Pricing (full badge) */}
      <div className="hidden sm:block">
        <PricingBadge
          pricingModel={tool.pricingModel}
          pricingAmount={tool.pricingAmount}
          billingFrequency={tool.billingFrequency}
        />
      </div>

      {/* Column 10: Compare */}
      <div className="hidden text-right sm:block">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Placeholder: real compare flow isn't built yet. Future implementation
            // will push a compare-set into context and navigate to /compare.
            window.location.href = `/tools/${tool.slug}#compare`;
          }}
          className="inline-flex items-center gap-1 rounded-md border border-[#232326]/60 bg-[#18181C] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA] transition-colors hover:border-[#3a3a3d] hover:text-white"
          aria-label={`Compare ${tool.name}`}
        >
          <GitCompare size={10} />
          Compare
        </button>
      </div>
    </Link>
  );
}

// Main component ------------------------------------------------------------

export function ToolListView({
  tools,
  loading = false,
  skeletonRows = 4,
}: ToolListViewProps) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#131316]/10">
        <div className="flex flex-col divide-y divide-[#232326]/60">
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div
              key={i}
              className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2.5`}
            >
              <div className="h-8 w-8 animate-pulse rounded-md bg-[#18181C]" />
              <div className="space-y-1.5">
                <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
                <div className="h-2 w-64 animate-pulse rounded bg-[#18181C]" />
              </div>
              <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
              <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
              <div className="h-3 w-12 animate-pulse rounded bg-[#18181C]" />
              <div className="h-3 w-14 animate-pulse rounded bg-[#18181C]" />
              <div className="h-4 w-12 animate-pulse rounded-full bg-[#18181C]" />
              <div className="h-4 w-10 animate-pulse rounded-full bg-[#18181C]" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-[#18181C]" />
              <div className="ml-auto h-5 w-16 animate-pulse rounded-md bg-[#18181C]" />
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
    <div className="flex flex-col rounded-lg border border-[#232326]/60 bg-[#131316]/10 overflow-hidden">
      {/* Column header row */}
      <div className="overflow-x-auto">
        <div className="border-b border-[#232326]/60 bg-[#131316]/40">
          <div className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2`}>
            {COLUMN_HEADERS.map((h) => (
              <span
                key={h.label}
                className={`text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] ${h.align}`}
              >
                {h.label}
              </span>
            ))}
          </div>
        </div>

        <div role="list" className="flex flex-col divide-y divide-[#232326]/60">
          {tools.map((tool) => (
            <div key={tool.id} role="listitem">
              <ToolRow tool={tool} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
