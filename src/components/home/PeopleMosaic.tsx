"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * A heartfelt gratitude section for the people who have been part of Chinaza's story.
 * Intentionally text-only for now; no photo placeholders are shown.
 */
export default function PeopleMosaic() {
  return (
    <section id="gratitude" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-magenta/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="font-hand text-2xl text-cream/60">With all my heart</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-cream md:text-5xl">
            A Heart Full of <span className="text-magenta">Gratitude</span> ❤️
          </h2>
        </motion.div>

        <motion.div
          className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-base leading-8 text-cream/80 shadow-2xl shadow-black/10 sm:p-10 md:p-12 md:text-lg"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p>
            If there is one thing turning twenty-one has taught me, it is that some of life&apos;s
            greatest gifts are people.
          </p>

          <p>
            Twenty-one years of becoming, learning, stumbling, growing, and discovering who I am.
            And looking back, I know one thing for certain: my story would not be the same without
            the people who have been part of it.
          </p>

          <p>
            Some gave me roots, some gave me beautiful memories, some brought laughter into ordinary
            days, and some became comfort in ways they may never fully understand. Not every moment
            was extraordinary, but somehow, having you in my life made those moments worth remembering.
          </p>

          <p>
            <strong className="font-semibold text-cream">To my family:</strong> Thank you for the
            love, sacrifices, prayers, and countless little things that have helped shape the person
            I am becoming. You are part of the foundation upon which my story stands, and I carry
            that with a grateful heart.
          </p>

          <p>
            <strong className="font-semibold text-cream">
              To Clement, Esther, Oluchi, Chisom, Kelechi, Ella, Perpetua, Emeka, Cheta, Josh, and
              the Nnajis:
            </strong>{" "}
            Thank you for being part of my journey. For the memories, the laughter, the kindness,
            and every little way our lives have touched one another. You may not always realise what
            your presence has meant to me, but I am grateful our paths crossed, and that somewhere
            along the way, our stories became a part of one another&apos;s.
          </p>

          <p>
            I may not always find the perfect words to express what you mean to me, and perhaps I
            may never fully know how much some of our little moments have mattered. But when I look
            back on these twenty-one years, I know there will be memories that make me smile simply
            because you were there.
          </p>

          <p>
            As I step into this new chapter, I carry more than memories. I carry pieces of the people
            who have loved me, encouraged me, taught me, and made this journey a little more beautiful.
          </p>

          <p>
            This milestone may have my name on it, but the story carries traces of so many people
            who have touched my life.
          </p>

          <p className="border-t border-white/10 pt-6 text-center font-display text-xl font-semibold leading-relaxed text-cream md:text-2xl">
            My story may be mine to tell, but some of its most beautiful parts have you written all
            over them. And for that, I will always be grateful. ❤️
          </p>
        </motion.div>
      </div>
    </section>
  );
}
