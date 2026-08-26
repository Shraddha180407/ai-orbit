'use client';

import React, { useState, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const FILTER_OPTIONS = [
  { id: 'tools', label: 'Tools', count: 52816, color: 'bg-blue-500' },
  { id: 'devices', label: 'Devices', count: 322, color: 'bg-green-500' },
  { id: 'robots', label: 'Robots', count: 664, color: 'bg-indigo-500' },
  { id: 'news', label: 'News', count: 124, color: 'bg-yellow-500' },
  { id: 'models', label: 'Models', count: 85, color: 'bg-white' }
];

export function UnifiedFilterDropdown({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const showParam = searchParams.get('show');
  const activeFilters = showParam ? showParam.split(',') : FILTER_OPTIONS.map(f => f.id);

  const toggleFilter = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Ignore toggles if we are in 'none' state but trying to turn something off (failsafe)
    const currentFilters = activeFilters.includes('none') ? [] : activeFilters;
    
    let newFilters: string[];
    if (currentFilters.includes(id)) {
      newFilters = currentFilters.filter(f => f !== id);
    } else {
      newFilters = [...currentFilters, id];
    }

    const params = new URLSearchParams(searchParams.toString());
    
    // FIX: Explicitly set to 'none' if all toggles are disabled
    if (newFilters.length === 0) {
      params.set('show', 'none');
    } else {
      params.set('show', newFilters.join(','));
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // 200ms delay prevents the menu from snapping shut instantly
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); 
  };

  return (
    <div 
      className="relative inline-block overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button (Still clickable for mobile users) */}
      <div onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }} className="cursor-pointer">
        {children}
      </div>

      {/* The Dropdown Box */}
      {isOpen && (
        // The "pt-2" (padding-top) creates an invisible bridge so your mouse 
        // never leaves the component while moving downward!
        <div className="absolute left-0 top-full pt-2 w-56 z-[99999]">
          <div className="w-full bg-[#111113] rounded-xl border border-[#232326] p-4 flex flex-col gap-4 shadow-2xl">
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
        </div>
      )}
    </div>
  );
}