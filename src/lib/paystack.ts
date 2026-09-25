"use client";

type PaystackSuccess = { reference: string };
type PaystackCancelled = { reference?: string; message?: string };

type PaystackPopWindow = {
  PaystackPop: {
    setup: (config: {
      key: string;
      email: string;
      amount: number; // kobo
      currency?: string;
      ref?: string;
      metadata?: Record<string, unknown>;
      callback: (response: PaystackSuccess) => void;
      onClose: (response?: PaystackCancelled) => void;
    }) => { openIframe: () => void };
  };
};

let scriptPromise: Promise<PaystackPopWindow> | null = null;
let preloadStarted = false;

function injectScript(): Promise<PaystackPopWindow> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById("paystack-inline");
    if (existing) {
      resolve(window as unknown as PaystackPopWindow);
      return;
    }
    const s = document.createElement("script");
    s.id = "paystack-inline";
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    s.onload = () => resolve(window as unknown as PaystackPopWindow);
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Could not load Paystack"));
    };
    document.body.appendChild(s);
  });
}

function loadPaystack(): Promise<PaystackPopWindow> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = injectScript();
  return scriptPromise;
}

/**
 * Warm up the Paystack script in the background so the checkout popup
 * opens instantly if the inline flow is invoked.
 */
export function preloadPaystack(): void {
  if (preloadStarted) return;
  preloadStarted = true;
  loadPaystack().catch(() => {
    // silent — checkout still works; it will retry on demand
  });
}

export const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

/**
 * Direct server-initialized checkout redirect.
 * Bypasses all popup/iframe hurdles and immediately redirects the user
 * to the official Paystack checkout page.
 */
export async function redirectToPaystackCheckout(opts: {
  email: string;
  amount: number; // NGN
  name: string;
  phone?: string;
  itemId: string;
  itemName: string;
  kind?: "contribution" | "gift";
  anonymous?: boolean;
  contributionId?: string;
  callbackUrl?: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
    });
    const data = await res.json();
    if (!data.ok || !data.authorizationUrl) {
      return {
        ok: false,
        error: data.error || "Could not initialize Paystack checkout",
      };
    }
    // Instant redirect to Paystack official checkout
    window.location.href = data.authorizationUrl;
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error connecting to payment gateway" };
  }
}

/**
 * Inline popup checkout (calls handler.openIframe() correctly).
 */
export async function openPaystackCheckout(opts: {
  email: string;
  amountKobo: number;
  currency?: string;
  reference?: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}): Promise<void> {
  const key = paystackPublicKey;
  if (!key || key.includes("paste_here")) {
    opts.onClose();
    return;
  }
  const win = await loadPaystack();
  const handler = win.PaystackPop.setup({
    key,
    email: opts.email,
    amount: opts.amountKobo,
    currency: opts.currency ?? "NGN",
    ref: opts.reference,
    callback: (response) => opts.onSuccess(response.reference),
    onClose: () => opts.onClose(),
  });
  handler?.openIframe?.();
}