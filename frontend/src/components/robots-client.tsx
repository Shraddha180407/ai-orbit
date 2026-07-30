'use client';

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import Search from 'lucide-react/dist/esm/icons/search';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import ListChecks from 'lucide-react/dist/esm/icons/list-checks';
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

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { Robot } from "@/lib/types";
import { fetchAllRobots } from "@/lib/api";

const DIRECTORY_CARDS = [
  { name: "Tools", href: "/tools", description: "Browse the full AI tools directory, filter by category and pricing.", icon: Wrench, color: "#FFC53D" },
  { name: "Tasks", href: "/tasks", description: "Find the right AI tool for a specific job to be done.", icon: ListChecks, color: "#FB923C" },
  { name: "Companies", href: "/companies", description: "Explore the labs and startups building the AI ecosystem.", icon: Building2, color: "#38BDF8" },
  { name: "News", href: "/news", description: "The latest announcements and coverage across the AI world.", icon: Newspaper, color: "#FF6B4A" },
  { name: "Videos", href: "/videos", description: "Watch demos, reviews, and deep dives on the latest AI tools.", icon: PlayCircle, color: "#F87171" },
  { name: "Robots", href: "/robots", description: "Robotics platforms and the companies behind them.", icon: Bot, color: "#2DD4BF" },
  { name: "Devices", href: "/devices", description: "Hardware built for and powered by AI.", icon: Smartphone, color: "#F472B6" },
  { name: "Models", href: "/models", description: "Compare context windows, pricing, and benchmarks across AI models.", icon: Cpu, color: "#A78BFA" },
  { name: "Repositories", href: "/repositories", description: "Trending open-source AI repositories on GitHub.", icon: GitBranch, color: "#22D3EE" },
  { name: "MCP", href: "/tools", description: "Model Context Protocol servers and integrations.", icon: Plug, color: "#818CF8" },
  { name: "Collections", href: "/collections", description: "Curated bundles of tools grouped by use case.", icon: FolderHeart, color: "#34D399" },
  { name: "Personal", href: "/personal", description: "AI tools for personal productivity and everyday life.", icon: UserCircle, color: "#FBBF24" },
  { name: "Creativity", href: "/creativity", description: "AI tools for art, design, writing, and creative work.", icon: Palette, color: "#E879F9" },
] as const;

const ROBOTS_SUB = [
  "Humanoid Robots",
  "Industrial Robots",
  "Service Robots",
  "Healthcare Robots",
  "Educational Robots",
  "Autonomous Mobile Robots (AMRs)",
  "Drones & Aerial Robots",
  "Companion Robots",
  "Agricultural Robots",
  "Research & Defense Robots"
];

