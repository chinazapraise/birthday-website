import { useCallback, useEffect, useState } from "react";
import { store } from "@/lib/store";
import type { Store } from "@/lib/store";
import { getAdminPassword } from "@/lib/admin";
import type { Contribution, GiftClaim, YearPhoto, Person } from "@/lib/types";

export type CloudPhotoMap = Record<string, YearPhoto[]>;

/*
 * useStore: react state hooked to the store.
 * listeners + storage event so the wish wall / gallery / wishlist
 * stay in sync across tabs (realtime-ish without a backend).
 */
type Listener = () => void;
const listeners = new Set<Listener>();

let hydrated = false;

/** Pull cloud rows into the local cache once on first mount. */
function hydrateOnce() {
  if (hydrated) return;
  hydrated = true;
  void store.hydrateFromCloud().then(() => {
    emit();
  });
}

export function emit() {
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", () => emit());
  if (typeof localStorage !== "undefined") hydrateOnce();
}

function useStore(): Store {
  const [, force] = useState(0);

  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return store;
}

export function useWishes() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    fetch("/api/wishes", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && Array.isArray(d.wishes)) {
          localStorage.setItem("birthday.wishes", JSON.stringify(d.wishes));
          emit();
        }
      })
      .catch(() => null);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    wishes: store.getWishes(),
    addWish: (w: Parameters<Store["addWish"]>[0]) => {
      const created = store.addWish(w);
      emit();
      return created;
    },
  };
}

export function useStories() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    fetch("/api/stories", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && Array.isArray(d.stories)) {
          localStorage.setItem("birthday.stories.v2", JSON.stringify(d.stories));
          emit();
        }
      })
      .catch(() => null);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    stories: store.getStories(),
    addStory: (s: Parameters<Store["addStory"]>[0]) => {
      const created = store.addStory(s);
      emit();
      return created;
    },
  };
}

export function useClaims() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    claims: store.getClaims(),
    addClaim: (c: Parameters<Store["addClaim"]>[0]) => {
      const created = store.addClaim(c);
      emit();
      return created;
    },
    updateClaim: (id: string, patch: Partial<GiftClaim>) => {
      const next = store.updateClaim(id, patch);
      emit();
      return next;
    },
  };
}

export function useReserves() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    reserves: store.getReserves(),
    addReserve: (r: Parameters<Store["addReserve"]>[0]) => {
      const created = store.addReserve(r);
      emit();
      return created;
    },
  };
}

export function useContributions() {
  const addContribution = useCallback(
    (c: Parameters<Store["addContribution"]>[0]) => {
      const created = store.addContribution(c);
      emit();
      return created;
    },
    [],
  );
  const markSuccessful = useCallback((id: string, reference: string) => {
    store.markPaymentSuccessful(id, reference);
    emit();
  }, []);
  const markAttempted = useCallback((id: string) => {
    store.markPaymentAttempted(id);
    emit();
  }, []);
  const updateContribution = useCallback(
    (id: string, patch: Partial<Contribution>) => {
      const next = store.updateContribution(id, patch);
      emit();
      return next;
    },
    [],
  );
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    contributions: store.getContributions(),
    addContribution,
    markSuccessful,
    markAttempted,
    updateContribution,
  };
}

export function useSettings() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    settings: store.getSettings(),
    updateSettings: (p: Parameters<Store["updateSettings"]>[0]) => {
      const next = store.updateSettings(p);
      emit();
      return next;
    },
  };
}

function newPhotoId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useYearPhotos() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    photos: store.getYearPhotos(),
    addPhotos: (
      yearId: string,
      items: Array<{ id: string; url: string; caption?: string }>,
    ) => {
      const next = store.addYearPhotos(yearId, items);
      emit();
      return next;
    },
    updatePhoto: (
      yearId: string,
      photoId: string,
      patch: { url?: string; caption?: string },
    ) => {
      const next = store.updateYearPhoto(yearId, photoId, patch);
      emit();
      return next;
    },
    removePhoto: (yearId: string, photoId: string) => {
      const next = store.removeYearPhoto(yearId, photoId);
      emit();
      return next;
    },
    reorderPhotos: (yearId: string, orderedIds: string[]) => {
      const next = store.reorderYearPhotos(yearId, orderedIds);
      emit();
      return next;
    },
    newPhotoId,
  };
}

export function useWishlist() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    items: store.getWishlist(),
    update: (items: ReturnType<Store["getWishlist"]>) => {
      store.updateWishlist(items);
      emit();
    },
  };
}

