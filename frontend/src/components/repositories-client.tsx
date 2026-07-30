'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Repository, RepositoryOwnerListItem } from "@/lib/types";
import { fetchRepositories, fetchRepositoryOwners } from "@/lib/api";
import { RepositoryTable } from "@/components/ui/RepositoryTable";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { RepositoryRow } from "@/components/ui/RepositoryRow";

import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Search from 'lucide-react/dist/esm/icons/search';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import ListChecks from 'lucide-react/dist/esm/icons/list-checks';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import FolderHeart from 'lucide-react/dist/esm/icons/folder-heart';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';
import GitBranch from 'lucide-react/dist/esm/icons/git-branch';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import Bot from 'lucide-react/dist/esm/icons/bot';
import Plug from 'lucide-react/dist/esm/icons/plug';
import PlayCircle from 'lucide-react/dist/esm/icons/play-circle';
import UserCircle from 'lucide-react/dist/esm/icons/user-circle';
import Palette from 'lucide-react/dist/esm/icons/palette';
import Cpu from 'lucide-react/dist/esm/icons/cpu';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";
const DIRECTORY_CARDS = [
  { name: "Tools", href: "/tools", description: "Browse the full AI tools directory, filter by category and pricing.", icon: Wrench, color: "#FFC53D" },
  { name: "Tasks", href: "/tasks", description: "Find the right AI tool for a specific job to be done.", icon: ListChecks, color: "#FB923C" },
  { name: "Companies", href: "/companies", description: "Explore the labs and startups building the AI ecosystem.", icon: Building2, color: "#38BDF8" },
  { name: "News", href: "/news", description: "The latest announcements and coverage across the AI world.", icon: Newspaper, color: "#FF6B4A" },
  { name: "Videos", href: "/videos", description: "Watch demos, reviews, and deep dives on the latest AI tools.", icon: PlayCircle, color: "#F87171" },
  { name: "Robots", href: "/robots", description: "Robotics platforms and the companies behind them.", icon: Bot, color: "#2DD4BF" },
  { name: "Devices", href: "/devices", description: "Hardware built for and powered by AI.", icon: Smartphone, color: "#F472B6" },
  { name: "Models", href: "/models", description: "Compare context windows, pricing, and benchmarks across AI models.", icon: Cpu, color: "#A78BFA" },
  { name: "Repositories", href: "/repositories", description: "Trending open-source AI repositories on GitHub.", icon: GitBranch, color: "#22D3EE" },
  { name: "MCP", href: "/tools", description: "Model Context Protocol servers and integrations.", icon: Plug, color: "#818CF8" },
  { name: "Collections", href: "/collections", description: "Curated bundles of tools grouped by use case.", icon: FolderHeart, color: "#34D399" },
  { name: "Personal", href: "/personal", description: "AI tools for personal productivity and everyday life.", icon: UserCircle, color: "#FBBF24" },
  { name: "Creativity", href: "/creativity", description: "AI tools for art, design, writing, and creative work.", icon: Palette, color: "#E879F9" },
] as const;

const REPOSITORIES_SUB = [
  "PyTorch",
  "TensorFlow",
  "JAX",
  "Transformers",
  "LLM",
  "Agent",
  "Diffusion",
  "Vision",
  "Audio",
  "Python",
  "TypeScript",
  "Rust"
];

const getBackendSortValue = (field: string | null, order: "asc" | "desc"): string | undefined => {
  if (field === "stars" && order === "desc") return "stars_desc";
  if (field === "updated") return "newest";
  if (field === "name" && order === "asc") return "name_asc";
  return undefined;
};

