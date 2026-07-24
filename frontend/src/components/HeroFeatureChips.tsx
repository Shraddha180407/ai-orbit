"use client";

import React, { useState } from "react";
import Flame from 'lucide-react/dist/esm/icons/flame';
import Star from 'lucide-react/dist/esm/icons/star';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Gift from 'lucide-react/dist/esm/icons/gift';
import Trophy from 'lucide-react/dist/esm/icons/trophy';

const FILTERS = [
  { name: "Trending", icon: Flame, param: "sort", value: "rating", color: "#FF6B4A" },
  { name: "Popular", icon: Star, param: "sort", value: "rating", color: "#FFC53D" },
  { name: "New", icon: Sparkles, param: "sort", value: "newest", color: "#A78BFA" },
  { name: "Free", icon: Gift, param: "pricing", value: "FREE", color: "#34D399" },
  { name: "Top Rated", icon: Trophy, param: "sort", value: "rating", color: "#38BDF8" },
] as const;

export function HeroFeatureChips() {
  const [activeFilter, setActiveFilter] = useState<string>("");

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-4xl relative z-10 select-none">
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
            className={`group inline-flex items-center gap-1 rounded-full px-2 h-[22px] text-[9.5px] font-bold border transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.98] ${
              isActive ? "text-black shadow-md" : "bg-[#131316]/70"
            }`}
            style={
              isActive
                ? { backgroundColor: f.color, borderColor: f.color, boxShadow: `0 4px 12px -6px ${f.color}88` }
                : { borderColor: `${f.color}55` }
            }
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.boxShadow = `0 4px 10px -8px ${f.color}77`;
                e.currentTarget.style.borderColor = f.color;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = `${f.color}55`;
              }
            }}
          >
            <span
              className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:rotate-[8deg]"
              style={{ backgroundColor: isActive ? "rgba(0,0,0,0.15)" : `${f.color}22` }}
            >
              <Icon
                size={8}
                strokeWidth={2.25}
                className={isActive ? "text-black" : ""}
                style={isActive ? undefined : { color: f.color, filter: `drop-shadow(0 0 3px ${f.color}99)` }}
              />
            </span>
            <span style={isActive ? undefined : { color: f.color }}>{f.name}</span>
          </button>
        );
      })}
    </div>
  );
}