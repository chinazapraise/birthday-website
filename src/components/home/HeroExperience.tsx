"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { EASE, DUR } from "@/lib/motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { fireConfettiAtPoint } from "@/components/effects/ConfettiLayer";
import type { SiteSettings } from "@/lib/types";

interface HeroProps {
  settings: SiteSettings;
  onNext: () => void;
  timelineRef: React.RefObject<HTMLElement | null>;
}

/**
 * SECTION 1 — HERO. Restrained until "Start my story".
 * Large 27, subline reveal, cinematic fade into the timeline.
 */
export default function HeroExperience({
  settings,
  onNext,
  timelineRef,
}: HeroProps) {
  const [starting, setStarting] = useState(false);

  const beginStory = () => {
    setStarting(true);
    setTimeout(() => {
      timelineRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setStarting(false), 900);
      onNext();
    }, 820);
  };

  return (
    <section className="relative flex flex-col items-center justify-start overflow-hidden px-6 pt-16 pb-4 text-center md:pt-24 md:pb-6">
      <motion.p
        className="font-hand text-xl text-cream/60"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        Wandering into something golden…
      </motion.p>

      <AnimatePresence mode="wait">
        {!starting ? (
          <motion.div
            key="hero-idle"
            className="flex flex-col items-center"
            exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <motion.h1
              className="hero-27 my-2 font-display text-[28vw] font-black leading-[0.9] tracking-tight md:my-3 md:text-[13rem]"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: DUR.cinematic, ease: EASE }}
            >
              27
            </motion.h1>

            <motion.p
              className="max-w-2xl font-display text-xl font-semibold text-cream/90 md:text-3xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {settings.heroCopy.subline}
            </motion.p>

            <motion.p
              className="mt-3 text-sm uppercase tracking-[0.25em] text-cream/45 md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {settings.heroCopy.supporting}
            </motion.p>

            <motion.div
              className="mt-6 flex flex-col items-center gap-4 sm:flex-row md:mt-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <MagneticButton>
                <button
                  onClick={(e) => {
                    fireConfettiAtPoint(e, 26);
                    beginStory();
                  }}
                  className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-violet via-magenta to-sunset px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-ink shadow-[0_0_50px_rgba(244,63,158,0.35)] transition-transform hover:scale-[1.03]"
                >
                  {settings.heroCopy.cta}
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </MagneticButton>

              <button
                onClick={() =>
                  document
                    .getElementById("birthday-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full border border-white/20 px-8 py-4 font-display text-sm font-semibold uppercase tracking-widest text-cream/70 transition hover:border-white/40 hover:text-cream"
              >
                {settings.heroCopy.skip}
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="hero-exit"
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <p className="max-w-xl font-display text-2xl font-semibold text-cream md:text-4xl">
              Some stories make more sense when you look backwards.
            </p>
            <p className="mt-4 font-hand text-2xl text-cream/60">
              Mine starts here.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}