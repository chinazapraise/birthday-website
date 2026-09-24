"use client";

import { useStories } from "@/lib/hooks";
import { useState } from "react";
import { motion } from "framer-motion";
import type { CommunityStory } from "@/lib/types";
import StoryReader from "@/components/stories/StoryReader";
import { EASE } from "@/lib/motion";
import { formatDate } from "@/lib/utils";

/**
 * Editorial gallery — Polaroid / book-page motif, opens an immersive reader.
 */
export default function StoryGallery() {
  const { stories } = useStories();
  const [open, setOpen] = useState<CommunityStory | null>(null);

  if (stories.length === 0) {
    return (
      <p className="py-14 text-center font-hand text-2xl text-cream/50">
        Apparently everyone is still gathering evidence 😂. Be the first.
      </p>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((s, i) => (
            <motion.article
              key={s.id}
              className="group relative cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-acid/40"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
              onClick={() => setOpen(s)}
              style={{ rotate: [-1.5, 1, -0.5, 1.5][i % 4] + "deg" }}
              whileHover={{ rotate: 0, y: -4 }}
            >
              {s.year && (
                <span className="mb-3 inline-block rounded-full bg-acid/15 px-3 py-1 font-mono text-xs font-bold text-acid">
                  {s.year}
                </span>
              )}
              <h3 className="font-display text-xl font-bold leading-tight text-cream">
                {s.title}
              </h3>
              <p className="mt-1 font-hand text-lg text-cream/50">
                — {s.senderName}
              </p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cream/60">
                {s.body}
              </p>
              <p className="mt-4 text-xs text-cream/35">
                {s.meetingContext} · {formatDate(s.createdAt)}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {open && <StoryReader story={open} onClose={() => setOpen(null)} />}
    </>
  );
}