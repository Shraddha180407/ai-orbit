'use client';

import React from "react";
import Link from "next/link";
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import type { PopularTool } from "@/lib/tasks-api";

type TaskToolsListProps = {
  tools: PopularTool[];
};


export function TaskToolsList({ tools }: TaskToolsListProps) {
  if (!tools.length) {
    return (
      <div className="mb-6">
        <div className="w-full rounded-2xl bg-[#0B0B0E] ring-1 ring-[#232326]/60 p-8 text-center text-sm text-[#71717A]">
          No tools available for this task.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4">
        Tools{" "}
        <span className="text-[#71717A] font-normal">({tools.length})</span>
      </h2>

      <div className="w-full rounded-2xl overflow-hidden bg-[#0B0B0E] ring-1 ring-[#232326]/60 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/p/tools/${tool.slug}`}
            className="group flex w-full items-center gap-4 px-5 py-3.5 border-b border-[#232326]/50 last:border-b-0 transition-colors duration-150 hover:bg-[#131316] text-left"
          >
            {tool.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tool.logoUrl}
                alt=""
                className="h-10 w-10 rounded-xl bg-[#18181C] ring-1 ring-[#232326]/70 shrink-0 object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-[#18181C] ring-1 ring-[#232326]/70 shrink-0" />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white truncate group-hover:text-[#A78BFA] transition-colors duration-150">
                  {tool.name}
                </span>

                {tool.pricingModel && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] ring-1 font-mono bg-[#18181C] text-[#A1A1AA] ring-[#232326]">
                    {tool.pricingModel}
                  </span>
                )}
              </div>

              {tool.tagline && (
                <p className="text-xs text-[#A1A1AA] truncate mt-0.5">
                  {tool.tagline}
                </p>
              )}
            </div>

            <ChevronRight
              className="h-4 w-4 text-[#3A3A3E] shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}