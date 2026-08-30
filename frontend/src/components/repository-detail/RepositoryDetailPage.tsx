'use client';

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRepositoryBySlug, API_URL, getFromCache } from "@/lib/api";
import { RepositoryDetailResponse } from "@/lib/types";
import { RepositoryBreadcrumb } from "./RepositoryBreadcrumb";
import { RepositoryHeroCard } from "./RepositoryHeroCard";
import { RepositoryReadme } from "./RepositoryReadme";
import { RepositoryLoadingSkeleton } from "./RepositoryLoadingSkeleton";
import { RepositoryErrorState } from "./RepositoryErrorState";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface RepositoryDetailPageProps {
  slug: string;
}

export function RepositoryDetailPage({ slug }: RepositoryDetailPageProps) {
  const { data: repo = null, isLoading, isError } = useQuery<RepositoryDetailResponse | null>({
    queryKey: ["repository-detail", slug],
    queryFn: () => fetchRepositoryBySlug(slug),
    initialData: () => {
      if (!slug) return undefined;
      return getFromCache<RepositoryDetailResponse>(`${API_URL}/api/v1/repositories/${encodeURIComponent(slug)}`) || undefined;
    },
    staleTime: 15 * 60 * 1000,
    enabled: Boolean(slug),
  });

  const wrapLayout = (content: React.ReactNode) => (
    <div className="flex flex-col flex-1">

      <main className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 pt-0 pb-12 flex-1 w-full">
        {content}
      </main>

    </div>
  );

  if (isLoading && !repo) {
    return wrapLayout(<RepositoryLoadingSkeleton />);
  }

  if (isError || !repo) {
    return wrapLayout(<RepositoryErrorState message="Repository not found" />);
  }

  return wrapLayout(
    <div className="flex flex-col gap-6">
      <RepositoryBreadcrumb owner={repo.owner} name={repo.name} companySlug={repo.companySlug} />
      <RepositoryHeroCard repo={repo} />
      <RepositoryReadme 
        readmeHtml={repo.readmeHtml} 
        repoOwner={repo.owner}
        repoName={repo.name}
        repoDefaultBranch={repo.defaultBranch}
      />
    </div>
  );
}
