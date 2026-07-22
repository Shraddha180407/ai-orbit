'use client';

import React, { useMemo } from "react";
import Link from "next/link";
import Bell from 'lucide-react/dist/esm/icons/bell';
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import Brain from 'lucide-react/dist/esm/icons/brain';
import Bot from 'lucide-react/dist/esm/icons/bot';
import Monitor from 'lucide-react/dist/esm/icons/monitor';
import type { Task } from "@/lib/tasks-api";
import { getCategoryIcon } from "@/lib/category-icons";

type TaskCardProps = {
  task: Task;
};

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString();
}

export function TaskCard({ task }: TaskCardProps) {
  // useMemo keeps the icon reference stable across re-renders — required
  // by the react-hooks/static-components rule, since a dynamically-chosen
  // component must not be recreated on every render.
  const CategoryIcon = useMemo(() => getCategoryIcon(task.category?.slug), [task.category?.slug]);

  return (
    <Link
      href={`/tasks/${task.slug}`}
      className="group relative grid grid-cols-[48px_minmax(220px,1.6fr)_repeat(6,minmax(90px,1fr))] items-center gap-4 px-5 py-2.5 border-b border-[#232326]/50 last:border-b-0 transition-colors duration-200 hover:bg-gradient-to-r hover:from-[#18181C]/70 hover:to-[#131316]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60 focus-visible:ring-inset"
    >
      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#6E56CF] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-200" />

      <div className="h-7 w-7 rounded-md bg-[#18181C] flex items-center justify-center border border-[#232326]/60 shrink-0 text-[#A78BFA]">
        <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <span className="text-sm font-semibold text-white truncate block group-hover:text-[#A78BFA] transition-colors duration-200">
          {task.title}
        </span>
      </div>

      <span className="flex items-center justify-end gap-2 text-xs text-[#A1A1AA] font-mono tabular-nums">
        <Bell className="h-4 w-4 text-[#71717A] shrink-0" aria-hidden="true" />
        {formatCount(task.subscribers)}
      </span>
      <span className="flex items-center justify-end gap-2 text-xs text-[#A1A1AA] font-mono tabular-nums">
        <Bookmark className="h-4 w-4 text-[#71717A] shrink-0" aria-hidden="true" />
        {formatCount(task.saves)}
      </span>
      <span className="flex items-center justify-end gap-2 text-xs text-[#A1A1AA] font-mono tabular-nums">
        <Wrench className="h-4 w-4 text-[#71717A] shrink-0" aria-hidden="true" />
        {formatCount(task.tools)}
      </span>
      <span className="flex items-center justify-end gap-2 text-xs text-[#A1A1AA] font-mono tabular-nums">
        <Brain className="h-4 w-4 text-[#71717A] shrink-0" aria-hidden="true" />
        {formatCount(task.models)}
      </span>
      <span className="flex items-center justify-end gap-2 text-xs text-[#A1A1AA] font-mono tabular-nums">
        <Bot className="h-4 w-4 text-[#71717A] shrink-0" aria-hidden="true" />
        {formatCount(task.robots)}
      </span>
      <span className="flex items-center justify-end gap-2 text-xs text-[#A1A1AA] font-mono tabular-nums">
        <Monitor className="h-4 w-4 text-[#71717A] shrink-0" aria-hidden="true" />
        {formatCount(task.devices)}
      </span>
    </Link>
  );
}