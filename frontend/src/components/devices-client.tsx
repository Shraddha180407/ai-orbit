'use client';

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Device } from "@/lib/types";
import { fetchAllDevices } from "@/lib/api";
import { DEVICES_DATA, DeviceData, getMainTaskColor } from "@/data/devices";
import Flame    from 'lucide-react/dist/esm/icons/flame';
import Star     from 'lucide-react/dist/esm/icons/star';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Gift     from 'lucide-react/dist/esm/icons/gift';
import Trophy   from 'lucide-react/dist/esm/icons/trophy';

const ALL_CATEGORIES = "All Categories";

const AVAILABILITY_STYLES: Record<string, string> = {
  Available: "bg-[#1a3a2a] text-[#4ade80] border border-[#2a5a3a]",
  "Pre-order": "bg-[#1a2a3a] text-[#60a5fa] border border-[#2a3a5a]",
  Announced: "bg-[#2a2a1a] text-[#facc15] border border-[#4a4a2a]",
  Discontinued: "bg-[#3a1a1a] text-[#f87171] border border-[#5a2a2a]",
};

const ROW_ACCENT_COLORS = [
  "#6E56CF", "#E85D4A", "#0082FB", "#34A853",
  "#FF9900", "#E91E8C", "#00BCD4", "#FF6B35",
];

function getFaviconUrl(manufacturer: string, slug: string): string {
  const domain = slug.toLowerCase().replace(/[^a-z0-9-]/g, "").split("-")[0];
  const mfr = (manufacturer || "").toLowerCase().replace(/\s+/g, "");
  const guess = mfr || domain;
  return `https://www.google.com/s2/favicons?sz=64&domain=${guess}.com`;
}

function mergeWithDummy(apiDevices: Device[]): DeviceData[] {
  if (!apiDevices || apiDevices.length === 0) return DEVICES_DATA;
  return apiDevices.map((api) => {
    const dummy = DEVICES_DATA.find((d) => d.id === api.id || d.slug === api.slug);
    const mainTask = api.mainTask || dummy?.mainTask || "Device";
    const slug = dummy?.slug || api.slug || api.id;
    const manufacturer = api.manufacturer || dummy?.manufacturer || "—";
    return {
      id: api.id,
      slug,
      name: api.name,
      manufacturer,
      manufacturerSlug: dummy?.manufacturerSlug || "",
      category: api.category || dummy?.category || "Other",
      availability: api.availability || dummy?.availability || "Announced",
      price: api.price || dummy?.price || null,
      year: api.year || dummy?.year || "—",
      month: dummy?.month || api.month || api.year || "—",
      description: api.description || dummy?.description || "",
      imageUrl: api.imageUrl || dummy?.imageUrl || "",
      manufacturerLogoUrl: dummy?.manufacturerLogoUrl || getFaviconUrl(manufacturer, slug),
      mainTask,
      mainTaskColor: getMainTaskColor(mainTask),
      formFactor: api.formFactor || dummy?.formFactor || null,
      country: api.country || dummy?.country || null,
      ram: api.ram || dummy?.ram || null,
      aiFeatures: api.aiFeatures || dummy?.aiFeatures || [],
      primaryUseCases: api.primaryUseCases || dummy?.primaryUseCases || [],
      additionalInfo: api.additionalInfo || dummy?.additionalInfo || null,
      buyUrl: api.buyUrl || dummy?.buyUrl || null,
    } as DeviceData;
  });
}

type SortKey = "release" | "name" | "availability" | "price";

function GridImageCell({ name, imageUrl, color }: { name: string; imageUrl: string; color: string }) {
  const [failed, setFailed] = React.useState(false);
  if (!imageUrl || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: `${color}22` }}>
        <span className="text-5xl font-black uppercase" style={{ color }}>{name.charAt(0)}</span>
      </div>
    );
  }
  return <img src={imageUrl} alt={name} className="w-full h-full object-cover" onError={() => setFailed(true)} />;
}

function LogoCell({ name, logoUrl, color }: { name: string; logoUrl: string; color: string }) {
  const [failed, setFailed] = React.useState(false);
  if (!logoUrl || failed) {
    return <span className="text-sm font-bold" style={{ color }}>{name.charAt(0)}</span>;
  }
  return <img src={logoUrl} alt={name} className="h-9 w-9 object-contain" onError={() => setFailed(true)} />;
}

const PAGE_SIZE = 20;

