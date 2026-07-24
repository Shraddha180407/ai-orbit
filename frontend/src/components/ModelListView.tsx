'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SearchX from 'lucide-react/dist/esm/icons/search-x';
import { CategoryChip } from "@/components/CategoryChip";
import type { AIModel } from "@/lib/types";

type ModelListViewProps = {
  models: AIModel[];
  loading?: boolean;
  skeletonRows?: number;
};

// Formatters ----------------------------------------------------------------

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatReleased(value?: string | null): string {
  if (!value) return "—";
  // Prefer ISO / parseable dates; fall back to the raw string (e.g. "May 2024").
  const d = new Date(value);
  if (!isNaN(d.getTime()) && /\d{4}/.test(value) && (value.includes("-") || value.includes("/"))) {
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  return value;
}

function isTruthy(...vals: Array<unknown>): boolean {
  return vals.some((v) => v === true || v === "true" || v === 1 || v === "1");
}

// Boolean pill — identical to ToolListView ----------------------------------

function BoolPill({
  value,
  trueLabel,
  falseLabel,
  trueColor = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  falseColor = "text-[#71717A] bg-[#18181C] border-[#232326]/60",
}: {
  value: boolean | null | undefined;
  trueLabel: string;
  falseLabel: string;
  trueColor?: string;
  falseColor?: string;
}) {
  if (value === null || value === undefined) {
    return <span className="text-[11px] text-[#71717A]">—</span>;
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold ${
        value ? trueColor : falseColor
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

// Column grid — same density language as ToolListView -----------------------
// Logo | Name+desc | Company | Type | Primary Task | Released | Open Source

const COL_TEMPLATE =
  "grid-cols-[40px_minmax(220px,2.4fr)_minmax(130px,1.1fr)_minmax(110px,1fr)_minmax(130px,1.1fr)_minmax(110px,1fr)_minmax(110px,0.9fr)]";

const COL_MIN_WIDTH = "min-w-[900px]";

const COLUMN_HEADERS = [
  { label: "MODEL", align: "" },
  { label: "NAME", align: "" },
  { label: "COMPANY", align: "" },
  { label: "TYPE", align: "" },
  { label: "PRIMARY TASK", align: "" },
  { label: "RELEASED", align: "" },
  { label: "OPEN SOURCE", align: "" },
];

// Row -----------------------------------------------------------------------

function ModelRow({ model }: { model: AIModel }) {
  const companyName = model.provider?.name || model.creator || "—";
  const companyLogo = model.provider?.logoUrl ?? null;
  // Interim: PRD "Type" → modality until backend adds `type`
  const typeLabel = model.type || model.modality || null;
  const primaryTask = model.primaryTask ?? null;
  const openSource =
    model.openSource === undefined ? undefined : isTruthy(model.openSource);

  return (
    <Link
      href={`/models/${model.id}`}
      className={`group grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 bg-transparent px-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none`}
    >
      {/* Column 1: Logo / initial */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white">
        {companyLogo ? (
          <Image
            src={companyLogo}
            alt={`${companyName} logo`}
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
          />
        ) : (
          <span className="text-sm font-bold text-neutral-900">
            {model.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Column 2: Name + Description */}
      <div className="min-w-0">
        <h3 className="truncate text-[13px] font-semibold text-white group-hover:text-white">
          {model.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A1A1AA] leading-snug">
          {model.description}
        </p>
      </div>

      {/* Column 3: Company */}
      <div className="min-w-0 truncate text-[12px] text-white">
        {companyName}
      </div>

      {/* Column 4: Type */}
      <div className="min-w-0 truncate">
        {typeLabel ? (
          <CategoryChip label={typeLabel} />
        ) : (
          <span className="text-[11px] text-[#71717A]">—</span>
        )}
      </div>

      {/* Column 5: Primary Task */}
      <div className="hidden min-w-0 truncate text-[11px] text-[#A1A1AA] sm:block">
        {primaryTask || <span className="text-[#71717A]">—</span>}
      </div>

      {/* Column 6: Released */}
      <div className="hidden text-[11px] font-mono text-[#A1A1AA] sm:block">
        {formatReleased(model.releaseDate)}
      </div>

      {/* Column 7: Open Source */}
      <div className="hidden sm:block">
        <BoolPill value={openSource} trueLabel="YES" falseLabel="NO" />
      </div>
    </Link>
  );
}

// Main ----------------------------------------------------------------------

export function ModelListView({
  models,
  loading = false,
  skeletonRows = 4,
}: ModelListViewProps) {
  if (loading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#131316]/10">
        <div className="flex flex-col divide-y divide-[#232326]/60">
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div
              key={i}
              className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2.5`}
            >
              <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
              <div className="space-y-1.5">
                <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
                <div className="h-2 w-64 animate-pulse rounded bg-[#18181C]" />
              </div>
              <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
              <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
              <div className="h-3 w-24 animate-pulse rounded bg-[#18181C]" />
              <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
              <div className="h-4 w-12 animate-pulse rounded-full bg-[#18181C]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#232326] bg-[#131316]/40 py-16 text-center">
        <SearchX size={28} className="text-[#71717A]" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-white">No models match your filters</p>
          <p className="mt-1 text-xs text-[#A1A1AA]">
            Try a different search term or clear a filter to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-[#232326]/60 bg-[#131316]/10 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="border-b border-[#232326]/60 bg-[#131316]/40">
          <div className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 px-4 py-2`}>
            {COLUMN_HEADERS.map((h) => (
              <span
                key={h.label}
                className={`text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] ${h.align}`}
              >
                {h.label}
              </span>
            ))}
          </div>
        </div>

        <div role="list" className="flex flex-col divide-y divide-[#232326]/60">
          {models.map((model) => (
            <div key={model.id} role="listitem">
              <ModelRow model={model} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
