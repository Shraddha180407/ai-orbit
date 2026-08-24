"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import Bot from "lucide-react/dist/esm/icons/bot";
import Building2 from "lucide-react/dist/esm/icons/building-2";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import Tag from "lucide-react/dist/esm/icons/tag";
import Globe from "lucide-react/dist/esm/icons/globe";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import DollarSign from "lucide-react/dist/esm/icons/dollar-sign";
import Zap from "lucide-react/dist/esm/icons/zap";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import Target from "lucide-react/dist/esm/icons/target";
import { Robot } from "@/lib/types";
import { fetchRobotById } from "@/lib/api";
import { CategoryChip } from "@/components/CategoryChip";

interface RobotDetailClientProps {
  id: string;
}

function AvailabilityBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  let colorClass = "border-[#232326] bg-[#18181C] text-[#A1A1AA]";
  if (s.includes("available") || s.includes("commercial")) {
    colorClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
  } else if (s.includes("development") || s.includes("pilot")) {
    colorClass = "border-amber-500/40 bg-amber-500/10 text-amber-400";
  } else if (s.includes("discontinued")) {
    colorClass = "border-red-500/40 bg-red-500/10 text-red-400";
  } else if (s.includes("pre") || s.includes("order")) {
    colorClass = "border-blue-500/40 bg-blue-500/10 text-blue-400";
  }
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${colorClass}`}>
      {status}
    </span>
  );
}

import { useQuery } from "@tanstack/react-query";

export function RobotDetailClient({ id }: RobotDetailClientProps) {
  const { data: robot = null, isLoading } = useQuery<Robot | null>({
    queryKey: ["robot-detail", id],
    queryFn: () => fetchRobotById(id),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-[1070px] space-y-6">
          <div className="h-5 w-32 animate-pulse rounded bg-[#18181C]" />
          <div className="h-10 w-72 animate-pulse rounded bg-[#18181C]" />
          <div className="h-60 w-full animate-pulse rounded-xl bg-[#18181C]" />
        </div>
      </main>
    );
  }

  if (!robot) {
    return (
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-[1070px] text-center py-20">
          <Bot size={40} className="mx-auto text-[#71717A] mb-4" />
          <p className="text-lg font-semibold text-white">Robot not found</p>
          <p className="text-sm text-[#A1A1AA] mt-2">
            The robot you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/robots"
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-[#2DD4BF] hover:underline"
          >
            <ArrowLeft size={14} />
            Back to Robots
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-[1070px] space-y-8">
        {/* Breadcrumb */}
        <Link
          href="/robots"
          className="inline-flex items-center gap-1.5 text-sm text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Robots
        </Link>

        {/* Hero card */}
        <div className="rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-6 sm:p-8">
          <div className="flex items-start gap-5">
            {/* Logo / Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#232326]/60 bg-[#18181C] overflow-hidden">
              {robot.logoUrl ? (
                <Image src={robot.logoUrl} alt={robot.name} width={64} height={64} className="object-cover" unoptimized />
              ) : (
                <Bot size={28} className="text-[#2DD4BF]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {robot.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 text-sm text-[#A1A1AA]">
                  <Building2 size={14} className="text-[#71717A]" />
                  {robot.company}
                </div>
                {robot.country && (
                  <div className="inline-flex items-center gap-1.5 text-sm text-[#A1A1AA]">
                    <MapPin size={14} className="text-[#71717A]" />
                    {robot.country}
                  </div>
                )}
                {robot.releaseDate && (
                  <div className="inline-flex items-center gap-1.5 text-sm text-[#A1A1AA]">
                    <Calendar size={14} className="text-[#71717A]" />
                    {robot.releaseDate}
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 text-sm text-[#A1A1AA]">
                  <Tag size={14} className="text-[#71717A]" />
                  <CategoryChip label={robot.category} />
                </div>
                <AvailabilityBadge status={robot.availability} />
              </div>
            </div>

            {/* Website link */}
            {robot.websiteUrl && (
              <a
                href={robot.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#232326]/60 bg-[#18181C] px-3 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white hover:border-[#2DD4BF]/40 transition-colors"
              >
                <Globe size={13} />
                Website
                <ExternalLink size={11} />
              </a>
            )}
          </div>

          {/* About */}
          <div className="mt-6 pt-6 border-t border-[#232326]/60">
            <h2 className="text-xs font-mono font-semibold tracking-wider text-[#71717A] uppercase mb-3">
              About
            </h2>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              {robot.about}
            </p>
          </div>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Category", value: robot.category, icon: Tag },
            { label: "Company", value: robot.company, icon: Building2 },
            { label: "Autonomy Level", value: robot.autonomyLevel || "—", icon: Zap },
            { label: "Price", value: (robot.price && robot.price !== "N/A") ? robot.price : "Not disclosed", icon: DollarSign },
            { label: "Main Task", value: robot.mainTask || "—", icon: Target },
            { label: "Country", value: robot.country || "—", icon: MapPin },
            { label: "Availability", value: robot.availability, icon: Globe },
            { label: "Release Date", value: robot.releaseDate || "—", icon: Calendar },
          ].map((spec) => (
            <div
              key={spec.label}
              className="rounded-lg border border-[#232326]/60 bg-[#131316]/30 px-4 py-3"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <spec.icon size={11} className="text-[#71717A]" />
                <p className="text-[10px] font-mono font-semibold tracking-wider text-[#71717A] uppercase">
                  {spec.label}
                </p>
              </div>
              <p className="text-sm font-medium text-white truncate">
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Specs */}
        {robot.specs && (
          <section>
            <h2 className="text-sm font-semibold text-white mb-3">
              Technical Specifications
            </h2>
            <div className="rounded-lg border border-[#232326]/60 bg-[#131316]/30 p-4">
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {robot.specs}
              </p>
            </div>
          </section>
        )}

        {/* Primary Use Cases */}
        {robot.primaryUseCases && robot.primaryUseCases.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-white mb-3">
              Primary Use Cases
            </h2>
            <div className="flex flex-wrap gap-2">
              {robot.primaryUseCases.map((useCase) => (
                <span
                  key={useCase}
                  className="inline-flex items-center rounded-lg border border-[#232326]/60 bg-[#18181C] px-3 py-1.5 text-[11px] font-medium text-[#A1A1AA]"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Thumbnail / Media */}
        {(robot.thumbnailUrl || (robot.mediaUrls && robot.mediaUrls.length > 0)) && (
          <section>
            <h2 className="text-sm font-semibold text-white mb-3">
              Media
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {robot.thumbnailUrl && (
                <div className="rounded-lg border border-[#232326]/60 overflow-hidden bg-[#18181C]">
                  <Image
                    src={robot.thumbnailUrl}
                    alt={`${robot.name} thumbnail`}
                    width={500}
                    height={300}
                    className="w-full h-auto object-cover"
                    unoptimized
                  />
                </div>
              )}
              {robot.mediaUrls && robot.mediaUrls.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-[#232326]/60 bg-[#131316]/30 p-3 text-sm text-[#A1A1AA] hover:text-white hover:border-[#2DD4BF]/40 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span className="truncate">{url}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Associated Tasks */}
        {robot.tasks && robot.tasks.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-white mb-4">
              Associated Tasks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {robot.tasks.map((task) => (
                <Link
                  key={task.slug}
                  href={`/tasks/${task.slug}`}
                  className="group flex flex-col gap-1.5 rounded-lg border border-[#232326]/60 bg-[#131316]/10 p-4 transition-colors hover:bg-[#18181C]/40"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-white truncate group-hover:text-[#2DD4BF] transition-colors">
                      {task.title}
                    </p>
                    {task.category && (
                      <CategoryChip label={task.category.name} />
                    )}
                  </div>
                  {task.description && (
                    <p className="text-[11px] text-[#A1A1AA] line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Website link (mobile) */}
        {robot.websiteUrl && (
          <div className="sm:hidden">
            <a
              href={robot.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#232326]/60 bg-[#18181C] px-4 py-2.5 text-sm font-medium text-[#A1A1AA] hover:text-white hover:border-[#2DD4BF]/40 transition-colors"
            >
              <Globe size={14} />
              Visit Website
              <ExternalLink size={12} />
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
