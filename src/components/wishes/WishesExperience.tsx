"use client";

import { motion } from "framer-motion";
import { useWishes } from "@/lib/hooks";
import WishComposer from "@/components/wishes/WishComposer";
import WishWall from "@/components/wishes/WishWall";
import FloatingNav from "@/components/nav/FloatingNav";
import MeshBackground from "@/components/ambient/MeshBackground";
import CursorGlow from "@/components/ambient/CursorGlow";
import ConfettiLayer from "@/components/effects/ConfettiLayer";
import { EASE } from "@/lib/motion";
import type { WishSubmission } from "@/lib/types";

export default function WishesExperience() {
  const { addWish } = useWishes();

  const submit = (data: Omit<WishSubmission, "photoUrl" | "voiceUrl">) => {
    addWish(data as WishSubmission);
  };

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
            Wishes
          </motion.p>
          <motion.h1
            className="mt-3 font-display text-4xl font-black text-cream md:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Leave me something <span className="text-magenta">I can keep.</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-cream/60 md:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            A few words. A prayer. A joke. A memory. Whatever you want me to
            carry into 27.
          </motion.p>
        </header>

        <section className="px-6 py-12">
          <WishComposer onSubmit={submit} />
        </section>

        <WishWall />
      </main>
    </>
  );
}