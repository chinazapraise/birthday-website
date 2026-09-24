import type { TimelineYear } from "@/lib/types";

/*
 * Timeline media merge.
 * Uploaded photos live in the store as a map: mediaId -> dataUrl.
 * This overlays them onto the seed timeline WITHOUT touching the media
 * structure (ids, placeholderLabels, aspects stay stable).
 */

export function mergeTimelineMedia(
  years: TimelineYear[],
  mediaUrls: Record<string, string>,
): TimelineYear[] {
  const keys = Object.keys(mediaUrls);
  if (!keys.length) return years;
  return years.map((y) => {
    const media = y.media.map((m) =>
      mediaUrls[m.id] ? { ...m, url: mediaUrls[m.id] } : m,
    );
    return media.length === y.media.length && media.every((m, i) => m === y.media[i])
      ? y
      : { ...y, media };
  });
}