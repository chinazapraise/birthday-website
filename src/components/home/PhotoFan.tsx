"use client";

import { motion } from "framer-motion";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { EASE } from "@/lib/motion";

const PHOTOS = [
  { label: "PHOTO PLACEHOLDER · THE EARLY DAYS", tint: "#3b2f5f", rotate: -8, dx: "-3vmin" },
  { label: "PHOTO PLACEHOLDER · THE MIDDLE", tint: "#2f3b5f", rotate: 0, dy: "-1.5vmin" },
  { label: "PHOTO PLACEHOLDER · THE NOW", tint: "#3b1f4f", rotate: 8, dx: "3vmin" },
];

/**
 * Three overlapping photo placeholders, all pivoting from the same center
 * point. They start stacked flat, then smoothly fan outward on scroll:
 * left tilts left, middle stays straight, right tilts right.
 */
export default function PhotoFan() {
  return (
    <section className="relative py-24 md:py-32" aria-label="Photo fan">
      <div className="relative mx-auto h-[54vmin] max-w-[36rem]">
        {PHOTOS.map((p, i) => (
          <motion.div
            key={p.label}
            className="absolute left-1/2 top-1/2 w-[34vmin] md:w-[30vmin]"
            initial={{ x: "-50%", y: "-50%", rotate: 0, opacity: 0, scale: 0.92 }}
            whileInView={{
              x: p.dx ? `calc(-50% ${p.dx.startsWith("-") ? "" : "+"} ${p.dx})` : "-50%",
              y: p.dy ? `calc(-50% ${p.dy.startsWith("-") ? "" : "+"} ${p.dy})` : "-50%",
              rotate: p.rotate,
              opacity: 1,
              scale: 1,
            }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15 * i, ease: EASE }}
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