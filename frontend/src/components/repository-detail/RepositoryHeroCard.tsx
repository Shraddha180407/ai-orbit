'use client';

import React from "react";
import Link from "next/link";
import Github from "lucide-react/dist/esm/icons/github";
import Star from "lucide-react/dist/esm/icons/star";
import GitFork from "lucide-react/dist/esm/icons/git-fork";
import Clock from "lucide-react/dist/esm/icons/clock";
import Globe from "lucide-react/dist/esm/icons/globe";
import FileText from "lucide-react/dist/esm/icons/file-text";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import { RepositoryDetailResponse } from "@/lib/types";

interface RepositoryHeroCardProps {
  repo: RepositoryDetailResponse;
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

export function RepositoryHeroCard({ repo }: RepositoryHeroCardProps) {
  const avatarUrl = repo.logoUrl || repo.ownerAvatarUrl;
  const updateHours = getRelativeTime(repo.syncedAt) || getRelativeTime(repo.githubCreatedAt) || "—";
  const forksCount = repo.forks !== undefined && repo.forks !== null ? repo.forks : 0;

  return (
    <div className="relative z-10 flex flex-col gap-6 rounded-xl border border-white/[0.08] bg-[#131316] p-6 md:p-8 shadow-2xl">
      {/* Top Section: Logo, Title, Owner, Description, Action Buttons */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 min-w-0 flex-1">
          {/* Logo Container */}
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-neutral-950 p-2 shadow-xl self-start">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${repo.owner} logo`}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-white select-none">
                {repo.owner.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Heading Information */}
          <div className="flex flex-col min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {repo.name}
            </h1>
            <p className="text-sm font-semibold text-white/50 mt-1">
              {repo.owner} / {repo.name}
            </p>
            <p className="mt-3 text-[14px] text-white/70 max-w-2xl leading-relaxed line-clamp-3">
              {repo.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 md:self-start">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full md:w-[170px] justify-center items-center gap-2 rounded-lg bg-[#2d2e39] hover:bg-[#232329] px-4 py-2.5 text-sm font-semibold text-white border border-[#444c5b] hover:border-blue-500 shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Github size={16} />
            Repository Page
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full md:w-[170px] justify-center items-center gap-2 rounded-lg bg-[#2d2e39] hover:bg-[#232329] px-4 py-2.5 text-sm font-semibold text-white border border-[#444c5b] hover:border-blue-500 shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Globe size={16} />
              Visit Website
            </a>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/[0.06] my-2" />

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-white/60 font-mono">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Star size={15} className="text-[#71717A]/80 fill-[#71717A]/10 shrink-0" />
          <span className="font-semibold text-white/80">{repo.stars.toLocaleString()}</span>
          <span className="text-white/40">stars</span>
        </div>

        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <GitFork size={15} className="text-[#71717A]/80 shrink-0" />
          <span className="font-semibold text-white/80">{forksCount.toLocaleString()}</span>
          <span className="text-white/40">forks</span>
        </div>

        {repo.language && (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" />
            <span className="font-semibold text-white/80">{repo.language}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <FileText size={15} className="text-[#71717A]/80 shrink-0" />
          <span className="font-semibold text-white/80">{repo.license || "—"}</span>
        </div>

        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Clock size={15} className="text-[#71717A]/80 shrink-0" />
          <span className="text-white/40">Updated</span>
          <span className="font-semibold text-white/80">{updateHours}</span>
        </div>
      </div>

      {/* Topic Pills */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {repo.topics.map((topic) => (
            <Link
              key={topic}
              href={`/repositories?topic=${topic}`}
              className="text-[11px] font-semibold text-white/80 px-[10px] py-[3px] rounded-full border border-white/[0.06] bg-white/[0.02] hover:bg-white/10 hover:text-white border border-white/[0.08] transition-all whitespace-nowrap cursor-pointer"
            >
              {topic}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
