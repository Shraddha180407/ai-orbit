"use client";

import React, { useState } from "react";

type Category = { name: string; href: string; external?: boolean };

const CATEGORIES: Category[] = [
  { name: "Tools", href: "#tools" },
  { name: "Models", href: "#models" },
  { name: "Companies", href: "#companies" },
  { name: "Repositories", href: "#repos" },
  { name: "News", href: "#news" },
  { name: "Collections", href: "/tools", external: true },
];

export function HeroCategoryPills() {
  const [activeCategory, setActiveCategory] = useState<string>("Tools");

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 select-none max-w-3xl w-full">
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
            className={`inline-flex items-center rounded-md px-2.5 h-[26px] text-[10.5px] font-medium border transition-colors duration-150 whitespace-nowrap ${
              isActive
                ? "bg-white text-[#000000] border-transparent"
                : "bg-transparent border-[#232326]/50 text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
            }`}
          >
            <span>{cat.name}</span>
          </a>
        );
      })}
    </div>
  );
}
