'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronsUpDown from 'lucide-react/dist/esm/icons/chevrons-up-down';
import { Pagination } from "./Pagination";

import {
  fetchTasks,
  AuthRequiredError,
  type Task,
  type SortOption,
  type FilterOption,
  type TaskListResponse,
} from "@/lib/tasks-api";
import { TaskCard } from "./TaskCard";
import { TaskSkeleton } from "./TaskSkeleton";
import { EmptyTasks } from "./EmptyTasks";
import { TaskErrorState } from "./TaskErrorState";
import { TaskAuthRequired } from "./TaskAuthRequired";
import { scrollChipIntoView } from "@/lib/utils";

type TasksClientProps = {
  initialData?: TaskListResponse;
  defaultCategory?: string;
};

const PAGE_SIZE = 100;

type SortColumn = "name" | "tools" | "models" | "robots" | "devices";
type SortDirection = "asc" | "desc";

const COLUMNS: { key: SortColumn; label: string }[] = [
  { key: "tools", label: "TOOLS" },
  { key: "models", label: "MODELS" },
  { key: "robots", label: "ROBOTS" },
  { key: "devices", label: "DEVICES" },
];

const TASK_CATEGORIES = [
  { name: "All", slug: "" },
  { name: "Content Creation", slug: "content-creation" },
  { name: "Image Creation", slug: "image-creation" },
  { name: "Video Creation", slug: "video-creation" },
  { name: "Audio", slug: "audio" },
  { name: "Coding", slug: "coding" },
  { name: "Data Analysis", slug: "data-analysis" },
  { name: "Research", slug: "research" },
  { name: "Productivity", slug: "productivity" },
  { name: "Marketing", slug: "marketing" },
  { name: "Customer Support", slug: "customer-support" },
  { name: "Translation", slug: "translation" },
  { name: "Presentation", slug: "presentation" },
  { name: "Brainstorming", slug: "brainstorming" },
  { name: "Prompting", slug: "prompting" },
  { name: "Website Building", slug: "website-building" }
];

/** Maps a URL `sort` value to the {column, direction} the header UI needs, and back. */
function parseSort(raw: string | null): { column: SortColumn | null; direction: SortDirection } {
  switch (raw) {
    case "name-asc": case "alphabetical": return { column: "name", direction: "asc" };
    case "name-desc": return { column: "name", direction: "desc" };
    case "tools-asc": return { column: "tools", direction: "asc" };
    case "tools-desc": return { column: "tools", direction: "desc" };
    case "models-asc": return { column: "models", direction: "asc" };
    case "models-desc": return { column: "models", direction: "desc" };
    case "robots-asc": return { column: "robots", direction: "asc" };
    case "robots-desc": return { column: "robots", direction: "desc" };
    case "devices-asc": return { column: "devices", direction: "asc" };
    case "devices-desc": return { column: "devices", direction: "desc" };
    default: return { column: null, direction: "desc" }; // "newest"/"oldest"/"popular"/unset
  }
}

function buildSortValue(column: SortColumn, direction: SortDirection): SortOption {
  if (column === "name") return direction === "asc" ? "name-asc" : "name-desc";
  return `${column}-${direction}` as SortOption;
}

function cycleSort(column: SortColumn, activeColumn: SortColumn | null, activeDirection: SortDirection): SortOption {
  const nextDirection = (activeColumn === column && activeDirection === "asc") ? "desc" : "asc";
  return buildSortValue(column, nextDirection);
}

