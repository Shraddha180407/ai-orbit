import React, { useMemo } from "react";
import Link from "next/link";
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Bell from 'lucide-react/dist/esm/icons/bell';
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import Brain from 'lucide-react/dist/esm/icons/brain';
import Monitor from 'lucide-react/dist/esm/icons/monitor';
import Link2 from 'lucide-react/dist/esm/icons/link-2';
import Heart from 'lucide-react/dist/esm/icons/heart';
import Star from 'lucide-react/dist/esm/icons/star';
import type { Task } from "@/lib/tasks-api";
import { getCategoryIcon } from "@/lib/category-icons";
import { TaskCard } from "./TaskCard";
import { TaskDetailActions } from "./TaskDetailActions";

type TaskDetailProps = {
  task: Task;
  relatedTasks: Task[];
  bookmarked: boolean;
  liked: boolean;
  subscribed: boolean;
};

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString("en-US");
}

function difficultyBadgeClasses(difficulty: Task["difficulty"] | undefined): string {
  switch (difficulty) {
    case "EASY":
      return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30";
    case "MEDIUM":
      return "bg-amber-500/10 text-amber-400 ring-amber-500/30";
    case "ADVANCED":
      return "bg-red-500/10 text-red-400 ring-red-500/30";
    default:
      return "bg-[#18181C] text-[#A1A1AA] ring-[#232326]";
  }
}

function pricingBadgeClasses(pricing: Task["pricingModel"] | undefined): string {
  switch (pricing) {
    case "FREE":
      return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30";
    case "PAID":
      return "bg-[#6E56CF]/10 text-[#A78BFA] ring-[#6E56CF]/30";
    case "FREEMIUM":
      return "bg-sky-500/10 text-sky-400 ring-sky-500/30";
    case "FREE_TRIAL":
      return "bg-amber-500/10 text-amber-400 ring-amber-500/30";
    default:
      return "bg-[#18181C] text-[#A1A1AA] ring-[#232326]";
  }
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "—";
  }
}

const STAT_ITEMS: {
  key: keyof Pick<Task, "tools" | "models" | "devices" | "resources" | "subscribers" | "likes" | "saves">;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}[] = [
  { key: "tools", label: "Tools", icon: Wrench },
  { key: "models", label: "Models", icon: Brain },
  { key: "devices", label: "Devices", icon: Monitor },
  { key: "resources", label: "Resources", icon: Link2 },
  { key: "subscribers", label: "Subscribers", icon: Bell },
  { key: "likes", label: "Likes", icon: Heart },
  { key: "saves", label: "Saves", icon: Bookmark },
];

export function TaskDetail({ task, relatedTasks, bookmarked, liked, subscribed }: TaskDetailProps) {
  const categoryName = task.category?.name ?? "Uncategorized";
  const categorySlug = task.category?.slug;
  // useMemo keeps this stable across re-renders — required by
  // react-hooks/static-components.
  const CategoryIcon = useMemo(() => getCategoryIcon(categorySlug), [categorySlug]);
  const title = task.title ?? "Untitled Task";
  const description = task.description ?? "";

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="w-full max-w-none px-6 lg:px-10 xl:px-14 py-8 flex-1">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center flex-wrap gap-1.5 text-xs text-[#71717A] font-mono">
            <li>
              <Link href="/" className="hover:text-white transition-colors duration-200">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" />
              <Link href="/tasks" className="hover:text-white transition-colors duration-200">
                Tasks
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{categoryName}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{title}</span>
            </li>
          </ol>
        </nav>

        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors duration-200 mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60 rounded"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to Tasks
        </Link>

        <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#131316]/70 to-[#0D0D10]/70 ring-1 ring-[#232326]/70 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_30px_80px_-40px_rgba(0,0,0,0.9)] p-6 sm:p-9 mb-6">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-[0.12] blur-3xl"
            style={{ background: "radial-gradient(circle, #6E56CF, transparent 70%)" }}
            aria-hidden="true"
          />

          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#18181C] to-[#0A0A0C] flex items-center justify-center ring-1 ring-[#232326]/70 shrink-0 text-[#A78BFA] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <CategoryIcon className="h-7 w-7" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{title}</h1>
                  {task.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6E56CF]/10 text-[#A78BFA] text-[9px] ring-1 ring-[#6E56CF]/30 font-mono uppercase tracking-wide">
                      <Star className="h-2.5 w-2.5 fill-[#A78BFA]" aria-hidden="true" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#18181C]/80 text-[11px] text-[#A1A1AA] ring-1 ring-[#232326]/70 font-mono">
                    {categoryName}
                  </span>
                  {task.difficulty && (
                    <span className={`px-2.5 py-1 rounded-md text-[11px] ring-1 font-mono ${difficultyBadgeClasses(task.difficulty)}`}>
                      {task.difficulty}
                    </span>
                  )}
                  {task.pricingModel && (
                    <span className={`px-2.5 py-1 rounded-md text-[11px] ring-1 font-mono ${pricingBadgeClasses(task.pricingModel)}`}>
                      {task.pricingModel}
                    </span>
                  )}
                  {task.creator?.name && (
                    <span className="px-2.5 py-1 rounded-md bg-[#18181C]/80 text-[11px] text-[#A1A1AA] ring-1 ring-[#232326]/70 font-mono">
                      by <strong className="text-white font-medium">{task.creator.name}</strong>
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-md bg-[#18181C]/80 text-[11px] text-[#71717A] ring-1 ring-[#232326]/70 font-mono">
                    {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>
            </div>

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
          </div>

          {description && <p className="relative text-sm text-[#A1A1AA] mt-6 leading-relaxed max-w-2xl">{description}</p>}

          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
            {STAT_ITEMS.map(({ key, label, icon: Icon }) => (
              <div
                key={key}
                className="rounded-xl bg-gradient-to-b from-[#18181C]/80 to-[#131316]/40 ring-1 ring-[#232326]/60 px-4 py-3.5 transition-all duration-200 hover:ring-[#6E56CF]/40"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#71717A] uppercase tracking-[0.1em]">
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  {label}
                </div>
                <div className="text-lg font-bold text-white mt-1.5 tabular-nums">{formatCount(task[key])}</div>
              </div>
            ))}
          </div>

          <div className="relative flex flex-wrap items-center gap-2 mt-7 pt-7 border-t border-[#232326]/60">
            <span className="inline-flex items-center rounded-full bg-[#0A0A0C]/60 ring-1 ring-[#232326]/60 px-3.5 py-1.5 text-xs text-[#D4D4D8]">
              {categoryName}
            </span>
            {task.difficulty && (
              <span className="inline-flex items-center rounded-full bg-[#0A0A0C]/60 ring-1 ring-[#232326]/60 px-3.5 py-1.5 text-xs text-[#D4D4D8]">
                {task.difficulty}
              </span>
            )}
            {task.pricingModel && (
              <span className="inline-flex items-center rounded-full bg-[#0A0A0C]/60 ring-1 ring-[#232326]/60 px-3.5 py-1.5 text-xs text-[#D4D4D8]">
                {task.pricingModel}
              </span>
            )}
            {task.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#6E56CF]/10 ring-1 ring-[#6E56CF]/30 px-3.5 py-1.5 text-xs text-[#A78BFA]">
                <Star className="h-3 w-3 fill-[#A78BFA]" aria-hidden="true" />
                Featured
              </span>
            )}
          </div>
        </div>

        {relatedTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Related Tasks</h2>
            <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#131316]/60 to-[#0D0D10]/60 ring-1 ring-[#232326]/70 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
              {relatedTasks.map((related) => (
                <TaskCard key={related.id} task={related} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
