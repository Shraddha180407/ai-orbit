'use client';

import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Check from 'lucide-react/dist/esm/icons/check';
import type { Task } from "@/lib/tasks-api";
import { toggleBookmark } from "@/lib/tasks-api";
import { getCategoryIcon } from "@/lib/category-icons";

type TaskCardProps = {
  task: Task;
};

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString("en-US");
}

export function TaskCard({ task }: TaskCardProps) {
  const CategoryIcon = useMemo(
    () => getCategoryIcon(task.category?.slug),
    [task.category?.slug]
  );

  const [imgError, setImgError] = useState(false);
  const showImage = task.iconUrl && !imgError;

  // Note: the list API doesn't return per-task bookmarked state (only the
  // detail endpoint does), so this always starts unsaved even if the task
  // was previously bookmarked. It still toggles correctly going forward.
  const [saved, setSaved] = useState(false);
  const [savePending, setSavePending] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (savePending) return;

      const next = !saved;
      setSaved(next);
      setSavePending(true);

      try {
        const res = await toggleBookmark(task.slug, task.id);
        setSaved(res.bookmarked);
      } catch {
        setSaved(!next);
      } finally {
        setSavePending(false);
      }
    },
    [saved, savePending, task.slug, task.id]
  );

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/tasks/${task.slug}`
          : `/tasks/${task.slug}`;

      const nav: Navigator | undefined =
        typeof navigator !== "undefined" ? navigator : undefined;

      if (nav?.share) {
        try {
          await nav.share({
            title: task.title,
            url,
          });
          return;
        } catch {
          return;
        }
      }

      try {
        await nav?.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard unavailable — silently ignore
      }
    },
    [task.slug, task.title]
  );

  return (
    <Link
      href={`/tasks/${task.slug}`}
      className="group relative grid grid-cols-[40px_minmax(0,1fr)_auto] sm:grid-cols-[44px_minmax(0,2fr)_repeat(4,minmax(0,1fr))_100px] items-center gap-3 px-4 sm:px-5 py-2.5 border-b border-[#232326]/50 last:border-b-0 transition-colors duration-200 hover:bg-gradient-to-r hover:from-[#18181C]/70 hover:to-[#131316]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60 focus-visible:ring-inset"
    >
      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#6E56CF] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-200" />

      {/* Task icon */}
      <div className="h-7 w-7 rounded-md bg-[#18181C] flex items-center justify-center border border-[#232326]/60 shrink-0 text-[#A78BFA] overflow-hidden">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={task.iconUrl!}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <CategoryIcon
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Task information */}
      <div className="min-w-0">
        <span className="text-sm font-semibold text-white truncate block group-hover:text-[#A78BFA] transition-colors duration-200">
          {task.title}
        </span>

        {task.description && (
          <span className="text-xs text-[#A1A1AA] truncate block mt-0.5">
            {task.description}
          </span>
        )}
      </div>
{/* Tools count */}
<span className="hidden sm:flex items-center justify-center text-xs text-[#D4D4D8] font-mono tabular-nums">
  {formatCount(task.tools)}
</span>

{/* Models count */}
<span className="hidden sm:flex items-center justify-center text-xs text-[#D4D4D8] font-mono tabular-nums">
  {formatCount(task.models)}
</span>

{/* Robots count */}
<span className="hidden sm:flex items-center justify-center text-xs text-[#D4D4D8] font-mono tabular-nums">
  {formatCount(task.robots)}
</span>

{/* Devices count */}
<span className="hidden sm:flex items-center justify-center text-xs text-[#D4D4D8] font-mono tabular-nums">
  {formatCount(task.devices)}
</span>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleSave}
          aria-pressed={saved}
          aria-label={saved ? "Remove bookmark" : "Save task"}
          className={`inline-flex items-center justify-center h-7 w-7 rounded-md transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60 ${
            saved
              ? "text-[#A78BFA]"
              : "text-[#71717A] hover:text-white hover:bg-white/5"
          }`}
        >
          <Bookmark
            className={`h-3.5 w-3.5 ${
              saved ? "fill-[#A78BFA]" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share task"
          className="inline-flex items-center justify-center h-7 w-7 rounded-md text-[#71717A] hover:text-white hover:bg-white/5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60"
        >
          {copied ? (
            <Check
              className="h-3.5 w-3.5 text-emerald-400"
              aria-hidden="true"
            />
          ) : (
            <Share2
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </Link>
  );
}