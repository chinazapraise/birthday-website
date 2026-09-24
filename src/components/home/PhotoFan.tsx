"use client";

import { motion } from "framer-motion";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { EASE_SOFT } from "@/lib/motion";

const PHOTOS = [
  { label: "PHOTO PLACEHOLDER · THE EARLY DAYS", tint: "#3b2f5f", rotate: -11, dx: "-4vmin", dy: "-1vmin", z: 1 },
  { label: "PHOTO PLACEHOLDER · THE MIDDLE", tint: "#2f3b5f", rotate: 0, dy: "-2vmin", z: 3 },
  { label: "PHOTO PLACEHOLDER · THE NOW", tint: "#3b1f4f", rotate: 11, dx: "4vmin", dy: "-1vmin", z: 2 },
];

/**
 * Three overlapping photo placeholders that begin stacked dead-centre,
 * like photographs pulled from the same envelope, then roll and fan out on
 * scroll: left tilts left, middle stays straight and on top, right tilts right.
 */
export default function PhotoFan() {
  return (
    <section className="relative pt-4 pb-8 md:pt-8 md:pb-12" aria-label="Photo fan">
      <div className="relative mx-auto h-[54vmin] max-w-[36rem]">
        {PHOTOS.map((p, i) => (
          <motion.div
            key={p.label}
            className="absolute left-1/2 top-1/2 w-[34vmin] md:w-[30vmin]"
            style={{ zIndex: p.z }}
            initial={{ x: "-50%", y: "-50%", rotate: 0, opacity: 0, scale: 0.62 }}
            whileInView={{
              x: p.dx ? `calc(-50% ${p.dx.startsWith("-") ? "" : "+"} ${p.dx})` : "-50%",
              y: p.dy ? `calc(-50% ${p.dy.startsWith("-") ? "" : "+"} ${p.dy})` : "-50%",
              rotate: p.rotate,
              opacity: 1,
              scale: 1,
            }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              x: { duration: 0.9, ease: EASE_SOFT },
              y: { duration: 0.9, ease: EASE_SOFT },
              rotate: { duration: 0.9, ease: EASE_SOFT },
              scale: { type: "spring", stiffness: 240, damping: 16, mass: 0.7 },
              opacity: { duration: 0.35 },
              delay: 0.14 * i,
            }}
            whileHover={{ y: -8, rotate: p.rotate * 0.3 }}
          >
            <PhotoPlaceholder
              label={p.label}
              aspect="4:5"
              tint={p.tint}
              className="shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}