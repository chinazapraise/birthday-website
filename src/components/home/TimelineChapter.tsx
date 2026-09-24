"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, X } from "@phosphor-icons/react";
import type { TimelineYear } from "@/lib/types";
import MemoryLightbox from "@/components/shared/MemoryLightbox";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
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
  const [open, setOpen] = useState<number>(-1);
  const [storyOpen, setStoryOpen] = useState(false);
  const accent = getYearTint(entry.year);

  // Alternate: even index → text left / media right; odd → text right / media left.
  const textFirst = index % 2 === 0;

  const storyPreview = truncateStory(entry.story, 220);
  const hasMore = storyPreview !== entry.story;

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
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-14 md:px-8">
        {/* Text column */}
        <div
          className={textFirst ? "md:order-1 md:pr-10" : "md:order-2 md:pl-10"}
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
            {entry.year}
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

        {/* Media column — each chapter uses a distinct layout variant */}
        <div
          className={textFirst ? "md:order-2" : "md:order-1"}
        >
          <ChapterMedia
            entry={entry}
            accent={accent}
            onOpen={(i) => setOpen(i)}
          />
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

      {open >= 0 && (
        <MemoryLightbox
          media={entry.media}
          index={open}
          label={`${entry.year} · ${entry.title}`}
          onClose={() => setOpen(-1)}
          onIndexChange={setOpen}
        />
      )}
    </section>
  );
}

function truncateStory(text: string, max: number): string {
  if (text.length <= max) return text;
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
      className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-xl md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-cream transition hover:border-white/50"
        onClick={onClose}
        aria-label="Close story"
      >
        <X size={20} />
      </button>

      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#171327] p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="font-display text-6xl font-black leading-none md:text-7xl"
          style={{ color: accent }}
        >
          {entry.year}
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
      </motion.div>
    </motion.div>
  );
}

