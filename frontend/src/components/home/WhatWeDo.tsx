"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Cloud,
  Code2,
  PenTool,
  Settings2,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import MediaFrame from "@/components/ui/MediaFrame";
import Badge from "@/components/ui/Badge";
import { WHAT_WE_DO } from "@/lib/constants";

// One icon per row, in the same order as WHAT_WE_DO (which mirrors SERVICES).
const ICONS: LucideIcon[] = [Code2, BrainCircuit, Smartphone, PenTool, Cloud, Settings2];
// Rotated per slide so each service's side visual reads as its own thing
// rather than one flat panel repeated six times — same generative
// tone/variant system MediaFrame already uses across the site.
const TONES = ["electric", "cyan", "violet"] as const;
const VARIANTS = ["ui", "diagram", "orbs"] as const;
const AUTOPLAY_MS = 5500;

export default function WhatWeDo() {
  const items = WHAT_WE_DO;
  const count = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + count) % count),
    [count]
  );

  // Auto-advance, paused on hover/focus/touch and disabled entirely for
  // reduced-motion — the arrows and dots are always the primary control.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const item = items[active];
  const Icon = ICONS[active % ICONS.length];

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          title="Engineering, applied across the full stack."
          className="mb-8 sm:mb-12"
        />

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
            setPaused(true);
          }}
          onTouchEnd={(e) => {
            const start = touchX.current;
            touchX.current = null;
            setPaused(false);
            if (start == null) return;
            const dx = e.changedTouches[0].clientX - start;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          }}
        >
          <div className="grid items-stretch overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] lg:grid-cols-2">
            {/* Side visual — leads on mobile, sits right on desktop */}
            <div className="order-1 lg:order-2">
              <MediaFrame
                key={`media-${active}`}
                media={{
                  tone: TONES[active % TONES.length],
                  variant: VARIANTS[active % VARIANTS.length],
                  label: item.title,
                }}
                className="h-full min-h-[220px] w-full animate-page-in sm:min-h-[300px] lg:min-h-[440px]"
              />
            </div>

            {/* Card */}
            <div
              key={`card-${active}`}
              className="order-2 flex animate-page-in flex-col justify-center gap-4 p-6 sm:gap-5 sm:p-10 lg:order-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-ink)] text-[var(--color-electric)]">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <span
                  className="text-xs font-medium text-[var(--color-electric-soft)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item.index}
                </span>
                <h3 className="text-fluid-h2 mt-1 font-medium text-[var(--color-paper)]">
                  {item.title}
                </h3>
              </div>
              <p className="max-w-md text-base leading-relaxed text-[var(--color-muted)]">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
              <Link
                href={item.href}
                className="focus-ring group mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-electric)]"
              >
                Explore {item.title}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Controls: arrows flanking the progress dots */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous service"
              onClick={() => go(-1)}
              className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-paper)] transition-colors hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-raised)]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              {items.map((it, i) => (
                <button
                  key={it.index}
                  type="button"
                  aria-label={`Show ${it.title}`}
                  aria-current={i === active}
                  onClick={() => setActive(i)}
                  className={cn(
                    "focus-ring h-2 rounded-full transition-all duration-300",
                    i === active
                      ? "w-7 bg-[var(--color-electric)]"
                      : "w-2 bg-[var(--color-border-hover)] hover:bg-[var(--color-muted-2)]"
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next service"
              onClick={() => go(1)}
              className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-paper)] transition-colors hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-raised)]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
