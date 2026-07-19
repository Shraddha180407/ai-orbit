'use client';

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Repository } from "@/lib/types";
import { fetchAllRepos } from "@/lib/api";
import { RepositoryHero } from "@/components/ui/RepositoryHero";
import { RepositoryTable } from "@/components/ui/RepositoryTable";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { RepositoryRow } from "@/components/ui/RepositoryRow";
import { resolveRepositoryLicense } from "@/lib/utils";

export function RepositoriesClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [repos, setRepos] = useState<Repository[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<"stars" | "forks" | "size" | "updated" | null>("stars");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [isLicenseDropdownOpen, setIsLicenseDropdownOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [repoSearchQuery, setRepoSearchQuery] = useState(initialQuery);
  const [activeRepoSearch, setActiveRepoSearch] = useState(initialQuery);
  const [isRepoFilterOpen, setIsRepoFilterOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getRepos() {
      try {
        const data = await fetchAllRepos();
        setRepos(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch repositories:", e);
      } finally {
        setIsLoading(false);
      }
    }
    getRepos();
  }, []);

  // IntersectionObserver for client-side endless scroll
  useEffect(() => {
    if (isLoading || visibleCount >= repos.length) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + 15);
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
  }, [isLoading, visibleCount, repos.length]);

  function handleSort(field: "stars" | "forks" | "size" | "updated") {
    if (sortField === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  }

  // Generate dynamic license counts from the loaded datasets
  const licenseCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((repo) => {
      const license = resolveRepositoryLicense(repo.name);
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

  // Filter repositories by name
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
    return companyFilteredRepos.filter((repo) => resolveRepositoryLicense(repo.name) === selectedLicense);
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
        valA = Math.round(a.stars / 8.5) || 12;
        valB = Math.round(b.stars / 8.5) || 12;
      } else if (sortField === "size") {
        valA = a.stars / 210 + 1.2;
        valB = b.stars / 210 + 1.2;
      } else if (sortField === "updated") {
        // High stars mock more recent update times for client demonstration consistency
        valA = (a.stars % 6) + 2;
        valB = (b.stars % 6) + 2;
      }

      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  }, [filteredRepos, sortField, sortOrder]);

  const visibleRepos = sortedRepos.slice(0, visibleCount);

  function handleApplyRepoSearch() {
    setActiveRepoSearch(repoSearchQuery);
    setIsRepoFilterOpen(false);
  }

  function handleResetRepoSearch() {
    setRepoSearchQuery("");
    setActiveRepoSearch("");
    setIsRepoFilterOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="mx-auto max-w-[1070px] px-8 py-12 flex-1 w-full">
        <RepositoryHero />

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
            totalCount={repos.length}
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
                className="grid grid-cols-[30px_1fr_70px_80px_50px] md:grid-cols-[30px_1fr_130px_70px_100px_50px] lg:grid-cols-[30px_1fr_130px_70px_70px_100px_80px_50px] xl:grid-cols-[30px_1fr_130px_70px_70px_100px_70px_80px_50px] gap-[10px] items-center py-[14px] px-[10px] h-[58.4px] w-full animate-pulse border-b border-[#232326]/30 last:border-b-0"
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
            totalCount={repos.length}
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
            {visibleRepos.map((repo: Repository, index: number) => (
              <RepositoryRow key={repo.id} repo={repo} rank={index + 1} />
            ))}

            {/* Sentinel for infinite scroll */}
            {sortedRepos.length > 0 && visibleCount < sortedRepos.length && (
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