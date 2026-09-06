"use client";

import { useState } from "react";

export function VideoPlayer({
  youtubeId,
  title,
  thumbnail,
}: {
  youtubeId: string;
  thumbnail?: string;
  toolName?: string;
  accent?: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const poster = thumbnail || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-black">
      {poster && !loaded && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={poster}
            alt={title}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-white/20 border border-white/40 flex items-center justify-center backdrop-blur-sm shadow-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        </div>
      )}
      <iframe
        className="relative z-10 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}