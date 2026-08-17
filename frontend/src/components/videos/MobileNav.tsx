"use client";

import Link from "next/link";

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-between rounded-full border border-border bg-navbar/95 px-2 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.35),0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:hidden">
      <Link
        href="/"
        aria-label="Home"
        className="flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-bg-hover hover:text-primary"
      >
        <svg width="19" height="19" viewBox="0 0 16 16" fill="none">
          <path d="M2 7.2 8 2.3l6 4.9V13a.8.8 0 0 1-.8.8h-3V9.6H5.8v4.2h-3A.8.8 0 0 1 2 13V7.2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      </Link>

      <button
        aria-label="Search"
        className="flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-bg-hover hover:text-primary"
      >
        <svg width="19" height="19" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>

      <button
        aria-label="Create"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-[0_6px_16px_-2px_rgba(94,106,210,0.6)] transition-colors hover:bg-accent-hover"
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      <button
        aria-label="Chat"
        className="flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-bg-hover hover:text-primary"
      >
        <svg width="19" height="19" viewBox="0 0 16 16" fill="none">
          <path d="M2 3.5h12v7.5H6.2L3 13.8V11H2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        aria-label="Options"
        className="flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-bg-hover hover:text-primary"
      >
        <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="3.2" r="1.3" fill="currentColor" />
          <circle cx="8" cy="8" r="1.3" fill="currentColor" />
          <circle cx="8" cy="12.8" r="1.3" fill="currentColor" />
        </svg>
      </button>
    </nav>
  );
}