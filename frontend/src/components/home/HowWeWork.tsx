"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { HOW_WE_WORK } from "@/lib/constants";
import { cn } from "@/lib/utils";

type WorkStep = { title: string; description: string; checkpoint?: string };

export default function HowWeWork({ steps: stepsProp }: { steps?: WorkStep[] }) {
  const steps = stepsProp && stepsProp.length > 0 ? stepsProp : HOW_WE_WORK;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          title="A clear process, with you involved at every step."
          className="mb-12"
        />
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          onMouseLeave={() => setHovered(null)}
        >
          {steps.map((step, i) => {
            const isHovered = hovered === i;
            const isDimmed = hovered !== null && hovered !== i;
            return (
              <div
                key={step.title}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                className={cn(
                  "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 ease-out motion-reduce:transition-none",
                  isHovered && "-translate-y-1.5 scale-[1.04] border-[var(--color-electric-soft)] opacity-100 shadow-xl shadow-black/30",
                  isDimmed && "opacity-40"
                )}
              >
                <span className="text-xs font-medium text-[var(--color-electric-soft)]" style={{ fontFamily: "var(--font-mono)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-medium text-[var(--color-paper)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{step.description}</p>
                {step.checkpoint && (
                  <p className="mt-3 text-xs font-medium text-[var(--color-cyan)]">{step.checkpoint}</p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
