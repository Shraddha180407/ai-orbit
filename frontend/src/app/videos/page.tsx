import Link from "next/link";
import { VideosPageClient } from "@/components/videos/VideosPageClient";
import { VideosShell } from "@/components/videos/VideosShell";
<<<<<<< HEAD
import { getAllVideos } from "@/lib/videos-data";
=======
import { getVideosPage, getVideosCount } from "@/lib/videos-data";
export const runtime = 'edge';

export const dynamic = "force-dynamic";
>>>>>>> pr-24

const PAGE_SIZE = 24;

export default async function VideosPage() {
  const [videos, total] = await Promise.all([
    getVideosPage(PAGE_SIZE, 0),
    getVideosCount(),
  ]);

  return (
    <div className="min-h-screen bg-bg">
      <VideosShell>
        <div className="container pt-4">
          <div className="flex items-center gap-1.5 font-mono text-[13.5px] text-muted">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <path d="M2 4.2A1.2 1.2 0 0 1 3.2 3h6.6A1.2 1.2 0 0 1 11 4.2v7.6A1.2 1.2 0 0 1 9.8 13H3.2A1.2 1.2 0 0 1 2 11.8Z" stroke="currentColor" strokeWidth="1.2" />
              <path d="M11 6.3 14 4.5v7L11 9.7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            <Link href="/" className="hover:text-secondary">Home</Link>
            <span>&gt;</span>
            <span className="text-secondary">Videos</span>
            <span className="rounded bg-bg-hover px-1.5 py-[1px] text-[12px] text-muted">
              {total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="container pb-24 pt-4">
          <div className="rounded-lg border border-border bg-bg-elevated/60">
            <VideosPageClient
              initialVideos={videos}
              initialTotal={total}
              pageSize={PAGE_SIZE}
            />
          </div>
        </div>
      </VideosShell>
    </div>
  );
}