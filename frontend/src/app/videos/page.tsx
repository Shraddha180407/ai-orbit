import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { VideosPageClient } from "@/components/videos/VideosPageClient";

import { getVideosPage, getVideosCount } from "@/lib/videos-data";
export const runtime = "edge";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;

/**
 * Split out from VideosPage so the backend fetch (getVideosPage +
 * getVideosCount) sits behind its own Suspense boundary — same pattern as
 * NewsPage -> NewsPageClient. Previously this fetch was awaited directly in
 * the page component, which blocked Header/GlobalHero/Footer from painting
 * at all until both calls resolved (the reported "clicking is slow" issue).
 * Now the shell renders immediately and only this piece streams in.
 */
async function VideosList() {
  const [videos, total] = await Promise.all([
    getVideosPage(PAGE_SIZE, 0),
    getVideosCount(),
  ]);

  return (
    <VideosPageClient
      initialVideos={videos}
      initialTotal={total}
      pageSize={PAGE_SIZE}
    />
  );
}

export default function VideosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-14 pb-24 pt-2">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        }>
          <VideosList />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}