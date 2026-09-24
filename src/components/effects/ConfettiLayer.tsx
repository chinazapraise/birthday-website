"use client";

import { useEffect, useRef, useState } from "react";
import { reducedMotionQuery } from "@/lib/motion";

export type ConfettiStyle = "burst" | "rain" | "grand";

export interface ConfettiOptions {
  /** burst origin X (viewport px) — jittered a little so each shot is unique */
  x?: number;
  /** burst origin Y (viewport px) — jittered a little so each shot is unique */
  y?: number;
  /** how many balloons to spawn alongside the confetti */
  balloons?: number;
  /** override the particle count for this shot */
  count?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  vx: number;
  vy: number;
  shape: "rect" | "circle";
}

interface Balloon {
  id: number;
  left: number; // 0-100 (% of viewport)
  size: number; // px
  color: string;
  dur: number; // rise duration (s)
  delay: number; // launch delay (s)
  drift: number; // horizontal sway (px)
  tilt: number; // degrees
}

const COLORS = [
  "#8b5cf6",
  "#a78bfa",
  "#f43f9e",
  "#ec4899",
  "#ff7a3d",
  "#22d3ee",
  "#38bdf8",
  "#f5c97b",
  "#fbbf24",
  "#f7efdf",
];

const BALLOON_COLORS = [
  "#8b5cf6",
  "#f43f9e",
  "#ff7a3d",
  "#22d3ee",
  "#f5c97b",
  "#ec4899",
  "#a78bfa",
  "#fbbf24",
];

export const CONFETTI_EVENT = "birthday:confetti";

let balloonSeq = 0;

/**
 * Event-driven celebration layer. Dispatch `birthday:confetti` with detail
 * { motion, x?, y?, balloons?, count? } to trigger. Respects reduced motion.
 *
 * Tiers:
 *   grand  — abundant multi-origin full-screen burst (+ balloons by default)
 *   rain   — celebratory fall, good for "success" moments
 *   burst  — a pop around an origin (default center), small/quick
 */
