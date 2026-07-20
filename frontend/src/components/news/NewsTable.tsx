"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SortHeader } from "./SortHeader";
import { FilterDropdown } from "./FilterDropdown";
import { PublisherIcon } from "./PublisherIcon";
import { TopicChip } from "./TopicChip";
import { NewsRowActions } from "./NewsRowActions";
import { NewsCard } from "./NewsCard";
import { MobileFilterSheet } from "./MobileFilterSheet";
import { MobileSortMenu } from "./MobileSortMenu";
import { Icon } from "@/components/ui/Icon";
import { ICONS } from "@/lib/icons";
import { publishedLabel } from "@/lib/news/format";
import { articleSourceUrl } from "@/lib/news/news";
import type { FilterOption, NewsArticle, NewsSource, SortKey, SortState } from "@/types/news";

export interface NewsTableFilters {
  topicOptions: FilterOption[];
  selectedTopics: string[];
  onToggleTopic: (value: string) => void;
  onClearTopics: () => void;
  sourceOptions: FilterOption[];
  selectedSources: string[];
  onToggleSource: (value: string) => void;
  onClearSources: () => void;
}

// Desktop-only (lg: and up) table grid: Title | Source | Topics | Published | Actions. Below
// that breakpoint the table is replaced entirely by a card feed (see NewsCard.tsx) — no
// horizontal scrolling of a squeezed table on phones/tablets anymore.
const GRID = "minmax(320px,2.2fr) minmax(120px,0.7fr) minmax(120px,0.6fr) 90px 84px";

const eyebrowStyle = {
  font: "var(--fw-semibold) var(--fs-2xs)/1 var(--font-sans)",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "var(--text-secondary)",
};

interface NewsTableHeadProps {
  sort: SortState;
  onSort: (key: SortKey) => void;
  filters: NewsTableFilters;
  openFilter: "topics" | "source" | null;
  setOpenFilter: (v: "topics" | "source" | null) => void;
}

function NewsTableHead({ sort, onSort, filters, openFilter, setOpenFilter }: NewsTableHeadProps) {
  const cellBase = { display: "flex" as const, alignItems: "center" as const, height: "100%" };
  const sourceCellRef = useRef<HTMLDivElement>(null);
  const topicsCellRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "var(--bg-base)",
        display: "grid",
        gridTemplateColumns: GRID,
        gap: 12,
        alignItems: "center",
        height: 40,
        padding: "0 14px",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      <div style={cellBase}>
        <SortHeader label="Title" sortKey="title" sort={sort} onSort={onSort} />
      </div>
      <div ref={sourceCellRef} style={{ ...cellBase, position: "relative" }}>
        <SortHeader
          label="Source"
          sortKey="source"
          sort={sort}
          onSort={onSort}
          onFilter={() => setOpenFilter(openFilter === "source" ? null : "source")}
          filterActive={filters.selectedSources.length > 0}
        />
        {openFilter === "source" && (
          <FilterDropdown
            title="Sources"
            options={filters.sourceOptions}
            selected={filters.selectedSources}
            onToggle={filters.onToggleSource}
            onClear={filters.onClearSources}
            onClose={() => setOpenFilter(null)}
            anchorRef={sourceCellRef}
          />
        )}
      </div>
      <div ref={topicsCellRef} style={{ ...cellBase, position: "relative" }}>
        <SortHeader
          label="Topics"
          sortKey="topics"
          sort={sort}
          onSort={onSort}
          onFilter={() => setOpenFilter(openFilter === "topics" ? null : "topics")}
          filterActive={filters.selectedTopics.length > 0}
        />
        {openFilter === "topics" && (
          <FilterDropdown
            title="Topics"
            options={filters.topicOptions}
            selected={filters.selectedTopics}
            onToggle={filters.onToggleTopic}
            onClear={filters.onClearTopics}
            onClose={() => setOpenFilter(null)}
            anchorRef={topicsCellRef}
          />
        )}
      </div>
      <div style={cellBase}>
        <SortHeader label="Published" sortKey="date" sort={sort} onSort={onSort} />
      </div>
      <div style={{ ...cellBase, justifyContent: "flex-end", ...eyebrowStyle }}>Actions</div>
    </div>
  );
}

interface NewsRowProps {
  article: NewsArticle;
  index: number;
  sources: Record<string, NewsSource>;
  onTopic?: (topic: string) => void;
  isAdmin?: boolean;
  onEdit?: (news: any) => void;
  onDelete?: (id: string) => void;
}

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";

