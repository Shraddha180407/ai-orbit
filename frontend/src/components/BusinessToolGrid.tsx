'use client';

import Link from "next/link";
import { useState } from "react";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import BadgeCheck from "lucide-react/dist/esm/icons/badge-check";
import Code2 from "lucide-react/dist/esm/icons/code-2";
import GitBranch from "lucide-react/dist/esm/icons/git-branch";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import Star from "lucide-react/dist/esm/icons/star";
import { PricingBadge } from "@/components/PricingBadge";
import { API_URL, prefetchUrl } from "@/lib/api";
import type { ToolCardData } from "@/lib/types";

type BusinessTool = ToolCardData & {
  hasApi?: boolean;
  isVerified?: boolean;
  verified?: boolean;
  openSource?: boolean;
  trending?: boolean;
};

function ToolLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    return (
      <span className="text-xl font-bold tracking-tight text-[#161619]" aria-hidden="true">
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      width={56}
      height={56}
      loading="lazy"
      className="h-full w-full object-contain"
      onError={() => setFailed(true)}
    />
  );
}

function BusinessToolCard({ tool }: { tool: BusinessTool }) {
  const categories = tool.categories ?? [];
  const labels = categories
    .map(({ category }) => category.name)
    .filter((label, index, values) => Boolean(label) && values.indexOf(label) === index)
    .slice(0, 3);
  const isTrending = tool.isTrending || tool.trending;
  const isVerified = tool.isVerified || tool.verified;
  const rating = tool.avgRating ? tool.avgRating.toFixed(1) : "New";
  const reviewCount = tool._count?.reviews ?? 0;
  const saveCount = tool._count?.bookmarks ?? 0;

  return (
    <article className="group flex min-w-0 min-h-[320px] flex-col rounded-2xl border border-[#28282D] bg-[#111113] transition-colors duration-200 hover:border-[#4A4A52] hover:bg-[#151518]">
      <Link
        href={`/p/tools/${tool.slug}`}
        prefetch={false}
        onMouseEnter={() => prefetchUrl(`${API_URL}/api/v1/tools/${tool.slug}`)}
        onFocus={() => prefetchUrl(`${API_URL}/api/v1/tools/${tool.slug}`)}
        className="flex min-w-0 flex-1 flex-col p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-2 shadow-sm">
            <ToolLogo name={tool.name} logoUrl={tool.logoUrl} />
          </div>
          <div className="flex min-w-0 flex-wrap justify-end gap-1.5">
            {isTrending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2A2313] px-2.5 py-1 text-[10px] font-semibold text-[#F5B942]">
                <Sparkles size={11} aria-hidden="true" /> Trending
              </span>
            )}
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#17231A] px-2.5 py-1 text-[10px] font-semibold text-[#78D88A]">
                <BadgeCheck size={11} aria-hidden="true" /> Verified
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="min-w-0 truncate text-lg font-semibold tracking-[-0.02em] text-white">
              {tool.name}
            </h3>
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="shrink-0 text-[#71717A] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
            />
          </div>
          <p className="mt-1 truncate text-xs font-medium text-[#8D8D96]">
            {tool.company?.name || "Business AI tool"}
          </p>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#B0B0B8]">
            {tool.description || "Explore what this tool can do for your business workflow."}
          </p>
        </div>

        {labels.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {labels.map((label) => (
              <span key={label} className="max-w-full truncate rounded-md bg-[#1B1B1F] px-2.5 py-1 text-[10px] font-medium text-[#A7A7B0]">
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-[#86868F]">
            <span className="inline-flex items-center gap-1.5">
              <Star size={13} fill="currentColor" aria-hidden="true" className="text-[#F5B942]" />
              <span className="font-semibold text-[#D4D4D8]">{rating}</span>
              <span>({reviewCount})</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-[#48484F]" aria-hidden="true" />
            <span>{saveCount.toLocaleString()} saves</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#28282D] pt-4">
            <PricingBadge
              pricingModel={tool.pricingModel}
              pricingAmount={tool.pricingAmount}
              billingFrequency={tool.billingFrequency}
            />
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777780]">
              {tool.hasApi && <Code2 size={14} aria-label="API available" />}
              {(tool.isOpenSource || tool.openSource) && <GitBranch size={14} aria-label="Open source" />}
              <span className="hidden sm:inline">View tool</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function ToolCardSkeleton() {
  return (
    <div className="flex min-h-[320px] flex-col rounded-2xl border border-[#232326] bg-[#111113] p-5" aria-hidden="true">
      <div className="h-14 w-14 animate-pulse rounded-xl bg-[#202025]" />
      <div className="mt-5 h-5 w-2/3 animate-pulse rounded bg-[#202025]" />
      <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-[#202025]" />
      <div className="mt-5 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-[#1B1B1F]" />
        <div className="h-3 w-11/12 animate-pulse rounded bg-[#1B1B1F]" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-[#1B1B1F]" />
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-[#232326] pt-5">
        <div className="h-5 w-20 animate-pulse rounded bg-[#202025]" />
        <div className="h-3 w-16 animate-pulse rounded bg-[#202025]" />
      </div>
    </div>
  );
}

export function BusinessToolGrid({
  tools,
  loading = false,
}: {
  tools: BusinessTool[];
  loading?: boolean;
}) {
  if (loading && tools.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4" role="status" aria-label="Loading business tools">
        {Array.from({ length: 6 }, (_, index) => <ToolCardSkeleton key={index} />)}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#3A3A40] bg-[#111113] px-6 py-16 text-center">
        <p className="text-sm font-semibold text-white">No business tools match your filters.</p>
        <p className="mt-2 text-xs text-[#85858E]">Try another category or clear your search.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ${loading ? "opacity-60" : ""}`}>
      {tools.map((tool) => <BusinessToolCard key={tool.id} tool={tool} />)}
    </div>
  );
}
