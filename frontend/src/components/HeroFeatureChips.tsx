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
    <div className="hero-chip-row w-full max-w-4xl relative z-10 flex items-center justify-center overflow-hidden select-none">
      <div
        className="flex flex-nowrap items-center"
        style={{ gap: "calc(10px * var(--chip-scale))" }}
      >
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
              className="group inline-flex shrink-0 whitespace-nowrap items-center rounded-full border bg-[#0d0d10] font-medium transition-colors duration-150"
              style={{
                borderColor: filled ? f.color : `${f.color}40`,
                color: filled ? "#ffffff" : "#a1a1aa",
                height: "calc(28px * var(--chip-scale))",
                paddingLeft: "calc(8px * var(--chip-scale))",
                paddingRight: "calc(12px * var(--chip-scale))",
                gap: "calc(6px * var(--chip-scale))",
                fontSize: "calc(12px * var(--chip-scale))",
              }}
            >
              <span
                className="flex shrink-0 items-center justify-center rounded-full border transition-colors duration-150"
                style={{
                  backgroundColor: filled ? f.color : "transparent",
                  borderColor: f.color,
                  width: "calc(16px * var(--chip-scale))",
                  height: "calc(16px * var(--chip-scale))",
                }}
              >
                <Icon
                  strokeWidth={2.25}
                  style={{
                    color: filled ? "#000000" : f.color,
                    width: "calc(9px * var(--chip-scale))",
                    height: "calc(9px * var(--chip-scale))",
                  }}
                />
              </span>
              <span>{f.name}</span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .hero-chip-row {
          /*
           * A single dynamic scale factor, computed purely in CSS from the
           * live viewport width — no JS measurement, no font-load race, no
           * flash of the wrong size on first paint.
           *
           * It's a direct linear model of "available width / natural row
           * width": (100vw - 48px page padding) / 560px assumed natural
           * width (deliberately padded above the real ~480px measured
           * width, so we shrink a bit earlier than strictly required
           * rather than risk any overflow).
           *
           * Below ~320px viewports we hold at the 0.5 floor; from ~608px
           * viewports upward the row already fits, so scale clamps to 1
           * and desktop is rendered at its exact original size, untouched.
           */
          --chip-scale: clamp(0.5, calc((100vw - 48px) / 560px), 1);
        }
      `}</style>
    </div>
  );
}
