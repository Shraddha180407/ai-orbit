'use client';

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Device } from "@/lib/types";
import { fetchAllDevices } from "@/lib/api";
import { DEVICES_DATA, DeviceData } from "@/data/devices";

const ALL_CATEGORIES = "All Categories";

const AVAILABILITY_STYLES: Record<string, string> = {
  Available: "bg-[#1a3a2a] text-[#4ade80] border border-[#2a5a3a]",
  "Pre-order": "bg-[#1a2a3a] text-[#60a5fa] border border-[#2a3a5a]",
  Announced: "bg-[#2a2a1a] text-[#facc15] border border-[#4a4a2a]",
  Discontinued: "bg-[#3a1a1a] text-[#f87171] border border-[#5a2a2a]",
};

function mergeWithDummy(apiDevices: Device[]): DeviceData[] {
  if (!apiDevices || apiDevices.length === 0) return DEVICES_DATA;
  const merged = apiDevices.map((api) => {
    const dummy = DEVICES_DATA.find((d) => d.id === api.id || d.slug === api.slug);
    return {
      id: api.id,
      slug: dummy?.slug || api.slug || api.id,
      name: api.name,
      manufacturer: api.manufacturer || dummy?.manufacturer || "—",
      manufacturerSlug: dummy?.manufacturerSlug || "",
      category: api.category || dummy?.category || "Other",
      availability: api.availability || dummy?.availability || "Announced",
      price: api.price || dummy?.price || null,
      year: api.year || dummy?.year || "—",
      month: dummy?.month || api.month || api.year || "—",
      description: api.description || dummy?.description || "",
      imageUrl: api.imageUrl || dummy?.imageUrl || "",
      manufacturerLogoUrl: dummy?.manufacturerLogoUrl || "",
      mainTask: api.mainTask || dummy?.mainTask || "Device",
      mainTaskColor: dummy?.mainTaskColor || "#6E56CF",
      formFactor: api.formFactor || dummy?.formFactor || null,
      country: api.country || dummy?.country || null,
      ram: api.ram || dummy?.ram || null,
      aiFeatures: api.aiFeatures || dummy?.aiFeatures || [],
      primaryUseCases: api.primaryUseCases || dummy?.primaryUseCases || [],
      additionalInfo: api.additionalInfo || dummy?.additionalInfo || null,
      buyUrl: api.buyUrl || dummy?.buyUrl || null,
    } as DeviceData;
  });
  // Add dummy devices not matched by name or id
  const apiNames = apiDevices.map((d) => d.name.toLowerCase());
  const extraDummy = DEVICES_DATA.filter(
    (d) => !apiNames.includes(d.name.toLowerCase())
  );
  return [...merged, ...extraDummy];
}

type SortKey = "release" | "name" | "availability" | "price";

