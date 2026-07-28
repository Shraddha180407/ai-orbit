import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import CollectionsPageClient from "./CollectionsPageClient";
import type { CollectionsApiResponse } from "@/lib/types";
import { mockCollections } from "@/lib/mockCollections";

export const runtime = "edge";

export const metadata: Metadata = {
  title: " Collections | Tool Directory",
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
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <Suspense fallback={
        <main className="mx-auto max-w-[1440px] px-8 py-12 flex-1">
          <div className="mb-10 h-16 animate-pulse bg-[#131316] rounded-xl border border-[#232326]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl border border-[#232326] bg-[#131316]/50" />
            ))}
          </div>
        </main>
      }>
        <CollectionsPageClient 
          initialItems={mockCollections} 
          initialNextCursor={initialData.nextCursor} 
        />
      </Suspense>
      <Footer />
    </div>
  );
}