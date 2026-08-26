"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";


const FILTER_OPTIONS = [
  { id: 'tools', label: 'Tools', count: 52816, color: 'bg-blue-500' },
  { id: 'devices', label: 'Devices', count: 322, color: 'bg-green-500' },
  { id: 'robots', label: 'Robots', count: 664, color: 'bg-indigo-500' },
  { id: 'news', label: 'News', count: 124, color: 'bg-yellow-500' },
  { id: 'models', label: 'Models', count: 85, color: 'bg-white' }
];

export function CategoryNav() {
  const [activeCategory, setActiveCategory] = useState("New");
  // Simple, pure boolean state for the dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const showParam = searchParams.get('show');
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

    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.length === 0) params.delete('show');
    else params.set('show', newFilters.join(','));
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const CATEGORIES = [
    { name: "AI Tools", href: "#tools" },
    { name: "Models", href: "/models", isPageLink: true },
    { name: "Companies", href: "/companies", isPageLink: true },
    { name: "Repositories", href: "/repositories", isPageLink: true },
    { name: "News", href: "/news", isPageLink: true },
    { name: "Videos", href: "/videos", isPageLink: true },
    { name: "Agents", href: "/tools?category=agents", isPageLink: true },
  ];

  return (
    // Explicit overflow-visible added to prevent clipping
    <div className="w-full border-b border-[#232326]/40 bg-[#000000] py-4 sticky top-navbar z-[9999] select-none overflow-visible">
      <div className="mx-auto max-w-[1440px] px-8 overflow-visible">
        
        <div className="flex flex-nowrap gap-2 items-center w-full relative overflow-visible">
          
          {/* ✨ NEW BUTTON & CLICK DROPDOWN ✨ */}
          <div className="shrink-0 relative overflow-visible">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 h-[30px] text-[11px] font-semibold border transition-all duration-200 active:scale-95 whitespace-nowrap bg-[#18181C] border-[#6E56CF] text-white shadow-[0_0_10px_rgba(110,86,207,0.15)]"
            >
              <span className="text-[#6E56CF] text-[12px]">✨</span> New
            </button>

            {/* THE DROPDOWN BOX (Pure CSS positioning, no animations to break) */}
            {isDropdownOpen && (
              <div 
                className="absolute left-0 top-[40px] w-56 bg-[#111113] rounded-xl border border-[#232326] p-4 flex flex-col gap-4 shadow-2xl z-[99999]"
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
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
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
          <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-none pb-1 w-full items-center">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.name;
              const className = `inline-flex items-center rounded-lg px-3.5 h-[30px] text-[11px] font-semibold border transition-all duration-200 active:scale-95 whitespace-nowrap ${
                isActive
                  ? "bg-white text-[#000000] border-transparent shadow-sm"
                  : "bg-transparent border-[#232326] text-[#A1A1AA] hover:border-neutral-500 hover:text-white"
              }`;

              if (cat.isPageLink) {
                return (
                  <Link key={cat.name} href={cat.href} className={className}>
                    <span>{cat.name}</span>
                  </Link>
                );
              }

              return (
                <a
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setActiveCategory(cat.name)}
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