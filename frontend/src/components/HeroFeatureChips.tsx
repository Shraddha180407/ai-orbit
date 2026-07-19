"use client";

import React, { useState } from "react";
import Flame from 'lucide-react/dist/esm/icons/flame';
import Star from 'lucide-react/dist/esm/icons/star';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Gift from 'lucide-react/dist/esm/icons/gift';
import Trophy from 'lucide-react/dist/esm/icons/trophy';

const FILTERS = [
  { name: "Trending", icon: Flame, param: "sort", value: "rating" },
  { name: "Popular", icon: Star, param: "sort", value: "rating" },
  { name: "New", icon: Sparkles, param: "sort", value: "newest" },
  { name: "Free", icon: Gift, param: "pricing", value: "FREE" },
  { name: "Top Rated", icon: Trophy, param: "sort", value: "rating" },
] as const;

export function HeroFeatureChips() {
  const [activeFilter, setActiveFilter] = useState<string>("");

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl relative z-10 select-none">
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.name;
        const Icon = f.icon;
        return (
          <button
            key={f.name}
            onClick={() => {
              setActiveFilter(isActive ? "" : f.name);
              const url = new URL(window.location.href);
              if (isActive) {
                url.searchParams.delete(f.param);
              } else {
                url.searchParams.set(f.param, f.value);
              }
              url.hash = "tools";
              window.location.href = url.toString();
            }}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 h-[28px] text-[11px] font-medium border transition-colors duration-150 ${
              isActive
                ? "border-transparent text-black"
                : "bg-[#131316]/60 border-[#232326]/50 text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
            }`}
            style={isActive ? { backgroundColor: "var(--color-signal)" } : undefined}
          >
            <Icon
              size={12}
              strokeWidth={2}
              className={isActive ? "text-black" : "text-[#71717A]"}
            />
            <span>{f.name}</span>
          </button>
        );
      })}
    </div>
  );
}