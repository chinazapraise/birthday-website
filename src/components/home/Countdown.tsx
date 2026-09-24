"use client";

import { motion } from "framer-motion";
import { useCountdown, CLOCK_UNITS } from "@/lib/countdown";
import { Cake } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { fireConfetti } from "@/components/effects/ConfettiLayer";

/**
 * Large countdown with rolling/flip numbers. States:
 * before → "27 begins in…"; today → "IT'S MY BIRTHDAY 🎂"; after → "27 is underway."
 */
export default function Countdown({
  birthdayISO,
  timezone,
  compact = false,
}: {
  birthdayISO: string;
  timezone: string;
  compact?: boolean;
}) {
  const cd = useCountdown(birthdayISO, timezone);
  const celebratedRef = useRef(false);

  useEffect(() => {
    if (cd.state === "today" && !celebratedRef.current) {
      celebratedRef.current = true;
      fireConfetti("rain");
    }
  }, [cd.state]);

  if (cd.state === "after") {
    return (
      <div className="text-center">
        <p className="font-hand text-2xl text-cream/70">
          27 is officially underway.
        </p>
      </div>
    );
  }

  if (cd.state === "today") {
    return (
      <motion.div
        className="flex items-center justify-center gap-3"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Cake size={28} className="text-magenta" />
        <p className="font-display text-3xl font-black tracking-tight text-gold md:text-5xl">
          IT’S MY BIRTHDAY
        </p>
        <Cake size={28} className="text-magenta" />
      </motion.div>
    );
  }

  return (
    <div className="text-center">
      {!compact && (
        <p className="mb-6 font-hand text-2xl text-cream/70">
          {cd.days === 0 ? "Tonight." : "27 begins in…"}
        </p>
      )}
      <div className="inline-flex items-start gap-2 rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-5 shadow-[0_0_60px_rgba(139,92,246,0.15)] backdrop-blur-sm md:gap-3 md:px-8">
        {CLOCK_UNITS.map((u, i) => {
          const val = cd[u.key];
          const pad = String(val).padStart(2, "0");
          return (
            <div key={u.key} className="flex items-start gap-2 md:gap-3">
              <motion.div
                className="flex flex-col items-center"
                animate={{ opacity: 1 }}
                key={pad}
                initial={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-display text-4xl font-black tabular-nums text-cream md:text-7xl">
                  {pad}
                </span>
                <span className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-cream/40 md:text-xs">
                  {u.label}
                </span>
              </motion.div>
              {i < CLOCK_UNITS.length - 1 && (
                <span className="mt-1 font-display text-3xl font-black text-magenta/70 md:text-6xl">
                  :
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}