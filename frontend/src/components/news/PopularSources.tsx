import Link from "next/link";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
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
        <Link href="/news" className="text-sm font-medium text-foreground-muted hover:text-white transition-colors">
          View all
        </Link>
      }
    >
      <div className="flex flex-col divide-y divide-border">
        {popular.map((key) => {
          const s = sources[key];
          return (
            <a
              key={key}
              href={`https://${s.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-3 -mx-2 px-2 rounded-md transition-colors hover:bg-surface-raised"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
                <PublisherIcon source={s} box={36} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{s.name}</div>
                <div className="text-xs text-foreground-faint mt-0.5">{s.followers} followers</div>
              </div>
              <ExternalLink size={14} className="text-foreground-faint shrink-0" />
            </a>
          );
        })}
      </div>
    </SidebarCard>
  );
}
