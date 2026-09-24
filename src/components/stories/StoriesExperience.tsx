"use client";

import { motion } from "framer-motion";
import { useStories } from "@/lib/hooks";
import StoryComposer from "@/components/stories/StoryComposer";
import StoryGallery from "@/components/stories/StoryGallery";
import FloatingNav from "@/components/nav/FloatingNav";
import MeshBackground from "@/components/ambient/MeshBackground";
import CursorGlow from "@/components/ambient/CursorGlow";
import ConfettiLayer from "@/components/effects/ConfettiLayer";
import { EASE } from "@/lib/motion";

export default function StoriesExperience() {
  const { addStory } = useStories();

  return (
    <>
      <MeshBackground />
      <CursorGlow />
      <ConfettiLayer />
      <FloatingNav />

      <main className="relative z-10 pt-28">
        <header className="mx-auto max-w-3xl px-6 pt-10 text-center">
          <motion.p
            className="font-hand text-2xl text-cream/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Your Stories
          </motion.p>
          <motion.h1
            className="mt-3 font-display text-4xl font-black text-cream md:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            What’s your <span className="text-acid">Tomide</span> story?
          </motion.h1>
          <motion.p
            className="mt-4 text-cream/60 md:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            Everybody knows a different version of me. Tell me yours.
          </motion.p>
        </header>

        <section className="px-6 py-12">
          <StoryComposer onSubmit={(s) => addStory(s)} />
        </section>

        <StoryGallery />
      </main>
    </>
  );
}