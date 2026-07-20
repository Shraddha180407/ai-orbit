'use client';

import React from "react";
import Link from "next/link";
import Github from "lucide-react/dist/esm/icons/github";
import Star from "lucide-react/dist/esm/icons/star";
import GitFork from "lucide-react/dist/esm/icons/git-fork";
import { Repository } from "@/lib/types";

interface RepositoryRowProps {
  repo: Repository;
  rank: number;
}

// Reusable subcomponents to reduce duplicated markup
function RepositoryTitle({ name, className = "" }: { name: string; className?: string }) {
  return (
    <h3 className={`font-medium text-white text-[13px] truncate ${className}`}>
      {name}
      <span className="sr-only"> (opens in a new tab)</span>
    </h3>
  );
}

function GithubIconButton({ size, className = "" }: { size: number; className?: string }) {
  return (
    <div className={`h-[28px] w-[28px] rounded-full border border-[#444c5b] bg-[#2d2e39] flex items-center justify-center text-[#71717A] shrink-0 ${className}`}>
      <Github size={size} />
    </div>
  );
}

const getRelativeTime = (dateStr?: string | null) => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins || 1}m`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d`;
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks}w`;
  } catch {
    return null;
  }
};

export const RepositoryRow = React.memo(function RepositoryRow({ repo, rank }: RepositoryRowProps) {
  const starCount = repo.stars;
  const forksCount = repo.forks !== undefined && repo.forks !== null ? repo.forks : 0;
  const sizeText = `${(repo.stars / 210 + 1.2).toFixed(1)} MB`;
  
  const licenseText = repo.license || null;
  const avatarUrl = repo.logoUrl || repo.ownerAvatarUrl;
  const updateHours = getRelativeTime(repo.syncedAt) || getRelativeTime(repo.githubCreatedAt) || "—";

  return (
    <>
      {/* Desktop & Tablet Grid Row */}
      <Link
        href={`/repositories/${repo.slug || repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        aria-label={`View details for ${repo.name} repository`}
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
        className="hidden sm:grid grid-cols-[30px_1fr_95px_110px_60px] md:grid-cols-[30px_1fr_180px_95px_130px_60px] lg:grid-cols-[30px_1fr_180px_95px_95px_130px_110px_60px] xl:grid-cols-[30px_1fr_180px_95px_95px_130px_95px_110px_60px] gap-[10px] items-center py-[7px] px-[9px] h-[65px] bg-transparent hover:bg-white/[0.02] transition-colors w-full focus-visible:bg-white/[0.02] focus-visible:outline-none group border-b border-white/[0.06] last:border-b-0"
      >
        {/* Column 1: Rank */}
        <div className="text-[11px] text-[#71717A] font-mono text-center shrink-0">
          {rank}
        </div>

        {/* Column 2: Repository Name (Vertically Centered) */}
        <div className="min-w-0 flex items-center h-full text-left">
          <RepositoryTitle name={repo.name} className="group-hover:text-white transition-colors" />
        </div>

        {/* Column 3: Company / Owner */}
        <div className="min-w-0 flex items-center gap-[6px] text-[13px] text-[#A1A1AA] font-semibold hidden md:flex text-left">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${repo.owner} logo`}
              className="h-[20px] w-[20px] rounded-[3px] shrink-0 object-cover"
            />
          ) : (
            <div className="h-[20px] w-[20px] rounded-[3px] shrink-0 bg-neutral-800 flex items-center justify-center text-[10px] font-black text-white">
              {repo.owner.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="truncate">{repo.owner}</span>
        </div>

        {/* Column 4: Stars */}
        <div className="text-[13px] text-[#A1A1AA] font-mono flex items-center justify-center gap-[6px] whitespace-nowrap w-full">
          <Star size={16} className="text-[#71717A]/80 fill-[#71717A]/10 shrink-0" />
          <span>{starCount.toLocaleString()}</span>
        </div>

        {/* Column 5: Forks */}
        <div className="text-[13px] text-[#A1A1AA] font-mono flex items-center justify-center gap-[6px] hidden lg:flex whitespace-nowrap w-full">
          <GitFork size={16} className="text-[#71717A]/80 shrink-0" />
          <span>{forksCount.toLocaleString()}</span>
        </div>

        {/* Column 6: License Badge */}
        <div className="hidden md:flex justify-center items-center h-full w-full">
          {licenseText ? (
            <span className="text-[11px] font-semibold text-[#A1A1AA] px-[8px] py-[2px] h-[20px] leading-[14px] flex items-center rounded-full border border-[#444c5b] bg-[#292932] whitespace-nowrap">
              {licenseText}
            </span>
          ) : (
            <span className="text-[#71717A] text-[11px] font-mono">—</span>
          )}
        </div>

        {/* Column 7: Size */}
        <div className="text-[13px] text-[#A1A1AA] font-mono flex items-center justify-center hidden xl:flex whitespace-nowrap w-full">
          {sizeText}
        </div>

        {/* Column 8: Updated */}
        <div className="text-[13px] text-[#A1A1AA] font-mono flex items-center justify-center block md:hidden lg:flex whitespace-nowrap w-full">
          {updateHours}
        </div>

        {/* Column 9: Action Link */}
        <div className="flex justify-center items-center w-full">
          <GithubIconButton size={20} className="group-hover:text-white group-hover:bg-[#232329] transition-colors" />
        </div>
      </Link>

      {/* Mobile Card List Row */}
      <Link
        href={`/repositories/${repo.slug || repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        aria-label={`View details for ${repo.name} repository`}
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
        className="block sm:hidden p-[12px] bg-transparent hover:bg-white/[0.02] transition-colors w-full focus-visible:bg-white/[0.02] focus-visible:outline-none flex justify-between items-center gap-[10px] border-b border-white/[0.06] last:border-b-0"
      >
        <div className="flex-1 min-w-0">
          {/* Row 1: Title & Owner */}
          <div className="flex items-baseline min-w-0">
            <span className="text-[11px] font-mono text-[#71717A] mr-1.5 shrink-0">#{rank}</span>
            <RepositoryTitle name={repo.name} />
            <span className="text-[13px] text-[#71717A] ml-2 shrink-0">by {repo.owner}</span>
          </div>

          {/* Row 2: Stats Inline Bar */}
          <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#71717A] font-mono mt-1">
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
                <span className="px-[6px] py-[1px] rounded-full border border-[#444c5b] bg-[#292932] text-[9px] text-[#A1A1AA]">
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
        <GithubIconButton size={16} />
      </Link>
    </>
  );

});
