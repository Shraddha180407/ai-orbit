'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Repository, RepositoryOwnerListItem, RepositorySubCategory } from "@/lib/types";
import { fetchRepositories, fetchRepositoryOwners, fetchRepositorySubCategories } from "@/lib/api";

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
  
  const [sortField, setSortField] = useState<"stars" | "forks" | "size" | "updated" | null>("stars");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [isLicenseDropdownOpen, setIsLicenseDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [repoSearchQuery, setRepoSearchQuery] = useState(initialQuery);
  const [activeRepoSearch, setActiveRepoSearch] = useState(initialQuery);
  const [isRepoFilterOpen, setIsRepoFilterOpen] = useState(false);
  const [owners, setOwners] = useState<RepositoryOwnerListItem[]>([]);
  const [subCategories, setSubCategories] = useState<RepositorySubCategory[]>([]);

  const selectedTopic = searchParams.get("topic") || null;
  const selectedOwnerSlug = searchParams.get("owner") || null;
  const selectedSubCategorySlug = searchParams.get("subCategory") || null;

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

  // Fetch subcategories once on mount
  useEffect(() => {
    async function loadSubCategories() {
      try {
        const data = await fetchRepositorySubCategories();
        setSubCategories(data || []);
      } catch (e) {
        console.error("Failed to fetch repository subcategories:", e);
      }
    }
    loadSubCategories();
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
        subCategory: selectedSubCategorySlug,
      },
    ],
    queryFn: async ({ pageParam }) => {
      const backendSort = getBackendSortValue(sortField, sortOrder);
      return fetchRepositories({
        q: activeRepoSearch || undefined,
        sort: backendSort,
        topic: selectedTopic || undefined,
        owner: selectedOwnerSlug || undefined,
        subCategory: selectedSubCategorySlug || undefined,
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

  const handleSelectSubCategory = (slug: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (slug) {
      params.set("subCategory", slug);
    } else {
      params.delete("subCategory");
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
      <main className="mx-auto max-w-[1440px] px-8 py-12 flex-1 w-full">
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

        {/* Subcategory Filter Chips */}
        {subCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => handleSelectSubCategory(null)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                !selectedSubCategorySlug
                  ? "border-[#6E56CF] bg-[#6E56CF] text-white"
                  : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              All
            </button>
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSelectSubCategory(sub.slug)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  selectedSubCategorySlug === sub.slug
                    ? "border-[#6E56CF] bg-[#6E56CF] text-white"
                    : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {sub.name}
              </button>
            ))}
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
            sortField={sortField}
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
      <ScrollToTopButton />
    </div>
  );
}
