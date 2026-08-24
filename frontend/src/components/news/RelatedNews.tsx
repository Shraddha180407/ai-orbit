"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import { SidebarCard } from "./SidebarCard";
import { PublisherIcon } from "./PublisherIcon";
import { publishedLabel } from "@/lib/news/format";
import type { NewsArticle, NewsSource } from "@/types/news";

interface RelatedNewsProps {
  articles: NewsArticle[];
  sources: Record<string, NewsSource>;
  title?: string;
  categoryName?: string;
}

const getDomainFromUrl = (url?: string): string => {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

export function RelatedNews({ articles, sources, title = "Related news", categoryName }: RelatedNewsProps) {
  const router = useRouter();

  return (
    <SidebarCard
      title={title}
      action={
        <Link href={categoryName ? `/news?filter=${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}` : "/news"} className="text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors">
          View all
        </Link>
      }
    >
      <div className="flex flex-col divide-y divide-[#232326]">
        {articles.slice(0, 5).map((a) => {
          const realDomain = sources[a.source]?.domain || getDomainFromUrl(a.articleUrl) || getDomainFromUrl(a.url) || a.source;
          const s: NewsSource = sources[a.source] || { key: a.source, name: a.source, domain: realDomain };
          return (
            <div
              key={a.id}
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/news/${a.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(`/news/${a.id}`);
              }}
              className="flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-lg transition-colors hover:bg-[#18181C] cursor-pointer group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326] bg-white p-0.5 shadow-sm">
                <PublisherIcon source={s} box={32} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white line-clamp-2 leading-snug group-hover:text-[#F5A623] transition-colors">{a.headline}</div>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#71717A]">
                  <span className="font-medium text-[#A1A1AA]">{s.name}</span>
                  <span>· {publishedLabel(a.hours)}</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#71717A] group-hover:text-[#F5A623] transition-colors shrink-0" />
            </div>
          );
        })}
      </div>
    </SidebarCard>
  );
}
