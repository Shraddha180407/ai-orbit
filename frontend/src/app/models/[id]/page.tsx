export const runtime = "edge";

import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModelDetailClient } from "@/components/detail/ModelDetailClient";
import { SERVER_API_URL } from "@/lib/api";

interface ModelPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${SERVER_API_URL}/api/v1/models/${encodeURIComponent(id)}`);
    if (!res.ok) return { title: "Model | AI Orbit" };
    const model = (await res.json()) as { name?: string; description?: string };
    if (!model?.name) return { title: "Model | AI Orbit" };
    return {
      title: `${model.name} — AI Model`,
      description: model.description,
    };
  } catch {
    return { title: "Model | AI Orbit" };
  }
}

export default function ModelDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <ModelDetailClient />
      <Footer />
    </div>
  );
}