type PhotoResponse = {
  ok: boolean;
  photos?: CloudPhotoMap;
  people?: Person[];
  url?: string;
  error?: string;
};

async function photoRequest(
  method: "POST" | "PATCH" | "DELETE",
  body: unknown,
): Promise<PhotoResponse> {
  try {
    const res = await fetch("/api/photos", {
      method,
      headers: {
        "content-type": "application/json",
        "x-admin-password": getAdminPassword(),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return (await res.json().catch(() => null)) as PhotoResponse;
  } catch {
    return { ok: false, error: "network error" };
  }
}

/**
 * Year photos, read from and written to Supabase Storage so an admin
 * upload becomes visible to every visitor. Falls back to an empty map
 * when storage is unreachable, which renders the seed placeholders.
 */
export function useCloudYearPhotos() {
  const [photos, setPhotos] = useState<CloudPhotoMap>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/photos", { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as PhotoResponse | null;
      if (json?.ok) {
        if (json.photos) setPhotos(json.photos);
        if (Array.isArray(json.people) && json.people.length > 0) {
          store.updateSettings({ people: json.people });
          emit();
        }
      }
    } catch {
      /* leave whatever we already have */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void refresh(), 0);
    return () => clearTimeout(timer);
  }, [refresh]);

  const run = useCallback(
    async (method: "POST" | "PATCH" | "DELETE", body: unknown) => {
      setBusy(true);
      setError(null);
      const json = await photoRequest(method, body);
      if (json.ok && json.photos) setPhotos(json.photos);
      else if (!json.ok) setError(json.error ?? "could not save photos");
      setBusy(false);
      return json;
    },
    [],
  );

  /** Upload one already-compressed dataUrl and append it to the year. */
  const upload = useCallback(
    async (yearId: string, dataUrl: string) => {
      const comma = dataUrl.indexOf(",");
      if (comma === -1) return { ok: false, error: "bad image" };
      const header = dataUrl.slice(0, comma);
      const contentType = header.slice(5).split(";")[0] || "image/jpeg";
      return run("POST", {
        yearId,
        dataBase64: dataUrl.slice(comma + 1),
        contentType,
      });
    },
    [run],
  );

  /** Upload a compressed photo for a person in 'Those who made the story possible'. */
  const uploadPersonPhoto = useCallback(
    async (dataUrl: string) => {
      const comma = dataUrl.indexOf(",");
      if (comma === -1) return { ok: false, error: "bad image" };
      const header = dataUrl.slice(0, comma);
      const contentType = header.slice(5).split(";")[0] || "image/jpeg";
      setBusy(true);
      setError(null);
      const res = await photoRequest("POST", {
        yearId: "people",
        isPersonPhoto: true,
        dataBase64: dataUrl.slice(comma + 1),
        contentType,
      });
      if (!res.ok) setError(res.error ?? "could not upload photo");
      setBusy(false);
      return res;
    },
    [],
  );

  /** Save the list of people in 'Those who made the story possible'. */
  const savePeople = useCallback(
    async (people: Person[]) => {
      setBusy(true);
      setError(null);
      const res = await photoRequest("POST", { people });
      if (res.ok) {
        store.updateSettings({ people });
        emit();
      } else {
        setError(res.error ?? "could not save people");
      }
      setBusy(false);
      return res;
    },
    [],
  );

  const setCaption = useCallback(
    (yearId: string, photoId: string, caption: string) =>
      run("PATCH", { yearId, photoId, caption }),
    [run],
  );

  /** Swap a photo's file, keeping its id and position. */
  const replace = useCallback(
    (yearId: string, photoId: string, dataUrl: string) => {
      const comma = dataUrl.indexOf(",");
      if (comma === -1) return Promise.resolve({ ok: false, error: "bad image" });
      const header = dataUrl.slice(0, comma);
      const contentType = header.slice(5).split(";")[0] || "image/jpeg";
      return run("POST", {
        yearId,
        photoId,
        dataBase64: dataUrl.slice(comma + 1),
        contentType,
      });
    },
    [run],
  );

  const remove = useCallback(
    (yearId: string, photoId: string) => run("DELETE", { yearId, photoId }),
    [run],
  );

  const reorder = useCallback(
    (yearId: string, orderedIds: string[]) =>
      run("PATCH", { yearId, orderedIds }),
    [run],
  );

  return {
    photos,
    loading,
    busy,
    error,
    refresh,
    upload,
    uploadPersonPhoto,
    savePeople,
    setCaption,
    replace,
    remove,
    reorder,
  };
}

export default useStore;