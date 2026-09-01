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
import { PricingBadge } from "@/components/PricingBadge";
import { CategoryChip } from "@/components/CategoryChip";
import type { ToolCardData } from "@/lib/types";
import { useUser } from "@/hooks/use-user";
import { toggleBookmark } from "@/lib/actions";
import { API_URL, prefetchUrl } from "@/lib/api";

function trimNoDots(text: string, maxLength = 85) {
  if (!text) return "—";
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  return sliced.slice(0, lastSpace > 0 ? lastSpace : maxLength);
}
const MAX_COMPARE = 2;

const ROW_ACCENT_COLORS = [
  "#6E56CF", "#E85D4A", "#0082FB", "#34A853",
  "#FF9900", "#E91E8C", "#00BCD4", "#FF6B35",
];

type ListTool = ToolCardData & {
  entityType?: string;
  createdAt?: string | null;
  releaseDate?: string | null;
  isOpenSource?: boolean;
  openSource?: boolean;
  isTrending?: boolean;
  trending?: boolean;
  launchDate?: string | null;
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

// FIXED: Removed the Compatibility column from the MIXED feed grid templates
const COL_TEMPLATE_MIXED = "grid-cols-[48px_200px_minmax(150px,1.6fr)_minmax(110px,1.1fr)_minmax(60px,0.6fr)_minmax(90px,0.9fr)_minmax(80px,0.7fr)_44px_44px_60px] md:grid-cols-[60px_minmax(280px,3.5fr)_minmax(150px,1.6fr)_minmax(110px,1.1fr)_minmax(60px,0.6fr)_minmax(90px,0.9fr)_minmax(80px,0.7fr)_44px_44px_60px]";
const COL_MIN_WIDTH_MIXED = "min-w-fit md:min-w-[1070px]";

// Tool feed layout remains exactly the same
const COL_TEMPLATE_SPLIT = "grid-cols-[48px_85px_175px_minmax(150px,1.6fr)_minmax(110px,1.1fr)_minmax(60px,0.6fr)_minmax(90px,0.9fr)_minmax(80px,0.7fr)_minmax(80px,0.7fr)_44px_44px_60px] md:grid-cols-[60px_minmax(280px,3.5fr)_minmax(150px,1.6fr)_minmax(110px,1.1fr)_minmax(60px,0.6fr)_minmax(90px,0.9fr)_minmax(80px,0.7fr)_minmax(80px,0.7fr)_44px_44px_60px]";
const COL_MIN_WIDTH_SPLIT = "min-w-fit md:min-w-[1150px]";

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

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <span className="text-[#3a3a3a] text-[10px]">↕</span>;
  return <span className="text-[#6E56CF] text-[10px]">{dir === "desc" ? "↓" : "↑"}</span>;
}

