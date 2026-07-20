"use client";

import React from "react";
import Link from "next/link";
import { useUser } from '@/hooks/use-user';
import Plus from 'lucide-react/dist/esm/icons/plus';

export function Header() {
  const { user, isLoading } = useUser();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/50 backdrop-blur-md py-4 relative">
      {/* Center: Nav links, centered against the full page width, not just the inner container */}
      <nav className="hidden md:flex items-center gap-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <Link
          href="/leaderboard"
          className="text-[16px] font-bold text-[#6E56CF] hover:text-white transition-colors text-center"
        >
          Leaderboard
        </Link>
        <Link
          href="/#newsletter"
          className="text-[16px] font-bold text-foreground-muted hover:text-white transition-colors text-center"
        >
          Newsletter
        </Link>
        <Link
          href="/tools"
          className="text-[16px] font-bold text-foreground-muted hover:text-white transition-colors text-center"
        >
          Resources
        </Link>
      </nav>

      <div className="mx-auto max-w-[1440px] px-8 flex items-center justify-between relative">
        {/* Left: The AI Signal Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black font-black text-base transition-transform group-hover:scale-105 active:scale-95 border border-border">
            S
          </div>
          <span className="text-base font-bold tracking-tight text-white transition-colors">
            The AI Signal
          </span>
        </Link>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-5">
          <Link
            href="/tools"
            className="group inline-flex h-[34px] items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-black transition-all duration-200 hover:brightness-110 active:scale-95 shrink-0"
            style={{ backgroundColor: '#6E56CF', color: '#fff' }}
          >
            <Plus size={14} strokeWidth={2.5} />
            Submit Tool
          </Link>

          {isLoading ? (
            <div className="h-[32px] w-[80px] animate-pulse rounded-lg bg-white/10" />
          ) : user ? (
            <Link
              href="/dashboard"
              className="inline-flex h-[32px] items-center justify-center rounded-lg bg-white px-4 text-[13px] font-bold text-black hover:bg-neutral-200 transition-colors shrink-0"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="inline-flex h-[32px] items-center justify-center rounded-lg border border-white/20 bg-transparent px-4 text-[13px] font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-colors shrink-0"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}