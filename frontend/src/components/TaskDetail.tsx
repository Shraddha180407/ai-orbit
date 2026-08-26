'use client';

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Bell from 'lucide-react/dist/esm/icons/bell';
import MoreHorizontal from 'lucide-react/dist/esm/icons/more-horizontal';
import type { Task, TaskDetail as TaskDetailData } from "@/lib/tasks-api";
import { getSubcategories } from "@/lib/subcategories-data";
import { TaskDetailActions } from "./TaskDetailActions";
import { TaskToolsList } from "./TaskToolsList";

type TaskDetailProps = {
  task: TaskDetailData;
  relatedTasks: Task[];
  bookmarked: boolean;
  liked: boolean;
  subscribed: boolean;
};;

const VISIBLE_CHIPS_LIMIT = 6;

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString("en-US");
}


function StatColumn({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[#71717A] mb-1.5">{label}</div>
      <div className="text-lg font-bold text-white tabular-nums">{value}</div>
    </div>
  );
}

export function TaskDetail({ task, relatedTasks, bookmarked, liked, subscribed }: TaskDetailProps) {
  const categoryName = task.category?.name ?? "Uncategorized";
  const categorySlug = task.category?.slug;
  const title = task.title ?? "Untitled Task";
  const description = task.description ?? "";

  const relevantTools = task.popularTools ?? [];
const popularTool = relevantTools[0];
  const subcategories = useMemo(() => getSubcategories(categorySlug), [categorySlug]);

  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [showAllChips, setShowAllChips] = useState(false);

  const visibleChips = showAllChips ? subcategories : subcategories.slice(0, VISIBLE_CHIPS_LIMIT);
  const hiddenChipCount = subcategories.length - visibleChips.length;

  const filteredTools = relevantTools;

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="w-full px-6 lg:px-10 py-6 flex-1">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 text-xs text-[#71717A] hover:text-white transition-colors duration-200 mb-3"
        >
          ← Back to Tasks
        </Link>

        <div className="w-full rounded-2xl bg-[#0B0B0E] ring-1 ring-[#232326]/60 p-6 sm:p-7 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{title}</h1>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#18181C] ring-1 ring-[#232326]/70 text-[11px] text-[#A1A1AA] font-mono">
                  {categoryName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#18181C] ring-1 ring-[#232326]/70 text-[11px] text-[#A1A1AA]">
                  <Bell className="h-3 w-3" aria-hidden="true" />
                  {formatCount(task.subscribers)} subscribers
                </span>
                {task.difficulty && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#18181C] ring-1 ring-[#232326]/70 text-[11px] text-[#A1A1AA] font-mono">
                    {task.difficulty}
                  </span>
                )}
                {task.pricingModel && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#18181C] ring-1 ring-[#232326]/70 text-[11px] text-[#A1A1AA] font-mono">
                    {task.pricingModel}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <TaskDetailActions
                slug={task.slug}
                taskId={task.id}
                taskTitle={title}
                initialLiked={liked}
                initialSubscribed={subscribed}
                initialBookmarked={bookmarked}
                initialLikes={task.likes ?? 0}
                initialSaves={task.saves ?? 0}
              />
              <button
                type="button"
                aria-label="More options"
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-[#18181C]/80 ring-1 ring-[#232326]/70 text-[#A1A1AA] hover:text-white hover:ring-[#3A3A3E] transition-all duration-200"
              >
                <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {description && <p className="text-sm text-[#A1A1AA] mt-4 max-w-2xl">{description}</p>}

          <p className="text-sm text-[#A1A1AA] mt-1">
            There are {formatCount(task.tools)} AI tools for {title}.
          </p>

          <div className="flex flex-wrap gap-x-10 gap-y-4 mt-6">
            <StatColumn label="Number of tools" value={formatCount(task.tools)} />
            <StatColumn label="Number of models" value={formatCount(task.models)} />
            <StatColumn label="Number of robots" value={formatCount(task.robots)} />
            <StatColumn label="Number of devices" value={formatCount(task.devices)} />
            {popularTool && (
              <div>
                <div className="text-xs text-[#71717A] mb-1.5">Most popular</div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#18181C] ring-1 ring-[#232326]/70 px-3 py-1.5 text-sm text-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {popularTool.logoUrl ? (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={popularTool.logoUrl}
    alt=""
    className="h-4 w-4 rounded"
  />
) : null}
                  {popularTool.name}
                </span>
              </div>
            )}
          </div>

          {subcategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-[#232326]/60">
              <button
                type="button"
                onClick={() => setActiveSubcategory(null)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  activeSubcategory === null
                    ? "bg-white text-black"
                    : "bg-[#18181C] ring-1 ring-[#232326]/70 text-[#D4D4D8] hover:text-white hover:ring-[#3A3A3E]"
                }`}
              >
                All
                <span className={activeSubcategory === null ? "text-black/60" : "text-[#71717A]"}>
                  {relevantTools.length}
                </span>
              </button>

              {visibleChips.map((sc) => {
                const isActive = activeSubcategory === sc.label;
                return (
                  <button
                    key={sc.label}
                    type="button"
                    onClick={() => setActiveSubcategory(isActive ? null : sc.label)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-white text-black"
                        : "bg-[#18181C] ring-1 ring-[#232326]/70 text-[#D4D4D8] hover:text-white hover:ring-[#3A3A3E]"
                    }`}
                  >
                    {sc.label}
                    <span className={isActive ? "text-black/60" : "text-[#71717A]"}>{sc.count}</span>
                  </button>
                );
              })}

              {hiddenChipCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllChips(true)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-[#18181C] ring-1 ring-[#232326]/70 text-[#A78BFA] hover:text-white hover:ring-[#3A3A3E] transition-all duration-150"
                >
                  +{hiddenChipCount} more
                </button>
              )}

              {showAllChips && subcategories.length > VISIBLE_CHIPS_LIMIT && (
                <button
                  type="button"
                  onClick={() => setShowAllChips(false)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-[#18181C] ring-1 ring-[#232326]/70 text-[#A78BFA] hover:text-white hover:ring-[#3A3A3E] transition-all duration-150"
                >
                  Show less
                </button>
              )}
            </div>
          )}
        </div>

        <TaskToolsList tools={filteredTools} />
      </main>
    </div>
  );
}