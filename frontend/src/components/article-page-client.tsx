'use client';

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { PageShell } from "@/components/news/PageShell";
import { ArticleDetail } from "@/components/news/ArticleDetail";
import { API_URL, cachedFetchJson, getFromCache } from "@/lib/api";
import { getClientId } from "@/lib/clientId";
import type { NewsArticle, NewsComment, NewsSource } from "@/types/news";

import { useQuery } from "@tanstack/react-query";

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

  const { data = null, isLoading, isError } = useQuery<NewsDetailResponse | null>({
    queryKey: ["news-article", slug],
    queryFn: async () => {
      const clientId = getClientId();
      const url = `${API_URL}/api/news/${encodeURIComponent(slug)}${clientId ? `?clientId=${encodeURIComponent(clientId)}` : ""}`;
      return cachedFetchJson<NewsDetailResponse | null>(url, null, { ttlMs: 15 * 60 * 1000 });
    },
    initialData: () => {
      if (!slug) return undefined;
      return getFromCache<NewsDetailResponse>(`${API_URL}/api/news/${encodeURIComponent(slug)}`) || undefined;
    },
    staleTime: 15 * 60 * 1000,
    enabled: Boolean(slug),
  });

  const notFoundState = isError || (!isLoading && !data);

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
