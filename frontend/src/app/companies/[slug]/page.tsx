export const runtime = "edge";

import type { Metadata } from "next";
import { CompanyDetailClient } from "@/components/company-detail-client";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const formattedName = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return {
    title: `${formattedName} — Company Details | AI Orbit`,
    description: `Explore products, models, overview, and metrics for ${formattedName} on AI Orbit.`,
  };
}

export default function CompanyDetailPage() {
  return <CompanyDetailClient />;
}
