'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronsUpDown from 'lucide-react/dist/esm/icons/chevrons-up-down';

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

export function TasksClient({ initialData, defaultCategory = "" }: TasksClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = defaultCategory || searchParams.get("category") || "";
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

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

  const queryParams = useMemo(
    () => ({
      sort: effectiveSort,
      filter: "all" as FilterOption,
      category: activeCategory || undefined,
    }),
    [activeCategory, effectiveSort]
  );

  const load = useCallback(
    async (pageNum: number) => {
      const requestId = ++requestIdRef.current;
      setIsFetching(true);
      setError(null);
      setAuthRequired(false);
      try {
        const data = await fetchTasks({ ...queryParams, page: pageNum, pageSize: PAGE_SIZE });
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
    [queryParams]
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialData && currentPage === 1) return;
    }
    load(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.category, queryParams.sort, queryParams.filter, currentPage]);

  const navigate = useCallback(
    (params: { category?: string; page?: number; sort?: SortOption }) => {
      const next = new URLSearchParams(searchParams.toString());

      if (params.category !== undefined) {
        if (params.category) next.set("category", params.category);
        else next.delete("category");
        next.delete("page");
      }

      if (params.sort !== undefined) {
        if (params.sort && params.sort !== "newest") next.set("sort", params.sort);
        else next.delete("sort");
        next.delete("page"); // reset to page 1 whenever sort changes
      }

      if (params.page !== undefined) {
        if (params.page > 1) next.set("page", String(params.page));
        else next.delete("page");
      }

      const qs = next.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    navigate({ page: p });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortClick = (column: SortColumn) => {
    let nextDirection: SortDirection;
    if (activeSortColumn === column) {
      nextDirection = activeSortDirection === "asc" ? "desc" : "asc";
    } else {
      nextDirection = column === "name" ? "asc" : "desc";
    }
    navigate({ sort: buildSortValue(column, nextDirection) });
  };

  const isInitialLoading = isFetching && tasks.length === 0 && !error && !authRequired;

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
    <main className="w-full px-3 sm:px-6 lg:px-10 py-2 flex-1 selection:bg-neutral-800 selection:text-white">
      <div className="mb-2 flex items-center justify-start sm:[justify-content:safe_center] gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full px-1">
        {TASK_CATEGORIES.map((topic) => {
          const isSelected = activeCategory === topic.slug;
          return (
            <button
              key={topic.name}
              type="button"
              aria-current={isSelected ? "true" : undefined}
              onClick={(e) => {
                navigate({ category: topic.slug });
                e.currentTarget.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "center"
                });
              }}
              className={`rounded-full px-3 py-1 text-[11.5px] font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
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

      {isInitialLoading ? (
        <TaskSkeleton />
      ) : authRequired ? (
        <TaskAuthRequired message="Sign in to see tasks you're following." />
      ) : error && tasks.length === 0 ? (
        <TaskErrorState message={error} onRetry={() => load(currentPage)} />
      ) : tasks.length === 0 ? (
        <EmptyTasks />
      ) : (
        <>
          <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#131316]/60 to-[#0D0D10]/60 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_20px_60px_-30px_rgba(0,0,0,0.8)] ring-1 ring-[#232326]/70">
            <div className="w-full">
              <div className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[44px_minmax(220px,1.5fr)_repeat(4,minmax(70px,0.8fr))_minmax(70px,0.8fr)] items-center gap-3 sm:gap-3 px-4 sm:px-5 py-2.5 border-b border-[#232326]/70 bg-[#0A0A0C]/90 backdrop-blur-sm sticky top-0 z-10">
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
                    className="hidden sm:flex items-center justify-center gap-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A] hover:text-white transition-colors duration-150 cursor-pointer"
                  >
                    {label}
                    <SortIcon column={key} />
                  </button>
                ))}
                <span className="hidden sm:block text-center text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A]">
                  Actions
                </span>
              </div>

              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {error && (
              <div className="px-5 py-3 text-xs text-red-400 border-t border-[#232326]/60">
                Failed to load tasks: {error}
              </div>
            )}

            {isFetching && !isInitialLoading && (
              <div className="flex items-center justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-[#A78BFA]" />
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1 || isFetching}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-300 bg-[#131316]/50 border border-[#232326]/60 hover:border-white/[0.15] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>

              {buildPageList(currentPage, totalPages).map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-[#71717A]">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    aria-current={p === currentPage ? "true" : undefined}
                    onClick={() => goToPage(p)}
                    disabled={isFetching}
                    className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                      p === currentPage
                        ? "bg-white text-black"
                        : "text-neutral-400 hover:text-white bg-[#131316]/50 border border-[#232326]/60 hover:border-white/[0.15]"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages || isFetching}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-300 bg-[#131316]/50 border border-[#232326]/60 hover:border-white/[0.15] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}

          <p className="mt-2 text-center text-[10px] font-mono text-[#71717A]">
            {total.toLocaleString("en-US")} tasks · Page {currentPage} of {totalPages}
          </p>
        </>
      )}
    </main>
  );
}

function buildPageList(current: number, total: number): (number | "…")[] {
  const delta = 1;
  const range: (number | "…")[] = [];
  const rangeStart = Math.max(2, current - delta);
  const rangeEnd = Math.min(total - 1, current + delta);

  range.push(1);
  if (rangeStart > 2) range.push("…");
  for (let i = rangeStart; i <= rangeEnd; i++) range.push(i);
  if (rangeEnd < total - 1) range.push("…");
  if (total > 1) range.push(total);

  return range;
}