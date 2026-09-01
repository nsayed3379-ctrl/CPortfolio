"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import SpotlightCard from "@/components/ui/SpotlightCard";

type WhyItem = { title: string; description: string };

export default function WhyCardGrid({ items }: { items: WhyItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item, i) => {
        const isHovered = hovered === i;
        const isDimmed = hovered !== null && hovered !== i;
        return (
          <div
            key={item.title}
            onMouseEnter={() => setHovered(i)}
            onFocus={() => setHovered(i)}
            className={cn(
              "transition-all duration-300 ease-out motion-reduce:transition-none",
              isHovered && "-translate-y-1.5 scale-[1.04]",
              isDimmed && "opacity-40"
            )}
          >
            <SpotlightCard>
              <h3 className="text-base font-medium text-[var(--color-paper)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.description}</p>
            </SpotlightCard>
          </div>
        );
      })}
    </div>
  );
}
