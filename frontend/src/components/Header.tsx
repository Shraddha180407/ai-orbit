"use client";

import React from "react";
import Link from "next/link";
import { useUser } from '@/hooks/use-user';
import { TasksDropdown } from "@/components/search/TasksDropdown";

export function Header() {
  const { user, isLoading } = useUser();
  
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
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/tools"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
              AI Tools
            </Link>
            <TasksDropdown
              buttonClassName="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors flex items-center gap-1.5"
              menuClassName="absolute left-0 mt-2 w-[280px] rounded-lg border border-border/20 bg-neutral-900/95 backdrop-blur-md p-2 shadow-2xl z-50 text-white"
            />
            <Link
              href="/leaderboard"
              className="text-[13px] font-medium text-[#6E56CF] hover:text-white transition-colors font-semibold"
            >
              Leaderboard
            </Link>
            <Link
              href="/#newsletter"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
              Newsletter
            </Link>
            <Link
              href="/tools"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
              Resources
            </Link>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-5">
            <Link
              href="/tools"
              className="text-[13px] font-medium text-foreground-muted hover:text-white transition-colors"
            >
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
                className="inline-flex h-[32px] items-center justify-center rounded-lg bg-white px-4 text-[13px] font-bold text-black hover:bg-neutral-200 transition-colors shrink-0"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}