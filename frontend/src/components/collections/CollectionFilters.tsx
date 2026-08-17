'use client';

import React from "react";

interface Props {
  nameInput: string;
  setNameInput: (val: string) => void;
  setNameSearch: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categories: string[];
  selectedCreatorType: string;
  setSelectedCreatorType: (val: string) => void;
  sortKey: string;
  sortDir: "asc" | "desc";
  setSortKey: (val: any) => void;
  setSortDir: (val: "asc" | "desc") => void;
  toolsMin: number;
  toolsMax: number;
  setToolsMin: (val: number) => void;
  setToolsMax: (val: number) => void;
  activeToolsFilter: boolean;
  setActiveToolsFilter: (val: boolean) => void;
  setCurrentPage: (val: number) => void;
  openDropdown: string | null;
  setOpenDropdown: (val: string | null) => void;
}

export function CollectionFilters({
  nameInput,
  setNameInput,
  setNameSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedCreatorType,
  setSelectedCreatorType,
  sortKey,
  sortDir,
  setSortKey,
  setSortDir,
  toolsMin,
  toolsMax,
  setToolsMin,
  setToolsMax,
  activeToolsFilter,
  setActiveToolsFilter,
  setCurrentPage,
  openDropdown,
  setOpenDropdown,
}: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5 items-center">
      <div className="flex gap-2">
        <input type="text" placeholder="Search..." value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { setNameSearch(nameInput); setCurrentPage(1); } }}
          className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 w-full placeholder:text-[#52525B] focus:outline-none focus:border-[#6E56CF]" />
        <button onClick={() => { setNameSearch(nameInput); setCurrentPage(1); }}
          className="text-xs bg-[#6E56CF] hover:bg-[#7C66DF] text-white px-3 py-2 rounded-lg transition-colors font-semibold shrink-0">Apply</button>
      </div>
      <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
        className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6E56CF] w-full">
        <option value="All Categories">All Categories</option>
        {categories.map((c) => <option key={c}>{c}</option>)}
      </select>
      <select value={selectedCreatorType} onChange={(e) => { setSelectedCreatorType(e.target.value); setCurrentPage(1); }}
        className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6E56CF] flex-1 min-w-[140px]">
        <option value="All">All Creators</option>
        <option value="EDITORIAL">Editorial Only</option>
        <option value="COMMUNITY">Community Only</option>
      </select>
      <select value={`${sortKey}-${sortDir}`}
        onChange={(e) => { const [key, dir] = e.target.value.split("-"); setSortKey(key); setSortDir(dir as any); setCurrentPage(1); }}
        className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6E56CF] w-full">
        <option value="updated-desc">Sort: Recently Updated</option>
        <option value="updated-asc">Sort: Oldest Updated</option>
        <option value="name-asc">Sort: Name A→Z</option>
        <option value="name-desc">Sort: Name Z→A</option>
        <option value="tools-desc">Sort: Most Tools</option>
        <option value="tools-asc">Sort: Fewest Tools</option>
      </select>

      {/* Tools Count Range Filter */}
      <div className="relative w-full">
        <button
          onClick={() => setOpenDropdown(openDropdown === "grid-tools" ? null : "grid-tools")}
          className={`flex items-center justify-between w-full bg-[#131316] border text-sm rounded-lg px-3 py-2 transition-colors ${activeToolsFilter ? "border-[#6E56CF] text-[#6E56CF]" : "border-[#232326] text-[#A1A1AA] hover:text-white"}`}
        >
          {activeToolsFilter ? `${toolsMin}–${toolsMax} Tools` : "Tools Count"}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        {openDropdown === "grid-tools" && (
          <div className="absolute top-11 left-0 right-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-4">
            <div className="flex justify-between text-[10px] text-[#A1A1AA] mb-3">
              <span>Min: <span className="text-white font-bold">{toolsMin}</span></span>
              <span>Max: <span className="text-white font-bold">{toolsMax === 100 ? "100+" : toolsMax}</span></span>
            </div>
            <div className="relative h-5 mb-4">
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-[#232326] rounded-full" />
              <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#6E56CF] rounded-full"
                style={{ left: `${(toolsMin/100)*100}%`, right: `${100-(toolsMax/100)*100}%` }} />
              <input type="range" min={0} max={100} step={1} value={toolsMin}
                onChange={(e) => { const val = Math.min(Number(e.target.value), toolsMax-1); setToolsMin(val); setActiveToolsFilter(true); setCurrentPage(1); }}
                className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: toolsMin > 90 ? 5 : 3 }} />
              <input type="range" min={0} max={100} step={1} value={toolsMax}
                onChange={(e) => { const val = Math.max(Number(e.target.value), toolsMin+1); setToolsMax(val); setActiveToolsFilter(true); setCurrentPage(1); }}
                className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: 4 }} />
              <div className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
                style={{ left: `calc(${(toolsMin/100)*100}% - 7px)` }} />
              <div className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
                style={{ left: `calc(${(toolsMax/100)*100}% - 7px)` }} />
            </div>
            <button onClick={() => { setToolsMin(0); setToolsMax(100); setActiveToolsFilter(false); setCurrentPage(1); setOpenDropdown(null); }}
              className="w-full text-[10px] border border-[#232326] text-[#52525B] hover:text-white py-1.5 rounded transition-colors">
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
