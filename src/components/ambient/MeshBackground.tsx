"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient mesh background: slow-drifting gradient orbs behind everything.
 * Layer 1 of the motion system (ambient). Pure rAF, honours reduced motion.
 */
export default function MeshBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    let raf = 0;
    let t = 0;
    const step = () => {
      t += 0.0015;
      el.style.setProperty("--dx1", `${Math.sin(t) * 40}px`);
      el.style.setProperty("--dy1", `${Math.cos(t * 1.2) * 40}px`);
      el.style.setProperty("--dx2", `${Math.sin(t * 0.8 + 2) * 50}px`);
      el.style.setProperty("--dy2", `${Math.cos(t * 0.6 + 4) * 50}px`);
      el.style.setProperty("--dx3", `${Math.sin(t * 1.4 + 1) * 30}px`);
      el.style.setProperty("--dy3", `${Math.cos(t * 1.1 + 3) * 30}px`);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 15% 10%, #140d2b 0%, transparent 55%), radial-gradient(110% 90% at 85% 20%, #2a0f24 0%, transparent 55%), radial-gradient(120% 100% at 50% 100%, #160f30 0%, transparent 60%)",
      }}
    >
      <div
        className="absolute h-[42vmax] w-[42vmax] rounded-full blur-[120px]"
        style={{
          background: "rgba(139,92,246,0.22)",
          transform: "translate(var(--dx1,0), var(--dy1,0))",
          top: "-10vmax",
          left: "-8vmax",
        }}
      />
      <div
        className="absolute h-[38vmax] w-[38vmax] rounded-full blur-[130px]"
        style={{
          background: "rgba(244,63,158,0.14)",
          transform: "translate(var(--dx2,0), var(--dy2,0))",
          bottom: "-12vmax",
          right: "-8vmax",
        }}
      />
      <div
        className="absolute h-[30vmax] w-[30vmax] rounded-full blur-[110px]"
        style={{
          background: "rgba(255,122,61,0.12)",
          transform: "translate(var(--dx3,0), var(--dy3,0))",
          top: "45%",
          left: "-15vmax",
        }}
      />
    </div>
  );
}