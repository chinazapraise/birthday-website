"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { EASE } from "@/lib/motion";
import type { StorySubmission } from "@/lib/types";
import { fireConfetti } from "@/components/effects/ConfettiLayer";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, X } from "@phosphor-icons/react";

export default function StoryComposer({
  onSubmit,
}: {
  onSubmit: (s: StorySubmission) => void;
}) {
  const [name, setName] = useState("");
  const [meeting, setMeeting] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [year, setYear] = useState("");
  const [deny, setDeny] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<"public" | "only-tomide">(
    "public",
  );
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const targets = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 3 - photos.length);
    targets.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        setPhotos((prev) => (prev.length < 3 ? [...prev, url] : prev));
      };
      reader.readAsDataURL(f);
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !title.trim() || body.trim().length < 10) {
      setError("Please add your name, a title, and a story with a little meat on it.");
      return;
    }
    onSubmit({
      senderName: visibility === "public" ? name.trim() : "Private",
      meetingContext: meeting.trim() || "-",
      title: title.trim(),
      body: body.trim(),
      year: year ? Number(year) : undefined,
      funnyPromptAnswer: deny.trim() || undefined,
      photos,
      anonymous_publicly: visibility === "only-tomide",
    } as StorySubmission);
    setDone(true);
    fireConfetti("burst");
    setName("");
    setMeeting("");
    setTitle("");
    setBody("");
    setYear("");
    setDeny("");
    setPhotos([]);
  };

  const field =
    "w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 transition focus:border-acid focus:outline-none";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            className="flex flex-col items-center rounded-3xl border border-acid/30 bg-acid/[0.06] p-8 text-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="font-display text-xl font-bold text-cream">
              Your chapter has been added to the pile.
            </p>
            <p className="mt-2 text-sm text-cream/60">
              {visibility === "only-tomide"
                ? "Keeping this one between us."
                : "It’s live on the story wall right now."}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:p-8"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(3px)" }}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                  Give the story a title <span className="text-acid">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The one where you…"
                  className={field}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                  Your name <span className="text-acid">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={field}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                  Where / how did we meet?
                </label>
                <input
                  value={meeting}
                  onChange={(e) => setMeeting(e.target.value)}
                  placeholder="School, church, work, a random bus…"
                  className={field}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                  Tell the story <span className="text-acid">*</span>
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  placeholder="The full chapter. Don’t leave out the parts I’ll deny."
                  className={cn(field, "resize-none")}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                  Year it happened (optional)
                </label>
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  type="number"
                  min={2000}
                  max={2026}
                  placeholder="2020"
                  className={field}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                  Something Tomide will probably deny 😂 (optional)
                </label>
                <input
                  value={deny}
                  onChange={(e) => setDeny(e.target.value)}
                  placeholder="Best kept as a whisper"
                  className={field}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                  A photo to go with it (optional)
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addPhotos(e.target.files);
                    e.target.value = "";
                  }}
                />
                {photos.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-white/20 bg-black/15 px-4 py-6 text-center text-sm text-cream/50 transition hover:border-acid/50 hover:text-cream"
                  >
                    <ImageIcon size={22} weight="duotone" className="text-acid/70" />
                    Drop a picture of the moment (up to 3)
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {photos.map((p, i) => (
                      <div
                        key={i}
                        className="group relative overflow-hidden rounded-xl border border-white/15"
                      >
                        <img
                          src={p}
                          alt={`Story photo ${i + 1}`}
                          className="h-24 w-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPhotos((prev) => prev.filter((_, j) => j !== i))
                          }
                          aria-label="Remove photo"
                          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-cream transition hover:bg-magenta"
                        >
                          <X size={12} weight="bold" />
                        </button>
                      </div>
                    ))}
                    {photos.length < 3 && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-white/20 text-cream/40 transition hover:border-acid/50 hover:text-cream"
                        aria-label="Add another photo"
                      >
                        <ImageIcon size={20} weight="duotone" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                  Who can see it?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibility("public")}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-3 text-sm transition",
                      visibility === "public"
                        ? "border-acid bg-acid/10 text-cream"
                        : "border-white/15 text-cream/50",
                    )}
                  >
                    Public · everyone sees it
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility("only-tomide")}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-3 text-sm transition",
                      visibility === "only-tomide"
                        ? "border-acid bg-acid/10 text-cream"
                        : "border-white/15 text-cream/50",
                    )}
                  >
                    Only Tomide
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-magenta" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-acid via-violet to-magenta px-6 py-4 font-display text-sm font-bold uppercase tracking-widest text-ink shadow-[0_0_40px_rgba(34,211,238,0.25)] transition-transform hover:scale-[1.01]"
            >
              Add your chapter
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}