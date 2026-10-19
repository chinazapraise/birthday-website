"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkle } from "@phosphor-icons/react";
import { EASE } from "@/lib/motion";

/** A gentle introduction to Nexora, placed after the personal story. */
export default function NexoraSection() {
  return (
    <section
      id="nexora"
      className="relative overflow-hidden px-6 py-24 md:py-32"
      aria-labelledby="nexora-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.18) 0%, rgba(245,201,123,0.10) 45%, transparent 72%)",
        }}
      />

      <motion.div
        className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] px-7 py-12 text-center shadow-2xl shadow-black/10 backdrop-blur-sm md:px-14 md:py-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
          <Sparkle size={22} weight="duotone" aria-hidden="true" />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-gold/80">
          A little something for what comes next
        </p>

        <h2
          id="nexora-heading"
          className="mt-4 font-display text-4xl font-bold leading-tight text-cream md:text-6xl"
        >
          Meet <span className="hero-27">Nexora.</span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-cream/60 md:text-base">
          Every new chapter begins with an idea. If you are curious about Nexora,
          take a look around and discover the platform for yourself.
        </p>

        <a
          href="https://mynexora.site"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-6 py-3 text-sm font-semibold text-cream transition duration-300 hover:border-gold/60 hover:bg-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#100d18]"
        >
          Explore Nexora
          <ArrowUpRight
            size={18}
            weight="bold"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </motion.div>
    </section>
  );
}
