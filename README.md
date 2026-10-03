# Birthday Website & Story Milestone Experience

An interactive personal birthday and milestone celebration web application built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, **Framer Motion**, and **GSAP**.

Includes a chronological life timeline, interactive wish wall, community story gallery, curated gift registry with Paystack payment integration, celebratory countdown with confetti, and an owner administration dashboard.

---

## Features

- **Interactive Life Timeline**: Visual year-by-year cards with photo carousels, key moments, and audio/video highlights.
- **Birthday Countdown & Celebration Mode**: Real-time ticker counting down to your birthday date with confetti, celebratory soundscapes, and balloon animations.
- **Wishes Wall**: Interactive card wall where friends and family can write heartfelt birthday wishes filtered by category (Friends, Family, Work, Community).
- **Community Stories**: Story gallery where visitors share personal memories and anecdotes.
- **Curated Wishlist & Cash Gifting**: Gift registry supporting item claims, reservations, and multi-tier cash gifts integrated directly with Paystack.
- **Owner Admin Dashboard (`/admin`)**: Upload and reorder gallery photos, moderate incoming wishes/stories, customize copywriting, and manage gift statuses.
- **Zero-DDL Cloud Sync**: Photo manifests, birthday wishes, and community stories sync cleanly via Supabase Storage.

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/WilliamsBRAND/birthday-website.git
cd birthday-website
```

### 2. Install dependencies
```bash
npm install
# or
bun install
```

### 3. Configure environment variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

Fill in your configuration details inside `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Paystack Payment Gateway (for cash gifts)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Admin Dashboard Password (optional, default: birthdayadmin)
NEXT_PUBLIC_ADMIN_PASSWORD=your_custom_admin_password
```

#### Supabase Setup (Storage)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Storage** and create a public bucket named:
   ```text
   timeline-photos
   ```
3. Copy your project URL, Anon Key, and Service Role Key from **Project Settings > API** into `.env.local`.

#### Paystack Setup (Optional for cash gifts)
1. Register for an account at [paystack.com](https://paystack.com).
2. Copy your Test or Live API keys from **Settings > API Keys & Webhooks** into `.env.local`.

---

### 4. Run the development server
```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Customization

- **Site Settings & Milestone Date**: Update `src/lib/content/site.ts` to adjust your name, headline, birthday date, timezone, and social media handles.
- **Timeline Milestones**: Customize your milestone stories and photos in `src/lib/content/timeline.ts`.
- **Wishlist Items**: Modify items and cash tiers in `src/lib/content/site.ts`.

---

## Deployment (Vercel)

The easiest way to deploy this website is via Vercel:

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Add the environment variables specified in `.env.example` under **Project Settings > Environment Variables**.
4. Click **Deploy**.

---

## License

MIT License. Open for personal and community use.
