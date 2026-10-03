"use client";

import { motion } from "framer-motion";
import { useCountdown, CLOCK_UNITS } from "@/lib/countdown";
import { Cake } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { fireConfetti } from "@/components/effects/ConfettiLayer";

/**
 * Large countdown with rolling/flip numbers. States:
 * before → "27 begins in…"; today → "IT'S MY BIRTHDAY 🎂".
 * Rolls forward to the next year's birthday once the day passes —
 * never settles into a permanent "after" state.
 */
export default function Countdown({
  birthdayISO,
  timezone,
  mode,
  compact = false,
}: {
  birthdayISO: string;
  timezone: string;
  mode?: "countdown" | "birthday" | "after";
  compact?: boolean;
}) {
  const cd = useCountdown(birthdayISO, timezone);
  const celebratedRef = useRef(false);

  const state = mode && mode !== "countdown" ? mode : cd.state;

  useEffect(() => {
    if (state === "today" && !celebratedRef.current) {
      celebratedRef.current = true;
      fireConfetti("rain", { balloons: 3 });
    }
  }, [state]);

  if (state === "today" || state === "after") {
    return (
      <motion.div
        className="flex flex-col items-center justify-center gap-3 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <Cake size={28} className="text-magenta" />
          <p className="font-display text-2xl font-black tracking-tight text-gold md:text-5xl">
            IT’S MY BIRTHDAY
          </p>
          <Cake size={28} className="text-magenta" />
        </div>
        <p className="font-hand text-2xl text-cream/80 md:text-3xl">
          27 is officially underway.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="text-center">
      {!compact && (
        <p className="mb-4 font-hand text-xl text-cream/70 md:mb-6 md:text-2xl">
          {cd.days === 0 ? "Tonight." : "27 begins in…"}
        </p>
      )}
      <div className="inline-flex items-center justify-center gap-1.5 rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 shadow-[0_0_60px_rgba(139,92,246,0.15)] backdrop-blur-sm sm:gap-3 sm:px-6 sm:py-5 md:gap-4 md:px-8 md:py-6 lg:gap-5">
        {CLOCK_UNITS.map((u, i) => {
          const val = cd[u.key];
          const pad = String(val).padStart(2, "0");
          return (
            <div
              key={u.key}
              className="flex items-center gap-1.5 sm:gap-3 md:gap-4 lg:gap-5"
            >
              <motion.div
                className="flex flex-col items-center"
                animate={{ opacity: 1 }}
                key={pad}
                initial={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-display text-3xl font-black tabular-nums text-cream sm:text-5xl md:text-6xl lg:text-7xl">
                  {pad}
                </span>
                <span className="mt-1 text-[0.55rem] uppercase tracking-[0.25em] text-cream/40 sm:text-[0.65rem] md:text-xs">
                  {u.label}
                </span>
              </motion.div>
              {i < CLOCK_UNITS.length - 1 && (
                <span className="mb-3.5 font-display text-2xl font-black text-magenta select-none sm:mb-4 sm:text-4xl md:mb-5 md:text-5xl lg:text-6xl">
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