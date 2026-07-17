'use client';

import React from "react";
import Github from "lucide-react/dist/esm/icons/github";
import Star from "lucide-react/dist/esm/icons/star";
import GitFork from "lucide-react/dist/esm/icons/git-fork";
import { resolveRepositoryLicense, resolveCompanyLogoBg } from "@/lib/utils";

interface Repository {
  id: string;
  url: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  language: string;
}

interface RepositoryRowProps {
  repo: Repository;
  rank: number;
}

export const RepositoryRow = React.memo(function RepositoryRow({ repo, rank }: RepositoryRowProps) {
  // Stable derived placeholder metadata since DB modifications are deferred
  const starCount = repo.stars;
  const forksCount = Math.round(repo.stars / 8.5) || 12;
  const sizeText = `${(repo.stars / 210 + 1.2).toFixed(1)} MB`;
  
  // Resolve license and logo properties using shared utilities
  const licenseText = resolveRepositoryLicense(repo.name);
  const logoBg = resolveCompanyLogoBg(repo.owner);
  const updateHours = `${(repo.stars % 6) + 2}h`;

  return (
    <>
      {/* Desktop & Tablet Grid Row */}
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${repo.name} repository on GitHub in a new tab`}
        className="hidden sm:grid grid-cols-[0.3fr_3fr_1.2fr_1.2fr_0.4fr] md:grid-cols-[0.3fr_2.5fr_1.5fr_1fr_1fr_0.4fr] lg:grid-cols-[0.3fr_2fr_1.2fr_0.8fr_0.8fr_0.8fr_0.6fr_0.3fr] xl:grid-cols-[0.3fr_2.5fr_1.5fr_1fr_1fr_1fr_1fr_0.8fr_0.4fr] gap-4 items-center py-5 px-4 bg-transparent hover:bg-surface-raised/40 transition-all w-full focus-visible:bg-surface-raised/40 focus-visible:outline-none group"
      >
        {/* Column 1: Rank */}
        <div className="text-xs text-[#71717A] font-mono text-center shrink-0">
          {rank}
        </div>

        {/* Column 2: Repository Name & Description */}
        <div className="min-w-0">
          <h3 className="font-bold text-white text-sm truncate group-hover:text-white transition-colors">
            {repo.name}
            <span className="sr-only"> (opens in a new tab)</span>
          </h3>
          <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1 leading-relaxed">
            {repo.description}
          </p>
        </div>

        {/* Column 3: Company / Owner */}
        <div className="min-w-0 flex items-center gap-2 text-xs text-[#A1A1AA] font-medium hidden md:flex">
          {logoBg && (
            <div className={`h-3.5 w-3.5 rounded shrink-0 ${logoBg} flex items-center justify-center text-[8px] font-black text-white`}>
              {repo.owner.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="truncate">{repo.owner}</span>
        </div>

        {/* Column 4: Stars */}
        <div className="text-xs text-[#A1A1AA] font-mono flex items-center gap-1 block">
          <Star size={12} className="text-[#71717A]/80 fill-[#71717A]/10" />
          <span>{starCount.toLocaleString()}</span>
        </div>

        {/* Column 5: Forks */}
        <div className="text-xs text-[#A1A1AA] font-mono flex items-center gap-1 hidden lg:flex">
          <GitFork size={12} className="text-[#71717A]/80" />
          <span>{forksCount.toLocaleString()}</span>
        </div>

        {/* Column 6: License Badge */}
        <div className="hidden md:block">
          {licenseText ? (
            <span className="text-[10px] font-semibold text-white px-2.5 py-0.5 rounded-full bg-border/60 border border-white/[0.04] inline-block w-fit">
              {licenseText}
            </span>
          ) : (
            <span className="text-[#71717A] text-xs font-mono ml-4">—</span>
          )}
        </div>

        {/* Column 7: Size */}
        <div className="text-xs text-[#A1A1AA] font-mono hidden xl:block">
          {sizeText}
        </div>

        {/* Column 8: Updated */}
        <div className="text-xs text-[#A1A1AA] font-mono block md:hidden lg:block">
          {updateHours}
        </div>

        {/* Column 9: Action Link */}
        <div className="flex justify-end block">
          <div className="h-8 w-8 rounded-full border border-[#232326] bg-[#18181C] flex items-center justify-center text-[#71717A] group-hover:text-white group-hover:border-neutral-500 group-hover:bg-[#1C1C22] transition-all duration-200 shrink-0">
            <Github size={15} />
          </div>
        </div>
      </a>

      {/* Mobile Card List Row */}
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${repo.name} repository by ${repo.owner} on GitHub in a new tab`}
        className="block sm:hidden p-5 bg-transparent hover:bg-surface-raised/40 transition-all w-full focus-visible:bg-surface-raised/40 focus-visible:outline-none flex justify-between items-center gap-4"
      >
        <div className="flex-1 min-w-0">
          {/* Row 1: Title & Owner */}
          <div className="flex items-baseline min-w-0">
            <span className="text-xs font-mono text-[#71717A] mr-1.5 shrink-0">#{rank}</span>
            <h3 className="font-bold text-white text-sm truncate">
              {repo.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </h3>
            <span className="text-[10px] text-[#71717A] ml-2 shrink-0">by {repo.owner}</span>
          </div>

          {/* Row 2: Description */}
          <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1 leading-relaxed">
            {repo.description}
          </p>

          {/* Row 3: Stats Inline Bar */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#71717A] font-mono mt-1.5">
            <span className="flex items-center gap-0.5">
              ⭐ {starCount.toLocaleString()}
            </span>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              🍴 {forksCount.toLocaleString()}
            </span>
            {licenseText && (
              <>
                <span>·</span>
                <span className="px-2 py-0.5 rounded-full bg-border/60 border border-white/[0.04] text-[9px]">
                  {licenseText}
                </span>
              </>
            )}
            <span>·</span>
            <span>{sizeText}</span>
            <span>·</span>
            <span className="text-[#22C55E]">{updateHours}</span>
          </div>
        </div>

        {/* Far Right Action Icon */}
        <div className="h-8 w-8 rounded-full border border-[#232326] bg-[#18181C] flex items-center justify-center text-[#71717A] shrink-0">
          <Github size={15} />
        </div>
      </a>
    </>
  );

});

