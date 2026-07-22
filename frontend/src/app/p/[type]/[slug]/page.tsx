export const runtime = "edge";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolDetailClient } from "@/components/tool-detail-client";
import { CollectionDetailClient } from "@/components/detail/CollectionDetailClient";
import { VideoDetailsClient } from "@/components/detail/VideoDetailsClient";
import { ArticlePageClient } from "@/components/article-page-client";
import { EntityDetail } from "@/components/detail/EntityDetail";
import { DeviceDetailClient } from "@/components/detail/DeviceDetailClient";
import { TaskDetailClient } from "@/components/detail/TaskDetailClient";
import { SERVER_API_URL } from "@/lib/api";

interface UnifiedEntityPageProps {
  params: Promise<{ type: string; slug: string }>;
}

/**
 * Per-type Open Graph/Twitter tags so a shared link shows the real
 * headline/summary instead of the root layout's site-wide default.
 * Every other entity type not listed here falls through to {} and
 * inherits the root layout's metadata unchanged.
 *
 * Uses SERVER_API_URL, not API_URL — this runs server-side (Edge runtime),
 * and API_URL's api.aiorbit.club domain hits Cloudflare's same-account
 * proxy loop-prevention for a Pages Function server-side fetch (see
 * api.ts's own comment on SERVER_API_URL); only client-side fetches are
 * safe on api.aiorbit.club.
 */
export async function generateMetadata({ params }: UnifiedEntityPageProps): Promise<Metadata> {
  const { type, slug } = await params;

  if (type === "news") {
    try {
      const res = await fetch(`${SERVER_API_URL}/api/news/${encodeURIComponent(slug)}`);
      if (!res.ok) return {};
      const { article } = (await res.json()) as { article?: { headline: string; aiSummary: string; dek: string } };
      if (!article) return {};

      const description = article.aiSummary || article.dek;
      return {
        title: article.headline,
        description,
        openGraph: { title: article.headline, description, type: "article" },
        twitter: { card: "summary_large_image", title: article.headline, description },
      };
    } catch {
      return {};
    }
  }

  if (type === "tasks") {
    try {
      const res = await fetch(`${SERVER_API_URL}/api/v1/tasks/${encodeURIComponent(slug)}`);
      if (!res.ok) return { title: "Task Not Found | AI Orbit" };
      const data = (await res.json()) as { task?: { title: string; description: string } };
      if (!data.task) return { title: "Task Not Found | AI Orbit" };

      return {
        title: `${data.task.title} | AI Orbit`,
        description: data.task.description,
      };
    } catch {
      return { title: "Tasks | AI Orbit" };
    }
  }

  return {};
}

export default async function UnifiedEntityPage({ params }: UnifiedEntityPageProps) {
  const resolvedParams = await params;
  const type = resolvedParams.type;
  
  
  if (type === "tools") return <ToolDetailClient />;
  if (type === "collections") return <CollectionDetailClient />;
  if (type === "videos") return <VideoDetailsClient />;
  if (type === "news") return <ArticlePageClient />;
  if (type === "tasks") return <TaskDetailClient />;

  const entityTypeMap: Record<string, any> = {
    devices: "device",
    countries: "country",
    fundraises: "fundraise",
    investors: "investor",
    models: "model",
    robots: "robot",
  };

  if (type === "devices") return <DeviceDetailClient />;
  if (entityTypeMap[type]) {
    return <EntityDetail type={entityTypeMap[type]} />;
  }

  return notFound();
}