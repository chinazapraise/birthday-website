"use client";

import { motion } from "framer-motion";
import type { YearPhoto } from "@/lib/types";
import { EASE } from "@/lib/motion";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

/**
 * "People who made the story possible." Pure cinematic photo marquee.
 * No names, titles or captions — just pure photos.
 */
export default function PeopleMosaic({ photos = [] }: { photos?: YearPhoto[] }) {
  // If no photos uploaded yet, show 6 elegant placeholders so the section remains visible
  const items =
    photos.length > 0
      ? photos
      : Array.from({ length: 6 }).map((_, i) => ({
          id: `placeholder-${i + 1}`,
          url: "",
          placeholderLabel: `PHOTO · 0${i + 1}`,
        }));

  // Duplicate the array so it scrolls infinitely without gaps
  const doubled = [...items, ...items];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto mb-12 max-w-4xl px-6 text-center">
        <motion.p
          className="font-hand text-2xl text-cream/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Gratitude
        </motion.p>
        <motion.h2
          className="mt-2 font-display text-3xl font-bold text-cream md:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          People who made the story <span className="text-magenta">possible</span>.
        </motion.h2>
      </div>

      <div className="animate-marquee-x flex w-max gap-5 px-6 hover:[animation-play-state:paused]">
        {doubled.map((p, i) => (
          <motion.figure
            key={`${p.id}-${i}`}
            className="group relative h-64 w-48 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-xl md:h-80 md:w-60"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % items.length) * 0.05, ease: EASE }}
          >
            {p.url ? (
              <img
                src={p.url}
                alt="Part of the story"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <PhotoPlaceholder
                label={(p as { placeholderLabel?: string }).placeholderLabel ?? "PHOTO PLACEHOLDER"}
                aspect="4:5"
                className="h-full w-full rounded-none border-0"
              />
            )}
          </motion.figure>
        ))}
      </div>
    </section>
  );
}