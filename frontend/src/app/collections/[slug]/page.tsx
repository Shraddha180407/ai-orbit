import type { Metadata } from "next";
import { CollectionDetailClient } from "./CollectionDetailClient";
import { API_URL } from "@/lib/api";

export const runtime = "edge";

async function fetchCollection(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/collections/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await fetchCollection(slug);
  if (!collection) {
    return { title: "Collection — The AI Signal" };
  }
  return {
    title: `${collection.title} — The AI Signal`,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CollectionDetailClient slug={slug} />;
}
