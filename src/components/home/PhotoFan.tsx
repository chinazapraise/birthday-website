"use client";

import { motion } from "framer-motion";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { EASE_SOFT } from "@/lib/motion";

const PHOTOS = [
  { label: "PHOTO PLACEHOLDER · THE EARLY DAYS", tint: "#3b2f5f", rotate: -8, dx: "-3vmin" },
  { label: "PHOTO PLACEHOLDER · THE MIDDLE", tint: "#2f3b5f", rotate: 0, dy: "-1.5vmin" },
  { label: "PHOTO PLACEHOLDER · THE NOW", tint: "#3b1f4f", rotate: 8, dx: "3vmin" },
];

/**
 * Three overlapping photo placeholders that begin stacked dead-centre,
 * like photographs pulled from the same envelope, then pop and fan out on
 * scroll: left tilts left, middle stays straight, right tilts right.
 */
export default function PhotoFan() {
  return (
    <section className="relative py-12 md:py-20" aria-label="Photo fan">
      <div className="relative mx-auto h-[54vmin] max-w-[36rem]">
        {PHOTOS.map((p, i) => (
          <motion.div
            key={p.label}
            className="absolute left-1/2 top-1/2 w-[34vmin] md:w-[30vmin]"
            initial={{ x: "-50%", y: "-50%", rotate: 0, opacity: 0, scale: 0.72 }}
            whileInView={{
              x: p.dx ? `calc(-50% ${p.dx.startsWith("-") ? "" : "+"} ${p.dx})` : "-50%",
              y: p.dy ? `calc(-50% ${p.dy.startsWith("-") ? "" : "+"} ${p.dy})` : "-50%",
              rotate: p.rotate,
              opacity: 1,
              scale: [0.72, 1.08, 1],
            }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.75,
              delay: 0.08 * i,
              ease: EASE_SOFT,
            }}
            whileHover={{ y: -8, rotate: p.rotate * 0.4 }}
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