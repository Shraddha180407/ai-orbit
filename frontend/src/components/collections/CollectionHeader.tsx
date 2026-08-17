'use client';

import React from "react";
import Flame    from 'lucide-react/dist/esm/icons/flame';
import Star     from 'lucide-react/dist/esm/icons/star';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Gift     from 'lucide-react/dist/esm/icons/gift';
import Trophy   from 'lucide-react/dist/esm/icons/trophy';

interface Props {
  nameInput: string;
  setNameInput: (val: string) => void;
  setNameSearch: (val: string) => void;
  activePill: string | null;
  setActivePill: (val: string | null) => void;
  setSortKey: (val: any) => void;
  setSortDir: (val: "asc" | "desc") => void;
  setSelectedCreatorType: (val: string) => void;
  setSelectedCategory: (val: string) => void;
  setCurrentPage: (val: number) => void;
  totalCollections: number;
}

export function CollectionsHeader({
  nameInput,
  setNameInput,
  setNameSearch,
  activePill,
  setActivePill,
  setSortKey,
  setSortDir,
  setSelectedCreatorType,
  setSelectedCategory,
  setCurrentPage,
  totalCollections,
}: Props) {
  return (
    <div className="relative flex flex-col items-center text-center pt-6 pb-5 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] rounded-full blur-[120px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #E91E8C 0%, transparent 70%)" }} />
      <div className="absolute top-4 left-1/3 w-[400px] h-[200px] rounded-full blur-[100px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #FF1F8C 0%, transparent 70%)" }} />
      <div className="absolute top-4 right-1/3 w-[400px] h-[200px] rounded-full blur-[100px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #C2185B 0%, transparent 70%)" }} />

      <h1 className="relative text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
        Collections
      </h1>
      <p className="relative text-[#71717A] text-xs md:text-sm max-w-lg mb-4">
        Explore expert-curated stacks, workflows, and tool setups.
      </p>

      {/* Search bar */}
      <div className="relative w-full max-w-xl mb-5">
        <input
          type="text"
          placeholder="Search collections, creators..."
          value={nameInput}
          onChange={(e) => { setNameInput(e.target.value); setNameSearch(e.target.value); setCurrentPage(1); }}
          className="w-full bg-[#0D0D0F] border border-[#232326] text-white text-sm rounded-xl px-5 py-3 pr-10 placeholder:text-[#52525B] focus:outline-none focus:border-[#6E56CF] transition-colors"
        />
        <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#52525B]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      {/* Filter pills */}
      <div className="relative flex flex-wrap items-center justify-center gap-2 mb-2">
        {[
          { label: "Trending", filter: "trending",  Icon: Flame,     color: "#FF6B4A" },
          { label: "Popular",  filter: "popular",   Icon: Star,      color: "#FFC53D" },
          { label: "Featured", filter: "featured",  Icon: Trophy,    color: "#38BDF8" },
          { label: "Editorial", filter: "editorial", Icon: Sparkles,  color: "#A78BFA" },
          { label: "Recently Updated", filter: "fresh", Icon: Gift,   color: "#34D399" },
        ].map(({ label, filter, Icon, color }) => {
          const isActive = activePill === filter;
          return (
            <button
              key={filter}
              onClick={() => {
                if (isActive) {
                  setActivePill(null);
                  setSortKey("updated"); setSortDir("desc");
                  setSelectedCreatorType("All"); setSelectedCategory("All Categories");
                  setCurrentPage(1);
                } else {
                  setActivePill(filter);
                  if (filter === "trending")   { setSortKey("updated"); setSortDir("desc"); setSelectedCreatorType("All"); setSelectedCategory("All Categories"); }
                  else if (filter === "popular")   { setSortKey("tools"); setSortDir("desc"); setSelectedCreatorType("All"); setSelectedCategory("All Categories"); }
                  else if (filter === "featured")  { setSortKey("updated"); setSortDir("desc"); setSelectedCreatorType("All"); setSelectedCategory("All Categories"); }
                  else if (filter === "editorial") { setSelectedCreatorType("EDITORIAL"); setSortKey("updated"); setSortDir("desc"); setSelectedCategory("All Categories"); }
                  else if (filter === "fresh")     { setSortKey("updated"); setSortDir("desc"); setSelectedCreatorType("All"); setSelectedCategory("All Categories"); }
                  setCurrentPage(1);
                }
              }}
              className={`group inline-flex items-center gap-1.5 rounded-full px-3 h-[28px] text-[11px] font-bold border transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.98] ${
                isActive ? "shadow-md" : "bg-[#131316]/70"
              }`}
              style={
                isActive
                  ? { backgroundColor: `${color}18`, borderColor: `${color}99`, boxShadow: `0 4px 12px -6px ${color}55` }
                  : { borderColor: `${color}55` }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = `0 6px 14px -8px ${color}77`;
                  e.currentTarget.style.borderColor = color;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = "";
                  e.currentTarget.style.borderColor = `${color}55`;
                }
              }}
            >
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:rotate-[8deg]"
                style={{ backgroundColor: isActive ? "rgba(0,0,0,0.15)" : `${color}22` }}
              >
                <Icon
                  size={10}
                  strokeWidth={2.25}
                  style={{ color, filter: `drop-shadow(0 0 4px ${color}99)` }}
                />
              </span>
              <span style={{ color }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
