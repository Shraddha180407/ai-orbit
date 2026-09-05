import React from 'react';

export default function LeaderboardSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Desktop Table Skeleton */}
      <div className="hidden sm:block rounded-2xl border border-[#232326] bg-[#111115] overflow-hidden">
        <div className="h-12 bg-[#16161c] border-b border-[#232326] flex items-center px-4 gap-6">
          <div className="h-3 w-8 bg-[#232326] rounded"></div>
          <div className="h-3 w-40 bg-[#232326] rounded"></div>
          <div className="h-3 w-20 bg-[#232326] rounded"></div>
          <div className="h-3 w-20 bg-[#232326] rounded"></div>
          <div className="h-3 w-24 bg-[#232326] rounded"></div>
          <div className="h-3 w-28 bg-[#232326] rounded"></div>
          <div className="h-3 w-20 bg-[#232326] rounded ml-auto"></div>
        </div>
        <div className="divide-y divide-[#1F1F24]">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 flex items-center gap-6">
              <div className="h-6 w-6 rounded-full bg-[#1e1e24]"></div>
              <div className="flex items-center gap-3 flex-1">
                <div className="h-9 w-9 rounded-lg bg-[#1e1e24] shrink-0"></div>
                <div className="space-y-1.5 flex-1 max-w-xs">
                  <div className="h-3.5 w-36 bg-[#232326] rounded"></div>
                  <div className="h-2.5 w-20 bg-[#1a1a20] rounded"></div>
                </div>
              </div>
              <div className="h-4 w-16 bg-[#232326] rounded"></div>
              <div className="h-4 w-14 bg-[#1e1e24] rounded"></div>
              <div className="h-4 w-16 bg-[#1a1a20] rounded"></div>
              <div className="h-4 w-20 bg-[#232326] rounded"></div>
              <div className="h-7 w-20 bg-[#1e1e24] rounded-lg ml-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="sm:hidden space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-2xl border border-[#232326] bg-[#111115] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-[#1e1e24]"></div>
                <div className="h-3.5 w-28 bg-[#232326] rounded"></div>
              </div>
              <div className="h-4 w-12 bg-[#1e1e24] rounded"></div>
            </div>
            <div className="h-3 w-3/4 bg-[#1a1a20] rounded"></div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1F1F24]">
              <div className="h-3 bg-[#1e1e24] rounded"></div>
              <div className="h-3 bg-[#1e1e24] rounded"></div>
              <div className="h-3 bg-[#1e1e24] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
