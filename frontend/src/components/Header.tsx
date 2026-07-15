"use client";

import React from "react";
import Link from "next/link";
import Search from 'lucide-react/dist/esm/icons/search';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/50 backdrop-blur-md py-4">
      <div className="mx-auto max-w-[1440px] px-8 flex items-center justify-between">
        {/* Left: The AI Signal Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black font-black text-base transition-transform group-hover:scale-105 active:scale-95 border border-border">
            S
          </div>
          <span className="text-base font-bold tracking-tight text-white transition-colors">
            The AI Signal
          </span>
        </Link>

        {/* Right Aligned Navigation & Action Elements */}
        <div className="flex items-center gap-8">
          {/* Center Navigation links moved here to be right-aligned */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/tools"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
              AI Tools
            </Link>
            <Link
              href="/leaderboard"
              className="text-[13px] font-medium text-[#6E56CF] hover:text-white transition-colors font-semibold"
            >
              Leaderboard
            </Link>
            <Link
              href="/models"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
              Models
            </Link>
            <Link
              href="/companies"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
              Companies
            </Link>
            <Link
              href="/collections"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
              Collections
            </Link>
            <Link
              href="/news"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
              News
            </Link>
            <Link
              href="/videos"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
              Videos
            </Link>
            <Link
              href="/repositories"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
              Repositories
            </Link>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-5">
            <button
              className="p-1.5 text-foreground-muted hover:text-white rounded-lg transition-colors"
              aria-label="Search site"
            >
              <Search size={17} />
            </button>

            <Link
              href="/tools"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
              Submit Tool
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex h-[32px] items-center justify-center rounded-lg bg-white px-4 text-[13px] font-bold text-black hover:bg-neutral-200 transition-colors shrink-0"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}