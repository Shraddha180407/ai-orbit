'use client';

import React, { useState, useTransition, Suspense, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchX from 'lucide-react/dist/esm/icons/search-x';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import BadgeCheck from 'lucide-react/dist/esm/icons/badge-check';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import GitCompare from 'lucide-react/dist/esm/icons/git-compare';
import { useQueryClient } from "@tanstack/react-query";
import { PricingBadge } from "@/components/PricingBadge";
import { CategoryChip } from "@/components/CategoryChip";
import type { ToolCardData } from "@/lib/types";
import { useUser } from "@/hooks/use-user";
import { toggleBookmark } from "@/lib/actions";
import { API_URL } from "@/lib/api";

const MAX_COMPARE = 2;

const ROW_ACCENT_COLORS = [
  "#6E56CF", "#E85D4A", "#0082FB", "#34A853",
  "#FF9900", "#E91E8C", "#00BCD4", "#FF6B35",
];

type ListTool = ToolCardData & {
  createdAt?: string | null;
  releaseDate?: string | null;
  isOpenSource?: boolean;
  openSource?: boolean;
  isTrending?: boolean;
  trending?: boolean;
  hasApi?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  compatibility?: string[];
  websiteUrl?: string | null;
  ttasks?: { task: { slug: string; title: string } }[];
};

type ToolListViewProps = {
  tools: ListTool[];
  loading?: boolean;
  skeletonRows?: number;
};

// ── Column layout (matches devices-client exactly) ──────────────────────────
// logo | name+desc | task | pricing | api | open-source | compatibility | released | share | bookmark | compare
const COL_TEMPLATE =
  "grid-cols-[44px_minmax(200px,2.5fr)_minmax(110px,1.1fr)_minmax(110px,1.1fr)_minmax(60px,0.6fr)_minmax(90px,0.9fr)_minmax(110px,1.1fr)_minmax(100px,1fr)_44px_44px_44px]";
const COL_MIN_WIDTH = "min-w-[1100px]";

// ── Formatters ───────────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatReleased(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function isTruthy(...vals: Array<unknown>): boolean {
  return vals.some((v) => v === true || v === "true" || v === 1 || v === "1");
}

// ── Filter icon (same as devices-client) ────────────────────────────────────
function FilterIcon({ active }: { active?: boolean }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      className={active ? "text-[#6E56CF]" : "text-[#52525B] hover:text-white"}>
      <line x1="4" y1="6" x2="20" y2="6"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
      <line x1="11" y1="18" x2="13" y2="18"/>
    </svg>
  );
}

// ── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <span className="text-[#3a3a3a] text-[10px]">↕</span>;
  return <span className="text-[#6E56CF] text-[10px]">{dir === "desc" ? "↓" : "↑"}</span>;
}

// ── Logo image with fallback ─────────────────────────────────────────────────
function LogoCell({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const [failed, setFailed] = React.useState(false);
  if (!logoUrl || failed) {
    return <span className="text-xs font-bold text-neutral-900">{name.charAt(0)}</span>;
  }
  return (
    <img
      src={logoUrl}
      alt={name}
      className="h-8 w-8 object-contain"
      onError={() => setFailed(true)}
    />
  );
}

// ── Bool pill (API / Open-Source) ────────────────────────────────────────────
function BoolPill({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors">      {value ? trueLabel : falseLabel}
    </span>
  );
}

// ── Share button ─────────────────────────────────────────────────────────────
function ShareButton({ tool }: { tool: ListTool }) {
  const [copied, setCopied] = useState(false);
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/tools/${tool.slug}`;
    const shareData = {
      title: tool.name,
      text: tool.description ?? "",
      url,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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

// ── Bookmark button ───────────────────────────────────────────────────────────
function BookmarkBtn({ tool }: { tool: ListTool }) {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const [bookmarked, setBookmarked] = useState<boolean>(!!(tool as any).bookmarked);
  const [isPending, startTransition] = useTransition();

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { router.push("/auth/signin"); return; }
    const next = !bookmarked;
    setBookmarked(next);
    startTransition(async () => {
      try {
        const result = await toggleBookmark(tool.id, tool.slug);
        setBookmarked(result.bookmarked);
      } catch {
        setBookmarked(bookmarked);
      }
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleBookmark}
      className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors disabled:opacity-60 ${
        bookmarked
          ? "border-[#6E56CF] text-[#6E56CF]"
          : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
      }`}
      aria-label={bookmarked ? `Remove bookmark for ${tool.name}` : `Bookmark ${tool.name}`}
      aria-pressed={bookmarked}
    >
      {bookmarked ? <Check size={14} /> : <Bookmark size={14} />}
    </button>
  );
}

