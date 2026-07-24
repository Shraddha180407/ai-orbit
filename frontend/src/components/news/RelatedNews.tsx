"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import { SidebarCard } from "./SidebarCard";
import { PublisherIcon } from "./PublisherIcon";
import { publishedLabel } from "@/lib/news/format";
import { articleSourceUrl } from "@/lib/news/news";
import type { NewsArticle, NewsSource } from "@/types/news";

interface RelatedNewsProps {
  articles: NewsArticle[];
  sources: Record<string, NewsSource>;
  title?: string;
}

export function RelatedNews({ articles, sources, title = "Related news" }: RelatedNewsProps) {
  const router = useRouter();

  return (
    <SidebarCard
      title={title}
      action={
        <Link href="/news" className="text-sm font-medium text-foreground-muted hover:text-white transition-colors">
          View all
        </Link>
      }
    >
      <div className="flex flex-col divide-y divide-border">
        {articles.map((a) => (
          <div
            key={a.id}
            role="link"
            tabIndex={0}
            onClick={() => router.push(`/news/${a.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/news/${a.id}`);
            }}
            className="flex items-center gap-3 py-3 -mx-2 px-2 rounded-md transition-colors hover:bg-surface-raised cursor-pointer"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
              <PublisherIcon source={sources[a.source]} box={36} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground line-clamp-2 leading-snug">{a.headline}</div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-foreground-faint">
                <a
                  href={articleSourceUrl(a)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium text-foreground-muted hover:text-white transition-colors"
                >
                  {sources[a.source].domain}
                </a>
                <span>· {publishedLabel(a.hours)}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-foreground-faint shrink-0" />
          </div>
        ))}
      </div>
    </SidebarCard>
  );
}
