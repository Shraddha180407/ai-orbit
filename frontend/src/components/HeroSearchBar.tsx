"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Clock,
  TrendingUp,
  Trophy,
  X,
  ArrowRight,
  BadgeCheck,
  Image as ImageIcon,
  Type,
  Gift,
  Puzzle,
  Sparkles,
  Plus,
  Tag,
  FileText,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { ENTITY_META } from "@/lib/entityMeta";

interface QuickLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  /** icon-badge tint, one distinct color per row — matches TAAFT's colored icon tiles */
  tint: string;
}

interface QuickLinkGroup {
  title: string;
  links: QuickLink[];
}

/**
 * Mirrors TAAFT's homepage search dropdown: quick actions, then every
 * browsable entity type, then a few extra discovery shortcuts. Items that
 * don't have a dedicated page/entity in this app yet (Deals, Papers,
 * Organizations, Events, Prompt Pack, Generate image/text, Free mode,
 * Starter pack, Create tool) fall back to the closest existing page, filtered
 * with a relevant query string, so nothing here is a dead link.
 */
const QUICK_LINK_GROUPS: QuickLinkGroup[] = [
  {
    title: "Quick links",
    links: [
      { label: "Generate image", href: "/tools?q=image+generator", icon: ImageIcon, tint: "bg-rose-500/15 text-rose-400" },
      { label: "Tasks", href: ENTITY_META.task.basePath, icon: ENTITY_META.task.icon, tint: ENTITY_META.task.tint },
      { label: "Generate text", href: "/tools?q=text+generator", icon: Type, tint: "bg-blue-500/15 text-blue-400" },
      { label: "Free mode", href: "/tools?maxPrice=0", icon: Gift, tint: "bg-emerald-500/15 text-emerald-400" },
      { label: "Trending", href: "/tools?sort=rating", icon: TrendingUp, tint: "bg-emerald-500/15 text-emerald-400" },
      { label: "Leaderboard", href: "/leaderboard", icon: Trophy, tint: "bg-amber-500/15 text-amber-400" },
      { label: "Mini tools", href: "/search/mini-tools", icon: Puzzle, tint: "bg-violet-500/15 text-violet-400" },
      { label: "New", href: "/search/new", icon: Sparkles, tint: "bg-sky-500/15 text-sky-400" },
      { label: "Starter pack", href: "/collections", icon: ENTITY_META.fundraise.icon, tint: "bg-orange-500/15 text-orange-400" },
      { label: "Create tool", href: "/dashboard/settings", icon: Plus, tint: "bg-search-accent-soft text-search-accent-hover" },
    ],
  },
  {
    title: "Browse by type",
    links: [
      { label: "Deals", href: "/tools?sort=popular&maxPrice=0", icon: Tag, tint: "bg-rose-500/15 text-rose-400" },
      { label: "Companies", href: ENTITY_META.company.basePath, icon: ENTITY_META.company.icon, tint: ENTITY_META.company.tint },
      { label: "Models", href: ENTITY_META.model.basePath, icon: ENTITY_META.model.icon, tint: ENTITY_META.model.tint },
      { label: "Robots", href: ENTITY_META.robot.basePath, icon: ENTITY_META.robot.icon, tint: ENTITY_META.robot.tint },
      { label: "Papers", href: "/news?q=paper", icon: FileText, tint: "bg-amber-500/15 text-amber-400" },
      { label: "Fundraises", href: ENTITY_META.fundraise.basePath, icon: ENTITY_META.fundraise.icon, tint: ENTITY_META.fundraise.tint },
      { label: "Repositories", href: ENTITY_META.repository.basePath, icon: ENTITY_META.repository.icon, tint: ENTITY_META.repository.tint },
      { label: "Devices", href: ENTITY_META.device.basePath, icon: ENTITY_META.device.icon, tint: ENTITY_META.device.tint },
      { label: "Organizations", href: ENTITY_META.company.basePath, icon: ENTITY_META.investor.icon, tint: "bg-yellow-500/15 text-yellow-400" },
      { label: "Events", href: "/news?q=event", icon: Calendar, tint: "bg-teal-500/15 text-teal-400" },
    ],
  },
  {
    title: "More to explore",
    links: [
      { label: "Prompt Pack", href: "/collections?q=prompt+pack", icon: MessageSquare, tint: "bg-lime-500/15 text-lime-400" },
      { label: "Tools", href: ENTITY_META.tool.basePath, icon: ENTITY_META.tool.icon, tint: ENTITY_META.tool.tint },
      { label: "Countries", href: ENTITY_META.country.basePath, icon: ENTITY_META.country.icon, tint: ENTITY_META.country.tint },
      { label: "Collections", href: ENTITY_META.collection.basePath, icon: ENTITY_META.collection.icon, tint: ENTITY_META.collection.tint },
      { label: "Videos", href: ENTITY_META.video.basePath, icon: ENTITY_META.video.icon, tint: ENTITY_META.video.tint },
    ],
  },
];

/** Minimal shape the hero bar needs from a tool card — avoids importing the full ToolCardData type. */
export interface HeroFeaturedTool {
  slug: string;
  name: string;
  logoUrl?: string | null;
}

/**
 * Homepage hero search bar. Previously a plain <form action="/tools"> that
 * blind-redirected on submit — now opens a live dropdown (quick links +
 * recent/popular searches when empty, autocomplete suggestions while typing)
 * so the person can preview and pick a destination instead of always being
 * thrown straight at /tools, matching TAAFT's own search-bar behavior.
 */
