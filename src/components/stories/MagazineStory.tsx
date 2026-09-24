"use client";

import { motion } from "framer-motion";
import type { CommunityStory } from "@/lib/types";
import { EASE } from "@/lib/motion";
import { formatDate, cn } from "@/lib/utils";
import { ArrowRight } from "@phosphor-icons/react";

const ACCENTS = [
  { text: "text-acid", soft: "border-acid/30 bg-acid/[0.08]" },
  { text: "text-magenta", soft: "border-magenta/30 bg-magenta/[0.08]" },
  { text: "text-violet", soft: "border-violet/40 bg-violet/[0.1]" },
  { text: "text-sunset", soft: "border-sunset/30 bg-sunset/[0.08]" },
  { text: "text-gold", soft: "border-gold/30 bg-gold/[0.08]" },
];

const ROTATIONS = [-1.2, 0.9, -0.6, 1.4, -1, 0.5];

/**
 * Editorial magazine page. `variant="card"` is the tappable tile;
 * `variant="spread"` is the full readable page inside the reader.
 * Photos are woven in as a montage, never dumped as a plain grid.
 * `compact` tightens typography so long stories fit one page.
 */
export default function MagazineStory({
  story,
  number,
  onOpen,
  variant = "card",
  index = 0,
  compact = false,
}: {
  story: CommunityStory;
  number: string;
  onOpen?: () => void;
  variant?: "card" | "spread";
  index?: number;
  compact?: boolean;
}) {
  const a = ACCENTS[index % ACCENTS.length];
  const rot = ROTATIONS[index % ROTATIONS.length];
  const isCard = variant === "card";

  const Card = isCard ? motion.button : motion.div;

  return (
    <Card
      onClick={onOpen}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#100d1c] p-6 text-left",
        isCard &&
          "group flex flex-col shadow-lg transition hover:border-white/25 hover:shadow-[0_0_45px_rgba(139,92,246,0.15)] md:p-7",
      )}
      initial={isCard ? { opacity: 0, y: 26 } : undefined}
      whileInView={isCard ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: EASE }}
      style={isCard ? { rotate: `${rot}deg` } : undefined}
      whileHover={isCard ? { rotate: 0, y: -4 } : undefined}
      aria-label={isCard ? `Read ${story.title}` : undefined}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <span className={cn("text-[0.65rem] font-bold uppercase tracking-[0.3em]", a.text)}>
            Story {number}
          </span>
          <span className="text-[0.6rem] uppercase tracking-[0.25em] text-cream/35">
            {formatDate(story.createdAt)}
          </span>
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute -right-3 -top-5 select-none font-display text-[7rem] font-black leading-none text-white/[0.05] md:text-[9rem]"
        >
          {number}
        </span>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem] uppercase tracking-[0.2em] text-cream/45">
          {story.meetingContext && (
            <span className={cn("font-semibold", a.text)}>
              {story.meetingContext}
            </span>
          )}
          {story.year && <span className="border-l border-white/15 pl-3">{story.year}</span>}
        </div>

        <h3
          className={cn(
            "mt-2 font-display font-bold leading-tight text-cream",
            compact
              ? "text-lg md:text-2xl"
              : "text-xl md:text-[1.7rem]",
          )}
        >
          {story.title}
        </h3>

        <p className="mt-2 font-hand text-lg text-cream/55">
          by <span className="text-cream/80">{story.senderName}</span>
        </p>
      </div>

      {story.photos.length > 0 && (
        <div className="relative z-10 mt-5">
          <PhotoMontage
            photos={story.photos}
            title={story.title}
            compact={compact}
          />
        </div>
      )}

      <div
        className={cn(
          "relative z-10 mt-5 leading-relaxed text-cream/70",
          compact
            ? "text-sm md:leading-7"
            : "md:leading-8",
          isCard ? "line-clamp-4 text-sm md:line-clamp-5" : "text-[0.95rem] md:text-base",
        )}
      >
        {story.body.split("\n").map((p, i) => (
          <p key={i} className={i > 0 ? "mt-3" : ""}>
            {p}
          </p>
        ))}
      </div>

      {story.funnyPromptAnswer && (
        <blockquote
          className={cn(
            "relative z-10 mt-5 rounded-xl border px-4 py-3",
            a.soft,
          )}
        >
          <p className={cn("text-[0.65rem] font-bold uppercase tracking-[0.2em]", a.text)}>
            Something Tomide will deny
          </p>
          <p className="mt-1 text-sm italic leading-relaxed text-cream/80">
            “{story.funnyPromptAnswer}”
          </p>
        </blockquote>
      )}

      {isCard && (
        <span className="relative z-10 mt-auto flex items-center gap-2 pt-6 text-xs font-semibold uppercase tracking-[0.2em] text-cream/50 transition group-hover:text-cream">
          Open the full page <ArrowRight size={14} weight="bold" />
        </span>
      )}
    </Card>
  );
}

function PhotoMontage({
  photos,
  title,
  compact = false,
}: {
  photos: string[];
  title: string;
  compact?: boolean;
}) {
  const s = compact ? "h-28 md:h-36" : "h-40 md:h-52";
  const s2 = compact ? "h-20 md:h-28" : "h-32 md:h-44";
  if (photos.length === 1) {
    return (
      <div className="-rotate-[1.2deg] overflow-hidden rounded-lg border border-white/15 shadow-lg">
        <img
          src={photos[0]}
          alt={`From the story ${title}`}
          className={`${s} w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]`}
        />
      </div>
    );
  }
  if (photos.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <img
          src={photos[0]}
          alt={`From the story ${title}`}
          className={`${s2} w-full -rotate-1 rounded-lg border border-white/15 object-cover shadow-md`}
        />
        <img
          src={photos[1]}
          alt={`From the story ${title}`}
          className={`${s2} w-full rotate-1 rounded-lg border border-white/15 object-cover shadow-md`}
        />
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <img
        src={photos[0]}
        alt={`From the story ${title}`}
        className={`${s2} w-2/3 rounded-lg border border-white/15 object-cover shadow-md`}
      />
      <div className="flex w-1/3 flex-col gap-2">
        <img
          src={photos[1]}
          alt={`From the story ${title}`}
          className={`${s2} w-full rounded-lg border border-white/15 object-cover shadow-md`}
        />
        <img
          src={photos[2]}
          alt={`From the story ${title}`}
          className={`${s2} w-full rounded-lg border border-white/15 object-cover shadow-md`}
        />
      </div>
    </div>
  );
}