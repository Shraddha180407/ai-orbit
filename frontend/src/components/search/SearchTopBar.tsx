"use client";

import Link from "next/link";
import { Search, CheckSquare, Tag, Percent, ChevronDown, Sparkles } from "lucide-react";
import { useSearchModal } from "@/context/SearchModalContext";

/**
 * The search module's own announcement banner + navbar (logo, Free mode
 * toggle, Tasks/Prompts/Deals quick links, search trigger, log in/sign up),
 * ported from the Module 2 prototype's AppShell. Scoped to the /search
 * route tree via search/layout.tsx — it sits above AiOrbit's own Header,
 * not in place of it, so it doesn't touch site-wide nav.
 */
export function SearchTopBar() {
  const { open } = useSearchModal();

  return (
    <>
      {/* Red banner — TAAFT's persistent "join for free" strip (static, no motion) */}
      <div className="bg-search-highlight py-1.5 text-center">
        <span className="px-6 text-xs font-semibold tracking-wide text-white sm:text-sm">
          Click here to join for free!
        </span>
      </div>

      <header className="sticky top-0 z-40 border-b border-search-border bg-search-bg">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/search"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-search-text-primary"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-search-accent text-white">
              <Sparkles size={14} />
            </span>
            <span className="hidden lg:inline">The&nbsp;AI&nbsp;Signal</span>
          </Link>

          {/* Free mode toggle — cosmetic, matches the reference site's mode switch */}
          <div className="hidden shrink-0 items-center gap-2 text-sm text-search-text-secondary lg:flex">
            <span>Free mode</span>
            <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-search-surface-active">
              <span className="h-3.5 w-3.5 translate-x-1 rounded-full bg-search-text-tertiary transition-transform" />
            </span>
          </div>

          {/* Tasks / Prompts / Deals — quick-jump pills to the most-used sections */}
          <nav className="hidden shrink-0 items-center gap-2 lg:flex">
            <Link
              href="/search/tasks"
              className="flex items-center gap-1.5 rounded-full border border-search-border px-3 py-1.5 text-sm text-search-text-secondary transition-colors hover:border-search-border-hover hover:text-search-text-primary"
            >
              <CheckSquare size={14} />
              Tasks
              <ChevronDown size={13} />
            </Link>
            <Link
              href="/search/results?types=collection"
              className="flex items-center gap-1.5 rounded-full border border-search-border px-3 py-1.5 text-sm text-search-text-secondary transition-colors hover:border-search-border-hover hover:text-search-text-primary"
            >
              <Tag size={14} />
              Prompts
            </Link>
            <Link
              href="/search/results?types=collection"
              className="flex items-center gap-1.5 rounded-full border border-search-border px-3 py-1.5 text-sm text-search-text-secondary transition-colors hover:border-search-border-hover hover:text-search-text-primary"
            >
              <Percent size={14} />
              Deals
            </Link>
          </nav>

          {/* Search trigger pill — opens the shared Ctrl+K global search modal */}
          <button
            onClick={open}
            className="ml-auto flex w-full max-w-[220px] items-center gap-2 rounded-full border border-search-border bg-search-surface px-3 py-1.5 text-sm text-search-text-tertiary transition-colors hover:border-search-border-hover hover:text-search-text-secondary sm:max-w-[200px] lg:max-w-xs"
          >
            <Search size={15} className="shrink-0" />
            <span className="flex-1 truncate text-left">Search</span>
            <kbd className="hidden shrink-0 rounded border border-search-border bg-search-surface-hover px-1.5 py-0.5 text-[11px] text-search-text-tertiary lg:inline">
              Ctrl+K
            </kbd>
          </button>

          <Link
            href="/auth/signin"
            className="hidden shrink-0 text-sm font-medium text-search-text-secondary transition-colors hover:text-search-text-primary sm:block"
          >
            Log in
          </Link>

          <Link
            href="/auth/signup"
            className="hidden shrink-0 rounded-full bg-search-accent px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-search-accent-hover sm:block"
          >
            Sign up
          </Link>
        </div>
      </header>
    </>
  );
}
