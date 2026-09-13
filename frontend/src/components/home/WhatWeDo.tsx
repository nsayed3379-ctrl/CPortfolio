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
import Badge from "@/components/ui/Badge";
import EngineeringVisual from "@/components/home/EngineeringVisual";
import { WHAT_WE_DO } from "@/lib/constants";

// One icon per row, in the same order as WHAT_WE_DO (which mirrors SERVICES).
const ICONS: LucideIcon[] = [Code2, BrainCircuit, Smartphone, PenTool, Cloud, Settings2];
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

  // Auto-advance the text card; paused on hover/focus/touch and disabled
  // entirely for reduced-motion. The side illustration stays fixed.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const item = items[active];
  const Icon = ICONS[active % ICONS.length];

  const arrowClass =
    "focus-ring absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-paper)] shadow-sm transition-colors hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-raised)]";

  return (
    <section
      className="py-16 sm:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Container>
        <SectionHeading
          title="Engineering, applied across the full stack."
          className="mb-8 sm:mb-12"
        />

        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          {/* Card and illustration are two independent floating elements —
              not one shared bordered box — but sized equally (same column,
              same min-height) so neither dominates the other. */}
          <div
            className="relative z-10 order-2 lg:order-1"
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const start = touchX.current;
              touchX.current = null;
              if (start == null) return;
              const dx = e.changedTouches[0].clientX - start;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            }}
          >
            <button
              type="button"
              aria-label="Previous service"
              onClick={() => go(-1)}
              className={cn(arrowClass, "left-2 lg:-left-6")}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div
              key={active}
              className="animate-page-in flex min-h-[220px] flex-col justify-center gap-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-14 py-7 shadow-xl shadow-black/5 sm:min-h-[260px] sm:gap-4 sm:px-16 sm:py-9 lg:min-h-[300px] lg:px-10 lg:py-8"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-ink)] text-[var(--color-electric)]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <span
                  className="text-xs font-medium text-[var(--color-electric-soft)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item.index}
                </span>
                <h3 className="text-fluid-h3 mt-1 font-medium text-[var(--color-paper)]">
                  {item.title}
                </h3>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
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

            <button
              type="button"
              aria-label="Next service"
              onClick={() => go(1)}
              className={cn(arrowClass, "right-2 lg:-right-6")}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Fixed illustration — leads on mobile, sits right on desktop,
              matching the card's footprint exactly. */}
          <div className="order-1 lg:order-2">
            <EngineeringVisual />
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
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
      </Container>
    </section>
  );
}
