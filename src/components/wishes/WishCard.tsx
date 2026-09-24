"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Wish } from "@/lib/types";
import { EASE } from "@/lib/motion";
import { formatDate, initials } from "@/lib/utils";

/**
 * Flip/rotate gradient card for the wish wall.
 */
export default function WishCard({
  wish,
  index,
}: {
  wish: Wish;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const gradients = [
    "from-violet/40 to-ultraviolet/30",
    "from-magenta/40 to-hotpink/25",
    "from-sunset/40 to-ultraviolet/25",
    "from-acid/35 to-violet/25",
    "from-gold/35 to-magenta/25",
  ];
  const rotations = ["-2", "1.5", "-1", "2", "-1.5", "0.5"];
  const grad = gradients[index % gradients.length];
  const rot = rotations[index % rotations.length];

  return (
    <motion.article
      className="group h-64 [perspective:1200px]"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.07, ease: EASE }}
    >
      <motion.div
        className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : `rotate(${rot}deg)` }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={() => setFlipped((v) => !v)}
        role="button"
        tabIndex={0}
        aria-label={`Wish from ${wish.senderName}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setFlipped((v) => !v);
        }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br ${grad} p-6 text-center shadow-lg [backface-visibility:hidden]`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/25 text-lg font-bold text-cream">
            {initials(wish.senderName)}
          </span>
          <p className="font-display text-lg font-bold text-cream">
            {wish.senderName}
          </p>
          {wish.relationship && (
            <p className="text-xs uppercase tracking-[0.2em] text-cream/40">
              {wish.relationship}
            </p>
          )}
          <span className="absolute bottom-4 text-xs text-cream/35">
            tap to open
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex origin-center flex-col gap-3 overflow-auto rounded-2xl border border-white/10 bg-ink p-6 shadow-lg [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-sm font-bold text-magenta">
              {wish.senderName}
            </span>
            {wish.relationship && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-cream/50">
                {wish.relationship}
              </span>
            )}
          </div>
          <p className="flex-1 overflow-y-auto text-sm leading-relaxed text-cream/85">
            {wish.message}
          </p>
          <p className="text-right text-xs text-cream/35">
            {formatDate(wish.createdAt)}
          </p>
        </div>
      </motion.div>
    </motion.article>
  );
}