export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait = 200,
): (...args: A) => void {
  let t: ReturnType<typeof setTimeout>;
  return (...args: A) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export function statusLabel(item: { status: string }): string {
  const map: Record<string, string> = {
    available: "Available",
    reserved: "Someone's got this",
    "partially funded": "Partly funded",
    funded: "Funded",
    purchased: "Purchased",
    received: "Received",
    hidden: "Hidden",
  };
  return map[item.status] ?? item.status;
}