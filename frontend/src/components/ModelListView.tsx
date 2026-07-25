'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchX from 'lucide-react/dist/esm/icons/search-x';
import GitCompare from 'lucide-react/dist/esm/icons/git-compare';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import { CategoryChip } from "@/components/CategoryChip";
import type { AIModel } from "@/lib/types";

const MAX_COMPARE = 2;

type ModelListViewProps = {
  models: AIModel[];
  loading?: boolean;
  skeletonRows?: number;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatReleased(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (!isNaN(d.getTime()) && /\d{4}/.test(value) && (value.includes("-") || value.includes("/"))) {
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  return value;
}

function isTruthy(...vals: Array<unknown>): boolean {
  return vals.some((v) => v === true || v === "true" || v === 1 || v === "1");
}

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

// Logo | Name | Company | Type | Primary Task | Released | Open Source | Compare
const COL_TEMPLATE =
  "grid-cols-[40px_minmax(200px,2.2fr)_minmax(120px,1fr)_minmax(100px,0.9fr)_minmax(120px,1fr)_minmax(100px,0.9fr)_minmax(100px,0.85fr)_minmax(100px,0.85fr)]";

const COL_MIN_WIDTH = "min-w-[980px]";

const COLUMN_HEADERS = [
  { label: "MODEL", align: "" },
  { label: "NAME", align: "" },
  { label: "COMPANY", align: "" },
  { label: "TYPE", align: "" },
  { label: "PRIMARY TASK", align: "" },
  { label: "RELEASED", align: "" },
  { label: "OPEN SOURCE", align: "" },
  { label: "COMPARE", align: "text-right" },
];

function ModelRow({
  model,
  isSelected,
  isCompareFull,
  onToggleCompare,
}: {
  model: AIModel;
  isSelected: boolean;
  isCompareFull: boolean;
  onToggleCompare: (model: AIModel) => void;
}) {
  const companyName = model.provider?.name || model.creator || "—";
  const companyLogo = model.provider?.logoUrl ?? null;
  const typeLabel = model.type || model.modality || null;
  const primaryTask = model.primaryTask ?? null;
  const openSource =
    model.openSource === undefined ? undefined : isTruthy(model.openSource);

  return (
    <Link
      href={`/models/${model.id}`}
      className={`group grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-4 bg-transparent px-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none`}
    >
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
          <span className="text-sm font-bold text-neutral-900">{model.name.charAt(0)}</span>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-[13px] font-semibold text-white">{model.name}</h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A1A1AA] leading-snug">
          {model.description}
        </p>
      </div>

      <div className="min-w-0 truncate text-[12px] text-white">{companyName}</div>

      <div className="min-w-0 truncate">
        {typeLabel ? (
          <CategoryChip label={typeLabel} />
        ) : (
          <span className="text-[11px] text-[#71717A]">—</span>
        )}
      </div>

      <div className="hidden min-w-0 truncate text-[11px] text-[#A1A1AA] sm:block">
        {primaryTask || <span className="text-[#71717A]">—</span>}
      </div>

      <div className="hidden text-[11px] font-mono text-[#A1A1AA] sm:block">
        {formatReleased(model.releaseDate)}
      </div>

      <div className="hidden sm:block">
        <BoolPill value={openSource} trueLabel="YES" falseLabel="NO" />
      </div>

      <div className="hidden text-right sm:block">
        <button
          type="button"
          disabled={!isSelected && isCompareFull}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleCompare(model);
          }}
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold transition-colors ${
            isSelected
              ? "border-transparent text-black"
              : !isSelected && isCompareFull
              ? "cursor-not-allowed border-[#232326]/40 bg-[#131316] text-[#4a4a4d]"
              : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
          }`}
          style={isSelected ? { backgroundColor: "var(--color-signal, #6E56CF)" } : undefined}
          aria-label={isSelected ? `Remove ${model.name} from compare` : `Add ${model.name} to compare`}
          aria-pressed={isSelected}
        >
          {isSelected ? <Check size={10} /> : <GitCompare size={10} />}
          {isSelected ? "Added" : "Compare"}
        </button>
      </div>
    </Link>
  );
}

export function ModelListView({
  models,
  loading = false,
  skeletonRows = 4,
}: ModelListViewProps) {
  const router = useRouter();
  const [compareSet, setCompareSet] = useState<AIModel[]>([]);

  const toggleCompare = (model: AIModel) => {
    setCompareSet((prev) => {
      const exists = prev.some((m) => m.id === model.id);
      if (exists) return prev.filter((m) => m.id !== model.id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, model];
    });
  };

  const clearCompare = () => setCompareSet([]);

  const goToCompare = () => {
    if (compareSet.length !== MAX_COMPARE) return;
    const ids = compareSet.map((m) => m.id).join(",");
    router.push(`/models/compare?ids=${ids}`);
  };

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
              <div className="ml-auto h-5 w-16 animate-pulse rounded-md bg-[#18181C]" />
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
    <>
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
            {models.map((model) => {
              const isSelected = compareSet.some((m) => m.id === model.id);
              return (
                <div key={model.id} role="listitem">
                  <ModelRow
                    model={model}
                    isSelected={isSelected}
                    isCompareFull={compareSet.length >= MAX_COMPARE}
                    onToggleCompare={toggleCompare}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {compareSet.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-[#232326]/70 bg-[#111113]/95 backdrop-blur px-4 py-3 shadow-2xl shadow-black/40">
            <div className="flex flex-1 items-center gap-2 min-w-0">
              {Array.from({ length: MAX_COMPARE }).map((_, i) => {
                const model = compareSet[i];
                return (
                  <div
                    key={i}
                    className={`flex flex-1 items-center gap-2 rounded-lg border px-2.5 py-1.5 min-w-0 ${
                      model ? "border-[#232326]/70 bg-[#18181C]" : "border-dashed border-[#232326]/50"
                    }`}
                  >
                    {model ? (
                      <>
                        <span className="truncate text-[12px] font-semibold text-white">
                          {model.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCompare(model)}
                          aria-label={`Remove ${model.name} from compare`}
                          className="ml-auto shrink-0 text-[#71717A] hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-[#71717A]">Select another model…</span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goToCompare}
              disabled={compareSet.length !== MAX_COMPARE}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                compareSet.length === MAX_COMPARE
                  ? "text-black"
                  : "cursor-not-allowed bg-[#18181C] text-[#4a4a4d]"
              }`}
              style={
                compareSet.length === MAX_COMPARE
                  ? { backgroundColor: "var(--color-signal, #6E56CF)" }
                  : undefined
              }
            >
              <GitCompare size={13} />
              Compare
            </button>

            <button
              type="button"
              onClick={clearCompare}
              aria-label="Clear compare selection"
              className="shrink-0 text-[#71717A] hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
