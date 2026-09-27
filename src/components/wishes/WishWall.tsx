"use client";

import { useWishes } from "@/lib/hooks";
import WishCard from "@/components/wishes/WishCard";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Filter = "All" | "Friends" | "Family" | "Work" | "Community";

const FILTERS: Filter[] = ["All", "Friends", "Family", "Work", "Community"];

/**
 * Live field/wall of wish cards. New public wishes appear immediately.
 */
export default function WishWall() {
  const { wishes } = useWishes();
  const [filter, setFilter] = useState<Filter>("All");
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const visible =
    filter === "All"
      ? wishes
      : wishes.filter((w) => w.relationship === filter.toLowerCase());

  const safeCurrent = Math.min(current, Math.max(visible.length - 1, 0));
  const currentWish = visible[safeCurrent];

  useEffect(() => {
    stageRef.current?.scrollIntoView({ block: "start" });
  }, [current]);

  const goNext = () => {
    if (!visible.length) return;
    setOpen(false);
    setCurrent((value) => (value + 1) % visible.length);
  };

  const chooseFilter = (next: Filter) => {
    setFilter(next);
    setCurrent(0);
    setOpen(false);
  };

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
              onClick={() => chooseFilter(f)}
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
        <div ref={stageRef} className="scroll-mt-28">
          <div className="mb-7 flex flex-col items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-cream/35">
                Wish {safeCurrent + 1} of {visible.length}
              </p>
              <p className="mt-1 font-hand text-xl text-cream/65">
                Open this one, read it fully, then move to the next pumpkin.
              </p>
            </div>
            <button
              type="button"
              onClick={goNext}
              className="min-h-11 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cream/60 transition hover:border-magenta/45 hover:text-cream"
            >
              Skip
            </button>
          </div>

          {currentWish && (
            <WishCard
              key={currentWish.id}
              wish={currentWish}
              index={safeCurrent}
              open={open}
              onOpen={() => setOpen(true)}
              onNext={goNext}
              hasNext={safeCurrent < visible.length - 1}
            />
          )}
        </div>
      )}
    </section>
  );
}
