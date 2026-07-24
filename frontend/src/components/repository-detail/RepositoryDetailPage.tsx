'use client';

import React, { useEffect, useState } from "react";
import { fetchRepositoryBySlug } from "@/lib/api";
import { RepositoryDetailResponse } from "@/lib/types";
import { RepositoryBreadcrumb } from "./RepositoryBreadcrumb";
import { RepositoryHeroCard } from "./RepositoryHeroCard";
import { RepositoryReadme } from "./RepositoryReadme";
import { RepositoryLoadingSkeleton } from "./RepositoryLoadingSkeleton";
import { RepositoryErrorState } from "./RepositoryErrorState";

interface RepositoryDetailPageProps {
  slug: string;
}

export function RepositoryDetailPage({ slug }: RepositoryDetailPageProps) {
  const [repo, setRepo] = useState<RepositoryDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getRepo() {
      try {
        const data = await fetchRepositoryBySlug(slug);
        if (data) {
          setRepo(data);
        } else {
          setError("Repository not found");
        }
      } catch (e) {
        console.error("Failed to fetch repository:", e);
        setError("An error occurred while loading the repository");
      } finally {
        setIsLoading(false);
      }
    }
    getRepo();
  }, [slug]);

  if (isLoading) {
    return <RepositoryLoadingSkeleton />;
  }

  if (error || !repo) {
    return <RepositoryErrorState message={error || "Repository not found"} />;
  }

  return (
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
