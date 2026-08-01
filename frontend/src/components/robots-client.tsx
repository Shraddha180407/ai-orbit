'use client';

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import SearchX from 'lucide-react/dist/esm/icons/search-x';
import { RobotListItem } from "@/lib/types";
import { fetchAllRobots } from "@/lib/api";
import { FALLBACK_ROBOTS } from "@/data/robots";
import { CategoryChip } from "@/components/CategoryChip";

const COL_TEMPLATE = "grid-cols-[44px_minmax(200px,2fr)_minmax(100px,0.9fr)_minmax(110px,1fr)_minmax(80px,0.7fr)_minmax(90px,0.8fr)_minmax(90px,0.7fr)_minmax(90px,0.6fr)]";
const COL_MIN_WIDTH = "min-w-[920px]";

const COLUMN_HEADERS = ["", "NAME", "CATEGORY", "COMPANY", "COUNTRY", "AVAILABILITY", "PRICE", "RELEASE DATE"];

const PAGE_SIZE = 20;

function AvailabilityBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  let colorClass = "border-[#232326] bg-[#18181C] text-[#A1A1AA]";
  if (s.includes("available") || s.includes("commercial")) {
    colorClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
  } else if (s.includes("development") || s.includes("pilot")) {
    colorClass = "border-amber-500/40 bg-amber-500/10 text-amber-400";
  } else if (s.includes("discontinued")) {
    colorClass = "border-red-500/40 bg-red-500/10 text-red-400";
  } else if (s.includes("pre") || s.includes("order")) {
    colorClass = "border-blue-500/40 bg-blue-500/10 text-blue-400";
  }
  return (
    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-semibold tracking-wide ${colorClass}`}>
      {status}
    </span>
  );
}

function RobotRow({ robot }: { robot: RobotListItem }) {
  return (
    <Link
      href={`/robots/${robot.slug}`}
      className={`group grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 bg-transparent px-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none`}
    >
      {/* Column 1: Logo / Initial avatar */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-[#18181C]">
        {robot.logoUrl ? (
          <Image src={robot.logoUrl} alt={robot.name} width={44} height={44} className="object-cover" unoptimized />
        ) : (
          <span className="text-sm font-bold text-white uppercase">{robot.name.charAt(0)}</span>
        )}
      </div>

      {/* Column 2: Name + Main Task */}
      <div className="min-w-0">
        <h3 className="truncate text-[13px] font-semibold text-white group-hover:text-white">
          {robot.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A1A1AA] leading-snug">
          {robot.mainTask || "—"}
        </p>
      </div>

      {/* Column 3: Category */}
      <div className="min-w-0 truncate">
        <CategoryChip label={robot.category} />
      </div>

      {/* Column 4: Company */}
      <div className="hidden text-[12px] font-mono text-[#A1A1AA] sm:block truncate">
        {robot.company}
      </div>

      {/* Column 5: Country */}
      <div className="hidden text-[11px] font-mono text-[#A1A1AA] sm:block truncate">
        {robot.country || "—"}
      </div>

      {/* Column 6: Availability */}
      <div className="hidden sm:block">
        <AvailabilityBadge status={robot.availability} />
      </div>

      {/* Column 7: Price */}
      <div className="hidden text-[11px] font-mono text-[#A1A1AA] sm:block">
        {robot.price && robot.price !== "N/A" ? robot.price : "—"}
      </div>

      {/* Column 8: Release Date */}
      <div className="hidden text-[11px] font-mono text-[#A1A1AA] sm:flex items-center justify-end">
        {robot.releaseDate ? robot.releaseDate.slice(0, 4) : "—"}
      </div>
    </Link>
  );
}

function RobotTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-lg">
      <div className="flex flex-col divide-y divide-[#232326]/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2.5`}>
            <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
            <div className="space-y-1.5">
              <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
              <div className="h-2 w-64 animate-pulse rounded bg-[#18181C]" />
            </div>
            <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
            <div className="h-3 w-24 animate-pulse rounded bg-[#18181C]" />
            <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
            <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
            <div className="h-3 w-12 animate-pulse rounded bg-[#18181C]" />
            <div className="ml-auto h-3 w-10 animate-pulse rounded bg-[#18181C]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RobotsClient() {
  const [robots, setRobots] = useState<RobotListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getRobots() {
      try {
        const data = await fetchAllRobots();
        setRobots(data && data.length > 0 ? data : FALLBACK_ROBOTS);
      } catch (e) {
        console.error("Failed to fetch robots:", e);
        setRobots(FALLBACK_ROBOTS);
      } finally {
        setIsLoading(false);
      }
    }
    getRobots();
  }, []);

  // Derive unique categories from the loaded data
  const categories = useMemo(() => {
    const cats = new Set(robots.map((r) => r.category));
    return ["All", ...Array.from(cats).sort()];
  }, [robots]);

  const filtered = useMemo(() => {
    let list = robots;
    if (activeCategory !== "All") {
      list = list.filter((r) => r.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          (r.mainTask || "").toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.country || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [robots, query, activeCategory]);

  const visibleRobots = filtered.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, activeCategory]);

  useEffect(() => {
    if (isLoading || visibleCount >= filtered.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);
    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [isLoading, visibleCount, filtered.length]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-8 flex-1">
      <div className="mx-auto w-full max-w-[1600px] space-y-2">
        {/* Page header */}
        <header className="text-center flex flex-col items-center">


          {/* Category filter chips — dynamically generated from data */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center rounded-md border px-2 py-1 text-[9.5px] font-bold tracking-tight transition-colors duration-200 ${
                  activeCategory === cat
                    ? "border-[#2DD4BF] bg-[#2DD4BF]/10 text-[#2DD4BF] shadow-[0_0_0_1px_#2DD4BF]"
                    : "border-[#232326]/60 bg-[#0d0d10] text-white hover:border-[#2DD4BF]/40 hover:shadow-[0_0_0_1px_#2DD4BF40]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Table */}
        {isLoading ? (
          <RobotTableSkeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#232326] bg-[#131316]/40 py-16 text-center">
            <SearchX size={28} className="text-[#71717A]" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-white">No robots match your filters</p>
              <p className="mt-1 text-xs text-[#A1A1AA]">
                Try a different search term or clear a filter to see more results.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              {/* Column headers */}
              <div className="border-b border-[#232326]/60 bg-[#131316]/40">
                <div className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2`}>
                  {COLUMN_HEADERS.map((h, idx) => (
                    <span key={h || "icon"} className={`text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] ${idx === COLUMN_HEADERS.length - 1 ? "text-right" : ""}`}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div role="list" className="flex flex-col divide-y divide-[#232326]/60">
                {visibleRobots.map((robot) => (
                  <div key={robot.id} role="listitem">
                    <RobotRow robot={robot} />
                  </div>
                ))}
              </div>
            </div>

            {/* Infinite scroll sentinel */}
            {visibleCount < filtered.length && (
              <div ref={sentinelRef} className="flex items-center justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
