'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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

const COLUMN_LABELS = ["SUBSCRIBERS", "SAVES", "TOOLS", "MODELS", "ROBOTS", "DEVICES"];

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

import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";

export function TasksClient({ initialData, defaultCategory }: TasksClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return defaultCategory || searchParams.get("category") || "";
  });

  useEffect(() => {
    if (defaultCategory !== undefined) {
      setActiveCategory(defaultCategory);
    }
  }, [defaultCategory]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const rawSort = searchParams.get("sort") ?? "newest";
  const mappedSort: SortOption =
    rawSort === "oldest" ? "oldest" :
    rawSort === "name-asc" || rawSort === "name-desc" ? "alphabetical" :
    rawSort === "rating" ? "popular" :
    "newest";

  const queryParams = useMemo(
    () => ({
      sort: mappedSort as SortOption,
      filter: "all" as FilterOption,
      category: activeCategory || undefined,
    }),
    [activeCategory, mappedSort]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isPlaceholderData,
    error: queryError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["tasks", queryParams],
    queryFn: async ({ pageParam = 1 }) => {
      return fetchTasks({ ...queryParams, page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const p = lastPage?.page || 1;
      const totalPages = lastPage?.totalPages || 1;
      return p < totalPages ? p + 1 : undefined;
    },
    initialData: initialData && initialData.tasks ? { pages: [initialData], pageParams: [1] } : undefined,
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  const tasks = data?.pages.flatMap((p: any) => p?.tasks || []) || [];
  const total = data?.pages[0]?.total ?? 0;
  const authRequired = queryError instanceof AuthRequiredError;
  const error = queryError && !authRequired ? (queryError instanceof Error ? queryError.message : "Failed to load tasks.") : null;

  // Infinite scroll
  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage || authRequired) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.1 }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [isLoading, isFetchingNextPage, hasNextPage, authRequired, fetchNextPage]);

  const isInitialLoading = isLoading && tasks.length === 0 && !error && !authRequired;

  return (
      <main className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-2 flex-1 selection:bg-neutral-800 selection:text-white">
        <div className="mx-auto w-full max-w-[1440px] space-y-3">
          {/* Top Sliding Category Row */}
          <div className="mb-2 flex flex-nowrap items-center justify-start gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full px-4 md:px-0">
          {TASK_CATEGORIES.map((topic) => {
            const isSelected = activeCategory === topic.slug;
            return (
              <button
                key={topic.name}
                onClick={(e) => {
                  setActiveCategory(topic.slug);
                  if (topic.slug) {
                    router.push(`/tasks/${topic.slug}`);
                  } else {
                    router.push(`/tasks`);
                  }
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                  });
                }}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
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
          <TaskAuthRequired
            message="Sign in to see tasks you're following."
          />
        ) : error && tasks.length === 0 ? (
          <TaskErrorState message={error} onRetry={() => refetch()} />
        ) : tasks.length === 0 ? (
          <EmptyTasks />
        ) : (
          <div className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#131316]/60 to-[#0D0D10]/60 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_20px_60px_-30px_rgba(0,0,0,0.8)] ring-1 ring-[#232326]/70 transition-opacity duration-150 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}>
            <div className="grid grid-cols-[48px_minmax(220px,1.6fr)_repeat(6,minmax(90px,1fr))] items-center gap-4 px-5 py-2.5 border-b border-[#232326]/70 bg-[#0A0A0C]/90 backdrop-blur-sm sticky top-0 z-10">
              <span />
              <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A]">Task</span>
              {COLUMN_LABELS.map((label) => (
                <span
                  key={label}
                  className="text-right text-[10px] font-mono uppercase tracking-[0.12em] text-[#71717A]"
                >
                  {label}
                </span>
              ))}
            </div>

            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {error && tasks.length > 0 && (
              <div className="px-5 py-3 text-xs text-red-400 border-t border-[#232326]/60">
                Failed to load more tasks: {error}
              </div>
            )}

            {hasNextPage && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-[#A78BFA]" />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}