export function DevicesClient() {
  const [devices, setDevices] = useState<DeviceData[]>(DEVICES_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("release");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [activePriceFilter, setActivePriceFilter] = useState(false);


  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAllDevices()
      .then((data) => setDevices(mergeWithDummy(data || [])))
      .catch(() => setDevices(DEVICES_DATA))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(devices.map((d) => d.category).filter(Boolean)));
    return [ALL_CATEGORIES, ...cats.sort()];
  }, [devices]);

  const filtered = useMemo(() => {
    let list = [...devices];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.manufacturer?.toLowerCase().includes(q) ||
          d.category?.toLowerCase().includes(q)
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
      }
      else cmp = (b.year || "").localeCompare(a.year || "");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [devices, search, selectedCategory, selectedAvailability, sortKey, sortDir, priceMin, priceMax, activePriceFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);


  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-[#3a3a3a]"> ↕</span>;
    return <span className="text-[#6E56CF]">{sortDir === "desc" ? " ↓" : " ↑"}</span>;
  }

  return (
    <main className="mx-auto max-w-[1400px] px-4 md:px-8 py-10 flex-1 w-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Devices</h1>
        <p className="text-sm text-[#71717A] mt-1">
          Total devices{" "}
          <span className="text-white font-semibold">{isLoading ? "…" : filtered.length}</span>
          {"  ·  "}Categories{" "}
          <span className="text-white font-semibold">{isLoading ? "…" : categories.length - 1}</span>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <input
          type="text"
          placeholder="Search devices..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); setSelectedAvailability("All"); }}
          className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 w-56 placeholder:text-[#52525B] focus:outline-none focus:border-[#6E56CF]"
        />
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
          className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6E56CF]"
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={selectedAvailability}
          onChange={(e) => { setSelectedAvailability(e.target.value); setCurrentPage(1); }}
          className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6E56CF]"
        >
          {["All", "Available", "Pre-order", "Announced", "Discontinued"].map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg border transition-colors ${viewMode === "list" ? "border-[#6E56CF] bg-[#6E56CF]/10 text-[#6E56CF]" : "border-[#232326] text-[#52525B] hover:text-white"}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg border transition-colors ${viewMode === "grid" ? "border-[#6E56CF] bg-[#6E56CF]/10 text-[#6E56CF]" : "border-[#232326] text-[#52525B] hover:text-white"}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {isLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-[#131316] rounded-xl border border-[#232326]" />
            ))
          ) : visible.map((device) => (
            <Link
              key={device.id}
              href={`/devices/${device.slug || device.id}`}
              className="rounded-xl border border-[#232326] bg-[#0D0D0F] hover:border-[#6E56CF]/40 transition-all group overflow-hidden"
            >
              <div className="relative h-44 bg-[#18181C] flex items-center justify-center overflow-hidden">
                {device.imageUrl ? (
                  <img src={device.imageUrl} alt={device.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <span className="text-4xl font-black text-white uppercase">{device.name.charAt(0)}</span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm font-bold text-white truncate">{device.name}</p>
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
      )}

      {/* Table */}
      {viewMode === "list" && <div className="rounded-xl border border-[#232326] overflow-x-auto">
        <div className="min-w-[1100px]">
        {/* Table Header */}
        <div ref={dropdownRef} className="grid grid-cols-[48px_44px_1fr_180px_160px_120px_100px_130px_120px] gap-3 px-4 py-2.5 bg-[#0D0D0F] border-b border-[#232326] text-[11px] font-semibold text-[#52525B] uppercase tracking-wider select-none relative">
          <div>ID</div>
          <div></div>

          {/* NAME */}
          <div className="flex items-center gap-1">
            <button className="hover:text-white transition-colors" onClick={() => handleSort("name")}>
              NAME <SortIcon col="name" />
            </button>
          </div>

          {/* COMPANY */}
          <div>COMPANY</div>

          {/* CATEGORY with filter */}
          <div className="relative flex items-center gap-1">
            <span>CATEGORY</span>
            <button onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
              className="hover:text-white transition-colors">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
            </button>
            {openDropdown === "category" && (
              <div className="absolute top-6 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-2 min-w-[160px] max-h-48 overflow-y-auto">
                {categories.map((c) => (
                  <button key={c} onClick={() => { setSelectedCategory(c); setCurrentPage(1); setOpenDropdown(null); }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded hover:bg-[#232326] transition-colors ${selectedCategory === c ? "text-[#6E56CF] font-bold" : "text-[#A1A1AA]"}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AVAILABILITY with filter */}
          <div className="relative flex items-center gap-1">
            <button className="hover:text-white transition-colors" onClick={() => handleSort("availability")}>
              AVAILABILITY <SortIcon col="availability" />
            </button>
            <button onClick={() => setOpenDropdown(openDropdown === "availability" ? null : "availability")}
              className="hover:text-white transition-colors">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
            </button>
            {openDropdown === "availability" && (
              <div className="absolute top-6 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-2 min-w-[160px]">
                {["All", "Available", "Pre-order", "Announced", "Discontinued"].map((a) => (
                  <button key={a} onClick={() => { setSelectedAvailability(a); setCurrentPage(1); setOpenDropdown(null); }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded hover:bg-[#232326] transition-colors ${selectedAvailability === a ? "text-[#6E56CF] font-bold" : "text-[#A1A1AA]"}`}>
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRICE with slider */}
          <div className="relative flex items-center gap-1">
            <button className="hover:text-white transition-colors flex items-center gap-1" onClick={() => handleSort("price")}>
              PRICE <SortIcon col="price" />
            </button>
            <button onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
              className={`hover:text-white transition-colors ${activePriceFilter ? "text-[#6E56CF]" : ""}`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
            </button>
            {openDropdown === "price" && (
              <div className="absolute top-6 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-4 min-w-[240px]">
                <div className="flex justify-between text-[10px] text-[#A1A1AA] mb-4">
                  <span>Min: <span className="text-white font-bold">${priceMin.toLocaleString()}</span></span>
                  <span>Max: <span className="text-white font-bold">${priceMax.toLocaleString()}</span></span>
                </div>

                {/* Dual range slider */}
                <div className="relative h-5 mb-4">
                  {/* Track background */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-[#232326] rounded-full" />
                  {/* Active track */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#6E56CF] rounded-full"
                    style={{
                      left: `${(priceMin / 10000) * 100}%`,
                      right: `${100 - (priceMax / 10000) * 100}%`,
                    }}
                  />
                  {/* Min thumb */}
                  <input
                    type="range" min={0} max={10000} step={10}
                    value={priceMin}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), priceMax - 10);
                      setPriceMin(val);
                      setActivePriceFilter(true);
                      setCurrentPage(1);
                    }}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: priceMin > 9000 ? 5 : 3 }}
                  />
                  {/* Max thumb */}
                  <input
                    type="range" min={0} max={10000} step={10}
                    value={priceMax}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), priceMin + 10);
                      setPriceMax(val);
                      setActivePriceFilter(true);
                      setCurrentPage(1);
                    }}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 4 }}
                  />
                  {/* Min handle dot */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
                    style={{ left: `calc(${(priceMin / 10000) * 100}% - 7px)` }}
                  />
                  {/* Max handle dot */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-[#6E56CF] rounded-full border-2 border-white pointer-events-none"
                    style={{ left: `calc(${(priceMax / 10000) * 100}% - 7px)` }}
                  />
                </div>

                {/* Sort buttons */}
                <div className="flex gap-2 pt-3 border-t border-[#232326]">
                  <button onClick={() => { setSortKey("price"); setSortDir("asc"); setCurrentPage(1); }}
                    className={`flex-1 text-[10px] px-2 py-1.5 rounded transition-colors border ${sortKey === "price" && sortDir === "asc" ? "border-[#6E56CF] text-[#6E56CF]" : "border-[#232326] text-[#A1A1AA] hover:text-white"}`}>
                    Low → High
                  </button>
                  <button onClick={() => { setSortKey("price"); setSortDir("desc"); setCurrentPage(1); }}
                    className={`flex-1 text-[10px] px-2 py-1.5 rounded transition-colors border ${sortKey === "price" && sortDir === "desc" ? "border-[#6E56CF] text-[#6E56CF]" : "border-[#232326] text-[#A1A1AA] hover:text-white"}`}>
                    High → Low
                  </button>
                </div>

                <button onClick={() => {
                  setPriceMin(0); setPriceMax(10000);
                  setActivePriceFilter(false); setCurrentPage(1); setOpenDropdown(null);
                }} className="w-full mt-2 text-[10px] border border-[#232326] text-[#52525B] hover:text-white px-2 py-1.5 rounded transition-colors">
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* RELEASE DATE */}
          <button className="text-left hover:text-white transition-colors text-[#6E56CF] flex items-center gap-1" onClick={() => handleSort("release")}>
            RELEASE DATE <SortIcon col="release" />
          </button>

          {/* MAIN TASK */}
          <div>MAIN TASK</div>
        </div>

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
            {visible.map((device, idx) => (
              <Link
                key={device.id}
                href={`/devices/${device.slug || device.id}`}
                className="grid grid-cols-[48px_44px_1fr_180px_160px_120px_100px_130px_120px] gap-3 px-4 py-3 border-b border-[#232326]/40 hover:bg-[#131316]/60 transition-colors items-center group"
              >
                <div className="text-xs text-[#52525B] font-mono">{idx + 1}</div>

                <div className="h-9 w-9 rounded-md bg-[#18181C] border border-[#232326] flex items-center justify-center shrink-0 overflow-hidden">
                  {device.manufacturerLogoUrl ? (
                    <img src={device.manufacturerLogoUrl} alt={device.manufacturer} className="h-6 w-6 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(device.name)}&background=232326&color=fff&size=36&bold=true&length=1`; }} />
                  ) : (
                    <span className="text-xs font-bold text-white uppercase">{device.name.charAt(0)}</span>
                  )}
                </div>

                <div className="min-w-0 flex items-center">
                  <div className="font-semibold text-white text-sm truncate group-hover:text-[#6E56CF] transition-colors">
                    {device.name}
                  </div>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  <span className="text-sm text-[#A1A1AA] truncate">{device.manufacturer || "—"}</span>
                </div>

                <div className="text-sm text-[#A1A1AA] truncate flex items-center">{device.category || "—"}</div>

                <div className="flex items-center">
                  {device.availability ? (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${AVAILABILITY_STYLES[device.availability] || "bg-[#232326] text-[#A1A1AA]"}`}>
                      {device.availability}
                    </span>
                  ) : <span className="text-[#52525B]">—</span>}
                </div>

                <div className="text-sm flex items-center">
                  {device.price ? <span className="text-white font-medium">{device.price}</span> : <span className="text-[#52525B]">N/A</span>}
                </div>

                <div className="text-sm text-[#A1A1AA] flex items-center">{device.month || device.year || "—"}</div>

                <div className="flex items-center">
                  {device.mainTask ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${device.mainTaskColor}33`, color: device.mainTaskColor, border: `1px solid ${device.mainTaskColor}55` }}>
                      {device.mainTask}
                    </span>
                  ) : <span className="text-[#52525B]">—</span>}
                </div>
              </Link>
            ))}

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
                      <span key={`ellipsis-${i}`} className="text-[#52525B] text-xs px-1">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          currentPage === p
                            ? "border-[#6E56CF] bg-[#6E56CF] text-white"
                            : "border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF]"
                        }`}
                      >
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
      </div>}
    </main>
  );
}