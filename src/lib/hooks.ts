import { useCallback, useEffect, useState } from "react";
import { store } from "@/lib/store";
import type { Store } from "@/lib/store";
import type { GiftClaim } from "@/lib/types";

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

export function useTimelineMedia() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    mediaUrls: store.getTimelineMedia(),
    setMedia: (id: string, url: string) => {
      const next = store.setTimelineMedia(id, url);
      emit();
      return next;
    },
    removeMedia: (id: string) => {
      const next = store.removeTimelineMedia(id);
      emit();
      return next;
    },
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

export default useStore;