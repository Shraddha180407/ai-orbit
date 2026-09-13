'use client';

import React, { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Check from "lucide-react/dist/esm/icons/check";
import X from "lucide-react/dist/esm/icons/x";
import Bookmark from "lucide-react/dist/esm/icons/bookmark";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import BadgeCheck from "lucide-react/dist/esm/icons/badge-check";
import GitCompare from "lucide-react/dist/esm/icons/git-compare";
import SearchX from "lucide-react/dist/esm/icons/search-x";
import ArrowUpDown from "lucide-react/dist/esm/icons/arrow-up-down";
import Filter from "lucide-react/dist/esm/icons/filter";
import { PricingBadge } from "@/components/PricingBadge";
import { useUser } from "@/hooks/use-user";
import { toggleBookmark } from "@/lib/actions";

type Agent = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  category?: string | null;
  categorySlug?: string | null;
  primaryTask?: string | null;
  pricingModel?: any;
  pricingRaw?: string | null;
  hasApi?: boolean;
  isOpenSource?: boolean;
  verified?: boolean;
  avgRating?: number | null;
  reviewCount?: number;
  createdAt?: string | null;
  bookmarked?: boolean;
};

type AgentListViewProps = {
  agents: Agent[];
  loading?: boolean;
  skeletonRows?: number;
};

const MAX_COMPARE = 2;

function LogoCell({
  name,
  logoUrl,
}: {
  name?: string;
  logoUrl?: string | null;
}) {
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    return (
      <span className="text-xs font-bold text-neutral-900">
        {(name || "?").trim().charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={name || "Agent"}
      className="h-6 w-6 md:h-8 md:w-8 object-contain"
      onError={() => setFailed(true)}
    />
  );
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
    <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA]">
      {value ? trueLabel : falseLabel}
    </span>
  );
}

function ShareButton({ agent }: { agent: Agent }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/agents/${agent.slug}`;

    const shareData = {
      title: agent.name,
      text: agent.description ?? "",
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
      return;
    }

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
      aria-label={`Share ${agent.name}`}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
    </button>
  );
}

function BookmarkBtn({ agent }: { agent: Agent }) {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const [bookmarked, setBookmarked] = useState(!!agent.bookmarked);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    const next = !bookmarked;
    setBookmarked(next);

    try {
      const result = await toggleBookmark(agent.id, agent.slug);
      setBookmarked(result.bookmarked);
    } catch {
      setBookmarked(!next);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBookmark}
      className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors ${
        bookmarked
          ? "border-[#6E56CF] text-[#6E56CF]"
          : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
      }`}
      aria-label={
        bookmarked
          ? `Remove bookmark for ${agent.name}`
          : `Bookmark ${agent.name}`
      }
    >
      {bookmarked ? <Check size={14} /> : <Bookmark size={14} />}
    </button>
  );
}

