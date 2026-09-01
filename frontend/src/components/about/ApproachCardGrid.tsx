"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ApproachStep = { title: string; description: string; checkpoint: string };

export default function ApproachCardGrid({ steps }: { steps: ApproachStep[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
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
              "cursor-default rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 ease-out motion-reduce:transition-none",
              isHovered && "-translate-y-1.5 scale-[1.04] border-[var(--color-electric-soft)] shadow-xl shadow-black/10",
              isDimmed && "opacity-40"
            )}
          >
            <h3 className="mt-3 text-base font-medium text-[var(--color-paper)]">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{step.description}</p>
            <p className="mt-3 text-xs font-medium text-[var(--color-cyan)]">{step.checkpoint}</p>
          </div>
        );
      })}
    </div>
  );
}
