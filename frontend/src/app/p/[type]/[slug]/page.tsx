export const runtime = "edge";
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { ToolsClient } from "@/components/tools-client";
import { ToolDetailClient } from "@/components/tool-detail-client";
import { CollectionDetailClient } from "@/components/detail/CollectionDetailClient";
import { VideoDetailsClient } from "@/components/detail/VideoDetailsClient";
import { ArticlePageClient } from "@/components/article-page-client";
import { EntityDetail } from "@/components/detail/EntityDetail";
import { DeviceDetailClient } from "@/components/detail/DeviceDetailClient";
import { TaskDetailClient } from "@/components/detail/TaskDetailClient";
import { RepositoryDetailPage } from "@/components/repository-detail/RepositoryDetailPage";
import { CompanyDetailClient } from "@/components/company-detail-client";
import { RobotDetailClient } from "@/components/detail/RobotDetailClient";
import { MCPDetailClient } from "@/components/mcp-detail-client";
import { SERVER_API_URL, fetchMCPItemBySlug } from "@/lib/api";

const VALID_CATEGORIES: Record<string, Set<string>> = {
  tools: new Set(["writing", "image-generation", "video", "audio", "chatbots", "coding", "marketing", "productivity", "business", "education", "mcp"]),
  personal: new Set(["productivity", "chatbots", "writing", "audio", "customer-support", "video", "image-generation", "marketing"]),
  creativity: new Set(["image-generation", "writing", "software-development", "video-creation", "music", "graphic-design", "digital-art", "brainstorming", "3d-creation", "presentation-design", "storytelling", "content-creation", "branding", "motion-graphics", "game-creation"])
};

interface UnifiedEntityPageProps {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateMetadata({ params }: UnifiedEntityPageProps): Promise<Metadata> {
  const { type, slug } = await params;

  if ((type === "tools" || type === "personal" || type === "creativity") && VALID_CATEGORIES[type]?.has(slug)) {
    const formattedSlug = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    return {
      title: `${formattedSlug} ${formattedType} | AI Orbit`,
      description: `Browse the best AI tools for ${formattedSlug.toLowerCase()} in the ${formattedType.toLowerCase()} directory.`,
    };
  }

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

  if (type === "robots") {
    const title = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      title: `${title} — Robots — The AI Signal`,
      description: `Details and specifications for ${title}.`,
    };
  }
  
  if (type === "mcp") {
    try {
      const item = await fetchMCPItemBySlug(slug);
      if (!item) return { title: "MCP Item Not Found | AI Orbit" };
      return {
        title: `${item.name} — Model Context Protocol (MCP) | AI Orbit`,
        description: item.shortDescription,
      };
    } catch {
      return { title: "MCP Directory | AI Orbit" };
    }
  }

  return {};
}

export default async function UnifiedEntityPage({ params }: UnifiedEntityPageProps) {
  const resolvedParams = await params;
  const { type, slug } = resolvedParams;
  
  if ((type === "tools" || type === "personal" || type === "creativity") && VALID_CATEGORIES[type]?.has(slug)) {
    return (
      <div className="min-h-screen flex flex-col bg-[#000000] text-white">
        <Header />
        <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
        <Suspense fallback={
          <main className="mx-auto max-w-container px-6 py-10 flex-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1,2,3,4,5,6,7,8].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-xl border border-[#232326] bg-[#131316]" />
              ))}
            </div>
          </main>
        }>
          <div className="flex-1">
            <ToolsClient defaultMode={type as any} defaultCategory={slug} />
          </div>
        </Suspense>
        <Footer />
      </div>
    );
  }

  if (type === "tools" || type === "personal" || type === "creativity") return <ToolDetailClient />;
  if (type === "mcp") {
    const item = await fetchMCPItemBySlug(slug);
    if (!item) return notFound();
    return (
      <div className="min-h-screen flex flex-col bg-[#000000] text-white">
        <Header />
        <MCPDetailClient item={item} />
        <Footer />
      </div>
    );
  }
  if (type === "collections") return <CollectionDetailClient />;
  if (type === "videos") return <VideoDetailsClient />;
  if (type === "news") return <ArticlePageClient />;
  if (type === "tasks") return <TaskDetailClient />;
  if (type === "repositories") return <RepositoryDetailPage slug={slug} />;
  if (type === "companies") return <CompanyDetailClient />;

  if (type === "robots") {
    return (
      <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
        <Header />
        <RobotDetailClient id={slug} />
        <Footer />
      </div>
    );
  }

  const entityTypeMap: Record<string, "device" | "country" | "fundraise" | "investor"> = {
    devices: "device",
    countries: "country",
    fundraises: "fundraise",
    investors: "investor",
  };

  if (type === "devices") return <DeviceDetailClient />;
  if (entityTypeMap[type]) {
    return <EntityDetail type={entityTypeMap[type]} />;
  }

  return notFound();
}