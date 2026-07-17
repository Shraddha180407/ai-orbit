export const runtime = "edge";
import { notFound } from "next/navigation";
import { ToolDetailClient } from "@/components/tool-detail-client";
import { CollectionDetailClient } from "@/components/detail/CollectionDetailClient";
import { VideoDetailsClient } from "@/components/detail/VideoDetailsClient";
import { ArticlePageClient } from "@/components/article-page-client";
import { EntityDetail } from "@/components/detail/EntityDetail";

export default function UnifiedEntityPage({ params }: { params: { type: string; slug: string } }) {
  const { type } = params;
  
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

  if (entityTypeMap[type]) {
    return <EntityDetail type={entityTypeMap[type]} />;
  }

  return notFound();
}
