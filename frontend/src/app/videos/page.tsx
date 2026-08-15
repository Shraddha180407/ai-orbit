import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { VideosPageClient } from "@/components/videos/VideosPageClient";

import { getVideosPage, getVideosCount } from "@/lib/videos-data";
export const runtime = 'edge';

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

export default async function VideosPage() {
  const [videos, total] = await Promise.all([
    getVideosPage(PAGE_SIZE, 0),
    getVideosCount(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-14 pb-24 pt-2">
        <VideosPageClient
          initialVideos={videos}
          initialTotal={total}
          pageSize={PAGE_SIZE}
        />
      </main>
      <Footer />
    </div>
  );
}