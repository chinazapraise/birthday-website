"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ImageSquare } from "@phosphor-icons/react";
import type { YearPhoto } from "@/lib/types";

interface PhotoFanProps {
  photos?: YearPhoto[];
}

interface FanSlotConfig {
  index: number;
  tint: string;
}

const SLOTS: FanSlotConfig[] = [
  { index: 0, tint: "#3b2f5f" },
  { index: 1, tint: "#2f3b5f" },
  { index: 2, tint: "#3b1f4f" },
];

/**
 * Three opening photographs that anchor at the bottom center and fan out
 * widely as the visitor scrolls down from the hero, opening like a handheld fan
 * so that each of the three pictures is completely obvious and visible.
 */
export default function PhotoFan({ photos = [] }: PhotoFanProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 95%", "center 55%"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    restDelta: 0.001,
  });

  // Left card transforms
  const leftX = useTransform(progress, [0, 1], [0, isWide ? -210 : -95]);
  const leftRotate = useTransform(progress, [0, 1], [0, isWide ? -22 : -17]);
  const leftY = useTransform(progress, [0, 1], [0, isWide ? 8 : 6]);

  // Center card transforms
  const midY = useTransform(progress, [0, 1], [0, isWide ? -18 : -12]);
  const midScale = useTransform(progress, [0, 1], [0.98, 1.04]);

  // Right card transforms
  const rightX = useTransform(progress, [0, 1], [0, isWide ? 210 : 95]);
  const rightRotate = useTransform(progress, [0, 1], [0, isWide ? 22 : 17]);
  const rightY = useTransform(progress, [0, 1], [0, isWide ? 8 : 6]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-visible px-4 pt-1 pb-10 sm:pb-14 md:pt-3 md:pb-20"
      aria-label="Story opening photo fan"
    >
      {/* Glow backdrop behind fan */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-[90vw] max-w-2xl rounded-full bg-gradient-to-r from-violet/20 via-magenta/15 to-sunset/20 blur-3xl opacity-60" />

      <div className="relative mx-auto flex h-[280px] w-full max-w-4xl items-end justify-center sm:h-[350px] md:h-[420px]">
        {SLOTS.map((slot) => {
          const photo = photos[slot.index];
          const isLeft = slot.index === 0;
          const isMid = slot.index === 1;
          const isRight = slot.index === 2;

          let motionStyle = {};
          let zIndex = 1;

          if (isLeft) {
            motionStyle = { x: leftX, rotate: leftRotate, y: leftY };
            zIndex = 2;
          } else if (isMid) {
            motionStyle = { y: midY, scale: midScale };
            zIndex = 5;
          } else if (isRight) {
            motionStyle = { x: rightX, rotate: rightRotate, y: rightY };
            zIndex = 3;
          }

          return (
            <motion.div
              key={slot.index}
              className="absolute bottom-2 left-1/2 w-[150px] sm:w-[210px] md:w-[245px] -translate-x-1/2 origin-bottom cursor-pointer"
              style={{
                ...motionStyle,
                zIndex,
                transformOrigin: "bottom center",
              }}
              whileHover={{
                scale: 1.08,
                zIndex: 20,
                transition: { duration: 0.2 },
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/20 bg-ink/90 shadow-[0_20px_50px_rgba(0,0,0,0.65)] transition-shadow duration-300 hover:shadow-[0_25px_60px_rgba(244,63,158,0.35)]">
                {photo?.url ? (
                  <img
                    src={photo.url}
                    alt="Photograph"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center border border-white/10"
                    style={{ backgroundColor: slot.tint }}
                  >
                    <ImageSquare size={26} weight="thin" className="text-white/25" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}