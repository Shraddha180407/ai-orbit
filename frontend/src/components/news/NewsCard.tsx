"use client";

import { useRouter } from "next/navigation";
import { PublisherIcon } from "./PublisherIcon";
import { TopicChip } from "./TopicChip";
import { NewsRowActions } from "./NewsRowActions";
import { publishedLabel } from "@/lib/news/format";
import type { NewsArticle, NewsSource } from "@/types/news";

interface NewsCardProps {
  article: NewsArticle;
  index: number;
  sources: Record<string, NewsSource>;
  onTopic?: (topic: string) => void;
}

/**
 * Stacked card used for the mobile (1-col) and tablet (2-col grid, see
 * NewsTable.tsx) layouts — the feed-like alternative to the desktop table
 * row. Reuses the same tas-row hover/focus treatment and tas-enter
 * fade-up as NewsRow so both layouts feel like the same product, just
 * reflowed for narrower viewports. Same click-to-navigate + keyboard
 * Enter + row actions as NewsRow, nothing behavioral changes here.
 */
export function NewsCard({ article, index, sources, onTopic }: NewsCardProps) {
  const router = useRouter();
  const source = sources[article.source];
  const go = () => router.push(`/news/${article.id}`);
  const [primaryTopic] = article.topics;
  const accent = source.color || "#5E5CE6";

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter") go();
      }}
      className="tas-card tas-enter p-3.5 gap-2.5 md:p-4 md:gap-3"
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--news-radius-lg)",
        borderTop: "1px solid var(--border-subtle)",
        borderRight: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        borderLeft: `2.5px solid ${accent}`,
        background: "var(--bg-surface-2)",
        cursor: "pointer",
        animationDelay: Math.min(index, 12) * 24 + "ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "none",
            width: 24,
            height: 24,
            borderRadius: "var(--news-radius-sm)",
            background: `color-mix(in srgb, ${accent} 16%, var(--bg-surface-2))`,
          }}
        >
          <PublisherIcon source={source} box={18} />
        </span>
        <span
          style={{
            font: "var(--fw-semibold) var(--fs-xs)/1 var(--font-sans)",
            letterSpacing: "-0.006em",
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {source.name}
        </span>
      </div>

      <h3
        className="tas-row-title text-[15px] md:text-base"
        style={{
          font: "var(--fw-semibold) inherit/1.4 var(--font-sans)",
          letterSpacing: "-0.012em",
          color: "var(--text-primary)",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {article.headline}
      </h3>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <TopicChip compact maxWidth={110} accent={accent} onClick={onTopic ? () => onTopic(primaryTopic) : undefined}>
            {primaryTopic}
          </TopicChip>
          <span
            style={{
              font: "var(--fw-medium) var(--fs-2xs)/1 var(--font-sans)",
              color: "var(--text-quaternary)",
              whiteSpace: "nowrap",
            }}
          >
            {publishedLabel(article.hours)}
          </span>
        </div>
        <NewsRowActions article={article} />
      </div>
    </div>
  );
}
