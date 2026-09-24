"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Envelope, BookOpenText, Gift } from "@phosphor-icons/react";
import { EASE } from "@/lib/motion";

/**
 * The big emotional beat after 2026:
 * timeline stops → "THE STORY ISN'T OVER." → abstract future gradient →
 * "You're part of what happens next." → three participation cards.
 */
export default function PresentDayTransition() {
  return (
    <section className="relative overflow-hidden py-32 md:py-44">
      {/* future gradient horizon */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/60 to-transparent" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.28) 0%, rgba(244,63,158,0.16) 40%, transparent 70%)",
        }}
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.p
          className="font-display text-2xl font-bold text-cream md:text-4xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8 }}
        >
          And somehow, I’m 27.
        </motion.p>

        <motion.span
          className="mt-6 h-12 w-[2px] bg-gradient-to-b from-magenta to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ transformOrigin: "top" }}
        />

        <motion.p
          className="text-glow mt-10 font-display text-4xl font-black uppercase leading-tight text-cream md:text-6xl"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          The story
          <br />
          isn’t over.
        </motion.p>

        <motion.p
          className="mt-8 font-hand text-2xl text-cream/70 md:text-3xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        >
          You’re part of what happens next.
        </motion.p>

        {/* participation cards */}
        <motion.div
          className="mt-16 grid w-full gap-5 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.16 } } }}
        >
          <Card href="/wishes" icon={<Envelope size={26} weight="fill" />} accent="#f43f9e" title="Leave me a wish" sub="A few words, a prayer, a joke, whatever you want me to carry into 27." cta="Write a wish" />
          <Card href="/stories" icon={<BookOpenText size={26} weight="fill" />} accent="#22d3ee" title="Tell a Tomide story" sub="Everybody knows a different version of me. Tell me yours." cta="Add your chapter" />
          <Card href="/wishlist" icon={<Gift size={26} weight="fill" />} accent="#f5c97b" title="Get me something" sub="27 things I’d love. No pressure. But since you asked…" cta="See the wishlist" />
        </motion.div>
      </div>
    </section>
  );
}

function Card({
  href,
  icon,
  accent,
  title,
  sub,
  cta,
}: {
  href: string;
  icon: React.ReactNode;
  accent: string;
  title: string;
  sub: string;
  cta: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/25"
      style={{ boxShadow: `0 20px 70px -30px ${accent}77` }}
    >
      <span
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{ background: `${accent}22`, color: accent }}
      >
        {icon}
      </span>
      <h3 className="font-display text-xl font-bold text-cream">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-cream/55">{sub}</p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-widest transition-colors group-hover:gap-2.5"
        style={{ color: accent }}
      >
        {cta}
        <span aria-hidden>→</span>
      </Link>
    </motion.div>
  );
}