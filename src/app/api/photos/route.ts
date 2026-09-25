import { NextResponse } from "next/server";
import { isValidAdminPassword } from "@/lib/adminAuth";
import {
  deletePhoto,
  readManifest,
  readPeople,
  storageConfigured,
  uploadPhoto,
  writeManifest,
  writePeople,
} from "@/lib/photoCloud";
import type { YearPhoto, Person } from "@/lib/types";

export const runtime = "nodejs";

/*
 * Year photos.
 *
 * GET is public — visitors need it to render the homepage frames and the
 * gallery. Never cached, so a fresh admin upload shows up immediately.
 * POST/PATCH/DELETE are admin-only and require x-admin-password.
 */

const noStore = { "Cache-Control": "no-store, max-age=0" } as const;

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

function notConfigured() {
  return NextResponse.json(
    { ok: false, error: "photo storage not configured" },
    { status: 503 },
  );
}

export async function GET() {
  if (!storageConfigured()) return notConfigured();
  const [photos, people] = await Promise.all([readManifest(), readPeople()]);
  return NextResponse.json(
    { ok: true, photos, people: people ?? [] },
    { headers: noStore },
  );
}

/** Upload one compressed image: append it, swap it onto an existing photo, or handle people. */
export async function POST(request: Request) {
  if (!isValidAdminPassword(request.headers.get("x-admin-password") ?? "")) {
    return unauthorized();
  }
  if (!storageConfigured()) return notConfigured();

  const body = (await request.json().catch(() => null)) as {
    yearId?: unknown;
    dataBase64?: unknown;
    contentType?: unknown;
    photoId?: unknown;
    people?: unknown;
    isPersonPhoto?: unknown;
  } | null;

  // Handle saving the full people list
  if (Array.isArray(body?.people)) {
    const success = await writePeople(body.people as Person[]);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: "could not save people list" },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, people: body.people }, { headers: noStore });
  }

  const yearId = typeof body?.yearId === "string" ? body.yearId : "";
  const dataBase64 = typeof body?.dataBase64 === "string" ? body.dataBase64 : "";
  const photoId = typeof body?.photoId === "string" ? body.photoId : "";
  const contentType =
    typeof body?.contentType === "string" && body.contentType.startsWith("image/")
      ? body.contentType
      : "image/jpeg";

  if (!yearId) return badRequest("yearId is required");
  if (!dataBase64) return badRequest("dataBase64 is required");

  const url = await uploadPhoto(dataBase64, contentType);
  if (!url) {
    return NextResponse.json({ ok: false, error: "upload failed" }, { status: 500 });
  }

  const manifest = await readManifest();
  const list = manifest[yearId] ?? [];

  if (photoId) {
    const target = list.find((p) => p.id === photoId);
    if (!target) {
      await deletePhoto(url);
      return badRequest("photoId not found");
    }
    const oldUrl = target.url;
    target.url = url;
    manifest[yearId] = list;
    if (!(await writeManifest(manifest))) {
      await deletePhoto(url);
      return NextResponse.json(
        { ok: false, error: "could not save photo list" },
        { status: 500 },
      );
    }
    if (oldUrl && oldUrl !== url) await deletePhoto(oldUrl);
    return NextResponse.json({ ok: true, photos: manifest }, { headers: noStore });
  }

  list.push({ id: crypto.randomUUID(), url });
  manifest[yearId] = list;

  if (!(await writeManifest(manifest))) {
    await deletePhoto(url);
    return NextResponse.json(
      { ok: false, error: "could not save photo list" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, photos: manifest }, { headers: noStore });
}

/** Reorder a year, edit a caption, or replace a photo's file. */
export async function PATCH(request: Request) {
  if (!isValidAdminPassword(request.headers.get("x-admin-password") ?? "")) {
    return unauthorized();
  }
  if (!storageConfigured()) return notConfigured();

  const body = (await request.json().catch(() => null)) as {
    yearId?: unknown;
    orderedIds?: unknown;
    photoId?: unknown;
    caption?: unknown;
    url?: unknown;
  } | null;

  const yearId = typeof body?.yearId === "string" ? body.yearId : "";
  if (!yearId) return badRequest("yearId is required");

  const manifest = await readManifest();
  const list = manifest[yearId] ?? [];
  let replacedUrl: string | null = null;

  if (Array.isArray(body?.orderedIds)) {
    const byId = new Map(list.map((p) => [p.id, p]));
    const next: YearPhoto[] = [];
    for (const id of body.orderedIds) {
      if (typeof id !== "string") continue;
      const photo = byId.get(id);
      if (photo) {
        next.push(photo);
        byId.delete(id);
      }
    }
    next.push(...byId.values());
    manifest[yearId] = next;
  } else if (typeof body?.photoId === "string") {
    const caption = typeof body.caption === "string" ? body.caption : undefined;
    const url = typeof body.url === "string" ? body.url : undefined;
    if (caption === undefined && url === undefined) {
      return badRequest("nothing to update");
    }
    const previous = list.find((p) => p.id === body.photoId);
    if (url && previous && previous.url !== url) replacedUrl = previous.url;
    manifest[yearId] = list.map((p) =>
      p.id === body.photoId
        ? { ...p, ...(caption !== undefined ? { caption } : {}), ...(url ? { url } : {}) }
        : p,
    );
  } else {
    return badRequest("orderedIds or photoId is required");
  }

  if (!(await writeManifest(manifest))) {
    return NextResponse.json(
      { ok: false, error: "could not save photo list" },
      { status: 500 },
    );
  }

  if (replacedUrl) await deletePhoto(replacedUrl);

  return NextResponse.json({ ok: true, photos: manifest }, { headers: noStore });
}

/** Remove a photo from the list and delete the stored file. */
export async function DELETE(request: Request) {
  if (!isValidAdminPassword(request.headers.get("x-admin-password") ?? "")) {
    return unauthorized();
  }
  if (!storageConfigured()) return notConfigured();

  const body = (await request.json().catch(() => null)) as {
    yearId?: unknown;
    photoId?: unknown;
  } | null;
  const yearId = typeof body?.yearId === "string" ? body.yearId : "";
  const photoId = typeof body?.photoId === "string" ? body.photoId : "";
  if (!yearId || !photoId) return badRequest("yearId and photoId are required");

  const manifest = await readManifest();
  const list = manifest[yearId] ?? [];
  const target = list.find((p) => p.id === photoId);
  if (!target) {
    return NextResponse.json({ ok: true, photos: manifest }, { headers: noStore });
  }

  manifest[yearId] = list.filter((p) => p.id !== photoId);
  const saved = await writeManifest(manifest);
  if (target.url) await deletePhoto(target.url);

  if (!saved) {
    return NextResponse.json(
      { ok: false, error: "could not save photo list" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, photos: manifest }, { headers: noStore });
}
