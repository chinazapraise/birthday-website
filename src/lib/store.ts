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
  wishlist: "birthday.wishlist",
  claims: "birthday.claims",
  contributions: "birthday.contributions",
  settings: "birthday.settings",
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
  return stored.length ? stored : wishlistSeed;
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
    return read<GiftClaim[]>(K.claims, []);
  },

  addClaim(claim: Omit<GiftClaim, "id" | "createdAt" | "status">): GiftClaim {
    const claims = read<GiftClaim[]>(K.claims, []);
    const full: GiftClaim = {
      ...claim,
      id: uid(),
      status: "active",
      createdAt: new Date().toISOString(),
    };
    claims.push(full);
    write(K.claims, claims);

    // prevent double booking: decrement available quantity / reserve
    const items = loadWishlist().map((item) => {
      if (item.id !== claim.wishlistItemId) return item;
      const available = item.quantity - item.quantityReserved;
      if (available >= 1) {
        return {
          ...item,
          quantityReserved: item.quantityReserved + 1,
          status: (item.status === "available" ? "reserved" : item.status) as
            | "available"
            | "reserved"
            | "partially funded"
            | "funded"
            | "purchased"
            | "received"
            | "hidden",
        };
      }
      return item;
    });
    write(K.wishlist, items);
    return full;
  },

  getContributions(): Contribution[] {
    return read<Contribution[]>(K.contributions, []);
  },

  addContribution(
    contribution: Omit<Contribution, "id" | "createdAt" | "paymentStatus">,
  ): void {
    const all = read<Contribution[]>(K.contributions, []);
    all.push({
      ...contribution,
      id: uid(),
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    });
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

  reset(): void {
    Object.values(K).forEach((k) => localStorage.removeItem(k));
  },
};

export type Store = typeof store;