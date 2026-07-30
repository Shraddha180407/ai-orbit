'use client';

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Search from 'lucide-react/dist/esm/icons/search';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import ListChecks from 'lucide-react/dist/esm/icons/list-checks';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import FolderHeart from 'lucide-react/dist/esm/icons/folder-heart';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';
import GitBranch from 'lucide-react/dist/esm/icons/git-branch';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import Bot from 'lucide-react/dist/esm/icons/bot';
import Plug from 'lucide-react/dist/esm/icons/plug';
import PlayCircle from 'lucide-react/dist/esm/icons/play-circle';
import UserCircle from 'lucide-react/dist/esm/icons/user-circle';
import Palette from 'lucide-react/dist/esm/icons/palette';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Trophy from 'lucide-react/dist/esm/icons/trophy';

import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { SortDropdown } from "@/components/SortDropdown";
import { ENTITY_META } from "@/lib/entityMeta";

// Top-of-menu quick actions for the homepage hero search dropdown.
const QUICK_LINKS = [
  { label: "Trending", href: "/search/trending", icon: TrendingUp },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

// "Browse by type" — mirrors the entity types the backend indexes.
const BROWSE_BY_TYPE = [
  { label: ENTITY_META.company.label, href: ENTITY_META.company.basePath, icon: ENTITY_META.company.icon },
  { label: ENTITY_META.model.label, href: ENTITY_META.model.basePath, icon: ENTITY_META.model.icon },
  { label: ENTITY_META.robot.label, href: ENTITY_META.robot.basePath, icon: ENTITY_META.robot.icon },
  { label: ENTITY_META.repository.label, href: ENTITY_META.repository.basePath, icon: ENTITY_META.repository.icon },
  { label: ENTITY_META.device.label, href: ENTITY_META.device.basePath, icon: ENTITY_META.device.icon },
];

import Sparkles from 'lucide-react/dist/esm/icons/sparkles';

const DIRECTORY_CARDS = [
  { name: "New", href: "/", description: "Discover the newest AI additions.", icon: Sparkles, color: "#6E56CF" },
  { name: "Tools", href: "/tools", description: "Browse the full AI tools directory, filter by category and pricing.", icon: Wrench, color: "#FFC53D" },
  { name: "Tasks", href: "/tasks", description: "Find the right AI tool for a specific job to be done.", icon: ListChecks, color: "#FB923C" },
  { name: "Companies", href: "/companies", description: "Explore the labs and startups building the AI ecosystem.", icon: Building2, color: "#38BDF8" },
  { name: "News", href: "/news", description: "The latest announcements and coverage across the AI world.", icon: Newspaper, color: "#FF6B4A" },
  { name: "Videos", href: "/videos", description: "Watch demos, reviews, and deep dives on the latest AI tools.", icon: PlayCircle, color: "#F87171" },
  { name: "Robots", href: "/robots", description: "Robotics platforms and the companies behind them.", icon: Bot, color: "#2DD4BF" },
  { name: "Devices", href: "/devices", description: "Hardware built for and powered by AI.", icon: Smartphone, color: "#F472B6" },
  { name: "Models", href: "/models", description: "Compare context windows, pricing, and benchmarks across AI models.", icon: Cpu, color: "#A78BFA" },
  { name: "Repositories", href: "/repositories", description: "Trending open-source AI repositories on GitHub.", icon: GitBranch, color: "#22D3EE" },
  { name: "MCP", href: "/tools/mcp", description: "Model Context Protocol servers and integrations.", icon: Plug, color: "#818CF8" },
  { name: "Collections", href: "/collections", description: "Curated bundles of tools grouped by use case.", icon: FolderHeart, color: "#34D399" },
  { name: "Personal", href: "/personal", description: "AI tools for personal productivity and everyday life.", icon: UserCircle, color: "#FBBF24" },
  { name: "Creativity", href: "/creativity", description: "AI tools for art, design, writing, and creative work.", icon: Palette, color: "#E879F9" },
] as const;

export function GlobalHero() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const q = searchParams.get("q") || "";

  const [searchOpen, setSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLFormElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close the search dropdown on outside click or Escape.
  useEffect(() => {
    if (!searchOpen) return;
    function handleClick(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        searchInputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [searchOpen]);

  // ⌘K / Ctrl+K opens the homepage search dropdown.
  useEffect(() => {
    function handleShortcut(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative w-full flex flex-col items-center pt-4 pb-6 px-6"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(35, 35, 38, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.12] blur-[100px]"
            style={{ backgroundColor: 'var(--color-signal)' }}
          />
        </div>

        <div className="mx-auto max-w-[1440px] w-full flex flex-col items-center text-center relative z-10">
          <h1 className="max-w-[820px] text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.1] mb-4 sm:mb-6 select-none text-white text-balance">
            The Home of Everything AI
          </h1>

          <form
            action="/tools"
            method="GET"
            ref={searchContainerRef}
            className="relative w-full max-w-[520px] mx-auto mb-4 sm:mb-5 group"
          >
            <div
              className="relative w-full rounded-xl border border-[#232326]/70 bg-[#111113] h-[38px] sm:h-[42px] flex items-center px-3.5 sm:px-4 pr-[4.5rem] transition-colors duration-150"
              style={{ borderColor: undefined }}
            >
              <Search size={13} className="mr-2 sm:mr-2.5 text-[#71717A] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search AI tools, models, companies…"
                onFocus={() => setSearchOpen(true)}
                className="w-full bg-transparent text-[12px] sm:text-[13px] text-white placeholder:text-[#71717A] focus:outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-0.5 rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 font-mono text-[10px] text-[#71717A] pointer-events-none">
                  <span>⌘</span>K
                </kbd>
              </div>
            </div>
            <style jsx>{`
              form:focus-within > div {
                border-color: var(--color-signal) !important;
                box-shadow: 0 0 0 3px var(--color-signal-dim);
              }
            `}</style>

            {searchOpen && (
              <div className="search-scope absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[70vh] overflow-y-auto rounded-xl border border-search-border bg-search-bg shadow-2xl shadow-black/40 text-left">
                <div className="border-b border-search-border p-2">
                  {QUICK_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setSearchOpen(false)}
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

                <div className="p-2">
                  <div className="px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-search-text-tertiary">
                    Browse by type
                  </div>
                  {BROWSE_BY_TYPE.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setSearchOpen(false)}
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
              </div>
            )}
          </form>

          <div className="mb-3">
            <HeroFeatureChips />
          </div>
        </div>
      </section>

      <div className="border-b border-[#232326]/40 w-full z-10 relative" />

      {/* Sort control */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mx-auto w-full max-w-[1600px] flex justify-end">
          <SortDropdown />
        </div>
      </div>

      {/* Directory nav strip */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-1">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex flex-nowrap items-stretch gap-1.5 sm:gap-2 overflow-x-auto">
            {DIRECTORY_CARDS.map((card) => {
              const Icon = card.icon;
              const isSelected = card.href === "/" 
                ? pathname === "/" 
                : card.name === "Tools"
                  ? (pathname === "/tools" || (pathname?.startsWith("/tools") && !pathname?.startsWith("/tools/mcp")))
                  : pathname?.startsWith(card.href);
              const isNew = card.name === "New";
              
              return (
                <Link
                  key={card.name}
                  href={card.href}
                  className={`group flex flex-1 min-w-[76px] sm:min-w-[92px] shrink-0 flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-lg border px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center transition-all duration-200 relative overflow-hidden ${
                    (isNew && isSelected) ? 'border-transparent' : 'border-[#232326]/60 bg-[#0d0d10]'
                  }`}
                  onMouseEnter={(e) => {
                    if (!(isNew && isSelected)) e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.boxShadow = "";
                    }
                  }}
                  style={
                    isSelected && !isNew
                      ? { borderColor: card.color, boxShadow: `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55` }
                      : undefined
                  }
                >
                  {isNew && isSelected && (
                    <>
                      <div 
                        className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] opacity-70"
                        style={{ 
                          background: `conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 60%, ${card.color} 100%)` 
                        }} 
                      />
                      <div className="absolute inset-[1px] rounded-[7px] bg-[#0d0d10]" />
                    </>
                  )}
                  <div
                    className="relative z-10 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md border transition-colors"
                    style={{ backgroundColor: `${card.color}1a`, borderColor: `${card.color}40` }}
                  >
                    <Icon size={10} strokeWidth={1.75} style={{ color: card.color }} />
                  </div>
                  <span className="relative z-10 text-[9px] sm:text-[10.5px] font-bold tracking-tight text-white whitespace-nowrap">
                    {card.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
