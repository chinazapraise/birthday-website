import type { SiteSettings, WishlistItem, Wish, CommunityStory } from "@/lib/types";

export const siteSettingsSeed: SiteSettings = {
  siteTitle: "CHINAZA / 21",
  heroCopy: {
    headline: "21",
    subline: "The story of who I have been, what I have learned, and who I am becoming.",
    supporting: "2010-2026. A lifetime in chapters, and the story is still unfolding.",
    cta: "Enter my story",
    skip: "Skip to the birthday",
  },
  birthdayDate: "2026-10-20T00:00:00",
  birthdayTimezone: "Africa/Lagos",
  countdownMode: "birthday",
  birthdayLockMode: false,
  subscriptionsPaused: false,
  social: {
    instagram: "",
    linkedin: "",
    twitter: "",
    whatsapp: "https://wa.me/2349160631930",
  },
  wishlistTitle: "21 things I'd love.",
  wishlistCopy: "No pressure. A few things I would love as I step into 21. Every thoughtful gesture is appreciated. 🤍",
  people: [
    {
      id: "p-1",
      name: "[PERSON 01]",
      role: "[RELATIONSHIP / ROLE]",
      sentence: "[ONE SHORT SENTENCE]",
      years: [2024],
    },
    {
      id: "p-2",
      name: "[PERSON 02]",
      role: "[RELATIONSHIP / ROLE]",
      sentence: "[ONE SHORT SENTENCE]",
      years: [2020],
    },
    {
      id: "p-3",
      name: "[PERSON 03]",
      role: "[RELATIONSHIP / ROLE]",
      sentence: "[ONE SHORT SENTENCE]",
      years: [2021],
    },
  ],
  endingGratitude:
    "Thank you for sixteen years of memories, love, and growing together. As I step into 21, I am grateful for everyone who has been part of my story. You are a piece of what makes it beautiful.",
};

