import CollectionsPageClient from "./CollectionsPageClient";
import type { CollectionsApiResponse } from "@/lib/types";
import { Header } from "@/components/Header";

export const runtime = "edge";

export const metadata = {
  title: "Curated Collections | Tool Directory",
  description: "Explore curated lists and stack configurations by domain experts.",
};

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

async function getInitialCollections(): Promise<CollectionsApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/collections?sort=recently_updated`, {
      cache: "no-store", 
    });

    if (!res.ok) {
      console.error(`Failed to fetch collections: ${res.status} ${res.statusText}`);
      return { items: [], nextCursor: null };
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching initial collections:", err);
    return { items: [], nextCursor: null };
  }
}

export default async function CollectionsPage() {
  const initialData = await getInitialCollections();

  return (
    <div className="relative min-h-screen bg-[#000000] text-[#E4E4E7] antialiased">
      <Header/>
      <main className="relative z-10">
        <CollectionsPageClient 
          initialItems={initialData.items} 
          initialNextCursor={initialData.nextCursor} 
        />
      </main>
    </div>
  );
}