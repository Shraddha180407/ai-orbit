import React from "react";

export function RepositoryLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 bg-white/[0.04] rounded" />

      {/* Hero Card Skeleton */}
      <div className="h-32 bg-white/[0.04] rounded-xl border border-white/[0.06]" />

      {/* Readme Skeleton */}
      <div className="h-96 bg-white/[0.04] rounded-xl border border-white/[0.06]" />
    </div>
  );
}
