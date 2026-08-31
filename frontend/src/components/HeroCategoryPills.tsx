"use client";

import React, { useState } from "react";

type Category = { name: string; href: string; external?: boolean };

const CATEGORIES: Category[] = [
  { name: "Tools", href: "#tools" },
  { name: "Models", href: "/models", external: true },
  { name: "Companies", href: "/companies", external: true },
  { name: "Repositories", href: "/repositories", external: true },
  { name: "News", href: "/news", external: true },
];

export function HeroCategoryPills() {
  const [activeCategory, setActiveCategory] = useState<string>("Tools");

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 select-none max-w-3xl w-full px-2">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.name;
        return (
          <a
            key={cat.name}
            href={cat.href}
            onClick={() => {
              if (!cat.external) {
                setActiveCategory(cat.name);
              }
            }}
            className={`inline-flex items-center rounded-md px-3 sm:px-2.5 h-[28px] sm:h-[26px] text-[11px] sm:text-[10.5px] font-medium border transition-all duration-150 active:scale-95 whitespace-nowrap cursor-pointer ${
              isActive
                ? "bg-white text-[#000000] border-transparent font-semibold shadow-sm"
                : "bg-transparent border-[#232326]/60 text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
            }`}
          >
            <span>{cat.name}</span>
          </a>
        );
      })}
    </div>
  );
}