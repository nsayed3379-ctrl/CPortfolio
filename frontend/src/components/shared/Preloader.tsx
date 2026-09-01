"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SESSION_KEY = "vecosoft-preloader-seen";
const DURATION_MS = 1400;
const FADE_MS = 500;

// A brief, full-screen counting animation shown before the site's first
// paint of a session — inspired by the "Presenting 000/100" pattern on
// reference sites, adapted to VecoSoft's own dark/electric-blue design
// language rather than copied outright.
//
// Only shows once per browser session (sessionStorage flag), not on every
// client-side route change — this layout-level component doesn't remount
// during soft navigation anyway (Next.js keeps the (site) layout mounted
// across route changes), but the flag also covers the case where someone
// hard-refreshes a different page later in the same session. Skips
// entirely under prefers-reduced-motion, since a forced multi-second
// full-screen animation is exactly the kind of thing that preference
// exists to opt out of — reduced-motion visitors go straight to content.
export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = sessionStorage.getItem(SESSION_KEY);
    if (reduced || alreadySeen) return;

    // Deliberately starts `visible` at false (SSR-safe — window/
    // sessionStorage don't exist on the server) and flips it here, once,
    // after confirming this is a real first-visit-this-session client.
    // This is the standard pattern for "decide based on a browser-only
    // condition after mount" without a hydration mismatch — the
    // alternative (computing this in a lazy useState initializer) would
    // make the server and client's first render disagree on whether the
    // preloader exists in the DOM at all.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    const start = performance.now();
    let rafId: number;

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setFadingOut(true);
        window.setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem(SESSION_KEY, "1");
        }, FADE_MS);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-ink)] transition-opacity duration-500",
        fadingOut ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      <span className="eyebrow mb-4 text-xs text-[var(--color-cyan)]">VECOSOFT</span>
      <span
        className="text-6xl font-medium text-[var(--color-paper)] sm:text-7xl"
        style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}
      >
        {String(count).padStart(3, "0")}
      </span>
      <div className="mt-8 h-px w-32 overflow-hidden bg-[var(--color-border)]">
        <div className="h-full bg-[var(--color-electric-soft)]" style={{ width: `${count}%` }} />
      </div>
    </div>
  );
}
