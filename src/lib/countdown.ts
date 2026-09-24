import { useEffect, useState } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  state: "before" | "today" | "after";
}

export function getCountdown(birthdayISO: string, timezone: string): CountdownParts {
  const now = new Date();
  let bday: Date;
  try {
    bday = new Date(
      new Date(birthdayISO).toLocaleString("en-US", { timeZone: timezone }),
    );
  } catch {
    bday = new Date(birthdayISO);
  }

  // Normalise both to UTC millis so comparisons are timezone-safe.
  const nowMs = now.getTime();
  let bdayMs = bday.getTime();
  const DAY_MS = 24 * 60 * 60 * 1000;

  // Rolling countdown — never get stuck in a permanent "after" state.
  // Once the birthday day has fully passed, roll forward to the next
  // year's birthday and keep counting down.
  while (nowMs >= bdayMs + DAY_MS) {
    bday = new Date(bday);
    bday.setFullYear(bday.getFullYear() + 1);
    bdayMs = bday.getTime();
  }

  if (nowMs >= bdayMs && nowMs < bdayMs + DAY_MS) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, state: "today" };
  }

  let diff = Math.floor((bdayMs - nowMs) / 1000);
  const days = Math.floor(diff / 86400);
  diff -= days * 86400;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff - minutes * 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds: days * 86400 + hours * 3600 + minutes * 60 + seconds,
    state: "before",
  };
}

export function useCountdown(birthdayISO: string, timezone: string): CountdownParts {
  const [parts, setParts] = useState(() =>
    getCountdown(birthdayISO, timezone),
  );

  useEffect(() => {
    const tick = () => setParts(getCountdown(birthdayISO, timezone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [birthdayISO, timezone]);

  return parts;
}

export function useNow(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const TWO_DIGIT = (n: number) => String(n).padStart(2, "0");

export function formatCountdown(p: CountdownParts): string {
  return `${TWO_DIGIT(p.days)} : ${TWO_DIGIT(p.hours)} : ${TWO_DIGIT(
    p.minutes,
  )} : ${TWO_DIGIT(p.seconds)}`;
}

export const CLOCK_UNITS: Array<{ label: string; key: keyof CountdownParts }> = [
  { label: "DAYS", key: "days" },
  { label: "HOURS", key: "hours" },
  { label: "MINUTES", key: "minutes" },
  { label: "SECONDS", key: "seconds" },
];

export function isSameDayOfBirth(birthdayISO: string): boolean {
  const cd = getCountdown(birthdayISO, "Africa/Lagos");
  return cd.state === "today";
}