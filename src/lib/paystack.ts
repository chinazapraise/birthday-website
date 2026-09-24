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
      onClose: (response: PaystackCancelled) => void;
    }) => void;
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
 * opens instantly when the user taps "Pay" instead of waiting on the
 * external script to download at that exact moment.
 */
export function preloadPaystack(): void {
  if (preloadStarted) return;
  preloadStarted = true;
  loadPaystack().catch(() => {
    // silent — checkout still works; it will retry on demand
  });
}

export const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

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
  win.PaystackPop.setup({
    key,
    email: opts.email,
    amount: opts.amountKobo,
    currency: opts.currency ?? "NGN",
    ref: opts.reference,
    callback: (response) => opts.onSuccess(response.reference),
    onClose: () => opts.onClose(),
  });
}