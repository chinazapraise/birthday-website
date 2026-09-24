import type { TimelineYear, MicroMemory } from "@/lib/types";

/*
 * SEED CONTENT — PLACEHOLDER BIOGRAPHY
 * Every story line below is a clearly-labelled placeholder.
 * Replace with Tomide's real stories via /manage or by editing this file.
 * Never confuse placeholder copy with actual biography.
 */

const M = (
  id: string,
  placeholderLabel: string,
  aspect = "4:5",
): TimelineYear["media"][number] => ({
  id,
  type: "image",
  placeholderLabel,
  alt: placeholderLabel.toLowerCase(),
  aspect,
});

export const timelineSeed: TimelineYear[] = [
  {
    id: "y2016",
    year: 2016,
    title: "The beginning of this chapter.",
    story:
      "[STORY PLACEHOLDER] Where this chapter starts. A sentence or two about the year, the mood, and what was on the horizon.",
    whatIThought: "[WHAT I THOUGHT THEN] placeholder",
    funnyAnnotation:
      "If 2016 me could see all of this… 😂",
    location: "[LOCATION]",
    peopleTags: ["[PEOPLE TAG]"],
    media: [
      M("2016-1", "PHOTO PLACEHOLDER — 2016 HERO — portrait 4:5"),
      M("2016-2", "PHOTO PLACEHOLDER — 2016 MEMORY 01 — landscape 16:9", "16:9"),
    ],
    layoutVariant: "editorial",
    theme: {
      accent: "#a78bfa",
      accent2: "#7c3aed",
      glow: "#a78bfa",
    },
  },
  {
    id: "y2017",
    year: 2017,
    title: "[CHAPTER TITLE PLACEHOLDER]",
    story:
      "[2–6 SENTENCE STORY PLACEHOLDER] Describe what happened this year and why it mattered.",
    quote: "[QUOTE PLACEHOLDER]",
    lesson: "[LESSON OR PLOT TWIST]",
    plotTwist: "[PLOT TWIST PLACEHOLDER]",
    location: "[LOCATION]",
    peopleTags: ["[PEOPLE TAG]"],
    media: [
      M("2017-1", "PHOTO PLACEHOLDER — 2017 01 — portrait 4:5"),
      M("2017-2", "PHOTO PLACEHOLDER — 2017 02 — portrait 4:5"),
      M("2017-3", "PHOTO PLACEHOLDER — 2017 03 — portrait 4:5"),
    ],
    layoutVariant: "polaroid",
    theme: {
      accent: "#22d3ee",
      accent2: "#0e7490",
      glow: "#22d3ee",
    },
  },
  {
    id: "y2018",
    year: 2018,
    title: "The beginning of this chapter.",
    story:
      "[STORY PLACEHOLDER] Where this chapter starts. A sentence or two about the year, the mood, and what was on the horizon.",
    whatIThought: "[WHAT I THOUGHT THEN] placeholder",
    funnyAnnotation:
      "I genuinely thought I had everything figured out here 😂",
    location: "[LOCATION]",
    peopleTags: ["[PEOPLE TAG]"],
    media: [
      M("2018-1", "PHOTO PLACEHOLDER — 2018 HERO — portrait 4:5"),
      M("2018-2", "PHOTO PLACEHOLDER — 2018 MEMORY 01 — landscape 16:9", "16:9"),
    ],
    layoutVariant: "editorial",
    theme: {
      accent: "#8b5cf6",
      accent2: "#6d28d9",
      glow: "#8b5cf6",
    },
  },
  {
    id: "y2019",
    year: 2019,
    title: "[CHAPTER TITLE PLACEHOLDER]",
    story:
      "[2–6 SENTENCE STORY PLACEHOLDER] Describe what happened this year and why it mattered.",
    quote: "[QUOTE PLACEHOLDER]",
    lesson: "[LESSON OR PLOT TWIST]",
    plotTwist: "[PLOT TWIST PLACEHOLDER]",
    location: "[LOCATION]",
    peopleTags: ["[PEOPLE TAG]"],
    media: [
      M("2019-1", "PHOTO PLACEHOLDER — 2019 01 — portrait 4:5"),
      M("2019-2", "PHOTO PLACEHOLDER — 2019 02 — portrait 4:5"),
      M("2019-3", "PHOTO PLACEHOLDER — 2019 03 — portrait 4:5"),
    ],
    layoutVariant: "polaroid",
    theme: {
      accent: "#f43f9e",
      accent2: "#ec4899",
      glow: "#f43f9e",
    },
  },
  {
    id: "y2020",
    year: 2020,
    title: "[CHAPTER TITLE PLACEHOLDER]",
    story:
      "[2–6 SENTENCE STORY PLACEHOLDER] The year the world changed — what shifted, what stayed.",
    whatIThought: "[WHAT I THOUGHT THEN] placeholder",
    funnyAnnotation: "[FUNNY ANNOTATION]",
    location: "[LOCATION]",
    peopleTags: ["[PEOPLE TAG]"],
    media: [
      M("2020-1", "PHOTO PLACEHOLDER — 2020 01 — landscape 16:9", "16:9"),
      M("2020-2", "PHOTO PLACEHOLDER — 2020 02 — landscape 16:9", "16:9"),
      M("2020-3", "PHOTO PLACEHOLDER — 2020 03 — landscape 16:9", "16:9"),
      M("2020-4", "PHOTO PLACEHOLDER — 2020 04 — landscape 16:9", "16:9"),
    ],
    layoutVariant: "filmstrip",
    theme: {
      accent: "#22d3ee",
      accent2: "#0891b2",
      glow: "#22d3ee",
    },
  },
  {
    id: "y2021",
    year: 2021,
    title: "[CHAPTER TITLE PLACEHOLDER]",
    story:
      "[2–6 SENTENCE STORY PLACEHOLDER] This year lives in one image. Text floats over it.",
    location: "[LOCATION]",
    peopleTags: ["[PEOPLE TAG]"],
    media: [
      M("2021-1", "PHOTO PLACEHOLDER — 2021 HERO — full-bleed 16:9", "16:9"),
    ],
    layoutVariant: "fullbleed",
    theme: {
      accent: "#ff7a3d",
      accent2: "#fb923c",
      glow: "#ff7a3d",
    },
  },
  {
    id: "y2022",
    year: 2022,
    title: "[CHAPTER TITLE PLACEHOLDER]",
    story:
      "[2–6 SENTENCE STORY PLACEHOLDER] Screenshots, notes, receipts. The year as an archive.",
    whatIThought: "[WHAT I THOUGHT THEN] placeholder",
    funnyAnnotation: "[FUNNY ANNOTATION]",
    location: "[LOCATION]",
    media: [
      {
        id: "2022-1",
        type: "artifact",
        placeholderLabel:
          "PHOTO PLACEHOLDER — WhatsApp screenshot / artifact 01",
        alt: "whatsapp screenshot placeholder",
        aspect: "4:5",
      },
      {
        id: "2022-2",
        type: "artifact",
        placeholderLabel: "PHOTO PLACEHOLDER — artifact 02",
        alt: "artifact placeholder",
        aspect: "4:5",
      },
      {
        id: "2022-3",
        type: "artifact",
        placeholderLabel: "PHOTO PLACEHOLDER — artifact 03",
        alt: "artifact placeholder",
        aspect: "4:5",
      },
    ],
    layoutVariant: "archive",
    theme: {
      accent: "#f5c97b",
      accent2: "#d4a34f",
      glow: "#f5c97b",
    },
  },
  {
    id: "y2023",
    year: 2023,
    title: "[CHAPTER TITLE PLACEHOLDER]",
    story:
      "[2–6 SENTENCE STORY PLACEHOLDER] Tape, handwritten notes, torn paper. Kept on purpose.",
    funnyAnnotation: "[HANDWRITTEN CAPTION PLACEHOLDER]",
    location: "[LOCATION]",
    peopleTags: ["[PEOPLE TAG]"],
    media: [
      M("2023-1", "PHOTO PLACEHOLDER — 2023 01 — portrait 4:5"),
      M("2023-2", "PHOTO PLACEHOLDER — 2023 02 — portrait 4:5"),
      M("2023-3", "PHOTO PLACEHOLDER — 2023 03 — landscape 16:9", "16:9"),
    ],
    layoutVariant: "scrapbook",
    theme: {
      accent: "#a78bfa",
      accent2: "#8b5cf6",
      glow: "#a78bfa",
    },
  },
  {
    id: "y2024",
    year: 2024,
    title: "[CHAPTER TITLE PLACEHOLDER]",
    story:
      "[2–6 SENTENCE STORY PLACEHOLDER] A mosaic of moments. Little squares of the year.",
    location: "[LOCATION]",
    media: [
      M("2024-1", "PHOTO PLACEHOLDER — 2024 01"),
      M("2024-2", "PHOTO PLACEHOLDER — 2024 02"),
      M("2024-3", "PHOTO PLACEHOLDER — 2024 03"),
      M("2024-4", "PHOTO PLACEHOLDER — 2024 04"),
      M("2024-5", "PHOTO PLACEHOLDER — 2024 05"),
      M("2024-6", "PHOTO PLACEHOLDER — 2024 06"),
    ],
    layoutVariant: "mosaic",
    theme: {
      accent: "#f43f9e",
      accent2: "#8b5cf6",
      glow: "#a855f7",
    },
  },
  {
    id: "y2025",
    year: 2025,
    title: "[CHAPTER TITLE PLACEHOLDER]",
    story:
      "[2–6 SENTENCE STORY PLACEHOLDER] The year I was 25. The before, and the after.",
    whatIThought: "[WHAT I THOUGHT THEN] placeholder",
    quote: "[QUOTE PLACEHOLDER]",
    location: "[LOCATION]",
    peopleTags: ["[PEOPLE TAG]"],
    media: [
      M("2025-a", "PHOTO PLACEHOLDER — 2025 BEFORE — portrait 4:5"),
      M("2025-b", "PHOTO PLACEHOLDER — 2025 AFTER — portrait 4:5"),
    ],
    layoutVariant: "beforeafter",
    theme: {
      accent: "#ff9a5d",
      accent2: "#f43f9e",
      glow: "#fdba74",
    },
  },
  {
    id: "y2026",
    year: 2026,
    title: "And somehow, I'm 27.",
    story:
      "The story isn't over. The timeline reaches the present day, pauses — then keeps drawing forward. You're part of what happens next.",
    location: "[LOCATION]",
    peopleTags: ["[PEOPLE TAG]"],
    media: [
      M("2026-1", "PHOTO PLACEHOLDER — 2026 CURRENT — portrait 4:5"),
      M("2026-2", "PHOTO PLACEHOLDER — 2026 02 — landscape 16:9", "16:9"),
    ],
    layoutVariant: "editorial",
    theme: {
      accent: "#f5c97b",
      accent2: "#fbbf24",
      glow: "#fbbf24",
    },
  },
];

export const microMemoriesSeed: MicroMemory[] = [
  {
    id: "mm-1",
    type: "Plot twist",
    label: "2020.",
    note: "And then Covid happened. The whole world paused — so did the plans, the timelines, everything. The kind of plot twist nobody saw coming.",
    year: 2020,
    accent: "#f43f9e",
  },
  {
    id: "mm-2",
    type: "Core memory",
    label: "[MICRO-MEMORY PLACEHOLDER]",
    note: "A moment worth keeping forever.",
    year: 2021,
    accent: "#22d3ee",
  },
  {
    id: "mm-3",
    type: "God did.",
    label: "[MICRO-MEMORY PLACEHOLDER]",
    note: "You could not have scripted this one.",
    year: 2023,
    accent: "#f5c97b",
  },
  {
    id: "mm-4",
    type: "This aged badly",
    label: "[MICRO-MEMORY PLACEHOLDER]",
    note: "In a few years, this one will be funny.",
    year: 2025,
    accent: "#ff7a3d",
  },
];