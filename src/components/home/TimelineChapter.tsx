"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, X } from "@phosphor-icons/react";
import type { TimelineYear } from "@/lib/types";
import { fireConfettiAtPoint } from "@/components/effects/ConfettiLayer";
import { EASE } from "@/lib/motion";

function getYearTint(year: number): string {
  const map: Record<number, string> = {
    2016: "#a78bfa",
    2017: "#22d3ee",
    2018: "#8b5cf6",
    2019: "#f43f9e",
    2020: "#22d3ee",
    2021: "#ff7a3d",
    2022: "#f5c97b",
    2023: "#a78bfa",
    2024: "#f43f9e",
    2025: "#ff9a5d",
    2026: "#fbbf24",
  };
  return map[year] ?? "#8b5cf6";
}

export default function TimelineChapter({
  entry,
  index,
}: {
  entry: TimelineYear;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const accent = getYearTint(entry.year);

  // Alternate: even index → text left / media right; odd → text right / media left.
  const textFirst = index % 2 === 0;

  const storyPreview = truncateStory(entry.story, 220);
  const hasMore = entry.story.length > 220;

  useEffect(() => {
    if (!storyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStoryOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [storyOpen]);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32"
      aria-labelledby={`year-${entry.year}`}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 px-5 md:px-8">
        {/* Text column */}
        <div
          className="min-w-0"
        >
          <motion.span
            id={`year-${entry.year}`}
            className="font-display text-7xl font-black leading-none md:text-8xl"
            style={{ color: accent }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {entry.yearRange ?? entry.year}.
          </motion.span>

          <motion.h3
            className="mt-2 font-display text-2xl font-bold text-cream md:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            {entry.title}
          </motion.h3>

          <motion.p
            className="mt-5 leading-relaxed whitespace-pre-line text-cream/75 md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          >
            {storyPreview}
          </motion.p>

          {hasMore && (
            <motion.button
              onClick={(e) => {
                fireConfettiAtPoint(e, 16);
                setStoryOpen(true);
              }}
              className="mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
              style={{
                borderColor: `${accent}66`,
                color: accent,
              }}
              whileHover={{ x: 4 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Read more
            </motion.button>
          )}

          {entry.location && (
            <div className="mt-4 flex items-center gap-2 text-sm text-cream/45">
              <MapPin size={14} />
              {entry.location}
            </div>
          )}

          {entry.quote && (
            <motion.blockquote
              className="mt-6 border-l-2 pl-4 italic text-cream/60"
              style={{ borderColor: accent }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              “{entry.quote}”
            </motion.blockquote>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {entry.peopleTags?.map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-cream/50"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {storyOpen && (
          <StoryModal
            entry={entry}
            accent={accent}
            onClose={() => setStoryOpen(false)}
          />
        )}
      </AnimatePresence>


    </section>
  );
}

function truncateStory(text: string, max: number = 240): string {
  if (text.length <= max) return text;
  // If there is a paragraph break within 120-280 chars, break at paragraph for a much cleaner preview
  const paragraphs = text.split("\n\n");
  if (paragraphs.length > 1 && paragraphs[0].length <= 260) {
    if (paragraphs[0].length < 120 && paragraphs.length > 2 && (paragraphs[0].length + paragraphs[1].length + 2) <= 260) {
      return `${paragraphs[0]}\n\n${paragraphs[1]}…`;
    }
    return `${paragraphs[0]}…`;
  }
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const end = lastSpace > max * 0.6 ? lastSpace : max;
  return `${text.slice(0, end).replace(/\s+$/u, "")}…`;
}

function StoryModal({
  entry,
  accent,
  onClose,
}: {
  entry: TimelineYear;
  accent: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-xl md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Top right viewport close button */}
      <button
        type="button"
        className="fixed right-4 top-4 z-[160] flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/80 text-cream backdrop-blur-md transition hover:border-white hover:bg-black hover:scale-105 active:scale-95 md:right-6 md:top-6"
        onClick={onClose}
        aria-label="Close story"
      >
        <X size={22} />
      </button>

      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#171327] p-6 shadow-2xl sm:p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky close button inside card header */}
        <div className="sticky top-0 z-20 -mr-2 -mt-2 flex justify-end pb-2">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#171327]/90 text-cream shadow-md backdrop-blur-md transition hover:border-white/50 hover:bg-white/10 hover:scale-105 active:scale-95"
            aria-label="Close story"
          >
            <X size={20} />
          </button>
        </div>

        <span
          className="font-display text-6xl font-black leading-none md:text-7xl"
          style={{ color: accent }}
        >
          {entry.yearRange ?? entry.year}
        </span>
        <h3 className="mt-2 font-display text-2xl font-bold text-cream md:text-3xl">
          {entry.title}
        </h3>
        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-cream/80 md:text-lg">
          {entry.story}
        </p>
        {entry.quote && (
          <p
            className="mt-8 border-l-2 pl-4 italic text-cream/60"
            style={{ borderColor: accent }}
          >
            “{entry.quote}”
          </p>
        )}
        {entry.location && (
          <div className="mt-6 flex items-center gap-2 text-sm text-cream/45">
            <MapPin size={14} />
            {entry.location}
          </div>
        )}

        {/* Bottom exit button for readers who finish the full text */}
        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-xs uppercase tracking-wider text-cream/40">
            {entry.year} · The Story So Far
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-cream transition hover:border-white/40 hover:bg-white/10 hover:scale-105 active:scale-95"
          >
            <X size={16} /> Close story
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

