"use client";

import { motion } from "framer-motion";
import { type PropsWithChildren } from "react";
import type { MicroMemory } from "@/lib/types";
import { EASE } from "@/lib/motion";

const ICONS: Record<MicroMemory["type"], string> = {
  "Plot twist": "↯",
  "I can explain…": "❗",
  "This aged badly": "🫠",
  "Core memory": "★",
  "God did.": "🙌",
  "Meanwhile…": "⏳",
};

/**
 * Small memory cards that visually break up the timeline.
 */
export default function MicroMemoryCard({ memory }: { memory: MicroMemory }) {
  return (
    <section className="relative py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <WhisperWrap>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative mx-auto flex max-w-md flex-col gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-sm"
            style={{
              boxShadow: `0 0 60px -20px ${memory.accent}66`,
              transform: "rotate(-1deg)",
            }}
          >
            <span
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full font-display text-lg"
              style={{ background: `${memory.accent}22`, color: memory.accent }}
              aria-hidden
            >
              {ICONS[memory.type] ?? "✦"}
            </span>
            <h4
              className="font-display text-lg font-bold"
              style={{ color: memory.accent }}
            >
              {memory.type}
            </h4>
            <p className="font-hand text-2xl leading-snug text-cream/80">
              {memory.label}
            </p>
            {memory.note && (
              <p className="text-sm text-cream/50">{memory.note}</p>
            )}
          </motion.div>
        </WhisperWrap>
      </div>
    </section>
  );
}

function WhisperWrap({ children }: PropsWithChildren<{ last?: boolean }>) {
  return <>{children}</>;
}