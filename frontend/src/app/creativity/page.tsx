"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";

import Search from "lucide-react/dist/esm/icons/search";
import Wrench from "lucide-react/dist/esm/icons/wrench";
import ListChecks from "lucide-react/dist/esm/icons/list-checks";
import Cpu from "lucide-react/dist/esm/icons/cpu";
import Building2 from "lucide-react/dist/esm/icons/building-2";
import FolderHeart from "lucide-react/dist/esm/icons/folder-heart";
import Newspaper from "lucide-react/dist/esm/icons/newspaper";
import GitBranch from "lucide-react/dist/esm/icons/git-branch";
import Smartphone from "lucide-react/dist/esm/icons/smartphone";
import Bot from "lucide-react/dist/esm/icons/bot";
import Plug from "lucide-react/dist/esm/icons/plug";
import PlayCircle from "lucide-react/dist/esm/icons/play-circle";
import UserCircle from "lucide-react/dist/esm/icons/user-circle";
import Palette from "lucide-react/dist/esm/icons/palette";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolListView } from "@/components/ToolListView";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { SortDropdown } from "@/components/SortDropdown";
import { API_URL } from "@/lib/api";

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

const CATEGORY_TOPICS = [
  "Image Generation",
  "Video",
  "Audio",
  "Marketing",
  "Design",
  "Productivity",
  "Chatbots",
  "Customer Support"
];

const ALLOWED_CATEGORIES = ["Image Generation", "Video", "Audio", "Marketing", "Design", "Productivity", "Chatbots", "Customer Support"];

function CreativityTasksPageInner() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(CATEGORY_TOPICS[0]);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [backendTools, setBackendTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBackendData() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/v1/tools?limit=100`);
        if (res.ok) {
          const data = await res.json();
          setBackendTools(data.tools || []);
        }
      } catch (err) {
        console.error("Failed to load backend tools:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBackendData();
  }, []);

  const categoryTools = useMemo(() => {
    const tools = backendTools.filter((tool) => {
      let toolCats = tool.categories?.map((c: { category?: { name: string } }) => c.category?.name) || [];
      if (toolCats.length === 0) {
        const hash = tool.name.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        const cat = ALLOWED_CATEGORIES[hash % ALLOWED_CATEGORIES.length];
        toolCats = [cat];
      }
      return toolCats.some((catName: string) => catName && ALLOWED_CATEGORIES.includes(catName));
    });
    return tools;
  }, [backendTools]);

  const filteredTools = useMemo(() => {
    if (!selectedTopic) return categoryTools;
    return categoryTools.filter((tool) => {
      let cats = tool.categories?.map((c: { category?: { name: string } }) => c.category?.name) || [];
      if (cats.length === 0) {
        const hash = tool.name.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        const cat = ALLOWED_CATEGORIES[hash % ALLOWED_CATEGORIES.length];
        cats = [cat];
      }
      if (selectedTopic === "Design") {
        return cats.includes("Image Generation");
      }
      return cats.includes(selectedTopic);
    });
  }, [categoryTools, selectedTopic]);

  const handleTopicClick = (topic: string | null, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedTopic(topic);
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      <Header />

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
            style={{ backgroundColor: '#FBBF24' }}
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
              const isSelected = card.name === "Creativity";

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

      <main className="flex-1 mx-auto max-w-[1600px] w-full px-6 py-8">

        {/* Top Sliding Category Row */}
        <div className="mb-8 flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-3 scrollbar-none w-full">
          {CATEGORY_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={(e) => handleTopicClick(topic, e)}
              className={`rounded-full px-4 py-1.5 text-[11.5px] font-bold whitespace-nowrap transition-all duration-200 border ${
                selectedTopic === topic
                  ? "bg-white text-black border-white shadow-lg shadow-white/5"
                  : "text-neutral-400 hover:text-white bg-[#131316]/50 border-white/[0.05] hover:border-white/[0.15]"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Tools List View */}
        <ToolListView tools={filteredTools} loading={isLoading} />
      </main>

      <Footer />
    </div>
  );
}

export default function CreativityTasksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#000000]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    }>
      <CreativityTasksPageInner />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
