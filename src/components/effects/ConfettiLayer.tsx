"use client";

import { useEffect, useRef, useState } from "react";

export type ConfettiStyle = "burst" | "rain" | "grand";

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

const COLORS = ["#8b5cf6", "#f43f9e", "#ff7a3d", "#22d3ee", "#f5c97b", "#ec4899"];

export const CONFETTI_EVENT = "birthday:confetti";

/**
 * Event-driven, short-lived confetti. Dispatch `birthday:confetti` with
 * detail { motion: "burst" | "rain" } to trigger. Respects reduced motion.
 */
export default function ConfettiLayer() {
  const [parts, setParts] = useState<Particle[]>([]);
  const [isRain, setIsRain] = useState(false);
  const rafRef = useRef(0);
  const hasParts = parts.length > 0;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spawn = (motion: ConfettiStyle) => {
      setIsRain(motion === "rain");
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (motion === "grand") {
        const origins: Array<[number, number]> = [
          [vw * 0.2, vh * 0.35],
          [vw * 0.5, vh * 0.3],
          [vw * 0.8, vh * 0.35],
          [vw * 0.35, vh * 0.6],
          [vw * 0.65, vh * 0.6],
          [vw * 0.5, vh * 0.5],
          [vw * 0.12, vh * 0.55],
          [vw * 0.88, vh * 0.55],
        ];
        setParts(
          Array.from({ length: 240 }, (_, id) => {
            const [ox, oy] = origins[Math.floor(Math.random() * origins.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = 6 + Math.random() * 10;
            const r = Math.random();
            return {
              id,
              x: ox,
              y: oy,
              size: 6 + Math.random() * 10,
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
              rotation: Math.random() * 360,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 3,
              shape: r > 0.45 ? "circle" : "rect",
            };
          }),
        );
        return;
      }
      const count = motion === "rain" ? 90 : 44;
      setParts(
        Array.from({ length: count }, (_, id) => {
          if (motion === "rain") {
            const r = Math.random();
            return {
              id,
              x: Math.random() * vw,
              y: -20,
              size: 6 + Math.random() * 8,
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
              rotation: Math.random() * 360,
              vx: (Math.random() - 0.5) * 1.5,
              vy: 2 + Math.random() * 3.5,
              shape: r > 0.7 ? "circle" : "rect",
            };
          }
          const angle = Math.random() * Math.PI * 2;
          const speed = 4 + Math.random() * 7;
          const r = Math.random();
          return {
            id,
            x: vw / 2,
            y: vh / 2,
            size: 6 + Math.random() * 9,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rotation: Math.random() * 360,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            shape: r > 0.6 ? "circle" : "rect",
          };
        }),
      );
    };

    const onEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      spawn(detail?.motion ?? "burst");
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
    const duration = 2200;
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
            vy: isRain ? p.vy : p.vy + 0.25,
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

export function fireConfetti(motion: ConfettiStyle = "burst") {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.dispatchEvent(new CustomEvent(CONFETTI_EVENT, { detail: { motion } }));
}