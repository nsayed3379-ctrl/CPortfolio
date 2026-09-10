"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { WHAT_WE_DO } from "@/lib/constants";

export default function WhatWeDo() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          title="Engineering, applied across the full stack."
          className="mb-8 sm:mb-12"
        />

        <div className="border-t border-[var(--color-border)]">
          {WHAT_WE_DO.map((row, i) => {
            const isActive = activeIndex === i;
            return (
              <Link
                key={row.index}
                href={row.href}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex(null)}
                className="focus-ring group block border-b border-[var(--color-border)]"
              >
                <div
                  className={cn(
                    "flex items-center justify-between gap-4 py-5 transition-colors duration-200 sm:gap-6 sm:py-6",
                    isActive && "sm:py-8"
                  )}
                >
                  <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                    <span
                      className="shrink-0 text-xs text-[var(--color-electric-soft)] sm:text-sm"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {row.index}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className={cn(
                          "truncate text-lg font-medium text-[var(--color-paper)] transition-colors sm:overflow-visible sm:whitespace-normal sm:text-2xl",
                          isActive && "text-[var(--color-cyan)]"
                        )}
                      >
                        {row.title}
                      </h3>
                      <p className="mt-1 truncate text-xs text-[var(--color-muted-2)] sm:overflow-visible sm:whitespace-normal sm:text-sm">
                        {row.tags.join(" · ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <div
                      className={cn(
                        "hidden max-w-sm overflow-hidden transition-all duration-300 ease-out sm:grid",
                        isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 sm:max-w-0"
                      )}
                    >
                      <p className="min-h-0 overflow-hidden text-sm text-[var(--color-muted)]">
                        {row.description}
                      </p>
                    </div>
                    <ArrowUpRight
                      className={cn(
                        "h-5 w-5 shrink-0 text-[var(--color-muted-2)] transition-all duration-200",
                        isActive && "-translate-y-0.5 translate-x-0.5 text-[var(--color-cyan)]"
                      )}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
