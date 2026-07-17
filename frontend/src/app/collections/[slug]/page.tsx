import type { Metadata } from "next";
import { getCollectionDetail } from "@/lib/collections";
import { CollectionDetailClient } from "./CollectionDetailClient";

export const dynamic = "force-dynamic";
export const runtime = "edge";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Keep the metadata generation on the server if possible, 
// though note that it might re-introduce data fetching on the server.
// If it brings the worker size back up too high, this can be removed.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCollectionDetail(slug);
  if (!data?.collection) return { title: "Collection not found" };

  return {
    title: `${data.collection.title} — Collections`,
    description: data.collection.description,
  };
}

export default function CollectionDetailPage() {
  return <CollectionDetailClient />;
}
