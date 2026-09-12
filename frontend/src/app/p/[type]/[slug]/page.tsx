export const runtime = 'edge';
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { ToolsClient } from "@/components/tools-client";
import { ToolDetailClient } from "@/components/tool-detail-client";
import { VideoDetailsClient } from "@/components/detail/VideoDetailsClient";
import { ArticlePageClient } from "@/components/article-page-client";
import { EntityDetail } from "@/components/detail/EntityDetail";
import { DeviceDetailClient } from "@/components/detail/DeviceDetailClient";
import { TaskDetailClient } from "@/components/detail/TaskDetailClient";
import { RepositoryDetailPage } from "@/components/repository-detail/RepositoryDetailPage";
import { CompanyDetailClient } from "@/components/company-detail-client";
import { RobotDetailClient } from "@/components/detail/RobotDetailClient";
import { ModelDetailClient } from "@/components/detail/ModelDetailClient";
import { MCPDetailClient } from "@/components/mcp-detail-client";
import { MCPClient } from "@/components/mcp-client";
import { TasksClient } from "@/components/tasks-client";
import { CompaniesClient } from "@/components/companies-client";
import { NewsListingClient } from "@/components/news/NewsListingClient";
import { VideosPageClient } from "@/components/videos/VideosPageClient";
import { RobotsClient } from "@/components/robots-client";
import { DevicesClient } from "@/components/devices-client";
import { ModelsClient } from "@/components/models-client";
import { RepositoriesClient } from "@/components/repositories-client";
import AgentDetailClient from "@/components/AgentDetailClient";
import { SERVER_API_URL, fetchMCPItemBySlug, fetchMCPItemAlternatives } from "@/lib/api";

const VALID_CATEGORIES: Record<string, Set<string>> = {
  tools: new Set(["writing", "image-generation", "video", "audio", "chatbots", "coding", "marketing", "productivity", "business", "education", "mcp"]),
  personal: new Set(["productivity", "chatbots", "writing", "audio", "customer-support", "video", "image-generation", "marketing"]),
  creativity: new Set(["image-generation", "writing", "software-development", "video-creation", "music", "graphic-design", "digital-art", "brainstorming", "3d-creation", "presentation-design", "storytelling", "content-creation", "branding", "motion-graphics", "game-creation"]),
  agents: new Set(["content-creation", "research-assistance", "customer-support", "software-development", "business-automation", "data-analysis", "knowledge-management", "personal-productivity", "sales-automation", "workflow-automation", "autonomous-agents"]),
  mcp: new Set(["mcp-servers", "developer-tools", "databases", "file-systems", "productivity", "apis", "cloud", "ml-platforms", "browser", "community", "mcp-clients", "core-mcp-servers", "sdks-frameworks", "specialized-mcp-servers", "testing-tools", "version-control", "automation", "smart-devices", "data-analytics"]),
  tasks: new Set(["content-creation", "image-creation", "video-creation", "audio", "coding", "data-analysis", "research", "productivity", "marketing", "customer-support", "translation", "presentation", "brainstorming", "prompting", "website-building"]),
  companies: new Set(["ai-model-providers", "infrastructure", "enterprise", "healthcare", "generative-ai", "marketing", "developer-tools", "robotics", "education", "open-source", "finance", "ai-native", "model-companies", "unicorns"]),
  news: new Set(["ai-industry", "product-launches", "innovations", "company-updates", "open-source", "regulations", "interviews", "market-trends", "breakthroughs", "security", "agents", "llms", "developer-ecosystem", "consumer"]),
  videos: new Set(["product-demos", "tutorials", "ai-news", "model-showcases", "podcasts", "tool-walkthroughs", "webinars", "conferences", "coding", "case-studies", "comparisons", "educational-content", "success-stories", "ai-trends", "prompting"]),
  robots: new Set(["humanoid-robots", "industrial", "service", "healthcare", "educational", "autonomous-mobile-robots", "drones", "companion", "agricultural", "research", "multi-agent", "task-specific", "autonomous-navigation", "reinforcement-learning", "surveillance"]),
  devices: new Set(["ai-pcs", "smartphones", "smart-home", "wearables", "ai-cameras", "audio", "ar-vr", "edge-ai", "robotics-hardware", "medical", "development-boards", "smart-sensors", "automotive-ai-devices"]),
  models: new Set(["llm", "image-generation", "video-generation", "speech", "multimodal", "code-generation", "embedding", "reasoning", "vision-models", "open-source-models", "testing", "e-commerce", "recruitment", "translation", "project-management"]),
  repositories: new Set(["llms", "generative-ai", "ai-frameworks", "nlp", "frameworks", "robotics", "rag-systems", "deployment", "data-science", "prompt-engineering", "search-engines", "knowledge-graphs", "ai-agents", "cloud", "computer-vision"])
};

