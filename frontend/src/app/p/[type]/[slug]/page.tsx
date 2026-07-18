export const runtime = "edge";
import { notFound } from "next/navigation";
import { ToolDetailClient } from "@/components/tool-detail-client";
import { CollectionDetailClient } from "@/components/detail/CollectionDetailClient";
import { VideoDetailsClient } from "@/components/detail/VideoDetailsClient";
import { ArticlePageClient } from "@/components/article-page-client";
import { EntityDetail } from "@/components/detail/EntityDetail";
import { DeviceDetailClient } from "@/components/detail/DeviceDetailClient";

export default async function UnifiedEntityPage({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const resolvedParams = await params;
  const type = resolvedParams.type;
  
  
  if (type === "tools") return <ToolDetailClient />;
  if (type === "collections") return <CollectionDetailClient />;
  if (type === "videos") return <VideoDetailsClient />;
  if (type === "news") return <ArticlePageClient />;

  const entityTypeMap: Record<string, any> = {
    devices: "device",
    countries: "country",
    fundraises: "fundraise",
    investors: "investor",
    models: "model",
    repositories: "repository",
    robots: "robot",
    tasks: "task"
  };

  if (type === "devices") return <DeviceDetailClient />;
  if (entityTypeMap[type]) {
    return <EntityDetail type={entityTypeMap[type]} />;
  }

  return notFound();
}