function ChapterMedia({
  entry,
  accent,
  onOpen,
}: {
  entry: TimelineYear;
  accent: string;
  onOpen: (i: number) => void;
}) {
  switch (entry.layoutVariant) {
    case "editorial":
      return (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <PhotoPlaceholder
              label={entry.media[0]?.placeholderLabel ?? "PHOTO PLACEHOLDER"}
              aspect="4:5"
              onClick={() => onOpen(0)}
              url={entry.media[0]?.url}
              alt={entry.media[0]?.alt}
            />
          </motion.div>
          {entry.media[1] && (
            <motion.div
              className="md:w-3/4 md:-ml-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            >
              <PhotoPlaceholder
                label={entry.media[1].placeholderLabel}
                aspect="16:9"
                onClick={() => onOpen(1)}
                url={entry.media[1].url}
                alt={entry.media[1].alt}
              />
              <p className="mt-2 font-hand text-lg text-cream/50">
                {entry.media[1]?.funnyCaption}
              </p>
            </motion.div>
          )}

          {entry.media.slice(2).length > 0 && (
            <div className="flex flex-wrap gap-4">
              {entry.media.slice(2).map((m, i) => (
                <motion.div
                  key={m.id}
                  className="md:w-1/2"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: 0.2 + 0.12 * i, ease: EASE }}
                  whileHover={{ y: -4 }}
                >
                  <PhotoPlaceholder
                    label={m.placeholderLabel}
                    aspect={m.aspect ?? "4:5"}
                    onClick={() => onOpen(2 + i)}
                    url={m.url}
                    alt={m.alt}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      );

    case "polaroid":
      return (
        <div className="relative flex flex-wrap justify-center gap-4 py-6">
          {entry.media.map((m, i) => {
            const tints = ["-6deg", "2deg", "-3deg", "5deg"];
            return (
              <motion.div
                key={m.id}
                className="w-40 rounded-sm bg-cream/95 p-2 pb-8 shadow-xl md:w-44"
                style={{ rotate: tints[i % tints.length] }}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                whileHover={{ y: -8, rotate: 0, scale: 1.05 }}
                onClick={() => onOpen(i)}
              >
                <PhotoPlaceholder
                  label={m.placeholderLabel}
                  aspect="4:5"
                  className="rounded-[4px]"
                  url={m.url}
                  alt={m.alt}
                />
                <p className="mt-2 px-1 font-hand text-sm text-[#2a2237]">
                  {m.funnyCaption ?? m.caption}
                </p>
              </motion.div>
            );
          })}
        </div>
      );

    case "filmstrip":
      return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <div className="p-3">
            <div className="animate-marquee-x flex w-max">
              {Array.from({ length: 2 }, (_, copy) =>
                entry.media.map((m, i) => (
                  <div
                    key={`${m.id}-${copy}`}
                    aria-hidden={copy === 1 ? true : undefined}
                    className="mr-1 w-48 shrink-0 md:w-56"
                  >
                    <PhotoPlaceholder
                      label={m.placeholderLabel}
                      aspect="16:9"
                      onClick={() => onOpen(i)}
                      url={m.url}
                      alt={m.alt}
                    />
                    <p className="mt-1 truncate font-mono text-[0.6rem] uppercase tracking-wider text-cream/40">
                      {entry.year} · {i + 1}
                    </p>
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      );

    case "fullbleed":
      return (
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, scale: 1.06 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease: EASE }}
            onClick={() => onOpen(0)}
          >
            <PhotoPlaceholder
              label={entry.media[0]?.placeholderLabel ?? "PHOTO PLACEHOLDER"}
              aspect="16:9"
              tint={accent}
              className="w-full"
              url={entry.media[0]?.url}
              alt={entry.media[0]?.alt}
            />
          </motion.div>

          {entry.media.slice(1).length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {entry.media.slice(1).map((m, i) => (
                <motion.div
                  key={m.id}
                  className="w-40 rounded-sm bg-cream/95 p-2 pb-7 shadow-xl md:w-44"
                  style={{ rotate: i % 2 ? "2deg" : "-2deg" }}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.12 * i, ease: EASE }}
                  whileHover={{ rotate: 0, y: -6 }}
                  onClick={() => onOpen(1 + i)}
                >
                  <PhotoPlaceholder
                    label={m.placeholderLabel}
                    aspect="4:5"
                    className="rounded-[4px]"
                    url={m.url}
                    alt={m.alt}
                  />
                  <p className="mt-2 px-1 text-center font-hand text-sm text-[#2a2237]">
                    {entry.year}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      );

    case "archive":
      return (
        <div className="relative space-y-3">
          {entry.media.map((m, i) => {
            const offsets = [
              { x: -12, r: -4 },
              { x: 12, r: 3 },
              { x: -4, r: -2 },
            ];
            const o = offsets[i % offsets.length];
            return (
              <motion.div
                key={m.id}
                className="relative mx-auto w-[85%] rounded-lg bg-[#262041] p-3 shadow-xl"
                style={{ rotate: `${o.r}deg`, marginLeft: o.x }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
                whileHover={{ rotate: 0 }}
                onClick={() => onOpen(i)}
              >
                <div className="aspect-[4/5] w-full overflow-hidden rounded-md border border-white/10 bg-[#171327]">
                  {m.url ? (
                    <img
                      src={m.url}
                      alt={m.alt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                      <span className="font-mono text-[0.6rem] uppercase tracking-widest text-cream/35">
                        {m.placeholderLabel}
                      </span>
                    </div>
                  )}
                </div>
                {i === 0 && (
                  <div className="absolute -left-3 top-4 rounded bg-magenta px-2 py-0.5 font-mono text-[0.55rem] font-bold uppercase tracking-wider text-ink">
                    screenshot
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      );

    case "scrapbook":
      return (
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl bg-[#241f38] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div
              className="absolute left-6 top-3 h-6 w-24 rotate-[-6deg] bg-cream/20 backdrop-blur-sm"
              style={{
                clipPath:
                  "polygon(3% 0, 97% 4%, 100% 96%, 0 100%)",
              }}
            />
            <div className="grid grid-cols-2 gap-3">
              {entry.media.map((m, i) => (
                <motion.div
                  key={m.id}
                  className={i === 2 ? "col-span-2" : ""}
                  initial={{ opacity: 0, scale: 0.94, rotate: i % 2 ? 2 : -2 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: i % 2 ? 1 : -1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                  onClick={() => onOpen(i)}
                >
                  <PhotoPlaceholder
                    label={m.placeholderLabel}
                    aspect={i === 2 ? "16:7" : "4:3"}
                    className="rounded-lg"
                    url={m.url}
                    alt={m.alt}
                  />
                </motion.div>
              ))}
            </div>
            <p className="mt-4 font-hand text-xl text-cream/70">
              {entry.funnyAnnotation}
            </p>
          </div>
        </div>
      );

    case "mosaic":
      return (
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {entry.media.map((m, i) => {
            const styles = [
              "col-span-1 row-span-2",
              "col-span-2 row-span-1",
              "col-span-1 row-span-1",
              "col-span-1 row-span-1",
              "col-span-2 row-span-1",
              "col-span-1 row-span-1",
            ];
            return (
              <motion.div
                key={m.id}
                className={styles[i % styles.length]}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                onClick={() => onOpen(i)}
              >
                <PhotoPlaceholder
                  label={m.placeholderLabel}
                  aspect="1/1"
                  className="h-full w-full rounded-lg"
                  url={m.url}
                  alt={m.alt}
                />
              </motion.div>
            );
          })}
        </div>
      );

    case "beforeafter":
      return (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {entry.media.slice(0, 2).map((m, i) => (
              <motion.div
                key={m.id}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                onClick={() => onOpen(i)}
              >
                <PhotoPlaceholder
                  label={m.placeholderLabel}
                  aspect="4:5"
                  className="w-full"
                  url={m.url}
                  alt={m.alt}
                />
                <span
                  className="absolute left-2 top-2 rounded-full px-2.5 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-ink"
                  style={{ background: accent }}
                >
                  {i === 0 ? "before" : "after"}
                </span>
              </motion.div>
            ))}
          </div>

          {entry.media.slice(2).length > 0 && (
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {entry.media.slice(2).map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.1 * i, ease: EASE }}
                  whileHover={{ y: -4 }}
                  onClick={() => onOpen(2 + i)}
                >
                  <PhotoPlaceholder
                    label={m.placeholderLabel}
                    aspect="4:5"
                    className="w-full"
                    url={m.url}
                    alt={m.alt}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      );

    case "video":
      return (
        <motion.div
          className="overflow-hidden rounded-2xl border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          onClick={() => onOpen(0)}
        >
          <div className="relative flex aspect-video items-center justify-center bg-[#171327]">
            <PlayGlyph />
          </div>
          <p className="p-3 text-center font-mono text-xs uppercase tracking-widest text-cream/40">
            [VIDEO PLACEHOLDER · short memory clip]
          </p>
        </motion.div>
      );

    default:
      return null;
  }
}

function PlayGlyph() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-magenta to-sunset text-ink shadow-[0_0_40px_rgba(244,63,158,0.5)]">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}