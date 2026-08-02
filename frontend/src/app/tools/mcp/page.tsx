import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { MCPClient } from "@/components/mcp-client";

export const metadata: Metadata = {
  title: "Model Context Protocol (MCP) Directory — AiOrbit",
  description:
    "Explore the Model Context Protocol (MCP) directory. Discover servers, clients, and integrations to extend your AI tools' capabilities.",
  openGraph: {
    title: "Model Context Protocol (MCP) Directory — AiOrbit",
    description:
      "Explore the Model Context Protocol (MCP) directory. Discover servers, clients, and integrations.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Model Context Protocol (MCP) Directory — AiOrbit",
    description:
      "Explore the Model Context Protocol (MCP) directory. Discover servers, clients, and integrations.",
  },  
  alternates: {
    canonical: "/tools/mcp",
  },
};

export default function MCPPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <Suspense fallback={<div className="h-[300px]" />}><GlobalHero searchAction="/tools/mcp" /></Suspense>
      <Suspense fallback={
        <main className="mx-auto max-w-container px-6 py-10 flex-1">
          <div className="h-48 animate-pulse rounded-xl border border-[#232326] bg-[#131316]" />
        </main>
      }>
        <div className="flex-1">
          <MCPClient />
        </div>
      </Suspense>
      <Footer />
    </div>
  );
}
