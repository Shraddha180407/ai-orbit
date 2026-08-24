'use client';

import React, { useEffect, useState } from "react";
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import X from 'lucide-react/dist/esm/icons/x';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import { getToolsByCategory, type ToolRecord } from "@/lib/tools-data";

type TaskToolsListProps = {
  tools: ToolRecord[];
};

function faviconUrl(websiteUrl: string, size = 128): string {
  try {
    const host = new URL(websiteUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=${size}`;
  } catch {
    return "";
  }
}

function domainOf(websiteUrl: string): string {
  try {
    return new URL(websiteUrl).hostname.replace(/^www\./, "");
  } catch {
    return websiteUrl;
  }
}

function pricingBadgeClasses(pricing: ToolRecord["pricing"]): string {
  switch (pricing) {
    case "FREE":
      return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30";
    case "PAID":
      return "bg-[#6E56CF]/10 text-[#A78BFA] ring-[#6E56CF]/30";
    case "FREEMIUM":
      return "bg-sky-500/10 text-sky-400 ring-sky-500/30";
    case "FREE_TRIAL":
      return "bg-amber-500/10 text-amber-400 ring-amber-500/30";
    default:
      return "bg-[#18181C] text-[#A1A1AA] ring-[#232326]";
  }
}

export function TaskToolsList({ tools }: TaskToolsListProps) {
  const [selectedTool, setSelectedTool] = useState<ToolRecord | null>(null);

  useEffect(() => {
    if (!selectedTool) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedTool(null);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTool]);

  if (!tools.length) {
    return (
      <div className="mb-6">
        <div className="w-full rounded-2xl bg-[#0B0B0E] ring-1 ring-[#232326]/60 p-8 text-center text-sm text-[#71717A]">
          No tools match this filter.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4">
        Tools <span className="text-[#71717A] font-normal">({tools.length})</span>
      </h2>

      <div className="w-full rounded-2xl overflow-hidden bg-[#0B0B0E] ring-1 ring-[#232326]/60 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
        {tools.map((toolItem) => (
          <button
            key={toolItem.slug}
            type="button"
            onClick={() => setSelectedTool(toolItem)}
            className="group flex w-full items-center gap-4 px-5 py-3.5 border-b border-[#232326]/50 last:border-b-0 transition-colors duration-150 hover:bg-[#131316] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60 focus-visible:ring-inset"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faviconUrl(toolItem.websiteUrl)}
              alt=""
              className="h-10 w-10 rounded-xl bg-[#18181C] ring-1 ring-[#232326]/70 shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white truncate group-hover:text-[#A78BFA] transition-colors duration-150">
                  {toolItem.name}
                </span>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] ring-1 font-mono ${pricingBadgeClasses(
                    toolItem.pricing
                  )}`}
                >
                  {toolItem.pricing}
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] truncate mt-0.5">{toolItem.tagline}</p>
            </div>
            <ChevronRight
              className="h-4 w-4 text-[#3A3A3E] shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {selectedTool && (
        <ToolDetailOverlay
          tool={selectedTool}
          onSelectTool={setSelectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
}

function ToolDetailOverlay({
  tool,
  onSelectTool,
  onClose,
}: {
  tool: ToolRecord;
  onSelectTool: (tool: ToolRecord) => void;
  onClose: () => void;
}) {
  const remainingTools = getToolsByCategory(tool.categorySlug).filter((t) => t.slug !== tool.slug);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#000000]">
      <div className="w-full px-6 lg:px-10 py-6">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs text-[#71717A] hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Tools
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-[#18181C]/80 ring-1 ring-[#232326]/70 text-[#A1A1AA] hover:text-white hover:ring-[#3A3A3E] transition-all duration-200"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="w-full rounded-2xl bg-[#0B0B0E] ring-1 ring-[#232326]/60 p-6 sm:p-7 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={faviconUrl(tool.websiteUrl, 128)}
                alt=""
                className="h-14 w-14 rounded-2xl bg-[#18181C] ring-1 ring-[#232326]/70 shrink-0 object-cover"
              />
              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{tool.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#18181C] ring-1 ring-[#232326]/70 text-[11px] text-[#A1A1AA] font-mono">
                    {domainOf(tool.websiteUrl)}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] ring-1 font-mono ${pricingBadgeClasses(tool.pricing)}`}>
                    {tool.pricing}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] ring-1 ring-[#232326]/70 bg-[#18181C] text-[#A1A1AA] font-mono">
                    {tool.subcategory}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 shrink-0 rounded-lg bg-gradient-to-b from-[#7C63E0] to-[#6E56CF] hover:from-[#8A73EA] hover:to-[#7C63E0] transition-all duration-200 text-white text-sm font-semibold px-4 py-2.5 shadow-[0_4px_16px_-4px_rgba(110,86,207,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60"
            >
              Visit {tool.name}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <p className="text-sm text-[#A1A1AA] mt-4 max-w-2xl leading-relaxed">{tool.tagline}</p>
        </div>

        {remainingTools.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4">
              More AI Tools <span className="text-[#71717A] font-normal">({remainingTools.length})</span>
            </h2>

            <div className="w-full rounded-2xl overflow-hidden bg-[#0B0B0E] ring-1 ring-[#232326]/60 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
              {remainingTools.map((rt) => (
                <button
                  key={rt.slug}
                  type="button"
                  onClick={() => onSelectTool(rt)}
                  className="group flex w-full items-center gap-4 px-5 py-3.5 border-b border-[#232326]/50 last:border-b-0 transition-colors duration-150 hover:bg-[#131316] text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={faviconUrl(rt.websiteUrl)}
                    alt=""
                    className="h-10 w-10 rounded-xl bg-[#18181C] ring-1 ring-[#232326]/70 shrink-0 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate group-hover:text-[#A78BFA] transition-colors duration-150">
                        {rt.name}
                      </span>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] ring-1 font-mono ${pricingBadgeClasses(rt.pricing)}`}>
                        {rt.pricing}
                      </span>
                    </div>
                    <p className="text-xs text-[#A1A1AA] truncate mt-0.5">{rt.tagline}</p>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 text-[#3A3A3E] shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}