// Matches ToolListView column template exactly
const COL_TEMPLATE = "grid-cols-[40px_minmax(200px,2.4fr)_minmax(120px,1.2fr)_minmax(120px,1.3fr)_minmax(100px,1.1fr)_minmax(90px,0.9fr)_minmax(110px,1.1fr)_minmax(140px,1.5fr)]";
const COL_MIN_WIDTH = "min-w-[900px]";

const COLUMN_HEADERS = [
  { label: "TOOL" },
  { label: "NAME" },
  { label: "COMPANY" },
  { label: "CATEGORY" },
  { label: "AVAIL." },
  { label: "PRICE" },
  { label: "RELEASE DATE" },
  { label: "MAIN TASK" },
];

export function DevicesClient() {
  const [devices, setDevices] = useState<DeviceData[]>(DEVICES_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [nameSearch, setNameSearch] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("release");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activePill, setActivePill] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000);
  const [activePriceFilter, setActivePriceFilter] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllDevices()
      .then((data) => setDevices(mergeWithDummy(data || [])))
      .catch(() => setDevices(DEVICES_DATA))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActiveFilters = nameSearch || selectedCategory !== ALL_CATEGORIES || selectedAvailability !== "All" || activePriceFilter;

  function clearAllFilters() {
    setNameSearch(""); setNameInput(""); setSelectedCategory(ALL_CATEGORIES);
    setSelectedAvailability("All"); setPriceMin(0); setPriceMax(10000);
    setActivePriceFilter(false); setActivePill(null); setCurrentPage(1);
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    devices.forEach((d) => { counts[d.category] = (counts[d.category] || 0) + 1; });
    return counts;
  }, [devices]);

  const availabilityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    devices.forEach((d) => { if (d.availability) counts[d.availability] = (counts[d.availability] || 0) + 1; });
    return counts;
  }, [devices]);

  const categories = useMemo(() => {
    return Array.from(new Set(devices.map((d) => d.category).filter(Boolean))).sort();
  }, [devices]);

  const filtered = useMemo(() => {
    let list = [...devices];
    if (nameSearch.trim()) {
      const q = nameSearch.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.manufacturer?.toLowerCase().includes(q));
    }
    if (selectedCategory !== ALL_CATEGORIES) list = list.filter((d) => d.category === selectedCategory);
    if (selectedAvailability !== "All") list = list.filter((d) => d.availability === selectedAvailability);
    if (activePriceFilter) {
      list = list.filter((d) => {
        if (!d.price) return false;
        const p = parseFloat(d.price.replace(/[^0-9.]/g, "")) || 0;
        return p >= priceMin && p <= priceMax;
      });
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "availability") cmp = (a.availability || "").localeCompare(b.availability || "");
      else if (sortKey === "price") {
        const pa = parseFloat((a.price || "0").replace(/[^0-9.]/g, "")) || 0;
        const pb = parseFloat((b.price || "0").replace(/[^0-9.]/g, "")) || 0;
        cmp = pa - pb;
      } else {
        cmp = (b.year || "").localeCompare(a.year || "");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [devices, nameSearch, selectedCategory, selectedAvailability, sortKey, sortDir, priceMin, priceMax, activePriceFilter]);

  useEffect(() => { setCurrentPage(1); }, [nameSearch, selectedCategory, selectedAvailability, sortKey, sortDir, activePriceFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
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

  const PriceRangeDropdown = ({ id }: { id: string }) => (
  <div className="relative w-full">
      <button
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
        className={`flex items-center justify-between w-full bg-[#131316] border text-sm rounded-lg px-3 py-2 transition-colors ${activePriceFilter ? "border-[#6E56CF] text-[#6E56CF]" : "border-[#232326] text-[#A1A1AA] hover:text-white"}`}
      >
        {activePriceFilter ? `$${priceMin}–$${priceMax}` : "Price Range"}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {openDropdown === id && (
        <div className="absolute top-11 left-0 right-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-4">
          <div className="flex justify-between text-[10px] text-[#A1A1AA] mb-3">
            <span>Min: <span className="text-white font-bold">${priceMin.toLocaleString()}</span></span>
            <span>Max: <span className="text-white font-bold">${priceMax.toLocaleString()}</span></span>
          </div>
          <div className="relative h-5 mb-4">
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-[#232326] rounded-full" />
            <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#6E56CF] rounded-full"
              style={{ left: `${(priceMin/10000)*100}%`, right: `${100-(priceMax/10000)*100}%` }} />
            <input type="range" min={0} max={10000} step={100} value={priceMin}
              onChange={(e) => { const val = Math.min(Number(e.target.value), priceMax-10); setPriceMin(val); setActivePriceFilter(true); setCurrentPage(1); }}
              className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: priceMin > 9000 ? 5 : 3 }} />
            <input type="range" min={0} max={10000} step={100} value={priceMax}
              onChange={(e) => { const val = Math.max(Number(e.target.value), priceMin+10); setPriceMax(val); setActivePriceFilter(true); setCurrentPage(1); }}
              className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: 4 }} />
            <div className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
              style={{ left: `calc(${(priceMin/10000)*100}% - 7px)` }} />
            <div className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
              style={{ left: `calc(${(priceMax/10000)*100}% - 7px)` }} />
          </div>
          <button onClick={() => { setPriceMin(0); setPriceMax(10000); setActivePriceFilter(false); setCurrentPage(1); setOpenDropdown(null); }}
            className="w-full text-[10px] border border-[#232326] text-[#52525B] hover:text-white py-1.5 rounded transition-colors">
            Reset
          </button>
        </div>
      )}
    </div>
  );

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-8 flex-1">

      {/* ── HERO HEADER (matches home page) ── */}
      <div className="relative flex flex-col items-center text-center pt-6 pb-5 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] rounded-full blur-[120px] opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #E91E8C 0%, transparent 70%)" }} />
        <div className="absolute top-4 left-1/3 w-[400px] h-[200px] rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #FF1F8C 0%, transparent 70%)" }} />
        <div className="absolute top-4 right-1/3 w-[400px] h-[200px] rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #C2185B 0%, transparent 70%)" }} />

        <h1 className="relative text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
          AI Devices & Wearables
        </h1>
        <p className="relative text-[#71717A] text-xs md:text-sm max-w-lg mb-4">
          Discover and track the AI devices and wearables that actually matter.
        </p>

        {/* Search bar */}
        <div className="relative w-full max-w-xl mb-5">
          <input
            type="text"
            placeholder="Search devices, manufacturers..."
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
            { label: "New",      filter: "new",       Icon: Sparkles,  color: "#A78BFA" },
            { label: "Available",filter: "Available", Icon: Gift,      color: "#34D399" },
            { label: "Wearables",filter: "wearable",  Icon: Trophy,    color: "#38BDF8" },
          ].map(({ label, filter, Icon, color }) => {
            const isActive = activePill === filter;
            return (
              <button
                key={filter}
                onClick={() => {
                  if (isActive) {
                    setActivePill(null);
                    setSortKey("release"); setSortDir("desc");
                    setSelectedAvailability("All"); setSelectedCategory(ALL_CATEGORIES);
                    setCurrentPage(1);
                  } else {
                    setActivePill(filter);
                    if (filter === "trending")   { setSortKey("release"); setSortDir("desc"); setSelectedAvailability("All"); setSelectedCategory(ALL_CATEGORIES); }
                    else if (filter === "popular")   { setSortKey("price"); setSortDir("desc"); setSelectedAvailability("All"); setSelectedCategory(ALL_CATEGORIES); }
                    else if (filter === "new")       { setSortKey("release"); setSortDir("desc"); setSelectedAvailability("All"); setSelectedCategory(ALL_CATEGORIES); }
                    else if (filter === "Available") { setSelectedAvailability("Available"); setSortKey("release"); setSortDir("desc"); setSelectedCategory(ALL_CATEGORIES); }
                    else if (filter === "wearable")  { setSelectedCategory("AI Wearable"); setSelectedAvailability("All"); setSortKey("release"); setSortDir("desc"); }
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


      {/* ── LIST VIEW ── */}
<div>
          {/*  Outer container matches ToolListView exactly */}
          <div className="overflow-x-auto rounded-lg border border-[#232326]/60 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#131316] [&::-webkit-scrollbar-thumb]:bg-[#6E56CF]/40 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div ref={dropdownRef} style={{ minWidth: '900px' }} className="relative bg-[#0a0a0c]">

                {/* Header row matches ToolListView exactly */}
                <div className="border-b border-[#232326]/60 bg-[#131316]/40">
                  <div className={`grid ${COL_TEMPLATE} items-center gap-4 px-4 py-2`}>

                    {/* TOOL col — no filter */}
                    <div />

                    {/* NAME col — with filter dropdown */}
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

                    {/* COMPANY col */}
                    <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">COMPANY</span>

                    {/* CATEGORY col — with filter dropdown */}
                    <div className="relative flex items-center gap-2">
                      <span className={`text-[9.5px] font-mono font-semibold tracking-wider ${selectedCategory !== ALL_CATEGORIES ? "text-[#6E56CF]" : "text-[#71717A]"}`}>CATEGORY</span>
                      <button onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
                        className="hover:text-white transition-colors">
                        <FilterIcon active={selectedCategory !== ALL_CATEGORIES} />
                      </button>
                      {openDropdown === "category" && (
                        <div className="absolute top-8 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-2 min-w-[200px] max-h-56 overflow-y-auto">
                          <button onClick={() => { setSelectedCategory(ALL_CATEGORIES); setCurrentPage(1); setOpenDropdown(null); }}
                            className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded hover:bg-[#232326] transition-colors ${selectedCategory === ALL_CATEGORIES ? "text-[#6E56CF] font-bold" : "text-[#A1A1AA]"}`}>
                            <span>All Categories</span><span className="text-[#52525B]">{devices.length}</span>
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

                    {/* AVAIL. col — with filter dropdown */}
                    <div className="relative flex items-center gap-2">
                      <button onClick={() => handleSort("availability")}
                        className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] hover:text-white transition-colors flex items-center gap-1">
                        AVAIL. <SortIcon col="availability" />
                      </button>
                      <button onClick={() => setOpenDropdown(openDropdown === "availability" ? null : "availability")}
                        className="hover:text-white transition-colors">
                        <FilterIcon active={selectedAvailability !== "All"} />
                      </button>
                      {openDropdown === "availability" && (
                        <div className="absolute top-8 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-2 min-w-[190px]">
                          {["All", "Available", "Pre-order", "Announced", "Discontinued"].map((a) => (
                            <button key={a} onClick={() => { setSelectedAvailability(a); setCurrentPage(1); setOpenDropdown(null); }}
                              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded hover:bg-[#232326] transition-colors ${selectedAvailability === a ? "text-[#6E56CF] font-bold" : "text-[#A1A1AA]"}`}>
                              <span>{a}</span><span className="text-[#52525B]">{a === "All" ? devices.length : (availabilityCounts[a] || 0)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* PRICE col — with filter dropdown */}
                    <div className="relative flex items-center gap-2">
                      <button onClick={() => handleSort("price")}
                        className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] hover:text-white transition-colors flex items-center gap-1">
                        PRICE <SortIcon col="price" />
                      </button>
                      <button onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
                        className="hover:text-white transition-colors">
                        <FilterIcon active={activePriceFilter} />
                      </button>
                      {openDropdown === "price" && (
                        <div className="absolute top-8 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-4 min-w-[220px]">
                          <div className="flex justify-between text-[10px] text-[#A1A1AA] mb-3">
                            <span>Min: <span className="text-white font-bold">${priceMin.toLocaleString()}</span></span>
                            <span>Max: <span className="text-white font-bold">${priceMax.toLocaleString()}</span></span>
                          </div>
                          <div className="relative h-5 mb-4">
                            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-[#232326] rounded-full" />
                            <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#6E56CF] rounded-full"
                              style={{ left: `${(priceMin/10000)*100}%`, right: `${100-(priceMax/10000)*100}%` }} />
                            <input type="range" min={0} max={10000} step={100} value={priceMin}
                              onChange={(e) => { const val = Math.min(Number(e.target.value), priceMax-10); setPriceMin(val); setActivePriceFilter(true); setCurrentPage(1); }}
                              className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: priceMin > 9000 ? 5 : 3 }} />
                            <input type="range" min={0} max={10000} step={100} value={priceMax}
                              onChange={(e) => { const val = Math.max(Number(e.target.value), priceMin+10); setPriceMax(val); setActivePriceFilter(true); setCurrentPage(1); }}
                              className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: 4 }} />
                            <div className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
                              style={{ left: `calc(${(priceMin/10000)*100}% - 7px)` }} />
            <div className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
              style={{ left: `calc(${(priceMax/10000)*100}% - 7px)` }} />
          </div>
          <button onClick={() => { setPriceMin(0); setPriceMax(10000);setActivePriceFilter(false); setCurrentPage(1); setOpenDropdown(null); }}
                            className="w-full text-[10px] border border-[#232326] text-[#52525B] hover:text-white py-1.5 rounded transition-colors">Reset</button>
                        </div>
                      )}
                    </div>

                    {/* RELEASE DATE col */}
                    <button onClick={() => handleSort("release")}
                      className="text-[9.5px] font-mono font-semibold tracking-wider text-[#6E56CF] hover:text-white transition-colors flex items-center gap-1">
                      RELEASE DATE <SortIcon col="release" />
                    </button>

                    {/* MAIN TASK col */}
                    <span className="hidden lg:block text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">MAIN TASK</span>
                  </div>
                </div>

                {/*  Rows — matches ToolListView row structure exactly */}
                {isLoading ? (
                  <div className="flex flex-col divide-y divide-[#232326]/60">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className={`grid ${COL_TEMPLATE} items-center gap-4 px-4 py-2.5`}>
                        <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
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
                ) : filtered.length === 0 ? (
                  <div className="py-20 text-center text-[#52525B] text-sm">No devices found.</div>
                ) : (
                  <div role="list" className="flex flex-col">
                    {visible.map((device, visibleIndex) => (
                      <Link
  key={device.id}
  href={`/devices/${device.slug || device.id}`}
  role="listitem"
  className={`group grid ${COL_TEMPLATE} items-center gap-4 px-4 py-2.5 transition-all duration-200 focus-visible:outline-none border-b border-[#232326]/60 relative`}
  style={{
    '--accent': ROW_ACCENT_COLORS[visibleIndex % ROW_ACCENT_COLORS.length],
  } as React.CSSProperties}
  onMouseEnter={e => {
    const color = ROW_ACCENT_COLORS[visibleIndex % ROW_ACCENT_COLORS.length];
    const el = e.currentTarget;
    el.style.boxShadow = `inset 3px 0 0 ${color}`;
    const logo = el.querySelector<HTMLElement>('[data-logo="true"]');
    if (logo) {
      logo.style.borderColor = color;
      logo.style.boxShadow = `0 0 8px ${color}55`;
    }
    const name = el.querySelector<HTMLElement>('[data-name="true"]');
    if (name) name.style.color = color;
  }}
  onMouseLeave={e => {
    const el = e.currentTarget;
    el.style.boxShadow = '';
    const logo = el.querySelector<HTMLElement>('[data-logo="true"]');
    if (logo) {
      logo.style.borderColor = '';
      logo.style.boxShadow = '';
    }
    const name = el.querySelector<HTMLElement>('[data-name="true"]');
    if (name) name.style.color = '';
  }}
>
                        {/* Col 1: Logo */}
                        <div data-logo="true" className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white transition-all duration-200">
                          <LogoCell name={device.name} logoUrl={device.manufacturerLogoUrl} color={device.mainTaskColor} />
                        </div>

                        {/* Col 2: Name + description */}
                        <div className="min-w-0">
                         <h3
  className="truncate text-[13px] font-semibold text-white transition-colors duration-200"
  data-name="true"
>
  {device.name}
</h3>
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A1A1AA] leading-snug">
                            {device.description}
                          </p>
                        </div>

                        {/* Col 3: Company */}
                        <div className="flex items-center gap-1.5 min-w-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2" className="shrink-0">
                            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                          </svg>
                          <span className="text-[12px] font-mono text-[#A1A1AA] truncate">{device.manufacturer || "—"}</span>
                        </div>

                        {/* Col 4: Category */}
                        <div className="min-w-0 truncate text-[12px] font-mono text-[#A1A1AA]">
                          {device.category || "—"}
                        </div>

                        {/* Col 5: Availability */}
<div>
  {device.availability ? (
    <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2.5 py-0.5 text-[11px] font-mono font-semibold text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors">
  {device.availability}
</span>
  ) : <span className="text-[12px] font-mono text-[#71717A]">—</span>}
</div>

                        {/* Col 6: Price */}
                        <div className="text-[12px] font-mono">
                          {device.price
                            ? <span className="text-white">{device.price}</span>
                            : <span className="text-[#71717A]">N/A</span>}
                        </div>

                        {/* Col 7: Release Date */}
                        <div className="text-[12px] font-mono text-[#A1A1AA]">
                          {device.month || device.year || "—"}
                        </div>

                        {/* Col 8: Main Task */}
<div className="hidden lg:block">
  {device.mainTask ? (
    <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2.5 py-0.5 text-[11px] font-mono font-semibold text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors whitespace-nowrap">
  {device.mainTask}
</span>
  ) : <span className="text-[12px] font-mono text-[#71717A]">—</span>}
</div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 px-4 py-4 border-t border-[#232326]/60">
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
          </div>
        </div>
    </main>
  );
}