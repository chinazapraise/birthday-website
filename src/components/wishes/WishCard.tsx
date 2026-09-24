"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Wish } from "@/lib/types";
import { EASE } from "@/lib/motion";
import { formatDate, initials } from "@/lib/utils";
import { fireConfetti } from "@/components/effects/ConfettiLayer";
import { Envelope, EnvelopeOpen, Lock } from "@phosphor-icons/react";

const GRADIENT_GROUPS = [
  ["from-violet to-ultraviolet", "text-acid"],
  ["from-magenta to-hotpink", "text-gold"],
  ["from-sunset to-ultraviolet", "text-acid"],
  ["from-acid to-violet", "text-magenta"],
  ["from-gold to-magenta", "text-violet"],
];

const ROTATIONS = ["-2", "1.5", "-1", "2", "-1.5", "0.5"];

const ENVELOPE_VARIANTS = [
  "from-violet/50 to-ultraviolet/25",
  "from-magenta/45 to-hotpink/20",
  "from-sunset/45 to-ultraviolet/20",
  "from-acid/40 to-violet/25",
  "from-gold/40 to-magenta/20",
];

/**
 * A birthday envelope on the wall. Tap the face → the flap bursts open
 * with confetti and the letter inside lifts up for reading.
 */
export default function WishCard({
  wish,
  index,
}: {
  wish: Wish;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  const env = ENVELOPE_VARIANTS[index % ENVELOPE_VARIANTS.length];
  const accent = GRADIENT_GROUPS[index % GRADIENT_GROUPS.length][1];
  const rot = ROTATIONS[index % ROTATIONS.length];

  const reveal = () => {
    if (open) return;
    setOpen(true);
    fireConfetti("burst", { count: 30 });
  };

  return (
    <motion.article
      className="group h-64 [perspective:1400px]"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.07, ease: EASE }}
    >
      <div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ rotate: open ? "0deg" : `${rot}deg` }}
      >
        {/* Letter (revealed inside) */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="absolute inset-0 z-20 flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#171324] p-5 shadow-2xl"
              initial={{ y: 70, scale: 0.92, opacity: 0, rotateX: -12 }}
              animate={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              exit={{ y: 60, opacity: 0, transition: { duration: 0.2 } }}
              role="button"
              tabIndex={0}
              aria-label={`Wish from ${wish.senderName}`}
              onClick={() => setOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setOpen(false);
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-magenta">
                  {wish.anonymous ? "Anonymous" : wish.senderName}
                </span>
                {wish.relationship ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-cream/50">
                    {wish.relationship}
                  </span>
                ) : (
                  <EnvelopeOpen size={16} className="text-cream/30" />
                )}
              </div>

              <div className="mt-3 flex items-center gap-3 border-y border-white/10 py-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-violet/40 to-magenta/30 text-sm font-bold text-cream">
                  {initials(
                    wish.anonymous ? "Anonymous" : wish.senderName,
                  )}
                </span>
                <p className="font-hand text-xl leading-tight text-cream/80">
                  Dear Tomide,
                </p>
              </div>

              <p className="mt-3 flex-1 overflow-y-auto pr-1 text-sm leading-relaxed text-cream/85">
                {wish.message}
              </p>

              <div className="mt-3 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.2em] text-cream/35">
                <span>
                  {wish.anonymous && (
                    <Lock size={11} weight="fill" className="mr-1 inline -mt-0.5" />
                  )}
                  sealed {formatDate(wish.createdAt)}
                </span>
                <span className="font-hand normal-case tracking-normal text-cream/50">
                  {wish.anonymous ? "a secret admirer" : `- ${wish.senderName}`}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Envelope face */}
        <AnimatePresence>
          {!open && (
            <motion.div
              className="absolute inset-0 z-10"
              exit={{ scale: 1.08, rotateX: -45, opacity: 0, rotate: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              key="env"
            >
              <div
                className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg"
                role="button"
                tabIndex={0}
                aria-label={`Open wish from ${wish.senderName}`}
                onClick={reveal}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") reveal();
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${env}`} />
                {/* envelope body */}
                <div className="absolute inset-3 rounded-xl border border-white/10 bg-ink/40" />
                {/* flap triangle */}
                <div
                  className={`absolute left-0 right-0 top-0 h-24 bg-gradient-to-br ${env} opacity-90 [clip-path:polygon(0_0,100%_0,50%_78%)]`}
                />
                {/* veins */}
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(115deg,transparent_48.5%,#f7efdf_48.5%,#f7efdf_51.5%,transparent_51.5%),linear-gradient(-115deg,transparent_48.5%,#f7efdf_48.5%,#f7efdf_51.5%,transparent_51.5%)]" />

                {/* face content */}
                <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/30 text-lg font-bold text-cream shadow-lg backdrop-blur">
                    {initials(wish.anonymous ? "Anonymous" : wish.senderName)}
                  </span>
                  <p className="font-display text-lg font-bold text-cream">
                    {wish.anonymous ? "Anonymous" : wish.senderName}
                  </p>
                  <p className={`text-xs uppercase tracking-[0.25em] ${accent}`}>
                    A wish for 27
                  </p>
                  {wish.relationship && (
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-cream/40">
                      {wish.relationship}
                    </p>
                  )}
                  <span className="absolute bottom-4 text-xs text-cream/40">
                    <Envelope size={14} className="mr-1.5 inline" />
                    tap to open
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}