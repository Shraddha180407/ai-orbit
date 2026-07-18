'use client';

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { PageShell } from "@/components/news/PageShell";
import { ArticleDetail } from "@/components/news/ArticleDetail";
import { API_URL } from "@/lib/api";
import { getClientId } from "@/lib/clientId";
import type { NewsArticle, NewsComment, NewsSource } from "@/types/news";

interface NewsDetailResponse {
  article: NewsArticle;
  related: NewsArticle[];
  sources: Record<string, NewsSource>;
  popularSources: string[];
  comments: NewsComment[];
}

export function ArticlePageClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<NewsDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      setIsLoading(true);
      try {
        const clientId = getClientId();
        const url = `${API_URL}/api/news/${encodeURIComponent(slug)}${clientId ? `?clientId=${encodeURIComponent(clientId)}` : ""}`;
        const res = await fetch(url);
        if (res.status === 404) {
          setNotFoundState(true);
          return;
        }
        if (!res.ok) throw new Error(`Failed to load article: ${res.status}`);
        const json: NewsDetailResponse = await res.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch article:", e);
        setNotFoundState(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  // Update page title
  useEffect(() => {
    if (data?.article) {
      document.title = `${data.article.headline} — The AI Signal`;
    }
  }, [data]);

  if (notFoundState) {
    notFound();
  }

  if (isLoading || !data) {
    return (
      <PageShell>
        <div className="space-y-4 py-10 max-w-3xl mx-auto">
          <div className="h-8 w-3/4 animate-pulse rounded bg-[#232326]" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-[#232326]" />
          <div className="h-64 animate-pulse rounded-lg bg-[#131316] border border-[#232326]" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <ArticleDetail
        article={data.article}
        related={data.related}
        sources={data.sources}
        popularSources={data.popularSources}
        comments={data.comments}
      />
    </PageShell>
  );
}
