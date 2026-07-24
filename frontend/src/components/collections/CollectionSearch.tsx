"use client";

import { Search } from "lucide-react";

interface CollectionSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CollectionSearch({
  value,
  onChange,
}: CollectionSearchProps) {
  return (
    <div className="relative w-full">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted"
        size={18}
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search collections..."
        className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}