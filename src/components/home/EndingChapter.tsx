"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { EASE } from "@/lib/motion";
import Countdown from "@/components/home/Countdown";

/**
 * Final chapter: "Here's to 27." + gratitude + footer.
 * Contains the birthday countdown anchor for skip-to-birthday.
 */
export default function EndingChapter({ settings }: { settings: SiteSettings }) {
  return (
    <section
      id="birthday-section"
      className="relative overflow-hidden pb-16 pt-32 md:pt-44"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div
        className="pointer-events-none absolute left-1/2 top-24 h-[40vmax] w-[40vmax] -translate-x-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(245,201,123,0.25) 0%, rgba(244,63,158,0.12) 45%, transparent 70%)",
        }}
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.h2
          className="hero-27 font-display text-6xl font-black leading-none md:text-8xl"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: EASE }}
        >
          Here’s to
          <br />
          27.
        </motion.h2>

        <motion.p
          className="mt-10 max-w-xl leading-relaxed text-cream/65 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          {settings.endingGratitude}
        </motion.p>

        {/* Countdown */}
        <motion.div
          className="mt-16 w-full"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        >
          <Countdown
            birthdayISO={settings.birthdayDate}
            timezone={settings.birthdayTimezone}
          />
        </motion.div>

        <motion.p
          className="mt-8 font-hand text-xl text-cream/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          The story isn’t over.
        </motion.p>
      </div>

      {/* Footer */}
      <footer className="mx-auto mt-28 max-w-6xl border-t border-white/10 px-6 pt-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-sm font-bold tracking-[0.18em] text-cream">
              TOMIDE<span className="text-magenta"> / </span>
              <span className="text-violet">27</span>
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cream/40">
              The Story So Far
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/55">
            <Link className="transition-colors hover:text-cream" href="/wishes">
              Wishes
            </Link>
            <Link className="transition-colors hover:text-cream" href="/stories">
              Your Stories
            </Link>
            <Link className="transition-colors hover:text-cream" href="/gallery">
              Gallery
            </Link>
            <Link className="transition-colors hover:text-cream" href="/wishlist">
              Wishlist
            </Link>
          </nav>

          <div className="flex items-center gap-4 text-xs text-cream/35">
            <span>2016 — 2026 · Eleven years</span>
            {settings.social?.instagram && (
              <a
                href={settings.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-cream/70"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
        <p className="mt-10 pb-2 text-center font-hand text-2xl text-cream/40">
          You’re part of what happens next.
        </p>
      </footer>
    </section>
  );
}