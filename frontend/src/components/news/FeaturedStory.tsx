"use client";

import { useRouter } from "next/navigation";
import { PublisherIcon } from "./PublisherIcon";
import { TopicChip } from "./TopicChip";
import { NewsRowActions } from "./NewsRowActions";
import { Icon } from "@/components/ui/Icon";
import { ICONS } from "@/lib/icons";
import { publishedLabel } from "@/lib/news/format";
import { articleSourceUrl } from "@/lib/news/news";
import type { NewsArticle, NewsSource } from "@/types/news";

interface FeaturedStoryProps {
  article: NewsArticle;
  source: NewsSource;
  onTopic?: (topic: string) => void;
}

/**
 * Hero card for the top story on the default, unfiltered feed only (see
 * NewsListingClient — isDefaultView, first item of the date-desc sorted
 * list). Scales across four steps, not just a mobile/desktop swap:
 *  - base (phone): single column, compact padding, dek hidden (there's no
 *    room for it alongside a 3-line headline on a narrow screen without
 *    pushing everything else below the fold).
 *  - sm (480px+): dek appears, actions gain visible labels.
 *  - md (tablet): bigger type, roomier padding.
 *  - lg+ (desktop): switches to a real two-column hero layout — a colored
 *    visual rail (publisher glyph + trending score) alongside the content,
 *    instead of just scaling the same single-column card up.
 * No real article image exists yet (see ingestion pipeline), so the visual
 * rail leans on the publisher's own brand color + glyph rather than a
 * generic placeholder box.
 */
export function FeaturedStory({ article, source, onTopic }: FeaturedStoryProps) {
  const router = useRouter();
  const go = () => router.push(`/news/${article.id}`);
  const accent = source.color || "#5E5CE6";

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter") go();
      }}
      className="tas-card tas-enter group grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr]"
      style={{
        position: "relative",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-default)",
        background: "var(--bg-surface)",
        boxShadow: "var(--highlight-top)",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Visual rail — publisher glyph + trending score, lg+ only. A real
          thumbnail would replace this background treatment directly (see
          the ingestion TODO in ArticleDetail's dek block); until then the
          brand color + a large watermark glyph carries the "hero" feel. */}
      <div
        className="hidden lg:flex"
        style={{
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          padding: 24,
          background: `radial-gradient(120% 100% at 30% 20%, color-mix(in srgb, ${accent} 30%, transparent) 0%, color-mix(in srgb, ${accent} 10%, var(--bg-surface-2)) 55%, var(--bg-surface-2) 100%)`,
          borderRight: `1px solid color-mix(in srgb, ${accent} 25%, var(--border-default))`,
          overflow: "hidden",
        }}
      >
        <Icon
          path={ICONS.flame}
          size={128}
          style={{ position: "absolute", top: -20, right: -24, color: accent, opacity: 0.16, transform: "rotate(12deg)" }}
        />
        <span
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: "var(--news-radius-lg)",
            background: `color-mix(in srgb, ${accent} 22%, var(--bg-elevated))`,
            border: `1px solid color-mix(in srgb, ${accent} 40%, transparent)`,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <PublisherIcon source={source} box={38} />
        </span>
        <span
          style={{
            position: "relative",
            textAlign: "center",
            font: "var(--fw-semibold) var(--fs-sm)/1.3 var(--font-sans)",
            letterSpacing: "-0.006em",
            color: "var(--text-primary)",
          }}
        >
          {source.name}
        </span>
        {article.score > 0 && (
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            <span style={{ font: "var(--fw-bold) 22px/1 var(--font-display)", color: accent, letterSpacing: "-0.02em" }}>{article.score}</span>
            <span style={{ font: "var(--fw-medium) var(--fs-2xs)/1 var(--font-sans)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-quaternary)" }}>
              Trend score
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 gap-3 sm:p-5 sm:gap-3.5 md:p-7 md:gap-4 lg:p-6 xl:p-8" style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div
            className="gap-1.5 px-2.5 h-6 sm:gap-2 md:h-7 md:px-3"
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "var(--radius-pill)",
              background: "var(--purple-soft)",
              border: "1px solid var(--purple-border)",
              flex: "none",
            }}
          >
            <Icon path={ICONS.flame} size={13} style={{ color: "var(--purple-text)" }} />
            <span
              className="text-[10px] sm:text-[11px] md:text-xs"
              style={{ font: "var(--fw-semibold) inherit/1 var(--font-sans)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--purple-text)" }}
            >
              Top story
            </span>
          </div>
          <NewsRowActions article={article} />
        </div>

        <div className="gap-2 sm:gap-2.5" style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          <span
            className="hidden sm:flex w-6 h-6 sm:w-7 sm:h-7 lg:hidden"
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
              borderRadius: "var(--news-radius-sm)",
              background: `color-mix(in srgb, ${accent} 16%, var(--bg-surface-2))`,
            }}
          >
            <PublisherIcon source={source} box={20} />
          </span>
          <a
            className="tas-link text-xs sm:text-sm md:text-[15px]"
            href={articleSourceUrl(article)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              font: "var(--fw-semibold) inherit/1 var(--font-sans)",
              letterSpacing: "-0.01em",
              color: "var(--purple-text)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span className="lg:hidden">{source.name}</span>
            <span className="hidden lg:inline">Read on {source.domain}</span>
          </a>
          <span style={{ color: "var(--text-quaternary)" }}>·</span>
          <span className="text-xs sm:text-sm md:text-[15px]" style={{ font: "var(--fw-medium) inherit/1 var(--font-sans)", color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>
            {publishedLabel(article.hours)}
          </span>
        </div>

        <h2
          className="tas-row-title text-[19px] leading-[1.28] sm:text-[22px] sm:leading-[1.25] md:text-[28px] md:leading-[1.2] lg:text-[26px] xl:text-[32px] xl:leading-[1.15]"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: "var(--fw-bold)",
            letterSpacing: "-0.026em",
            color: "var(--text-primary)",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.headline}
        </h2>

        <p
          className="hidden sm:block text-sm leading-[1.6] md:text-base md:leading-[1.65]"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: "var(--fw-regular)",
            letterSpacing: "-0.006em",
            color: "var(--text-secondary)",
            margin: 0,
            maxWidth: 640,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.dek}
        </p>

        <div className="mt-auto pt-1 md:pt-2" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {article.topics.slice(0, 3).map((t) => (
            <TopicChip key={t} compact accent={accent} onClick={onTopic ? () => onTopic(t) : undefined}>
              {t}
            </TopicChip>
          ))}
          <span
            className="ml-auto gap-1 text-[11px] sm:gap-1.5 sm:text-xs"
            style={{ display: "inline-flex", alignItems: "center", color: "var(--purple-text)", font: "var(--fw-semibold) inherit/1 var(--font-sans)" }}
          >
            Read story
            <Icon
              path={ICONS.chevronR}
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
