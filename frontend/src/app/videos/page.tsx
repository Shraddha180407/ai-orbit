import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { VideosPageClient } from "@/components/videos/VideosPageClient";
import { VideoTableSkeleton } from "@/components/videos/VideoTable";
import { getVideosPage, getVideosCount } from "@/lib/videos-data";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;

async function VideosList({
  category,
  page = 1,
}: {
  category?: string;
  page?: number;
}) {
  const offset = Math.max(0, (page - 1) * PAGE_SIZE);
  const [videos, total] = await Promise.all([
    getVideosPage(PAGE_SIZE, offset, category),
    getVideosCount(category),
  ]);

  return (
    <VideosPageClient
      initialVideos={videos}
      initialTotal={total}
      pageSize={PAGE_SIZE}
      defaultCategory={category}
    />
  );
}

interface VideosPageProps {
  searchParams?: Promise<{
    category?: string;
    page?: string;
  }>;
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const category = resolvedSearchParams?.category || "";
  const page = Math.max(1, Number(resolvedSearchParams?.page) || 1);

  return (
    <div className="flex flex-col flex-1 bg-[#000000] text-white">
      <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      <link rel="preconnect" href="https://i.ytimg.com" />
      <link rel="preconnect" href="https://www.google.com" />
      <div className="relative z-[60]">
        <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      </div>
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-14 pb-8 pt-2">
        <Suspense fallback={<VideoTableSkeleton rowCount={10} />}>
          <VideosList category={category} page={page} />
        </Suspense>
      </main>
    </div>
  );
}