"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import useStore, { emit, useSettings, useTimelineMedia } from "@/lib/hooks";
import type { Wish, CommunityStory, WishlistItem, TimelineMedia } from "@/lib/types";
import FloatingNav from "@/components/nav/FloatingNav";
import MeshBackground from "@/components/ambient/MeshBackground";
import CursorGlow from "@/components/ambient/CursorGlow";
import { EASE } from "@/lib/motion";
import { formatDate, cn } from "@/lib/utils";
import { giftStats } from "@/lib/giftStatus";
import { timelineSeed } from "@/lib/content/timeline";
import { fileToCompressedDataUrl } from "@/lib/image";

/**
 * Owner area. Utilitarian on purpose — management, not showcase.
 * All seed content can be edited in-place.
 */
export default function ManageExperience() {
  const store = useStore();
  const { settings, updateSettings } = useSettings();
  const { mediaUrls, setMedia, removeMedia } = useTimelineMedia();

  const wishes = store.allWishes();
  const stories = store.allStories();
  const claims = store.getClaims();
  const reserves = store.getReserves();
  const contributions = store.getContributions();
  const [wishlistDraft, setWishlistDraft] = useState<WishlistItem[]>(
    () => store.getWishlist(),
  );

  // Editable copy fields (mapped directly to SiteSettings)
  const [copyDraft, setCopyDraft] = useState({
    wishlistTitle: settings.wishlistTitle,
    wishlistCopy: settings.wishlistCopy,
    endingGratitude: settings.endingGratitude,
  });

  const saveCopy = () => {
    updateSettings(copyDraft);
    emit();
  };

  const toggleWish = (id: string) => {
    const w = wishes.find((x: Wish) => x.id === id);
    if (!w) return;
    store.updateWish(id, {
      status: w.status === "published" ? "hidden" : "published",
    });
    emit();
  };

  const toggleStory = (id: string) => {
    const s = stories.find((x: CommunityStory) => x.id === id);
    if (!s) return;
    store.updateStory(id, {
      status: s.status === "published" ? "hidden" : "published",
    });
    emit();
  };

  const updateWishlistItem = (id: string, patch: Partial<WishlistItem>) => {
    const next = wishlistDraft.map((i) =>
      i.id === id ? { ...i, ...patch } : i,
    );
    setWishlistDraft(next);
    store.updateWishlist(next);
    emit();
  };

  const markGifted = (claimId: string, gifted: boolean) => {
    store.updateClaim(claimId, { gifted });
    emit();
  };

  const handleTimelineUpload = async (mediaId: string, file: File) => {
    const dataUrl = await fileToCompressedDataUrl(file);
    if (!dataUrl) return;
    setMedia(mediaId, dataUrl);
    emit();
  };

  const KIND_LABEL: Record<WishlistItem["kind"], string> = {
    single: "Single · exclusive",
    multi: "Multi · anyone can",
    expensive: "Expensive · claim + contribute",
    trip: "Trip · sponsor + contribute",
    cash: "Cash gift · fixed amount",
  };

  return (
    <>
      <MeshBackground />
      <CursorGlow />
      <FloatingNav />

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-28">
        <header className="mb-10">
          <motion.p
            className="font-hand text-2xl text-cream/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Manage
          </motion.p>
          <motion.h1
            className="mt-2 font-display text-4xl font-black text-cream md:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            This is Tomide&apos;s corner.
          </motion.h1>
          <p className="mt-3 max-w-2xl text-sm text-cream/55">
            Everything lives in your browser (localStorage) until you swap in a
            backend. Hiding things here removes them from the public walls.
          </p>
        </header>

        {/* Wishes */}
        <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="font-display text-lg font-bold text-cream">
            Wishes <span className="text-magenta">({wishes.length})</span>
          </h2>
          <p className="mt-1 text-xs text-cream/45">
            All wishes (including hidden). Toggle to show/hide on the public wall.
          </p>
          <ul className="mt-5 space-y-2">
            {wishes.map((w) => (
              <li
                key={w.id}
                className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-cream">
                    <span className="text-magenta">{w.senderName}</span>
                    {" · "}
                    <span className="text-cream/70">{w.message}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-cream/35">
                    {w.relationship ?? ""} · {formatDate(w.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => toggleWish(w.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition",
                    w.status === "published"
                      ? "border-white/20 text-cream/70 hover:border-white/40"
                      : "border-magenta/50 text-magenta hover:border-magenta",
                  )}
                >
                  {w.status === "published" ? "Hide" : "Show"}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Stories */}
        <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="font-display text-lg font-bold text-cream">
            Your Stories <span className="text-acid">({stories.length})</span>
          </h2>
          <ul className="mt-5 space-y-2">
            {stories.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-cream">
                    <span className="text-acid">{s.title}</span>{" "}
                    <span className="text-cream/40">by {s.senderName}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-cream/35">
                    {s.meetingContext} · {s.year ?? "no year"} ·{" "}
                    {formatDate(s.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => toggleStory(s.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition",
                    s.status === "published"
                      ? "border-white/20 text-cream/70 hover:border-white/40"
                      : "border-acid/50 text-acid hover:border-acid",
                  )}
                >
                  {s.status === "published" ? "Hide" : "Show"}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline photos */}
        <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="font-display text-lg font-bold text-cream">
            Timeline photos <span className="text-violet">({timelineSeed.length} years)</span>
          </h2>
          <p className="mt-1 text-xs text-cream/45">
            Tap any blank image to upload the real photo for that story. Photos
            are stored in this browser (localStorage) until a backend is added.
          </p>
          <div className="mt-5 space-y-6">
            {timelineSeed.map((year) => (
              <div
                key={year.id}
                className="rounded-2xl bg-white/[0.03] p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-sm font-bold text-cream">
                    {year.year}
                    <span className="ml-2 font-sans font-normal text-cream/50">
                      {year.title}
                    </span>
                  </p>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-cream/40">
                    {year.media.length} image{year.media.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {year.media.map((m) => (
                    <MediaUploadTile
                      key={m.id}
                      media={m}
                      url={mediaUrls[m.id]}
                      onUpload={(file) => handleTimelineUpload(m.id, file)}
                      onRemove={() => {
                        removeMedia(m.id);
                        emit();
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Wishlist */}
        <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-cream">
              Wishlist <span className="text-gold">({wishlistDraft.length})</span>
            </h2>
          </div>
          <ul className="mt-5 space-y-2">
            {wishlistDraft.map((item) => {
              const stats = giftStats(item, claims, reserves, contributions);
              const itemClaims = claims.filter(
                (c) => c.wishlistItemId === item.id,
              );
              const itemContribs = contributions.filter(
                (c) => c.wishlistItemId === item.id,
              );
              return (
                <li
                  key={item.id}
                  className="rounded-2xl bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <input
                        value={item.name}
                        onChange={(e) =>
                          updateWishlistItem(item.id, { name: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm text-cream focus:border-gold focus:outline-none"
                      />
                      <p className="mt-2 text-xs text-gold">
                        {KIND_LABEL[item.kind]}
                        {item.cashAmount ? ` · ₦${item.cashAmount.toLocaleString()}` : ""}
                        {item.maxQuantity ? ` · up to ${item.maxQuantity}/${item.maxQuantity}` : ""} ·{" "}
                        {stats.reserved} reserved · {stats.contributed}{" "}
                        contributed · {stats.gifted} gifted
                      </p>
                      {itemClaims.map((c) => (
                        <div
                          key={c.id}
                          className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2 text-xs text-cream/70"
                        >
<span className="text-magenta">
                          {c.anonymous
                            ? "Anonymous"
                            : `${c.name}${c.contact ? ` (${c.contact})` : ""}`}
                        </span>
                        {c.anonymous && (
                          <span className="rounded-full border border-magenta/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-magenta">
                            Identity hidden
                          </span>
                        )}
                        <span>· qty {c.quantity}</span>
                          <button
                            onClick={() => markGifted(c.id, !c.gifted)}
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 font-semibold transition",
                              c.gifted
                                ? "border-acid/50 text-acid"
                                : "border-white/20 text-cream/60 hover:border-white/40",
                            )}
                          >
                            {c.gifted ? "Marked gifted" : "Mark gifted"}
                          </button>
                        </div>
                      ))}
                      {itemContribs.length > 0 && (
                        <p className="mt-2 text-xs text-cream/40">
                          {itemContribs.length} contribution
                          {itemContribs.length === 1 ? "" : "s"} ·{" "}
                          {itemContribs
                            .map((c) =>
                              `₦${c.amount.toLocaleString()}${
                                c.anonymous ? " · anonymous (identity hidden)" : ""
                              }`,
                            )
                            .join(", ")}{" "}
                          · pending
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateWishlistItem(item.id, {
                            status:
                              item.status === "hidden" ? "active" : "hidden",
                          })
                        }
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-semibold transition",
                          item.status === "hidden"
                            ? "border-gold/50 text-gold"
                            : "border-white/20 text-cream/70 hover:border-white/40",
                        )}
                      >
                        {item.status === "hidden" ? "Show" : "Hide"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Settings */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-cream">Copy & settings</h2>
            <button
              onClick={saveCopy}
              className="rounded-full bg-gradient-to-r from-violet to-magenta px-5 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-transform hover:scale-105"
            >
              Save changes
            </button>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {(
              [
                ["wishlistTitle", copyDraft.wishlistTitle],
                ["wishlistCopy", copyDraft.wishlistCopy],
                ["endingGratitude", copyDraft.endingGratitude],
              ] as const
            ).map(([key, value]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/45">
                  {key}
                </span>
                <textarea
                  rows={key === "endingGratitude" ? 3 : 1}
                  value={value}
                  onChange={(e) =>
                    setCopyDraft((d) => ({ ...d, [key]: e.target.value }))
                  }
                  className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-cream focus:border-magenta focus:outline-none"
                />
              </label>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-white/[0.03] px-4 py-3 text-xs text-cream/45">
            Birthday:<span className="text-cream/75"> {settings.birthdayDate}</span>{" "}
            ({settings.birthdayTimezone}) · Hero:&ldquo;{settings.heroCopy.subline}&rdquo; ·{" "}
            People in the marquee:{" "}
            <span className="text-cream/75">{settings.people.length}</span>
          </div>
        </section>
      </main>
    </>
  );
}

function MediaUploadTile({
  media,
  url,
  onUpload,
  onRemove,
}: {
  media: TimelineMedia;
  url?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative flex h-28 w-24 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-dashed text-center transition",
          url ? "border-white/15" : "border-white/20 hover:border-violet/60",
        )}
        style={{
          aspectRatio: media.aspect ?? "4:5",
        }}
        title={url ? "Replace photo" : "Add photo"}
      >
        {url ? (
          <>
            <img
              src={url}
              alt={media.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 font-mono text-[0.55rem] uppercase tracking-wider text-cream opacity-0 transition group-hover:opacity-100">
              Replace
            </span>
          </>
        ) : (
          <>
            <span className="text-lg text-cream/40 transition group-hover:text-violet">
              +
            </span>
            <span className="max-w-[88%] font-mono text-[0.5rem] leading-tight text-cream/30 uppercase tracking-wide">
              Add photo
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
      </button>
      {url && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-ink text-[0.6rem] text-cream/70 transition hover:border-magenta hover:text-magenta"
          aria-label="Remove photo"
          title="Remove photo"
        >
          ×
        </button>
      )}
    </div>
  );
}