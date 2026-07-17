"use client";

import React, { useState } from "react";

export function CategoryNav() {
  const [activeCategory, setActiveCategory] = useState("AI Tools");

  const CATEGORIES = [
    { name: "AI Tools", href: "#tools" },
    { name: "Models", href: "#models" },
    { name: "Companies", href: "#companies" },
    { name: "Repositories", href: "#repos" },
    { name: "News", href: "#news" },
    { name: "Collections", href: "/tools", external: true },
    { name: "Videos", href: "/videos", external: true },
    { name: "Agents", href: "/tools?category=agents", external: true },
  ];

  return (
    <div className="w-full border-b border-[#232326]/40 bg-[#000000] py-4 sticky top-[68px] z-30 select-none">
      <div className="mx-auto max-w-[1440px] px-8">
        <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-none pb-1 w-full">
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
                className={`inline-flex items-center rounded-lg px-3.5 h-[30px] text-[11px] font-semibold border transition-all duration-200 active:scale-95 whitespace-nowrap ${
                  isActive
                    ? "bg-white text-[#000000] border-transparent shadow-sm"
                    : "bg-transparent border-[#232326] text-[#A1A1AA] hover:border-neutral-500 hover:text-white"
                }`}
              >
                <span>{cat.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
