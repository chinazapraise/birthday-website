import type { TimelineYear, MicroMemory } from "@/lib/types";

/*
 * SEED CONTENT — TOMIDE'S REAL STORY, 2016–2026.
 * Each year is Tomide's own copy. Do not rewrite or embellish the facts.
 * Media ids, placeholder labels, aspects and themes are the stable
 * structure — uploaded photos (admin) overlay via url on those ids.
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
    title: "I just wanted to study medicine.",
    story:
      "I entered the University of Abuja in 2016 to study Agricultural Sciences. I was young, innocent, very naive, and if you had asked me what I actually wanted to study, the answer was medicine.\n\nBut after waiting one or two years for admission, I eventually gave in and took what was in front of me. Agricultural Sciences it was.\n\nI was also teaching in a secondary school at the time, earning about ₦7,000 a month. It wasn't much, but at that age, it was something.\n\nOh, and I got my first kiss that year.\n\nSo maybe Agricultural Sciences wasn't entirely a bad decision.",
    funnyAnnotation: "If 2016 me could see all of this… 😂",
    location: "[ABUJA, NIGERIA]",
    media: [
      M("2016-1", "PHOTO PLACEHOLDER · 2016 HERO · portrait 4:5"),
      M("2016-2", "PHOTO PLACEHOLDER · 2016 MEMORY 01 · landscape 16:9", "16:9"),
      M("2016-3", "PHOTO PLACEHOLDER · 2016 MEMORY 02 · portrait 4:5"),
      M("2016-4", "PHOTO PLACEHOLDER · 2016 MEMORY 03 · landscape 16:9", "16:9"),
      M("2016-5", "PHOTO PLACEHOLDER · 2016 MEMORY 04 · portrait 4:5"),
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
    title: "Four-pointer. Politics. And girls.",
    story:
      "Academically, I was doing really well. I was a four-pointer, one of the top students in my department.\n\nThen there were girls.\n\nAnd somewhere between maintaining my grades and discovering that university had a lot more to offer than lectures, I found something else I really liked: politics.\n\nI wanted to run for Treasurer of the Faculty of Agricultural Sciences, but apparently I was too young for the position. You had to be at least 300 level.\n\nSo I went for Auditor-General instead.\n\nAnd that was my introduction to school politics.",
    quote: "Four-pointer. Top of the department. Then there were girls.",
    location: "[ABUJA, NIGERIA]",
    media: [
      M("2017-1", "PHOTO PLACEHOLDER · 2017 01 · portrait 4:5"),
      M("2017-2", "PHOTO PLACEHOLDER · 2017 02 · portrait 4:5"),
      M("2017-3", "PHOTO PLACEHOLDER · 2017 03 · portrait 4:5"),
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
    title: "Popular. Broke. And somehow still a four-pointer.",
    story:
      "By 2018, I was already deep into school politics.\n\nI was an executive member of the faculty, handling things, pulling strings, knowing people, and slowly becoming that guy everybody seemed to know.\n\nI was still a four-pointer, though politics had probably pushed me down to somewhere around the top ten in my class by then.\n\nAnd I was still very gullible.\n\nBut I was popular.\n\nVery popular.\n\nAnd very broke.\n\nAn interesting combination, if you ask me.",
    funnyAnnotation:
      "I genuinely thought I had everything figured out here 😂",
    location: "[ABUJA, NIGERIA]",
    media: [
      M("2018-1", "PHOTO PLACEHOLDER · 2018 HERO · portrait 4:5"),
      M("2018-2", "PHOTO PLACEHOLDER · 2018 MEMORY 01 · landscape 16:9", "16:9"),
      M("2018-3", "PHOTO PLACEHOLDER · 2018 MEMORY 02 · portrait 4:5"),
      M("2018-4", "PHOTO PLACEHOLDER · 2018 MEMORY 03 · landscape 16:9", "16:9"),
      M("2018-5", "PHOTO PLACEHOLDER · 2018 MEMORY 04 · portrait 4:5"),
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
    title: "This was the year I could have done fraud.",
    story:
      "And I mean that quite literally.\n\nAlmost everyone around me seemed to be doing it. Close friends, school friends, people I grew up with, even people I knew from a distance. It was everywhere.\n\nIf there was ever a point in my life where I could have chosen that path, this was probably it.\n\nBut I didn't.\n\nInstead, I was still deep in school politics, and this was the year I began campaigning to become the Financial Secretary of my faculty. I wanted that position badly, though things wouldn't eventually go the way I planned.\n\n2019 also took me outside Abuja for the first time since I started university. I moved to Nasarawa State for my six-month internship at Rayuwa Farms.\n\nI lived there on my own, picked up teaching jobs on the side, and experienced a different kind of independence for the first time.\n\nIn hindsight, there were a lot of different directions my life could have taken that year.\n\nI'm grateful for the one I chose.",
    quote: "If I was ever going to choose that life, 2019 would have been the year.",
    location: "[NASARAWA, NIGERIA]",
    media: [
      M("2019-1", "PHOTO PLACEHOLDER · 2019 01 · portrait 4:5"),
      M("2019-2", "PHOTO PLACEHOLDER · 2019 02 · portrait 4:5"),
      M("2019-3", "PHOTO PLACEHOLDER · 2019 03 · portrait 4:5"),
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
    title: "The year everything paused.",
    story:
      "Then Covid happened.\n\nThe world stopped. School stopped. Plans stopped. And for the first time in my life, I understood what it felt like to be depressed.\n\nI was doing home lessons at the time, trying to make some money. Then one day, something happened that made me feel so embarrassed and condescended to that I simply walked out of the house.\n\nI left without collecting a single naira.\n\nI didn't have much, but apparently I had pride.\n\nWith everything else on pause, I found other things to occupy myself. I learned how to play the guitar. I learned the keyboard.\n\nIt was a strange year. Quiet, difficult, confusing, but somehow, I was still becoming someone.",
    location: "[NASARAWA, NIGERIA]",
    media: [
      M("2020-1", "PHOTO PLACEHOLDER · 2020 01 · landscape 16:9", "16:9"),
      M("2020-2", "PHOTO PLACEHOLDER · 2020 02 · landscape 16:9", "16:9"),
      M("2020-3", "PHOTO PLACEHOLDER · 2020 03 · landscape 16:9", "16:9"),
      M("2020-4", "PHOTO PLACEHOLDER · 2020 04 · landscape 16:9", "16:9"),
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
    title: "Somehow, I was still standing.",
    story:
      "This was supposed to be the final stretch.\n\nI was still among the top ten students in my department, but by now, school politics had become a huge part of my university story too. Things didn't always go the way I wanted politically, because, well, politics is politics.\n\nBut somehow, I had become one of the most influential students in my faculty.\n\nAnd apparently, people noticed.\n\nI won the Dean's Award for Most Influential Male in the faculty. I won Political Activist of the Year. There were multiple awards that year, all while I was still managing to stay among the top students in my department.\n\nAt our final dinner, my brand also won Most Creative Brand of the Year.\n\nAnd after everything, this was the year I finally graduated from the University of Abuja with a 2:1.\n\nNot bad for the naive boy who entered university five years earlier just wanting to study medicine.",
    location: "[ABUJA, NIGERIA]",
    media: [
      M("2021-1", "PHOTO PLACEHOLDER · 2021 HERO · full-bleed 16:9", "16:9"),
      M("2021-2", "PHOTO PLACEHOLDER · 2021 MEMORY 01 · portrait 4:5"),
      M("2021-3", "PHOTO PLACEHOLDER · 2021 MEMORY 02 · portrait 4:5"),
      M("2021-4", "PHOTO PLACEHOLDER · 2021 MEMORY 03 · portrait 4:5"),
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
    title: "This is where everything you know about me began.",
    story:
      "2022 was a strange year.\n\nSchool was supposed to be over, but the ASUU strike disrupted everything and delayed NYSC. After spending so many years believing my life would follow a certain timeline, suddenly I was stuck.\n\nAnd I got depressed again.\n\nBut somewhere inside that uncertainty, I found something far more important. I found purpose.\n\nI started reading seriously. I came across Brian Tracy's No Excuses! and began confronting the idea that my life was ultimately my responsibility.\n\nI started writing.\n\nI attended an event that changed the direction of my life.\n\nAnd slowly, almost without realizing what was happening, the version of me you know today started showing up.\n\nWhen I look back now, I'm incredibly grateful for 2022, because what felt like a delay at the time was actually the beginning.",
    location: "[ABUJA, NIGERIA]",
    media: [
      {
        id: "2022-1",
        type: "artifact",
        placeholderLabel:
          "PHOTO PLACEHOLDER · WhatsApp screenshot / artifact 01",
        alt: "whatsapp screenshot placeholder",
        aspect: "4:5",
      },
      {
        id: "2022-2",
        type: "artifact",
        placeholderLabel: "PHOTO PLACEHOLDER · artifact 02",
        alt: "artifact placeholder",
        aspect: "4:5",
      },
      {
        id: "2022-3",
        type: "artifact",
        placeholderLabel: "PHOTO PLACEHOLDER · artifact 03",
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
    title: "January 1st. And then everything changed.",
    story:
      "January 1st, 2023 was the day I went viral on LinkedIn.\n\nAnd literally the next day, I packed my bags and moved to Jos for NYSC.\n\nIt was the longest I had ever been away from my family. New city, new people, very cold weather, and I even got scammed trying to get an apartment.\n\nBut somewhere along the way, I fell in love with Jos.\n\nI also fell in love in Jos. Three times, actually.\n\nNone of those lasted.\n\nLinkedIn did, though.\n\nI became that creator people seemed to see everywhere. I was serving at the University of Jos, building my career, working with companies like TBT Agro and Whoosh, and somewhere in the middle of all that, I made my first $1,000 as a marketing copywriter.\n\nA year earlier, I was still trying to figure out what I wanted to do with my life.\n\nNow, somehow, it was becoming a life.",
    funnyAnnotation:
      "I arrived in Jos not knowing what was waiting for me. By the time I left, I didn't really want to leave.",
    location: "[JOS, NIGERIA]",
    media: [
      M("2023-1", "PHOTO PLACEHOLDER · 2023 01 · portrait 4:5"),
      M("2023-2", "PHOTO PLACEHOLDER · 2023 02 · portrait 4:5"),
      M("2023-3", "PHOTO PLACEHOLDER · 2023 03 · landscape 16:9", "16:9"),
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
    title: "And then God said Lagos.",
    story:
      "After NYSC, I found myself at a crossroads.\n\nI could return to Abuja, where my family was. I could stay in Jos, a city I had grown to love. Or I could move to Lagos, where I barely knew anyone.\n\nEverything was actually going fine. I didn't need some dramatic escape.\n\nBut I prayed about it.\n\nAnd God said Lagos.\n\nSo I packed my bags again and moved to what felt like a strange man's land.\n\nI'm not going to romanticize it. I cried. I missed my family terribly, and sometimes, Lagos has been a very lonely ride.\n\nBut Lagos also opened up my world.\n\nLinkedIn took me beyond the internet and onto stages. I travelled around Nigeria, speaking at more than seven LinkedIn Local events that year. I was meeting people I had only known online, discovering that this thing I had built from my phone could actually take me places.\n\nAnd somehow, the place that scared me most became one of the best decisions I've ever made.",
    location: "[LAGOS, NIGERIA]",
    media: [
      M("2024-1", "PHOTO PLACEHOLDER · 2024 01"),
      M("2024-2", "PHOTO PLACEHOLDER · 2024 02"),
      M("2024-3", "PHOTO PLACEHOLDER · 2024 03"),
      M("2024-4", "PHOTO PLACEHOLDER · 2024 04"),
      M("2024-5", "PHOTO PLACEHOLDER · 2024 05"),
      M("2024-6", "PHOTO PLACEHOLDER · 2024 06"),
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
    title: "I knew something had to change.",
    story:
      "By 2025, things looked good from the outside.\n\nI was travelling, speaking, building my career, getting opportunities. I spoke at multiple physical events, did another LinkedIn Local, and somehow found myself standing on two TEDx stages that year.\n\nBut internally, I knew I needed a new direction.\n\nSo I prayed.\n\nI remember doing about 30 days of fasting, asking God for clarity about what was next.\n\nAnd clarity came.\n\nI felt led to speak to someone. That one conversation opened a door that changed the direction of my career.\n\nThat was how I found product marketing.\n\nI went on to work across different companies and markets, including Koppoh and AccInvest, building products, campaigns and acquisition systems, and learning an entirely different side of business.\n\nAfter years of being known primarily for LinkedIn, I was discovering another version of myself.\n\nAnd I loved it.",
    quote: "Sometimes the answer to a prayer looks like one conversation.",
    location: "[LAGOS, NIGERIA]",
    media: [
      M("2025-a", "PHOTO PLACEHOLDER · 2025 01 · portrait 4:5"),
      M("2025-b", "PHOTO PLACEHOLDER · 2025 02 · portrait 4:5"),
      M("2025-c", "PHOTO PLACEHOLDER · 2025 03 · portrait 4:5"),
      M("2025-d", "PHOTO PLACEHOLDER · 2025 04 · portrait 4:5"),
      M("2025-e", "PHOTO PLACEHOLDER · 2025 05 · portrait 4:5"),
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
    title: "Plot twist. I became the AI guy.",
    story:
      "I definitely didn't see this one coming.\n\nI entered the year as a product marketer who happened to use AI.\n\nThen somehow, AI became the thing.\n\nI started building with it. Websites, apps, automations, agents, internal tools. One became ten, ten became more, and before I knew it, I had built over 30 AI-powered products and systems without taking the traditional developer route.\n\nAnd then people started knowing me for it.\n\nThe LinkedIn guy had become the product marketing guy. And now, somehow, the product marketing guy was becoming the AI guy.\n\nBut maybe that's the actual story of the last ten years.\n\nI keep evolving.\n\nI learn. I build. I change. I become something I didn't see coming.\n\nSo at 27, I don't think I've arrived.\n\nThis is just the beginning.\n\nAnd if you come back tomorrow and I'm doing something completely different, don't be surprised.\n\nApparently, that's what I do.",
    location: "[LAGOS, NIGERIA]",
    media: [
      M("2026-1", "PHOTO PLACEHOLDER · 2026 CURRENT · portrait 4:5"),
      M("2026-2", "PHOTO PLACEHOLDER · 2026 02 · landscape 16:9", "16:9"),
      M("2026-3", "PHOTO PLACEHOLDER · 2026 03 · portrait 4:5"),
      M("2026-4", "PHOTO PLACEHOLDER · 2026 04 · landscape 16:9", "16:9"),
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
    note: "And nobody knew COVID was coming. Nobody knew the whole world was about to pause, the plans, the motion, everything.\n\nWho would have ever thought that COVID would become part of the story?",
    year: 2019,
    accent: "#f43f9e",
  },
  {
    id: "mm-2",
    type: "Core memory",
    label: "2021.",
    note: "I came into university quiet, young and naive. I left with a 2:1, multiple awards, a brand people recognized, and somehow, as one of the people everybody knew.",
    year: 2021,
    accent: "#22d3ee",
  },
  {
    id: "mm-3",
    type: "God did.",
    label: "2023.",
    note: "I arrived in Jos not knowing what was waiting for me. By the time I left, I didn't really want to leave.",
    year: 2023,
    accent: "#f5c97b",
  },
  {
    id: "mm-4",
    type: "Core memory",
    label: "2024.",
    note: "I had three choices. Somehow, God chose the one that scared me most.",
    year: 2024,
    accent: "#f43f9e",
  },
  {
    id: "mm-5",
    type: "This aged badly",
    label: "2025.",
    note: "I thought I had figured out what I wanted to be known for. Apparently, God had other plans.",
    year: 2025,
    accent: "#ff7a3d",
  },
  {
    id: "mm-6",
    type: "Core memory",
    label: "To be continued…",
    note: "There's probably another version of me I haven't met yet. And that's the exciting part.",
    year: 2026,
    accent: "#fbbf24",
  },
];