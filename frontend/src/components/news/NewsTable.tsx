"use client";

import Link from "next/link";
import SearchX from "lucide-react/dist/esm/icons/search-x";
import Bookmark from "lucide-react/dist/esm/icons/bookmark";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import Check from "lucide-react/dist/esm/icons/check";
import { useEffect, useState, type MouseEvent } from "react";
import { CategoryChip } from "@/components/CategoryChip";
import { PublisherIcon } from "./PublisherIcon";
import { publishedLabel } from "@/lib/news/format";
import type { NewsArticle, NewsSource } from "@/types/news";
import { Pencil, Trash2 } from "lucide-react";

interface NewsTableProps {
  articles: NewsArticle[];
  sources: Record<string, NewsSource>;
  isAdmin?: boolean;
  onEdit?: (news: NewsArticle) => void;
  onDelete?: (id: string) => void;
}

/**
 * Mirrors ToolListView.tsx (the homepage's own listing table) exactly — same
 * grid-template-columns shape, same literal hex colors, same font sizes/
 * weights, same border-radius/padding/gap values, same divide-y row
 * separators, same loading-skeleton and empty-state markup. Per the
 * instructor's brief: the news list should look and feel identical to the
 * homepage's tool listing, not like a separate visual system.
 *
 * Columns: Publisher (logo) | Headline+source | Topic | Published | Actions.
 * No per-column sort/filter popovers and no separate mobile card layout —
 * ToolListView itself doesn't have either; it's one table that scrolls
 * horizontally below ~1024px via COL_MIN_WIDTH, same pattern reused here.
 */
const COL_TEMPLATE = "grid-cols-[44px_minmax(220px,2.4fr)_minmax(110px,1fr)_minmax(90px,0.8fr)_minmax(90px,0.8fr)]";
const COL_MIN_WIDTH = "min-w-[720px]";

const COLUMN_HEADERS = ["SOURCE", "HEADLINE", "TOPIC", "PUBLISHED", "ACTIONS"];

/** Bookmark + share row actions — same icon-button treatment as ToolListView's Compare button (rounded-md border, hover states), just two icon-only buttons instead of one labeled one. */
function NewsRowActions({ article }: { article: NewsArticle }) {
  const key = "tas_bm_" + article.id;
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    try {
      setSaved(window.localStorage.getItem(key) === "1");
    } catch {
      // localStorage unavailable — ignore
    }
  }, [key]);

  const toggle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !saved;
    setSaved(next);
    try {
      if (next) window.localStorage.setItem(key, "1");
      else window.localStorage.removeItem(key);
    } catch {
      // localStorage unavailable — ignore
    }
  };

  const share = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/news/${article.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.headline, text: article.headline, url });
        return;
      }
    } catch {
      // user cancelled or Web Share unsupported — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard unavailable — ignore
    }
    setShared(true);
    setTimeout(() => setShared(false), 1400);
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={toggle}
        aria-label={saved ? "Saved" : "Save"}
        title={saved ? "Saved" : "Save"}
        className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors ${
          saved
            ? "border-transparent text-black"
            : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
        }`}
        style={saved ? { backgroundColor: "var(--color-signal)" } : undefined}
      >
        <Bookmark size={12} fill={saved ? "currentColor" : "none"} />
      </button>
      <button
        type="button"
        onClick={share}
        aria-label={shared ? "Link copied" : "Share"}
        title={shared ? "Link copied" : "Share"}
        className="inline-flex items-center justify-center rounded-md border border-[#232326]/60 bg-[#18181C] p-1.5 text-[#A1A1AA] transition-colors hover:border-[#3a3a3d] hover:text-white"
      >
        {shared ? <Check size={12} /> : <Share2 size={12} />}
      </button>
    </div>
  );
}

function NewsRow({ article, sources, isAdmin, onEdit, onDelete }: { article: NewsArticle; sources: Record<string, NewsSource>; isAdmin?: boolean; onEdit?: (news: NewsArticle) => void; onDelete?: (id: string) => void }) {
  const source = sources[article.source];
  const [primaryTopic] = article.topics;

  return (
    <Link
      href={`/news/${article.id}`}
      className={`group grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 bg-transparent px-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none`}
    >
      {/* Column 1: Publisher logo — same 44px white-backed box as ToolListView's tool logo */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white">
        <PublisherIcon source={source} box={40} />
      </div>

      {/* Column 2: Headline + source name — plain text, same as ToolListView's
          description cell (no nested <a>: the whole row is already a <Link>,
          and an <a> inside another <a> is invalid HTML / a hydration error). */}
      <div className="min-w-0">
        <h3 className="truncate text-[13px] font-semibold text-white group-hover:text-white">{article.headline}</h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A1A1AA] leading-snug">{source.name}</p>
      </div>

      {/* Column 3: Topic */}
      <div className="min-w-0 truncate">
        {primaryTopic ? <CategoryChip label={primaryTopic} /> : <span className="text-[11px] text-[#71717A]">—</span>}
      </div>

      {/* Column 4: Published */}
      <div className="hidden text-[11px] font-mono text-[#A1A1AA] sm:block">{publishedLabel(article.hours)}</div>

      {/* Column 5: Actions */}
      <div className="hidden sm:flex items-center justify-end gap-1.5">
        <NewsRowActions article={article} />
        {isAdmin && (
          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-[#232326]/60 bg-[#18181C] p-1.5 text-[#A1A1AA] transition-colors hover:border-[#3a3a3d] hover:text-white"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(article); }}
            >
              <Pencil size={12} />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 transition-colors hover:bg-red-500/20"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (window.confirm("Delete this news?")) onDelete?.(article.id); }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

export function NewsTable({ articles, sources, isAdmin, onEdit, onDelete }: NewsTableProps) {
  return (
    <div className="flex flex-col rounded-lg border border-[#232326]/60 bg-[#131316]/10 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="border-b border-[#232326]/60 bg-[#131316]/40">
          <div className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2`}>
            {COLUMN_HEADERS.map((h) => (
              <span key={h} className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                {h}
              </span>
            ))}
          </div>
        </div>

        <div role="list" className="flex flex-col divide-y divide-[#232326]/60">
          {articles.map((a) => (
            <div key={a.id} role="listitem">
              <NewsRow article={a} sources={sources} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Loading skeleton — exact same shape/animation as ToolListView's own skeleton rows. */
export function NewsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#131316]/10">
      <div className="flex flex-col divide-y divide-[#232326]/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2.5`}>
            <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
            <div className="space-y-1.5">
              <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
              <div className="h-2 w-24 animate-pulse rounded bg-[#18181C]" />
            </div>
            <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
            <div className="h-3 w-14 animate-pulse rounded bg-[#18181C]" />
            <div className="ml-auto h-5 w-16 animate-pulse rounded-md bg-[#18181C]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Empty/no-results state — exact same markup as ToolListView's own empty state. */
export function NewsTableEmpty({ searchActive = false }: { searchActive?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#232326] bg-[#131316]/40 py-16 text-center">
      <SearchX size={28} className="text-[#71717A]" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-white">{searchActive ? "No stories match your filters" : "No stories yet"}</p>
        <p className="mt-1 text-xs text-[#A1A1AA]">
          {searchActive
            ? "Try a different search term or clear a filter to see more results."
            : "Nothing to show in this feed right now."}
        </p>
      </div>
    </div>
  );
}
