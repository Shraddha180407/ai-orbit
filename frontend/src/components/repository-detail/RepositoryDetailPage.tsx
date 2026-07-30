'use client';

import React, { useEffect, useState } from "react";
import { fetchRepositoryBySlug } from "@/lib/api";
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

  const wrapLayout = (content: React.ReactNode) => (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <Header />
      <main className="mx-auto max-w-[1440px] px-8 pt-0 pb-12 flex-1 w-full">
        {content}
      </main>
      <Footer />
    </div>
  );

  if (isLoading) {
    return wrapLayout(<RepositoryLoadingSkeleton />);
  }

  if (error || !repo) {
    return wrapLayout(<RepositoryErrorState message={error || "Repository not found"} />);
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
