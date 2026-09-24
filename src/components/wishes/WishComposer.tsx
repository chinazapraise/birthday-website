"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { fireConfetti } from "@/components/effects/ConfettiLayer";
import MagneticButton from "@/components/ui/MagneticButton";
import { Envelope } from "@phosphor-icons/react";

const RELATIONSHIPS = [
  "Friend",
  "Family",
  "Work",
  "Community",
  "Other",
];

export default function WishComposer({
  onSubmit,
}: {
  onSubmit: (w: {
    senderName: string;
    relationship?: string;
    message: string;
    anonymous: boolean;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [rel, setRel] = useState("");
  const [message, setMessage] = useState("");
  const [anon, setAnon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "folding" | "sealing" | "sealed">(
    "idle",
  );
  const nameRef = useRef<HTMLInputElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() && !anon) {
      setError("Add your name, or show me as Anonymous.");
      nameRef.current?.focus();
      return;
    }
    if (message.trim().length < 3) {
      setError("A few more words, please. Don't leave it blank.");
      return;
    }

    setState("folding");
    setTimeout(() => setState("sealing"), 650);
    setTimeout(() => {
      onSubmit({
        senderName: anon ? "Anonymous" : name.trim(),
        relationship: rel || undefined,
        message: message.trim(),
        anonymous: anon,
      });
      setState("sealed");
      fireConfetti("rain");
    }, 1400);
  };

  const reset = () => {
    setState("idle");
    setName("");
    setRel("");
    setMessage("");
    setAnon(false);
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <AnimatePresence mode="wait">
        {state === "sealed" ? (
          <motion.div
            key="sealed"
            className="flex flex-col items-center rounded-3xl border border-magenta/30 bg-magenta/[0.06] p-8 text-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet to-magenta">
              <Envelope size={28} weight="fill" className="text-ink" />
            </div>
            <p className="font-display text-xl font-bold text-cream">
              Your wish has been sealed.
            </p>
            <p className="mt-2 text-sm text-cream/60">
              It’s now on the wish wall for everyone to see.
            </p>
            <button
              onClick={reset}
              className="mt-6 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-cream transition hover:border-white/40"
            >
              Write another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:p-8"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={
              state === "folding"
                ? { scale: 0.98, rotate: -1, opacity: 0.6 }
                : state === "sealing"
                  ? { scale: 0.85, y: 40, opacity: 0.3 }
                  : { scale: 1, y: 0, opacity: 1, rotate: 0 }
            }
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                Name
              </label>
              <input
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={anon}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 transition focus:border-magenta focus:outline-none disabled:opacity-40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                Relationship / how we know each other{" "}
                <span className="text-cream/30">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIPS.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRel(rel === r ? "" : r)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition",
                      rel === r
                        ? "border-magenta bg-magenta/15 text-cream"
                        : "border-white/15 text-cream/50 hover:border-white/35",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                Birthday message <span className="text-magenta">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="A few words. A prayer. A joke. A memory. Whatever you want me to carry into 27."
                className="w-full resize-none rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 transition focus:border-magenta focus:outline-none"
              />
              <div className="mt-1 flex justify-between text-xs text-cream/40">
                <span>{message.length} characters</span>
                <span>Min 3</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
              <div>
                <p className="text-sm text-cream/70">Show me as Anonymous</p>
                <p className="text-xs text-cream/40">
                  Your message stays public either way.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={anon}
                onClick={() => setAnon((v) => !v)}
                className={cn(
                  "relative h-7 w-12 rounded-full transition",
                  anon ? "bg-magenta" : "bg-white/15",
                )}
              >
                <motion.span
                  className="absolute top-1 h-5 w-5 rounded-full bg-cream"
                  animate={{ left: anon ? 26 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <p className="rounded-xl bg-white/5 px-4 py-3 text-xs text-cream/50">
              Your wish will appear publicly on this website.
            </p>

            {error && (
              <p className="text-sm font-medium text-magenta" role="alert">
                {error}
              </p>
            )}

            <MagneticButton className="w-full">
              <button
                type="submit"
                disabled={state !== "idle"}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet via-magenta to-sunset px-6 py-4 font-display text-sm font-bold uppercase tracking-widest text-ink shadow-[0_0_40px_rgba(244,63,158,0.3)] transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {state !== "idle" ? (
                  "Sealing…"
                ) : (
                  <>
                    Seal my wish <span className="text-base">💌</span>
                  </>
                )}
              </button>
            </MagneticButton>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}