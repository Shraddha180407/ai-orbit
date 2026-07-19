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
  // Add dummy devices not in API
  const apiIds = apiDevices.map((d) => d.id);
  const extraDummy = DEVICES_DATA.filter((d) => !apiIds.includes(d.id));
  return [...merged, ...extraDummy];
}

type SortKey = "release" | "name" | "availability";

export function DevicesClient() {
  const [devices, setDevices] = useState<DeviceData[]>(DEVICES_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(50);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [sortKey, setSortKey] = useState<SortKey>("release");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const sentinelRef = useRef<HTMLDivElement>(null);

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
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "availability") cmp = (a.availability || "").localeCompare(b.availability || "");
      else cmp = (b.year || "").localeCompare(a.year || "");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [devices, search, selectedCategory, sortKey, sortDir]);

  const visible = filtered.slice(0, visibleCount);

  useEffect(() => {
    if (isLoading || visibleCount >= filtered.length) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisibleCount((v) => v + 50); },
      { threshold: 0.1 }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [isLoading, visibleCount, filtered.length]);

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
          onChange={(e) => { setSearch(e.target.value); setVisibleCount(50); }}
          className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 w-56 placeholder:text-[#52525B] focus:outline-none focus:border-[#6E56CF]"
        />
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setVisibleCount(50); }}
          className="bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6E56CF]"
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#232326] overflow-x-auto">
        <div className="min-w-[1100px]">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[48px_44px_1fr_180px_160px_120px_100px_130px_120px] gap-3 px-4 py-2.5 bg-[#0D0D0F] border-b border-[#232326] text-[11px] font-semibold text-[#52525B] uppercase tracking-wider select-none">
          <div>ID</div>
          <div></div>
          <button className="text-left hover:text-white transition-colors" onClick={() => handleSort("name")}>
            NAME <SortIcon col="name" />
          </button>
          <div>COMPANY</div>
          <div>CATEGORY</div>
          <button className="text-left hover:text-white transition-colors" onClick={() => handleSort("availability")}>
            AVAILABILITY <SortIcon col="availability" />
          </button>
          <div>PRICE</div>
          <button className="text-left hover:text-white transition-colors text-[#6E56CF]" onClick={() => handleSort("release")}>
  RELEASE DATE <SortIcon col="release" />
</button>
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
                className="flex md:grid md:grid-cols-[48px_44px_1fr_180px_160px_120px_100px_130px_120px] gap-3 px-4 py-3 border-b border-[#232326]/40 hover:bg-[#131316]/60 transition-colors items-center group"
              >
                {/* ID */}
                <div className="hidden md:block text-xs text-[#52525B] font-mono">{idx + 1}</div>

                {/* Thumbnail */}
<div className="h-9 w-9 rounded-md bg-[#18181C] border border-[#232326] flex items-center justify-center shrink-0 overflow-hidden">
  {device.manufacturerLogoUrl ? (
    <img
      src={device.manufacturerLogoUrl}
      alt={device.manufacturer}
      className="h-6 w-6 object-contain"
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(device.name)}&background=232326&color=fff&size=36&bold=true&length=1`;
      }}
    />
  ) : (
    <span className="text-xs font-bold text-white uppercase">{device.name.charAt(0)}</span>
  )}
</div>

                {/* Name + description */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white text-sm truncate group-hover:text-[#6E56CF] transition-colors">
                    {device.name}
                  </div>
              
                </div>

                {/* Company */}
<div className="hidden md:flex items-center gap-2 min-w-0">
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
  <span className="text-sm text-[#A1A1AA] truncate">{device.manufacturer || "—"}</span>
</div>

                {/* Category */}
                <div className="hidden md:block text-sm text-[#A1A1AA] truncate">
                  {device.category || "—"}
                </div>

                {/* Availability */}
                <div className="hidden md:block">
                  {device.availability ? (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${AVAILABILITY_STYLES[device.availability] || "bg-[#232326] text-[#A1A1AA]"}`}>
                      {device.availability}
                    </span>
                  ) : <span className="text-[#52525B]">—</span>}
                </div>

                {/* Price */}
                <div className="hidden md:block text-sm">
                  {device.price
                    ? <span className="text-white font-medium">{device.price}</span>
                    : <span className="text-[#52525B]">N/A</span>}
                </div>

                {/* Release Date */}
<div className="hidden md:block text-sm text-[#A1A1AA]">
  {device.month || device.year || "—"}
</div>

{/* Main Task */}
<div className="hidden md:block">
  {device.mainTask ? (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded"
      style={{ backgroundColor: `${device.mainTaskColor}33`, color: device.mainTaskColor, border: `1px solid ${device.mainTaskColor}55` }}
    >
      {device.mainTask}
    </span>
  ) : <span className="text-[#52525B]">—</span>}
</div>

              </Link>
            ))}

            {visibleCount < filtered.length && (
              <div ref={sentinelRef} className="h-16 flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </main>
  );
}