"use client";

import {
  wishesSeed,
  storiesSeed,
  wishlistSeed,
  siteSettingsSeed,
} from "@/lib/content/site";
import { timelineSeed } from "@/lib/content/timeline";
import {
  pullClaims,
  pullReserves,
  pullContributions,
  pushClaim,
  pushClaimUpdate,
  pushReserve,
  pushContribution,
  pushContributionPaid,
  pushContributionPatch,
  isExclusiveItem,
} from "@/lib/cloudSync";
import type {
  Wish,
  CommunityStory,
  WishlistItem,
  GiftClaim,
  GiftReserve,
  Contribution,
  SiteSettings,
  YearPhoto,
  WishSubmission,
  StorySubmission,
} from "@/lib/types";
import { notifyGiftAction } from "@/lib/notifyClient";

/** Fire the owner email notification, silently, only from the browser. */
function notify(action: Parameters<typeof notifyGiftAction>[0], data: Parameters<typeof notifyGiftAction>[1]) {
  if (typeof window === "undefined") return;
  void notifyGiftAction(action, data);
}

/*
 * STORE
 * LocalStorage-backed store with a clean interface. Swap `impl` for a
 * Supabase adapter to go realtime + multi-device (see README section).
 * All seeds mirror the timeline content so the site works out of the box.
 */

