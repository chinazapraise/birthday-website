import type { TimelineYear, YearPhoto } from "@/lib/types";

/*
 * Timeline photo rendering.
 *
 * The seed timeline owns the LAYOUT: how many frames a year has, their
 * aspect ratios, captions and layout variant. It is never modified.
 *
 * Admin uploads live in one ordered list per year. That order is the
 * priority order:
 *   - Home timeline: the first N photos fill the year's N existing frames.
 *   - Gallery: every photo for the year.
 * There is no global or per-year photo cap.
 */

/** How many uploads land on the home timeline for a year: its existing frame count. */
export function homeFrameCount(year: TimelineYear): number {
  return year.media.length;
}

/**
 * Home timeline. Fills each year's existing frames, in order, from the head
 * of that year's photo list. Frame count, aspect and layout are untouched;
 * frames with no photo left keep their placeholder.
 */
export function applyYearPhotosToFrames(
  years: TimelineYear[],
  photos: Record<string, YearPhoto[]>,
): TimelineYear[] {
  const hasAny = Object.keys(photos).length > 0;
  if (!hasAny) return years;

  return years.map((year) => {
    const list = photos[year.id];
    if (!list?.length) return year;

    const media = year.media.map((frame, i) => {
      const photo = list[i];
      return photo
        ? {
            ...frame,
            url: photo.url,
            alt: photo.caption || frame.alt,
            caption: photo.caption || frame.caption,
          }
        : frame;
    });

    return { ...year, media };
  });
}

/**
 * Gallery. Every photo uploaded for the year, in the same admin order.
 * A year with no uploads falls back to its seed frames so the gallery page
 * never renders empty.
 */
export function yearGalleryMedia(
  years: TimelineYear[],
  photos: Record<string, YearPhoto[]>,
): TimelineYear[] {
  if (Object.keys(photos).length === 0) return years;

  return years.map((year) => {
    const list = photos[year.id];
    if (!list?.length) return year;

    const media: TimelineYear["media"] = list.map((photo, i) => ({
      id: `photo-${photo.id}`,
      type: "image",
      url: photo.url,
      alt: photo.caption || `${year.year} photo ${i + 1}`,
      caption: photo.caption,
      placeholderLabel: photo.caption || "PHOTO",
      aspect: "4:5",
    }));

    return { ...year, media };
  });
}
