"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Drives real momentum-based scroll physics (inspired by the smooth,
// weighty scroll feel on reference sites like Snigdha Chandra Paik's
// portfolio) via requestAnimationFrame, replacing the browser's crude
// `scroll-behavior: smooth` (which only affects anchor-jump scrolling,
// not normal wheel/trackpad scroll — see globals.css's comment on why
// that CSS property was removed in favor of this).
//
// Renders nothing — this is a side-effect-only component, mounted once
// near the root of the page so it manages scroll for the whole site.
// Skips entirely under prefers-reduced-motion, leaving native (instant)
// scrolling as the accessible fallback — momentum scrolling is a
// stylistic flourish, not something that should override a user's
// explicit motion preference.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    // Momentum wheel smoothing is a desktop pointer affordance. On touch
    // devices Lenis adds nothing the OS doesn't already do better, while
    // still running a permanent rAF loop — so skip it there entirely.
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
