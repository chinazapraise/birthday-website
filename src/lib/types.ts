export interface TimelineMedia {
  id: string;
  type: "image" | "video" | "artifact";
  url?: string;
  alt: string;
  caption?: string;
  funnyCaption?: string;
  placeholderLabel: string;
  aspect?: string;
}

export type YearLayoutVariant =
  | "editorial"
  | "polaroid"
  | "filmstrip"
  | "fullbleed"
  | "archive"
  | "scrapbook"
  | "mosaic"
  | "beforeafter"
  | "video";

export interface TimelineYear {
  id: string;
  year: number;
  title: string;
  story: string;
  whatIThought?: string;
  funnyAnnotation?: string;
  quote?: string;
  lesson?: string;
  plotTwist?: string;
  location?: string;
  peopleTags?: string[];
  media: TimelineMedia[];
  layoutVariant: YearLayoutVariant;
  theme: {
    accent: string;
    accent2: string;
    glow: string;
  };
  easterEgg?: string;
  easterEggHint?: string;
}

export interface MicroMemory {
  id: string;
  type:
    | "Plot twist"
    | "I can explain…"
    | "This aged badly"
    | "Core memory"
    | "God did."
    | "Meanwhile…";
  label: string;
  note: string;
  year: number;
  accent: string;
}

export interface Wish {
  id: string;
  senderName: string;
  relationship?: string;
  message: string;
  photoUrl?: string;
  voiceUrl?: string;
  anonymous: boolean;
  status: "published" | "hidden" | "removed";
  createdAt: string;
}

export interface CommunityStory {
  id: string;
  senderName: string;
  meetingContext: string;
  title: string;
  body: string;
  year?: number;
  funnyPromptAnswer?: string;
  photos: string[];
  anonymous_publicly?: boolean;
  status: "published" | "hidden" | "removed";
  featured: boolean;
  createdAt: string;
}

/*
 * WISHLIST MODEL — gift kinds drive every card.
 *
 * single     exclusive — only one active claim. No contributions.
 *            e.g. headphones, spa day, dinner date, letter, perfume, hamper.
 * multi      several people can each get this (a "slot"). Quantity optional.
 *            e.g. flowers, artwork & frames, wardrobe, kitchen, custom gift.
 * expensive  exclusive claim + contributions from many people.
 *            Claim closes the contribution pot.
 *            e.g. MacBook, monitor, Apple Watch, vacation.
 * trip       identical to expensive but copy reads "sponsor".
 * cash       fixed cash gift. No reserve/claim/contribution as such —
 *            each person just gifts the amount. Never closes.
 */

export type GiftKind = "single" | "multi" | "expensive" | "trip" | "cash";

export interface WishlistItem {
  id: string;
  name: string;
  description: string;
  funnyNote?: string;
  kind: GiftKind;
  /** fixed amount for cash gifts, in NGN */
  cashAmount?: number;
  /** per-claim quantity cap for multi gifts (e.g. wall frames = 3) */
  maxQuantity?: number;
  sortOrder: number;
  status: "active" | "hidden";
  createdAt: string;
}

/**
 * Reserve = "I'm interested." Never blocks. Anyone can reserve.
 * anonymous = keep identity private. Hidden from Tomide too.
 */
export interface GiftReserve {
  id: string;
  wishlistItemId: string;
  name: string;
  contact?: string;
  quantity: number;
  anonymous: boolean;
  createdAt: string;
}

/**
 * Claim = "I'm getting this." Blocks single/expensive/trip gifts.
 * anonymous = keep identity private. Hidden from Tomide too.
 */
export interface GiftClaim {
  id: string;
  wishlistItemId: string;
  name: string;
  contact?: string;
  note?: string;
  quantity: number;
  gifted: boolean;
  anonymous: boolean;
  createdAt: string;
}

/**
 * Contribution = money toward an expensive/trip gift, or a cash gift.
 * kind "contribution" → "X people contributed".
 * kind "gift"        → cash gifts, "X people gifted this".
 * anonymous = keep identity private. Hidden from Tomide too.
 */
export interface Contribution {
  id: string;
  wishlistItemId: string;
  email: string;
  amount: number;
  currency: string;
  kind: "contribution" | "gift";
  anonymous: boolean;
  paymentReference?: string;
  paymentStatus: "initiated" | "pending" | "successful" | "failed";
  createdAt: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  sentence: string;
  years?: number[];
  imageUrl?: string;
}

export interface SiteSettings {
  siteTitle: string;
  heroCopy: {
    headline: string;
    subline: string;
    supporting: string;
    cta: string;
    skip: string;
  };
  birthdayDate: string;
  birthdayTimezone: string;
  countdownMode: "countdown" | "birthday" | "after";
  birthdayLockMode: boolean;
  subscriptionsPaused: boolean;
  reducedMotionDefault?: boolean;
  social: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    whatsapp?: string;
  };
  wishlistTitle: string;
  wishlistCopy: string;
  ogImage?: string;
  people: Person[];
  endingGratitude: string;
}

export type WishSubmission = Omit<Wish, "id" | "status" | "createdAt">;
export type StorySubmission = Omit<
  CommunityStory,
  "id" | "status" | "featured" | "createdAt"
>;