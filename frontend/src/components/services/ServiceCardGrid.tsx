"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Code2, BrainCircuit, Smartphone, PenTool, Cloud, Settings2,
  ChevronsRight, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Code2, BrainCircuit, Smartphone, PenTool, Cloud, Settings2,
};

// A rotating set of soft pastel washes — all built from the site's own
// palette (electric/cyan tinted toward white) rather than arbitrary hues,
// so the grid gets per-card variety without breaking the light Swiss theme.
const CARD_TINTS = [
  "from-[#fdf6ec] to-[var(--color-ink)]",
  "from-[#eef0fd] to-[#e8f7fb]",
  "from-[#eafaf6] to-[var(--color-ink)]",
  "from-[#f3eefd] to-[var(--color-ink)]",
];

type ServiceItem = {
  _id: string;
  slug: { current: string };
  name: string;
  shortDescription: string;
  icon: string;
};

export default function ServiceCardGrid({ services }: { services: ServiceItem[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      onMouseLeave={() => setHovered(null)}
    >
      {services.map((service, i) => {
        const Icon = ICONS[service.icon];
        const isHovered = hovered === service._id;
        const isDimmed = hovered !== null && hovered !== service._id;
        return (
          <Link
            key={service._id}
            href={`/services/${service.slug.current}`}
            onMouseEnter={() => setHovered(service._id)}
            onFocus={() => setHovered(service._id)}
            className={cn(
              "focus-ring group flex min-h-[200px] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br p-6 transition-all duration-300 ease-out motion-reduce:transition-none sm:min-h-[320px] sm:p-7",
              CARD_TINTS[i % CARD_TINTS.length],
              isHovered && "-translate-y-1.5 scale-[1.03] border-[var(--color-border-hover)] shadow-xl shadow-black/10",
              isDimmed && "opacity-40"
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)]/80 text-[var(--color-electric)] shadow-sm sm:h-14 sm:w-14">
              {Icon && <Icon className="h-5 w-5 sm:h-6 sm:w-6" />}
            </div>
            <h2 className="mt-5 text-lg font-medium text-[var(--color-paper)] sm:mt-7 sm:text-xl">{service.name}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--color-muted)] sm:mt-3">
              {service.shortDescription}
            </p>
            <span className="focus-ring mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-electric)] shadow-sm transition-transform duration-300 group-hover:translate-x-1">
              View Details
              <ChevronsRight className="h-4 w-4" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
