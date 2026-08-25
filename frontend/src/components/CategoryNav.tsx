"use client";

import React, { useState } from "react";
import Link from "next/link";

export function CategoryNav() {
  const [activeCategory, setActiveCategory] = useState("AI Tools");

  // `isPageLink: true` = navigates to a different route (uses next/link,
  // client-side nav, doesn't touch the in-page active-anchor state).
  // Anything without it is treated as an in-page `#hash` anchor on the homepage.
  const CATEGORIES = [
    { name: "AI Tools", href: "#tools" },
    { name: "Models", href: "/models", isPageLink: true },
    { name: "Companies", href: "/companies", isPageLink: true },
    { name: "Repositories", href: "/repositories", isPageLink: true },
    { name: "News", href: "/news", isPageLink: true },
    { name: "Videos", href: "/videos", isPageLink: true },
    { name: "Agents", href: "/tools?category=agents", isPageLink: true },
  ];

  return (
    <div className="w-full border-b border-[#232326]/40 bg-[#000000] py-4 sticky top-navbar z-30 select-none">
      <div className="mx-auto max-w-[1440px] px-8">
        <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-none pb-1 w-full">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.name;
            const className = `inline-flex items-center rounded-lg px-3.5 h-[30px] text-[11px] font-semibold border transition-all duration-200 active:scale-95 whitespace-nowrap ${
              isActive
                ? "bg-white text-[#000000] border-transparent shadow-sm"
                : "bg-transparent border-[#232326] text-[#A1A1AA] hover:border-neutral-500 hover:text-white"
            }`;

            if (cat.isPageLink) {
              return (
                <Link key={cat.name} href={cat.href} className={className}>
                  <span>{cat.name}</span>
                </Link>
              );
            }

            return (
              <a
                key={cat.name}
                href={cat.href}
                onClick={() => setActiveCategory(cat.name)}
                className={className}
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