export function TasksClient({ initialData, defaultCategory = "" }: TasksClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = defaultCategory || searchParams.get("category") || "";
  const subCatContainerRef = useRef<HTMLDivElement>(null);
  const subCatRefs = useRef<Record<string, HTMLButtonElement | null>>({});



  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const [pageSize, setPageSize] = useState<number>(100);

  const rawSort = searchParams.get("sort");
  const { column: activeSortColumn, direction: activeSortDirection } = parseSort(rawSort);
  const effectiveSort: SortOption = (rawSort as SortOption) || "newest";

  const [tasks, setTasks] = useState<Task[]>(initialData?.tasks ?? []);
  const [total, setTotal] = useState(initialData?.total ?? 0);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 1);

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);

  const requestIdRef = useRef(0);

  // Scroll active category pill into view on both desktop and mobile whenever activeCategory changes
  const categoryRowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = categoryRowRef.current;
    const activeBtn = subCatRefs.current[activeCategory];
    if (!container || !activeBtn) return;

    const cRect = container.getBoundingClientRect();
    const bRect = activeBtn.getBoundingClientRect();
    const bLeft = bRect.left - cRect.left + container.scrollLeft;
    const bRight = bLeft + bRect.width;
    const visibleLeft = container.scrollLeft;
    const visibleRight = container.scrollLeft + container.clientWidth;

    if (bRight > visibleRight) {
      const extraSpace = Math.min(
        container.clientWidth * 0.35,
        container.scrollWidth - bRight
      );

      container.scrollTo({
        left: Math.max(
          0,
          Math.min(
            container.scrollWidth - container.clientWidth,
            bRight - container.clientWidth + extraSpace
          )
        ),
        behavior: "smooth",
      });
    } else if (bLeft < visibleLeft) {
      const extraSpace = Math.min(
        container.clientWidth * 0.25,
        bLeft
      );

      container.scrollTo({
        left: Math.max(0, bLeft - extraSpace),
        behavior: "smooth",
      });
    }
  }, [activeCategory]);

  const queryParams = useMemo(
    () => ({
      sort: effectiveSort,
      filter: "all" as FilterOption,
      category: activeCategory || undefined,
    }),
    [activeCategory, effectiveSort]
  );

  const load = useCallback(
    async (pageNum: number, sizeNum: number = pageSize) => {
      const requestId = ++requestIdRef.current;
      setIsFetching(true);
      setError(null);
      setAuthRequired(false);
      try {
        const data = await fetchTasks({ ...queryParams, page: pageNum, pageSize: sizeNum });
        if (requestId !== requestIdRef.current) return;
        setTasks(data.tasks);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (e) {
        if (requestId !== requestIdRef.current) return;
        if (e instanceof AuthRequiredError) {
          setAuthRequired(true);
          setTasks([]);
          setTotal(0);
        } else {
          setError(e instanceof Error ? e.message : "Failed to load tasks.");
        }
      } finally {
        if (requestId === requestIdRef.current) setIsFetching(false);
      }
    },
    [queryParams, pageSize]
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialData && currentPage === 1) return;
    }
    load(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.category, queryParams.sort, queryParams.filter, currentPage, pageSize]);

  const navigate = useCallback(
    (overrides: { sort?: SortOption | null; category?: string; page?: number }) => {
      const nextCategory = overrides.category !== undefined ? overrides.category : activeCategory;
      const nextSort = overrides.sort !== undefined ? overrides.sort : effectiveSort;
      const nextPage = overrides.page !== undefined ? overrides.page : 1;

      const p = new URLSearchParams();
      if (nextCategory) p.set("category", nextCategory);
      if (nextSort && nextSort !== "newest") p.set("sort", nextSort);
      if (nextPage > 1) p.set("page", String(nextPage));

      const qs = p.toString();
      const nextUrl = qs ? `${pathname}?${qs}` : pathname;
      router.push(nextUrl, { scroll: false });
    },
    [activeCategory, effectiveSort, pathname, router]
  );

  const handleSortClick = (column: SortColumn) => {
    const nextSort = cycleSort(column, activeSortColumn, activeSortDirection);
    navigate({ sort: nextSort, page: 1 });
  };

  const goToPage = (page: number) => {
    navigate({ page });
    const target = document.getElementById("tasks-container");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  const isInitialLoading = isFetching && tasks.length === 0;

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (activeSortColumn !== column) {
      return <ChevronsUpDown className="h-3 w-3 text-[#3A3A3E]" aria-hidden="true" />;
    }
    return activeSortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3 text-[#A78BFA]" aria-hidden="true" />
    ) : (
      <ChevronDown className="h-3 w-3 text-[#A78BFA]" aria-hidden="true" />
    );
  };

  return (
    <main id="tasks-container" className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
      <div ref={categoryRowRef} className="mb-2 -mx-4 sm:mx-0 px-4 sm:px-0 flex items-center justify-start gap-1.5 touch-scroll-x pb-2.5 scrollbar-none w-auto sm:w-full">
        {TASK_CATEGORIES.map((topic) => {
          const isSelected = activeCategory === topic.slug;
          return (
            <button
              key={topic.name}
              ref={(el) => { subCatRefs.current[topic.slug] = el; }}
              type="button"
              aria-current={isSelected ? "true" : undefined}
              data-active={isSelected ? "true" : undefined}
              onClick={() => {
                navigate({ category: topic.slug, page: 1 });
              }}
              className={`rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border active:scale-95 cursor-pointer shrink-0 ${isSelected
                  ? "bg-white text-black border-white shadow-lg shadow-white/5"
                  : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                }`}
            >
              {topic.name}
            </button>
          );
        })}
      </div>

      {isInitialLoading ? (
        <TaskSkeleton />
      ) : authRequired ? (
        <TaskAuthRequired message="Sign in to see tasks you're following." />
      ) : error && tasks.length === 0 ? (
        <TaskErrorState message={error} onRetry={() => load(currentPage, pageSize)} />
      ) : tasks.length === 0 ? (
        <EmptyTasks />
      ) : (
        <>
          <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#131316]/60 to-[#0D0D10]/60 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_20px_60px_-30px_rgba(0,0,0,0.8)] ring-1 ring-[#232326]/70">
            <div className="w-full">
              <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] sm:grid-cols-[44px_minmax(0,2fr)_repeat(4,minmax(0,1fr))_100px] items-center gap-3 px-4 sm:px-5 py-2.5 border-b border-[#232326]/70 bg-[#0A0A0C]/90 backdrop-blur-sm sticky top-0 z-10">
                <span />
                <button
                  type="button"
                  onClick={() => handleSortClick("name")}
                  className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A] hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  Task
                  <SortIcon column="name" />
                </button>
                {COLUMNS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSortClick(key)}
                    className="hidden sm:flex items-center justify-center gap-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A] hover:text-white transition-colors duration-150 cursor-pointer text-right"
                  >
                    <span>{label}</span>
                    <SortIcon column={key} />
                  </button>
                ))}
                <span className="text-center text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A] pr-1">
                  Actions
                </span>
              </div>
            </div>

            <div className="divide-y divide-[#232326]/50">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {isFetching && (
              <div className="py-2 text-center text-xs text-[#71717A] bg-[#0A0A0C]/80">
                Updating...
              </div>
            )}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={total}
            onPageChange={goToPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              navigate({ page: 1 });
            }}
          />
        </>
      )}
    </main>
  );
}