function LogoCell({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const [failed, setFailed] = React.useState(false);
  if (!logoUrl || failed) {
    return <span className="text-[10px] md:text-xs font-bold text-neutral-900">{name.charAt(0)}</span>;
  }
  return (
    <img
      src={logoUrl}
      alt={name}
      className="h-6 w-6 md:h-8 md:w-8 object-contain"
      onError={() => setFailed(true)}
    />
  );
}

function BoolPill({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors">      
      {value ? trueLabel : falseLabel}
    </span>
  );
}

function ShareButton({ tool }: { tool: ListTool }) {
  const [copied, setCopied] = useState(false);
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let targetPath = '/tools';
    let identifier = tool.slug;
    if (tool.entityType === 'COMPANY') targetPath = '/companies';
    if (tool.entityType === 'VIDEO') targetPath = '/videos';
    if (tool.entityType === 'NEWS') targetPath = '/news';
    if (tool.entityType === 'ROBOT') targetPath = '/robots';
    if (tool.entityType === 'DEVICE') targetPath = '/devices';
    if (tool.entityType === 'REPOSITORY') targetPath = '/repositories';
    
    if (tool.entityType === 'MODEL') {
      targetPath = '/models';
      identifier = tool.id;
    }
    const url = `${window.location.origin}${targetPath}/${identifier}`;
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

function ToolRow({
  tool,
  index,
  isSelected,
  isCompareFull,
  onToggleCompare,
  basePath = "/tools",
  isMixedFeed = false,
}: {
  tool: ListTool;
  index: number;
  isSelected: boolean;
  isCompareFull: boolean;
  onToggleCompare: (t: ListTool) => void;
  basePath?: string;
  isMixedFeed?: boolean;
}) {
  const router = useRouter();
  const accentColor = ROW_ACCENT_COLORS[index % ROW_ACCENT_COLORS.length];
  const isOpenSource = isTruthy(tool.isOpenSource, tool.openSource);
  const hasApi = isTruthy(tool.hasApi);

  const activeTemplate = isMixedFeed ? COL_TEMPLATE_MIXED : COL_TEMPLATE_SPLIT;
  const activeMinWidth = isMixedFeed ? COL_MIN_WIDTH_MIXED : COL_MIN_WIDTH_SPLIT;

  let targetPath = basePath;
  let identifier = tool.slug;
  if (tool.entityType === 'COMPANY') targetPath = '/companies';
  else if (tool.entityType === 'VIDEO') targetPath = '/videos';
  else if (tool.entityType === 'NEWS') targetPath = '/news';
  else if (tool.entityType === 'ROBOT') targetPath = '/robots';
  else if (tool.entityType === 'DEVICE') targetPath = '/devices';
  else if (tool.entityType === 'REPOSITORY') targetPath = '/repositories';
  else if (tool.entityType === 'MODEL') {
    targetPath = '/models';
    identifier = tool.id;
  } else if (tool.entityType === 'TOOL') {
    targetPath = '/tools';
  }
  const targetUrl = `${targetPath}/${identifier}`;

  const prefetchRow = () => {
    try { router.prefetch(targetUrl); } catch {}
  };

  return (
    <div
      onClick={() => router.push(targetUrl)}
      role="listitem"
      className={`cursor-pointer group grid ${activeTemplate} ${activeMinWidth} items-center gap-3 py-3 transition-all duration-200 focus-visible:outline-none border-b border-[#232326]/60 relative`}
      onMouseEnter={(e) => {
        prefetchRow();
        const el = e.currentTarget;
        const firstCell = el.querySelector<HTMLElement>('[data-sticky-first="true"]');
        if (firstCell) firstCell.style.boxShadow = `inset 3px 0 0 ${accentColor}`;
        
        const logoEl = el.querySelector<HTMLElement>('[data-logo="true"]');
        if (logoEl) { logoEl.style.borderColor = accentColor; logoEl.style.boxShadow = `0 0 8px ${accentColor}55`; }
        const nameEl = el.querySelector<HTMLElement>('[data-name="true"]');
        if (nameEl) nameEl.style.color = accentColor;
      }}
      onFocus={prefetchRow}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        const firstCell = el.querySelector<HTMLElement>('[data-sticky-first="true"]');
        if (firstCell) firstCell.style.boxShadow = "";

        const logoEl = el.querySelector<HTMLElement>('[data-logo="true"]');
        if (logoEl) { logoEl.style.borderColor = ""; logoEl.style.boxShadow = ""; }
        const nameEl = el.querySelector<HTMLElement>('[data-name="true"]');
        if (nameEl) nameEl.style.color = "";
      }}
    >
      <div
        data-sticky-first="true"
        className={`${!isMixedFeed ? "sticky left-0 md:static z-20 shadow-[10px_0_10px_-10px_rgba(0,0,0,0.5)] md:shadow-none" : ""} flex h-full items-center bg-[#000000] md:bg-transparent pl-4 transition-all duration-200`}
      >
        <div
          data-logo="true"
          className="flex h-8 w-8 md:h-11 md:w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white group-hover:border-[#6E56CF] transition-colors"
        >
          <LogoCell name={tool.name} logoUrl={tool.logoUrl} />
        </div>
      </div>

      {isMixedFeed ? (
        <div className="min-w-0 flex flex-col justify-center pr-4 md:pr-0 transition-colors h-full">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3
              data-name="true"
              className="truncate text-[13px] font-semibold text-white transition-colors duration-200"
            >
              {tool.name}
            </h3>
            {tool.isVerified && (
              <BadgeCheck size={14} className="shrink-0 text-blue-400" aria-label="Verified" />
            )}
            {tool.isFeatured && (
              <Sparkles size={14} className="shrink-0 text-amber-400 fill-amber-400" aria-label="Featured" />
            )}
            {tool.websiteUrl ? (
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#71717A] hover:text-white transition-colors shrink-0 hidden md:inline-flex"
                aria-label={`Visit ${tool.name} website`}
              >
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="text-[#71717A] opacity-30 shrink-0 hidden md:inline-flex"><ExternalLink size={14} /></span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-[#A1A1AA] leading-snug pr-2 whitespace-nowrap overflow-hidden text-ellipsis md:text-clip">
            {trimNoDots(tool.description || "")}
          </p>
        </div>
      ) : (
        <>
          <div className="min-w-0 sticky left-[60px] md:static z-20 bg-[#000000] group-hover:bg-[#18181C] md:bg-transparent md:group-hover:bg-transparent h-full flex flex-col justify-center before:content-[''] before:absolute before:inset-y-0 before:-left-[12px] before:w-[12px] before:bg-[#000000] group-hover:before:bg-[#18181C] md:before:hidden shadow-[10px_0_10px_-10px_rgba(0,0,0,0.5)] md:shadow-none pr-1 md:pr-0 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1.5 min-w-0">
              <h3
                data-name="true"
                className="text-[11.5px] md:text-[13px] line-clamp-2 md:truncate font-semibold text-white transition-colors duration-200 leading-tight break-words"
              >
                {tool.name}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
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
                    className="text-[#71717A] hover:text-white transition-colors shrink-0 hidden md:inline-flex"
                    aria-label={`Visit ${tool.name} website`}
                  >
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <span className="text-[#71717A] opacity-30 shrink-0 hidden md:inline-flex"><ExternalLink size={13} /></span>
                )}
              </div>
            </div>
            <p className="hidden md:block mt-0.5 text-[11px] text-[#A1A1AA] leading-snug pr-2 whitespace-nowrap overflow-hidden text-ellipsis md:text-clip">
              {trimNoDots(tool.description || "")}
            </p>
          </div>

          <div className="md:hidden min-w-0 flex flex-col justify-center pr-2 h-full">
            <p className="text-[11px] text-[#A1A1AA] leading-snug pr-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {trimNoDots(tool.description || "")}
            </p>
          </div>
        </>
      )}

      {/* Col 3: Task */}
      <div className="min-w-0 pl-4 md:pl-0">
        {tool.ttasks && tool.ttasks.length > 0 ? (
          <span className="inline-flex items-center rounded-md border border-[#232326] bg-[#1A1A1E] px-2.5 py-0.5 text-[10px] font-medium text-[#D4D4D8] whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">
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
          className="text-[10px] px-2.5 py-0.5"
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

      {/* Col 7: Compatibility (Hidden in Mixed Feed) */}
      {!isMixedFeed && (
        <div className="min-w-0">
          {tool.compatibility && tool.compatibility.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {tool.compatibility.slice(0, 2).map((c, i) => (
                <span key={i} className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-2 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                  {c}
                </span>
              ))}
              {tool.compatibility.length > 2 && (
                <span className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-2 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                  +{tool.compatibility.length - 2}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[11px] text-[#71717A] font-mono">—</span>
          )}
        </div>
      )}

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
      <div onClick={(e) => e.preventDefault()} className="pr-4">
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
    </div>
  );
}

const MemoizedToolRow = React.memo(ToolRow);

function ToolListViewInner({ tools, loading = false, skeletonRows = 6 }: ToolListViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [compareSet, setCompareSet] = useState<ListTool[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [nameInput, setNameInput] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  type SortKey = "released" | "name";
  const [sortKey, setSortKey] = useState<SortKey>("released");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

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
      const getScore = (t: ListTool) => {
        if (t.ttasks && t.ttasks.length > 0) return 3; 
        if (t.logoUrl && t.description && t.description.trim() !== "") return 2; 
        return 1; 
      };

      const scoreA = getScore(a);
      const scoreB = getScore(b);

      if (scoreA !== scoreB) {
        return scoreB - scoreA; 
      }

      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else cmp = ((b as any).releaseDate || b.createdAt || "").localeCompare((a as any).releaseDate || a.createdAt || "");
      
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [tools, nameSearch, sortKey, sortDir]);

  const isMixedFeed = tools.some(t => 
    t.entityType === 'NEWS' || t.entityType === 'VIDEO' || t.entityType === 'ROBOT' || 
    t.entityType === 'COMPANY' || t.entityType === 'DEVICE' || t.entityType === 'MODEL' || t.entityType === 'REPOSITORY'
  );
  
  const activeTemplate = isMixedFeed ? COL_TEMPLATE_MIXED : COL_TEMPLATE_SPLIT;
  const activeMinWidth = isMixedFeed ? COL_MIN_WIDTH_MIXED : COL_MIN_WIDTH_SPLIT;

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-[#232326]/60 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#131316] [&::-webkit-scrollbar-thumb]:bg-[#6E56CF]/40 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className={`bg-[#000000] ${activeMinWidth}`}>
          <div className="flex flex-col divide-y divide-[#232326]/60">
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <div key={i} className={`grid ${activeTemplate} items-center gap-3 py-3`}>
                <div className="pl-4"><div className="h-8 w-8 md:h-11 md:w-11 animate-pulse rounded-lg bg-[#18181C]" /></div>
                
                {isMixedFeed ? (
                  <div className="space-y-1.5 pr-4 md:pr-0">
                    <div className="h-3 w-32 animate-pulse rounded bg-[#18181C]" />
                    <div className="h-2 w-48 animate-pulse rounded bg-[#18181C]" />
                  </div>
                ) : (
                  <>
                    {/* Skeleton Mobile Name / Desktop Combined */}
                    <div className="space-y-1.5 pr-2 md:pr-0">
                      <div className="h-3 w-16 md:w-32 animate-pulse rounded bg-[#18181C]" />
                      <div className="hidden md:block h-2 w-48 animate-pulse rounded bg-[#18181C]" />
                    </div>
                    {/* Skeleton Mobile Description */}
                    <div className="md:hidden pr-4">
                      <div className="h-2 w-32 animate-pulse rounded bg-[#18181C]" />
                    </div>
                  </>
                )}

                <div className="h-4 w-16 animate-pulse rounded-full bg-[#18181C]" />
                <div className="h-4 w-16 animate-pulse rounded-full bg-[#18181C]" />
                <div className="h-4 w-8 animate-pulse rounded-full bg-[#18181C]" />
                <div className="h-4 w-8 animate-pulse rounded-full bg-[#18181C]" />
                
                {!isMixedFeed && (
                  <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
                )}

                <div className="h-3 w-16 animate-pulse rounded bg-[#18181C]" />
                <div className="h-7 w-7 animate-pulse rounded-md bg-[#18181C]" />
                <div className="h-7 w-7 animate-pulse rounded-md bg-[#18181C]" />
                <div className="h-7 w-7 animate-pulse rounded-md bg-[#18181C] mr-4 md:mr-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tools.length === 0) {
    const mockFeed = [
      { id: '1', name: 'Midjourney', category: 'Generative AI', description: 'Advanced AI image generation.', pricing: 'Paid', tags: '["AI", "Image"]', visits: '15.2M', growth: 12, url: 'https://midjourney.com', rank: 1, rating: 5, votes: 1234, saves: 567, addedDate: new Date().toISOString(), entityType: 'TOOL', slug: 'midjourney' },
      { id: '2', name: 'ChatGPT', category: 'Chatbots', description: 'Powerful conversational AI.', pricing: 'Freemium', tags: '["AI", "Chat"]', visits: '45.0M', growth: 5, url: 'https://chat.openai.com', rank: 2, rating: 5, votes: 5678, saves: 1234, addedDate: new Date().toISOString(), entityType: 'TOOL', slug: 'chatgpt' },
      { id: '3', name: 'Cursor', category: 'Code Assistant', description: 'AI code editor for engineers.', pricing: 'Paid', tags: '["Code", "Dev"]', visits: '22.0M', growth: -2, url: 'https://cursor.sh', rank: 3, rating: 4, votes: 345, saves: 123, addedDate: new Date().toISOString(), entityType: 'TOOL', slug: 'cursor' }
    ];
    // Use mock feed if the actual tools array is completely empty to prevent empty state on Vercel preview
    tools = mockFeed as any; return <ToolListViewInner tools={tools} loading={false} skeletonRows={6} />;
  }

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

  const dropdownHTML = (
    <>
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
              className="flex-1 text-[12px] bg-[#6E56CF] hover:bg-[#7C66DF] text-white py-1.5 rounded transition-colors font-semibold"
            >Apply</button>
            {nameSearch && (
              <button
                onClick={() => { setNameSearch(""); setNameInput(""); setOpenDropdown(null); }}
                className="flex-1 text-[12px] border border-[#232326] text-[#52525B] hover:text-white py-1.5 rounded transition-colors"
              >Clear</button>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <div
        ref={dropdownRef}
        className="overflow-x-auto touch-scroll-x rounded-lg border border-[#232326]/60 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#131316] [&::-webkit-scrollbar-thumb]:bg-[#6E56CF]/40 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <div className={`relative bg-[#000000] ${activeMinWidth}`}>

          {/* ── Header row ───────────────────────────────────────────────────── */}
          <div className="border-b border-[#232326]/60 bg-[#131316] sticky top-0 z-30">
            <div className={`grid ${activeTemplate} items-center gap-3 py-3`}>

              {/* Logo col header */}
              <div className={`${!isMixedFeed ? "sticky left-0 md:static z-40 shadow-[10px_0_10px_-10px_rgba(0,0,0,0.5)] md:shadow-none" : ""} bg-[#131316] md:bg-transparent h-full pl-4`} />

              {isMixedFeed ? (
                <div className="relative flex items-center gap-2 h-full pr-4 md:pr-0">
                  {dropdownHTML}
                </div>
              ) : (
                <>
                  <div className="relative flex items-center gap-2 sticky left-[60px] md:static z-40 bg-[#131316] md:bg-transparent shadow-[10px_0_10px_-10px_rgba(0,0,0,0.5)] md:shadow-none h-full pr-2 md:pr-0 before:content-[''] before:absolute before:inset-y-0 before:-left-[12px] before:w-[12px] before:bg-[#131316] md:before:hidden">
                    {dropdownHTML}
                  </div>
                  <span className="md:hidden text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] pr-2">DESCRIPTION</span>
                </>
              )}

              {/* TASK */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] pl-4 md:pl-0">TASK</span>

              {/* PRICING */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">PRICING</span>

              {/* API */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">API</span>

              {/* OPEN-SOURCE */}
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">OPEN-SOURCE</span>

              {/* COMPATIBILITY (Hidden in Mixed Feed) */}
              {!isMixedFeed && (
                <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">COMPATIBILITY</span>
              )}

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
              <span className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] pr-4">COMPARE</span>
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
                isMixedFeed={isMixedFeed}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky compare bar ───────────────────────────────────────────────── */}
      {compareSet.length > 0 && (
        <div className="fixed inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-2 sm:px-4">
          <div className="flex w-full max-w-xl items-center gap-2 sm:gap-3 rounded-xl border border-[#232326]/70 bg-[#111113]/95 backdrop-blur px-3 sm:px-4 py-2 sm:py-3 shadow-2xl shadow-black/60">
            <div className="flex flex-1 items-center gap-1.5 sm:gap-2 min-w-0">
              {Array.from({ length: MAX_COMPARE }).map((_, i) => {
                const t = compareSet[i];
                return (
                  <div key={i} className={`flex flex-1 items-center gap-1.5 sm:gap-2 rounded-lg border px-2 sm:px-2.5 py-1.5 min-w-0 ${t ? "border-[#232326]/70 bg-[#18181C]" : "border-dashed border-[#232326]/50"}`}>
                    {t ? (
                      <>
                        <span className="truncate text-[11px] sm:text-[12px] font-semibold text-white">{t.name}</span>
                        <button type="button" onClick={() => toggleCompare(t)} className="ml-auto shrink-0 text-[#71717A] hover:text-white p-0.5" aria-label={`Remove ${t.name}`}>
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] text-[#71717A] truncate">Select tool…</span>
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
                compareSet.length === MAX_COMPARE ? "text-white shadow-md shadow-[#6E56CF]/30" : "cursor-not-allowed bg-[#18181C] text-[#4a4a4d]"
              }`}
              style={compareSet.length === MAX_COMPARE ? { backgroundColor: "#6E56CF" } : undefined}
            >
              <GitCompare size={13} /> <span className="hidden 2xs:inline">Compare</span>
            </button>
            <button type="button" onClick={() => setCompareSet([])} className="shrink-0 text-[#71717A] hover:text-white p-1" aria-label="Clear compare">
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