function formatSubcategoryPath(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function RobotsClient() {
  const routeParams = useParams();
  const activeSubcategoryPath = routeParams?.category as string | undefined;
  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>(activeSubcategoryPath);

  useEffect(() => {
    setActiveSubcategory(activeSubcategoryPath);
  }, [activeSubcategoryPath]);

  const [robots, setRobots] = useState<Robot[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<string>("newest");
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getRobots() {
      try {
        const data = await fetchAllRobots();
        setRobots(data || []);
      } catch (e) {
        console.error("Failed to fetch robots:", e);
      } finally {
        setIsLoading(false);
      }
    }
    getRobots();
  }, []);

  const filteredRobots = useMemo(() => {
    let list = robots;

    // Subcategory Filter
    if (activeSubcategory) {
      const sub = activeSubcategory.toLowerCase();
      const categoryMap: Record<string, string[]> = {
        humanoidrobots: ["humanoid", "bipedal", "android"],
        industrialrobots: ["industrial", "manipulator", "arm", "factory"],
        servicerobots: ["service", "hospitality", "delivery", "cleaning"],
        healthcarerobots: ["healthcare", "medical", "surgery", "rehabilitation"],
        educationalrobots: ["education", "learning", "student", "classroom"],
        autonomousmobilerobotsamrs: ["amr", "mobile", "wheeled", "warehouse"],
        dronesaerialrobots: ["drone", "aerial", "quadcopter", "uav"],
        companionrobots: ["companion", "social", "pet", "home"],
        agriculturalrobots: ["agricultural", "farming", "harvest", "field"],
        researchdefenserobots: ["research", "defense", "military", "tactical"]
      };
      const keywords = categoryMap[sub] || [];
      list = list.filter((r) => {
        const catText = (r.category || "").toLowerCase();
        const pathName = catText.replace(/[^a-z0-9]/g, "");
        if (pathName === sub) return true;
        const content = `${r.name} ${r.description || ""} ${r.category || ""}`.toLowerCase();
        return keywords.some(k => content.includes(k));
      });
    }

    // Search Query Filter
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(needle) || (r.description && r.description.toLowerCase().includes(needle)));
    }

    // Sort Filter
    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "year") {
      list = [...list].sort((a, b) => {
        const ya = parseInt(a.year || "0", 10) || 0;
        const yb = parseInt(b.year || "0", 10) || 0;
        return yb - ya;
      });
    } else {
      list = [...list].sort((a, b) => {
        const ya = parseInt(a.year || "0", 10) || 0;
        const yb = parseInt(b.year || "0", 10) || 0;
        return yb - ya;
      });
    }

    return list;
  }, [robots, q, activeSubcategory, sort]);

  useEffect(() => {
    setVisibleCount(15);
  }, [q, activeSubcategory, sort]);

  // IntersectionObserver for client-side endless scroll
  useEffect(() => {
    if (isLoading || visibleCount >= filteredRobots.length) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + 15);
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [isLoading, visibleCount, filteredRobots.length]);

  const visibleRobots = filteredRobots.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Hero Section */}
      <section
        className="relative w-full flex flex-col items-center pt-4 pb-6 px-6"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(35, 35, 38, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* ambient glow */}
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

          <form action="/tools" method="GET" className="relative w-full max-w-[520px] mx-auto mb-4 sm:mb-5 group">
            <div
              className="relative w-full rounded-xl border border-[#232326]/70 bg-[#111113] h-[38px] sm:h-[42px] flex items-center px-3.5 sm:px-4 pr-[4.5rem] transition-colors duration-150"
            >
              <Search size={13} className="mr-2 sm:mr-2.5 text-[#71717A] shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Search AI tools, models, companies…"
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
          <div className="flex items-center gap-2 select-none">
            <span className="text-xs text-[#71717A]">
              Sort by
            </span>
            <div className="relative inline-flex items-center">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-xs font-semibold text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-7"
              >
                <option value="newest">Newest</option>
                <option value="name">Alphabetical</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 text-[#71717A] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Directory nav strip */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-1">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex flex-nowrap items-stretch gap-1.5 sm:gap-2 overflow-x-auto">
            {DIRECTORY_CARDS.map((card) => {
              const Icon = card.icon;
              const isSelected = card.name.toLowerCase() === "robots";

              return (
                <Link
                  key={card.name}
                  href={card.href}
                  className="group flex flex-1 min-w-[76px] sm:min-w-[92px] shrink-0 flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-[#232326]/60 bg-[#0d0d10] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center transition-colors duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.boxShadow = "";
                    }
                  }}
                  style={
                    isSelected
                      ? { borderColor: card.color, boxShadow: `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55` }
                      : undefined
                  }
                >
                  <div
                    className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md border"
                    style={{ backgroundColor: `${card.color}1a`, borderColor: `${card.color}40` }}
                  >
                    <Icon size={10} strokeWidth={1.75} style={{ color: card.color }} />
                  </div>
                  <span className="text-[9px] sm:text-[10.5px] font-bold tracking-tight text-white whitespace-nowrap">
                    {card.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>



      <main className="mx-auto max-w-[1070px] px-8 py-4 flex-1 w-full">

        {isLoading ? (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-[#131316]/50" />
            ))}
          </div>
        ) : filteredRobots.length === 0 ? (
          <div className="text-center py-20 border border-[#232326] bg-[#131316] rounded-xl">
            <p className="text-[#A1A1AA] text-sm">{q ? `No robots match "${q}".` : "No robots found."}</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {visibleRobots.map((robot: Robot) => (
              <div
                key={robot.id}
                className="group grid grid-cols-1 sm:grid-cols-[40px_1fr_180px_120px] gap-4 items-center p-4 bg-transparent hover:bg-[#18181C]/40 transition-all w-full"
              >
                {/* Column 1: Logo or Initials */}
                {robot.logoUrl ? (
                  <img
                    src={robot.logoUrl}
                    alt={`${robot.name} logo`}
                    className="h-10 w-10 rounded-lg object-cover bg-[#18181C] border border-[#232326]/60 shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-[#18181C] flex items-center justify-center font-bold text-white uppercase border border-[#232326]/60 shrink-0">
                    {robot.name.charAt(0)}
                  </div>
                )}

                {/* Column 2: Name + Description */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm truncate">
                      {robot.name}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded bg-[#18181C] text-[9px] text-[#A1A1AA] border border-[#232326] shrink-0 font-mono">
                      {robot.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-1 leading-relaxed">
                    {robot.description}
                  </p>
                </div>

                {/* Column 3: Manufacturer */}
                <div className="text-xs text-[#A1A1AA] font-mono flex flex-col gap-0.5 sm:block hidden">
                  <div>Mfg: <strong className="text-white">{robot.manufacturer}</strong></div>
                </div>

                {/* Column 4: Year */}
                <div className="text-right sm:block hidden">
                  <span className="text-[10px] font-mono text-[#71717A] block">RELEASE YEAR</span>
                  <span className="text-xs text-white font-medium">{robot.year}</span>
                </div>
              </div>
            ))}

            {/* Sentinel for infinite scroll */}
            {filteredRobots.length > 0 && visibleCount < filteredRobots.length && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
