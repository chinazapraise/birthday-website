"use client";

/*
 * Client-side image compression for localStorage uploads.
 * Resizes to maxDim and re-encodes as JPEG (or PNG when transparency
 * is likely), keeping dataUrls small enough for the 5MB quota.
 * Always resolves — never throws or leaves a pending promise.
 */

const MAX_DIM = 1400;
const JPEG_QUALITY = 0.82;

export function fileToCompressedDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      if (!file.type.startsWith("image/")) {
        resolve("");
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => resolve("");
      reader.onload = () => {
        const dataUrl = typeof reader.result === "string" ? reader.result : "";
        if (!dataUrl) {
          resolve("");
          return;
        }
        const img = new Image();
        img.onerror = () => resolve(dataUrl);
        img.onload = () => {
          try {
            const scale = Math.min(
              1,
              MAX_DIM / Math.max(img.width, img.height),
            );
            const w = Math.max(1, Math.round(img.width * scale));
            const h = Math.max(1, Math.round(img.height * scale));
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve(dataUrl);
              return;
            }
            ctx.drawImage(img, 0, 0, w, h);
            const out = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
            resolve(out || dataUrl);
          } catch {
            resolve(dataUrl);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    } catch {
      resolve("");
    }
  });
}