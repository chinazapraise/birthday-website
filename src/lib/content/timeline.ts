import type { TimelineYear, MicroMemory } from "@/lib/types";

/*
* SEED CONTENT — CHINAZA'S STORY, STILL UNFOLDING, 2010-2026.
* These are fragments of a life being shaped by faith, experience,
* and the grace to keep becoming.
* Every memory carries its own truth; preserve the experiences and
* approved wording without rewriting or embellishing the facts.
* Media ids, placeholder labels, aspects and themes remain stable;
* uploaded photos may overlay via url on those ids.
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
    id: "y2010",
    year: 2010,
    yearRange: "2010-2015",
    title: "The Little Girl With a Dream",
    story: `CHAPTER ONE: THE LITTLE GIRL WITH A DREAM (2010–2015)

[THE BEGINNING]

I started primary school in 2010. At that age, I was just a little girl learning about the world and imagining who I might become.

Like many children, I had dreams of my own. I wanted to become a medical doctor, and that dream was part of how I imagined my future.

My childhood also came with its own little victories. One memory that stands out is coming first in Primary Three. A family friend celebrated my achievement by buying a whole chicken! 😂 Of course, I shared it with my siblings, but I got to choose my portion first. Small girl, big achievement, and a whole chicken to celebrate it!

Looking back, those moments remind me that my journey began long before I understood what life would eventually look like. I was simply a little girl growing, learning, dreaming, and taking life one experience at a time.

I had no idea what the future held or how much my plans might change. I only knew that I had dreams, and I was beginning my journey.

For now, I was a little girl with a dream, and that was enough.

CLOSING QUOTE

"Every journey begins somewhere. Sometimes, it begins with a little girl, a dream, and a future she has not yet learned to imagine."`,
    media: [],
    layoutVariant: "editorial",
    theme: {
      accent: "#fca5a5",
      accent2: "#e11d48",
      glow: "#fca5a5",
    },
  },

  {
    id: "y2016",
    year: 2016,
    yearRange: "2016-2022",
    title: "The Years That Shaped Me",
    story: `CHAPTER TWO: THE YEARS THAT SHAPED ME (2016–2022)

[GROWING UP]

When I look back at my secondary school years, I see a girl who was loved by many but was still trying to find herself.

I was serious about my academics and consistently among the best students in my class. I also had opportunities to serve in different leadership positions, including as a class prefect and chapel prefect.

I could be there for other people, help them out, and be someone they could count on. But somehow, even with all of that, I sometimes felt lost when it came to myself. I was still learning to understand myself, and I did not always have the answers to the things I felt or experienced.

But secondary school was not all serious business. 😂

One memory that comes to mind is the day we wrote our last WAEC paper. We all went to a big field to play football, and of course, I was there to cheer because playing football was definitely not my ministry, though I love watching it. 😂⚽️ I spent quite a number of funny moments with my classmates, and those memories are still part of what makes me smile when I think about those years.

Of course, there were other experiences, too. I was learning about friendships, navigating different situations, and figuring out where I belonged. Some experiences were beautiful, while others taught me lessons I would only understand more clearly with time.

My relationship with God was also part of this journey. Sometimes, I was serious about my walk with Him, and sometimes, I was not. I wanted to grow closer to Him, but I was still learning what consistency meant in my relationship with God.

Looking back, I realise that I was growing in more ways than I could recognise at the time. I was not just preparing for examinations or working towards the next stage of my education. I was also having experiences that would shape how I understood myself, other people, and my faith.

In 2022, I completed secondary school. I cannot quite put a name to how I felt then. I had achieved that milestone, and my attention was already on the next one: getting into the university.

I did not know exactly what awaited me, but I was ready to move forward.

And so, one chapter ended, making room for another.

CLOSING QUOTE

"Not every season will make sense while you are living it. Sometimes, you have to grow a little older before you understand what an experience came to teach you."`,
    media: [
      M("y2016-photo-1", "PHOTO PLACEHOLDER"),
      M("y2016-photo-2", "PHOTO PLACEHOLDER"),
    ],
    layoutVariant: "editorial",
    theme: {
      accent: "#f0abfc",
      accent2: "#c026d3",
      glow: "#f0abfc",
    },
  },

  {
    id: "y2022",
    year: 2022,
    yearRange: "2022-2024",
    title: "The Years in Between",
    story: `CHAPTER THREE: THE YEARS IN BETWEEN (2022–2024)

[THE UNEXPECTED JOURNEY]

When I finished secondary school in 2022, my next plan was simple: I wanted to get into the university and study Medicine and Surgery.

I knew JAMB was not something to take lightly, so I studied. I really did. But when my result came out and I saw 195, my first reaction was, "How? Is this actually my result?" 😂

That year, JAMB had its own issues, and my English examination was one experience I still remember. There was no comprehension passage, yet there were comprehension questions. I was confused, and seeing my result afterward left me feeling really disappointed.

But I was not ready to give up on my dream.

The second time, I gave it everything I had. I stretched myself, studied hard, and put my all into that examination. When the result came out, I scored 235.

I had improved, and I knew I had put in the work. But even with that result, Medicine and Surgery was still out of reach.

That one pained me.

At that point, my mind was no longer fixed on one particular course. I just wanted to get into school and begin my university journey. I was eventually offered admission to study Microbiology, and I started the programme. However, my dad was concerned about my future employment prospects and requested that I withdraw. Eventually, I did.

And just like that, another plan changed.

But the years in between were not only about JAMB and admission.

At some point, I tried learning a skill. I ventured into hairstyling, but I was not serious enough about it, and that attempt did not work out.

Then came one of the funniest phases of those years. 😂😭

I was broke and tired of staying at home. I wanted to make money, and when a friend introduced me to a health networking company, I jumped at the opportunity.

Omo, I channelled my energy into that thing! 😂😂 School plans seemed to take a back seat, and I was so invested that my mum began wondering whether I had been bewitched. 😭😭

Looking back, I can laugh about it now. I was simply tired of staying at home and wanted to find a way to make money. I was trying things out, exploring possibilities, and hoping something would work.

Not everything I attempted worked out, and not every decision was the wisest one, but those experiences were still part of my journey.

Eventually, my path led me towards midwifery. It was not the course I had originally imagined myself studying, but over time, I developed a genuine love for it.

And I mean, I LOVE midwifery. ❤️

Of course, it can be stressful. Sometimes, the workload alone can make you wonder what you signed up for. 😂 But beneath the stress, I have found something I genuinely enjoy and care about.

When I think about those years now, I see a period filled with changing plans, disappointments, attempts that did not work out, and unexpected directions.

I had started with one dream, but life did not follow the exact route I had planned. I had to adjust, try again, and keep moving.

And somewhere along the way, I found myself on a path I had not originally pictured, but one I have grown to love.

The story was still unfolding, and the next chapter would teach me even more about myself.

CLOSING QUOTE

"Sometimes, the journey does not follow the plan you made for yourself. You take different turns, try things that do not work out, and find yourself in places you never imagined. And somewhere along the way, life begins to look different from the picture you started with."`,
    media: [],
    layoutVariant: "editorial",
    theme: {
      accent: "#fdba74",
      accent2: "#ea580c",
      glow: "#fdba74",
    },
  },

  {
    id: "y2024",
    year: 2024,
    yearRange: "2024",
    title: "A New Chapter Begins",
    story: `CHAPTER FOUR: A NEW CHAPTER BEGINS (2024)

[THE BEGINNING OF SOMETHING NEW]

In 2024, I gained admission into the College of Nursing Sciences, Bishop Shanahan Specialist Hospital, Nsukka, to study midwifery. I was super excited. I had always wanted to know what being away from home felt like, and now I was about to experience it for myself. I was expectant, curious, and ready to see what this new place had in store for me.

I had my expectations, too. I wanted to be a good girl, make my parents proud, do well academically, take my relationship with God seriously, and generally get things right. I did not know exactly what the coming years would look like, but I was determined to make the most of them.

Then came my first hostel experience. 😂

On the first day, a classmate had chosen a particular bunk but later changed her mind. I eventually chose that same bunk, only for her to come back and want it again! And me? I kwechiri immediately! 😭😂 I called my sister, who was already in the school, and the matter was eventually resolved by the hostel matron.

That was one way to begin my new life away from home. Omor, we had barely arrived! 😂

Another memorable moment was my first experience in the refectory. I volunteered to dish out food, not knowing that this little act would lead to something more. When it was time for my classmates to vote, I was elected as the Food Representative.

And just like that, I began taking on responsibilities in my new environment.

I was jovial, made friends easily, and became quite popular among my classmates. I enjoyed the interactions, the shared experiences, and especially our group reading sessions. There was something about sitting together to read, learning alongside one another, and making memories in the process that I genuinely loved.

At that point, I was still figuring out what life in this new environment would mean for me. I had come with plans for my academics, my faith, and my personal life. I wanted to do well, make my parents proud, and become the person I believed I should be.

I did not know that this new chapter would challenge some of my expectations, introduce me to different sides of myself, and teach me lessons I would carry long after leaving school.

I had come expecting to experience life away from home.

Little did I know that I would also begin learning more about myself.

CLOSING QUOTE

"Sometimes, a new environment introduces you to more than a different place or a different set of people. It introduces you to parts of yourself you have not yet had the opportunity to discover."`,
    media: [],
    layoutVariant: "editorial",
    theme: {
      accent: "#86efac",
      accent2: "#16a34a",
      glow: "#86efac",
    },
  },

  {
    id: "y2026",
    year: 2026,
    yearRange: "2024-2026",
    title: "The Becoming",
    story: `CHAPTER FIVE: THE BECOMING (2024–2026)

[THE LESSONS THAT CHANGED ME]

My years at Shanahan have taught me far more than what I came here to study. They have challenged me spiritually, emotionally, socially, and through the responsibilities I have carried. Looking back, I realise that some of the most important lessons I have learned have not come from textbooks or lectures, but from the experiences that have shaped the person I am becoming.

FRIENDSHIPS AND BELONGING

My years at Shanahan have given me beautiful friendships and meaningful memories. From our group reading sessions to the laughter we shared, there have been moments of genuine connection that I will always appreciate. I have met people who have made this journey better, and I am grateful for the friendships that have brought joy, support, and a sense of belonging into my life.

But I have also learned some important lessons about friendship.

I have always been someone who makes friends easily, but my experiences have taught me that being friendly with someone and allowing them into your inner circle are two different things.

Sometimes, the desire to belong can make us ignore our discomfort, compromise our values, or remain in situations we should reconsider. I learned that trying to maintain peace with everyone can come at the expense of our own peace.

Friendships can significantly influence the direction our lives take. Choose your friends carefully, and look for people whose values and vision align with yours.

If a friendship makes you uncomfortable, do not ignore your feelings just to keep the peace. Speak up when necessary, reassess the relationship, and know when you need to step away.

You can love people without giving everyone access to your inner circle. Being friendly with everyone does not mean everyone must have a place in your personal life.

MY WALK WITH GOD

My relationship with God has been one of the most personal parts of my journey at Shanahan.

I came into this institution with a genuine desire to grow in my walk with Him. I had plans, intentions, and a picture of the kind of Christian I wanted to become. But somewhere along the way, I began to understand that wanting to get things right and actually walking in obedience are not always the same thing.

Like many young people navigating a new season of life, I discovered that growing in faith requires more than good intentions. It requires consistency, humility, and a willingness to keep returning to God, even when the journey does not go as planned.

First Corinthians 10:12 became especially meaningful to me: "Wherefore let him that thinketh he standeth take heed lest he fall."

I began to understand that none of us is beyond the possibility of losing our footing. Sometimes, we become so sure of ourselves that we forget how much we need God's grace and guidance. We can think we have things figured out without realising how easily our decisions can take us away from the things that matter most.

But what stays with me most is the faithfulness and mercy of God, and the reminder that whenever we recognise we have gone off course, we can always turn back to Him.

Through this journey, I have come to understand something deeply personal about God: He sees me. Even when I do not fully understand myself, I am never hidden from Him. His correction is not rejection, and His instructions are not intended to deprive me of good things. Sometimes, His "no" is protection from something I cannot yet see.

Today, my relationship with God feels more personal. I am learning to trust Him even when I do not understand His instructions, to pay closer attention to His leading, and to return to Him whenever I recognise that I am going off course.

If there is one thing I want another young person to understand from my journey, it is this: do not allow your mistakes, your struggles, or the distance you feel between yourself and God to convince you that you cannot return to Him.

Perhaps you once felt closer to God than you do now. Perhaps life has taken you through experiences that have left you uncertain about where you stand with Him. Whatever your situation may be, do not let shame keep you away from the very One you need.

You can be honest about your struggles, humble enough to receive correction, and courageous enough to begin again.

We are all capable of losing our footing, but being wounded does not mean being defeated. Recognising that you have gone off course is an opportunity to turn back.

When you realise you have gone off course, return. Do not allow shame to keep you away from God.

I am still growing and still learning, but I am grateful for the mercy of God and the opportunity to keep becoming who He wants me to be. And I hope that someone reading this remembers that no matter what season of life they are in, they can keep growing in their relationship with Him.

LEADERSHIP AND SELF-DISCOVERY

My leadership journey has shaped me in ways I did not expect.

I started as my class's Food Representative, later became Assistant Refectorian, and now serve as the school's Refectorian. I am also the President of the non-Catholic fellowship in my school.

Through these responsibilities, I have learned that good intentions are not enough; how you carry them out matters. Leadership requires wisdom, good communication, and the ability to handle responsibility without allowing personal emotions to interfere.

It has also revealed parts of myself that I needed to confront and work on. I have discovered that leadership is not simply about having a position or making decisions. It is also about being willing to learn, listen, adjust, and take responsibility for the impact of those decisions.

I have learned that power can be intoxicating, so we must be careful with how we handle it. When you want to make things right, do so with wisdom rather than rigidity.

Leadership has given me confidence, exposure, and opportunities to grow, but it has also taught me that becoming a better leader begins with being willing to work on yourself.

LEARNING TO CHOOSE MYSELF

For a long time, I struggled with boundaries. I wanted to maintain peace with everyone and found it difficult to say no without feeling guilty. I sometimes worried too much about disappointing people, even when saying yes meant neglecting things that mattered to me.

But I have grown.

I am learning that I cannot always control what people think of me, and I do not have to make everyone understand or agree with my decisions. I can say no without feeling guilty, establish boundaries, and maintain them without constantly questioning myself.

Disappointments can still hurt, but I am learning to look for the lessons and keep moving. I am also becoming more comfortable with my own company. I no longer feel the same need to always have someone looking out for me, because I am learning to stand more confidently on my own.

One of the things I am most grateful for is that I genuinely love the person I am becoming.

I know I have put effort into my growth through books, leadership, self-development, and the willingness to examine myself honestly. I am proud of the progress I have made, even though I know there is still room to grow.

Shanahan has taught me that growth is not only about what you achieve. It is also about the things you learn, the habits you unlearn, the boundaries you establish, and the person you become along the way.

BECOMING REQUIRES ACTION

One thing I want young people to understand is that becoming a better version of yourself requires intentional effort.

Do not settle for less simply because growth feels uncomfortable. Challenge yourself. Stretch beyond what you already know. Pursue the things you want, even when you cannot yet see exactly how you will achieve them.

For instance, I had always wanted to learn coding. If someone had told me that I would one day be building my own website, I probably would not have believed them.

Yet, here I am, building this website for my twenty-first birthday.

I am still learning, figuring things out, and making mistakes along the way. I do not know everything, but I started.

And that is the point.

You do not have to wait until you feel completely ready before you begin. You do not need to know everything before taking the first step. Start with what you have, learn as you go, and give yourself the opportunity to discover what you are capable of.

You may surprise yourself.

I am still becoming, and I hope you give yourself permission to do the same. Keep learning, keep growing, and keep challenging yourself to become better than you were yesterday.

CLOSING QUOTE

"Become someone your past can teach, your present can be proud of, and your future will thank you for becoming."`,
    media: [],
    layoutVariant: "editorial",
    theme: {
      accent: "#f9a8d4",
      accent2: "#db2777",
      glow: "#f9a8d4",
    },
  },
];


export const microMemoriesSeed: MicroMemory[] = [
  {
    id: "mm-1",
    type: "Beyond the familiar",
    label: "A Faith of My Own",
    note: "I grew up knowing about God, but with time, that knowledge became a desire to know Him for myself. It has been a gradual journey of growing closer to Him and learning what it means to walk with Him personally.",
    year: 2019,
    accent: "#f43f9e",
  },
  {
    id: "mm-2",
    type: "A Language of My Own",
    label: "An Instrument of My Own",
    note: "Drumming has always been a part of me. It brings me joy, gives expression to what's within me, and allows me to serve God by offering Him something that is uniquely mine, while helping others connect with Him through worship.",
    year: 2023,
    accent: "#22d3ee",
  },
  {
    id: "mm-3",
    type: "Plans and Providence",
    label: "Plot twist",
    note: "I never planned to become a midwife. I had imagined my NYSC year, even dreaming of the states I'd love to serve in, but life took a different direction. Now, I am learning that becoming a midwife is about more than earning a qualification; it is about compassion, humility, and purpose. It is about understanding that God has entrusted me with the privilege of caring for women and helping bring their babies safely into the world. And through this unexpected journey, I have remained certain that He is with me.",
    year: 2024,
    accent: "#f5c97b",
  },
  {
    id: "mm-4",
    type: "Lessons in connection",
    label: "The People Along the Way",
    note: "I've learned that people aren't always who we imagine them to be, and even the friendships that change us teach us something about ourselves. Some connections leave us with beautiful memories; others leave us wiser.",
    year: 2025,
    accent: "#f43f9e",
  },
  {
    id: "mm-5",
    type: "The Unseen Work",
    label: "Becoming in Silence",
    note: "Some of God's deepest work happens where nobody sees—in the lessons, the corrections, and the quiet transformation of who we're becoming.",
    year: 2026,
    accent: "#ff7a3d",
  },
  {
    id: "mm-6",
    type: "The Chapters Still Unfolding",
    label: "To be continued…",
    note: "There's probably another version of me I haven't met yet. And that's the exciting part.",
    year: 2026,
    accent: "#fbbf24",
  },
];
