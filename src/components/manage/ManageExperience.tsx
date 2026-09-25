"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useStore, { emit, useSettings, useCloudYearPhotos } from "@/lib/hooks";
import type { Wish, CommunityStory, WishlistItem, Person } from "@/lib/types";
import FloatingNav from "@/components/nav/FloatingNav";
import MeshBackground from "@/components/ambient/MeshBackground";
import CursorGlow from "@/components/ambient/CursorGlow";
import { EASE } from "@/lib/motion";
import { formatDate, cn } from "@/lib/utils";
import { giftStats } from "@/lib/giftStatus";
import { timelineSeed } from "@/lib/content/timeline";
import { homeFrameCount } from "@/lib/timelineMedia";
import { fileToCompressedDataUrl } from "@/lib/image";
import { getAdminPassword } from "@/lib/admin";
import { notifyGiftAction } from "@/lib/notifyClient";

/**
 * Owner area. Utilitarian on purpose — management, not showcase.
 * All seed content can be edited in-place.
 */
export default function ManageExperience() {
  const store = useStore();
  const { settings, updateSettings } = useSettings();
  const {
    photos,
    loading: photosLoading,
    busy: photosBusy,
    error: photosError,
    upload,
    uploadPersonPhoto,
    savePeople,
    setCaption,
    replace,
    remove,
    reorder,
  } = useCloudYearPhotos();
  const [dragPhoto, setDragPhoto] = useState<{
    yearId: string;
    from: number;
  } | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [migrating, setMigrating] = useState(false);
  const migrateRef = useRef(false);

  const wishes = store.allWishes();
  const stories = store.allStories();
  const claims = store.getClaims();
  const reserves = store.getReserves();
  const contributions = store.getContributions();
  const [wishlistDraft, setWishlistDraft] = useState<WishlistItem[]>(
    () => store.getWishlist(),
  );

  const [peopleDraft, setPeopleDraft] = useState<Person[]>(
    () => settings.people ?? [],
  );
  const [peopleSaving, setPeopleSaving] = useState(false);
  const [peopleSaveStatus, setPeopleSaveStatus] = useState<string | null>(null);
  const [uploadingPersonId, setUploadingPersonId] = useState<string | null>(null);

  useEffect(() => {
    if (settings.people && settings.people.length > 0) {
      setPeopleDraft(settings.people);
    }
  }, [settings.people]);

  const handlePersonPhotoUpload = async (personId: string, file: File) => {
    setUploadingPersonId(personId);
    setPeopleSaveStatus(null);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      if (!dataUrl) {
        setPeopleSaveStatus("Could not process image file.");
        return;
      }
      const res = await uploadPersonPhoto(dataUrl);
      if (res.ok && res.url) {
        const next = peopleDraft.map((p) =>
          p.id === personId ? { ...p, imageUrl: res.url } : p,
        );
        setPeopleDraft(next);
        await savePeople(next);
        setPeopleSaveStatus("Photo updated & saved to cloud!");
      } else {
        setPeopleSaveStatus(res.error ?? "Failed to upload photo.");
      }
    } finally {
      setUploadingPersonId(null);
    }
  };

  const handleRemovePersonPhoto = async (personId: string) => {
    const next = peopleDraft.map((p) =>
      p.id === personId ? { ...p, imageUrl: undefined } : p,
    );
    setPeopleDraft(next);
    await savePeople(next);
    setPeopleSaveStatus("Photo removed & saved.");
  };

  const handleAddPerson = () => {
    const newPerson: Person = {
      id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: "",
      role: "",
      sentence: "",
      years: [2026],
    };
    const next = [...peopleDraft, newPerson];
    setPeopleDraft(next);
  };

  const handleDeletePerson = async (personId: string) => {
    if (!window.confirm("Remove this person from the marquee?")) return;
    const next = peopleDraft.filter((p) => p.id !== personId);
    setPeopleDraft(next);
    await savePeople(next);
    setPeopleSaveStatus("Person removed & saved.");
  };

  const movePerson = (from: number, to: number) => {
    if (
      from === to ||
      from < 0 ||
      to < 0 ||
      from >= peopleDraft.length ||
      to >= peopleDraft.length
    )
      return;
    const next = [...peopleDraft];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setPeopleDraft(next);
  };

  const updatePerson = (personId: string, patch: Partial<Person>) => {
    setPeopleDraft((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, ...patch } : p)),
    );
  };

  const handleSavePeople = async () => {
    setPeopleSaving(true);
    setPeopleSaveStatus(null);
    try {
      const res = await savePeople(peopleDraft);
      if (res.ok) {
        setPeopleSaveStatus("All people saved successfully!");
      } else {
        setPeopleSaveStatus(res.error ?? "Failed to save people.");
      }
    } finally {
      setPeopleSaving(false);
    }
  };

  const [releasing, setReleasing] = useState(false);
  const [releaseMessage, setReleaseMessage] = useState<string | null>(null);

  const releaseGiftActivity = async () => {
    if (
      !window.confirm(
        "Release ALL gift actions? Every claim, reserve and contribution (including the ones in the cloud) will be cleared. This cannot be undone.",
      )
    )
      return;
    setReleasing(true);
    setReleaseMessage(null);
    store.clearGiftActivity();
    emit();
    try {
      const res = await fetch("/api/wishlist/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": getAdminPassword(),
        },
      });
      const data = await res.json();
      setReleaseMessage(
        data.ok
          ? "Released. All test gift activity is cleared (cloud + this browser)."
          : `Cloud clear reported an issue: ${data.error ?? "unknown"}. Local was cleared.`,
      );
    } catch {
      setReleaseMessage(
        "Local cleared, but the cloud clear didn't reach the server. Try again.",
      );
    } finally {
      setReleasing(false);
    }
  };

  const handlePhotoUpload = async (yearId: string, files: FileList | null) => {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      const dataUrl = await fileToCompressedDataUrl(file);
      if (dataUrl) await upload(yearId, dataUrl);
    }
  };

  const handlePhotoReplace = async (
    yearId: string,
    photoId: string,
    file: File,
  ) => {
    const dataUrl = await fileToCompressedDataUrl(file);
    if (dataUrl) await replace(yearId, photoId, dataUrl);
  };

  const movePhoto = (yearId: string, from: number, to: number) => {
    const list = photos[yearId] ?? [];
    if (from === to || from < 0 || to < 0 || from >= list.length) return;
    const ids = list.map((p) => p.id);
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    void reorder(yearId, ids);
  };

  /*
   * Photos used to live only in this browser. If the cloud list is empty
   * but this browser still holds photos, push them up once so nothing is
   * lost and they become visible to visitors.
   */
  useEffect(() => {
    if (migrateRef.current || photosLoading) return;
    migrateRef.current = true;

    const local = store.getYearPhotos();
    const localCount = Object.values(local).reduce((s, l) => s + l.length, 0);
    const cloudCount = Object.values(photos).reduce((s, l) => s + l.length, 0);
    if (!localCount || cloudCount) return;

    const timer = setTimeout(() => {
      setMigrating(true);
      void (async () => {
        try {
          for (const [yearId, list] of Object.entries(local)) {
            for (const photo of list) {
              if (photo.url.startsWith("data:")) await upload(yearId, photo.url);
              else await setCaption(yearId, photo.id, photo.caption ?? "");
            }
          }
        } finally {
          setMigrating(false);
        }
      })();
    }, 0);
    return () => clearTimeout(timer);
  }, [photosLoading, photos, store, upload, setCaption]);

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
    if (gifted) {
      const claim = claims.find((c) => c.id === claimId);
      if (claim) {
        void notifyGiftAction("gifted", {
          itemName: store
            .getWishlist()
            .find((i) => i.id === claim.wishlistItemId)?.name ?? "gift",
          name: claim.name,
          note: claim.note,
        });
      }
    }
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

        {/* Gift activity — quick actions */}
        <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-cream">
                Gift activity{" "}
                <span className="text-cream/50">
                  ({claims.length + reserves.length + contributions.length})
                </span>
              </h2>
              <p className="mt-1 text-xs text-cream/45">
                Claims, reserves and contributions that came in from any
                device.
              </p>
            </div>
            <button
              onClick={releaseGiftActivity}
              disabled={releasing}
              className="rounded-full border border-magenta/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-magenta transition hover:border-magenta hover:text-magenta disabled:opacity-40"
            >
              {releasing ? "Releasing…" : "Release all test gift activity"}
            </button>
          </div>
          {releaseMessage && (
            <p className="mt-3 text-xs text-cream/60">{releaseMessage}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-cream/55">
            <span>
              <span className="text-magenta">{claims.length}</span> claims
            </span>
            <span>
              <span className="text-gold">{reserves.length}</span> reserves
            </span>
            <span>
              <span className="text-acid">{contributions.length}</span>{" "}
              contributions
            </span>
          </div>
        </section>

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

        {/* Year photos */}
        <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="font-display text-lg font-bold text-cream">
            Year photos <span className="text-violet">({timelineSeed.length} years)</span>
          </h2>
          <p className="mt-1 text-xs text-cream/45">
            Add as many photos as you like to any year. Drag a photo to
            reorder — the order decides what fills the homepage. The first N
            photos go to the homepage (N = that year&apos;s existing frame
            count). Every photo appears in the gallery. Uploads save to the
            live site, so everyone sees them.
          </p>
          {photosError ? (
            <p className="mt-3 rounded-lg border border-magenta/40 bg-magenta/10 px-3 py-2 text-xs text-magenta">
              {photosError}
            </p>
          ) : null}
          {migrating || photosBusy ? (
            <p className="mt-3 rounded-lg border border-violet/40 bg-violet/10 px-3 py-2 text-xs text-violet">
              {migrating
                ? "Publishing your existing photos to the live site…"
                : "Saving…"}
            </p>
          ) : null}
          <div className="mt-5 space-y-6">
            {timelineSeed.map((year) => {
              const list = photos[year.id] ?? [];
              const frames = homeFrameCount(year);
              const onHome = Math.min(list.length, frames);
              return (
                <div key={year.id} className="rounded-2xl bg-white/[0.03] p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display text-sm font-bold text-cream">
                      {year.year}
                      <span className="ml-2 font-sans font-normal text-cream/50">
                        {year.title}
                      </span>
                    </p>
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-cream/40">
                      {list.length} photo{list.length === 1 ? "" : "s"} ·{" "}
                      <span className="text-violet">
                        {onHome} on homepage ({frames} frame
                        {frames === 1 ? "" : "s"})
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {list.map((photo, i) => (
                      <div
                        key={photo.id}
                        draggable
                        onDragStart={() =>
                          setDragPhoto({ yearId: year.id, from: i })
                        }
                        onDragEnd={() => {
                          setDragPhoto(null);
                          setDropTarget(null);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDropTarget(photo.id);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (dragPhoto?.yearId === year.id) {
                            movePhoto(year.id, dragPhoto.from, i);
                          }
                          setDragPhoto(null);
                          setDropTarget(null);
                        }}
                        className={`w-40 cursor-grab rounded-xl border p-2 transition active:cursor-grabbing ${
                          dropTarget === photo.id
                            ? "border-violet bg-violet/10"
                            : "border-white/10 bg-black/20"
                        }`}
                      >
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.url}
                            alt={photo.caption ?? `${year.year} photo ${i + 1}`}
                            className="h-28 w-full rounded-lg object-cover"
                            loading="lazy"
                          />
                          <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[0.55rem] text-cream">
                            {i + 1}
                          </span>
                          {i < frames ? (
                            <span className="absolute right-1 top-1 rounded bg-violet/90 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-wider text-white">
                              Home
                            </span>
                          ) : (
                            <span className="absolute right-1 top-1 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-wider text-cream/60">
                              Gallery
                            </span>
                          )}
                        </div>
                        <CaptionInput
                          key={`${photo.id}:${photo.caption ?? ""}`}
                          value={photo.caption ?? ""}
                          onCommit={(value) =>
                            void setCaption(year.id, photo.id, value)
                          }
                        />
                        <div className="mt-1 flex gap-1">
                          <label className="flex-1 cursor-pointer rounded-md border border-violet/40 px-2 py-1 text-center text-[0.6rem] font-semibold uppercase tracking-wider text-violet transition hover:border-violet">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  void handlePhotoReplace(
                                    year.id,
                                    photo.id,
                                    file,
                                  );
                                }
                                e.target.value = "";
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => void remove(year.id, photo.id)}
                            className="flex-1 rounded-md border border-magenta/40 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-magenta transition hover:border-magenta"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <label className="flex h-36 w-40 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 text-center transition hover:border-violet/60">
                      <span className="text-lg text-cream/40">+</span>
                      <span className="max-w-[88%] font-mono text-[0.5rem] leading-tight uppercase tracking-wide text-cream/30">
                        Add photos
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          void handlePhotoUpload(year.id, e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Those who made the story possible */}
        <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-cream">
                Those who made the story possible{" "}
                <span className="text-magenta">({peopleDraft.length})</span>
              </h2>
              <p className="mt-1 text-xs text-cream/45">
                People in the cinematic marquee on the homepage. Upload their photos, edit their name, role, and quote.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddPerson}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-cream transition hover:border-white/40 hover:bg-white/5"
              >
                + Add person
              </button>
              <button
                type="button"
                onClick={handleSavePeople}
                disabled={peopleSaving}
                className="rounded-full bg-gradient-to-r from-violet to-magenta px-5 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-transform hover:scale-105 disabled:opacity-50"
              >
                {peopleSaving ? "Saving…" : "Save people"}
              </button>
            </div>
          </div>

          {peopleSaveStatus && (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-cream/75">
              {peopleSaveStatus}
            </p>
          )}

          <div className="mt-6 space-y-4">
            {peopleDraft.map((p, idx) => (
              <div
                key={p.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-start"
              >
                {/* Photo & Upload Box */}
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <div className="relative flex h-36 w-28 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-black/40">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name || "Person"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 text-center">
                        <span className="font-mono text-2xl text-cream/30">👤</span>
                        <span className="mt-1 font-mono text-[0.6rem] text-cream/40">No photo</span>
                      </div>
                    )}
                    {uploadingPersonId === p.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-xs font-semibold text-cream">
                        Uploading…
                      </div>
                    )}
                  </div>

                  <div className="flex w-28 flex-col gap-1">
                    <label className="cursor-pointer rounded-md border border-violet/40 px-2 py-1 text-center font-mono text-[0.6rem] font-semibold uppercase tracking-wider text-violet transition hover:border-violet hover:bg-violet/10">
                      {p.imageUrl ? "Change photo" : "Upload photo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handlePersonPhotoUpload(p.id, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {p.imageUrl && (
                      <button
                        type="button"
                        onClick={() => void handleRemovePersonPhoto(p.id)}
                        className="rounded-md border border-magenta/40 px-2 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-wider text-magenta transition hover:border-magenta hover:bg-magenta/10"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>

                {/* Info Fields */}
                <div className="flex flex-1 flex-col gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-cream/45">
                        Name
                      </span>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => updatePerson(p.id, { name: e.target.value })}
                        placeholder="e.g. Mum & Dad, Bedge"
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-3.5 py-2 text-sm text-cream focus:border-magenta focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-cream/45">
                        Role / Relationship
                      </span>
                      <input
                        type="text"
                        value={p.role}
                        onChange={(e) => updatePerson(p.id, { role: e.target.value })}
                        placeholder="e.g. Foundational Grace, Mentor"
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-3.5 py-2 text-sm text-cream focus:border-magenta focus:outline-none"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-cream/45">
                      Quote / Short Sentence
                    </span>
                    <textarea
                      rows={2}
                      value={p.sentence}
                      onChange={(e) => updatePerson(p.id, { sentence: e.target.value })}
                      placeholder="One short sentence / tribute..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3.5 py-2 text-sm text-cream focus:border-magenta focus:outline-none"
                    />
                  </label>

                  {/* Ordering & Delete */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => movePerson(idx, idx - 1)}
                        disabled={idx === 0}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-cream/60 transition hover:border-white/30 hover:text-cream disabled:opacity-30"
                      >
                        ↑ Move up
                      </button>
                      <button
                        type="button"
                        onClick={() => movePerson(idx, idx + 1)}
                        disabled={idx === peopleDraft.length - 1}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-cream/60 transition hover:border-white/30 hover:text-cream disabled:opacity-30"
                      >
                        ↓ Move down
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleDeletePerson(p.id)}
                      className="rounded-lg border border-magenta/30 px-3 py-1 text-xs font-semibold text-magenta transition hover:border-magenta hover:bg-magenta/10"
                    >
                      Remove person
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {peopleDraft.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-cream/40">
                No people added yet. Click &ldquo;+ Add person&rdquo; to add someone to the story.
              </div>
            )}
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
              const itemReserves = reserves.filter(
                (r) => r.wishlistItemId === item.id,
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
                            ? "Someone"
                            : `${c.name}${c.email ? ` (${c.email})` : ""}${
                                c.phone ? ` · ${c.phone}` : ""
                              }`}
                        </span>
                        {c.anonymous && (
                          <span className="rounded-full border border-magenta/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-magenta">
                            Identity hidden
                          </span>
                        )}
                        <span>· qty {c.quantity}</span>
                        {c.note && (
                          <span className="max-w-[26ch] truncate italic text-cream/50">
                            “{c.note}”
                          </span>
                        )}
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
                                c.anonymous
                                  ? " · someone (identity hidden)"
                                  : ` · ${c.name}${
                                      c.email ? ` <${c.email}>` : ""
                                    }${
                                      c.phone ? ` · ${c.phone}` : ""
                                    }`
                              }${
                                c.paymentStatus === "successful"
                                  ? " · paid"
                                  : " · pending"
                              }${c.note ? ` · “${c.note}”` : ""}`,
                            )
                            .join(", ")}
                        </p>
                      )}
                      {itemReserves.length > 0 && (
                        <p className="mt-2 text-xs text-cream/40">
                          {itemReserves.length} reserve
                          {itemReserves.length === 1 ? "" : "s"} ·{" "}
                          {itemReserves
                            .map((r) =>
                              `qty ${r.quantity}${
                                r.anonymous
                                  ? " · someone (identity hidden)"
                                  : ` · ${r.name}${
                                      r.email ? ` <${r.email}>` : ""
                                    }${
                                      r.phone ? ` · ${r.phone}` : ""
                                    }`
                              }${r.note ? ` · “${r.note}”` : ""}`,
                            )
                            .join(", ")}
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

/** Edits locally, saves on blur — avoids a network write per keystroke. */
function CaptionInput({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft !== value) onCommit(draft);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      placeholder="Caption (optional)"
      className="mt-2 w-full rounded-md border border-white/10 bg-transparent px-2 py-1 text-xs text-cream focus:border-violet focus:outline-none"
    />
  );
}
