'use client';

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchX from 'lucide-react/dist/esm/icons/search-x';
import GitCompare from 'lucide-react/dist/esm/icons/git-compare';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import type { AIModel } from "@/lib/types";
import { formatModelType, MODEL_TYPE_OPTIONS } from "@/lib/types";
import { API_URL, prefetchUrl } from "@/lib/api";

const MAX_COMPARE = 2;

type ModelListViewProps = {
  models: AIModel[];
  loading?: boolean;
  skeletonRows?: number;
  /** Currently active modelType filter (empty string = all types). */
  selectedModelType?: string;
  /** Called with the new modelType value ("" clears the filter). */
  onModelTypeChange?: (value: string) => void;
  /** Currently active provider filter (empty string = all providers). */
  selectedProvider?: string;
  /** Provider filter options displayed in the COMPANY column header. */
  providerOptions?: Array<{ slug: string; name: string }>;
  /** Called with the new provider value ("" clears the filter). */
  onProviderChange?: (value: string) => void;
  /** Current release-date sort direction. */
  selectedReleaseSort?: "asc" | "desc";
  /** Called when the release-date sort direction changes. */
  onReleaseSortChange?: (value: "asc" | "desc") => void;
  /** Current open-source filter: empty = all, true = yes, false = no. */
  selectedOpenSource?: "" | "true" | "false";
  /** Called when the open-source filter changes. */
  onOpenSourceChange?: (value: "" | "true" | "false") => void;
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

function resolveProviderLogo(src: string | null | undefined, name: string) {
  if (name.trim().toLowerCase().includes("openai")) return "/logos/openai.svg";
  return src ?? null;
}

function BoolPill({
  value,
  trueLabel,
  falseLabel,
}: {
  value: boolean | undefined;
  trueLabel: string;
  falseLabel: string;
}) {
  if (value === undefined) {
    return <span className="text-[11px] text-[#71717A] font-mono">—</span>;
  }

  const accent = value
    ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-400"
    : "border-red-500/35 bg-red-500/10 text-red-400";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold transition-colors ${accent}`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

function TypeAccentChip({ label }: { label: string }) {
  const normalized = label.toLowerCase();

  const accent =
    normalized.includes("text")
      ? "border-sky-500/35 bg-sky-500/10 text-sky-400"
      : normalized.includes("vision") || normalized.includes("image")
        ? "border-violet-500/35 bg-violet-500/10 text-violet-400"
        : normalized.includes("audio") || normalized.includes("speech") || normalized.includes("voice")
          ? "border-amber-500/35 bg-amber-500/10 text-amber-400"
          : normalized.includes("video")
            ? "border-pink-500/35 bg-pink-500/10 text-pink-400"
            : normalized.includes("embedding")
              ? "border-cyan-500/35 bg-cyan-500/10 text-cyan-400"
              : normalized.includes("code") || normalized.includes("program")
                ? "border-green-500/35 bg-green-500/10 text-green-400"
                : normalized.includes("multimodal")
                  ? "border-indigo-500/35 bg-indigo-500/10 text-indigo-400"
                  : "border-[#52525B]/60 bg-[#18181C] text-[#A1A1AA]";

  return (
    <span
      className={`inline-flex max-w-full items-center truncate rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold transition-colors ${accent}`}
    >
      {label}
    </span>
  );
}

/**
 * Click-to-open filter dropdown embedded in the TYPE column header, anchored
 * by a small inverted-triangle (chevron) icon. Replaces the standalone
 * "Type" filter row that used to sit above the table.
 */
function TypeHeaderFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const activeLabel = value ? formatModelType(value) : null;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-1 text-[9.5px] font-mono font-semibold tracking-wider transition-colors ${
          value ? "text-white" : "text-[#71717A] hover:text-white"
        }`}
      >
        TYPE
        <ChevronDown
          size={10}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1.5 w-40 max-h-60 overflow-y-auto scrollbar-none rounded-lg border border-[#232326]/80 bg-[#131316] py-1 shadow-xl shadow-black/50">
          <button
            type="button"
            role="option"
            aria-selected={!value}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={`block w-full px-3 py-1.5 text-left text-[12px] font-medium normal-case tracking-normal transition-colors ${
              !value ? "bg-[#18181C] text-white" : "text-[#A1A1AA] hover:bg-[#18181C] hover:text-white"
            }`}
          >
            All types
          </button>
          {MODEL_TYPE_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              role="option"
              aria-selected={value === t}
              onClick={() => {
                onChange(t);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1.5 text-left text-[12px] font-medium normal-case tracking-normal transition-colors ${
                value === t ? "bg-[#18181C] text-white" : "text-[#A1A1AA] hover:bg-[#18181C] hover:text-white"
              }`}
            >
              {formatModelType(t)}
            </button>
          ))}
        </div>
      )}

      {activeLabel && (
        <span className="ml-1 hidden text-[9px] font-mono font-semibold text-[#6E56CF] sm:inline">
          · {activeLabel}
        </span>
      )}
    </div>
  );
}

function ProviderHeaderFilter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<{ slug: string; name: string }>;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const activeLabel = value ? options.find((p) => p.slug === value)?.name : null;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-1 text-[9.5px] font-mono font-semibold tracking-wider transition-colors ${
          value ? "text-white" : "text-[#71717A] hover:text-white"
        }`}
      >
        COMPANY
        <ChevronDown
          size={10}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-30 mt-1.5 w-44 max-h-60 overflow-y-auto scrollbar-none rounded-lg border border-[#232326]/80 bg-[#131316] py-1 shadow-xl shadow-black/50"
        >
          <button
            type="button"
            role="option"
            aria-selected={!value}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={`block w-full px-3 py-1.5 text-left text-[12px] font-medium normal-case tracking-normal transition-colors ${
              !value ? "bg-[#18181C] text-white" : "text-[#A1A1AA] hover:bg-[#18181C] hover:text-white"
            }`}
          >
            All companies
          </button>
          {options.map((p) => (
            <button
              key={p.slug}
              type="button"
              role="option"
              aria-selected={value === p.slug}
              onClick={() => {
                onChange(p.slug);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1.5 text-left text-[12px] font-medium normal-case tracking-normal transition-colors ${
                value === p.slug ? "bg-[#18181C] text-white" : "text-[#A1A1AA] hover:bg-[#18181C] hover:text-white"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {activeLabel && (
        <span className="ml-1 hidden max-w-28 truncate align-middle text-[9px] font-mono font-semibold text-[#6E56CF] sm:inline">
          · {activeLabel}
        </span>
      )}
    </div>
  );
}

function HeaderToggleButton({
  label,
  active,
  onClick,
  icon,
  ariaLabel,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 text-[9.5px] font-mono font-semibold tracking-wider transition-colors ${
        active ? "text-white" : "text-[#71717A] hover:text-white"
      }`}
    >
      {label}
      {icon}
    </button>
  );
}

function OpenSourceHeaderFilter({
  value,
  onChange,
}: {
  value: "" | "true" | "false";
  onChange: (value: "" | "true" | "false") => void;
}) {
  // Cycle through all three states: ALL -> YES -> NO -> ALL.
  const nextValue: "" | "true" | "false" =
    value === "" ? "true" : value === "true" ? "false" : "";
  const label = value === "true" ? "YES" : value === "false" ? "NO" : "ALL";

  return (
    <button
      type="button"
      onClick={() => onChange(nextValue)}
      aria-label={`Open source filter is ${label}. Click to switch to ${nextValue === "" ? "all" : nextValue === "true" ? "yes" : "no"}.`}
      className={`inline-flex items-center gap-1 text-[9.5px] font-mono font-semibold tracking-wider transition-colors ${
        value ? "text-white" : "text-[#71717A] hover:text-white"
      }`}
    >
      <span>OPEN SOURCE</span>
      <span className="inline-flex items-center gap-0.5 text-[8px] font-bold">
        {label}
      </span>
    </button>
  );
}

// Name | Company | Type | Primary Task | Released | Open Source | Compare
// The company logo is intentionally rendered inside the NAME cell.
const COL_TEMPLATE =
  "grid-cols-[minmax(220px,2.2fr)_minmax(110px,1fr)_minmax(90px,0.85fr)_minmax(110px,1fr)_minmax(100px,0.9fr)_minmax(90px,0.8fr)_minmax(100px,0.85fr)]";

const COL_MIN_WIDTH = "min-w-[960px]";

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
  const companyLogo = resolveProviderLogo(model.provider?.logoUrl, companyName);
  const [logoFailed, setLogoFailed] = useState(false);
  const typeLabel = formatModelType(model.modelType) || model.modality || null;

  useEffect(() => {
    setLogoFailed(false);
  }, [companyLogo]);
  const primaryTask = model.primaryTask ?? null;
  const openSource =
    model.openSource === undefined ? undefined : isTruthy(model.openSource);

  return (
    <Link
      href={`/models/${model.id}`}
      onMouseEnter={() => {
        prefetchUrl(`${API_URL}/api/v1/models/${encodeURIComponent(model.id)}`);
      }}
      onTouchStart={() => {
        prefetchUrl(`${API_URL}/api/v1/models/${encodeURIComponent(model.id)}`);
      }}
      onFocus={() => {
        prefetchUrl(`${API_URL}/api/v1/models/${encodeURIComponent(model.id)}`);
      }}
      className={`group relative grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-3 bg-transparent px-4 py-2.5 transition-colors hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none`}
    >
      <span className="pointer-events-none absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-signal,#6E56CF)] transition-all duration-200 group-hover:h-[70%]" />

      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white">
          {companyLogo && !logoFailed ? (
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              width={36}
              height={36}
              loading="lazy"
              decoding="async"
              className="h-8 w-8 object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span
              aria-label={`${companyName} logo`}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 text-base font-bold text-neutral-900"
            >
              {companyName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-semibold text-white">{model.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A1A1AA] leading-snug">
            {model.description}
          </p>
        </div>
      </div>

      <div className="min-w-0 truncate text-[12px] text-white">{companyName}</div>

      <div className="min-w-0 overflow-hidden">
        {typeLabel ? (
          <TypeAccentChip label={typeLabel} />
        ) : (
          <span className="text-[11px] text-[#71717A]">—</span>
        )}
      </div>

      <div className="min-w-0 truncate text-[11px] text-[#A1A1AA]">
        {primaryTask || <span className="text-[#71717A]">—</span>}
      </div>

      <div className="text-[11px] font-mono text-[#A1A1AA]">
        {formatReleased(model.releaseDate)}
      </div>

      <div>
        <BoolPill value={openSource} trueLabel="YES" falseLabel="NO" />
      </div>

      <div className="text-center">
        <button
          type="button"
          disabled={!isSelected && isCompareFull}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleCompare(model);
          }}
          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-[10px] font-mono font-semibold transition-colors ${
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
          {isSelected ? <Check size={11} /> : <GitCompare size={11} />}
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
  selectedModelType = "",
  onModelTypeChange,
  selectedProvider = "",
  providerOptions = [],
  onProviderChange,
  selectedReleaseSort = "desc",
  onReleaseSortChange,
  selectedOpenSource = "",
  onOpenSourceChange,
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
              className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-3 px-4 py-2.5`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-[#18181C]" />
                <div className="space-y-1.5">
                <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
                  <div className="h-2 w-64 animate-pulse rounded bg-[#18181C]" />
                </div>
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
      <div
        className={`flex flex-col rounded-lg border border-[#232326]/60 bg-[#131316]/10 overflow-hidden ${
          compareSet.length > 0 ? "mb-24" : ""
        }`}
      >
        <div className="overflow-x-auto touch-scroll-x">
          <div className="border-b border-[#232326]/60 bg-[#131316]/40">
            <div className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-3 px-4 py-2`}>
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">NAME</span>
              {onProviderChange ? (
                <ProviderHeaderFilter
                  value={selectedProvider}
                  options={providerOptions}
                  onChange={onProviderChange}
                />
              ) : (
                <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">COMPANY</span>
              )}

              {onModelTypeChange ? (
                <TypeHeaderFilter value={selectedModelType} onChange={onModelTypeChange} />
              ) : (
                <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">TYPE</span>
              )}

              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">PRIMARY TASK</span>
              {onReleaseSortChange ? (
                <HeaderToggleButton
                  label="RELEASED"
                  active
                  onClick={() => onReleaseSortChange(selectedReleaseSort === "asc" ? "desc" : "asc")}
                  ariaLabel={`Sort released ${selectedReleaseSort === "asc" ? "descending" : "ascending"}`}
                  icon={selectedReleaseSort === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                />
              ) : (
                <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">RELEASED</span>
              )}
              {onOpenSourceChange ? (
                <OpenSourceHeaderFilter value={selectedOpenSource} onChange={onOpenSourceChange} />
              ) : (
                <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">OPEN SOURCE</span>
              )}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] text-center">COMPARE</span>
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
        <div className="fixed inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-2 sm:px-4">
          <div className="flex w-full max-w-xl items-center gap-2 sm:gap-3 rounded-xl border border-[#232326]/70 bg-[#111113]/95 backdrop-blur px-3 sm:px-4 py-2.5 sm:py-3 shadow-2xl shadow-black/60">
            <div className="flex flex-1 items-center gap-1.5 sm:gap-2 min-w-0">
              {Array.from({ length: MAX_COMPARE }).map((_, i) => {
                const model = compareSet[i];
                return (
                  <div
                    key={i}
                    className={`flex flex-1 items-center gap-1.5 sm:gap-2 rounded-lg border px-2 sm:px-2.5 py-1.5 min-w-0 ${
                      model ? "border-[#232326]/70 bg-[#18181C]" : "border-dashed border-[#232326]/50"
                    }`}
                  >
                    {model ? (
                      <>
                        <span className="truncate text-[11px] sm:text-[12px] font-semibold text-white">
                          {model.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCompare(model)}
                          aria-label={`Remove ${model.name} from compare`}
                          className="ml-auto shrink-0 text-[#71717A] hover:text-white p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] text-[#71717A] truncate">Select model…</span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goToCompare}
              disabled={compareSet.length !== MAX_COMPARE}
              className={`shrink-0 inline-flex items-center gap-1 sm:gap-1.5 rounded-lg px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-[12px] font-semibold transition-colors ${
                compareSet.length === MAX_COMPARE
                  ? "text-white shadow-md shadow-[#6E56CF]/30"
                  : "cursor-not-allowed bg-[#18181C] text-[#4a4a4d]"
              }`}
              style={
                compareSet.length === MAX_COMPARE
                  ? { backgroundColor: "var(--color-signal, #6E56CF)" }
                  : undefined
              }
            >
              <GitCompare size={13} />
              <span className="hidden 2xs:inline">Compare</span>
            </button>

            <button
              type="button"
              onClick={clearCompare}
              aria-label="Clear compare selection"
              className="shrink-0 text-[#71717A] hover:text-white p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
