"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type SolutionItem = {
  _id: string;
  slug: { current: string };
  name: string;
  shortDescription: string;
};

export default function SolutionCardGrid({ solutions }: { solutions: SolutionItem[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      onMouseLeave={() => setHovered(null)}
    >
      {solutions.map((s) => {
        const isHovered = hovered === s._id;
        const isDimmed = hovered !== null && hovered !== s._id;
        return (
          <Link
            key={s._id}
            href={`/solutions/${s.slug.current}`}
            onMouseEnter={() => setHovered(s._id)}
            onFocus={() => setHovered(s._id)}
            className={cn(
              "focus-ring group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 transition-all duration-300 ease-out motion-reduce:transition-none",
              isHovered && "-translate-y-1.5 scale-[1.03] border-[var(--color-border-hover)] shadow-xl shadow-black/10",
              isDimmed && "opacity-40"
            )}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-medium text-[var(--color-paper)]">{s.name}</h2>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--color-muted-2)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-cyan)]" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{s.shortDescription}</p>
          </Link>
        );
      })}
    </div>
  );
}
