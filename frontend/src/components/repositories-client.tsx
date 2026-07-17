'use client';

import React, { useEffect, useState, useRef } from "react";
import Github from 'lucide-react/dist/esm/icons/github';
import { Repository } from "@/lib/types";
import { fetchAllRepos } from "@/lib/api";

export function RepositoriesClient() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getRepos() {
      try {
        const data = await fetchAllRepos();
        setRepos(data || []);
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

  const visibleRepos = repos.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="mx-auto max-w-[1070px] px-8 py-12 flex-1 w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Github className="text-[#6E56CF]" />
            Trending AI Repositories
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-2">
            Discover popular open-source projects, tools, and models pushing developer capabilities on GitHub.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-[#131316]/50" />
            ))}
          </div>
        ) : repos.length === 0 ? (
          <div className="text-center py-20 border border-[#232326] bg-[#131316] rounded-xl">
            <p className="text-[#A1A1AA] text-sm">No repositories found.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {visibleRepos.map((repo: Repository) => (
              <a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-1 sm:grid-cols-[40px_1fr_180px_120px] gap-4 items-center p-4 bg-transparent hover:bg-[#18181C]/40 transition-all w-full focus-visible:bg-[#18181C]/40 focus-visible:outline-none"
              >
                {/* Column 1: Initials */}
                <div className="h-10 w-10 rounded-lg bg-[#18181C] flex items-center justify-center font-bold text-white uppercase border border-[#232326]/60 shrink-0">
                  {repo.name.charAt(0)}
                </div>

                {/* Column 2: Name + Description */}
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-white text-sm truncate group-hover:text-white transition-colors">
                      {repo.name}
                    </h3>
                    <span className="text-[10px] text-[#71717A]">by {repo.owner}</span>
                  </div>
                  <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-1 leading-relaxed">
                    {repo.description}
                  </p>
                </div>

                {/* Column 3: Stars & Language */}
                <div className="text-xs text-[#A1A1AA] font-mono flex flex-col gap-0.5 sm:block hidden">
                  <div>⭐ {repo.stars.toLocaleString()} stars</div>
                  <div className="text-[10px] text-[#71717A]">Lang: {repo.language}</div>
                </div>

                {/* Column 4: Github Link */}
                <div className="text-right sm:block hidden">
                  <span className="text-xs font-semibold text-[#71717A] group-hover:text-white transition-colors shrink-0">
                    Github &rarr;
                  </span>
                </div>
              </a>
            ))}

            {/* Sentinel for infinite scroll */}
            {repos.length > 0 && visibleCount < repos.length && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
