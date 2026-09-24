"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { isAdminAuthed, login, logout } from "@/lib/admin";
import { EASE } from "@/lib/motion";
import { LockKey } from "@phosphor-icons/react";

/**
 * Password gate for /admin. Session-only — stays signed in per browser tab
 * until it closes. Logs out explicitly on request.
 */
export default function AdminGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState(() => isAdminAuthed());
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setAuthed(true);
      setError(false);
      setPassword("");
    } else {
      setError(true);
    }
  };

  if (authed) {
    return (
      <>
        {children}
        <button
          onClick={() => {
            logout();
            setAuthed(false);
          }}
          className="fixed bottom-5 right-5 z-[70] rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cream/60 backdrop-blur-md transition hover:border-white/40 hover:text-cream"
        >
          Log out
        </button>
      </>
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center px-6">
      <motion.form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <motion.div
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet to-magenta"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
        >
          <LockKey size={24} className="text-cream" />
        </motion.div>

        <p className="font-display text-lg font-bold text-cream">
          Tomide&apos;s corner
        </p>
        <p className="mt-1 text-sm text-cream/50">
          This area is private. Enter the password to manage the site.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          autoComplete="current-password"
          className="mt-6 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-center text-cream placeholder:text-cream/30 focus:border-magenta focus:outline-none"
          autoFocus
        />

        <AnimatePresence>
          {error && (
            <motion.p
              className="mt-3 text-sm font-medium text-magenta"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Wrong password. Try again.
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-gradient-to-r from-violet via-magenta to-sunset px-6 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-ink transition-transform hover:scale-[1.02]"
        >
          Enter
        </button>
      </motion.form>
    </div>
  );
}