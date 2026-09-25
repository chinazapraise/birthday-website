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
    title: "University of Abuja, Faculty of Agriculture",
    story:
      "This is where the story starts.\n\nI finished secondary school in 2015 and spent almost one year trying to get admission to study Medicine and Surgery. I tried different universities, but nothing worked out.\n\nIf you asked me what I wanted to study at the time, my answer was always Medicine.\n\nWhile waiting, I started teaching at a secondary school just to keep myself busy. I was earning around ₦7,000 monthly. It wasn't much, but at the time, it was something.\n\nEventually, I applied to the University of Abuja and got admission to study Agricultural Science.\n\nAgricultural Science was definitely not the plan. 😂\n\nBut I had another plan. I had heard that if you did really well in your first year, you could switch courses. So in my head, the plan was simple. That was exactly what I wanted to do.\n\nEnter with Agricultural Science, get a very good result, then switch to Medicine and Surgery.\n\nI was young, innocent, very naive, and I really believed I had everything figured out.\n\nOf course, things didn't exactly go according to plan.\n\nAnd oh, I got my first kiss that year too.\n\nSo maybe Agricultural Science wasn't a completely bad decision after all.",
    quote: "The journey of a thousand miles begins with one step.",
    location: "[ABUJA, NIGERIA]",
    media: [
      M("2016-1", "PHOTO PLACEHOLDER · 2016 HERO · portrait 4:5"),
      M("2016-2", "PHOTO PLACEHOLDER · 2016 MEMORY 01 · portrait 4:5"),
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
    title: "Academics, Politics & Girls",
    story:
      "When I entered university, I was just this very young boy who still thought he was going to find his way into Medicine somehow.\n\nThen first semester results came out.\n\nI remember being very scared to check mine. I genuinely didn't want to see it. Then someone checked it for me and I found out I was at the top of my department.\n\nThat changed a lot of things.\n\nPeople started noticing me. Attention came. Girls came too. 😂\n\nAnd that was when I started realizing that maybe university had more to offer than just reading books and going to class.\n\nI started meeting more people and getting involved in things outside academics. Somehow, that attention eventually pushed me towards school politics.\n\nI wanted to contest for Treasurer, but I was still too young in the system. I had to wait until at least 300 level before I could really contest for anything serious.\n\nSo I stayed around, watched how things worked, met people and kept building relationships.\n\nAnd somewhere in the middle of academics, politics and girls, something funny happened.\n\nI stopped thinking so much about switching to Medicine.\n\nThe Agricultural Science I thought I was just going to manage for a while was slowly becoming my thing.",
    quote: "It is our choices that show what we truly are, far more than our abilities.",
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
    title: "Popular, Broke & Handsome",
    story:
      "By 2018, I was already deep into school politics.\n\nDepartment politics, faculty politics, everything.\n\nAt this point, I was already the Auditor General of the faculty. I knew people, people knew me, and I had started building a lot of influence around school.\n\nI was especially popular among the 100 and 200 level students.\n\nBy this time I was already in 300 level, enjoying the attention, enjoying the politics, enjoying the whole frenzy around it.\n\nI was popular.\n\nI was also very broke. 😂\n\nAcademically, I had dropped from being at the very top to somewhere around the top five in my department. Politics was definitely taking some of my attention, but I was still doing well.\n\nMore importantly to me at the time, I was building influence.\n\nA lot of it.\n\nI knew I wanted to contest for bigger positions eventually, so I was meeting people, building relationships and making sure my name was known.\n\nAt this point, the whole dream of switching to Medicine had basically disappeared.\n\nSomehow, I was enjoying Agricultural Science now.\n\nSo there I was.\n\nYoung, passionate, popular, broke and enjoying every bit of it.\n\nAnd handsome too, obviously. 😂",
    quote: "Success is stumbling from failure to failure with no loss of enthusiasm.",
    location: "[ABUJA, NIGERIA]",
    media: [
      M("2018-1", "PHOTO PLACEHOLDER · 2018 HERO · portrait 4:5"),
      M("2018-2", "PHOTO PLACEHOLDER · 2018 MEMORY 01 · portrait 4:5"),
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
    title: "The Year I Almost Did Fraud",
    story:
      "I mean that quite literally.\n\nAt the time, almost everyone around me was doing it.\n\nClose friends, school friends, people I grew up with. It was everywhere around me, and this was around the period when internet fraud was really becoming a big thing in Nigeria.\n\nSo yes, I considered it.\n\nI actually almost did it.\n\nI had a friend who was supposed to teach me how everything worked. For some reason, he kept delaying it.\n\nBy the time he eventually reached out to me again, the zeal had already disappeared.\n\nI just didn't want to do it anymore.\n\nAnd looking back now, I'm very glad it happened that way because my life could have taken a completely different direction.\n\nInstead, I focused more on academics and politics. At the time, I genuinely thought I was going to become a politician someday. 😂\n\n2019 was also the first time I really stayed away from my parents for a long period since I got admission.\n\nI moved to Nasarawa State for my six-month internship.\n\nI lived on my own, picked up a teaching job on the side and experienced a different kind of independence for the first time.\n\nI was a little wild around this period too, I won't lie.\n\nBut I was growing up.\n\nLooking back, there were so many directions my life could have gone that year.\n\nI made some good decisions, almost made some terrible ones, and somehow kept moving.\n\nNo regrets.",
    quote: "In matters of conscience, the law of the majority has no place.",
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
    title: "The Year Everything Paused",
    story:
      "Then COVID happened.\n\nWork stopped. School stopped. My internship stopped. Everything just stopped.\n\nI remember having to travel back home from Nasarawa to Abuja around 5 a.m. during that whole lockdown period.\n\nIt was honestly depressing.\n\nEverything I was used to doing suddenly disappeared and I was just home trying to figure out what to do with myself.\n\nAt some point, I started doing home lessons just to make some money.\n\nThere was this particular family where I had already been having difficult experiences. Then one day, I felt like the way I was treated was very condescending and disrespectful.\n\nI just walked out.\n\nI didn't collect a single naira.\n\nMind you, I didn't even have much money at the time.\n\nBut apparently, pride was one thing I had plenty of. 😂\n\nWith everything on pause, I started finding random things to do with myself.\n\nI learned how to play the guitar.\n\nI learned how to play the keyboard.\n\nIt was a very strange year. Quiet, difficult and honestly confusing.\n\nBut somehow, like I had always done, I found my way around it.\n\nThere wasn't much movement that year.\n\nLife just forced everybody to sit down.\n\nAnd for once, I did too.",
    quote: "Rock bottom became the solid foundation on which I rebuilt my life.",
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
    title: "What's the Plan After School?",
    story:
      "By 2021, I was in my finals.\n\nAt this point, I was already the Treasurer of my faculty and very close to the president. I had become quite influential in school.\n\nThe funny thing was, I barely showed up in class anymore.\n\nSome lecturers barely knew me, and even some of my classmates barely saw me. We had an office in school, and I probably spent more time there than I did in class.\n\nThis was also the year I started trying my hands at business.\n\nMy first attempt was a fashion business called Williams Brand.\n\nIt died very fast. 😂\n\nAfter that came a cyber cafe business and then POS. I was actually one of the early people around me to get an OPay POS.\n\nThere was just one small problem.\n\nI had managed to get the POS, but I didn't really have enough money to run a POS business. 😂\n\nSo that was that.\n\nStill, 2021 was a beautiful year for me.\n\nWilliams Brand won Creative Brand of the Year. I also won Most Proactive, Most Active and Most Influential Male in my faculty.\n\nI had spent years building relationships and influence around school, and by this time, all of that was obvious.\n\nAcademically though, I was struggling.\n\nI wasn't the same boy who entered university and topped his department in first year. Politics, business and everything else I was doing had taken a lot of my attention.\n\nBut somehow, I was still doing well.\n\nI was still among the top students in my class, and eventually graduated with a strong 2:1.\n\nNot bad for the naive boy who entered university years earlier just wanting to study Medicine.\n\nThe funny thing was, I was almost done with university and I still had no idea what I wanted to do with my life.\n\nAround this time, Prosper, someone very close to me, introduced me to affiliate marketing.\n\nI didn't know what that introduction would eventually mean.\n\nAt the time, I was just waiting to finish school.\n\nI figured I would find out what came next when I got there.",
    quote: "It does not matter how slowly you go as long as you do not stop.",
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
    title: "Depression, A Light Bulb Moment & NYSC Camp",
    story:
      "2022 was a strange year.\n\nSchool was supposed to be over, but then ASUU happened and everything got delayed again.\n\nAfter spending so many years believing my life would follow a certain timeline, suddenly I was stuck.\n\nAnd I became depressed again.\n\nSomewhere in the middle of all that waiting, I went back to teaching. I wasn't making much, but at least it kept me doing something.\n\nThen I started reading.\n\nSeriously.\n\nOne of the books I came across was No Excuses! by Brian Tracy, and for some reason, that book really got to me.\n\nI started thinking differently.\n\nI started writing on Facebook.\n\nI started thinking about my life beyond just finishing school, getting a job and figuring things out as they came.\n\nFor the first time, I think I started finding some sense of purpose.\n\nEventually, school ended.\n\nAnd then NYSC came.\n\nThe first time, I got posted to Bayelsa State.\n\nI didn't go. 😂\n\nI wanted Lagos.\n\nThen I got posted again, and this time it was Jos.\n\nStill not Lagos.\n\nBut I was tired of waiting again, so I decided to go.\n\nI thought I would get to Jos, do what I needed to do and probably find my way out eventually.\n\nBut for some reason, I fell in love with Jos almost immediately.\n\nThe weather was different. The environment was different. Everything just felt different.\n\nThen inside of NYSC camp, I found myself getting involved again.\n\nI became the OBS Head.\n\nLooking back, 2022 was one of those years that didn't look like much while I was living through it.\n\nThere was depression. There was waiting. There was ASUU. There was uncertainty.\n\nBut there was also that light bulb moment.\n\nI started reading. I started writing. I started seeing possibilities I hadn't really considered before.\n\nAnd somewhere between all of that, I packed my bags and entered a city I knew almost nothing about.\n\nI didn't know it yet, but Jos was about to become a very important part of my story.",
    quote: "New beginnings are often disguised as painful endings.",
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
    title: "LinkedIn, NYSC & LinkedIn Local Jos",
    story:
      "January 1st, 2023, I went viral on LinkedIn.\n\nThe next day, I packed my bags and fully moved to Jos for NYSC.\n\nThis was going to be the longest I had ever stayed away from my family.\n\nNew city. I knew practically nobody there.\n\nBut somehow, Jos became home.\n\nMy PPA was the University of Jos, and a few months into service, I became the CDS President for Editorial CDS.\n\nBy this time, LinkedIn was also beginning to work for me.\n\nI was growing.\n\nPeople were starting to know me.\n\nAnd with the little influence and connections I had built online, I decided to do something that, looking back now, was actually quite crazy.\n\nI decided to host LinkedIn Local Jos.\n\nI wasn't from Jos. I didn't have family there. I didn't come into the city knowing powerful people.\n\nI was literally just a corper.\n\nBut we did it.\n\nOver 500 people showed up.\n\nWe brought some of the biggest names around the University of Jos and beyond into one room, and till today, it remains one of the largest LinkedIn Local events held in Northern Nigeria.\n\nThat event changed a lot for me.\n\nIt showed me that what I was building on the internet had real, tangible substance in the physical world.\n\nI also co-hosted the JPI Youth Assembly in Plateau State from Jos, and later got elected as Vice President of JPI (Plateau State Chapter). I found myself getting more speaking invitations, meeting leaders, and expanding my horizons.\n\nAround this same period, I made my first $1,000 as a marketing copywriter.\n\nThat one was sweet. 😂\n\nI was making money, growing on LinkedIn and becoming pretty comfortable with the life I had built in Jos.\n\nAnd yes, somewhere along the way, I fell in love with Jos.\n\nI also fell in love in Jos.\n\nThree times apparently. 😂\n\nBy October, NYSC was over.\n\nThen came another problem.\n\nWhere was I going next?\n\nI could stay in Jos. I could go back to Abuja. Or I could finally make that move to Lagos.\n\nI actually tried staying in Jos.\n\nThen I got scammed.\n\nSo, plans changed. 😂\n\nOnce again, I had to figure out what was next.",
    quote: "Man cannot discover new oceans unless he has the courage to lose sight of the shore.",
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
    title: "And Then God Said Lagos",
    story:
      "After NYSC, I found myself at another crossroad.\n\nI could go back to Abuja where my family was.\n\nI could stay in Jos, a city I had grown to love.\n\nOr I could move to Lagos, where I believed there were bigger opportunities for me.\n\nHonestly, things weren't going badly for me.\n\nI didn't need some dramatic escape or fresh start.\n\nI just needed to know where I was supposed to go next.\n\nSo I prayed about it.\n\nAnd God said Lagos.\n\nI packed my bags again, booked a flight and moved.\n\nI'm not going to romanticize it.\n\nI cried for days.\n\nI missed my family terribly. I missed Abuja. I missed Jos.\n\nAnd Lagos was chaotic.\n\nI kept wondering how I had moved from somewhere as calm as Abuja and somewhere as lovely as Jos to all of this. 😂\n\nBut Lagos opened my world.\n\nLinkedIn had already given me influence on the internet, but now that influence started taking me places.\n\nLiterally.\n\nI travelled a lot that year.\n\nFrom Lagos to Oyo, Ife, Osun, Akure, Kaduna, Niger and different parts of Nigeria.\n\nI was speaking at events, visiting universities and meeting people who had previously only known me from the internet.\n\nThis thing I had built mostly from my phone was now taking me into actual rooms.\n\nI co-hosted events, found myself getting more speaking invitations, and met incredible people across different states.\n\nI also had a proper job at this point.\n\nAnd because apparently I like learning things the hard way, I tried building two businesses that year.\n\nBoth failed woefully. 😂\n\nMany of you probably know those businesses.\n\nAt the time, those failures hurt.\n\nLooking back now, I'm glad I tried them because a lot of what I know today came from things that didn't work.\n\nBy the end of 2024, I had done a lot.\n\nI had travelled. I had spoken on different stages. I had built influence and met incredible people.\n\nBut I was also tired.\n\nI was tired of flying up and down and jumping from one speaking engagement to another.\n\nMore importantly, I realized I didn't really have a clear career path.\n\nI knew I could do things.\n\nI just didn't know what exactly I wanted to become very good at.\n\nAnd that became the question I carried into 2025.",
    quote: "Everything you’ve ever wanted is on the other side of fear.",
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
    title: "The Year I Locked In and TEDxes",
    story:
      "2025 was the year I disappeared.\n\nWell, not completely.\n\nBut after posting almost every day on LinkedIn for about two years, I became extremely inconsistent.\n\nI also stopped accepting speaking invitations.\n\nI declined almost every single one that came my way.\n\nI was tired, but more than that, I needed clarity.\n\nI had built a brand. I had made money. I had spoken at events. I had travelled. People knew me.\n\nBut I knew I was made for more, and I didn't want to become too comfortable with the little success I had already found.\n\nI wanted a real career path.\n\nSo I prayed about it.\n\nI remember spending a long time talking to God about what exactly I was supposed to do with my life.\n\nEventually, I got clarity.\n\nProduct Marketing.\n\nI spoke to someone about it, followed that direction, and that was how I got into product marketing.\n\nThen I got my first proper role.\n\nIt was a hybrid role, so I actually had to show up at the office on certain days.\n\nAnd honestly, that company changed me.\n\nIt opened my eyes to marketing in a completely different way.\n\nI became better at what I did. I understood products better. I understood customers better. I started seeing marketing beyond just content and social media.\n\nFor the first time in a while, I wasn't trying to be everywhere.\n\nI was just learning.\n\nAnd I loved it.\n\nThe funny thing was that even though I had become very inconsistent online and was turning down invitations, people were still finding me.\n\nOpportunities came in fast. TEDx came in too. I had two TEDx talks that year despite not being so active.\n\nBesides product marketing, I had worked with a couple of international clients, doing a lot more around marketing and sales.\n\nApparently, disappearing for a while didn't erase everything I had spent years building.\n\n2025 wasn't a very loud year for me.\n\nBut I needed it.\n\nI needed to stop moving around long enough to actually decide where I was going.",
    quote: "We delight in the beauty of the butterfly, but rarely admit the changes it has gone through.",
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
    title: "Becoming the AI Person",
    story:
      "By 2026, I finally had some clarity.\n\nI had a proper career in product marketing. I had a solid personal brand, years of speaking engagements, a portfolio, results and enough experience to know that I was actually good at what I did.\n\nI was also working with international companies and doing a lot more around marketing and sales.\n\nThen I got really deep into AI.\n\nFor the first three months of the year, I locked in.\n\nI took courses. I learned. I built things. I experimented with different tools and started seeing just how much was possible.\n\nAnd somehow, people started associating me with AI.\n\nWhich was funny.\n\nA few years ago, I was the LinkedIn guy.\n\nThen I became the Product Marketing guy.\n\nNow, for some reason, I was becoming the AI person. 😂\n\nI also started getting speaking invitations again.\n\nRemember that I had spent most of the previous year declining them?\n\nWell, apparently that didn't last.\n\nOne invitation became another, and before I knew it, I was back in rooms speaking again.\n\nI did quite a number of speaking engagements this year, even though that wasn't really the plan.\n\nSometimes, even when you're trying to hide, the light will still find you.\n\nAnd somewhere in the middle of all of this, I made a shitload of money too. 😂\n\nBut I think one of the things 2026 made me realize was that maybe I've been looking at my life the wrong way.\n\nI've spent years becoming different things.\n\nI wanted to be a doctor.\n\nThen I got into Agricultural Science.\n\nThen politics.\n\nThen business.\n\nThen copywriting.\n\nThen LinkedIn.\n\nThen product marketing.\n\nNow AI.\n\nAnd maybe that's actually the story.\n\nI keep learning. I keep building. I keep changing.\n\nI evolve.\n\nAt 27, I still don't think I've arrived.\n\nNot even close.\n\nIf anything, I think I'm just getting started.\n\nAnd if you come back tomorrow and I'm doing something completely different, don't be surprised.\n\nApparently, that's what I do. I move. I am a man in motion.",
    quote: "The only person you are destined to become is the person you decide to be.",
    location: "[LAGOS, NIGERIA]",
    media: [
      M("2026-1", "PHOTO PLACEHOLDER · 2026 CURRENT · portrait 4:5"),
      M("2026-2", "PHOTO PLACEHOLDER · 2026 02 · portrait 4:5"),
      M("2026-3", "PHOTO PLACEHOLDER · 2026 03 · portrait 4:5"),
      M("2026-4", "PHOTO PLACEHOLDER · 2026 04 · portrait 4:5"),
      M("2026-5", "PHOTO PLACEHOLDER · 2026 05 · portrait 4:5"),
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