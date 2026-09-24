"use client";

import { useStories } from "@/lib/hooks";
import { useState } from "react";
import type { CommunityStory } from "@/lib/types";
import StoryReader from "@/components/stories/StoryReader";
import MagazineStory from "@/components/stories/MagazineStory";

/**
 * The storybook — every published story becomes a numbered magazine page.
 * Story 01 is the feature spread; the rest follow as full pages.
 */
export default function StoryGallery() {
  const { stories } = useStories();
  const [open, setOpen] = useState<{
    story: CommunityStory;
    number: string;
  } | null>(null);

  if (stories.length === 0) {
    return (
      <p className="py-14 text-center font-hand text-2xl text-cream/50">
        Apparently everyone is still gathering evidence 😂. Be the first.
      </p>
    );
  }

  const [feature, ...rest] = stories;

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <p className="font-hand text-xl text-cream/50">
            {stories.length} {stories.length === 1 ? "chapter" : "chapters"} and counting
          </p>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <article>
          <MagazineStory
            story={feature}
            number="01"
            index={0}
            onOpen={() => setOpen({ story: feature, number: "01" })}
          />
        </article>

        <div className="mt-10 grid gap-7 md:grid-cols-2">
          {rest.map((s, i) => (
            <MagazineStory
              key={s.id}
              story={s}
              number={String(i + 2).padStart(2, "0")}
              index={i + 1}
              onOpen={() =>
                setOpen({ story: s, number: String(i + 2).padStart(2, "0") })
              }
            />
          ))}
        </div>
      </section>

      {open && (
        <StoryReader
          story={open.story}
          number={open.number}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}