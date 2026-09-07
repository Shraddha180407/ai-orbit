"use client";

/**
 * No custom facade here on purpose. YouTube's own embed chrome (thumbnail,
 * channel row, play button, scrubber, share/More-videos row) is already a
 * clean, familiar, fully-functional UI — recreating it with a static image
 * behind a fake play button just looks worse and hides real info (title,
 * channel, duration) behind a blown-up thumbnail.
 *
 * Autoplay note: the `autoPlay` HTML attribute on the iframe tag is a no-op
 * for YouTube embeds — YouTube only autoplays when `autoplay=1` is passed in
 * the embed URL's query string. Browsers also block autoplay-with-sound, so
 * the video must start muted (`mute=1`); users can unmute via the player's
 * own volume control once playback has started.
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
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}