"use client";

import { useWishes } from "@/lib/hooks";
import WishCard from "@/components/wishes/WishCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Filter = "All" | "Friends" | "Family" | "Work" | "Community";

const FILTERS: Filter[] = ["All", "Friends", "Family", "Work", "Community"];

/**
 * Live field/wall of wish cards. New public wishes appear immediately.
 */
export default function WishWall() {
  const { wishes } = useWishes();
  const [filter, setFilter] = useState<Filter>("All");

  const visible =
    filter === "All"
      ? wishes
      : wishes.filter((w) => w.relationship === filter.toLowerCase());

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex flex-col items-center gap-5">
        <p className="font-hand text-2xl text-cream/70">
          {wishes.length} {wishes.length === 1 ? "wish" : "wishes"} and counting.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition",
                filter === f
                  ? "border-magenta bg-magenta/15 text-cream"
                  : "border-white/15 text-cream/50 hover:border-white/35",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center font-hand text-2xl text-cream/50">
          Be the first to leave something for 27.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((w, i) => (
            <WishCard key={w.id} wish={w} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}