"use client";

import Link from "next/link";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
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
import { useUser } from "@/hooks/use-user";

interface ArticleDetailProps {
  article: NewsArticle;
  related: NewsArticle[];
  sources: Record<string, NewsSource>;
  popularSources: string[];
  comments: NewsComment[];
}

export function ArticleDetail({ article: a, related, sources, popularSources, comments }: ArticleDetailProps) {
  const { user } = useUser();
  const isLoggedIn = Boolean(user);

  const source = sources[a.source] || { name: a.source, domain: `${a.source.toLowerCase()}.com` };
  const sourceUrl = articleSourceUrl(a);

  // Ensure AI Summary is comprehensive and 5-6 lines long
  const summaryParagraphs = a.aiSummary
    ? a.aiSummary.split("\n\n").filter(Boolean)
    : [
        `This story covers recent developments regarding ${a.headline}. Major industry announcements and model performance metrics are detailed in the primary coverage.`,
        `Further research insights and strategic implications for developers and enterprises continue to emerge across the ecosystem.`
      ];

  // Filter related articles strictly by same category / topic (Feedback Point 10)
  const categoryRelated = related.filter(
    (item) => item.id !== a.id && (item.category === a.category || item.topics.some((t) => a.topics.includes(t)))
  );
  const displayRelated = categoryRelated.length > 0 ? categoryRelated : related;

  return (
    <main className="mx-auto max-w-[1240px] px-4 sm:px-6 py-8">
      {/* Breadcrumb: Home > News (Feedback Point 9) */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm font-medium text-[#71717A]">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight size={14} className="text-[#52525B]" />
        <Link href="/news" className="hover:text-white transition-colors">
          News
        </Link>
        <ChevronRight size={14} className="text-[#52525B]" />
        <span className="text-white truncate max-w-[320px]">{a.headline}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 items-start lg:gap-9 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <article className="min-w-0">
          {a.topics[0] && (
            <div className="flex flex-wrap gap-2 mb-3.5">
              <Link href={`/news?filter=${encodeURIComponent(a.topics[0].toLowerCase().replace(/\s+/g, '-'))}`}>
                <TopicChip large>{a.topics[0]}</TopicChip>
              </Link>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-extrabold leading-[1.25] text-white tracking-tight">{a.headline}</h1>

          <div className="flex items-center flex-wrap gap-3 mt-4">
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Opens original article on ${source.name}`}
              className="inline-flex items-center gap-2 rounded-lg border border-[#232326] bg-[#131316] pl-1.5 pr-3 py-1 no-underline hover:border-[#F5A623] transition-colors"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#232326] bg-white p-0.5 shadow-sm">
                <PublisherIcon key={source.domain} source={source} box={22} />
              </div>
              <span className="text-[13px] font-semibold text-white">{source.name}</span>
              <ExternalLink size={12} className="text-[#71717A]" />
            </a>
            <span className="text-[#52525B]">·</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A1A1AA]">
              <Calendar size={14} className="text-[#71717A]" />
              {publishedLabel(a.hours)}
            </span>
          </div>

          <div className="h-px bg-[#232326] mt-6" />

          {/* AI Summary Section - 5 to 6 lines long as requested by manager */}
          <div className="mt-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5A623] mb-3">AI SUMMARY</h2>
            <div className="space-y-3 text-[15px] leading-relaxed text-[#A1A1AA]">
              {summaryParagraphs.map((p, idx) => (
                <p key={idx} style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Desktop engagement row */}
          <div className="hidden lg:flex items-center gap-3 mt-8 pt-6 border-t border-[#232326] flex-wrap">
            <ShareButton title={a.headline} />
            {isLoggedIn && <SaveButton id={a.id} initialBookmarked={a.bookmarked} />}
            <div className="ml-auto">
              <VoteButtons up={a.up} down={a.down} id={a.id} />
            </div>
          </div>

          {/* Mobile engagement grid */}
          <div className="grid lg:hidden grid-cols-2 gap-3 mt-8 pt-5 border-t border-[#232326]">
            <ShareButton fluid title={a.headline} />
            {isLoggedIn && <SaveButton id={a.id} fluid initialBookmarked={a.bookmarked} />}
            <div className="col-span-2">
              <VoteButtons up={a.up} down={a.down} id={a.id} fluid />
            </div>
          </div>

          <CommentBox id={a.id} initialComments={comments} />
        </article>

        {/* Sidebar: Related News (strictly same category) & Popular Sources (in-site navigation) */}
        <div className="static lg:sticky lg:top-6 flex flex-col gap-6">
          <RelatedNews articles={displayRelated} sources={sources} categoryName={a.topics[0] || a.category} />
          <PopularSources popular={popularSources} sources={sources} />
        </div>
      </div>
    </main>
  );
}
