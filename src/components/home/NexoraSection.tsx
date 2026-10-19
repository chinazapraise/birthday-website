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
          Learn. Grow. Start where you are.
        </p>

        <h2
          id="nexora-heading"
          className="mt-4 font-display text-4xl font-bold leading-tight text-cream md:text-6xl"
        >
          Meet <span className="hero-27">Nexora.</span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-cream/65 md:text-base">
          Nexora brings together bite-sized lessons and ideas around money,
          careers, opportunities, AI, personal branding, finding clients or jobs,
          relationships, and intentional living. It is about helping you learn
          things you can put to use in the life you are building.
        </p>

        <div className="mx-auto mt-7 max-w-2xl rounded-2xl border border-white/10 bg-black/10 px-6 py-6 text-left md:px-8">
          <p className="font-display text-xl font-semibold text-cream md:text-2xl">
            Why I wanted to share it with you
          </p>
          <p className="mt-3 text-sm leading-7 text-cream/65 md:text-base">
            My own journey has been teaching me not to wait until I have
            everything figured out before I begin. I am learning to keep
            becoming, stretch myself, and take the first step—even when
            something feels unfamiliar. Building this website is one example
            of what can happen when I give myself permission to start.
          </p>
          <p className="mt-3 text-sm leading-7 text-cream/65 md:text-base">
            That is why I want you to explore Nexora too. I found an opportunity
            worth sharing, and I believe you deserve the chance to see what you
            can learn from it and how it might fit into your own journey.
          </p>
        </div>

        <div className="mx-auto mt-7 max-w-xl rounded-2xl border border-gold/30 bg-gold/[0.08] px-6 py-6">
          <p className="text-sm leading-7 text-cream/70 md:text-base">
            Nexora&apos;s launch price is <span className="font-semibold text-cream">₦25,000</span>,
            but you can get access at a discounted price of{" "}
            <span className="font-display text-2xl font-bold text-gold md:text-3xl">₦15,000</span>.
          </p>
          <p className="mt-3 text-sm leading-7 text-cream/65 md:text-base">
            Click the link below to explore Nexora and learn more about what it offers.
            If you are interested, send me a DM and I will be happy to talk you through it.
          </p>
        </div>

        <a
          href="https://mynexora.site"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-6 py-3 text-sm font-semibold text-cream transition duration-300 hover:border-gold/60 hover:bg-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#100d18]"
        >
          Explore Nexora — Start Your Next Chapter
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