export const wishlistSeed: WishlistItem[] = [
  {
    id: "g-1",
    name: "An HP EliteBook",
    description:
      "An HP EliteBook preferably with 16GB RAM and a 512GB SSD, preferably an HP EliteBook 8 G1i or another suitable model, would mean so much to me. I would love a laptop that supports my studies, coding journey, and exploration of opportunities as I grow. Start here if the Lord has laid me heavily on your heart.",
    funnyNote: "My phone is screaming for help. Please let it rest. 😭😂",
    kind: "expensive",
    sortOrder: 1,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-2",
    name: "A Fully Paid Cybersecurity Course",
    description:
      "Pay for it and send me the login details. Full access to the course and its learning materials would mean so much to me.",
    funnyNote: "Lets turn this interest into a skill.❤️",
    kind: "multi",
    sortOrder: 2,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-3",
    name: "A Midwifery Kit",
    description:
      "A midwifery kit to support my training, practical sessions, and preparation for the work ahead. It would be a thoughtful and useful addition to my journey as a future midwife.",
    funnyNote: "Future midwife loading… ❤️",
    kind: "multi",
    sortOrder: 3,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-4",
    name: "Red Velvet Cake",
    description:
      "A lovely red velvet cake to make my birthday celebration even sweeter.",
    funnyNote: "It's my birthday. The calories can mind their business.😂",
    kind: "single",
    sortOrder: 4,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-5",
    name: "Wardrobe Upgrade",
    description:
      "One piece, two pieces, five pieces, an entire outfit. Shirts, trousers, dresses, jackets, native wear. Help me build a wardrobe that reflects the person I am becoming.",
    funnyNote: "The vision is clear. The wardrobe is not cooperating.",
    kind: "multi",
    sortOrder: 5,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-6",
    name: "A Beautiful Bag",
    description:
      "A lovely bag for school, outings, or special occasions. Something beautiful and useful would be perfect.",
    funnyNote:
      "Give my shoulders something to be proud of. 😭😂",
    kind: "multi",
    sortOrder: 6,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-7",
    name: "A Really Good Perfume",
    description:
      "A beautiful, long-lasting fragrance that I would enjoy wearing.",
    funnyNote: "I want to enter the room before I enter the room.",
    kind: "multi",
    sortOrder: 7,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-8",
    name: "A Good Power Bank and Wi-Fi",
    description:
      "Reliable power and internet would make studying, learning, coding, and working on projects much easier.",
    funnyNote: "My phone and I need to stop living on the edge.",
    kind: "multi",
    sortOrder: 8,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-9",
    name: "Nice Books",
    description:
      "Books on faith, personal development, leadership,and other subjects that will help me learn, grow, and become a better version of myself.",
    funnyNote: "Please, good books only.",
    kind: "multi",
    sortOrder: 9,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-10",
    name: "A Cash Gift",
    description:
      "A cash gift is always a lovely option. It gives me the freedom to put it towards something I need, something I have been planning to get, or a goal I am working towards.",
    funnyNote: "Cash is a love language too. 🤍",
    kind: "cash",
    sortOrder: 10,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-11",
    name: "A Nice Wristwatch",
    description:
      "A beautiful wristwatch that I can wear for school, outings, and special occasions. Something elegant, practical, and suited to my style would be lovely.",
    funnyNote: "Let me start checking the time in style.",
    kind: "single",
    sortOrder: 11,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-12",
    name: "Beautiful Experiences",
    description:
      "Visiting an art gallery, going for karaoke, watching a movie at the cinema, or exploring somewhere new. I would love to experience things I have never done before and make beautiful memories along the way.",
    funnyNote: "Let's give my memories something to work with. 🤭",
    kind: "multi",
    sortOrder: 12,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-13",
    name: "Take Me on a Dinner Date",
    description:
      "Pick somewhere beautiful, make the reservation and tell me what time to arrive. I'll bring appetite and conversation.",
    funnyNote: "You pick the place. I'll come hungry.",
    kind: "multi",
    sortOrder: 13,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-14",
    name: "Wall Frames",
    description:
      "Lovely frames for pictures, artwork, or meaningful memories that I can display in my space and enjoy looking at.",
    funnyNote: "My walls deserve to look like somebody lives here.😂",
    kind: "multi",
    sortOrder: 14,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-15",
    name: "A Proper Spa & Massage Day",
    description:
      "Book it. Send me the details. I'll show up and allow strangers to remove 21 years of stress from my body.",
    funnyNote: "Jesus did not die for me to be this stressed. 😭😂",
    kind: "single",
    sortOrder: 15,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-16",
    name: "A Completely Customised Gift",
    description:
      "Something made especially for me that literally belongs to nobody else. A portrait, engraving, acessory, clothing, journal, or another thoughtful creation. Creativity gets extra points.",
    funnyNote: "Just make me something nobody else has.",
    kind: "multi",
    sortOrder: 16,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-17",
    name: "Write Me a Handwritten Letter",
    description:
      "Actual pen. Actual paper. No ChatGPT, please. Tell me what you've watched me become, something I need to hear and what you're praying for me as I enter 21.",
    funnyNote: "And please, I'll know if ChatGPT wrote it.",
    kind: "multi",
    sortOrder: 17,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-18",
    name: "Bless Someone Because I Turned 21",
    description:
      "Find someone who genuinely needs something and sort it out. Food, transport, books, school fees, data, business support, anything. Just tell them somebody turned 21 and apparently that became their business too.",
    funnyNote: "My birthday, your good deed. Everybody wins.",
    kind: "multi",
    sortOrder: 18,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-19",
    name: "A Prayer for My 21st Year",
    description:
      "A sincere prayer for my growth, purpose, future, relationships, and walk with God as I begin this new chapter. Your prayers for me would be a beautiful gift to carry into this new year.",
    funnyNote: "A prayer for my new year is always welcome. 🤍🙏🏽",
    kind: "multi",
    sortOrder: 19,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-20",
    name: "21 of Something",
    description:
      "This one is completely yours. 21 flowers. 21 chocolates. 21 pictures. 21 Bible verses. 21 prayers. 21 memories. 21 tiny gifts. 21 voice notes. Surprise me. There is only one rule: make it 21.",
    funnyNote: "Anything you like. Just count it properly.",
    kind: "multi",
    sortOrder: 20,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "g-21",
    name: "Anything You Can Comfortably Afford",
    description:
      "This list is for fun, not a rulebook. If none of the 21 works for you, get me anything else you can afford and genuinely want to give me. Big, small, random, thoughtful, useful or completely unserious. If it came from you with love, I'll appreciate it.",
    funnyNote: "We are accepting love in all legitimate forms.🤍",
    kind: "multi",
    showClaimCount: true,
    sortOrder: 21,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
  },
];
export const wishesSeed: Wish[] = [];

export const storiesSeed: CommunityStory[] = [];
