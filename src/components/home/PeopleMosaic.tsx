"use client";

import { motion } from "framer-motion";
import type { Person } from "@/lib/types";
import { EASE } from "@/lib/motion";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

/**
 * "People who made the story possible." Cinematic marquee.
 */
export default function PeopleMosaic({ people }: { people: Person[] }) {
  if (!people || people.length === 0) return null;
  const doubled = [...people, ...people];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto mb-12 max-w-4xl px-6 text-center">
        <motion.h2
          className="font-display text-3xl font-bold text-cream md:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          People who made the story <span className="text-magenta">possible</span>.
        </motion.h2>
      </div>

      <div className="animate-marquee-x flex w-max gap-6 px-6 hover:[animation-play-state:paused]">
        {doubled.map((p, i) => (
          <motion.figure
            key={`${p.id}-${i}`}
            className="group relative h-56 w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 md:h-64 md:w-52"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % people.length) * 0.06, ease: EASE }}
          >
            <PhotoPlaceholder
              label={p.imageUrl ? "photo" : `${p.name} photo placeholder`}
              aspect="4:5"
              className="h-full w-full rounded-none border-0"
            />
            <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-ink/80 p-4 text-center opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              <span className="font-display text-lg font-bold text-cream">
                {p.name}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-cream/50">
                {p.role}
              </span>
              {p.sentence && (
                <span className="mt-1 text-xs leading-relaxed text-cream/70">
                  “{p.sentence}”
                </span>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}