'use client';

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Device, DeviceSubCategory } from "@/lib/types";
import { fetchAllDevices } from "@/lib/api";
import { DEVICES_DATA, DeviceData, getMainTaskColor } from "@/data/devices";
import Flame    from 'lucide-react/dist/esm/icons/flame';
import Wrench      from 'lucide-react/dist/esm/icons/wrench';
import Building2   from 'lucide-react/dist/esm/icons/building-2';
import BrainCircuit from 'lucide-react/dist/esm/icons/brain-circuit';
import Newspaper   from 'lucide-react/dist/esm/icons/newspaper';
import Video       from 'lucide-react/dist/esm/icons/video';
import GitBranch   from 'lucide-react/dist/esm/icons/git-branch';
import Layers      from 'lucide-react/dist/esm/icons/layers';
import ListChecks  from 'lucide-react/dist/esm/icons/list-checks';
import Bot         from 'lucide-react/dist/esm/icons/bot';
import Cpu         from 'lucide-react/dist/esm/icons/cpu';
import Plug        from 'lucide-react/dist/esm/icons/plug';
import FolderHeart from 'lucide-react/dist/esm/icons/folder-heart';
import UserCircle  from 'lucide-react/dist/esm/icons/user-circle';
import Palette     from 'lucide-react/dist/esm/icons/palette';
import Smartphone  from 'lucide-react/dist/esm/icons/smartphone';
import Star     from 'lucide-react/dist/esm/icons/star';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Gift     from 'lucide-react/dist/esm/icons/gift';
import Trophy   from 'lucide-react/dist/esm/icons/trophy';

const ALL_CATEGORIES = "All Categories";

const DEVICE_SUBCATEGORIES = [
  "AI PCs",
  "Smartphones",
  "Smart Home",
  "Wearables",
  "AI Cameras",
  "Audio",
  "AR/VR",
  "Edge AI",
  "Robotics Hardware",
  "Medical",
  "Development Boards",
  "Smart Sensors",
  "Automotive AI Devices",
  "Microphones",
  "Farming",
];

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
const COL_TEMPLATE = "grid-cols-[40px_minmax(200px,2.4fr)_minmax(120px,1.2fr)_minmax(120px,1.3fr)_minmax(80px,0.8fr)_minmax(100px,1.1fr)_minmax(90px,0.9fr)_minmax(110px,1.1fr)_minmax(160px,1.8fr)] sm:grid-cols-[40px_minmax(200px,2.4fr)_minmax(120px,1.2fr)_minmax(120px,1.3fr)_minmax(80px,0.8fr)_minmax(100px,1.1fr)_minmax(90px,0.9fr)_minmax(110px,1.1fr)_minmax(160px,1.8fr)_80px]";
const COL_MIN_WIDTH = "min-w-[1050px]";

const COLUMN_HEADERS = [
  { label: "TOOL" },
  { label: "NAME" },
  { label: "COMPANY" },
  { label: "CATEGORY" },
  { label: "COUNTRY" },
  { label: "AVAIL." },
  { label: "PRICE" },
  { label: "RELEASE DATE" },
  { label: "MAIN TASK" },
];

