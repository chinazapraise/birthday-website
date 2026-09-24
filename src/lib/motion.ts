import type { Variants } from "framer-motion";

/*
 * CENTRAL MOTION CONFIGURATION
 * One place for durations / easings / staggers so the whole site moves
 * with one voice. Premium cubic-bezier + springs, not bouncy cartoon.
 */

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

export const DUR = {
  fast: 0.25,
  base: 0.5,
  slow: 0.8,
  cinematic: 1.1,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DUR.base,
      ease: EASE,
      delay: i * 0.08,
    },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: DUR.base, ease: "easeOut", delay: i * 0.08 },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: DUR.base, ease: EASE, delay: i * 0.08 },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const lineReveal: Variants = {
  hidden: { opacity: 0, y: "110%" },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: "0%",
    transition: { duration: DUR.slow, ease: EASE, delay: i * 0.12 },
  }),
};

/** Split a headline into pieces that each rise in — used for year/chapter titles. */
export function splitWords(text: string): string[] {
  return text.split(" ");
}

export const wordsReveal: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const wordItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE, delay: i * 0.06 },
  }),
};

export const magneticSpring = {
  type: "spring",
  stiffness: 150,
  damping: 15,
  mass: 0.1,
} as const;

export const reducedMotionQuery =
  "(prefers-reduced-motion: reduce)";