export function RepositoriesClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const router = useRouter();
  
  const [sortField, setSortField] = useState<"stars" | "forks" | "size" | "updated" | "name" | null>("stars");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [isLicenseDropdownOpen, setIsLicenseDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [repoSearchQuery, setRepoSearchQuery] = useState(initialQuery);
  const [activeRepoSearch, setActiveRepoSearch] = useState(initialQuery);
  const [isRepoFilterOpen, setIsRepoFilterOpen] = useState(false);
  const [owners, setOwners] = useState<RepositoryOwnerListItem[]>([]);

  const selectedTopic = searchParams.get("topic") || null;
  const selectedOwnerSlug = searchParams.get("owner") || null;

  // Derive selectedCompany from URL query parameter
  const selectedCompany = React.useMemo(() => {
    if (!selectedOwnerSlug || owners.length === 0) return null;
    return owners.find((o) => o.owner === selectedOwnerSlug)?.displayName || null;
  }, [selectedOwnerSlug, owners]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Fetch all repository owners once on mount and precompute searchText
  useEffect(() => {
    async function loadOwners() {
      try {
        const data = await fetchRepositoryOwners();
        const enriched = (data || []).map((o) => ({
          ...o,
          searchText: `${o.displayName} ${o.owner} ${o.companySlug || ""}`.toLowerCase(),
        }));
        setOwners(enriched);
      } catch (e) {
        console.error("Failed to fetch repository owners:", e);
      }
    }
    loadOwners();
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [
      "repositories",
      {
        q: activeRepoSearch,
        sort: sortField,
        order: sortOrder,
        topic: selectedTopic,
        owner: selectedOwnerSlug,
      },
    ],
    queryFn: async ({ pageParam }) => {
      const backendSort = getBackendSortValue(sortField, sortOrder);
      return fetchRepositories({
        q: activeRepoSearch || undefined,
        sort: backendSort,
        topic: selectedTopic || undefined,
        owner: selectedOwnerSlug || undefined,
        cursor: pageParam || null,
        limit: 15,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor || null,
    staleTime: 5 * 60 * 1000,
  });

  const repos = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.items || []) || [];
  }, [data]);

  const total = data?.pages[0]?.total ?? 0;

  // IntersectionObserver for server-side infinite scroll
  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  function handleSort(field: "stars" | "forks" | "size" | "updated") {
    let newOrder: "asc" | "desc" = "desc";
    if (sortField === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortField(field);
    setSortOrder(newOrder);
  }

  // Generate dynamic license counts from the loaded datasets
  const licenseCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((repo) => {
      const license = repo.license;
      if (license) {
        counts[license] = (counts[license] || 0) + 1;
      }
    });
    return counts;
  }, [repos]);

  // Generate dynamic company counts from the loaded datasets (populates complete list)
  const companyCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    owners.forEach((o) => {
      counts[o.displayName] = o.repositoryCount;
    });
    return counts;
  }, [owners]);

  const companySearchKeys = React.useMemo(() => {
    const keys: Record<string, string> = {};
    owners.forEach((o) => {
      keys[o.displayName] = o.searchText || "";
    });
    return keys;
  }, [owners]);

  // Filter repositories by name (unsupported filters stay client-side)
  const nameFilteredRepos = React.useMemo(() => {
    if (!activeRepoSearch) return repos;
    const query = activeRepoSearch.toLowerCase();
    return repos.filter((repo) => repo.name.toLowerCase().includes(query));
  }, [repos, activeRepoSearch]);

  // Filter repositories by license (company filtering is now handled server-side)
  const filteredRepos = React.useMemo(() => {
    if (!selectedLicense) return nameFilteredRepos;
    return nameFilteredRepos.filter((repo) => repo.license === selectedLicense);
  }, [nameFilteredRepos, selectedLicense]);

  // Sort filtered repositories
  const sortedRepos = React.useMemo(() => {
    if (!sortField) return filteredRepos;

    return [...filteredRepos].sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortField === "stars") {
        valA = a.stars;
        valB = b.stars;
      } else if (sortField === "forks") {
        valA = a.forks ?? 0;
        valB = b.forks ?? 0;
      } else if (sortField === "size") {
        valA = a.stars / 210 + 1.2;
        valB = b.stars / 210 + 1.2;
      } else if (sortField === "updated") {
        valA = new Date(a.syncedAt || a.githubCreatedAt || 0).getTime();
        valB = new Date(b.syncedAt || b.githubCreatedAt || 0).getTime();
      }

      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  }, [filteredRepos, sortField, sortOrder]);

  function handleApplyRepoSearch() {
    setActiveRepoSearch(repoSearchQuery);
    setIsRepoFilterOpen(false);
  }

  function handleResetRepoSearch() {
    setRepoSearchQuery("");
    setActiveRepoSearch("");
    setIsRepoFilterOpen(false);
  }

  function handleClearTopic() {
    const params = new URLSearchParams(window.location.search);
    params.delete("topic");
    router.push(`/repositories?${params.toString()}`);
  }

  const handleSelectTopic = (topic: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (topic) {
      params.set("topic", topic);
    } else {
      params.delete("topic");
    }
    router.push(`/repositories?${params.toString()}`);
  };

  const handleSelectCompany = (displayName: string | null) => {
    const ownerSlug = displayName ? owners.find(o => o.displayName === displayName)?.owner || null : null;
    const params = new URLSearchParams(window.location.search);
    if (ownerSlug) {
      params.set("owner", ownerSlug);
    } else {
      params.delete("owner");
    }
    router.push(`/repositories?${params.toString()}`);
  };

  function handleResetFilters() {
    setSelectedLicense(null);
    setRepoSearchQuery("");
    setActiveRepoSearch("");
    router.push("/repositories");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Hero Section */}
      <section
        className="relative w-full flex flex-col items-center pt-4 pb-6 px-6"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(35, 35, 38, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.12] blur-[100px]"
            style={{ backgroundColor: 'var(--color-signal)' }}
          />
        </div>

        <div className="mx-auto max-w-[1440px] w-full flex flex-col items-center text-center relative z-10">
          <h1 className="max-w-[820px] text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.1] mb-4 sm:mb-6 select-none text-white text-balance">
            The Home of Everything AI
          </h1>

          <form action="/tools" method="GET" className="relative w-full max-w-[520px] mx-auto mb-4 sm:mb-5 group">
            <div
              className="relative w-full rounded-xl border border-[#232326]/70 bg-[#111113] h-[38px] sm:h-[42px] flex items-center px-3.5 sm:px-4 pr-[4.5rem] transition-colors duration-150"
            >
              <Search size={13} className="mr-2 sm:mr-2.5 text-[#71717A] shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Search AI tools, models, companies…"
                className="w-full bg-transparent text-[12px] sm:text-[13px] text-white placeholder:text-[#71717A] focus:outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-0.5 rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 font-mono text-[10px] text-[#71717A] pointer-events-none">
                  <span>⌘</span>K
                </kbd>
              </div>
            </div>
            <style jsx>{`
              form:focus-within > div {
                border-color: var(--color-signal) !important;
                box-shadow: 0 0 0 3px var(--color-signal-dim);
              }
            `}</style>
          </form>

          <div className="mb-3">
            <HeroFeatureChips />
          </div>
        </div>
      </section>

      <div className="border-b border-[#232326]/40 w-full z-10 relative" />

      {/* Sort control */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mx-auto w-full max-w-[1600px] flex justify-end">
          <div className="flex items-center gap-2 select-none">
            <span className="text-xs text-[#71717A]">
              Sort by
            </span>
            <div className="relative inline-flex items-center">
              <select
                value={sortField === "stars" ? (sortOrder === "desc" ? "stars-desc" : "stars-asc") : (sortField === "updated" ? "updated" : "name")}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "stars-desc") { setSortField("stars"); setSortOrder("desc"); }
                  else if (val === "stars-asc") { setSortField("stars"); setSortOrder("asc"); }
                  else if (val === "updated") { setSortField("updated"); setSortOrder("desc"); }
                  else if (val === "name") { setSortField("name"); setSortOrder("asc"); }
                }}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-xs font-semibold text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-7"
              >
                <option value="stars-desc">Most Stars</option>
                <option value="stars-asc">Least Stars</option>
                <option value="updated">Recently Updated</option>
                <option value="name">Alphabetical</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 text-[#71717A] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Directory nav strip */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-1">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex flex-nowrap items-stretch gap-1.5 sm:gap-2 overflow-x-auto">
            {DIRECTORY_CARDS.map((card) => {
              const Icon = card.icon;
              const isSelected = card.name.toLowerCase() === "repositories";

              return (
                <Link
                  key={card.name}
                  href={card.href}
                  className="group flex flex-1 min-w-[76px] sm:min-w-[92px] shrink-0 flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-[#232326]/60 bg-[#0d0d10] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center transition-colors duration-200"
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55`;
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.boxShadow = "";
                    }
                  }}
                  style={
                    isSelected
                      ? { borderColor: card.color, boxShadow: `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55` }
                      : undefined
                  }
                >
                  <div
                    className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md border"
                    style={{ backgroundColor: `${card.color}1a`, borderColor: `${card.color}40` }}
                  >
                    <Icon size={10} strokeWidth={1.75} style={{ color: card.color }} />
                  </div>
                  <span className="text-[9px] sm:text-[10.5px] font-bold tracking-tight text-white whitespace-nowrap">
                    {card.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>



      {/* Repositories Description */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="mx-auto w-full max-w-[1600px] text-center">
          <p className="text-xs sm:text-sm text-[#A1A1AA] font-normal">
            Discover popular open-source projects, tools, and models pushing developer capabilities on GitHub.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-[1440px] px-8 py-4 flex-1 w-full">

        {/* Active Topic Filter Chip */}
        {selectedTopic && (
          <div className="flex items-center gap-2 mb-6 bg-white/[0.02] border border-white/[0.08] px-3.5 py-2 rounded-lg w-fit shadow-md animate-fade-in">
            <span className="text-xs text-white/50">Active Topic:</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/[0.08] text-white">
              {selectedTopic}
            </span>
            <button
              onClick={handleClearTopic}
              className="text-xs text-red-400 hover:text-red-300 transition-colors ml-2 cursor-pointer font-medium"
            >
              Clear
            </button>
          </div>
        )}

        {isLoading ? (
          <RepositoryTable
            sortField={sortField === "name" ? null : sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectedLicense={selectedLicense}
            onSelectLicense={setSelectedLicense}
            licenseCounts={licenseCounts}
            selectedCompany={selectedCompany}
            onSelectCompany={handleSelectCompany}
            companyCounts={companyCounts}
            companySearchKeys={companySearchKeys}
            totalCount={total}
            isLicenseDropdownOpen={isLicenseDropdownOpen}
            onToggleLicenseDropdown={() => setIsLicenseDropdownOpen(prev => !prev)}
            onCloseLicenseDropdown={() => setIsLicenseDropdownOpen(false)}
            isCompanyDropdownOpen={isCompanyDropdownOpen}
            onToggleCompanyDropdown={() => setIsCompanyDropdownOpen(prev => !prev)}
            onCloseCompanyDropdown={() => setIsCompanyDropdownOpen(false)}
            activeRepoSearch={activeRepoSearch}
            repoSearchQuery={repoSearchQuery}
            onChangeRepoSearchQuery={setRepoSearchQuery}
            onApplyRepoSearch={handleApplyRepoSearch}
            onResetRepoSearch={handleResetRepoSearch}
            isRepoFilterOpen={isRepoFilterOpen}
            onToggleRepoFilter={() => setIsRepoFilterOpen(prev => !prev)}
            onCloseRepoFilter={() => setIsRepoFilterOpen(false)}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[minmax(0,2.5fr)_minmax(0,1.8fr)_minmax(0,1.5fr)_60px] md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.8fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_60px] lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_60px] xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_60px] gap-[10px] items-center py-[7px] px-[9px] h-[65px] w-full animate-pulse border-b border-white/[0.06] last:border-b-0"
              >
                {/* Col 2 */}
                <div className="pl-5">
                  <div className="h-3 w-1/3 rounded bg-white/[0.04]" />
                </div>
                {/* Col 3 */}
                <div className="h-3 w-1/2 rounded bg-white/[0.04] hidden md:block" />
                {/* Col 4 */}
                <div className="h-3 w-10 rounded bg-white/[0.04] mx-auto" />
                {/* Col 5 */}
                <div className="h-3 w-10 rounded bg-white/[0.04] mx-auto hidden lg:block" />
                {/* Col 6 */}
                <div className="h-4 w-12 rounded-full bg-white/[0.04] mx-auto hidden md:block" />
                {/* Col 7 */}
                <div className="h-3 w-8 rounded bg-white/[0.04] mx-auto hidden xl:block" />
                {/* Col 8 */}
                <div className="h-3 w-8 rounded bg-white/[0.04] mx-auto block md:hidden lg:block" />
                {/* Col 9 */}
                <div className="h-7 w-7 rounded-full bg-white/[0.04] mx-auto" />
              </div>
            ))}
          </RepositoryTable>
        ) : (
          <RepositoryTable
            sortField={sortField === "name" ? null : sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectedLicense={selectedLicense}
            onSelectLicense={setSelectedLicense}
            licenseCounts={licenseCounts}
            selectedCompany={selectedCompany}
            onSelectCompany={handleSelectCompany}
            companyCounts={companyCounts}
            companySearchKeys={companySearchKeys}
            totalCount={total}
            isLicenseDropdownOpen={isLicenseDropdownOpen}
            onToggleLicenseDropdown={() => setIsLicenseDropdownOpen(prev => !prev)}
            onCloseLicenseDropdown={() => setIsLicenseDropdownOpen(false)}
            isCompanyDropdownOpen={isCompanyDropdownOpen}
            onToggleCompanyDropdown={() => setIsCompanyDropdownOpen(prev => !prev)}
            onCloseCompanyDropdown={() => setIsCompanyDropdownOpen(false)}
            activeRepoSearch={activeRepoSearch}
            repoSearchQuery={repoSearchQuery}
            onChangeRepoSearchQuery={setRepoSearchQuery}
            onApplyRepoSearch={handleApplyRepoSearch}
            onResetRepoSearch={handleResetRepoSearch}
            isRepoFilterOpen={isRepoFilterOpen}
            onToggleRepoFilter={() => setIsRepoFilterOpen(prev => !prev)}
            onCloseRepoFilter={() => setIsRepoFilterOpen(false)}
          >
            {sortedRepos.length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#131316]/20 rounded-b-xl w-full flex flex-col items-center">
                <p className="text-[#A1A1AA] text-sm font-medium mb-1">No repositories found.</p>
                <p className="text-white/40 text-xs mb-5">Try adjusting or clearing your filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold text-white bg-white/[0.08] hover:bg-white/[0.12] active:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.12] rounded-lg transition-colors cursor-pointer focus:outline-none"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              sortedRepos.map((repo: Repository) => (
                <RepositoryRow key={repo.id} repo={repo} />
              ))
            )}

            {/* Sentinel for infinite scroll */}
            {hasNextPage && sortedRepos.length > 0 && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </RepositoryTable>
        )}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}