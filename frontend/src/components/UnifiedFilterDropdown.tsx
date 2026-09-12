'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const FILTER_OPTIONS = [
  { id: 'tools', label: 'Tools', count: 52816, color: 'bg-blue-500' },
  { id: 'companies', label: 'Companies', count: 890, color: 'bg-teal-500' },
  { id: 'videos', label: 'Videos', count: 1240, color: 'bg-red-500' },
  { id: 'repositories', label: 'Repositories', count: 412, color: 'bg-purple-500' },
  { id: 'devices', label: 'Devices', count: 322, color: 'bg-green-500' },
  { id: 'robots', label: 'Robots', count: 664, color: 'bg-indigo-500' },
  { id: 'news', label: 'News', count: 124, color: 'bg-yellow-500' },
  { id: 'models', label: 'Models', count: 85, color: 'bg-white' }
];

export function UnifiedFilterDropdown({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const showParam = searchParams.get('show');
  const activeFilters = showParam ? showParam.split(',') : FILTER_OPTIONS.map(f => f.id);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const left = Math.max(16, Math.min(rect.left, window.innerWidth - 256));
      setCoords({
        top: rect.bottom + 8,
        left,
      });
    }
  };

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
    updatePosition();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); 
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    updatePosition();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleScrollOrResize = () => updatePosition();
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement)?.closest(".unified-dropdown-popover")
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div 
      ref={containerRef}
      className="relative shrink-0 flex items-stretch"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button (Clickable on desktop/mobile) */}
      <div onClick={toggleDropdown} className="cursor-pointer flex items-stretch">
        {children}
      </div>

      {/* The Dropdown Box via Portal */}
      {mounted && isOpen && createPortal(
        <div 
          className="unified-dropdown-popover fixed z-[99999] w-60 max-w-[calc(100vw-32px)] animate-fadeIn"
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="w-full bg-[#111113] rounded-xl border border-[#232326] p-4 flex flex-col gap-4 shadow-2xl backdrop-blur-md">
            <p className="text-[10px] font-bold tracking-widest text-[#A1A1AA] uppercase">Show</p>
            {FILTER_OPTIONS.map((option) => {
              const isActive = activeFilters.includes(option.id);
              return (
                <div key={option.id} className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-white">{option.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-[#A1A1AA]">{option.count}</span>
                    <button
                      type="button"
                      onClick={(e) => toggleFilter(option.id, e)}
                      aria-label={`Toggle ${option.label}`}
                      aria-pressed={isActive}
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
        </div>,
        document.body
      )}
    </div>
  );
}
