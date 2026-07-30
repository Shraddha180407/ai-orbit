'use client';

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { CollectionListItem } from "@/lib/types";

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
import Cpu from 'lucide-react/dist/esm/icons/cpu';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { CollectionFilters } from "@/components/collections/CollectionFilters";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { CollectionListTable } from "@/components/collections/CollectionListTable";

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

const ALL_CATEGORIES = "All Categories";
type DbCreatorType = "EDITORIAL" | "COMMUNITY";
type SortKey = "updated" | "name" | "tools" | "creator";

interface NormalizedCollection {
  id: string;
  slug: string;
  name: string;
  description: string;
  creatorName: string;
  creatorAvatar: string;
  creatorType: DbCreatorType;
  isFeatured: boolean;
  isCurated: boolean;
  toolCount: number;
  updatedAt: string;
  category: string;
  categoriesList: string[];
  imageUrl: string;
  color: string;
}

const CREATOR_COLORS: Record<DbCreatorType, string> = {
  EDITORIAL: "#A78BFA",
  COMMUNITY: "#34D399",
};

function normalizeCollection(item: any): NormalizedCollection {
  const name = item.name || item.title || "Unnamed Collection";
  const slug = item.slug || item.id || "";
  
  let creatorName = "Anonymous";
  let creatorAvatar = "";
  if (item.creator && typeof item.creator === 'object') {
    creatorName = item.creator.name || creatorName;
    creatorAvatar = item.creator.image || item.creator.avatar || item.creator.avatarUrl || "";
  } else {
    if (item.creatorName) creatorName = item.creatorName;
    if (item.creatorAvatar) creatorAvatar = item.creatorAvatar;
  }
  
  const creatorType: DbCreatorType = item.creatorType === "EDITORIAL" ? "EDITORIAL" : "COMMUNITY";
  const isFeatured = !!(item.isFeatured ?? item.featured);
  const isCurated = !!(item.isCurated ?? item.curated);
  const toolCount = typeof item.toolCount === 'number' ? item.toolCount : (item.tools ? item.tools.length : 0);

  let categoriesList: string[] = [];
  if (Array.isArray(item.categories)) {
    categoriesList = item.categories.map((c: any) => c.categoryName || c.name || "").filter(Boolean);
  }
  const category = categoriesList.length > 0 ? categoriesList[0] : "General";

  const color = item.color || CREATOR_COLORS[creatorType] || "#6E56CF";

  return {
    id: item.id || slug,
    slug,
    name,
    description: item.description || "",
    creatorName,
    creatorAvatar,
    creatorType,
    isFeatured,
    isCurated,
    toolCount,
    updatedAt: item.updatedAt || item.updated_at || "",
    category,
    categoriesList,
    imageUrl: item.imageUrl || item.image || "",
    color,
  };
}

const PAGE_SIZE = 20;

interface Props {
  initialItems?: CollectionListItem[];
  initialNextCursor?: string | null;
}

