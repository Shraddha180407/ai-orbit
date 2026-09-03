"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/api";
import Flame from 'lucide-react/dist/esm/icons/flame';
import Star from 'lucide-react/dist/esm/icons/star';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Gift from 'lucide-react/dist/esm/icons/gift';
import Trophy from 'lucide-react/dist/esm/icons/trophy';

const FILTERS = [
  { name: "Trending", icon: Flame, param: "sort", value: "trending", color: "#FF6B4A" },
  { name: "Popular", icon: Star, param: "sort", value: "popular", color: "#FFC53D" },
  { name: "New", icon: Sparkles, param: "sort", value: "newest", color: "#A78BFA" },
  { name: "Free", icon: Gift, param: "pricing", value: "FREE", color: "#34D399" },
  { name: "Top Rated", icon: Trophy, param: "sort", value: "top-rated", color: "#38BDF8" },
] as const;

const INITIAL_PAGE_SIZE = 50;

export function HeroFeatureChips() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState<string>("");
  const hoverTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const prefetchFilter = useCallback((f: typeof FILTERS[number]) => {
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const currentPricing = searchParams.get("pricing") || undefined;
    const currentSort = searchParams.get("sort") || undefined;

    const targetPricing = f.param === "pricing" ? f.value : currentPricing;
    const targetSort = f.param === "sort" ? (f.value as any) : currentSort;

    queryClient.prefetchInfiniteQuery({
      queryKey: ["home-tools", { q, category, pricing: targetPricing, sort: targetSort }],
      queryFn: async ({ pageParam = 1 }) => {
        const query = new URLSearchParams();
        if (q) query.set("q", q);
        if (category) query.set("category", category);
        if (targetPricing) query.set("pricing", targetPricing);
        if (targetSort) query.set("sort", targetSort);
        query.set("page", String(pageParam));
        query.set("pageSize", String(pageParam === 1 ? INITIAL_PAGE_SIZE : 12));

        const res = await fetch(`${API_URL}/api/v1/tools?${query.toString()}`);
        if (!res.ok) return { tools: [], totalPages: 1, page: pageParam };
        return res.json();
      },
      initialPageParam: 1,
      staleTime: 10 * 60 * 1000,
    }).catch(() => { });

    queryClient.prefetchInfiniteQuery({
      queryKey: ["tools", { q, category, pricing: targetPricing, sort: targetSort }],
      queryFn: async ({ pageParam = 1 }) => {
        const query = new URLSearchParams();
        if (q) query.set("q", q);
        if (category) query.set("category", category);
        if (targetPricing) query.set("pricing", targetPricing);
        if (targetSort) query.set("sort", targetSort);
        query.set("page", String(pageParam));
        query.set("pageSize", String(pageParam === 1 ? INITIAL_PAGE_SIZE : 12));

        const res = await fetch(`${API_URL}/api/v1/tools?${query.toString()}`);
        if (!res.ok) return { tools: [], totalPages: 1, page: pageParam };
        return res.json();
      },
      initialPageParam: 1,
      staleTime: 10 * 60 * 1000,
    }).catch(() => { });
  }, [searchParams, queryClient]);

  const handlePointerEnter = (f: typeof FILTERS[number]) => {
    setHovered(f.name);
    if (hoverTimeoutRef.current[f.name]) clearTimeout(hoverTimeoutRef.current[f.name]);
    hoverTimeoutRef.current[f.name] = setTimeout(() => {
      prefetchFilter(f);
    }, 75);
  };

  const handlePointerLeave = (name: string) => {
    setHovered("");
    if (hoverTimeoutRef.current[name]) {
      clearTimeout(hoverTimeoutRef.current[name]);
      delete hoverTimeoutRef.current[name];
    }
  };

  return (
    <div className="w-full max-w-4xl relative z-10 flex items-center justify-center touch-scroll-x scrollbar-none px-2 sm:px-2 select-none">
      <div className="flex flex-nowrap items-center justify-center mx-auto gap-1 sm:gap-2.5 max-w-full">
        {FILTERS.map((f) => {
          const currentVal = searchParams.get(f.param);
          const isActive = currentVal === f.value;
          const isHovered = hovered === f.name;
          const filled = isActive || isHovered;
          const Icon = f.icon;

          return (
            <button
              key={f.name}
              type="button"
              onPointerEnter={() => handlePointerEnter(f)}
              onPointerLeave={() => handlePointerLeave(f.name)}
              onFocus={() => handlePointerEnter(f)}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                if (isActive) {
                  params.delete(f.param);
                } else {
                  params.set(f.param, f.value);
                }
                const qs = params.toString();
                const targetUrl = qs ? `${pathname}?${qs}#tools` : `${pathname}#tools`;
                router.push(targetUrl, { scroll: false });

                const toolsEl = document.getElementById("tools");
                if (toolsEl) {
                  toolsEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className="group inline-flex shrink-0 whitespace-nowrap items-center rounded-full border font-medium transition-all duration-150 active:scale-95 cursor-pointer h-[22px] sm:h-[25px] px-1.5 sm:px-2.5 gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] shadow-sm"
              style={{
                borderColor: filled ? f.color : `${f.color}40`,
                backgroundColor: filled ? `${f.color}15` : "#0d0d10",
                color: filled ? "#ffffff" : "#a1a1aa",
                boxShadow: filled ? `0 0 8px ${f.color}18` : undefined,
              }}
            >
              <span
                className="flex shrink-0 items-center justify-center rounded-full border transition-colors duration-150 h-3 w-3 sm:h-3.5 sm:w-3.5"
                style={{
                  backgroundColor: filled ? f.color : "transparent",
                  borderColor: f.color,
                }}
              >
                <Icon
                  strokeWidth={2.25}
                  className="h-1.5 w-1.5 sm:h-2 sm:w-2"
                  style={{
                    color: filled ? "#000000" : f.color,
                  }}
                />
              </span>
              <span className="font-semibold">{f.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}