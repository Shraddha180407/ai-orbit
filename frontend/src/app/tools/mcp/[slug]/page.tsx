import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { fetchMCPItemBySlug } from "@/lib/api";
import { MCPDetailClient } from "@/components/mcp-detail-client";

interface MCPDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MCPDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await fetchMCPItemBySlug(slug);

  if (!item) {
    return {
      title: "MCP Item Not Found | AI Orbit",
    };
  }

  return {
    title: `${item.name} — Model Context Protocol (MCP) | AI Orbit`,
    description: item.shortDescription,
  };
}

export default async function MCPDetailPage({ params }: MCPDetailPageProps) {
  const { slug } = await params;
  const item = await fetchMCPItemBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <MCPDetailClient item={item} />
      <Footer />
    </div>
  );
}
