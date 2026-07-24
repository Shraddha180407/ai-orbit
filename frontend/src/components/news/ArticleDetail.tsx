import Link from "next/link";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import { TopicChip } from "./TopicChip";
import { PublisherIcon } from "./PublisherIcon";
import { PopularSources } from "./PopularSources";
import { RelatedNews } from "./RelatedNews";
import { VoteButtons } from "./VoteButtons";
import { ShareButton } from "./ShareButton";
import { SaveButton } from "./SaveButton";
import { CommentBox } from "./CommentBox";
import { publishedLabel } from "@/lib/news/format";
import { articleSourceUrl } from "@/lib/news/news";
import type { NewsArticle, NewsComment, NewsSource } from "@/types/news";

interface ArticleDetailProps {
  article: NewsArticle;
  related: NewsArticle[];
  sources: Record<string, NewsSource>;
  popularSources: string[];
  comments: NewsComment[];
}

/**
 * Restyled to the same design system as the rest of the site (homepage/
 * tools) — plain Tailwind classes + the top-level @theme tokens
 * (text-foreground, border-border, bg-surface, etc.) instead of the old
 * `.news-scope` purple theme. Same `mx-auto max-w-[1070px] px-6 py-10`
 * container as NewsListingClient/ToolsClient for a consistent page width
 * across the whole /news section.
 */
export function ArticleDetail({ article: a, related, sources, popularSources, comments }: ArticleDetailProps) {
  const source = sources[a.source];
  const sourceUrl = articleSourceUrl(a);

  return (
    <main className="mx-auto max-w-[1070px] px-6 py-10">
      <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-white transition-colors">
        <ChevronLeft size={16} />
        All news
      </Link>

      <div className="grid grid-cols-1 gap-10 items-start mt-6 lg:gap-9 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <article className="min-w-0">
          {a.topics[0] && (
            <div className="flex flex-wrap gap-2 mb-3.5">
              <Link href={`/news?topic=${encodeURIComponent(a.topics[0])}`}>
                <TopicChip large>{a.topics[0]}</TopicChip>
              </Link>
            </div>
          )}

          <h1 className="text-2xl font-semibold leading-[1.3] text-foreground">{a.headline}</h1>

          <div className="flex items-center flex-wrap gap-2.5 mt-3">
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Opens the original article on ${source.name}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface pl-1 pr-2.5 py-0.5 no-underline hover:border-accent transition-colors"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white">
                <PublisherIcon key={source.domain} source={source} box={22} />
              </div>
              <span className="text-[13px] font-semibold text-foreground">{source.name}</span>
              <ExternalLink size={12} className="text-foreground-faint" />
            </a>
            <span className="text-foreground-faint">·</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted">
              <Calendar size={15} className="text-foreground-faint" />
              {publishedLabel(a.hours)}
            </span>
          </div>

          <div className="h-px bg-border mt-6" />

          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">AI Summary</h2>
            <p className="text-[15px] leading-relaxed text-foreground-muted" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
              {a.aiSummary}
            </p>
          </div>

          {/* Desktop engagement row */}
          <div className="hidden lg:flex items-center gap-3 mt-10 pt-6 border-t border-border flex-wrap">
            <ShareButton title={a.headline} />
            <SaveButton id={a.id} initialBookmarked={a.bookmarked} />
            <div className="ml-auto">
              <VoteButtons up={a.up} down={a.down} id={a.id} />
            </div>
          </div>

          {/* Mobile engagement grid */}
          <div className="grid lg:hidden grid-cols-2 gap-3 mt-8 pt-5 border-t border-border">
            <ShareButton fluid title={a.headline} />
            <SaveButton id={a.id} fluid initialBookmarked={a.bookmarked} />
            <div className="col-span-2">
              <VoteButtons up={a.up} down={a.down} id={a.id} fluid />
            </div>
          </div>

          <CommentBox id={a.id} initialComments={comments} />
        </article>

        <div className="static lg:sticky lg:top-6 flex flex-col gap-6">
          <RelatedNews articles={related} sources={sources} />
          <PopularSources popular={popularSources} sources={sources} />
        </div>
      </div>
    </main>
  );
}
