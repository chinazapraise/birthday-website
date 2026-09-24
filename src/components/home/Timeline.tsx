"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useMemo, useRef } from "react";
import type { TimelineYear, MicroMemory } from "@/lib/types";
import TimelineChapter from "@/components/home/TimelineChapter";
import MicroMemoryCard from "@/components/home/MicroMemoryCard";
import { mergeTimelineMedia } from "@/lib/timelineMedia";
import { useTimelineMedia } from "@/lib/hooks";

/**
 * SECTION 2 — STORY TIMELINE 2016–2026.
 * Central animated line draws as you scroll; chapters alternate left/right;
 * micro-memories break up the rhythm between some years.
 */
export default function Timeline({
  years,
  memories,
}: {
  years: TimelineYear[];
  memories: MicroMemory[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "end 0.9"],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
  });

  const { mediaUrls } = useTimelineMedia();
  const mergedYears = useMemo(
    () => mergeTimelineMedia(years, mediaUrls),
    [years, mediaUrls],
  );

  const memoByYear = new Map<number, MicroMemory[]>();
  memories.forEach((m) => {
    const list = memoByYear.get(m.year) ?? [];
    list.push(m);
    memoByYear.set(m.year, list);
  });

  return (
    <section id="timeline" className="relative">
      {/* Timeline intro */}
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-12 text-center md:pt-24">
        <motion.p
          className="font-hand text-2xl text-cream/50 md:text-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Some stories make more sense when you look backwards.
        </motion.p>
        <motion.h2
          className="mt-4 font-display text-3xl font-bold text-cream md:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Mine starts <span className="text-violet">here</span>.
        </motion.h2>
      </div>

      <div ref={ref} className="relative">
        {/* Central timeline rail (desktop) */}
        <div className="absolute left-[19px] top-0 hidden h-full w-[3px] -translate-x-1/2 bg-white/10 md:left-1/2 md:block">
          <motion.div
            className="absolute left-0 top-0 w-[3px] rounded-full bg-gradient-to-b from-violet via-magenta to-gold"
            style={{ scaleY: lineProgress, transformOrigin: "top" }}
          />
        </div>

        {/* Mobile left rail */}
        <div className="absolute left-[19px] top-0 h-full w-[2px] bg-white/10 md:hidden">
          <motion.div
            className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-violet via-magenta to-gold"
            style={{ scaleY: lineProgress, transformOrigin: "top" }}
          />
        </div>

        {mergedYears.map((entry, i) => (
          <div key={entry.id} className="relative">
            <TimelineChapter entry={entry} index={i} />
            {/* micro-memories after most years */}
            {memoByYear.get(entry.year)?.map((m) => (
              <MicroMemoryCard key={m.id} memory={m} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}