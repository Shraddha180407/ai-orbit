'use client';

import React from "react";
import Link from "next/link";

interface NormalizedCollection {
  id: string;
  slug: string;
  name: string;
  description: string;
  creatorName: string;
  creatorAvatar: string;
  creatorType: "EDITORIAL" | "COMMUNITY";
  isFeatured: boolean;
  isCurated: boolean;
  toolCount: number;
  updatedAt: string;
  category: string;
  imageUrl: string;
  color: string;
}

const COL_TEMPLATE = "grid-cols-[40px_minmax(200px,2.4fr)_minmax(120px,1.2fr)_minmax(120px,1.3fr)_minmax(100px,1.1fr)_minmax(90px,0.9fr)_minmax(110px,1.1fr)_minmax(140px,1.5fr)]";

interface Props {
  items: NormalizedCollection[];
  isLoading: boolean;
  sortKey: string;
  sortDir: "asc" | "desc";
  handleSort: (key: any) => void;
  openDropdown: string | null;
  setOpenDropdown: (val: string | null) => void;
  nameSearch: string;
  nameInput: string;
  setNameInput: (val: string) => void;
  setNameSearch: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categories: string[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  selectedCreatorType: string;
  setSelectedCreatorType: (val: string) => void;
  creatorTypeCounts: Record<string, number>;
  toolsMin: number;
  toolsMax: number;
  setToolsMin: (val: number) => void;
  setToolsMax: (val: number) => void;
  activeToolsFilter: boolean;
  setActiveToolsFilter: (val: boolean) => void;
  setCurrentPage: (val: number) => void;
}

function LogoCell({ name, logoUrl, color }: { name: string; logoUrl: string; color: string }) {
  const [failed, setFailed] = React.useState(false);
  if (!logoUrl || failed) {
    return (
      <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm text-white select-none border border-[#232326]" 
           style={{ background: `linear-gradient(135deg, ${color} 0%, #131316 100%)` }}>
        {name.charAt(0)}
      </div>
    );
  }
  return <img src={logoUrl} alt={name} className="h-9 w-9 rounded-full object-cover border border-[#232326]" onError={() => setFailed(true)} />;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export function CollectionListTable({
  items,
  isLoading,
  sortKey,
  sortDir,
  handleSort,
  openDropdown,
  setOpenDropdown,
  nameSearch,
  nameInput,
  setNameInput,
  setNameSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
  categoryCounts,
  totalCount,
  selectedCreatorType,
  setSelectedCreatorType,
  creatorTypeCounts,
  toolsMin,
  toolsMax,
  setToolsMin,
  setToolsMax,
  activeToolsFilter,
  setActiveToolsFilter,
  setCurrentPage,
}: Props) {

  function SortIcon({ col }: { col: string }) {
    if (sortKey !== col) return <span className="text-[#3a3a3a] text-[10px]">↕</span>;
    return <span className="text-[#6E56CF] text-[10px]">{sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  function FilterIcon({ active }: { active?: boolean }) {
    return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className={active ? "text-[#6E56CF]" : "text-[#52525B] hover:text-white"}>
        <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
      </svg>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[#232326]/60 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#131316] [&::-webkit-scrollbar-thumb]:bg-[#6E56CF]/40 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div style={{ minWidth: '900px' }} className="relative bg-[#0a0a0c]">
        {/* Header row */}
        <div className="border-b border-[#232326]/60 bg-[#131316]/40">
          <div className={`grid ${COL_TEMPLATE} items-center gap-4 px-4 py-2`}>
            <div />

            {/* NAME */}
            <div className="relative flex items-center gap-2">
              <button onClick={() => handleSort("name")}
                className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] hover:text-white transition-colors flex items-center gap-1">
                NAME <SortIcon col="name" />
              </button>
              <button onClick={() => setOpenDropdown(openDropdown === "name" ? null : "name")}
                className="hover:text-white transition-colors">
                <FilterIcon active={nameSearch.length > 0} />
              </button>
              {openDropdown === "name" && (
                <div className="absolute top-8 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-3 min-w-[210px]">
                  <input autoFocus type="text" placeholder="Filter by name..." value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { setNameSearch(nameInput); setOpenDropdown(null); setCurrentPage(1); } }}
                    className="w-full bg-[#131316] border border-[#232326] text-white text-xs rounded px-2 py-1.5 placeholder:text-[#52525B] focus:outline-none focus:border-[#6E56CF]" />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => { setNameSearch(nameInput); setOpenDropdown(null); setCurrentPage(1); }}
                      className="flex-1 text-[10px] bg-[#6E56CF] hover:bg-[#7C66DF] text-white py-1.5 rounded transition-colors font-semibold">Apply</button>
                    {nameSearch && (
                      <button onClick={() => { setNameSearch(""); setNameInput(""); setOpenDropdown(null); setCurrentPage(1); }}
                        className="flex-1 text-[10px] border border-[#232326] text-[#52525B] hover:text-white py-1.5 rounded transition-colors">Clear</button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CREATOR */}
            <button onClick={() => handleSort("creator")}
              className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] hover:text-white transition-colors flex items-center gap-1">
              CREATOR <SortIcon col="creator" />
            </button>

            {/* CATEGORY */}
            <div className="relative flex items-center gap-2">
              <span className={`text-[9.5px] font-mono font-semibold tracking-wider ${selectedCategory !== "All Categories" ? "text-[#6E56CF]" : "text-[#71717A]"}`}>CATEGORY</span>
              <button onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
                className="hover:text-white transition-colors">
                <FilterIcon active={selectedCategory !== "All Categories"} />
              </button>
              {openDropdown === "category" && (
                <div className="absolute top-8 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-2 min-w-[200px] max-h-56 overflow-y-auto">
                  <button onClick={() => { setSelectedCategory("All Categories"); setCurrentPage(1); setOpenDropdown(null); }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded hover:bg-[#232326] transition-colors ${selectedCategory === "All Categories" ? "text-[#6E56CF] font-bold" : "text-[#A1A1AA]"}`}>
                    <span>All Categories</span><span className="text-[#52525B]">{totalCount}</span>
                  </button>
                  {categories.map((c) => (
                    <button key={c} onClick={() => { setSelectedCategory(c); setCurrentPage(1); setOpenDropdown(null); }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded hover:bg-[#232326] transition-colors ${selectedCategory === c ? "text-[#6E56CF] font-bold" : "text-[#A1A1AA]"}`}>
                      <span>{c}</span><span className="text-[#52525B]">{categoryCounts[c] || 0}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TOOLS count */}
            <div className="relative flex items-center gap-2">
              <button onClick={() => handleSort("tools")}
                className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] hover:text-white transition-colors flex items-center gap-1">
                TOOLS <SortIcon col="tools" />
              </button>
              <button onClick={() => setOpenDropdown(openDropdown === "tools" ? null : "tools")}
                className="hover:text-white transition-colors">
                <FilterIcon active={activeToolsFilter} />
              </button>
              {openDropdown === "tools" && (
                <div className="absolute top-8 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-4 min-w-[220px]">
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
                    className="w-full text-[10px] border border-[#232326] text-[#52525B] hover:text-white py-1.5 rounded transition-colors">Reset</button>
                </div>
              )}
            </div>

            {/* CREATOR TYPE */}
            <div className="relative flex items-center gap-2">
              <span className={`text-[9.5px] font-mono font-semibold tracking-wider ${selectedCreatorType !== "All" ? "text-[#6E56CF]" : "text-[#71717A]"}`}>CREATOR TYPE</span>
              <button onClick={() => setOpenDropdown(openDropdown === "creatorType" ? null : "creatorType")}
                className="hover:text-white transition-colors">
                <FilterIcon active={selectedCreatorType !== "All"} />
              </button>
              {openDropdown === "creatorType" && (
                <div className="absolute top-8 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-2 min-w-[190px]">
                  {["All", "EDITORIAL", "COMMUNITY"].map((a) => (
                    <button key={a} onClick={() => { setSelectedCreatorType(a); setCurrentPage(1); setOpenDropdown(null); }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded hover:bg-[#232326] transition-colors ${selectedCreatorType === a ? "text-[#6E56CF] font-bold" : "text-[#A1A1AA]"}`}>
                      <span className="capitalize">{a.toLowerCase()}</span><span className="text-[#52525B]">{a === "All" ? totalCount : (creatorTypeCounts[a] || 0)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* LAST UPDATED */}
            <button onClick={() => handleSort("updated")}
              className="text-[9.5px] font-mono font-semibold tracking-wider text-[#6E56CF] hover:text-white transition-colors flex items-center gap-1">
              LAST UPDATED <SortIcon col="updated" />
            </button>

            {/* STATUS */}
            <span className="hidden lg:block text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">STATUS</span>
          </div>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="flex flex-col divide-y divide-[#232326]/60">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`grid ${COL_TEMPLATE} items-center gap-4 px-4 py-2.5`}>
                <div className="h-11 w-11 animate-pulse rounded-full bg-[#18181C]" />
                <div className="space-y-1.5">
                  <div className="h-3 w-32 animate-pulse rounded bg-[#18181C]" />
                  <div className="h-2 w-48 animate-pulse rounded bg-[#18181C]" />
                </div>
                <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                <div className="h-4 w-16 animate-pulse rounded-full bg-[#18181C]" />
                <div className="h-3 w-12 animate-pulse rounded bg-[#18181C]" />
                <div className="h-3 w-16 animate-pulse rounded bg-[#18181C]" />
                <div className="h-4 w-20 animate-pulse rounded-md bg-[#18181C]" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-[#52525B] text-sm">No collections found.</div>
        ) : (
          <div role="list" className="flex flex-col">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/collections/${item.slug || item.id}`}
                role="listitem"
                className={`group grid ${COL_TEMPLATE} items-center gap-4 bg-transparent px-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none border-b border-[#232326]/60`}
              >
                {/* Col 1: Avatar */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#232326]/60 bg-transparent">
                  <LogoCell name={item.creatorName} logoUrl={item.creatorAvatar} color={item.color} />
                </div>

                {/* Col 2: Name & description */}
                <div className="min-w-0">
                  <h3 className="truncate text-[13px] font-semibold text-white group-hover:text-white">
                    {item.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A1A1AA] leading-snug">
                    {item.description}
                  </p>
                </div>

                {/* Col 3: Creator */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2" className="shrink-0">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span className="text-[12px] font-mono text-[#A1A1AA] truncate">{item.creatorName}</span>
                </div>

                {/* Col 4: Category */}
                <div className="min-w-0 truncate text-[12px] font-mono text-[#A1A1AA]">
                  {item.category}
                </div>

                {/* Col 5: Tools */}
                <div>
                  <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2.5 py-0.5 text-[11px] font-mono font-semibold text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors">
                    {item.toolCount} tools
                  </span>
                </div>

                {/* Col 6: Creator Type */}
                <div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-semibold transition-colors capitalize ${
                    item.creatorType === "EDITORIAL" 
                      ? "bg-[#2a1a3a] text-[#a78bfa] border-[#4a2a5a]" 
                      : "bg-[#18181C] text-[#A1A1AA] border-[#232326]/60"
                  }`}>
                    {item.creatorType.toLowerCase()}
                  </span>
                </div>

                {/* Col 7: Last Updated */}
                <div className="text-[12px] font-mono text-[#A1A1AA]">
                  {formatDate(item.updatedAt)}
                </div>

                {/* Col 8: Status */}
                <div className="hidden lg:block">
                  {item.isFeatured ? (
                    <span className="inline-flex items-center rounded-full border border-[#4a4a2a] bg-[#2a2a1a] px-2.5 py-0.5 text-[11px] font-mono font-semibold text-[#facc15] hover:border-[#facc15] transition-colors whitespace-nowrap">
                      Featured
                    </span>
                  ) : item.isCurated ? (
                    <span className="inline-flex items-center rounded-full border border-[#2a3a5a] bg-[#1a2a3a] px-2.5 py-0.5 text-[11px] font-mono font-semibold text-[#60a5fa] hover:border-[#60a5fa] transition-colors whitespace-nowrap">
                      Curated
                    </span>
                  ) : (
                    <span className="text-[12px] font-mono text-[#71717A]">Community</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
