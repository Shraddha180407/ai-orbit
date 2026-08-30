import React from "react";

export function TaskSkeleton() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#131316]/40 to-[#0D0D10]/40 ring-1 ring-[#232326]/60"
      aria-busy="true"
      aria-label="Loading tasks"
    >
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[44px_minmax(220px,1.5fr)_repeat(4,minmax(70px,0.8fr))_minmax(70px,0.8fr)] items-center gap-3 sm:gap-3 px-4 sm:px-5 py-2.5 border-b border-[#232326]/50 last:border-b-0"
        >
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[#18181C] to-[#131316] animate-pulse" />

          <div className="min-w-0 space-y-1.5">
            <div className="h-3.5 w-2/3 sm:w-1/2 rounded bg-gradient-to-r from-[#18181C] to-[#131316] animate-pulse" />
            <div className="h-2.5 w-3/4 sm:w-2/3 rounded bg-[#18181C]/70 animate-pulse" />
          </div>

          <div className="hidden sm:block h-3 w-10 rounded bg-[#18181C] animate-pulse justify-self-center" />
          <div className="hidden sm:block h-3 w-10 rounded bg-[#18181C] animate-pulse justify-self-center" />
          <div className="hidden sm:block h-3 w-8 rounded bg-[#18181C] animate-pulse justify-self-center" />
          <div className="hidden sm:block h-3 w-8 rounded bg-[#18181C] animate-pulse justify-self-center" />

          <div className="flex items-center justify-end gap-1">
            <div className="h-7 w-7 rounded-md bg-[#18181C]/70 animate-pulse" />
            <div className="h-7 w-7 rounded-md bg-[#18181C]/70 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}