export function DevicesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const [bookmarked, setBookmarked] = React.useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  function toggleBookmark(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleShare(e: React.MouseEvent, device: DeviceData) {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/devices/${device.slug || device.id}`;
    if (navigator.share) {
      navigator.share({ title: device.name, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  }

  useEffect(() => {
    fetchAllDevices({})
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
    if (selectedCategory !== ALL_CATEGORIES) {
  list = list.filter((d) => {
    const sel = selectedCategory.toLowerCase();
    // Build a searchable text blob from multiple fields
    const searchable = [
      d.category || "",
      d.name || "",
      d.description || "",
      d.mainTask || "",
      d.formFactor || "",
      ...(d.aiFeatures || []),
      ...(d.primaryUseCases || []),
    ].join(" ").toLowerCase();

    const keywords: Record<string, string[]> = {
      "ai pcs": ["pc", "laptop", "computer", "chromebook", "desktop", "notebook", "ai pc"],
      "smartphones": ["smartphone", "phone", "mobile", "iphone", "android", "pixel", "galaxy", "lumia", "blackberry", "xperia", "pinephone"],
      "smart home": ["smart home", "home automation", "thermostat", "smart speaker", "echo", "nest", "alexa", "hub", "smart plug", "smart meter", "smart display", "homepod", "smartthings"],
      "wearables": ["wearable", "smartwatch", "watch", "ring", "fitness", "band", "pendant", "glasses", "eyewear", "pin", "clip", "smart glasses"],
      "ai cameras": ["camera", "surveillance", "vision", "facial", "ai camera"],
      "audio": ["audio", "headphone", "earbud", "speaker", "microphone", "mic", "sound", "voice recorder"],
      "ar/vr": ["ar", "vr", "augmented", "virtual reality", "mixed reality", "headset", "spatial", "xr", "webxr", "reality labs"],
      "edge ai": ["edge ai", "edge ai hardware", "iot", "embedded", "accelerator", "fpga", "soc", "microcontroller", "neural processing unit", "npu", "tpu", "gpu", "tensor processing"],
      "robotics hardware": ["robot", "robotics", "actuator", "lego mindstorms", "drone", "robotic"],
      "medical": ["medical", "health", "diagnostics", "clinical", "wellness", "prosthesis", "medtronic", "abbott"],
      "development boards": ["development board", "raspberry pi", "jetson", "arduino", "odroid", "banana pi", "nodemcu", "esp32", "esp8266", "risc-v", "rockchip", "allwinner"],
      "smart sensors": ["sensor", "smart sensor", "environmental", "motion sensor"],
      "automotive ai devices": ["automotive", "dashcam", "navigation", "autopilot", "self-driving", "lane centering", "tesla autopilot", "nvidia drive"],
      "microphones": ["microphone", "mic", "voice recorder", "transcription", "recording", "plaud"],
      "farming": ["farming", "agriculture", "digital agriculture", "precision farming"],
    };

    const keywordList = keywords[sel] || [sel];
    return keywordList.some((kw) => searchable.includes(kw));
  });
}
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
            <span>Min: <span className="text-white font-bold">${priceMin.toLocaleString("en-US")}</span></span>
            <span>Max: <span className="text-white font-bold">${priceMax.toLocaleString("en-US")}</span></span>
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
    <div className="w-full flex-1 flex flex-col">
      {/* ── SUBCATEGORY PILLS ── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden justify-start lg:justify-center">
          <button
            onClick={() => { setSelectedCategory(ALL_CATEGORIES); setCurrentPage(1); }}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              selectedCategory === ALL_CATEGORIES
                ? "bg-[#6E56CF] border-[#6E56CF] text-white"
                : "bg-transparent border-[#232326] text-[#A1A1AA] hover:border-[#52525B] hover:text-white"
            }`}
          >
            All
          </button>
          {DEVICE_SUBCATEGORIES.map((sub) => (
            <button
              key={sub}
              onClick={() => { setSelectedCategory(sub); setCurrentPage(1); }}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                selectedCategory === sub
                  ? "bg-[#6E56CF] border-[#6E56CF] text-white"
                  : "bg-transparent border-[#232326] text-[#A1A1AA] hover:border-[#52525B] hover:text-white"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* ── LIST VIEW ── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-8">
          {/*  Outer container matches ToolListView exactly */}
          <div className="overflow-x-auto rounded-lg border border-[#232326]/60 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#131316] [&::-webkit-scrollbar-thumb]:bg-[#6E56CF]/40 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div ref={dropdownRef} style={{ minWidth: '1150px' }} className="relative bg-[#000000]">

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

                    {/* COUNTRY col */}
                    <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">COUNTRY</span>

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
                            <span>Min: <span className="text-white font-bold">${priceMin.toLocaleString("en-US")}</span></span>
                            <span>Max: <span className="text-white font-bold">${priceMax.toLocaleString("en-US")}</span></span>
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
                    <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] sm:pr-0 pr-4">MAIN TASK</span>

                    {/* ACTIONS col */}
                    <span className="hidden sm:block text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">ACTIONS</span>
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
                        <div className="h-3 w-14 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-4 w-16 animate-pulse rounded-full bg-[#18181C]" />
                        <div className="h-3 w-12 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-3 w-16 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-4 w-20 animate-pulse rounded-md bg-[#18181C]" />
                        <div className="h-4 w-12 animate-pulse rounded-md bg-[#18181C]" />
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

                        {/* Col 5: Country */}
                        <div className="text-[12px] font-mono text-[#A1A1AA]">
                          {device.country || "—"}
                        </div>

                        {/* Col 6: Availability */}
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
<div className="sm:pr-0 pr-4">
  {device.mainTask ? (
    <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2.5 py-0.5 text-[11px] font-mono font-semibold text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors whitespace-nowrap">
      {device.mainTask}
    </span>
  ) : <span className="text-[12px] font-mono text-[#71717A]">—</span>}
</div>

                        {/* Col 9: Actions */}
                        <div className="hidden sm:flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                          <button
                            onClick={(e) => toggleBookmark(e, device.id)}
                            className={`p-1.5 rounded-md transition-colors ${bookmarked.has(device.id) ? "text-[#6E56CF]" : "text-[#52525B] hover:text-white"}`}
                            title="Bookmark"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked.has(device.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                            </svg>
                          </button>
                          <button
                            onClick={(e) => handleShare(e, device)}
                            className="p-1.5 rounded-md text-[#52525B] hover:text-white transition-colors"
                            title="Share"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                            </svg>
                          </button>
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
    </div>
  );
}
