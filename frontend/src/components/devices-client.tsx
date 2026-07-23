'use client';

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Device } from "@/lib/types";
import { fetchAllDevices } from "@/lib/api";
import { DEVICES_DATA, DeviceData, getMainTaskColor } from "@/data/devices";

const ALL_CATEGORIES = "All Categories";

const AVAILABILITY_STYLES: Record<string, string> = {
  Available: "bg-[#1a3a2a] text-[#4ade80] border border-[#2a5a3a]",
  "Pre-order": "bg-[#1a2a3a] text-[#60a5fa] border border-[#2a3a5a]",
  Announced: "bg-[#2a2a1a] text-[#facc15] border border-[#4a4a2a]",
  Discontinued: "bg-[#3a1a1a] text-[#f87171] border border-[#5a2a2a]",
};

function getFaviconUrl(manufacturer: string, slug: string): string {
  const domain = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .split("-")[0];
  const mfr = (manufacturer || "").toLowerCase().replace(/\s+/g, "");
  const guess = mfr || domain;
  return `https://www.google.com/s2/favicons?sz=64&domain=${guess}.com`;
}

function mergeWithDummy(apiDevices: Device[]): DeviceData[] {
  if (!apiDevices || apiDevices.length === 0) return DEVICES_DATA;
  const merged = apiDevices.map((api) => {
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
  return merged;
}

type SortKey = "release" | "name" | "availability" | "price";

function GridImageCell({ name, imageUrl, color }: { name: string; imageUrl: string; color: string }) {
  const [failed, setFailed] = React.useState(false);
  if (!imageUrl || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center"
        style={{ background: `${color}22` }}>
        <span className="text-5xl font-black uppercase" style={{ color }}>
          {name.charAt(0)}
        </span>
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt={name}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function LogoCell({ name, logoUrl, color }: { name: string; logoUrl: string; color: string }) {
  const [failed, setFailed] = React.useState(false);
  if (!logoUrl || failed) {
    return (
      <span className="text-xl font-black uppercase" style={{ color }}>
        {name.charAt(0)}
      </span>
    );
  }
  return (
    <img
      src={logoUrl}
      alt={name}
      className="h-13 w-13 object-contain"
      onError={() => setFailed(true)}
    />
  );
}
const PAGE_SIZE = 20;

export function DevicesClient() {
  const [devices, setDevices] = useState<DeviceData[]>(DEVICES_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Filters
  const [nameSearch, setNameSearch] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("release");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
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
    setNameSearch("");
    setNameInput("");
    setSelectedCategory(ALL_CATEGORIES);
    setSelectedAvailability("All");
    setPriceMin(0);
    setPriceMax(10000);
    setActivePriceFilter(false);
    setCurrentPage(1);
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
    const cats = Array.from(new Set(devices.map((d) => d.category).filter(Boolean)));
    return cats.sort();
  }, [devices]);

  const filtered = useMemo(() => {
    let list = [...devices];
    if (nameSearch.trim()) {
      const q = nameSearch.toLowerCase();
      list = list.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.manufacturer?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== ALL_CATEGORIES) {
      list = list.filter((d) => d.category === selectedCategory);
    }
    if (selectedAvailability !== "All") {
      list = list.filter((d) => d.availability === selectedAvailability);
    }
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

  return (
    <main className="w-full px-6 md:px-10 py-8 flex-1">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
          AI Devices & Wearables
        </h1>
        <div className="flex items-center gap-6 mt-3">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white">{isLoading ? "…" : devices.length}</span>
            <span className="text-xs text-[#52525B] uppercase tracking-widest mt-0.5">Devices</span>
          </div>
          <div className="w-px h-8 bg-[#232326]" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white">{isLoading ? "…" : categories.length}</span>
            <span className="text-xs text-[#52525B] uppercase tracking-widest mt-0.5">Categories</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-4 mt-4">
        <div className="flex items-center gap-2">
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
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div>
          {/* Grid Filters */}
          <div className="flex flex-wrap gap-3 mb-5 items-center">
            {/* Name search */}
            <div className="flex gap-2 flex-1 min-w-[180px]">
              <input
                type="text"
                placeholder="Search devices..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setNameSearch(nameInput); setCurrentPage(1); } }}
                className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 w-full placeholder:text-[#52525B] focus:outline-none focus:border-[#6E56CF]"
              />
              <button
                onClick={() => { setNameSearch(nameInput); setCurrentPage(1); }}
                className="text-xs bg-[#6E56CF] hover:bg-[#7C66DF] text-white px-3 py-2 rounded-lg transition-colors font-semibold shrink-0">
                Apply
              </button>
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6E56CF] flex-1 min-w-[140px]"
            >
              <option value={ALL_CATEGORIES}>All Categories</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>

            {/* Availability */}
            <select
              value={selectedAvailability}
              onChange={(e) => { setSelectedAvailability(e.target.value); setCurrentPage(1); }}
              className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6E56CF] flex-1 min-w-[140px]"
            >
              <option value="All">All Availability</option>
              <option value="Available">Available</option>
              <option value="Pre-order">Pre-order</option>
              <option value="Announced">Announced</option>
              <option value="Discontinued">Discontinued</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortKey}-${sortDir}`}
              onChange={(e) => {
                const [key, dir] = e.target.value.split("-");
                setSortKey(key as SortKey);
                setSortDir(dir as "asc" | "desc");
                setCurrentPage(1);
              }}
              className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6E56CF] flex-1 min-w-[160px]"
            >
              <option value="release-desc">Sort: Newest First</option>
              <option value="release-asc">Sort: Oldest First</option>
              <option value="name-asc">Sort: Name A→Z</option>
              <option value="name-desc">Sort: Name Z→A</option>
              <option value="price-asc">Sort: Price Low→High</option>
              <option value="price-desc">Sort: Price High→Low</option>
            </select>

            {/* Price Range */}
            <div className="relative shrink-0">
              <button
                onClick={() => setOpenDropdown(openDropdown === "grid-price" ? null : "grid-price")}
                className={`flex items-center gap-1.5 bg-[#131316] border text-sm rounded-lg px-3 py-2 transition-colors whitespace-nowrap ${activePriceFilter ? "border-[#6E56CF] text-[#6E56CF]" : "border-[#232326] text-[#A1A1AA] hover:text-white"}`}
              >
                {activePriceFilter ? `$${priceMin}–$${priceMax}` : "Price Range"}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {openDropdown === "grid-price" && (
                <div className="absolute top-10 right-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-4 min-w-[220px]">
                  <div className="flex justify-between text-[10px] text-[#A1A1AA] mb-3">
                    <span>Min: <span className="text-white font-bold">${priceMin.toLocaleString()}</span></span>
                    <span>Max: <span className="text-white font-bold">${priceMax.toLocaleString()}</span></span>
                  </div>
                  <div className="relative h-5 mb-4">
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-[#232326] rounded-full" />
                    <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#6E56CF] rounded-full"
                      style={{ left: `${(priceMin / 10000) * 100}%`, right: `${100 - (priceMax / 10000) * 100}%` }} />
                    <input type="range" min={0} max={10000} step={10} value={priceMin}
                      onChange={(e) => { const val = Math.min(Number(e.target.value), priceMax - 10); setPriceMin(val); setActivePriceFilter(true); setCurrentPage(1); }}
                      className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: priceMin > 9000 ? 5 : 3 }} />
                    <input type="range" min={0} max={10000} step={10} value={priceMax}
                      onChange={(e) => { const val = Math.max(Number(e.target.value), priceMin + 10); setPriceMax(val); setActivePriceFilter(true); setCurrentPage(1); }}
                      className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: 4 }} />
                    <div className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
                      style={{ left: `calc(${(priceMin / 10000) * 100}% - 7px)` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
                      style={{ left: `calc(${(priceMax / 10000) * 100}% - 7px)` }} />
                  </div>
                  <button onClick={() => { setPriceMin(0); setPriceMax(10000); setActivePriceFilter(false); setCurrentPage(1); setOpenDropdown(null); }}
                    className="w-full text-[10px] border border-[#232326] text-[#52525B] hover:text-white py-1.5 rounded transition-colors">
                    Reset
                  </button>
                </div>
              )}
            </div>

          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {isLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-[#131316] rounded-xl border border-[#232326]" />
            ))
          ) : visible.map((device) => (
            <Link key={device.id} href={`/devices/${device.slug || device.id}`}
              className="rounded-xl border border-[#232326] bg-[#0D0D0F] hover:border-[#6E56CF]/40 transition-all group overflow-hidden">
              <div className="relative h-56 bg-[#18181C] flex items-center justify-center overflow-hidden">
                <GridImageCell name={device.name} imageUrl={device.imageUrl} color={device.mainTaskColor} />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm font-bold text-white truncate transition-colors"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = device.mainTaskColor || '#6E56CF'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'white'; }}>
                    {device.name}
                  </p>
                  <p className="text-[11px] text-[#A1A1AA]">{device.category} · {device.manufacturer}</p>
                </div>
                {device.month && (
                  <div className="absolute top-2 right-2 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded">
                    {device.month}
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  {device.availability ? (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${AVAILABILITY_STYLES[device.availability]}`}>
                      {device.availability}
                    </span>
                  ) : <span />}
                  <span className="text-xs font-bold text-[#4ade80]">{device.price || ""}</span>
                </div>
                <p className="text-[11px] text-[#52525B] line-clamp-2 leading-relaxed">{device.description}</p>
              </div>
            </Link>
          ))}
        </div>
        </div>
      )}

        {/* List View */}
      {viewMode === "list" && (
        <div>
        <div className="rounded-xl border border-[#232326] overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#131316] [&::-webkit-scrollbar-thumb]:bg-[#6E56CF]/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar]:block">
          <div className="min-w-[980px] relative min-h-[400px]" ref={dropdownRef}>

            {/* Table Header */}
            <div className="grid grid-cols-[72px_2.2fr_1.2fr_1.3fr_1.1fr_0.9fr_1.1fr_1.5fr] bg-[#0D0D0F] border-b border-[#232326] text-[12px] font-semibold text-[#52525B] uppercase tracking-wider divide-x divide-[#232326] h-[48px]">

              {/* Logo */}
              <div className="py-2.5" />

              {/* NAME */}
              <div className="relative px-4 flex items-center gap-2">
                <button onClick={() => handleSort("name")} className="hover:text-white transition-colors flex items-center gap-1.5">
                  NAME <SortIcon col="name" />
                </button>
                <button onClick={() => setOpenDropdown(openDropdown === "name" ? null : "name")}
                  className="hover:text-white transition-colors ml-1">
                  <FilterIcon active={nameSearch.length > 0} />
                </button>
                {openDropdown === "name" && (
                  <div className="absolute top-10 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-3 min-w-[210px]">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Filter by name..."
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { setNameSearch(nameInput); setOpenDropdown(null); setCurrentPage(1); } }}
                      className="w-full bg-[#131316] border border-[#232326] text-white text-xs rounded px-2 py-1.5 placeholder:text-[#52525B] focus:outline-none focus:border-[#6E56CF]"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => { setNameSearch(nameInput); setOpenDropdown(null); setCurrentPage(1); }}
                        className="flex-1 text-[10px] bg-[#6E56CF] hover:bg-[#7C66DF] text-white py-1.5 rounded transition-colors font-semibold">
                        Apply
                      </button>
                      {nameSearch && (
                        <button
                          onClick={() => { setNameSearch(""); setNameInput(""); setOpenDropdown(null); setCurrentPage(1); }}
                          className="flex-1 text-[10px] border border-[#232326] text-[#52525B] hover:text-white py-1.5 rounded transition-colors">
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* COMPANY */}
              <div className="px-4 flex items-center">COMPANY</div>

              {/* CATEGORY */}
              <div className="relative px-4 flex items-center gap-2">
                <span className={selectedCategory !== ALL_CATEGORIES ? "text-[#6E56CF]" : ""}>CATEGORY</span>
                <button onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
                  className="hover:text-white transition-colors">
                  <FilterIcon active={selectedCategory !== ALL_CATEGORIES} />
                </button>
                {openDropdown === "category" && (
                  <div className="absolute top-10 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-2 min-w-[200px] max-h-56 overflow-y-auto">
                    <button onClick={() => { setSelectedCategory(ALL_CATEGORIES); setCurrentPage(1); setOpenDropdown(null); }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded hover:bg-[#232326] transition-colors ${selectedCategory === ALL_CATEGORIES ? "text-[#6E56CF] font-bold" : "text-[#A1A1AA]"}`}>
                      <span>All Categories</span>
                      <span className="text-[#52525B]">{devices.length}</span>
                    </button>
                    {categories.map((c) => (
                      <button key={c} onClick={() => { setSelectedCategory(c); setCurrentPage(1); setOpenDropdown(null); }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded hover:bg-[#232326] transition-colors ${selectedCategory === c ? "text-[#6E56CF] font-bold" : "text-[#A1A1AA]"}`}>
                        <span>{c}</span>
                        <span className="text-[#52525B]">{categoryCounts[c] || 0}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* AVAILABILITY */}
              <div className="relative px-4 flex items-center gap-2">
                <button onClick={() => handleSort("availability")} className="hover:text-white transition-colors flex items-center gap-1.5">
                  AVAIL. <SortIcon col="availability" />
                </button>
                <button onClick={() => setOpenDropdown(openDropdown === "availability" ? null : "availability")}
                  className="hover:text-white transition-colors">
                  <FilterIcon active={selectedAvailability !== "All"} />
                </button>
                {openDropdown === "availability" && (
                  <div className="absolute top-10 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-2 min-w-[190px]">
                    <button onClick={() => { setSelectedAvailability("All"); setCurrentPage(1); setOpenDropdown(null); }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded hover:bg-[#232326] transition-colors ${selectedAvailability === "All" ? "text-[#6E56CF] font-bold" : "text-[#A1A1AA]"}`}>
                      <span>All</span>
                      <span className="text-[#52525B]">{devices.length}</span>
                    </button>
                    {["Available", "Pre-order", "Announced", "Discontinued"].map((a) => (
                      <button key={a} onClick={() => { setSelectedAvailability(a); setCurrentPage(1); setOpenDropdown(null); }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded hover:bg-[#232326] transition-colors ${selectedAvailability === a ? "text-[#6E56CF] font-bold" : "text-[#A1A1AA]"}`}>
                        <span>{a}</span>
                        <span className="text-[#52525B]">{availabilityCounts[a] || 0}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PRICE */}
              <div className="relative px-4 flex items-center gap-2">
                <button onClick={() => handleSort("price")} className="hover:text-white transition-colors flex items-center gap-1.5">
                  PRICE <SortIcon col="price" />
                </button>
                <button onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
                  className="hover:text-white transition-colors">
                  <FilterIcon active={activePriceFilter} />
                </button>
                {openDropdown === "price" && (
                  <div className="absolute top-10 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-4 min-w-[220px]">
                    <div className="flex justify-between text-[10px] text-[#A1A1AA] mb-3">
                      <span>Min: <span className="text-white font-bold">${priceMin.toLocaleString()}</span></span>
                      <span>Max: <span className="text-white font-bold">${priceMax.toLocaleString()}</span></span>
                    </div>
                    <div className="relative h-5 mb-4">
                      <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-[#232326] rounded-full" />
                      <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#6E56CF] rounded-full"
                        style={{ left: `${(priceMin / 10000) * 100}%`, right: `${100 - (priceMax / 10000) * 100}%` }} />
                      <input type="range" min={0} max={10000} step={10} value={priceMin}
                        onChange={(e) => { const val = Math.min(Number(e.target.value), priceMax - 10); setPriceMin(val); setActivePriceFilter(true); setCurrentPage(1); }}
                        className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: priceMin > 9000 ? 5 : 3 }} />
                      <input type="range" min={0} max={10000} step={10} value={priceMax}
                        onChange={(e) => { const val = Math.max(Number(e.target.value), priceMin + 10); setPriceMax(val); setActivePriceFilter(true); setCurrentPage(1); }}
                        className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: 4 }} />
                      <div className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
                        style={{ left: `calc(${(priceMin / 10000) * 100}% - 7px)` }} />
                      <div className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
                        style={{ left: `calc(${(priceMax / 10000) * 100}% - 7px)` }} />
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-[#232326]">
                      <button onClick={() => { setSortKey("price"); setSortDir("asc"); setCurrentPage(1); }}
                        className={`flex-1 text-[10px] px-2 py-1.5 rounded border transition-colors ${sortKey === "price" && sortDir === "asc" ? "border-[#6E56CF] text-[#6E56CF]" : "border-[#232326] text-[#A1A1AA] hover:text-white"}`}>
                        Low → High
                      </button>
                      <button onClick={() => { setSortKey("price"); setSortDir("desc"); setCurrentPage(1); }}
                        className={`flex-1 text-[10px] px-2 py-1.5 rounded border transition-colors ${sortKey === "price" && sortDir === "desc" ? "border-[#6E56CF] text-[#6E56CF]" : "border-[#232326] text-[#A1A1AA] hover:text-white"}`}>
                        High → Low
                      </button>
                    </div>
                    <button onClick={() => { setPriceMin(0); setPriceMax(10000); setActivePriceFilter(false); setCurrentPage(1); setOpenDropdown(null); }}
                      className="w-full mt-2 text-[10px] border border-[#232326] text-[#52525B] hover:text-white py-1.5 rounded transition-colors">
                      Reset
                    </button>
                  </div>
                )}
              </div>

              {/* RELEASE DATE */}
              <div className="px-4 flex items-center">
                <button onClick={() => handleSort("release")} className="text-[#6E56CF] hover:text-white transition-colors flex items-center gap-1.5">
                  RELEASE DATE <SortIcon col="release" />
                </button>
              </div>

              {/* MAIN TASK */}
              <div className="px-4 flex items-center">MAIN TASK</div>
            </div>

            {/* Rows */}
            {isLoading ? (
              <div>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-14 animate-pulse bg-[#131316]/50 border-b border-[#232326]/40" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-[#52525B] text-sm">No devices found.</div>
            ) : (
              <div>
                {visible.map((device) => (
                  <Link
                    key={device.id}
                    href={`/devices/${device.slug || device.id}`}
                    className="grid grid-cols-[72px_2.2fr_1.2fr_1.3fr_1.1fr_0.9fr_1.1fr_1.5fr] border-b border-[#232326] items-center group relative transition-colors"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = `${device.mainTaskColor || '#6E56CF'}0f`;
                      (e.currentTarget as HTMLElement).style.boxShadow = `inset 3px 0 0 ${device.mainTaskColor || '#6E56CF'}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '';
                      (e.currentTarget as HTMLElement).style.boxShadow = '';
                    }}
                  >
                    {/* Logo */}
                    <div className="py-2.5 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-xl bg-[#18181C] border border-[#2a2a2e] flex items-center justify-center overflow-hidden shadow-sm">
                        <LogoCell name={device.name} logoUrl={device.manufacturerLogoUrl} color={device.mainTaskColor} />
                      </div>
                    </div>

                    {/* Name */}
                    <div className="px-4 py-3 min-w-0">
                      <span className="font-semibold text-white text-[15px] truncate block transition-colors"
                        style={{ color: undefined }}
                        ref={(el) => {
                          if (el) {
                            const row = el.closest('a');
                            if (row) {
                              row.addEventListener('mouseenter', () => { el.style.color = device.mainTaskColor || '#6E56CF'; });
                              row.addEventListener('mouseleave', () => { el.style.color = ''; });
                            }
                          }
                        }}>
                        {device.name}
                      </span>
                    </div>

                    {/* Company */}
                    <div className="px-4 py-3 flex items-center gap-2 min-w-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2" className="shrink-0">
                        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                      <span className="text-sm text-[#A1A1AA] truncate">{device.manufacturer || "—"}</span>
                    </div>

                    {/* Category */}
                    <div className="px-4 py-3 text-sm text-[#A1A1AA] truncate">
                      {device.category || "—"}
                    </div>

                    {/* Availability */}
                    <div className="px-4 py-3">
                      {device.availability ? (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${AVAILABILITY_STYLES[device.availability] || "bg-[#232326] text-[#A1A1AA]"}`}>
                          {device.availability}
                        </span>
                      ) : <span className="text-[#52525B]">—</span>}
                    </div>

                    {/* Price */}
                    <div className="px-4 py-3 text-sm">
                      {device.price
                        ? <span className="text-white font-medium">{device.price}</span>
                        : <span className="text-[#52525B]">N/A</span>}
                    </div>

                    {/* Release Date */}
                    <div className="px-4 py-3 text-sm text-[#A1A1AA]">
                      {device.month || device.year || "—"}
                    </div>

                    {/* Main Task */}
                    <div className="px-4 py-3">
                      {device.mainTask ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap"
                          style={{ backgroundColor: `${device.mainTaskColor}33`, color: device.mainTaskColor, border: `1px solid ${device.mainTaskColor}55` }}>
                          {device.mainTask}
                        </span>
                      ) : <span className="text-[#52525B]">—</span>}
                    </div>
                  </Link>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 px-4 py-4 border-t border-[#232326]">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                      .reduce<(number | string)[]>((acc, p, i, arr) => {
                        if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === "..." ? (
                          <span key={`e-${i}`} className="text-[#52525B] text-xs px-1">...</span>
                        ) : (
                          <button key={p} onClick={() => setCurrentPage(p as number)}
                            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${currentPage === p ? "border-[#6E56CF] bg-[#6E56CF] text-white" : "border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF]"}`}>
                            {p}
                          </button>
                        )
                      )}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        </div>
      )}
    </main>
  );
}