function AgentRow({
  agent,
  isSelected,
  compareFull,
  onToggleCompare,
}: {
  agent: Agent;
  isSelected: boolean;
  compareFull: boolean;
  onToggleCompare: (agent: Agent) => void;
}) {
  const router = useRouter();

  return (
    <div
      role="listitem"
      onClick={() => router.push(`/agents/${agent.slug}`)}
      className="cursor-pointer group grid grid-cols-[48px_210px_minmax(150px,1.5fr)_minmax(150px,1.4fr)_minmax(100px,1fr)_minmax(60px,.6fr)_minmax(90px,.8fr)_44px_44px_60px] md:grid-cols-[60px_minmax(280px,3fr)_minmax(150px,1.3fr)_minmax(160px,1.4fr)_minmax(110px,1fr)_minmax(60px,.6fr)_minmax(90px,.8fr)_44px_44px_60px] min-w-fit md:min-w-[1120px] items-center gap-3 border-b border-[#232326]/60 py-3"
    >
      {/* Logo */}
      <div className="pl-4 flex h-full items-center">
        <div className="flex h-8 w-8 md:h-11 md:w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white">
          <LogoCell
            name={agent.name}
            logoUrl={agent.logoUrl}
          />
        </div>
      </div>

      {/* Agent */}
      <div className="min-w-0 pr-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="truncate text-[13px] font-semibold text-white">
            {agent.name}
          </h3>

          {agent.verified && (
            <BadgeCheck
              size={14}
              className="shrink-0 text-blue-400"
              aria-label="Verified"
            />
          )}

          {agent.websiteUrl && (
            <a
              href={agent.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#71717A] hover:text-white shrink-0"
              aria-label={`Visit ${agent.name} website`}
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        <p className="mt-0.5 text-[11px] text-[#A1A1AA] leading-snug whitespace-nowrap overflow-hidden">
          {agent.description || "—"}
        </p>
      </div>

      {/* Category */}
      <div className="min-w-0">
        <span className="inline-flex max-w-[150px] truncate rounded-md border border-[#232326] bg-[#1A1A1E] px-2.5 py-0.5 text-[10px] font-medium text-[#D4D4D8]">
          {agent.category || "—"}
        </span>
      </div>

      {/* Primary Task */}
      <div className="min-w-0">
        <span className="inline-flex max-w-[180px] truncate rounded-md border border-[#232326] bg-[#1A1A1E] px-2.5 py-0.5 text-[10px] font-medium text-[#D4D4D8]">
          {agent.primaryTask || "—"}
        </span>
      </div>

      {/* Pricing */}
      <div>
        <PricingBadge
          pricingModel={agent.pricingModel}
          className="text-[10px] px-2.5 py-0.5"
        />
      </div>

      {/* API */}
      <div>
        <BoolPill
          value={!!agent.hasApi}
          trueLabel="YES"
          falseLabel="NO"
        />
      </div>

      {/* Released */}
      <div className="text-[10px] font-mono text-[#A1A1AA]">
        {agent.createdAt
          ? new Date(agent.createdAt).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )
          : "—"}
      </div>

      {/* Share */}
      <div onClick={(e) => e.preventDefault()}>
        <ShareButton agent={agent} />
      </div>

      {/* Save */}
      <div onClick={(e) => e.preventDefault()}>
        <BookmarkBtn agent={agent} />
      </div>

      {/* Compare */}
      <div
        onClick={(e) => e.preventDefault()}
        className="pr-4"
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleCompare(agent);
          }}
          disabled={!isSelected && compareFull}
          className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors disabled:opacity-30 ${
            isSelected
              ? "border-[#6E56CF] text-[#6E56CF]"
              : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
          }`}
          aria-label={
            isSelected
              ? `Remove ${agent.name} from compare`
              : `Add ${agent.name} to compare`
          }
        >
          <GitCompare size={14} />
        </button>
      </div>
    </div>
  );
}

function AgentListViewInner({
  agents,
  loading = false,
  skeletonRows = 6,
}: AgentListViewProps) {
  const [compareSet, setCompareSet] = useState<Agent[]>([]);
  const [nameSearch, setNameSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | null
  >(null);
  const [showNameFilter, setShowNameFilter] = useState(false);

  const router = useRouter();

  const filtered = React.useMemo(() => {
    const q = nameSearch.trim().toLowerCase();

    const result = q
      ? agents.filter((agent) =>
          (agent.name || "").toLowerCase().includes(q)
        )
      : [...agents];

    if (sortDirection === "asc") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", undefined, {
          sensitivity: "base",
        })
      );
    }

    if (sortDirection === "desc") {
      result.sort((a, b) =>
        (b.name || "").localeCompare(a.name || "", undefined, {
          sensitivity: "base",
        })
      );
    }

    return result;
  }, [agents, nameSearch, sortDirection]);

  const toggleCompare = (agent: Agent) => {
    setCompareSet((prev) => {
      const exists = prev.some((a) => a.id === agent.id);

      if (exists) {
        return prev.filter((a) => a.id !== agent.id);
      }

      if (prev.length >= MAX_COMPARE) {
        return prev;
      }

      return [...prev, agent];
    });
  };

  const goToCompare = () => {
    if (compareSet.length !== MAX_COMPARE) return;

    router.push(
      `/agents/compare?slugs=${compareSet
        .map((agent) => agent.slug)
        .join(",")}`
    );
  };

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-[#232326]/60">
        <div className="min-w-[1120px] bg-black">
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[60px_3fr_1.3fr_1.4fr_1fr_.6fr_.8fr_44px_44px_60px] gap-3 py-3"
            >
              {Array.from({ length: 10 }).map((_, j) => (
                <div
                  key={j}
                  className="h-4 animate-pulse rounded bg-[#18181C]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!agents.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#232326] bg-[#131316]/40 py-16 text-center">
        <SearchX size={28} className="text-[#71717A]" />

        <p className="text-sm font-medium text-white">
          No agents match your filters
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-[#232326]/60 [&::-webkit-scrollbar]:h-1.5">
        <div className="relative min-w-[1120px] bg-black">

          {/* Header */}
          <div className="border-b border-[#232326]/60 bg-[#131316] sticky top-0 z-30">
            <div className="grid grid-cols-[60px_minmax(280px,3fr)_minmax(150px,1.3fr)_minmax(160px,1.4fr)_minmax(110px,1fr)_minmax(60px,.6fr)_minmax(90px,.8fr)_44px_44px_60px] items-center gap-3 py-3">

              <div className="pl-4" />

              {/* AGENT + SORT + FILTER */}
              <div className="relative flex items-center gap-1.5 text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                <span>AGENT</span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setSortDirection((current) => {
                      if (current === null) return "asc";
                      if (current === "asc") return "desc";
                      return null;
                    });
                  }}
                  className={`transition-colors ${
                    sortDirection
                      ? "text-white"
                      : "text-[#71717A] hover:text-white"
                  }`}
                  title={
                    sortDirection === "asc"
                      ? "Sorted A-Z"
                      : sortDirection === "desc"
                        ? "Sorted Z-A"
                        : "Sort A-Z"
                  }
                >
                  <ArrowUpDown size={13} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNameFilter((current) => !current);
                  }}
                  className={`transition-colors ${
                    nameSearch
                      ? "text-white"
                      : "text-[#71717A] hover:text-white"
                  }`}
                  title="Filter by name"
                >
                  <Filter size={13} />
                </button>

                {showNameFilter && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-6 z-50 w-52 rounded-lg border border-[#232326] bg-[#18181C] p-2.5 shadow-2xl normal-case tracking-normal"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-[#A1A1AA]">
                        Filter by name
                      </span>

                      <button
                        type="button"
                        onClick={() => setShowNameFilter(false)}
                        className="text-[#71717A] hover:text-white"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <input
                      autoFocus
                      value={nameSearch}
                      onChange={(e) => setNameSearch(e.target.value)}
                      placeholder="Agent name..."
                      className="h-8 w-full rounded-md border border-[#232326] bg-[#131316] px-2.5 text-[11px] text-white outline-none placeholder:text-[#52525B] focus:border-[#3a3a3d]"
                    />

                    {nameSearch && (
                      <button
                        type="button"
                        onClick={() => setNameSearch("")}
                        className="mt-2 text-[10px] text-[#71717A] hover:text-white"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                CATEGORY
              </div>

              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                PRIMARY TASK
              </div>

              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                PRICING
              </div>

              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                API
              </div>

              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                RELEASED
              </div>

              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                SHARE
              </div>

              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A]">
                SAVE
              </div>

              <div className="text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] pr-4">
                COMPARE
              </div>
            </div>
          </div>

          {/* Rows */}
          <div role="list" className="flex flex-col">
            {filtered.map((agent) => (
              <AgentRow
                key={agent.id}
                agent={agent}
                isSelected={compareSet.some(
                  (a) => a.id === agent.id
                )}
                compareFull={compareSet.length >= MAX_COMPARE}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Compare bar */}
      {compareSet.length > 0 && (
        <div className="fixed inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-2 sm:px-4">
          <div className="flex w-full max-w-xl items-center gap-2 rounded-xl border border-[#232326]/70 bg-[#111113]/95 backdrop-blur px-3 py-2 shadow-2xl">

            <div className="flex flex-1 items-center gap-2 min-w-0">
              {Array.from({ length: MAX_COMPARE }).map(
                (_, i) => {
                  const agent = compareSet[i];

                  return (
                    <div
                      key={i}
                      className={`flex flex-1 items-center rounded-lg border px-2.5 py-1.5 min-w-0 ${
                        agent
                          ? "border-[#232326]/70 bg-[#18181C]"
                          : "border-dashed border-[#232326]/50"
                      }`}
                    >
                      {agent ? (
                        <>
                          <span className="truncate text-[11px] font-semibold text-white">
                            {agent.name}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              toggleCompare(agent)
                            }
                            className="ml-auto shrink-0 text-[#71717A] hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-[#71717A]">
                          Select another agent…
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </div>

            <button
              type="button"
              onClick={goToCompare}
              disabled={compareSet.length !== MAX_COMPARE}
              className={`shrink-0 rounded-lg px-3.5 py-2 text-[11px] font-semibold ${
                compareSet.length === MAX_COMPARE
                  ? "bg-[#6E56CF] text-white"
                  : "bg-[#18181C] text-[#4a4a4d] cursor-not-allowed"
              }`}
            >
              <GitCompare
                size={13}
                className="inline mr-1"
              />
              Compare
            </button>

            <button
              type="button"
              onClick={() => setCompareSet([])}
              className="shrink-0 text-[#71717A] hover:text-white p-1"
              aria-label="Clear compare"
            >
              <X size={16} />
            </button>

          </div>
        </div>
      )}
    </>
  );
}

export function AgentListView(props: AgentListViewProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] w-full rounded-lg border border-[#232326]/60 bg-[#131316]/10 animate-pulse" />
      }
    >
      <AgentListViewInner {...props} />
    </Suspense>
  );
}