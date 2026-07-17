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
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
        className="hidden sm:grid grid-cols-[30px_1fr_70px_80px_50px] md:grid-cols-[30px_1fr_130px_70px_100px_50px] lg:grid-cols-[30px_1fr_130px_70px_70px_100px_80px_50px] xl:grid-cols-[30px_1fr_130px_70px_70px_100px_70px_80px_50px] gap-[10px] items-center py-[14px] px-[10px] h-[58.4px] bg-transparent hover:bg-white/[0.02] transition-colors w-full focus-visible:bg-white/[0.02] focus-visible:outline-none group border-b border-[#232326]/30 last:border-b-0"
      >
        {/* Column 1: Rank */}
        <div className="text-[11px] text-[#71717A] font-mono text-center shrink-0">
          {rank}
        </div>

        {/* Column 2: Repository Name (Vertically Centered) */}
        <div className="min-w-0 flex items-center h-full text-left">
          <h3 className="font-medium text-white text-[11px] truncate group-hover:text-white transition-colors">
            {repo.name}
            <span className="sr-only"> (opens in a new tab)</span>
          </h3>
        </div>

        {/* Column 3: Company / Owner */}
        <div className="min-w-0 flex items-center gap-[6px] text-[11px] text-[#A1A1AA] font-semibold hidden md:flex text-left">
          {logoBg && (
            <div className={`h-[20px] w-[20px] rounded-[3px] shrink-0 ${logoBg} flex items-center justify-center text-[10px] font-black text-white`}>
              {repo.owner.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="truncate">{repo.owner}</span>
        </div>

        {/* Column 4: Stars */}
        <div className="text-[11px] text-[#A1A1AA] font-mono flex items-center justify-center gap-[6px] whitespace-nowrap w-full">
          <Star size={16} className="text-[#71717A]/80 fill-[#71717A]/10 shrink-0" />
          <span>{starCount.toLocaleString()}</span>
        </div>

        {/* Column 5: Forks */}
        <div className="text-[11px] text-[#A1A1AA] font-mono flex items-center justify-center gap-[6px] hidden lg:flex whitespace-nowrap w-full">
          <GitFork size={16} className="text-[#71717A]/80 shrink-0" />
          <span>{forksCount.toLocaleString()}</span>
        </div>

        {/* Column 6: License Badge */}
        <div className="hidden md:flex justify-center items-center h-full w-full">
          {licenseText ? (
            <span className="text-[11px] font-semibold text-[#A1A1AA] px-[8px] py-[2px] h-[20px] leading-[14px] flex items-center rounded-[999px] border border-[#232326] bg-transparent whitespace-nowrap">
              {licenseText}
            </span>
          ) : (
            <span className="text-[#71717A] text-[11px] font-mono">—</span>
          )}
        </div>

        {/* Column 7: Size */}
        <div className="text-[11px] text-[#A1A1AA] font-mono text-center hidden xl:block whitespace-nowrap w-full">
          {sizeText}
        </div>

        {/* Column 8: Updated */}
        <div className="text-[11px] text-[#A1A1AA] font-mono text-center block md:hidden lg:block whitespace-nowrap w-full">
          {updateHours}
        </div>

        {/* Column 9: Action Link */}
        <div className="flex justify-center items-center w-full">
          <div className="h-[28px] w-[28px] rounded-full border border-[#232326] bg-[#18181C] flex items-center justify-center text-[#71717A] group-hover:text-white group-hover:bg-[#232329] transition-colors shrink-0">
            <Github size={20} />
          </div>
        </div>
      </a>

      {/* Mobile Card List Row */}
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${repo.name} repository by ${repo.owner} on GitHub in a new tab`}
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
        className="block sm:hidden p-[12px] bg-transparent hover:bg-white/[0.02] transition-colors w-full focus-visible:bg-white/[0.02] focus-visible:outline-none flex justify-between items-center gap-[10px] border-b border-[#232326]/30 last:border-b-0"
      >
        <div className="flex-1 min-w-0">
          {/* Row 1: Title & Owner */}
          <div className="flex items-baseline min-w-0">
            <span className="text-[11px] font-mono text-[#71717A] mr-1.5 shrink-0">#{rank}</span>
            <h3 className="font-medium text-white text-[11px] truncate">
              {repo.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </h3>
            <span className="text-[10px] text-[#71717A] ml-2 shrink-0">by {repo.owner}</span>
          </div>

          {/* Row 2: Stats Inline Bar */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#71717A] font-mono mt-1">
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
                <span className="px-[6px] py-[1px] rounded-full border border-[#232326] text-[9px] text-[#A1A1AA]">
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
        <div className="h-[28px] w-[28px] rounded-full border border-[#232326] bg-[#18181C] flex items-center justify-center text-[#71717A] shrink-0">
          <Github size={16} />
        </div>
      </a>
    </>
  );

});

