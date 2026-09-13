"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { OUR_COMMITMENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Rocket, Receipt, ShieldCheck, LifeBuoy, type LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Rocket, Receipt, ShieldCheck, LifeBuoy];

export default function CommitmentStrip({
  commitments,
}: {
  commitments?: { title: string; description: string }[];
}) {
  const items = commitments && commitments.length > 0 ? commitments : OUR_COMMITMENTS;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-10 sm:py-12">
      <Container>
        <SectionHeading
          title="Why Founders Choose Us"
          align="center"
          className="mx-auto mb-8 sm:mb-10"
        />
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4"
          onMouseLeave={() => setHovered(null)}
        >
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            const isHovered = hovered === i;
            const isDimmed = hovered !== null && hovered !== i;
            return (
              <div
                key={item.title}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                className={cn(
                  "flex cursor-default items-start gap-3 rounded-xl p-2 transition-all duration-300 ease-out motion-reduce:transition-none",
                  isHovered && "-translate-y-1 scale-[1.03] opacity-100",
                  isDimmed && "opacity-40"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-ink)] text-[var(--color-cyan)] transition-colors duration-300",
                    isHovered && "border-[var(--color-electric-soft)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-paper)]">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