interface UnifiedEntityPageProps {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateMetadata({ params }: UnifiedEntityPageProps): Promise<Metadata> {
  const { type, slug } = await params;
  const formattedSlug = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const formattedType = type === "mcp" ? "MCP Directory" : type.charAt(0).toUpperCase() + type.slice(1);

  if (VALID_CATEGORIES[type]?.has(slug)) {
    return {
      title: `${formattedSlug} ${formattedType} | AI Orbit`,
      description: `Browse the best AI tools/servers for ${formattedSlug.toLowerCase()} in the ${formattedType.toLowerCase()} directory.`,
    };
  }

  if (type === "news") {
    return {
      title: `${formattedSlug} — News | AI Orbit`,
      description: `Read the latest AI news and updates about ${formattedSlug}.`,
    };
  }

  if (type === "tasks") {
    return {
      title: `${formattedSlug} Tasks | AI Orbit`,
      description: `Discover the best AI tools and workflows for ${formattedSlug.toLowerCase()}.`,
    };
  }

  if (type === "robots") {
    return {
      title: `${formattedSlug} — Robots — AI Orbit`,
      description: `Details and specifications for ${formattedSlug}.`,
    };
  }

  if (type === "mcp") {
    return {
      title: `${formattedSlug} — Model Context Protocol (MCP) | AI Orbit`,
      description: `Explore ${formattedSlug} in the MCP Directory.`,
    };
  }

  if (type === "tools" || type === "personal" || type === "creativity") {
    return {
      title: `${formattedSlug} — AI Tool Details, Pricing & Reviews | AI Orbit`,
      description: `Comprehensive details, features, reviews and pricing for ${formattedSlug}.`,
    };
  }

  if (type === "companies") {
    return {
      title: `${formattedSlug} — AI Company Profile & Overview | AI Orbit`,
      description: `Profile, tools, models and team details for ${formattedSlug}.`,
    };
  }

  if (type === "devices") {
    return {
      title: `${formattedSlug} — AI Hardware & Device Specifications | AI Orbit`,
      description: `Specs, features and availability for ${formattedSlug}.`,
    };
  }

  if (type === "models") {
    return {
      title: `${formattedSlug} — AI Model Architecture & Benchmarks | AI Orbit`,
      description: `Technical specs, context window, and benchmark data for ${formattedSlug}.`,
    };
  }

  return {
    title: `${formattedSlug} ${formattedType} | AI Orbit`,
    description: `Explore ${formattedSlug} in the ${formattedType} section of AI Orbit.`,
  };
}

export default async function UnifiedEntityPage({ params }: UnifiedEntityPageProps) {
  const resolvedParams = await params;
  const { type, slug } = resolvedParams;

  if (type === "agents") {
  return (
    <div className="flex flex-col flex-1 bg-[#000000] text-white">
      <div className="flex-1">
        <AgentDetailClient slug={slug} />
      </div>
    </div>
  );
}

  if ((type === "tools" || type === "personal" || type === "creativity") && VALID_CATEGORIES[type]?.has(slug)) {
    return (
      <div className="flex flex-col flex-1">

        <div className="relative z-[60]">
          <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <Suspense fallback={
            <main className="mx-auto max-w-container px-6 py-10 flex-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-48 animate-pulse rounded-xl border border-[#232326] bg-[#131316]" />
                ))}
              </div>
            </main>
          }>
            <div className="flex-1">
              <ToolsClient defaultMode={type as any} defaultCategory={slug} />
            </div>
          </Suspense>
        </div>

