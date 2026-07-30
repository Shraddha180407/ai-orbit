import Link from "next/link";
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
      <main className="flex-1 w-full max-w-[1440px] mx-auto">
        <div className="px-6 lg:px-10 xl:px-14 pt-8">
          <div className="flex items-center gap-1.5 font-mono text-[13.5px] text-[#A1A1AA]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <path d="M2 4.2A1.2 1.2 0 0 1 3.2 3h6.6A1.2 1.2 0 0 1 11 4.2v7.6A1.2 1.2 0 0 1 9.8 13H3.2A1.2 1.2 0 0 1 2 11.8Z" stroke="currentColor" strokeWidth="1.2" />
              <path d="M11 6.3 14 4.5v7L11 9.7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
            <span>&gt;</span>
            <span className="text-white">Videos</span>
            <span className="rounded bg-[#232326]/60 px-1.5 py-[1px] text-[12px] text-[#A1A1AA]">
              {total.toLocaleString("en-US")}
            </span>
          </div>
        </div>

        <div className="px-6 lg:px-10 xl:px-14 pb-24 pt-6">
          <div className="rounded-2xl border border-[#232326]/70 bg-gradient-to-b from-[#131316]/60 to-[#0D0D10]/60 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_20px_60px_-30px_rgba(0,0,0,0.8)] ring-1 ring-[#232326]/70 p-6">
            <VideosPageClient
              initialVideos={videos}
              initialTotal={total}
              pageSize={PAGE_SIZE}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}