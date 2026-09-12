"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Video, formatDuration, getChannelUrl } from "@/lib/video-types";
import { API_URL, type VideoSortBy, type VideoSortDir } from "@/lib/videos-data";
import { setInCache } from "@/lib/api-cache";
import { ThumbImage } from "./ThumbImage";
import { VideoSaveButton } from "./VideoSaveButton";
import { VideoShareButton } from "./VideoShareButton";

type SortDir = "asc" | "desc";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;
type Level = (typeof LEVELS)[number];

const LEVEL_STYLES: Record<Level, string> = {
Beginner: "bg-success/10 text-success",
Intermediate: "bg-accent-soft text-accent-hover",
Advanced: "bg-amber-400/10 text-amber-400",
Expert: "bg-rose-400/10 text-rose-400",
};

function levelFor(id: string): Level {
let hash = 0;
for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
return LEVELS[hash % LEVELS.length];
}

function formatPosted(iso: string) {
const d = new Date(iso);
return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatViewsCompact(n: number) {
return n.toLocaleString("en-US");
}

function SortDirectionIcon({ active, dir }: { active: boolean; dir: SortDir }) {
if (!active) {
return (
<svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-50">
<path d="M4.5 6.5 8 3l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
<path d="M4.5 9.5 8 13l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
</svg>
);
}
return (
<svg
width="12"
height="12"
viewBox="0 0 16 16"
fill="none"
className={`shrink-0 transition-transform ${dir === "asc" ? "" : "rotate-180"}`}
>
<path d="M4.5 9.5 8 6l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
</svg>
);
}

function FilterIcon({ active }: { active?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      className={active ? "text-[#6E56CF] shrink-0" : "text-[#A1A1AA] hover:text-white transition-colors shrink-0"}>
      <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round"/>
      <line x1="8" y1="12" x2="16" y2="12" strokeLinecap="round"/>
      <line x1="11" y1="18" x2="13" y2="18" strokeLinecap="round"/>
    </svg>
  );
}

function MobileSortBar({
sortBy,
sortDir,
onSortChange,
}: {
sortBy: VideoSortBy;
sortDir: SortDir;
onSortChange: (key: VideoSortBy) => void;
}) {
const options: { key: VideoSortBy; label: string }[] = [
{ key: "posted", label: "Posted" },
{ key: "duration", label: "Duration" },
{ key: "views", label: "Views" },
{ key: "name", label: "Name" },
];

return (
<div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none sm:hidden">
{options.map((opt) => {
const active = sortBy === opt.key;
return (
<button
key={opt.key}
onClick={() => onSortChange(opt.key)}
className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 font-mono text-[9.5px] font-medium transition-colors ${
active
? "border-[var(--brand-accent,theme(colors.accent.DEFAULT))] bg-accent-soft text-accent-hover"
: "border-border text-secondary"
}`}
>
{opt.label}
{active && (
<svg
width="10"
height="10"
viewBox="0 0 16 16"
fill="none"
className={`shrink-0 transition-transform ${sortDir === "asc" ? "rotate-180" : ""}`}
>
<path d="M4 6.5 8 10.5 12 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
</svg>
)}
</button>
);
})}
</div>
);
}

function MobileTable({
  videos,
  onThumbFailed,
  onVideoSelect,
}: {
  videos: Video[];
  onThumbFailed: (id: string) => void;
  onVideoSelect?: (video: Video) => void;
}) {
return (
<table className="w-full table-fixed border-collapse sm:hidden">
<colgroup>
<col />
<col className="w-[92px]" />
</colgroup>
<thead>
<tr className="border-b border-white/[0.05]">
<th className="select-none py-2 pl-0 pr-2 text-left font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted">
Name
</th>
<th className="select-none py-2 pl-2 pr-0 text-right font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted">
Posted
</th>
</tr>
</thead>
<tbody>
{videos.map((v) => (
<tr
  key={v.id}
  className="border-b border-white/[0.05] active:bg-bg-hover cursor-pointer"
  style={{ ["--row-accent" as string]: v.accent }}
  onClick={() => onVideoSelect?.(v)}
>
<td className="py-2.5 pr-2">
<Link
  href={`/videos/${v.slug}`}
  onClick={(e) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && onVideoSelect) {
      e.preventDefault();
      onVideoSelect(v);
    }
  }}
  className="flex min-w-0 items-center gap-2.5"
>
<span className="relative block h-[46px] w-[80px] shrink-0 overflow-hidden rounded-md bg-bg-elevated">
<ThumbImage
src={v.thumbnail}
alt=""
toolName={v.toolName}
accent={v.accent}
sizes="80px"
onError={() => onThumbFailed(v.id)}
/>
<span className="absolute bottom-0.5 right-0.5 z-10 rounded bg-black/75 px-1 py-[1px] text-[10px] font-medium text-white">
{formatDuration(v.durationSeconds)}
</span>
</span>
<span className="block min-w-0 truncate text-[13px] font-medium leading-snug text-primary">
{v.title}
</span>
</Link>
</td>
<td className="whitespace-nowrap py-2.5 pl-2 text-right font-mono text-[12px] text-secondary">
{formatPosted(v.publishedAt)}
</td>
</tr>
))}
</tbody>
</table>
);
}

export function VideoTable({
videos,
sortBy,
sortDir,
onSortChange,
onVideoSelect,
}: {
videos: Video[];
sortBy: VideoSortBy;
sortDir: SortDir;
onSortChange: (key: VideoSortBy) => void;
onVideoSelect?: (video: Video) => void;
}) {
// Seed all visible videos into client cache immediately for 0ms instant playback
useEffect(() => {
  if (videos && videos.length > 0) {
    videos.forEach((v) => {
      if (v.slug) {
        setInCache(`${API_URL}/api/videos/${encodeURIComponent(v.slug)}`, v, 30 * 60 * 1000);
      }
    });
  }
}, [videos]);
// Every row in this list must show a real thumbnail — if one fails to
// load, the video is dropped from the list entirely rather than shown
// with a placeholder (see ThumbImage's onError prop).
const [failedThumbIds, setFailedThumbIds] = useState<Set<string>>(new Set());

function markThumbFailed(id: string) {
setFailedThumbIds((prev) => {
if (prev.has(id)) return prev;
const next = new Set(prev);
next.add(id);
return next;
});
}

// Level is fake/derived data (see levelFor above) — there's no real
// backend field to sort by, so unlike Name/Posted/Duration/Views it's
// sorted entirely client-side, against whatever page of results is
// currently loaded, and lives as its own local state rather than going
// through the parent's backend-driven sortBy/sortDir.
const [levelSortDir, setLevelSortDir] = useState<SortDir | null>(null);

function toggleLevelSort() {
setLevelSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
}

function handleColumnSort(key: VideoSortBy) {
// Switching to a real backend-sorted column cancels any active local
// Level sort, so only one sort is ever visibly "active" at a time.
setLevelSortDir(null);
onSortChange(key);
}

// Which column is active for highlighting/icon purposes — either the
// parent's backend sort, or the local Level sort if one is active.
const activeKey: VideoSortBy | "level" = levelSortDir !== null ? "level" : sortBy;
const activeDir: SortDir = levelSortDir !== null ? levelSortDir : sortDir;

// Sort order normally comes from the backend (see VideosPageClient) —
// sorting only the currently-loaded page(s) client-side gave wrong
// results across the full dataset. Level is the one exception, since
// it's not real data the backend has anything to sort by.
let sorted = videos.filter((v) => !failedThumbIds.has(v.id));
if (levelSortDir !== null) {
const order = { Beginner: 0, Intermediate: 1, Advanced: 2, Expert: 3 } as const;
sorted = [...sorted].sort((a, b) => {
const cmp = order[levelFor(a.id)] - order[levelFor(b.id)];
return levelSortDir === "asc" ? cmp : -cmp;
});
}

const columns: { key: VideoSortBy; label: string; align?: "right" }[] = [
{ key: "name", label: "Name" },
{ key: "posted", label: "Posted" },
{ key: "duration", label: "Duration" },
{ key: "views", label: "Views", align: "right" },
];

return (
<div>
{/* Mobile: 2-column table (Name, Posted only), sm and up: full table below */}
<MobileSortBar sortBy={sortBy} sortDir={sortDir} onSortChange={onSortChange} />

<div className="sm:hidden">
<MobileTable videos={sorted} onThumbFailed={markThumbFailed} onVideoSelect={onVideoSelect} />
</div>

<div className="hidden overflow-x-auto sm:block">
<table className="w-full min-w-[760px] table-fixed border-collapse">
<colgroup>
<col className="w-[34%]" />
<col className="w-[100px]" />
<col className="w-[90px]" />
<col className="w-[90px]" />
<col className="w-[110px]" />
<col className="w-[120px]" />
<col className="w-[140px]" />
<col className="w-20" />
</colgroup>
<thead>
<tr className="border-b border-white/[0.05]">
{columns.map((col) => (
<th
key={col.key}
className={`select-none px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted ${
col.align === "right" ? "text-right" : ""
} ${col.key === "name" ? "pl-4" : ""}`}
>
<button
onClick={() => handleColumnSort(col.key)}
className={`inline-flex items-center gap-1.5 transition-colors hover:text-secondary ${
activeKey === col.key ? "text-secondary" : ""
}`}
>
{col.label}
{col.key === "name" && <FilterIcon />}
<SortDirectionIcon active={activeKey === col.key} dir={activeKey === col.key ? activeDir : "asc"} />
</button>
</th>
))}
<th className="select-none px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
<button
onClick={toggleLevelSort}
className={`inline-flex items-center gap-1.5 transition-colors hover:text-secondary ${
activeKey === "level" ? "text-secondary" : ""
}`}
>
Level
<SortDirectionIcon active={activeKey === "level"} dir={activeKey === "level" ? activeDir : "asc"} />
</button>
</th>
<th className="px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
Category
</th>
<th className="px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
Channel
</th>
<th className="px-4 py-[9.6px]" aria-hidden="true" />
</tr>
</thead>
<tbody>
{sorted.map((v) => (
<tr
key={v.id}
onClick={(e) => {
  const target = e.target as HTMLElement | null;
  if (target?.closest("a[target='_blank'], button, [role='button']")) {
    return;
  }
  if (!e.ctrlKey && !e.metaKey && !e.shiftKey && onVideoSelect) {
    e.preventDefault();
    onVideoSelect(v);
  }
}}
className="group relative border-b border-white/[0.03] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-bg-hover hover:shadow-[0_1px_2px_rgba(0,0,0,0.35),0_8px_24px_rgba(0,0,0,0.18)] cursor-pointer"
style={{ ["--row-accent" as string]: v.accent }}
>
<td className="relative py-[9.6px] pl-4 pr-4">
<span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[var(--row-accent)] transition-all duration-200 group-hover:h-[70%]" />
<Link
  href={`/videos/${v.slug}`}
  onClick={(e) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && onVideoSelect) {
      e.preventDefault();
      onVideoSelect(v);
    }
  }}
  className="flex items-center gap-3.5"
>
<span className="relative block h-[48px] w-[85px] shrink-0 overflow-hidden rounded-none bg-bg-elevated transition-transform duration-300 ease-out group-hover:scale-[1.04] group-hover:shadow-[0_0_0_1.5px_var(--row-accent)]">
<ThumbImage
src={v.thumbnail}
alt=""
toolName={v.toolName}
accent={v.accent}
sizes="106px"
onError={() => markThumbFailed(v.id)}
/>
<span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
<span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-md">
<svg width="11" height="11" viewBox="0 0 16 16" fill="#08090a">
<path d="M3 1.7a.7.7 0 0 1 1.06-.6l10.6 6.3a.7.7 0 0 1 0 1.2L4.06 14.9A.7.7 0 0 1 3 14.3V1.7Z" />
</svg>
</span>
</span>
<span className="absolute bottom-1 right-1 z-10 flex items-center gap-1 rounded bg-black/75 px-1.5 py-[2px] text-[11px] font-medium text-white">
{formatDuration(v.durationSeconds)}
</span>
</span>
<span className="min-w-0">
<span className="block truncate text-[15px] font-medium leading-snug text-primary transition-colors group-hover:text-[var(--row-accent)]">
{v.title}
</span>
</span>
</Link>
</td>
<td className="whitespace-nowrap px-4 py-[9.6px] font-mono text-[13.5px] text-secondary">
{formatPosted(v.publishedAt)}
</td>
<td className="whitespace-nowrap px-4 py-[9.6px] font-mono text-[13.5px] text-secondary">
{formatDuration(v.durationSeconds)}
</td>
<td className="whitespace-nowrap px-4 py-[9.6px] text-right font-mono text-[13.5px] text-secondary">
{formatViewsCompact(v.views)}
</td>
<td className="whitespace-nowrap px-4 py-[9.6px]">
<span
className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[12px] font-semibold ${
LEVEL_STYLES[levelFor(v.id)]
}`}
>
{levelFor(v.id)}
</span>
</td>
<td className="whitespace-nowrap px-4 py-[9.6px]">
<span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 font-mono text-[12px] font-medium text-secondary">
{v.toolCategory}
</span>
</td>
<td className="px-4 py-[9.6px]">
<a
href={getChannelUrl(v.channelId, v.author?.name || v.authorName || v.channel)}
target="_blank"
rel="noopener noreferrer"
className="group/channel inline-flex items-start gap-1.5"
>
<span className="line-clamp-2 whitespace-normal break-words text-[13.5px] font-medium leading-snug text-secondary transition-colors group-hover/channel:text-primary">
{v.author?.name || v.authorName || v.channel || "Channel"}
</span>
<svg
width="12"
height="12"
viewBox="0 0 16 16"
fill="none"
style={{ flexShrink: 0, display: "block" }}
className="mt-0.5 text-secondary transition-all group-hover/channel:translate-x-0.5 group-hover/channel:-translate-y-0.5 group-hover/channel:text-primary"
>
<path
d="M4 12L12 4M12 4H5.5M12 4V10.5"
stroke="currentColor"
strokeWidth="1.5"
strokeLinecap="round"
strokeLinejoin="round"
/>
</svg>
</a>
</td>
<td className="px-4 py-[9.6px] text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1.5">
<VideoShareButton slug={v.slug} title={v.title} />
<VideoSaveButton id={v.id} />
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}

export function VideoTableSkeleton({ rowCount = 8 }: { rowCount?: number }) {
  const rows = Array.from({ length: rowCount }, (_, i) => i);

  return (
    <div className="w-full">
      {/* Mobile Skeleton */}
      <div className="sm:hidden">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col />
            <col className="w-[92px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/[0.05]">
              <th className="py-2 pl-0 pr-2 text-left font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                Name
              </th>
              <th className="py-2 pl-2 pr-0 text-right font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                Posted
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i} className="border-b border-white/[0.04]">
                <td className="py-2.5 pr-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="h-[46px] w-[80px] shrink-0 rounded-md bg-[#18181c] animate-pulse" />
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div
                        className="h-3.5 rounded bg-[#1e1e24] animate-pulse"
                        style={{ width: `${65 + ((i * 17) % 30)}%` }}
                      />
                      <div className="h-2.5 w-16 rounded bg-[#151518] animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="py-2.5 pl-2 text-right">
                  <div className="ml-auto h-3 w-16 rounded bg-[#18181c] animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[760px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[100px]" />
            <col className="w-[90px]" />
            <col className="w-[90px]" />
            <col className="w-[110px]" />
            <col className="w-[120px]" />
            <col className="w-[140px]" />
            <col className="w-20" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/[0.05]">
              <th className="px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted pl-4">
                Name
              </th>
              <th className="px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                Posted
              </th>
              <th className="px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                Duration
              </th>
              <th className="px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                Views
              </th>
              <th className="px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                Level
              </th>
              <th className="px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                Category
              </th>
              <th className="px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                Channel
              </th>
              <th className="px-4 py-[9.6px]" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i} className="border-b border-white/[0.03]">
                <td className="py-[9.6px] pl-4 pr-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-[48px] w-[85px] shrink-0 rounded bg-[#18181c] animate-pulse" />
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div
                        className="h-3.5 rounded bg-[#1e1e24] animate-pulse"
                        style={{ width: `${55 + ((i * 19) % 40)}%` }}
                      />
                      <div className="h-2.5 w-20 rounded bg-[#141417] animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-[9.6px]">
                  <div className="h-3.5 w-16 rounded bg-[#18181c] animate-pulse" />
                </td>
                <td className="px-4 py-[9.6px]">
                  <div className="h-3.5 w-11 rounded bg-[#18181c] animate-pulse" />
                </td>
                <td className="px-4 py-[9.6px]">
                  <div className="h-3.5 w-14 rounded bg-[#18181c] animate-pulse" />
                </td>
                <td className="px-4 py-[9.6px]">
                  <div className="h-5 w-20 rounded-full bg-[#1c1c22] animate-pulse" />
                </td>
                <td className="px-4 py-[9.6px]">
                  <div className="h-5 w-24 rounded-full border border-white/[0.06] bg-[#161619] animate-pulse" />
                </td>
                <td className="px-4 py-[9.6px]">
                  <div className="h-3.5 w-24 rounded bg-[#18181c] animate-pulse" />
                </td>
                <td className="px-4 py-[9.6px] text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="h-6 w-6 rounded-full bg-[#18181c] animate-pulse" />
                    <div className="h-6 w-6 rounded-full bg-[#18181c] animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}