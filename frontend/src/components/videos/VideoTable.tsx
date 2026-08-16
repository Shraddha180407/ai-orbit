"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Video, formatDuration, getChannelUrl } from "@/lib/video-types";
import { ThumbImage } from "./ThumbImage";
import { VideoSaveButton } from "./VideoSaveButton";
import { VideoShareButton } from "./VideoShareButton";

type SortKey = "name" | "duration" | "posted" | "views";
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

function SortIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M4.5 6.5 8 3l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 9.5 8 13l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M2.5 4h11M4.5 8h7M7 12h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function VideoTable({ videos }: { videos: Video[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("posted");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
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

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = useMemo(() => {
    const copy = videos.filter((v) => !failedThumbIds.has(v.id));
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "duration") cmp = a.durationSeconds - b.durationSeconds;
      else if (sortKey === "posted")
        cmp = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      else if (sortKey === "views") cmp = a.views - b.views;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [videos, sortKey, sortDir, failedThumbIds]);

  const columns: { key: SortKey; label: string; align?: "right" }[] = [
    { key: "name", label: "Name" },
    { key: "duration", label: "Duration" },
    { key: "posted", label: "Posted" },
    { key: "views", label: "Views", align: "right" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse">
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
                  onClick={() => toggleSort(col.key)}
                  className={`inline-flex items-center gap-1.5 transition-colors hover:text-secondary ${
                    sortKey === col.key ? "text-secondary" : ""
                  } ${col.align === "right" ? "flex-row-reverse" : ""}`}
                >
                  {col.label}
                  {col.key === "name" && <FilterIcon />}
                  <SortIcon />
                </button>
              </th>
            ))}
            <th className="select-none px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
              <span className="inline-flex items-center gap-1.5">
                Level
                <FilterIcon />
              </span>
            </th>
            <th className="px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
              Category
            </th>
            <th className="px-4 py-[9.6px] text-left font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-muted">
              Channel
            </th>
            <th className="w-20 px-4 py-[9.6px]" aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((v) => (
            <tr
              key={v.id}
              className="group relative border-b border-white/[0.03] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-bg-hover hover:shadow-[0_1px_2px_rgba(0,0,0,0.35),0_8px_24px_rgba(0,0,0,0.18)]"
              style={{ ["--row-accent" as string]: v.accent }}
            >
              <td className="relative py-[9.6px] pl-4 pr-4">
                <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[var(--row-accent)] transition-all duration-200 group-hover:h-[70%]" />
                <Link href={`/videos/${v.slug}`} className="flex items-center gap-3.5">
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
                    <span className="line-clamp-2 text-[15px] font-medium leading-snug text-primary transition-colors group-hover:text-[var(--row-accent)]">
                      {v.title}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-[9.6px] font-mono text-[13.5px] text-secondary">
                {formatDuration(v.durationSeconds)}
              </td>
              <td className="whitespace-nowrap px-4 py-[9.6px] font-mono text-[13.5px] text-secondary">
                {formatPosted(v.publishedAt)}
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
              <td className="whitespace-nowrap px-4 py-[9.6px]">
                <a
                  href={getChannelUrl(v.channelId, v.author.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/channel inline-flex items-center gap-1.5"
                >
                  <span className="text-[13.5px] font-medium text-secondary transition-colors group-hover/channel:text-primary">
                    {v.author.name}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ flexShrink: 0, display: "block" }}
                    className="text-secondary transition-all group-hover/channel:translate-x-0.5 group-hover/channel:-translate-y-0.5 group-hover/channel:text-primary"
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
  );
}