const K = {
  wishes: "birthday.wishes",
  // v2: seed now carries two real sample stories so the magazine
  // reads properly out of the box; bump forces everyone to the
  // fresh seed (no stale placeholder snapshots).
  stories: "birthday.stories.v2",
  // v2: seed gained per-gift funny one-liners; bumps force everyone to
  // the fresh seed and release every gift (no stale local snapshots).
  // v4: Replace flowers with ₦2.7m cash gift and group cash gifts.
  wishlist: "birthday.wishlist.v4",
  claims: "birthday.claims.v2",
  reserves: "birthday.reserves.v2",
  contributions: "birthday.contributions.v2",
  settings: "birthday.settings.v2",
  // Uploaded photos for the timeline — mediaId -> dataUrl. Seed media
  // structure is untouched; this map overlays onto timelineSeed.
  timelineMedia: "birthday.timeline.media",
  // Extra gallery images added per year from admin: yearId -> GalleryExtra[].
  timelineExtras: "birthday.timeline.extras.v1",
  // v1: unified ordered per-year photo list. Array order is homepage
  // priority; the first (seed frame count) entries fill the home frames
  // and every entry shows in the gallery. No per-year cap.
  timelinePhotos: "birthday.timeline.photos.v1",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function loadWishes(): Wish[] {
  const stored = read<Wish[]>(K.wishes, []);
  return stored.length ? stored : wishesSeed;
}
function loadStories(): CommunityStory[] {
  const stored = read<CommunityStory[]>(K.stories, []);
  return stored.length ? stored : storiesSeed;
}
function loadWishlist(): WishlistItem[] {
  const stored = read<WishlistItem[]>(K.wishlist, []);
  if (!stored.length) return wishlistSeed;
  // old schema (has price/quantity) → drop it, use the new seed
  if (!("kind" in stored[0])) {
    write(K.wishlist, wishlistSeed);
    return wishlistSeed;
  }
  return stored.map((item) => {
    const seed = wishlistSeed.find((s) => s.id === item.id);
    if (!seed) return item;
    return {
      ...item,
      description: seed.description,
      funnyNote: seed.funnyNote,
    };
  });
}
function loadSettings(): SiteSettings {
  const stored = read<Partial<SiteSettings>>(K.settings, {});
  return {
    ...siteSettingsSeed,
    ...stored,
    birthdayDate: siteSettingsSeed.birthdayDate,
    countdownMode: siteSettingsSeed.countdownMode,
  };
}

export const store = {
  getWishes(): Wish[] {
    return loadWishes().filter((w) => w.status === "published");
  },

  allWishes(): Wish[] {
    return loadWishes();
  },

  addWish(submission: WishSubmission): Wish {
    const wishes = loadWishes();
    const wish: Wish = {
      ...submission,
      id: uid(),
      status: "published",
      createdAt: new Date().toISOString(),
    };
    wishes.unshift(wish);
    write(K.wishes, wishes);
    return wish;
  },

  updateWish(id: string, patch: Partial<Wish>): Wish[] {
    const wishes = loadWishes().map((w) =>
      w.id === id ? { ...w, ...patch } : w,
    );
    write(K.wishes, wishes);
    return wishes;
  },

  getStories(): CommunityStory[] {
    return loadStories().filter((s) => s.status === "published");
  },

  allStories(): CommunityStory[] {
    return loadStories();
  },

  addStory(submission: StorySubmission): CommunityStory {
    const stories = loadStories();
    const story: CommunityStory = {
      ...submission,
      id: uid(),
      status: "published",
      featured: false,
      createdAt: new Date().toISOString(),
    };
    stories.unshift(story);
    write(K.stories, stories);
    return story;
  },

  updateStory(id: string, patch: Partial<CommunityStory>): CommunityStory[] {
    const stories = loadStories().map((s) =>
      s.id === id ? { ...s, ...patch } : s,
    );
    write(K.stories, stories);
    return stories;
  },

  getWishlist(): WishlistItem[] {
    return loadWishlist();
  },

  updateWishlist(items: WishlistItem[]): void {
    write(K.wishlist, items);
  },

  getClaims(): GiftClaim[] {
    return read<GiftClaim[]>(K.claims, []).map((c) => ({
      ...c,
      anonymous: c.anonymous ?? false,
    }));
  },

  /**
   * Claim = commitment. Blocks single/expensive/trip gifts:
   * once someone has an active claim, no one else can claim.
   * Multi gifts allow unlimited claims (each is its own slot).
   * Returns the claim, or null when the gift is already claimed.
   */
  addClaim(
    claim: Omit<GiftClaim, "id" | "createdAt" | "gifted">,
  ): GiftClaim | null {
    const items = loadWishlist();
    const item = items.find((i) => i.id === claim.wishlistItemId);
    if (!item) return null;

    const exclusive = item.kind === "single" || item.kind === "expensive" || item.kind === "trip";
    if (exclusive) {
      const claims = read<GiftClaim[]>(K.claims, []);
      const already = claims.some(
        (c) => c.wishlistItemId === claim.wishlistItemId,
      );
      if (already) return null;
    }

    const full: GiftClaim = {
      ...claim,
      id: uid(),
      gifted: false,
      createdAt: new Date().toISOString(),
    };
    const claims = read<GiftClaim[]>(K.claims, []);
    claims.push(full);
    write(K.claims, claims);
    void pushClaim(full, isExclusiveItem(item));
    notify("claim", { itemName: item.name, name: full.name, note: full.note });
    return full;
  },

  getReserves(): GiftReserve[] {
    return read<GiftReserve[]>(K.reserves, []).map((r) => ({
      ...r,
      anonymous: r.anonymous ?? false,
    }));
  },

  addReserve(
    reserve: Omit<GiftReserve, "id" | "createdAt">,
  ): GiftReserve {
    const reserves = read<GiftReserve[]>(K.reserves, []);
    const full: GiftReserve = {
      ...reserve,
      id: uid(),
      createdAt: new Date().toISOString(),
    };
    reserves.push(full);
    write(K.reserves, reserves);
    void pushReserve(full);
    const reservedItem = loadWishlist().find(
      (i) => i.id === full.wishlistItemId,
    );
    notify("reserve", {
      itemName: reservedItem?.name,
      name: full.name,
      note: full.note,
    });
    return full;
  },

  updateClaim(id: string, patch: Partial<GiftClaim>): GiftClaim[] {
    const claims = read<GiftClaim[]>(K.claims, []).map((c) =>
      c.id === id ? { ...c, ...patch } : c,
    );
    write(K.claims, claims);
    void pushClaimUpdate(id, patch);
    return claims;
  },

  getContributions(): Contribution[] {
    return read<Contribution[]>(K.contributions, []).map((c) => ({
      ...c,
      anonymous: c.anonymous ?? false,
    }));
  },

  addContribution(
    contribution: Omit<
      Contribution,
      "id" | "createdAt" | "paymentStatus"
    >,
  ): Contribution {
    const all = read<Contribution[]>(K.contributions, []);
    const full: Contribution = {
      ...contribution,
      id: uid(),
      paymentStatus: "initiated",
      createdAt: new Date().toISOString(),
    };
    all.push(full);
    write(K.contributions, all);
    void pushContribution(full);
    return full;
  },

  markPaymentAttempted(id: string): void {
    const all = read<Contribution[]>(K.contributions, []).map((c) =>
      c.id === id
        ? { ...c, paymentStatus: "pending" as const }
        : c,
    );
    write(K.contributions, all);
  },

  markPaymentSuccessful(id: string, reference: string): void {
    const all = read<Contribution[]>(K.contributions, []).map((c) =>
      c.id === id
        ? {
            ...c,
            paymentStatus: "successful" as const,
            paymentReference: reference,
          }
        : c,
    );
    write(K.contributions, all);
    void pushContributionPaid(id, reference);
    const paid = all.find((c) => c.id === id);
    if (paid) {
      const item = loadWishlist().find((i) => i.id === paid.wishlistItemId);
      notify("contribution", {
        itemName: item?.name,
        name: paid.name,
        note: paid.note,
        amount: `₦${Number(paid.amount || 0).toLocaleString()}`,
      });
    }
  },

  updateContribution(
    id: string,
    patch: Partial<Contribution>,
  ): Contribution[] {
    const all = read<Contribution[]>(K.contributions, []).map((c) =>
      c.id === id ? { ...c, ...patch } : c,
    );
    write(K.contributions, all);
    if (patch.note !== undefined) void pushContributionPatch(id, { note: patch.note });
    return all;
  },

  /** Clear all gift activity locally (claims, reserves, contributions). */
  clearGiftActivity(): void {
    [K.claims, K.reserves, K.contributions].forEach((k) =>
      localStorage.removeItem(k),
    );
  },

  getSettings(): SiteSettings {
    return loadSettings();
  },

  /**
   * Pull the cloud rows into the local cache once at startup so wishlist
   * numbers reflect every device. Cloud is the source of truth: on success
   * the local cache is replaced with whatever the cloud returned (even an
   * empty list, so released/cleared test data disappears everywhere).
   * Only when the pull itself fails does the local cache stay as-is.
   */
  async hydrateFromCloud(): Promise<void> {
    const [cloudClaims, cloudReserves, cloudContribs] = await Promise.all([
      pullClaims(),
      pullReserves(),
      pullContributions(),
    ]);
    if (cloudClaims) write(K.claims, cloudClaims);
    if (cloudReserves) write(K.reserves, cloudReserves);
    if (cloudContribs) write(K.contributions, cloudContribs);
  },

  updateSettings(patch: Partial<SiteSettings>): SiteSettings {
    const next = { ...loadSettings(), ...patch };
    write(K.settings, next);
    return next;
  },

  /*
   * UNIFIED YEAR PHOTOS
   *
   * One ordered list per year, no cap. On first read the two legacy stores
   * (frame uploads + gallery-only extras) are folded into this list so
   * nothing already uploaded is lost, then the result is persisted and
   * becomes the single source of truth from that point on.
   */

  getYearPhotos(): Record<string, YearPhoto[]> {
    const stored = read<Record<string, YearPhoto[]> | null>(K.timelinePhotos, null);
    if (stored) return stored;

    const mediaUrls = read<Record<string, string>>(K.timelineMedia, {});
    const extras = read<Record<string, Array<{ id: string; url: string; caption?: string }>>>(
      K.timelineExtras,
      {},
    );
    const migrated: Record<string, YearPhoto[]> = {};

    for (const year of timelineSeed) {
      const fromFrames: YearPhoto[] = year.media
        .filter((m) => Boolean(mediaUrls[m.id]))
        .map((m) => ({
          id: `frame-${m.id}`,
          url: mediaUrls[m.id],
          caption: m.caption,
        }));
      const fromExtras: YearPhoto[] = (extras[year.id] ?? []).map((e) => ({
        id: e.id,
        url: e.url,
        caption: e.caption,
      }));
      const merged = [...fromFrames, ...fromExtras];
      if (merged.length) migrated[year.id] = merged;
    }

    write(K.timelinePhotos, migrated);
    return migrated;
  },

  addYearPhotos(
    yearId: string,
    photos: Array<{ id: string; url: string; caption?: string }>,
  ): Record<string, YearPhoto[]> {
    const map = this.getYearPhotos();
    map[yearId] = [...(map[yearId] ?? []), ...photos];
    write(K.timelinePhotos, map);
    return map;
  },

  updateYearPhoto(
    yearId: string,
    photoId: string,
    patch: Partial<YearPhoto>,
  ): Record<string, YearPhoto[]> {
    const map = this.getYearPhotos();
    map[yearId] = (map[yearId] ?? []).map((p) =>
      p.id === photoId ? { ...p, ...patch } : p,
    );
    write(K.timelinePhotos, map);
    return map;
  },

  removeYearPhoto(yearId: string, photoId: string): Record<string, YearPhoto[]> {
    const map = this.getYearPhotos();
    map[yearId] = (map[yearId] ?? []).filter((p) => p.id !== photoId);
    write(K.timelinePhotos, map);
    return map;
  },

  /** Persist a drag-and-drop reorder. Ids absent from `orderedIds` keep their tail order. */
  reorderYearPhotos(
    yearId: string,
    orderedIds: string[],
  ): Record<string, YearPhoto[]> {
    const map = this.getYearPhotos();
    const current = map[yearId] ?? [];
    const byId = new Map(current.map((p) => [p.id, p]));
    const next: YearPhoto[] = [];
    for (const id of orderedIds) {
      const photo = byId.get(id);
      if (photo) {
        next.push(photo);
        byId.delete(id);
      }
    }
    next.push(...byId.values());
    map[yearId] = next;
    write(K.timelinePhotos, map);
    return map;
  },

  reset(): void {
    Object.values(K).forEach((k) => localStorage.removeItem(k));
  },
};

export type Store = typeof store;