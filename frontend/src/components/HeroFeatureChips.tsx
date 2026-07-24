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
  const [hovered, setHovered] = useState<string>("");

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl relative z-10 select-none">
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.name;
        const isHovered = hovered === f.name;
        const filled = isActive || isHovered;
        const Icon = f.icon;
        return (
          <button
            key={f.name}
            onMouseEnter={() => setHovered(f.name)}
            onMouseLeave={() => setHovered("")}
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
      className="group inline-flex items-center gap-1.5 rounded-full pl-2 pr-3 h-7 text-[12px] font-medium border bg-[#0d0d10] transition-colors duration-150"
            style={{
              borderColor: filled ? f.color : `${f.color}40`,
              color: filled ? "#ffffff" : "#a1a1aa",
            }}
          >
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-150"
              style={{
                backgroundColor: filled ? f.color : "transparent",
                borderColor: f.color,
              }}
            >
              <Icon
                size={9}
                strokeWidth={2.25}
                style={{ color: filled ? "#000000" : f.color }}
              />
            </span>
            <span>{f.name}</span>
          </button>
        );
      })}
    </div>
  );
}