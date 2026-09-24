"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";

const LINKS = [
  { href: "/", label: "Story" },
  { href: "/wishes", label: "Wishes" },
  { href: "/stories", label: "Your Stories" },
  { href: "/gallery", label: "Gallery" },
  { href: "/wishlist", label: "Wishlist" },
];

/**
 * Compact floating nav. Glass/blur after scrolling.
 */
export default function FloatingNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-ink/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[72px]">
        <Link
          href="/"
          onClick={close}
          className="font-display text-sm font-bold tracking-[0.18em] text-cream"
        >
          TOMIDE<span className="text-magenta"> / </span>
          <span className="text-violet">27</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className={`relative text-[0.8rem] font-medium tracking-wide transition-colors ${
                pathname === l.href
                  ? "text-cream"
                  : "text-cream/50 hover:text-cream"
              }`}
            >
              {pathname === l.href && (
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-violet to-magenta" />
              )}
              {l.label}
            </Link>
          ))}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-b border-white/10 bg-ink/95 backdrop-blur-xl transition-[max-height] duration-500 md:hidden ${
          open ? "max-h-96" : "max-h-0 border-b-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className={`rounded-lg px-3 py-3 text-sm font-medium ${
                pathname === l.href
                  ? "bg-white/10 text-cream"
                  : "text-cream/60 hover:bg-white/5 hover:text-cream"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}