function NewsRow({ article, index, sources, onTopic, isAdmin, onEdit, onDelete }: NewsRowProps) {
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
      className="tas-row tas-enter"
      style={{
        display: "grid",
        gridTemplateColumns: GRID,
        gap: 12,
        alignItems: "center",
        padding: "18px 14px",
        borderBottom: "1px solid var(--border-subtle)",
        borderLeft: `2px solid ${accent}`,
        cursor: "pointer",
        animationDelay: Math.min(index, 12) * 24 + "ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "none",
            width: 36,
            height: 36,
            borderRadius: "var(--news-radius-sm)",
            background: `color-mix(in srgb, ${accent} 14%, transparent)`,
          }}
        >
          <PublisherIcon source={source} box={32} />
        </span>
        <h3
          className="tas-row-title"
          style={{
            font: "var(--fw-semibold) 15px/1.45 var(--font-sans)",
            letterSpacing: "-0.012em",
            color: "var(--text-primary)",
            margin: 0,
            minWidth: 0,
          }}
        >
          {article.headline}
        </h3>
      </div>
      <div style={{ minWidth: 0 }}>
        <a
          className="tas-link"
          href={articleSourceUrl(article)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "block",
            font: "var(--fw-semibold) var(--fs-sm)/1.3 var(--font-sans)",
            letterSpacing: "-0.01em",
            color: "var(--purple-text)",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {source.name}
        </a>
      </div>
      <div style={{ minWidth: 0 }}>
        <TopicChip maxWidth={130} accent={accent} onClick={onTopic ? () => onTopic(primaryTopic) : undefined}>
          {primaryTopic}
        </TopicChip>
      </div>
      <div
        style={{
          minWidth: 0,
          font: "var(--fw-medium) var(--fs-sm)/1 var(--font-sans)",
          letterSpacing: "-0.01em",
          color: "var(--text-primary)",
          whiteSpace: "nowrap",
        }}
      >
        {publishedLabel(article.hours)}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
        <NewsRowActions article={article} />
        {isAdmin && (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 px-2 bg-white/5 border border-white/10 hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(article);
              }}
            >
              <Pencil className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 px-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Delete this news?")) {
                  onDelete?.(article.id);
                }
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface NewsTableProps {
  articles: NewsArticle[];
  sources: Record<string, NewsSource>;
  sort: SortState;
  onSort: (key: SortKey) => void;
  filters: NewsTableFilters;
  isAdmin?: boolean;
  onEdit?: (news: any) => void;
  onDelete?: (id: string) => void;
}

/**
 * Renders two entirely different layouts for the same data, swapped by CSS
 * breakpoint (no JS media-query, so there's no layout flash/mismatch risk):
 *  - below `lg:`: a card feed (1 column on phones, 2 columns from `md:` up
 *    — see NewsCard.tsx) with its own compact sort/filter toolbar, since the
 *    per-column SortHeader/FilterDropdown UI has nothing to anchor to
 *    without table header cells.
 *  - `lg:` and up: the original sortable/filterable table, unchanged.
 * Both consume the exact same `filters`/`sort`/`onSort` props from
 * NewsListingClient, so switching viewport width never desyncs state.
 */
export function NewsTable({ articles, sources, sort, onSort, filters, isAdmin, onEdit, onDelete }: NewsTableProps) {
  const [openFilter, setOpenFilter] = useState<"topics" | "source" | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const activeMobileFilters = filters.selectedSources.length + filters.selectedTopics.length;

  return (
    <div>
      {/* Mobile/tablet toolbar — stands in for the desktop header's sort/filter controls */}
      <div className="flex lg:hidden gap-2 sm:gap-2.5" style={{ alignItems: "center", padding: "4px 2px 12px" }}>
        <MobileSortMenu sort={sort} onSort={onSort} />
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="tas-hbtn"
          data-active={activeMobileFilters > 0 ? "" : undefined}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 36,
            padding: "0 12px",
            borderRadius: "var(--news-radius-sm)",
            font: "var(--fw-medium) var(--fs-sm)/1 var(--font-sans)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <Icon name={ICONS.filters} size={14} className="opacity-70" />
          <span>Filters</span>
          {activeMobileFilters > 0 && (
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 18,
              height: 18,
              borderRadius: 9,
              background: "var(--text-primary)",
              color: "var(--bg-base)",
              fontSize: 10,
              fontWeight: 700,
              marginLeft: 2
            }}>
              {activeMobileFilters}
            </span>
          )}
        </button>
      </div>

      <MobileFilterSheet
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
        filters={filters}
      />

      {/* Card feed — phones (1 col), large phones/small tablets (2 cols from sm:), roomier gap from md: */}
      <div className="grid lg:hidden gap-2.5 sm:grid-cols-2 sm:gap-3 md:gap-4" style={{ gridTemplateColumns: "1fr" }}>
        {articles.map((a, i) => (
          <NewsCard key={a.id} article={a} index={i} sources={sources} onTopic={filters.onToggleTopic} />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block tas-scroll-x" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ minWidth: 820 }}>
          <NewsTableHead sort={sort} onSort={onSort} filters={filters} openFilter={openFilter} setOpenFilter={setOpenFilter} />
          <div>
            {articles.map((a, i) => (
              <NewsRow key={a.id} article={a} index={i} sources={sources} onTopic={filters.onToggleTopic} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
