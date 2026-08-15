"use client";

import Link from "next/link";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import { SidebarCard } from "./SidebarCard";
import { PublisherIcon } from "./PublisherIcon";
import type { NewsSource } from "@/types/news";

interface PopularSourcesProps {
  popular: string[];
  sources: Record<string, NewsSource>;
}

export function PopularSources({ popular, sources }: PopularSourcesProps) {
  return (
    <SidebarCard
      title="Popular sources"
      action={
        <Link href="/news" className="text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors">
          View all
        </Link>
      }
    >
      <div className="flex flex-col divide-y divide-[#232326]">
        {popular.map((key) => {
          const s = sources[key] || { name: key, domain: `${key.toLowerCase()}.com` };
          return (
            <Link
              key={key}
              href={`/news?source=${encodeURIComponent(key)}`}
              className="flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-lg transition-colors hover:bg-[#18181C] cursor-pointer group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326] bg-white p-0.5 shadow-sm">
                <PublisherIcon source={s} box={32} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate group-hover:text-[#F5A623] transition-colors">{s.name}</div>
                <div className="text-[11px] text-[#71717A] mt-0.5">{s.followers || "50k+"} followers</div>
              </div>
              <ChevronRight size={14} className="text-[#71717A] group-hover:text-[#F5A623] transition-colors shrink-0" />
            </Link>
          );
        })}
      </div>
    </SidebarCard>
  );
}