export function HeroSearchBar({
  defaultValue,
  featuredTools = [],
}: {
  defaultValue?: string;
  featuredTools?: HeroFeaturedTool[];
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { suggestions, popular, isLoading } = useAutocomplete(value);
  const { recent, addRecent, clearRecent } = useRecentSearches();

  const showSuggestions = value.trim().length > 0;

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function goToResults(term: string, basePath = "/tools") {
    const trimmed = term.trim();
    if (!trimmed) return;
    addRecent(trimmed);
    setOpen(false);
    router.push(`${basePath}?q=${encodeURIComponent(trimmed)}`);
  }

  const recentToShow = useMemo(() => recent.slice(0, 5), [recent]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[900px] mx-auto mb-[22px]">
      <div className="relative w-full rounded-lg border border-[#232326] bg-[#111113] h-[48px] flex items-center px-5 pr-20 focus-within:border-neutral-500 transition-all duration-300">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              goToResults(value);
            }
          }}
          placeholder="Search AI tools, models, companies..."
          className="w-full bg-transparent text-sm text-white placeholder:text-[#71717A] focus:outline-none"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {value ? (
            <button
              type="button"
              onClick={() => {
                setValue("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="text-[#71717A] hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-[#232326] bg-[#18181C] px-1.5 font-mono text-[9px] text-[#71717A] pointer-events-none">
              <span>⌘</span>K
            </kbd>
          )}
          <button
            type="button"
            onClick={() => goToResults(value)}
            className="text-[#71717A] hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {open && (
        <div className="search-scope absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[70vh] overflow-y-auto rounded-xl border border-search-border bg-search-bg shadow-2xl shadow-black/40">
          {showSuggestions ? (
            <div className="p-2">
              {isLoading ? (
                <div className="space-y-2 p-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="skeleton h-9 w-full rounded-md" />
                  ))}
                </div>
              ) : suggestions.length === 0 ? (
                <div className="p-6 text-center text-sm text-search-text-secondary">
                  No matches for &ldquo;{value}&rdquo;.{" "}
                  <button
                    type="button"
                    onClick={() => goToResults(value)}
                    className="text-search-accent hover:text-search-accent-hover"
                  >
                    Search anyway
                  </button>
                </div>
              ) : (
                <>
                  {suggestions.map((s) => {
                    const meta = ENTITY_META[s.type];
                    const Icon = meta.icon;
                    return (
                      <Link
                        key={s.id}
                        href={`${meta.basePath}?q=${encodeURIComponent(s.title)}`}
                        onClick={() => {
                          addRecent(s.title);
                          setOpen(false);
                        }}
                        className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm hover:bg-search-surface-hover"
                      >
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${meta.tint}`}>
                          <Icon size={14} />
                        </span>
                        <span className="flex-1 truncate text-search-text-primary">{s.title}</span>
                        <span className="shrink-0 text-xs text-search-text-tertiary">
                          {meta.label} · {s.category}
                        </span>
                      </Link>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => goToResults(value)}
                    className="mt-1 flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm text-search-accent hover:bg-search-surface-hover"
                  >
                    See all results for &ldquo;{value}&rdquo;
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {QUICK_LINK_GROUPS.map((group) => (
                <div key={group.title} className="border-b border-search-border p-2">
                  <div className="px-2 py-1.5 text-xs font-medium text-search-text-tertiary">{group.title}</div>
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-search-text-primary hover:bg-search-surface-hover"
                      >
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${link.tint}`}>
                          <Icon size={14} />
                        </span>
                        <span className="flex-1 text-left">{link.label}</span>
                        <ArrowRight
                          size={14}
                          className="shrink-0 text-search-text-tertiary opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </Link>
                    );
                  })}
                </div>
              ))}

              {featuredTools.length > 0 && (
                <div className="border-b border-search-border p-2">
                  <div className="px-2 py-1.5 text-xs font-medium text-search-text-tertiary">Featured</div>
                  {featuredTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm hover:bg-search-surface-hover"
                    >
                      {tool.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tool.logoUrl}
                          alt=""
                          className="h-7 w-7 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-search-surface-active text-search-text-secondary">
                          <ENTITY_META.tool.icon size={14} />
                        </span>
                      )}
                      <span className="flex flex-1 items-center gap-1.5 truncate text-search-text-primary">
                        <span className="truncate">{tool.name}</span>
                        <BadgeCheck size={13} className="shrink-0 text-search-accent" />
                      </span>
                      <span className="shrink-0 rounded-full border border-search-border-hover bg-search-surface-active px-2 py-0.5 text-[10px] font-medium text-search-text-secondary">
                        Featured
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {recentToShow.length > 0 && (
                <div className="border-b border-search-border p-2">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-search-text-tertiary">
                      <Clock size={13} />
                      Recent searches
                    </div>
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="text-xs text-search-text-tertiary hover:text-search-text-primary"
                    >
                      Clear
                    </button>
                  </div>
                  {recentToShow.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => goToResults(term)}
                      className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm text-search-text-primary hover:bg-search-surface-hover"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-2">
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-search-text-tertiary">
                  <TrendingUp size={13} />
                  Popular searches
                </div>
                {popular.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => goToResults(term)}
                    className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm text-search-text-primary hover:bg-search-surface-hover"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}