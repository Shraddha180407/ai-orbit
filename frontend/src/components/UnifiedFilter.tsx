'use client';

import React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const FILTER_OPTIONS = [
  { id: 'tools', label: 'Tools', count: 52816 },
  { id: 'devices', label: 'Devices', count: 322 },
  { id: 'robots', label: 'Robots', count: 664 },
  { id: 'news', label: 'News', count: 124 }
];

export function UnifiedFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const showParam = searchParams.get('show');
  const activeFilters = showParam ? showParam.split(',') : FILTER_OPTIONS.map(f => f.id);

  const toggleFilter = (id: string) => {
    let newFilters: string[];
    
    if (activeFilters.includes(id)) {
      newFilters = activeFilters.filter(f => f !== id);
    } else {
      newFilters = [...activeFilters, id];
    }

    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.length === 0) {
      params.delete('show');
    } else {
      params.set('show', newFilters.join(','));
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full bg-[#111113] rounded-xl border border-[#232326] p-4 flex flex-col gap-3">
      <h3 className="text-[10px] font-bold tracking-widest text-[#71717A] uppercase mb-1">Show</h3>
      
      {FILTER_OPTIONS.map((option) => {
        const isActive = activeFilters.includes(option.id);
        
        return (
          <div key={option.id} className="flex items-center justify-between group">
            <span className="text-[13px] font-semibold text-white">{option.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#71717A]">{option.count}</span>
              <button
                type="button"
                onClick={() => toggleFilter(option.id)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? 'bg-[#6E56CF]' : 'bg-[#232326]'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}