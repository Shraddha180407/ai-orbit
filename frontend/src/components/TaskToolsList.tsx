'use client';

import React, { useState } from "react";
import Link from "next/link";
import Check from "lucide-react/dist/esm/icons/check";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import Bookmark from "lucide-react/dist/esm/icons/bookmark";
import GitCompare from "lucide-react/dist/esm/icons/git-compare";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import type { PopularTool } from "@/lib/tasks-api";

type TaskToolsListProps = {
  tools: PopularTool[];
  taskTitle: string;
};

const COL_TEMPLATE =
  "grid-cols-[48px_200px_minmax(150px,1.6fr)_minmax(110px,1.1fr)_minmax(60px,0.6fr)_minmax(90px,0.9fr)_minmax(80px,0.7fr)_44px_44px_60px_60px] md:grid-cols-[60px_minmax(280px,3.5fr)_minmax(150px,1.6fr)_minmax(110px,1.1fr)_minmax(60px,0.6fr)_minmax(90px,0.9fr)_minmax(80px,0.7fr)_44px_44px_60px_60px]";

const MIN_WIDTH = "min-w-fit md:min-w-[1070px]";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatReleased(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function isTruthy(value: boolean | null): boolean {
  return value === true;
}

function BoolPill({
  value,
  trueLabel,
  falseLabel,
}: {
  value: boolean;
  trueLabel: string;
  falseLabel: string;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA] transition-colors hover:border-[#3a3a3d] hover:text-white">
      {value ? trueLabel : falseLabel}
    </span>
  );
}

function ShareButton({ tool }: { tool: PopularTool }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/p/tools/${tool.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: tool.name,
          text: tool.tagline ?? "",
          url,
        });
      } catch {
        // User cancelled sharing.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const element = document.createElement("textarea");
      element.value = url;
      document.body.appendChild(element);
      element.select();
      document.execCommand("copy");
      document.body.removeChild(element);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors ${
        copied
          ? "border-[#6E56CF] text-[#6E56CF]"
          : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
      }`}
      aria-label={`Share ${tool.name}`}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
    </button>
  );
}

export function TaskToolsList({
  tools,
  taskTitle,
}: TaskToolsListProps) {
  if (!tools.length) {
    return (
      <div className="mb-6">
        <div className="w-full rounded-xl bg-[#0B0B0E] p-8 text-center text-sm text-[#71717A] ring-1 ring-[#232326]/60">
          No tools available for this task.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-white">
          Tools{" "}
          <span className="font-normal text-[#71717A]">
            ({tools.length})
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#232326]/60 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#131316] [&::-webkit-scrollbar-thumb]:bg-[#6E56CF]/40 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className={`relative bg-[#000000] ${MIN_WIDTH}`}>

          {/* HEADER */}
          <div className="border-b border-[#232326]/60 bg-[#131316]">
            <div className={`grid ${COL_TEMPLATE} ${MIN_WIDTH} items-center gap-3 py-3`}>

              {/* LOGO */}
              <div className="h-full pl-4" />

              {/* TOOL */}
              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                TOOL
              </div>

              {/* TASK */}
              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                TASK
              </div>

              {/* PRICING */}
              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                PRICING
              </div>

              {/* API */}
              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                API
              </div>

              {/* OPEN SOURCE */}
              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                OPEN-SOURCE
              </div>

              {/* COMPATIBILITY */}
              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                COMPATIBILITY
              </div>

              {/* RELEASED */}
              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                RELEASED
              </div>

              {/* SHARE */}
              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                SHARE
              </div>

              {/* SAVE */}
              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                SAVE
              </div>

              {/* CMP */}
              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] pr-4">
                CMP
              </div>
            </div>
          </div>

          {/* ROWS */}
          <div role="list" className="flex flex-col">
            {tools.map((tool) => (
              <div
                key={tool.slug}
                role="listitem"
                className={`group grid ${COL_TEMPLATE} ${MIN_WIDTH} items-center gap-3 border-b border-[#232326]/60 py-3 transition-all duration-200 hover:bg-[#18181C]`}
              >

                {/* LOGO */}
                <div className="flex h-full items-center pl-4">
                  <div className="flex h-8 w-8 md:h-11 md:w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white transition-colors group-hover:border-[#6E56CF]">
                    {tool.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tool.logoUrl}
                        alt={tool.name}
                        className="h-6 w-6 md:h-8 md:w-8 object-contain"
                      />
                    ) : (
                      <span className="text-[10px] md:text-xs font-bold text-neutral-900">
                        {tool.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* TOOL */}
                <Link
                  href={`/p/tools/${tool.slug}`}
                  className="min-w-0 flex flex-col justify-center pr-4 md:pr-0"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="truncate text-[11.5px] md:text-[13px] font-semibold leading-tight text-white transition-colors duration-200 group-hover:text-[#6E56CF]">
                      {tool.name}
                    </h3>

                    <ExternalLink
                      size={13}
                      className="hidden md:inline-flex shrink-0 text-[#71717A]"
                      aria-hidden="true"
                    />
                  </div>

                  {tool.tagline && (
                    <p className="mt-0.5 hidden md:block truncate text-[11px] leading-snug text-[#A1A1AA]">
                      {tool.tagline}
                    </p>
                  )}
                </Link>

                {/* TASK */}
                <div className="min-w-0">
                  <span
                    className="inline-flex max-w-full items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2 py-0.5 text-[10px] font-mono font-semibold leading-tight text-[#A1A1AA] whitespace-normal break-words"
                    title={taskTitle}
                  >
                    {taskTitle}
                  </span>
                </div>

                {/* PRICING */}
                <div className="min-w-0">
                  {tool.pricingModel ? (
                    <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA] whitespace-nowrap">
                      {tool.pricingModel}
                      {tool.pricingAmount !== null &&
                        tool.pricingAmount !== undefined &&
                        ` $${Number(tool.pricingAmount).toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}`}
                      {tool.billingFrequency &&
                        `/${tool.billingFrequency}`}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#71717A] font-mono">
                      —
                    </span>
                  )}
                </div>

                {/* API */}
                <div>
                  <BoolPill
                    value={isTruthy(tool.hasApi)}
                    trueLabel="YES"
                    falseLabel="NO"
                  />
                </div>

                {/* OPEN SOURCE */}
                <div>
                  <BoolPill
                    value={isTruthy(tool.isOpenSource)}
                    trueLabel="YES"
                    falseLabel="NO"
                  />
                </div>

                {/* COMPATIBILITY */}
                <div className="min-w-0">
                  {tool.compatibility ? (
  <span
    className="block truncate text-[11px] text-[#A1A1AA]"
    title={tool.compatibility}
  >
    {tool.compatibility}
  </span>
) : (
  <span className="text-[11px] text-[#71717A] font-mono">
    —
  </span>
)}
                </div>

                {/* RELEASED */}
                <div className="text-[10px] font-mono text-[#A1A1AA]">
                  {formatReleased(tool.releaseDate)}
                </div>

                {/* SHARE */}
                <div onClick={(e) => e.preventDefault()}>
                  <ShareButton tool={tool} />
                </div>

                {/* SAVE */}
                <div>
                  <button
                    type="button"
                    aria-label={`Save ${tool.name}`}
                    className="inline-flex items-center justify-center rounded-md border border-[#232326]/60 bg-[#18181C] p-1.5 text-[#A1A1AA] transition-colors hover:border-[#3a3a3d] hover:text-white"
                  >
                    <Bookmark size={14} />
                  </button>
                </div>

                {/* CMP */}
                <div className="pr-4">
                  <Link
                    href={`/p/tools/${tool.slug}`}
                    aria-label={`Compare ${tool.name}`}
                    className="inline-flex items-center justify-center rounded-md border border-[#232326]/60 bg-[#18181C] p-1.5 text-[#A1A1AA] transition-colors hover:border-[#3a3a3d] hover:text-white"
                  >
                    <GitCompare size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}