export default function ConfettiLayer() {
  const [parts, setParts] = useState<Particle[]>([]);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [isRain, setIsRain] = useState(false);
  const rafRef = useRef(0);
  const hasParts = parts.length > 0;

  useEffect(() => {
    if (window.matchMedia(reducedMotionQuery).matches) return;

    const spawnBalloons = (count: number) => {
      if (!count) return;
      const batch: Balloon[] = Array.from({ length: count }, () => ({
        id: ++balloonSeq,
        left: 4 + Math.random() * 92,
        size: 44 + Math.random() * 42,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        dur: 7 + Math.random() * 5,
        delay: Math.random() * 2.2,
        drift: (Math.random() - 0.5) * 150,
        tilt: (Math.random() - 0.5) * 24,
      }));
      setBalloons((prev) => [...prev, ...batch]);
      batch.forEach((b) => {
        window.setTimeout(() => {
          setBalloons((prev) => prev.filter((k) => k.id !== b.id));
        }, (b.dur + b.delay + 1.5) * 1000);
      });
    };

    const spawn = (motion: ConfettiStyle, opts: ConfettiOptions = {}) => {
      setIsRain(motion === "rain");
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (motion === "grand") {
        const origins: Array<[number, number]> = [
          [vw * 0.2, vh * 0.35],
          [vw * 0.5, vh * 0.28],
          [vw * 0.8, vh * 0.35],
          [vw * 0.35, vh * 0.6],
          [vw * 0.65, vh * 0.6],
          [vw * 0.5, vh * 0.5],
          [vw * 0.12, vh * 0.55],
          [vw * 0.88, vh * 0.55],
        ];
        const count = Math.round(210 + Math.random() * 80);
        setParts(
          Array.from({ length: count }, (_, id) => {
            const [ox, oy] = origins[Math.floor(Math.random() * origins.length)];
            const jx = ox + (Math.random() - 0.5) * 60;
            const jy = oy + (Math.random() - 0.5) * 60;
            const angle = Math.random() * Math.PI * 2;
            const speed = 6 + Math.random() * 11;
            const r = Math.random();
            return {
              id,
              x: jx,
              y: jy,
              size: 6 + Math.random() * 11,
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
              rotation: Math.random() * 360,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 3.5 - Math.random() * 2,
              shape: r > 0.45 ? "circle" : "rect",
            };
          }),
        );
        spawnBalloons(opts.balloons ?? 10);
        return;
      }

      if (motion === "rain") {
        const count = opts.count ?? Math.round(78 + Math.random() * 44);
        setParts(
          Array.from({ length: count }, (_, id) => {
            const r = Math.random();
            return {
              id,
              x: Math.random() * vw,
              y: -30 + Math.random() * -60,
              size: 6 + Math.random() * 9,
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
              rotation: Math.random() * 360,
              vx: (Math.random() - 0.5) * 1.8,
              vy: 2.2 + Math.random() * 3.6,
              shape: r > 0.7 ? "circle" : "rect",
            };
          }),
        );
        spawnBalloons(opts.balloons ?? 0);
        return;
      }

      // burst — a pop from an origin (jittered), or the center if none given
      const ox = (opts.x ?? vw / 2) + (Math.random() - 0.5) * 26;
      const oy = (opts.y ?? vh / 2) + (Math.random() - 0.5) * 26;
      const count = opts.count ?? Math.round(34 + Math.random() * 30);
      setParts(
        Array.from({ length: count }, (_, id) => {
          const angle = Math.random() * Math.PI * 2;
          const speed = 4 + Math.random() * 8;
          const r = Math.random();
          return {
            id,
            x: ox,
            y: oy,
            size: 5 + Math.random() * 9,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rotation: Math.random() * 360,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5 - Math.random() * 2.5,
            shape: r > 0.6 ? "circle" : "rect",
          };
        }),
      );
      spawnBalloons(opts.balloons ?? 0);
    };

    const onEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail ?? {};
      spawn(detail?.motion ?? "burst", detail);
    };
    window.addEventListener(CONFETTI_EVENT, onEvent);
    return () => {
      window.removeEventListener(CONFETTI_EVENT, onEvent);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hasParts) return;
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const duration = 2400;
    const tick = (t: number) => {
      if (t - start > duration) {
        setParts([]);
        return;
      }
      setParts((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: isRain ? p.vy : p.vy + 0.24,
            rotation: p.rotation + (p.vx > 0 ? 6 : -6),
          }))
          .filter((p) => p.y < window.innerHeight + 40),
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hasParts, isRain]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[85] overflow-hidden"
      aria-hidden
    >
      {/* balloons rise behind the confetti */}
      {balloons.map((b) => (
        <span
          key={b.id}
          className="balloon"
          style={
            {
              left: `${b.left}%`,
              "--b-size": `${b.size}px`,
              "--b-drift": `${b.drift}px`,
              "--b-dur": `${b.dur}s`,
              "--b-delay": `${b.delay}s`,
              "--b-tilt": `${b.tilt}deg`,
              "--b-color": b.color,
            } as React.CSSProperties
          }
        >
          <span className="balloon-body" />
          <span className="balloon-string" />
        </span>
      ))}

      {parts.map((p) => (
        <span
          key={p.id}
          className="absolute block"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.shape === "circle" ? p.size : p.size * 0.6,
            borderRadius: p.shape === "circle" ? "50%" : 2,
            background: p.color,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function fireConfetti(
  motion: ConfettiStyle = "burst",
  opts: ConfettiOptions = {},
) {
  if (typeof window === "undefined") return;
  if (window.matchMedia(reducedMotionQuery).matches) return;
  window.dispatchEvent(
    new CustomEvent(CONFETTI_EVENT, { detail: { motion, ...opts } }),
  );
}

/** Small quick burst that pops right around a tapped/clicked element. */
export function fireConfettiAtPoint(
  e: { clientX: number; clientY: number },
  count = 20,
) {
  fireConfetti("burst", { x: e.clientX, y: e.clientY, count });
}