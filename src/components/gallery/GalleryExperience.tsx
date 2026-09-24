"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TimelineYear } from "@/lib/types";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import MemoryLightbox from "@/components/shared/MemoryLightbox";
import FloatingNav from "@/components/nav/FloatingNav";
import { EASE } from "@/lib/motion";
import { mergeTimelineMedia } from "@/lib/timelineMedia";
import { useTimelineMedia } from "@/lib/hooks";

interface GalleryItem {
  id: string;
  year: number;
  media: TimelineYear["media"][number];
}

export default function GalleryExperience({
  years,
}: {
  years: TimelineYear[];
}) {
  const { mediaUrls } = useTimelineMedia();
  const mergedYears = useMemo(
    () => mergeTimelineMedia(years, mediaUrls),
    [years, mediaUrls],
  );

  const items = useMemo<GalleryItem[]>(
    () =>
      mergedYears.flatMap((y) =>
        y.media.map((m) => ({ id: m.id, year: y.year, media: m })),
      ),
    [mergedYears],
  );

  const allYears = useMemo(() => mergedYears.map((y) => y.year), [mergedYears]);
  const [activeYear, setActiveYear] = useState<number | "all">("all");

  const filtered = useMemo(
    () =>
      activeYear === "all"
        ? items
        : items.filter((it) => it.year === activeYear),
    [items, activeYear],
  );

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="relative min-h-[100dvh] px-6 pb-28 pt-28">
      <FloatingNav />
      <div className="mx-auto max-w-6xl">
        <motion.p
          className="font-hand text-2xl text-cream/50 md:text-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Every photo has a story. Here are all of them.
        </motion.p>
        <motion.h1
          className="mt-4 font-display text-4xl font-bold text-cream md:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          The <span className="text-violet">gallery</span>.
        </motion.h1>

        {/* Year filter */}
        <div className="mt-10 flex flex-wrap gap-2">
          <YearChip
            active={activeYear === "all"}
            onClick={() => setActiveYear("all")}
            label="All years"
          />
          {allYears.map((y) => (
            <YearChip
              key={y}
              active={activeYear === y}
              onClick={() => setActiveYear(y)}
              label={String(y)}
            />
          ))}
        </div>

        {/* Masonry grid */}
        <motion.div layout className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((it) => {
              const openAt = items.findIndex((x) => x.id === it.id);
              return (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mb-4 break-inside-avoid"
                >
                  <PhotoPlaceholder
                    label={it.media.placeholderLabel}
                    aspect={it.media.aspect}
                    onClick={() => setOpenIndex(openAt)}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                    url={it.media.url}
                    alt={it.media.alt}
                  />
                  <div className="mt-2 flex items-baseline justify-between gap-2 px-1">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-cream/45">
                      {String(it.year)}
                    </span>
                    <span className="truncate text-right text-xs text-cream/35">
                      {it.media.caption ?? it.media.funnyCaption ?? ""}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <p className="mt-12 text-center font-mono text-xs uppercase tracking-[0.25em] text-cream/35">
          {items.length} images · 2016-2026
        </p>
      </div>

      {openIndex !== null && (
        <MemoryLightbox
          media={items.map((it) => it.media)}
          index={openIndex}
          label={`Gallery: ${items[openIndex]?.year ?? ""}`}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </main>
  );
}

function YearChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition ${
        active
          ? "border-magenta bg-magenta/20 text-cream"
          : "border-white/15 text-cream/50 hover:border-white/40 hover:text-cream"
      }`}
    >
      {label}
    </button>
  );
}