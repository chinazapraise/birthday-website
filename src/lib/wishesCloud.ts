import { supabaseServer } from "@/lib/supabaseServer";
import type { Wish, CommunityStory } from "@/lib/types";
import { wishesSeed, storiesSeed } from "@/lib/content/site";

const BUCKET = "timeline-photos";
const WISHES_PATH = "wishes.json";
const STORIES_PATH = "stories.json";

function bucket() {
  if (!supabaseServer) return null;
  return supabaseServer.storage.from(BUCKET);
}

export function wishesCloudConfigured(): boolean {
  return bucket() !== null;
}

/* ==================== WISHES ==================== */

export async function readCloudWishes(): Promise<Wish[]> {
  const b = bucket();
  if (!b) return wishesSeed;
  try {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!base || !key) return wishesSeed;

    const res = await fetch(
      `${base}/storage/v1/object/${BUCKET}/${WISHES_PATH}?fresh=${Date.now()}`,
      { headers: { authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) {
      // First time reading: seed file
      await writeCloudWishes(wishesSeed);
      return wishesSeed;
    }
    const text = await res.text();
    const data = JSON.parse(text) as Wish[];
    return Array.isArray(data) && data.length > 0 ? data : wishesSeed;
  } catch {
    return wishesSeed;
  }
}

export async function writeCloudWishes(wishes: Wish[]): Promise<boolean> {
  const b = bucket();
  if (!b) return false;
  try {
    const json = JSON.stringify(wishes, null, 2);
    const { error } = await b.upload(WISHES_PATH, json, {
      upsert: true,
      contentType: "application/json",
    });
    return !error;
  } catch {
    return false;
  }
}

export async function appendCloudWish(wish: Wish): Promise<Wish> {
  const all = await readCloudWishes();
  const exists = all.some((w) => w.id === wish.id);
  if (!exists) {
    all.unshift(wish);
    await writeCloudWishes(all);
  }
  return wish;
}

export async function updateCloudWishStatus(
  id: string,
  status: "published" | "hidden" | "removed",
): Promise<boolean> {
  const all = await readCloudWishes();
  const target = all.find((w) => w.id === id);
  if (!target) return false;
  target.status = status;
  return writeCloudWishes(all);
}

/* ==================== STORIES ==================== */

export async function readCloudStories(): Promise<CommunityStory[]> {
  const b = bucket();
  if (!b) return storiesSeed;
  try {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!base || !key) return storiesSeed;

    const res = await fetch(
      `${base}/storage/v1/object/${BUCKET}/${STORIES_PATH}?fresh=${Date.now()}`,
      { headers: { authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) {
      await writeCloudStories(storiesSeed);
      return storiesSeed;
    }
    const text = await res.text();
    const data = JSON.parse(text) as CommunityStory[];
    return Array.isArray(data) && data.length > 0 ? data : storiesSeed;
  } catch {
    return storiesSeed;
  }
}

export async function writeCloudStories(
  stories: CommunityStory[],
): Promise<boolean> {
  const b = bucket();
  if (!b) return false;
  try {
    const json = JSON.stringify(stories, null, 2);
    const { error } = await b.upload(STORIES_PATH, json, {
      upsert: true,
      contentType: "application/json",
    });
    return !error;
  } catch {
    return false;
  }
}

export async function appendCloudStory(
  story: CommunityStory,
): Promise<CommunityStory> {
  const all = await readCloudStories();
  const exists = all.some((s) => s.id === story.id);
  if (!exists) {
    all.unshift(story);
    await writeCloudStories(all);
  }
  return story;
}

export async function updateCloudStoryPatch(
  id: string,
  patch: Partial<CommunityStory>,
): Promise<boolean> {
  const all = await readCloudStories();
  const target = all.find((s) => s.id === id);
  if (!target) return false;
  Object.assign(target, patch);
  return writeCloudStories(all);
}
