"use client";

// Replaces the old WebGL/three.js hero scene with a static illustration
// (public/hero/vr-explorer.png — background removed via flood-fill, see
// project notes) animated with plain CSS 3D transforms: a gentle idle
// float/sway plus, on fine-pointer devices, a subtle tilt that follows the
// cursor. No canvas, no render loop, no three.js/@react-three bundle —
// same "living 3D" feel at a fraction of the cost, and identical on every
// screen size (no separate mobile/desktop scene to keep in sync).
//
// The idle float is a CSS keyframe animation on the OUTER layer; the
// pointer-tilt is a JS-driven inline transform on a nested INNER layer —
// kept on separate elements on purpose, since an element can't run a CSS
// keyframe animation and hold an independent inline `transform` at the
// same time (the animation wins every frame). Nesting them composes both
// effects. `prefers-reduced-motion` disables the idle float via the
// sitewide rule in globals.css (also asserted locally below) and skips
// registering the pointer listener entirely.

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function HeroVisual() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const tilt = tiltRef.current;
    if (!wrap || !tilt) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reducedMotion || !finePointer) return;

    const MAX_TILT_DEG = 12;

    function onMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      tilt!.style.transform = `rotateX(${(-py * MAX_TILT_DEG).toFixed(2)}deg) rotateY(${(px * MAX_TILT_DEG).toFixed(2)}deg)`;
    }
    function onLeave() {
      tilt!.style.transform = "rotateX(0deg) rotateY(0deg)";
    }

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center lg:max-w-lg"
      style={{ perspective: "1200px" }}
    >
      <div className="hero-visual-shadow absolute bottom-[8%] h-[9%] w-[52%] rounded-full bg-black/25 blur-2xl" />

      <div
        className="hero-visual-float relative h-[84%] w-[84%]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={tiltRef}
          className="relative h-full w-full transition-transform duration-300 ease-out"
          style={{ transformStyle: "preserve-3d" }}
        >
          <Image
            src="/hero/vr-explorer.png"
            alt="3D illustration of a person wearing a VR headset, reaching toward floating holographic data panels"
            fill
            sizes="(max-width: 1024px) 70vw, 32vw"
            className="object-contain drop-shadow-[0_28px_36px_rgba(11,18,32,0.22)]"
            priority
          />
        </div>
      </div>

      <style>{`
        @keyframes hero-visual-float {
          0%, 100% { transform: translateY(0) rotateZ(-1.4deg); }
          50% { transform: translateY(-14px) rotateZ(1.4deg); }
        }
        @keyframes hero-visual-shadow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(0.86); opacity: 0.35; }
        }
        .hero-visual-float {
          animation: hero-visual-float 6s ease-in-out infinite;
        }
        .hero-visual-shadow {
          animation: hero-visual-shadow-pulse 6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-visual-float, .hero-visual-shadow {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
