'use client';

import React from "react";
import Github from "lucide-react/dist/esm/icons/github";

export function RepositoryHero() {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
        <Github className="text-[#6E56CF]" />
        Trending AI Repositories
      </h1>
      <p className="text-sm text-[#A1A1AA] mt-2">
        Discover popular open-source projects, tools, and models pushing developer capabilities on GitHub.
      </p>
    </div>
  );
}
