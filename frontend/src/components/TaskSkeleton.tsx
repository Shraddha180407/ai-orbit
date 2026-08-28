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
          className="grid grid-cols-[48px_minmax(220px,1.6fr)_repeat(4,minmax(90px,1fr))] items-center gap-4 px-5 py-2.5 border-b border-[#232326]/50 last:border-b-0"
        >
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#18181C] to-[#131316] animate-pulse" />
          <div className="h-3.5 w-1/2 rounded bg-gradient-to-r from-[#18181C] to-[#131316] animate-pulse" />
          <div className="h-3 w-12 rounded bg-[#18181C] animate-pulse justify-self-end" />
          <div className="h-3 w-12 rounded bg-[#18181C] animate-pulse justify-self-end" />
          <div className="h-3 w-10 rounded bg-[#18181C] animate-pulse justify-self-end" />
          <div className="h-3 w-10 rounded bg-[#18181C] animate-pulse justify-self-end" />
        </div>
      ))}
    </div>
  );
}