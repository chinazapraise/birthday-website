"use client";

import { useEffect, useRef } from "react";
import { magneticSpring, reducedMotionQuery } from "@/lib/motion";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Magnetic button wrapper — only on devices capable of hover.
 * Uses motion values, never re-render-driving state.
 */
export default function MagneticButton({
  children,
  className,
  strength = 0.35,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, magneticSpring);
  const sy = useSpring(my, magneticSpring);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(reducedMotionQuery).matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const move = (e: PointerEvent) => {
      const r = el!.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      mx.set(x * strength);
      my.set(y * strength);
    };
    const leave = () => {
      mx.set(0);
      my.set(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [mx, my, strength]);

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={className}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.div>
  );
}