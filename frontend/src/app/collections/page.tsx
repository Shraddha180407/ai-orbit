import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import CollectionsPageClient from "./CollectionsPageClient";
import type { CollectionsApiResponse } from "@/lib/types";
import { SERVER_API_URL } from "@/lib/api";

export const runtime = "edge";

export const metadata: Metadata = {
  title: " Collections | Tool Directory",
  description: "Explore curated lists and stack configurations by domain experts.",
};

async function getInitialCollections(): Promise<CollectionsApiResponse> {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/v1/collections?sort=recently_updated`, {
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

export default function CollectionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      <CollectionsPageClient />
      <Footer />
    </div>
  );
}