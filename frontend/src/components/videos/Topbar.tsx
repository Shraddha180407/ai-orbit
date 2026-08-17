"use client";

import { useState } from "react";
import Link from "next/link";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [freeMode, setFreeMode] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-border bg-navbar/90 backdrop-blur-xl sm:left-[64px]">
      <div className="flex h-[60px] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={onMenuClick}
            aria-label="Toggle menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-secondary transition-colors hover:bg-bg-hover hover:text-primary sm:hidden"
          >
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
              <path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="hidden shrink-0 text-muted sm:block">
            <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden font-mono text-[14.5px] text-secondary sm:inline">Free mode</span>
          <button
            onClick={() => setFreeMode((v) => !v)}
            className={`relative hidden h-5 w-9 shrink-0 rounded-full transition-colors sm:block ${
              freeMode ? "bg-accent" : "bg-bg-hover"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                freeMode ? "translate-x-[18px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:justify-center sm:gap-3">
          <button className="flex items-center gap-1.5 rounded-sm border border-border bg-bg-elevated px-3 py-1.5 font-mono text-[14px] font-medium text-secondary transition-colors hover:border-border-strong hover:text-primary">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5.5 8.2 7.2 10l3.3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Tasks</span>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="hidden sm:inline">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="hidden items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 font-mono text-[14px] font-medium text-secondary transition-colors hover:border-border-strong hover:text-primary sm:flex">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M4 2.5h6l2.5 2.5V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Prompts
          </button>
          <button className="hidden items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 font-mono text-[14px] font-medium text-secondary transition-colors hover:border-border-strong hover:text-primary sm:flex">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M14 8 8.6 2.6a1 1 0 0 0-.7-.3H3a1 1 0 0 0-1 1v4.9c0 .27.1.52.3.7L7.7 14.4a1 1 0 0 0 1.4 0L14 9.4a1 1 0 0 0 0-1.4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Deals
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button className="hidden items-center gap-2 rounded-full border border-border bg-bg-elevated px-3 py-1.5 text-secondary transition-colors hover:border-border-strong hover:text-primary md:flex">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="font-mono text-[14px]">Search</span>
            <span className="ml-3 rounded border border-border px-1 py-0.5 font-mono text-[11.5px] text-muted">Ctrl + K</span>
          </button>
          <Link href="#" className="whitespace-nowrap font-mono text-[13px] font-medium text-secondary transition-colors hover:text-primary sm:text-[14px]">
            Log in
          </Link>
          <Link
            href="#"
            className="whitespace-nowrap rounded-full bg-success px-3 py-1.5 font-mono text-[13px] font-semibold text-[#0d1f17] transition-colors hover:brightness-110 sm:px-4 sm:text-[14px]"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}