// ── Single row ────────────────────────────────────────────────────────────────
function ToolRow({
  tool,
  index,
  isSelected,
  isCompareFull,
  onToggleCompare,
  basePath = "/tools",
}: {
  tool: ListTool;
  index: number;
  isSelected: boolean;
  isCompareFull: boolean;
  onToggleCompare: (t: ListTool) => void;
  basePath?: string;
}) {
  const queryClient = useQueryClient();
  const accentColor = ROW_ACCENT_COLORS[index % ROW_ACCENT_COLORS.length];
  const isOpenSource = isTruthy(tool.isOpenSource, tool.openSource);
  const hasApi = isTruthy(tool.hasApi);

  return (
    <Link
      href={`${basePath}/${tool.slug}`}
      role="listitem"
      className={`group grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-3 px-4 py-3 transition-all duration-200 focus-visible:outline-none border-b border-[#232326]/60 relative`}
      onPointerEnter={(e) => {
        if (tool?.slug) {
          queryClient.prefetchQuery({
            queryKey: ["tool-detail", tool.slug],
            queryFn: async () => {
              const res = await fetch(`${API_URL}/api/v1/tools/${tool.slug}`, { credentials: "include" });
              if (!res.ok) throw new Error("Tool not found");
              return res.json();
            },
            staleTime: 10 * 60 * 1000,
          }).catch(() => {});
        }
        const el = e.currentTarget;
        el.style.boxShadow = `inset 3px 0 0 ${accentColor}`;
        const logoEl = el.querySelector<HTMLElement>('[data-logo="true"]');
        if (logoEl) { logoEl.style.borderColor = accentColor; logoEl.style.boxShadow = `0 0 8px ${accentColor}55`; }
        const nameEl = el.querySelector<HTMLElement>('[data-name="true"]');
        if (nameEl) nameEl.style.color = accentColor;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = "";
        const logoEl = el.querySelector<HTMLElement>('[data-logo="true"]');
        if (logoEl) { logoEl.style.borderColor = ""; logoEl.style.boxShadow = ""; }
        const nameEl = el.querySelector<HTMLElement>('[data-name="true"]');
        if (nameEl) nameEl.style.color = "";
      }}
    >
      {/* Col 1: Logo */}
      <div
        data-logo="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white transition-all duration-200"
      >
        <LogoCell name={tool.name} logoUrl={tool.logoUrl} />
      </div>

      {/* Col 2: Name + description */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3
            data-name="true"
            className="truncate text-[13px] font-semibold text-white transition-colors duration-200"
          >
            {tool.name}
          </h3>
          {tool.isVerified && (
            <BadgeCheck size={13} className="shrink-0 text-blue-400" aria-label="Verified" />
          )}
          {tool.isFeatured && (
            <Sparkles size={13} className="shrink-0 text-amber-400 fill-amber-400" aria-label="Featured" />
          )}
          {tool.websiteUrl ? (
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#71717A] hover:text-white transition-colors shrink-0"
              aria-label={`Visit ${tool.name} website`}
            >
              <ExternalLink size={13} />
            </a>
          ) : (
            <span className="text-[#71717A] opacity-30 shrink-0"><ExternalLink size={13} /></span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A1A1AA] leading-snug pr-2">
          {tool.description}
        </p>
      </div>

      {/* Col 3: Task */}
      <div className="min-w-0">
        {tool.ttasks && tool.ttasks.length > 0 ? (
          <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA] max-w-full truncate block">
            {tool.ttasks[0].task.title}
          </span>
        ) : (
          <span className="text-[11px] text-[#71717A] font-mono">—</span>
        )}
      </div>

      {/* Col 4: Pricing */}
      <div>
        <PricingBadge
  pricingModel={tool.pricingModel}
  pricingAmount={tool.pricingAmount}
  billingFrequency={tool.billingFrequency}
  className="text-[10px] px-2 py-0.5"
/>
      </div>

      {/* Col 5: API */}
      <div>
        <BoolPill value={hasApi} trueLabel="YES" falseLabel="NO" />
      </div>

      {/* Col 6: Open-Source */}
      <div>
        <BoolPill value={isOpenSource} trueLabel="YES" falseLabel="NO" />
      </div>

      {/* Col 7: Compatibility */}
      <div className="min-w-0">
        {tool.compatibility && tool.compatibility.length > 0 ? (
          <div className="flex gap-1 flex-wrap">
            {tool.compatibility.slice(0, 2).map((c, i) => (
              <span key={i} className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                {c}
              </span>
            ))}
            {tool.compatibility.length > 2 && (
              <span className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                +{tool.compatibility.length - 2}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-[#71717A] font-mono">—</span>
        )}
      </div>

      {/* Col 8: Released */}
      <div className="text-[10px] font-mono text-[#A1A1AA]">
        {formatReleased(tool.releaseDate)}
      </div>

      {/* Col 9: Share */}
      <div onClick={(e) => e.preventDefault()}>
        <ShareButton tool={tool} />
      </div>

      {/* Col 10: Bookmark */}
      <div onClick={(e) => e.preventDefault()}>
        <BookmarkBtn tool={tool} />
      </div>

      {/* Col 11: Compare */}
      <div onClick={(e) => e.preventDefault()}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleCompare(tool);
          }}
          disabled={!isSelected && isCompareFull}
          className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
            isSelected
              ? "border-[#6E56CF] text-[#6E56CF]"
              : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
          }`}
          aria-label={isSelected ? `Remove ${tool.name} from compare` : `Add ${tool.name} to compare`}
        >
          <GitCompare size={14} />
        </button>
      </div>
    </Link>
  );
}

const MemoizedToolRow = React.memo(ToolRow);

// ── Main component ────────────────────────────────────────────────────────────
function ToolListViewInner({ tools, loading = false, skeletonRows = 6 }: ToolListViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [compareSet, setCompareSet] = useState<ListTool[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Name filter
  const [nameInput, setNameInput] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  // Sort
  type SortKey = "released" | "name";
  const [sortKey, setSortKey] = useState<SortKey>("released");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let basePath = "/tools";
  if (pathname === "/personal" || pathname === "/creativity" || pathname === "/agents") basePath = pathname;

  const toggleCompare = (tool: ListTool) => {
    setCompareSet((prev) => {
      const exists = prev.some((t) => t.id === tool.id);
      if (exists) return prev.filter((t) => t.id !== tool.id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, tool];
    });
  };

  const goToCompare = () => {
    if (compareSet.length !== MAX_COMPARE) return;
    const slugs = compareSet.map((t) => t.slug).join(",");
    router.push(`/tools/compare?slugs=${slugs}`);
  };

  // Apply local name filter + sort on top of server-fetched tools
  const filtered = React.useMemo(() => {
    let list = [...tools];
    if (nameSearch.trim()) {
      const q = nameSearch.toLowerCase();
      list = list.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.company?.name?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else cmp = ((b as any).releaseDate || b.createdAt || "").localeCompare((a as any).releaseDate || a.createdAt || "");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [tools, nameSearch, sortKey, sortDir]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-[#232326]/60 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#131316] [&::-webkit-scrollbar-thumb]:bg-[#6E56CF]/40 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div style={{ minWidth: "1200px" }} className="bg-[#000000]">
          <div className="flex flex-col divide-y divide-[#232326]/60">
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <div key={i} className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-3 px-4 py-3`}>
                <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
                <div className="space-y-1.5">
                  <div className="h-3 w-32 animate-pulse rounded bg-[#18181C]" />
                  <div className="h-2 w-48 animate-pulse rounded bg-[#18181C]" />
                </div>
                <div className="h-4 w-16 animate-pulse rounded-full bg-[#18181C]" />
                <div className="h-4 w-16 animate-pulse rounded-full bg-[#18181C]" />
                <div className="h-4 w-8 animate-pulse rounded-full bg-[#18181C]" />
                <div className="h-4 w-8 animate-pulse rounded-full bg-[#18181C]" />
                <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
                <div className="h-3 w-16 animate-pulse rounded bg-[#18181C]" />
                <div className="h-7 w-7 animate-pulse rounded-md bg-[#18181C]" />
                <div className="h-7 w-7 animate-pulse rounded-md bg-[#18181C]" />
                <div className="h-7 w-7 animate-pulse rounded-md bg-[#18181C]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#232326] bg-[#131316]/40 py-16 text-center">
        <SearchX size={28} className="text-[#71717A]" />
        <div>
          <p className="text-sm font-medium text-white">No tools match your filters</p>
          <p className="mt-1 text-xs text-[#A1A1AA]">Try a different search term or clear a filter.</p>
        </div>
      </div>
    );
  }

  // ── Table ───────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        ref={dropdownRef}
        className="overflow-x-auto rounded-lg border border-[#232326]/60 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#131316] [&::-webkit-scrollbar-thumb]:bg-[#6E56CF]/40 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <div style={{ minWidth: "1200px" }} className="relative bg-[#000000]">

          {/* ── Header row ───────────────────────────────────────────────────── */}
          <div className="border-b border-[#232326]/60 bg-[#131316]/40">
            <div className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-3 px-4 py-3`}>

              {/* Logo col — no label */}
              <div />

              {/* TOOL col — name filter */}
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => handleSort("name")}
                  className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] hover:text-white transition-colors flex items-center gap-1"
                >
                  TOOL <SortIcon active={sortKey === "name"} dir={sortDir} />
                </button>
                <button onClick={() => setOpenDropdown(openDropdown === "name" ? null : "name")} className="hover:text-white transition-colors">
                  <FilterIcon active={nameSearch.length > 0} />
                </button>
                {openDropdown === "name" && (
                  <div className="absolute top-8 left-0 z-50 bg-[#18181C] border border-[#232326] rounded-lg shadow-xl p-3 min-w-[210px]">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Filter by name..."
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { setNameSearch(nameInput); setOpenDropdown(null); } }}
                      className="w-full bg-[#131316] border border-[#232326] text-white text-xs rounded px-2 py-1.5 placeholder:text-[#52525B] focus:outline-none focus:border-[#6E56CF]"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => { setNameSearch(nameInput); setOpenDropdown(null); }}
                        className="flex-1 text-[10px] bg-[#6E56CF] hover:bg-[#7C66DF] text-white py-1.5 rounded transition-colors font-semibold"
                      >Apply</button>
                      {nameSearch && (
                        <button
                          onClick={() => { setNameSearch(""); setNameInput(""); setOpenDropdown(null); }}
                          className="flex-1 text-[10px] border border-[#232326] text-[#52525B] hover:text-white py-1.5 rounded transition-colors"
                        >Clear</button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* TASK */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">TASK</span>

              {/* PRICING */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">PRICING</span>

              {/* API */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">API</span>

              {/* OPEN-SOURCE */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">OPEN-SOURCE</span>

              {/* COMPATIBILITY */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">COMPATIBILITY</span>

              {/* RELEASED */}
              <button
                onClick={() => handleSort("released")}
                className="text-[9.5px] font-mono font-semibold tracking-wider text-[#6E56CF] hover:text-white transition-colors flex items-center gap-1"
              >
                RELEASED <SortIcon active={sortKey === "released"} dir={sortDir} />
              </button>

              {/* SHARE */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">SHARE</span>

              {/* BOOKMARK */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">SAVE</span>

              {/* COMPARE */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">CMP</span>
            </div>
          </div>

          {/* ── Rows ─────────────────────────────────────────────────────────── */}
          <div role="list" className="flex flex-col">
            {filtered.map((tool, i) => (
              <MemoizedToolRow
                key={tool.id}
                tool={tool}
                index={i}
                isSelected={compareSet.some((t) => t.id === tool.id)}
                isCompareFull={compareSet.length >= MAX_COMPARE}
                onToggleCompare={toggleCompare}
                basePath={basePath}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky compare bar ───────────────────────────────────────────────── */}
      {compareSet.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-[#232326]/70 bg-[#111113]/95 backdrop-blur px-4 py-3 shadow-2xl shadow-black/40">
            <div className="flex flex-1 items-center gap-2 min-w-0">
              {Array.from({ length: MAX_COMPARE }).map((_, i) => {
                const t = compareSet[i];
                return (
                  <div key={i} className={`flex flex-1 items-center gap-2 rounded-lg border px-2.5 py-1.5 min-w-0 ${t ? "border-[#232326]/70 bg-[#18181C]" : "border-dashed border-[#232326]/50"}`}>
                    {t ? (
                      <>
                        <span className="truncate text-[12px] font-semibold text-white">{t.name}</span>
                        <button type="button" onClick={() => toggleCompare(t)} className="ml-auto shrink-0 text-[#71717A] hover:text-white">
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-[#71717A]">Select another tool…</span>
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
                compareSet.length === MAX_COMPARE ? "text-black" : "cursor-not-allowed bg-[#18181C] text-[#4a4a4d]"
              }`}
              style={compareSet.length === MAX_COMPARE ? { backgroundColor: "#6E56CF" } : undefined}
            >
              <GitCompare size={13} /> Compare
            </button>
            <button type="button" onClick={() => setCompareSet([])} className="shrink-0 text-[#71717A] hover:text-white">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function ToolListView(props: ToolListViewProps) {
  return (
    <Suspense fallback={<div className="min-h-[400px] w-full rounded-lg border border-[#232326]/60 bg-[#131316]/10 animate-pulse" />}>
      <ToolListViewInner {...props} />
    </Suspense>
  );
}