export default function CollectionsPageClient({ initialItems }: Props) {
  const [collections, setCollections] = useState<NormalizedCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [nameSearch, setNameSearch] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [selectedCreatorType, setSelectedCreatorType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activePill, setActivePill] = useState<string | null>(null);

  const [toolsMin, setToolsMin] = useState(0);
  const [toolsMax, setToolsMax] = useState(100);
  const [activeToolsFilter, setActiveToolsFilter] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setCollections(initialItems.map(normalizeCollection));
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
      fetch(`${API_BASE_URL}/collections?sort=recently_updated`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.items)) {
            setCollections(data.items.map(normalizeCollection));
          }
        })
        .catch(err => console.error("Error loading collections", err))
        .finally(() => setIsLoading(false));
    }
  }, [initialItems]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActiveFilters = nameSearch || selectedCategory !== ALL_CATEGORIES || selectedCreatorType !== "All" || activeToolsFilter || activePill;

  function clearAllFilters() {
    setNameSearch(""); setNameInput(""); setSelectedCategory(ALL_CATEGORIES);
    setSelectedCreatorType("All"); setToolsMin(0); setToolsMax(100);
    setActiveToolsFilter(false); setActivePill(null); setCurrentPage(1);
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    collections.forEach((c) => { counts[c.category] = (counts[c.category] || 0) + 1; });
    return counts;
  }, [collections]);

  const creatorTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    collections.forEach((c) => { if (c.creatorType) counts[c.creatorType] = (counts[c.creatorType] || 0) + 1; });
    return counts;
  }, [collections]);

  const categories = useMemo(() => {
    return Array.from(new Set(collections.map((c) => c.category).filter(Boolean))).sort();
  }, [collections]);

  const filtered = useMemo(() => {
    let list = [...collections];
    if (nameSearch.trim()) {
      const q = nameSearch.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.creatorName.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }
    if (selectedCategory !== ALL_CATEGORIES) list = list.filter((d) => d.category === selectedCategory);
    if (selectedCreatorType !== "All") list = list.filter((d) => d.creatorType === selectedCreatorType);
    if (activeToolsFilter) {
      list = list.filter((d) => d.toolCount >= toolsMin && d.toolCount <= toolsMax);
    }
    if (activePill === "featured") {
      list = list.filter((d) => d.isFeatured);
    }
    if (activePill === "editorial") {
      list = list.filter((d) => d.creatorType === "EDITORIAL");
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "creator") cmp = a.creatorName.localeCompare(b.creatorName);
      else if (sortKey === "tools") cmp = a.toolCount - b.toolCount;
      else cmp = (a.updatedAt || "").localeCompare(b.updatedAt || "");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [collections, nameSearch, selectedCategory, selectedCreatorType, activeToolsFilter, activePill, toolsMin, toolsMax, sortKey, sortDir]);

  useEffect(() => { setCurrentPage(1); }, [nameSearch, selectedCategory, selectedCreatorType, sortKey, sortDir, activeToolsFilter, activePill]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

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
                value={sortKey}
                onChange={(e) => {
                  const val = e.target.value as SortKey;
                  setSortKey(val);
                  setSortDir("desc");
                }}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-xs font-semibold text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-7"
              >
                <option value="updated">Recently Updated</option>
                <option value="name">Alphabetical</option>
                <option value="tools">Tool Count</option>
                <option value="creator">Creator Name</option>
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
              const isSelected = card.name.toLowerCase() === "collections";

              return (
                <Link
                  key={card.name}
                  href={card.href}
                  className="group flex flex-1 min-w-[76px] sm:min-w-[92px] shrink-0 flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-[#232326]/60 bg-[#0d0d10] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center transition-colors duration-200"
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55`;
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
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



      <main className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-8 flex-1">
        <div className="mx-auto w-full max-w-[1600px]">
          {/* View toggle row */}
          <div className="flex items-center justify-end mb-4 gap-2">
            {hasActiveFilters && (
              <button onClick={clearAllFilters}
                className="text-xs text-[#A1A1AA] hover:text-white border border-[#232326] hover:border-[#6E56CF] px-3 py-1.5 rounded-lg transition-colors">
                Clear filters
              </button>
            )}
            <button onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg border transition-colors ${viewMode === "list" ? "border-[#6E56CF] bg-[#6E56CF]/10 text-[#6E56CF]" : "border-[#232326] text-[#52525B] hover:text-white"}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
            <button onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg border transition-colors ${viewMode === "grid" ? "border-[#6E56CF] bg-[#6E56CF]/10 text-[#6E56CF]" : "border-[#232326] text-[#52525B] hover:text-white"}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
          </div>

          {/* ── GRID VIEW ── */}
          {viewMode === "grid" && (
            <div>
              <CollectionFilters 
                nameInput={nameInput}
                setNameInput={setNameInput}
                setNameSearch={setNameSearch}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                selectedCreatorType={selectedCreatorType}
                setSelectedCreatorType={setSelectedCreatorType}
                sortKey={sortKey}
                sortDir={sortDir}
                setSortKey={setSortKey}
                setSortDir={setSortDir}
                toolsMin={toolsMin}
                toolsMax={toolsMax}
                setToolsMin={setToolsMin}
                setToolsMax={setToolsMax}
                activeToolsFilter={activeToolsFilter}
                setActiveToolsFilter={setActiveToolsFilter}
                setCurrentPage={setCurrentPage}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
              <CollectionGrid items={visible} isLoading={isLoading} />
            </div>
          )}

          {/* ── LIST VIEW ── */}
          {viewMode === "list" && (
            <div ref={dropdownRef}>
              <CollectionListTable 
                items={visible}
                isLoading={isLoading}
                sortKey={sortKey}
                sortDir={sortDir}
                handleSort={handleSort}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                nameSearch={nameSearch}
                nameInput={nameInput}
                setNameInput={setNameInput}
                setNameSearch={setNameSearch}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                categoryCounts={categoryCounts}
                totalCount={collections.length}
                selectedCreatorType={selectedCreatorType}
                setSelectedCreatorType={setSelectedCreatorType}
                creatorTypeCounts={creatorTypeCounts}
                toolsMin={toolsMin}
                toolsMax={toolsMax}
                setToolsMin={setToolsMin}
                setToolsMax={setToolsMax}
                activeToolsFilter={activeToolsFilter}
                setActiveToolsFilter={setActiveToolsFilter}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-4 py-6 border-t border-[#232326]/60 mt-4">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .reduce<(number | string)[]>((acc, p, i, arr) => {
                  if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) => p === "..." ? (
                  <span key={`e-${i}`} className="text-[#52525B] text-xs px-1">...</span>
                ) : (
                  <button key={p} onClick={() => setCurrentPage(p as number)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${currentPage === p ? "border-[#6E56CF] bg-[#6E56CF] text-white" : "border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF]"}`}>
                    {p}
                  </button>
                ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                Next →
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}