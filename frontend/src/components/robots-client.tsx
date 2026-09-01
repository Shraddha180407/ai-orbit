'use client';

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import SearchX from 'lucide-react/dist/esm/icons/search-x';
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { RobotListItem } from "@/lib/types";
import { fetchAllRobots } from "@/lib/api";
import { FALLBACK_ROBOTS } from "@/data/robots";
import { CategoryChip } from "@/components/CategoryChip";
import { Pagination } from "@/components/Pagination";

// Fixed-width template to preserve all 8 columns across mobile and desktop
const COL_TEMPLATE = "grid-cols-[44px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(90px,0.8fr)_minmax(140px,1fr)_minmax(80px,0.6fr)_minmax(80px,0.6fr)]";
const TABLE_MIN_WIDTH = "min-w-[880px]";

const COLUMN_HEADERS = ["", "NAME", "CATEGORY", "COMPANY", "COUNTRY", "AVAILABILITY", "PRICE", "RELEASE DATE"];

const PAGE_SIZE = 100;

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
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9.5px] font-semibold tracking-wide ${colorClass}`}>
      {status}
    </span>
  );
}

function RobotRow({ robot }: { robot: RobotListItem }) {
  return (
    <Link
      href={`/robots/${robot.slug}`}
      className={`group grid ${COL_TEMPLATE} ${TABLE_MIN_WIDTH} items-center gap-4 bg-transparent px-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none`}
    >
      {/* Col 1: Logo */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-[#18181C]">
        {robot.logoUrl ? (
          <Image src={robot.logoUrl} alt={robot.name} width={44} height={44} className="object-cover" unoptimized />
        ) : (
          <span className="text-base font-bold text-white uppercase">{robot.name.charAt(0)}</span>
        )}
      </div>

      {/* Col 2: Name + Main Task */}
      <div className="min-w-0">
        <h3 className="truncate text-[13px] font-semibold text-white group-hover:text-white">
          {robot.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A1A1AA] leading-snug">
          {robot.mainTask || "—"}
        </p>
      </div>

      {/* Col 3: Category */}
      <div className="min-w-0 truncate">
        <CategoryChip label={robot.category} />
      </div>

      {/* Col 4: Company */}
      <div className="text-[12px] font-mono text-[#A1A1AA] truncate">
        {robot.company}
      </div>

      {/* Col 5: Country */}
      <div className="text-[11px] font-mono text-[#A1A1AA] truncate">
        {robot.country || "—"}
      </div>

      {/* Col 6: Availability */}
      <div>
        <AvailabilityBadge status={robot.availability} />
      </div>

      {/* Col 7: Price */}
      <div className="text-[11px] font-mono text-[#A1A1AA]">
        {robot.price && robot.price !== "N/A" ? robot.price : "—"}
      </div>

      {/* Col 8: Release Date */}
      <div className="flex text-[11px] font-mono text-[#A1A1AA] items-center justify-end">
        {robot.releaseDate ? robot.releaseDate.slice(0, 4) : "—"}
      </div>
    </Link>
  );
}

function RobotTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <div className="flex flex-col divide-y divide-[#232326]/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={`grid ${COL_TEMPLATE} ${TABLE_MIN_WIDTH} items-center gap-4 px-4 py-2.5`}>
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-[#18181C]" />
            <div className="space-y-1.5 min-w-0">
              <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
              <div className="h-2 w-56 animate-pulse rounded bg-[#18181C]" />
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

const ROBOT_SLUGS: Record<string, string> = {
  "humanoid-robots": "Humanoid Robots",
  "industrial": "Industrial",
  "service": "Service",
  "healthcare": "Healthcare",
  "educational": "Educational",
  "autonomous-mobile-robots": "Autonomous Mobile Robots",
  "drones": "Drones",
  "companion": "Companion",
  "agricultural": "Agricultural",
  "research": "Research",
  "multi-agent": "Multi-Agent",
  "task-specific": "Task-Specific",
  "autonomous-navigation": "Autonomous Navigation",
  "reinforcement-learning": "Reinforcement Learning",
  "surveillance": "Surveillance"
};

const ROBOT_TO_SLUG: Record<string, string> = {
  "Humanoid Robots": "humanoid-robots",
  "Industrial": "industrial",
  "Service": "service",
  "Healthcare": "healthcare",
  "Educational": "educational",
  "Autonomous Mobile Robots": "autonomous-mobile-robots",
  "Drones": "drones",
  "Companion": "companion",
  "Agricultural": "agricultural",
  "Research": "research",
  "Multi-Agent": "multi-agent",
  "Task-Specific": "task-specific",
  "Autonomous Navigation": "autonomous-navigation",
  "Reinforcement Learning": "reinforcement-learning",
  "Surveillance": "surveillance"
};

export function RobotsClient({ defaultCategory }: { defaultCategory?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(() => {
    if (defaultCategory && ROBOT_SLUGS[defaultCategory]) {
      return ROBOT_SLUGS[defaultCategory];
    }
    return "All";
  });

  const { data: fetchedRobots, isLoading, isPlaceholderData } = useQuery<RobotListItem[]>({
    queryKey: ["robots"],
    queryFn: async () => {
      const data = await fetchAllRobots();
      return data && data.length > 0 ? data : FALLBACK_ROBOTS;
    },
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  const robots = (fetchedRobots && fetchedRobots.length > 0) ? fetchedRobots : FALLBACK_ROBOTS;

  useEffect(() => {
    if (defaultCategory !== undefined) {
      setActiveCategory(defaultCategory && ROBOT_SLUGS[defaultCategory] ? ROBOT_SLUGS[defaultCategory] : "All");
    }
  }, [defaultCategory]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const ROBOT_CATEGORIES = [
    "All",
    "Humanoid Robots",
    "Industrial",
    "Service",
    "Healthcare",
    "Educational",
    "Autonomous Mobile Robots",
    "Drones",
    "Companion",
    "Agricultural",
    "Research",
    "Multi-Agent",
    "Task-Specific",
    "Autonomous Navigation",
    "Reinforcement Learning",
    "Surveillance"
  ];

  const rawSort = searchParams.get("sort") ?? "newest";

  const filtered = useMemo(() => {
    let list = robots;
    if (activeCategory !== "All") {
      const activeNorm = activeCategory.toLowerCase().replace(/[\s-_]+/g, "");
      list = list.filter((r) => {
        const catNorm = (r.category || "").toLowerCase().replace(/[\s-_]+/g, "");
        return catNorm === activeNorm || catNorm.includes(activeNorm) || activeNorm.includes(catNorm);
      });
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
    return list.slice().sort((a, b) => {
      if (rawSort === "name-asc")  return a.name.localeCompare(b.name);
      if (rawSort === "name-desc") return b.name.localeCompare(a.name);
      if (rawSort === "oldest")    return (a.releaseDate ?? "").localeCompare(b.releaseDate ?? "");
      return (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "");
    });
  }, [robots, query, activeCategory, rawSort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRobots = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <main className="w-full px-3 sm:px-6 lg:px-8 pt-2 pb-6 flex-1">
      <div className="mx-auto w-full max-w-[1440px] space-y-3">
        {/* Category Row */}
        <div className="mb-2 -mx-3 sm:mx-0 px-3 sm:px-0 flex flex-nowrap items-center justify-start gap-1.5 touch-scroll-x pb-2 scrollbar-none w-auto sm:w-full">
          {ROBOT_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            const slug = ROBOT_TO_SLUG[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={(e) => {
                  setActiveCategory(cat);
                  if (cat === "All") {
                    router.push(`/robots`);
                  } else {
                    router.push(`/robots/${slug}`);
                  }
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                  });
                }}
                className={`rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border active:scale-95 cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-white text-black border-white shadow-lg shadow-white/5"
                    : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Table Content */}
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
          <div className={`flex flex-col rounded-lg border border-[#232326]/50 bg-[#0F0F12]/30 overflow-hidden transition-opacity duration-150 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}>
            {/* Scroll Container */}
            <div className="w-full overflow-x-auto touch-scroll-x scrollbar-none">
              {/* Table Headers */}
              <div className="border-b border-[#232326]/60 bg-[#131316]/40">
                <div className={`grid ${COL_TEMPLATE} ${TABLE_MIN_WIDTH} items-center gap-4 px-4 py-2`}>
                  {COLUMN_HEADERS.map((h, idx) => (
                    <span key={h || "icon"} className={`text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] ${idx === COLUMN_HEADERS.length - 1 ? "text-right" : ""}`}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* List Rows */}
              <div role="list" className="flex flex-col divide-y divide-[#232326]/60">
                {visibleRobots.map((robot) => (
                  <div key={robot.id} role="listitem">
                    <RobotRow robot={robot} />
                  </div>
                ))}
              </div>
            </div>

            {/* Unified Floating Pill Pagination */}
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalCount={filtered.length}
              onPageChange={(p) => {
                setCurrentPage(p);
              }}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}