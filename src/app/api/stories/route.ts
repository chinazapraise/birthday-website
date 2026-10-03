import { NextResponse } from "next/server";
import { isValidAdminPassword } from "@/lib/adminAuth";
import {
  readCloudStories,
  appendCloudStory,
  updateCloudStoryPatch,
  wishesCloudConfigured,
} from "@/lib/wishesCloud";
import type { CommunityStory, StorySubmission } from "@/lib/types";

export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store, max-age=0" } as const;

export async function GET() {
  if (!wishesCloudConfigured()) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }
  const stories = await readCloudStories();
  return NextResponse.json({ ok: true, stories }, { headers: noStore });
}

export async function POST(request: Request) {
  if (!wishesCloudConfigured()) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Partial<CommunityStory> | null;
  if (!body || !body.senderName || !body.body) {
    return NextResponse.json({ ok: false, error: "senderName and body are required" }, { status: 400 });
  }

  const story: CommunityStory = {
    id: typeof body.id === "string" && body.id ? body.id : crypto.randomUUID(),
    senderName: String(body.senderName).trim(),
    meetingContext: body.meetingContext ? String(body.meetingContext).trim() : "",
    title: body.title ? String(body.title).trim() : "",
    body: String(body.body).trim(),
    year: typeof body.year === "number" ? body.year : undefined,
    funnyPromptAnswer: body.funnyPromptAnswer ? String(body.funnyPromptAnswer).trim() : undefined,
    photos: Array.isArray(body.photos) ? body.photos : [],
    anonymous_publicly: Boolean(body.anonymous_publicly),
    status: "published",
    featured: false,
    createdAt: typeof body.createdAt === "string" ? body.createdAt : new Date().toISOString(),
  };

  const saved = await appendCloudStory(story);
  return NextResponse.json({ ok: true, story: saved }, { headers: noStore });
}

export async function PATCH(request: Request) {
  if (!isValidAdminPassword(request.headers.get("x-admin-password") ?? "")) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!wishesCloudConfigured()) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    patch?: Partial<CommunityStory>;
  } | null;

  if (!body?.id || !body?.patch) {
    return NextResponse.json({ ok: false, error: "id and patch are required" }, { status: 400 });
  }

  const ok = await updateCloudStoryPatch(body.id, body.patch);
  return NextResponse.json({ ok }, { headers: noStore });
}
