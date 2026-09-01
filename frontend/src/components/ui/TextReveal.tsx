"use client";

import { useEffect, useRef, useState } from "react";

type TextRevealProps = {
  text: string;
  className?: string;
  /** Rendered element — defaults to span, pass "h1"/"h2" for headlines. */
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
  /** Extra delay (ms) added before the very first word starts revealing. */
  startDelay?: number;
  /** Milliseconds between each word's stagger. Lower = faster cascade. */
  staggerMs?: number;
  /**
   * Wait until the element scrolls into view before revealing, rather
   * than revealing immediately on mount. Use for anything below the fold.
   */
  triggerOnView?: boolean;
};

// Splits text into words, each wrapped in an overflow-hidden mask so it
// can rise from below into place — a calmer, more editorial reveal than
// a scramble/decrypt effect, matching the same premium feel through
// restraint rather than a "hacker terminal" motif. SSR-safe: the real
// text is always in the DOM (this only animates opacity/transform, never
// swaps the actual characters), so there's nothing for search engines or
// screen readers to miss even before the animation plays.
export default function TextReveal({
  text,
  className,
  as: Tag = "span",
  startDelay = 0,
  staggerMs = 60,
  triggerOnView = false,
}: TextRevealProps) {
  const [visible, setVisible] = useState(false);
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      // Same justified exception as Preloader.tsx/CvFileInput.tsx: this
      // must run client-side (matchMedia doesn't exist during SSR), so
      // starting `visible` at false and flipping it here — once, on
      // mount — is the correct hydration-safe pattern, not something to
      // restructure away.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }

    if (triggerOnView) {
      const node = elRef.current;
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }

    const t = setTimeout(() => setVisible(true), startDelay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, triggerOnView]);

  const words = text.split(" ");
  const Component = Tag as unknown as "div";

  return (
    <Component ref={elRef as React.Ref<HTMLDivElement>} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.15em] align-bottom">
          <span
            className="inline-block transition-all duration-[900ms] ease-out motion-reduce:transition-none"
            style={{
              transitionDelay: `${i * staggerMs}ms`,
              transform: visible ? "translateY(0)" : "translateY(115%)",
              opacity: visible ? 1 : 0,
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Component>
  );
}
