"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

/**
 * Persistent story progress — active year along a line while on homepage.
 * Desktop line + mobile floating year pill.
 */
export default function StoryProgress() {
  const [active, setActive] = useState<number>(0);
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(
        YEARS.length - 1,
        Math.max(0, Math.round(v * (YEARS.length - 1))),
      );
      setActive(idx);
    });
  }, [scrollYProgress]);

  return (
    <>
      {/* Desktop line */}
      <div className="fixed right-6 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-2 lg:flex">
        <span className="mb-1 font-hand text-lg text-cream/60">
          {YEARS[active]}
        </span>
        <div className="relative h-56 w-[3px] rounded-full bg-white/10">
          <motion.div
            className="absolute left-0 top-0 w-[3px] rounded-full bg-gradient-to-b from-violet via-magenta to-sunset"
            style={{ scaleY: spring, transformOrigin: "top" }}
          />
          {YEARS.map((y, i) => (
            <span
              key={y}
              className={`absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full transition-all duration-300 ${
                i <= active ? "bg-magenta" : "bg-white/25"
              }`}
              style={{ top: `${(i / (YEARS.length - 1)) * 100}%` }}
            />
          ))}
        </div>
        <span className="mt-1 font-hand text-lg text-violet">now</span>
      </div>

      {/* Mobile year pill */}
      <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 lg:hidden">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
          <span className="text-[0.7rem] uppercase tracking-[0.2em] text-cream/50">
            Chapter
          </span>
          <motion.span
            key={active}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-base font-bold text-cream"
          >
            {YEARS[active]}
          </motion.span>
          <span className="text-magenta">↓</span>
        </div>
      </div>
    </>
  );
}