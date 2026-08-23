'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Github from "lucide-react/dist/esm/icons/github";
import Star from "lucide-react/dist/esm/icons/star";
import GitFork from "lucide-react/dist/esm/icons/git-fork";
import { Repository } from "@/lib/types";

interface RepositoryRowProps {
  repo: Repository;
}

// Reusable subcomponents to reduce duplicated markup
function RepositoryTitle({ name, className = "" }: { name: string; className?: string }) {
  const displayName = name ? name.charAt(0).toUpperCase() + name.slice(1) : name;
  return (
    <h3 className={`font-medium text-white text-[13px] truncate ${className}`}>
      {displayName}
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

export const RepositoryRow = React.memo(function RepositoryRow({ repo }: RepositoryRowProps) {
  const router = useRouter();
  
  const starCount = repo.stars;
  const forksCount = repo.forks !== undefined && repo.forks !== null ? repo.forks : 0;
  const sizeText = `${(repo.stars / 210 + 1.2).toFixed(1)} MB`;
  
  const licenseText = repo.license || null;
  const avatarUrl = repo.logoUrl || repo.ownerAvatarUrl;
  const updateHours = getRelativeTime(repo.syncedAt) || getRelativeTime(repo.githubCreatedAt) || "—";

  const handleRowClick = () => {
    router.push(`/repositories/${repo.slug || repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
  };

  return (
    <>
      {/* Desktop & Tablet Grid Row */}
      <div
        role="link"
        tabIndex={0}
        onClick={handleRowClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRowClick();
          }
        }}
        aria-label={`View details for ${repo.name} repository`}
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
        className="hidden sm:grid grid-cols-[minmax(0,2.5fr)_minmax(0,1.8fr)_minmax(0,1.5fr)_60px] md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.8fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_60px] lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_60px] xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_60px] gap-[10px] items-center py-[7px] px-[9px] h-[65px] bg-transparent hover:bg-white/[0.02] transition-colors w-full focus-visible:bg-white/[0.02] focus-visible:outline-none group border-b border-white/[0.06] last:border-b-0 cursor-pointer"
      >

        {/* Column 2: Repository Name (Vertically Centered) */}
        <div className="min-w-0 flex items-center h-full text-left pl-5">
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
          <span>{starCount.toLocaleString("en-US")}</span>
        </div>

        {/* Column 5: Forks */}
        <div className="text-[13px] text-[#A1A1AA] font-mono flex items-center justify-center gap-[6px] hidden lg:flex whitespace-nowrap w-full">
          <GitFork size={16} className="text-[#71717A]/80 shrink-0" />
          <span>{forksCount.toLocaleString("en-US")}</span>
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
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Open ${repo.name} repository on GitHub`}
            className="z-10 cursor-pointer"
          >
            <GithubIconButton size={20} className="hover:text-white hover:bg-[#232329] transition-all" />
          </a>
        </div>
      </div>

      {/* Mobile Card List Row */}
      <div
        role="link"
        tabIndex={0}
        onClick={handleRowClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRowClick();
          }
        }}
        aria-label={`View details for ${repo.name} repository`}
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
        className="block sm:hidden p-[12px] bg-transparent hover:bg-white/[0.02] transition-colors w-full focus-visible:bg-white/[0.02] focus-visible:outline-none flex justify-between items-center gap-[10px] border-b border-white/[0.06] last:border-b-0 cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          {/* Row 1: Title & Owner */}
          <div className="flex items-baseline min-w-0">
            <RepositoryTitle name={repo.name} />
            <span className="text-[13px] text-[#71717A] ml-2 shrink-0">by {repo.owner}</span>
          </div>

          {/* Row 2: Stats Inline Bar */}
          <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#71717A] font-mono mt-1">
            <span className="flex items-center gap-0.5">
              ⭐ {starCount.toLocaleString("en-US")}
            </span>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              🍴 {forksCount.toLocaleString("en-US")}
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
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${repo.name} repository on GitHub`}
          className="z-10 cursor-pointer"
        >
          <GithubIconButton size={16} className="hover:text-white hover:bg-[#232329] transition-all" />
        </a>
      </div>
    </>
  );
});
