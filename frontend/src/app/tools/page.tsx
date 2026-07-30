import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeClient } from "@/components/home-client";

export const metadata: Metadata = {
  title: "AI Tools — Browse the Full Directory",
  description:
    "Search and filter AI tools by category, pricing, and rating. Find the right tool for writing, coding, image generation, and more.",
  openGraph: {
    title: "AI Tools — Browse the Full Directory",
    description:
      "Search and filter AI tools by category, pricing, and rating.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Tools — Browse the Full Directory",
    description: "Search and filter AI tools by category, pricing, and rating.",
  },
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#000000]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    }>
      <HomeClient defaultMode="tools" />
    </Suspense>
  );
}
