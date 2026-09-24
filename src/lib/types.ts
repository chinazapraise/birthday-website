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

export interface WishlistItem {
  id: string;
  name: string;
  description: string;
  funnyNote?: string;
  imageUrl?: string;
  price: number;
  currency: string;
  purchaseUrl?: string;
  targetAmount: number;
  amountConfirmed: number;
  quantity: number;
  quantityReserved: number;
  allowClaim: boolean;
  allowContribution: boolean;
  status:
    | "available"
    | "reserved"
    | "partially funded"
    | "funded"
    | "purchased"
    | "received"
    | "hidden";
  sortOrder: number;
  createdAt: string;
}

export interface GiftClaim {
  id: string;
  wishlistItemId: string;
  claimantName: string;
  contact?: string;
  note?: string;
  anonymousToPublic: boolean;
  status: "active" | "released" | "fulfilled";
  createdAt: string;
}

export interface Contribution {
  id: string;
  wishlistItemId: string;
  contributorName: string;
  amount: number;
  currency: string;
  paymentReference?: string;
  paymentStatus: "initiated" | "pending" | "successful" | "failed";
  anonymous: boolean;
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