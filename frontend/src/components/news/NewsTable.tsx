"use client";

import Link from "next/link";
import SearchX from "lucide-react/dist/esm/icons/search-x";
import Bookmark from "lucide-react/dist/esm/icons/bookmark";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import Check from "lucide-react/dist/esm/icons/check";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import { useEffect, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { PublisherIcon } from "./PublisherIcon";
import { publishedLabel } from "@/lib/news/format";
import type { NewsArticle, NewsSource } from "@/types/news";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface NewsTableProps {
  articles: NewsArticle[];
  sources: Record<string, NewsSource>;
  isAdmin?: boolean;
  onEdit?: (news: NewsArticle) => void;
  onDelete?: (id: string) => void;
}

function NewsRowActions({ article, isLoggedIn }: { article: NewsArticle; isLoggedIn: boolean }) {
  const router = useRouter();
  const key = "tas_bm_" + article.id;
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    try {
      setSaved(window.localStorage.getItem(key) === "1");
    } catch {
      // ignore
    }
  }, [key]);

  const toggle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Sign in required to bookmark articles", {
        description: "Please sign in or create an account to save stories.",
        action: {
          label: "Sign In",
          onClick: () => router.push("/auth/signin"),
        },
        duration: 5000,
      });
      return;
    }

    const next = !saved;
    setSaved(next);
    try {
      if (next) window.localStorage.setItem(key, "1");
      else window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    toast.success(next ? "Article saved to bookmarks" : "Article removed from bookmarks");
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
      // ignore
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
    setShared(true);
    setTimeout(() => setShared(false), 1400);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* Bookmark option always rendered for both guest and logged in users */}
      <button
        type="button"
        onClick={toggle}
        aria-label={saved ? "Saved" : "Save"}
        title={saved ? "Saved" : "Save"}
        className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors cursor-pointer ${
          saved
            ? "border-transparent text-black"
            : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#F5A623] hover:text-white"
        }`}
        style={saved ? { backgroundColor: "var(--color-signal)" } : undefined}
      >
        <Bookmark size={13} fill={saved ? "currentColor" : "none"} />
      </button>

      {/* Share option */}
      <button
        type="button"
        onClick={share}
        aria-label={shared ? "Link copied" : "Share"}
        title={shared ? "Link copied" : "Share"}
        className="inline-flex items-center justify-center rounded-md border border-[#232326]/60 bg-[#18181C] p-1.5 text-[#A1A1AA] transition-colors hover:border-[#F5A623] hover:text-white cursor-pointer"
      >
        {shared ? <Check size={13} /> : <Share2 size={13} />}
      </button>
    </div>
  );
}

function NewsRow({ article, sources, isAdmin, isLoggedIn, onEdit, onDelete }: { article: NewsArticle; sources: Record<string, NewsSource>; isAdmin?: boolean; isLoggedIn: boolean; onEdit?: (news: NewsArticle) => void; onDelete?: (id: string) => void }) {
  const source = sources[article.source];
  const [primaryTopic] = article.topics;

  return (
    <tr
      key={article.id}
      className="group relative border-b border-white/[0.03] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-[#18181C]/60 hover:shadow-[0_1px_2px_rgba(0,0,0,0.35),0_8px_24px_rgba(0,0,0,0.18)]"
      style={{ ["--row-accent" as string]: "var(--color-signal)" }}
    >
      {/* Column 1: Left accent line + Headline & Square Publisher logo */}
      <td className="relative py-2.5 pl-3 pr-3 overflow-hidden">
        <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-signal)] transition-all duration-200 group-hover:h-[70%]" />
        <Link href={`/news/${article.id}`} className="flex items-center gap-3">
          {/* Square logo container */}
          <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white p-1 transition-transform duration-300 ease-out group-hover:scale-[1.05] group-hover:shadow-[0_0_0_1.5px_var(--color-signal)] flex items-center justify-center shadow-sm">
            <PublisherIcon source={source} box={36} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 text-[14.5px] font-semibold leading-snug text-white transition-colors group-hover:text-[#F5A623]">
              {article.headline}
            </span>
          </span>
        </Link>
      </td>

      {/* Column 2: Posted */}
      <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[13px] text-[#A1A1AA]">
        {publishedLabel(article.hours)}
      </td>

      {/* Column 3: Category */}
      <td className="whitespace-nowrap px-3 py-2.5 overflow-hidden">
        {primaryTopic ? (
          <span className="inline-flex items-center rounded-full border border-[#232326] bg-[#131316] px-2.5 py-0.5 font-mono text-[11.5px] font-medium text-white truncate max-w-full">
            {primaryTopic}
          </span>
        ) : (
          <span className="text-[11px] text-[#71717A]">—</span>
        )}
      </td>

      {/* Column 4: Publisher Channel */}
      <td className="whitespace-nowrap px-3 py-2.5 overflow-hidden">
        <a
          href={article.articleUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="group/publisher inline-flex items-center gap-1.5 max-w-full truncate"
        >
          <span className="text-[13px] font-medium text-[#A1A1AA] transition-colors group-hover/publisher:text-[#F5A623] truncate">
            {source?.name || "AI Publisher"}
          </span>
          <ArrowUpRight
            size={12}
            className="text-[#71717A] shrink-0 transition-all group-hover/publisher:translate-x-0.5 group-hover/publisher:-translate-y-0.5 group-hover/publisher:text-[#F5A623]"
          />
        </a>
      </td>

      {/* Column 5: Actions */}
      <td className="px-3 py-2.5 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <NewsRowActions article={article} isLoggedIn={isLoggedIn} />
          {isAdmin && (
            <div className="flex items-center gap-1 ml-1">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-[#232326]/60 bg-[#18181C] p-1.5 text-[#A1A1AA] transition-colors hover:border-[#F5A623] hover:text-white"
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
      </td>
    </tr>
  );
}

export function NewsTable({ articles, sources, isAdmin, onEdit, onDelete }: NewsTableProps) {
  const { user } = useUser();
  const isLoggedIn = Boolean(user);

  return (
    <div className="overflow-x-auto border border-[#232326]/70 rounded-xl bg-[#0d0d10] shadow-xl w-full">
      <table className="w-full min-w-[760px] border-collapse table-fixed">
        <colgroup>
          <col className="w-[50%]" />
          <col className="w-[90px]" />
          <col className="w-[140px]" />
          <col className="w-[180px]" />
          <col className="w-[110px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[#232326] bg-[#131316]/70">
            <th className="select-none px-3 py-2.5 text-left font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-[#71717A]">
              HEADLINE
            </th>
            <th className="select-none px-3 py-2.5 text-left font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-[#71717A]">
              POSTED
            </th>
            <th className="select-none px-3 py-2.5 text-left font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-[#71717A]">
              CATEGORY
            </th>
            <th className="select-none px-3 py-2.5 text-left font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-[#71717A]">
              PUBLISHER
            </th>
            <th className="select-none px-3 py-2.5 text-right font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-[#71717A]">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <NewsRow
              key={article.id}
              article={article}
              sources={sources}
              isAdmin={isAdmin}
              isLoggedIn={isLoggedIn}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NewsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#232326]/70 bg-[#0d0d10] w-full">
      <div className="flex flex-col divide-y divide-[#232326]/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-3 py-2.5">
            <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
            <div className="space-y-1.5 flex-1">
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

export function NewsTableEmpty({ searchActive = false }: { searchActive?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#232326]/70 bg-[#0d0d10] py-12 text-center shadow-xl w-full">
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
