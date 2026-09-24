"use client";

import {
  wishesSeed,
  storiesSeed,
  wishlistSeed,
  siteSettingsSeed,
} from "@/lib/content/site";
import type {
  Wish,
  CommunityStory,
  WishlistItem,
  GiftClaim,
  GiftReserve,
  Contribution,
  SiteSettings,
  WishSubmission,
  StorySubmission,
} from "@/lib/types";

/*
 * STORE
 * LocalStorage-backed store with a clean interface. Swap `impl` for a
 * Supabase adapter to go realtime + multi-device (see README section).
 * All seeds mirror the timeline content so the site works out of the box.
 */

const K = {
  wishes: "birthday.wishes",
  stories: "birthday.stories",
  // v2: seed gained per-gift funny one-liners; bumps force everyone to
  // the fresh seed and release every gift (no stale local snapshots).
  wishlist: "birthday.wishlist.v2",
  claims: "birthday.claims.v2",
  reserves: "birthday.reserves.v2",
  contributions: "birthday.contributions.v2",
  settings: "birthday.settings",
  // Uploaded photos for the timeline — mediaId -> dataUrl. Seed media
  // structure is untouched; this map overlays onto timelineSeed.
  timelineMedia: "birthday.timeline.media",
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
  return stored;
}
function loadSettings(): SiteSettings {
  const stored = read<SiteSettings>(K.settings, siteSettingsSeed);
  return { ...siteSettingsSeed, ...stored };
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
    return full;
  },

  updateClaim(id: string, patch: Partial<GiftClaim>): GiftClaim[] {
    const claims = read<GiftClaim[]>(K.claims, []).map((c) =>
      c.id === id ? { ...c, ...patch } : c,
    );
    write(K.claims, claims);
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
  ): void {
    const all = read<Contribution[]>(K.contributions, []);
    all.push({
      ...contribution,
      id: uid(),
      paymentStatus: "initiated",
      createdAt: new Date().toISOString(),
    });
    write(K.contributions, all);
  },

  markPaymentAttempted(id: string): void {
    const all = read<Contribution[]>(K.contributions, []).map((c) =>
      c.id === id
        ? { ...c, paymentStatus: "pending" as const }
        : c,
    );
    write(K.contributions, all);
  },

  getSettings(): SiteSettings {
    return loadSettings();
  },

  updateSettings(patch: Partial<SiteSettings>): SiteSettings {
    const next = { ...loadSettings(), ...patch };
    write(K.settings, next);
    return next;
  },

  getTimelineMedia(): Record<string, string> {
    return read<Record<string, string>>(K.timelineMedia, {});
  },

  setTimelineMedia(id: string, url: string): Record<string, string> {
    const map = read<Record<string, string>>(K.timelineMedia, {});
    map[id] = url;
    write(K.timelineMedia, map);
    return map;
  },

  removeTimelineMedia(id: string): Record<string, string> {
    const map = read<Record<string, string>>(K.timelineMedia, {});
    delete map[id];
    write(K.timelineMedia, map);
    return map;
  },

  reset(): void {
    Object.values(K).forEach((k) => localStorage.removeItem(k));
  },
};

export type Store = typeof store;