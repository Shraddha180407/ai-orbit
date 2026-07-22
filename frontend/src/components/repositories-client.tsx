'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Repository } from "@/lib/types";
import { fetchRepositories } from "@/lib/api";
import { RepositoryHero } from "@/components/ui/RepositoryHero";
import { RepositoryTable } from "@/components/ui/RepositoryTable";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { RepositoryRow } from "@/components/ui/RepositoryRow";

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
  
  const [repos, setRepos] = useState<Repository[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [sortField, setSortField] = useState<"stars" | "forks" | "size" | "updated" | null>("stars");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [isLicenseDropdownOpen, setIsLicenseDropdownOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [repoSearchQuery, setRepoSearchQuery] = useState(initialQuery);
  const [activeRepoSearch, setActiveRepoSearch] = useState(initialQuery);
  const [isRepoFilterOpen, setIsRepoFilterOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Helper to fetch the initial/reset list based on current filters/sorting from page 1
  const fetchInitialRepos = async (
    searchQuery: string,
    field: typeof sortField,
    order: typeof sortOrder,
    topicFilter: string | null = selectedTopic
  ) => {
    setIsLoading(true);
    try {
      const backendSort = getBackendSortValue(field, order);
      const data = await fetchRepositories({
        q: searchQuery || undefined,
        sort: backendSort,
        topic: topicFilter || undefined,
        limit: 15
      });
      setRepos(data.items || []);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch (e) {
      console.error("Failed to fetch repositories:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and query param sync
  useEffect(() => {
    const initialTopic = searchParams.get("topic") || null;
    setSelectedTopic(initialTopic);
    fetchInitialRepos(activeRepoSearch, sortField, sortOrder, initialTopic);
  }, [searchParams]);

  // IntersectionObserver for server-side infinite scroll
  useEffect(() => {
    if (isLoading || isFetchingMore || !hasMore || !nextCursor) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        async function fetchMore() {
          if (isFetchingMore) return;
          setIsFetchingMore(true);
          try {
            const backendSort = getBackendSortValue(sortField, sortOrder);
            const data = await fetchRepositories({
              limit: 15,
              cursor: nextCursor,
              q: activeRepoSearch || undefined,
              sort: backendSort,
              topic: selectedTopic || undefined
            });
            setRepos((prev) => {
              const existingIds = new Set(prev.map(r => r.id));
              const newItems = (data.items || []).filter(r => !existingIds.has(r.id));
              return [...prev, ...newItems];
            });
            setNextCursor(data.nextCursor);
            setHasMore(data.hasMore);
            setTotal(data.total);
          } catch (e) {
            console.error("Failed to fetch more repositories:", e);
          } finally {
            setIsFetchingMore(false);
          }
        }
        fetchMore();
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
  }, [isLoading, isFetchingMore, hasMore, nextCursor, activeRepoSearch, sortField, sortOrder, selectedTopic]);

  function handleSort(field: "stars" | "forks" | "size" | "updated") {
    let newOrder: "asc" | "desc" = "desc";
    if (sortField === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortField(field);
    setSortOrder(newOrder);

    // If there is a backend equivalent, trigger a refetch from page 1
    const backendSort = getBackendSortValue(field, newOrder);
    if (backendSort) {
      fetchInitialRepos(activeRepoSearch, field, newOrder, selectedTopic);
    }
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

  // Generate dynamic company counts from the loaded datasets
  const companyCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.owner) {
        counts[repo.owner] = (counts[repo.owner] || 0) + 1;
      }
    });
    return counts;
  }, [repos]);

  // Filter repositories by name (unsupported filters stay client-side)
  const nameFilteredRepos = React.useMemo(() => {
    if (!activeRepoSearch) return repos;
    const query = activeRepoSearch.toLowerCase();
    return repos.filter((repo) => repo.name.toLowerCase().includes(query));
  }, [repos, activeRepoSearch]);

  // Filter repositories by company
  const companyFilteredRepos = React.useMemo(() => {
    if (!selectedCompany) return nameFilteredRepos;
    return nameFilteredRepos.filter((repo) => repo.owner === selectedCompany);
  }, [nameFilteredRepos, selectedCompany]);

  // Filter repositories by license
  const filteredRepos = React.useMemo(() => {
    if (!selectedLicense) return companyFilteredRepos;
    return companyFilteredRepos.filter((repo) => repo.license === selectedLicense);
  }, [companyFilteredRepos, selectedLicense]);

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
    fetchInitialRepos(repoSearchQuery, sortField, sortOrder, selectedTopic);
  }

  function handleResetRepoSearch() {
    setRepoSearchQuery("");
    setActiveRepoSearch("");
    setIsRepoFilterOpen(false);
    fetchInitialRepos("", sortField, sortOrder, selectedTopic);
  }

  function handleClearTopic() {
    const params = new URLSearchParams(window.location.search);
    params.delete("topic");
    router.push(`/repositories?${params.toString()}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="mx-auto max-w-[1440px] px-8 py-12 flex-1 w-full">
        <RepositoryHero />

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
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectedLicense={selectedLicense}
            onSelectLicense={setSelectedLicense}
            licenseCounts={licenseCounts}
            selectedCompany={selectedCompany}
            onSelectCompany={setSelectedCompany}
            companyCounts={companyCounts}
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
                className="grid grid-cols-[30px_minmax(0,2.5fr)_minmax(0,1.8fr)_minmax(0,1.5fr)_60px] md:grid-cols-[30px_minmax(0,2.2fr)_minmax(0,1.8fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_60px] lg:grid-cols-[30px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_60px] xl:grid-cols-[30px_minmax(0,1.8fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_60px] gap-[10px] items-center py-[7px] px-[9px] h-[65px] w-full animate-pulse border-b border-white/[0.06] last:border-b-0"
              >
                {/* Col 1 */}
                <div className="h-3 w-4 rounded bg-white/[0.04] mx-auto" />
                {/* Col 2 */}
                <div className="h-3 w-1/3 rounded bg-white/[0.04]" />
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
        ) : repos.length === 0 ? (
          <div className="text-center py-20 border border-[#232326] bg-[#131316] rounded-xl">
            <p className="text-[#A1A1AA] text-sm">No repositories found.</p>
          </div>
        ) : (
          <RepositoryTable
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectedLicense={selectedLicense}
            onSelectLicense={setSelectedLicense}
            licenseCounts={licenseCounts}
            selectedCompany={selectedCompany}
            onSelectCompany={setSelectedCompany}
            companyCounts={companyCounts}
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
            {sortedRepos.map((repo: Repository, index: number) => (
              <RepositoryRow key={repo.id} repo={repo} rank={index + 1} />
            ))}

            {/* Sentinel for infinite scroll */}
            {hasMore && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </RepositoryTable>
        )}
      </main>
      <ScrollToTopButton />
    </div>
  );
}