"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Clock, TrendingUp, Trophy, X, Video, Newspaper } from "lucide-react";
import { useHomeSearch } from "@/hooks/useHomeSearch";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { ENTITY_META } from "@/lib/entityMeta";

interface QuickLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

// Top-of-menu quick actions. Only entries that map to a real route on the
// site belong here — the reference design also had "Generate text", "Free
// mode", "Mini tools", "New", "Starter pack" and "Create tool", but none of
// those exist as pages here, so they're intentionally left out.
const QUICK_LINKS: QuickLink[] = [
  { label: "Trending", href: "/search/trending", icon: TrendingUp },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

// "Browse by type" — one entry per entity the backend actually indexes.
// (Deals, Papers, Organizations and Events from the reference design have
// no matching page, so they're skipped.)
const BROWSE_BY_TYPE: QuickLink[] = [
  { label: ENTITY_META.company.label, href: ENTITY_META.company.basePath, icon: ENTITY_META.company.icon },
  { label: ENTITY_META.model.label, href: ENTITY_META.model.basePath, icon: ENTITY_META.model.icon },
  { label: ENTITY_META.robot.label, href: ENTITY_META.robot.basePath, icon: ENTITY_META.robot.icon },
  { label: ENTITY_META.repository.label, href: ENTITY_META.repository.basePath, icon: ENTITY_META.repository.icon },
  { label: ENTITY_META.device.label, href: ENTITY_META.device.basePath, icon: ENTITY_META.device.icon },
];

// "More to explore" — same idea; Prompt Pack and Countries from the
// reference design don't exist here, so only real pages are listed.
const MORE_TO_EXPLORE: QuickLink[] = [
  { label: ENTITY_META.tool.label, href: ENTITY_META.tool.basePath, icon: ENTITY_META.tool.icon },
  { label: ENTITY_META.collection.label, href: ENTITY_META.collection.basePath, icon: ENTITY_META.collection.icon },
  { label: "Videos", href: "/videos", icon: Video },
  { label: "News", href: "/news", icon: Newspaper },
];

/**
 * Homepage hero search bar. Opens a mega-menu dropdown (quick links, recent
 * searches, browse-by-type, more-to-explore, and featured tools when empty;
 * live autocomplete suggestions while typing) instead of blind-redirecting
 * on submit.
 */
export function HeroSearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputNameRef = useRef(`search-${Math.random().toString(36).slice(2)}`);


  const { suggestions, popular, featured, isLoading } = useHomeSearch(value);
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

  function goToTool(slug: string | null, title: string) {
    addRecent(title);
    setOpen(false);
    if (slug) {
      router.push(`/p/tools/${slug}`);
    } else {
      router.push(`${ENTITY_META.tool.basePath}?q=${encodeURIComponent(title)}`);
    }
  }

  const recentToShow = useMemo(() => recent.slice(0, 5), [recent]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[900px] mx-auto mb-[22px]">
      <div className="relative w-full rounded-lg border border-[#232326] bg-[#111113] h-[48px] flex items-center px-5 pr-20 focus-within:border-neutral-500 transition-all duration-300">
        <input
  ref={inputRef}
  type="text"
  readOnly
  onFocus={(e) => {
    e.target.removeAttribute("readonly");
    setOpen(true);
  }}
  autoComplete="off"
  value={value}
  onChange={(e) => setValue(e.target.value)}
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
              <div className="border-b border-search-border p-2">
                {QUICK_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-search-text-primary hover:bg-search-surface-hover"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-search-surface-active text-search-text-secondary">
                        <Icon size={14} />
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
              </div>

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

              <div className="border-b border-search-border p-2">
                <div className="px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-search-text-tertiary">
                  Browse by type
                </div>
                {BROWSE_BY_TYPE.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-search-text-primary hover:bg-search-surface-hover"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-search-surface-active text-search-text-secondary">
                        <Icon size={14} />
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="border-b border-search-border p-2">
                <div className="px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-search-text-tertiary">
                  More to explore
                </div>
                {MORE_TO_EXPLORE.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-search-text-primary hover:bg-search-surface-hover"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-search-surface-active text-search-text-secondary">
                        <Icon size={14} />
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {featured.length > 0 && (
                <div className="border-b border-search-border p-2">
                  <div className="px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-search-text-tertiary">
                    Featured
                  </div>
                  {featured.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => goToTool(tool.slug, tool.title)}
                      className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm hover:bg-search-surface-hover"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-search-surface-active text-xs font-semibold text-search-text-secondary">
                        {tool.title.charAt(0).toUpperCase()}
                      </span>
                      <span className="flex-1 truncate text-search-text-primary">{tool.title}</span>
                      <span className="shrink-0 rounded-full border border-search-border px-2 py-0.5 text-[10px] text-search-text-tertiary">
                        {tool.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {popular.length > 0 && (
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
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
