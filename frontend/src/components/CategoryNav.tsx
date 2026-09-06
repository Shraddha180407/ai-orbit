"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { scrollChipIntoView } from "@/lib/utils";


const FILTER_OPTIONS = [
  { id: 'tools', label: 'Tools', count: 52816, color: 'bg-blue-500' },
  { id: 'devices', label: 'Devices', count: 322, color: 'bg-green-500' },
  { id: 'robots', label: 'Robots', count: 664, color: 'bg-indigo-500' },
  { id: 'news', label: 'News', count: 124, color: 'bg-yellow-500' },
  { id: 'models', label: 'Models', count: 85, color: 'bg-white' }
];

const CATEGORIES = [
  { name: "AI Tools", href: "#tools" },
  { name: "Models", href: "/models", isPageLink: true },
  { name: "Companies", href: "/companies", isPageLink: true },
  { name: "Repositories", href: "/repositories", isPageLink: true },
  { name: "News", href: "/news", isPageLink: true },
  { name: "Collections", href: "/tools", isPageLink: true },
  { name: "Videos", href: "/videos", isPageLink: true },
  { name: "Agents", href: "/tools?category=agents", isPageLink: true },
];

export function CategoryNav() {
  const [activeCategory, setActiveCategory] = useState("AI Tools");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  let pathname = "";
  let searchParams: ReturnType<typeof useSearchParams> | null = null;
  let router: ReturnType<typeof useRouter> | null = null;

  try {
    pathname = usePathname() || "";
    searchParams = useSearchParams();
    router = useRouter();
  } catch {}

  useEffect(() => {
    if (!pathname) return;
    if (pathname === "/models") setActiveCategory("Models");
    else if (pathname === "/companies") setActiveCategory("Companies");
    else if (pathname === "/repositories") setActiveCategory("Repositories");
    else if (pathname === "/news") setActiveCategory("News");
    else if (pathname === "/videos") setActiveCategory("Videos");
    else if (pathname === "/tools" && searchParams?.get("category") === "agents") setActiveCategory("Agents");
    else if (pathname === "/" || pathname === "/tools") setActiveCategory("AI Tools");
  }, [pathname, searchParams]);

  const scrollToActive = (smooth = true) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const activeIdx = CATEGORIES.findIndex((c) => c.name === activeCategory);
    if (activeIdx === -1) return;
    const target = itemRefs.current[activeIdx];
    if (!target) return;

    scrollChipIntoView(container, target, smooth);
  };



  const showParam = searchParams ? searchParams.get('show') : null;
  const activeFilters = showParam ? showParam.split(',') : FILTER_OPTIONS.map(f => f.id);

  const toggleFilter = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let newFilters: string[];
    if (activeFilters.includes(id)) {
      newFilters = activeFilters.filter(f => f !== id);
    } else {
      newFilters = [...activeFilters, id];
    }

    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (newFilters.length === 0) params.delete('show');
    else params.set('show', newFilters.join(','));
    
    if (router) {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <div className="w-full border-b border-[#232326]/40 bg-[#000000] py-3 sm:py-4 sticky top-navbar z-30 select-none max-w-full overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-8">
        
        <div className="flex flex-nowrap gap-2 items-center w-full relative">
          
          {/* ✨ NEW BUTTON & CLICK DROPDOWN ✨ */}
          <div className="shrink-0 relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 h-[30px] text-[11px] font-semibold border transition-all duration-200 active:scale-95 whitespace-nowrap bg-[#18181C] border-[#6E56CF] text-white shadow-[0_0_10px_rgba(110,86,207,0.15)] cursor-pointer"
            >
              <span className="text-[#6E56CF] text-[12px]">✨</span> New
            </button>

            {/* THE DROPDOWN BOX */}
            {isDropdownOpen && (
              <div 
                className="absolute left-0 top-[40px] w-60 max-w-[calc(100vw-32px)] bg-[#111113] rounded-xl border border-[#232326] p-4 flex flex-col gap-4 shadow-2xl z-[99999]"
              >
                <h3 className="text-[10px] font-bold tracking-widest text-[#71717A] uppercase">Show</h3>
                {FILTER_OPTIONS.map((option) => {
                  const isActive = activeFilters.includes(option.id);
                  return (
                    <div key={option.id} className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-white">{option.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-[#71717A]">{option.count}</span>
                        <button
                          type="button"
                          onClick={(e) => toggleFilter(option.id, e)}
                          aria-label={`Toggle ${option.label}`}
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                            isActive ? option.color : 'bg-[#232326]'
                          }`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ${
                            isActive ? 'translate-x-4' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scrollable Container for the rest of the categories */}
          <div
            ref={scrollContainerRef}
            className="flex flex-nowrap gap-1.5 sm:gap-2 touch-scroll-x scrollbar-none pb-1 min-w-0 flex-1 w-full items-center overflow-x-auto scroll-smooth"
          >
            {CATEGORIES.map((cat, idx) => {
              const isActive = activeCategory === cat.name;
              const className = `inline-flex items-center rounded-lg px-3.5 h-[30px] text-[11px] font-semibold border transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? "bg-white text-[#000000] border-transparent shadow-sm"
                  : "bg-transparent border-[#232326] text-[#A1A1AA] hover:border-neutral-500 hover:text-white"
              }`;

              if (cat.isPageLink) {
                return (
                  <Link
                    key={cat.name}
                    ref={(el) => { itemRefs.current[idx] = el; }}
                    href={cat.href}
                    className={className}
                    onClick={() => {
                      setActiveCategory(cat.name);
                      setTimeout(() => scrollToActive(true), 50);
                    }}
                  >
                    <span>{cat.name}</span>
                  </Link>
                );
              }

              return (
                <a
                  key={cat.name}
                  ref={(el) => { itemRefs.current[idx] = el; }}
                  href={cat.href}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setTimeout(() => scrollToActive(true), 50);
                  }}
                  className={className}
                >
                  <span>{cat.name}</span>
                </a>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}