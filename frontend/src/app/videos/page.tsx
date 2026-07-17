import Link from "next/link";
import { VideosPageClient } from "@/components/videos/VideosPageClient";
import { VideosShell } from "@/components/videos/VideosShell";
import { getAllVideos } from "@/lib/videos-data";

export default async function VideosPage() {
  const videos = await getAllVideos();

  const channelCount = new Set(videos.map((v) => v.toolName)).size;
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);

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
              {videos.length.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="container pb-24 pt-4">
          <div className="rounded-lg border border-border bg-bg-elevated/60">
            <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="shrink-0 text-primary">
                  <rect x="1.5" y="3.5" width="9.5" height="9" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M11 6.3 14.5 4v8L11 9.7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
                <h1 className="text-[22px] font-bold tracking-[-0.01em] text-primary">Videos</h1>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[13.5px] text-secondary">
                <span className="text-muted">
                  Videos <span className="font-semibold text-primary">{videos.length.toLocaleString()}</span>
                </span>
                <span className="text-muted">
                  Channels <span className="font-semibold text-primary">{channelCount}</span>
                </span>
                <span className="text-muted">
                  Views <span className="font-semibold text-primary">{totalViews.toLocaleString()}</span>
                </span>
              </div>
            </div>

            <VideosPageClient videos={videos} />
          </div>
        </div>
      </VideosShell>
    </div>
  );
}
