"use client";

/**
 * No custom facade here on purpose. YouTube's own embed chrome (thumbnail,
 * channel row, play button, scrubber, share/More-videos row) is already a
 * clean, familiar, fully-functional UI — recreating it with a static image
 * behind a fake play button just looks worse and hides real info (title,
 * channel, duration) behind a blown-up thumbnail. Loading the iframe
 * directly (no autoplay) lets YouTube render that native chrome itself.
 */
export function VideoPlayer({
  youtubeId,
  title,
}: {
  youtubeId: string;
  thumbnail?: string;
  toolName?: string;
  accent?: string;
  title: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-black">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}