      </div>
    );
  }
  if (type === "mcp" && VALID_CATEGORIES.mcp.has(slug)) {
    return (
      <div className="flex flex-col flex-1">

        <div className="relative z-[60]">
          <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <Suspense fallback={
            <main className="mx-auto max-w-container px-6 py-10 flex-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-48 animate-pulse rounded-xl border border-[#232326] bg-[#131316]" />
                ))}
              </div>
            </main>
          }>
            <div className="flex-1">
              <MCPClient defaultSubCategory={slug} />
            </div>
          </Suspense>
        </div>

      </div>
    );
  }
  if (type === "tasks" && VALID_CATEGORIES.tasks.has(slug)) {
    return (
      <div className="flex flex-col flex-1">

        <div className="relative z-[60]">
          <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <TasksClient defaultCategory={slug} />
        </div>

      </div>
    );
  }
  if (type === "companies" && VALID_CATEGORIES.companies.has(slug)) {
    return (
      <div className="flex flex-col flex-1">

        <div className="relative z-[60]">
          <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <CompaniesClient defaultCategory={slug} />
        </div>

      </div>
    );
  }
  if (type === "news" && VALID_CATEGORIES.news.has(slug)) {
    return (
      <div className="flex flex-col flex-1">

        <div className="relative z-[60]">
          <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <NewsListingClient category={slug} />
        </div>

      </div>
    );
  }
  if (type === "videos" && VALID_CATEGORIES.videos.has(slug)) {
    return (
      <div className="flex flex-col flex-1">

        <div className="relative z-[60]">
          <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <VideosPageClient initialVideos={[]} initialTotal={0} pageSize={24} defaultCategory={slug} />
        </div>

      </div>
    );
  }
  if (type === "robots" && VALID_CATEGORIES.robots.has(slug)) {
    return (
      <div className="flex flex-col flex-1">

        <div className="relative z-[60]">
          <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <RobotsClient defaultCategory={slug} />
        </div>

      </div>
    );
  }
  if (type === "devices" && VALID_CATEGORIES.devices.has(slug)) {
    return (
      <div className="flex flex-col flex-1">

        <div className="relative z-[60]">
          <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <DevicesClient defaultCategory={slug} />
        </div>

      </div>
    );
  }
  if (type === "models" && VALID_CATEGORIES.models.has(slug)) {
    return (
      <div className="flex flex-col flex-1">

        <div className="relative z-[60]">
          <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <ModelsClient defaultSubCategory={slug} />
        </div>

      </div>
    );
  }
  if (type === "repositories" && VALID_CATEGORIES.repositories.has(slug)) {
    return (
      <div className="flex flex-col flex-1">

        <div className="relative z-[60]">
          <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <RepositoriesClient defaultCategory={slug} />
        </div>

      </div>
    );
  }

  if (type === "tools" || type === "personal" || type === "creativity") return (
    <div className="flex flex-col flex-1 bg-[#000000] text-white">

      <div className="flex-1">
        <ToolDetailClient />
      </div>

    </div>
  );
  if (type === "mcp") {
    const item = await fetchMCPItemBySlug(slug);
    if (!item) return notFound();

    return (
      <MCPDetailClient item={item} initialAlternatives={undefined} />
    );
  }
  if (type === "videos") return <VideoDetailsClient />;
  if (type === "news") return <ArticlePageClient />;
  if (type === "tasks") return <TaskDetailClient />;
  if (type === "repositories") return <RepositoryDetailPage slug={slug} />;
  if (type === "companies") return <CompanyDetailClient />;
  if (type === "models") {
    return (
      <div className="flex flex-col flex-1">

        <ModelDetailClient />

      </div>
    );
  }

  if (type === "robots") {
    return (
      <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">

        <RobotDetailClient id={slug} />

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