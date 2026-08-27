import React from "react";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-6 md:py-10 relative overflow-hidden">
      {/* Background Radial Glow match */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6E56CF]/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Breadcrumb Skeleton */}
      <div className="mb-4 md:mb-6 h-4 w-48 rounded bg-[#18181C] animate-pulse relative z-10" />

      {/* Hero Section Container Skeleton */}
      <div className="relative z-10 flex flex-col gap-6 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-4 md:p-6 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            
            {/* Logo Skeleton */}
            <div className="relative flex h-20 w-20 shrink-0 rounded-xl border border-[#232326]/60 bg-[#18181C] animate-pulse shadow-lg shadow-black/20 self-start" />

            {/* Title & Metadata Skeleton */}
            <div className="space-y-3 pt-1">
              <div className="h-8 w-64 rounded bg-[#18181C] animate-pulse" />
              <div className="h-4 w-80 rounded bg-[#18181C] animate-pulse mt-2" />
            </div>
          </div>

          {/* Primary Actions Skeleton */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto md:self-start">
            <div className="h-10 w-full sm:w-28 rounded-lg bg-[#18181C] animate-pulse" />
            <div className="h-10 w-full sm:w-28 rounded-lg bg-[#18181C] animate-pulse" />
            <div className="h-10 w-10 hidden sm:block rounded-lg bg-[#18181C] animate-pulse" />
          </div>
        </div>

        <hr className="border-[#232326]/60" />

        {/* Details Block Skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-3/4 rounded bg-[#18181C] animate-pulse" />
          <div className="h-4 w-2/4 rounded bg-[#18181C] animate-pulse" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-16 rounded-full bg-[#18181C] animate-pulse" />
            <div className="h-6 w-20 rounded-full bg-[#18181C] animate-pulse" />
            <div className="h-6 w-24 rounded-full bg-[#18181C] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom 2-Column Layout Skeleton */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] items-start gap-8 lg:gap-12 relative z-10">
        
        {/* Left Column */}
        <div className="space-y-8">
          <div className="h-[300px] rounded-xl border border-[#232326]/60 bg-[#131316]/30 animate-pulse" />
          <div className="h-[200px] rounded-xl border border-[#232326]/60 bg-[#131316]/30 animate-pulse" />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="h-[120px] rounded-xl border border-[#232326]/60 bg-[#131316]/30 animate-pulse" />
          <div className="h-[180px] rounded-xl border border-[#232326]/60 bg-[#131316]/30 animate-pulse" />
        </div>
      </div>
    </main>
  );
}