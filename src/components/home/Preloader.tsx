"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";

const MAX = 2.2; // seconds cap

/**
 * Short cinematic arrival. Kept under ~2s, skipped if assets cached.
 */
export default function Preloader({
  onDone,
}: {
  onDone: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const sessionKey = "bday.loaded";
    const cached = sessionStorage.getItem(sessionKey);
    if (cached) {
      const t = window.setTimeout(() => {
        setProgress(100);
        setGone(true);
        onDone();
      }, 0);
      return () => window.clearTimeout(t);
    }
    const start = performance.now();
    const id = setInterval(() => {
      const t = (performance.now() - start) / 1000;
      const p = Math.min(100, (t / MAX) * 100 + Math.random() * 8);
      setProgress(Math.min(100, p));
    }, 60);
    const doneTimer = setTimeout(() => {
      clearInterval(id);
      setProgress(100);
      sessionStorage.setItem(sessionKey, "1");
      setTimeout(() => {
        setGone(true);
        onDone();
      }, 350);
    }, MAX * 1000);
    return () => {
      clearInterval(id);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <motion.span
            className="hero-27 font-display text-[19vw] font-black leading-none md:text-[9rem]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            27
          </motion.span>

          <motion.p
            className="mt-2 font-hand text-xl text-cream/70 md:text-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          >
            Loading memories…
          </motion.p>

          <div className="mt-8 h-[3px] w-48 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet via-magenta to-sunset"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}