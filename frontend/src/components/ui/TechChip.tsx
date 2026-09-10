import type { CSSProperties } from "react";
import { getTechIcon, hexToRgba } from "@/lib/techIcons";
import { cn } from "@/lib/utils";

/**
 * A single technology pill: brand-tinted icon + label, with a soft
 * per-brand hover lift/glow. Pure CSS hover (no client JS) — the brand
 * colour is passed in as CSS custom properties so the hover border and
 * shadow can pick it up without a Tailwind class per colour.
 */
export default function TechChip({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const { Icon, color } = getTechIcon(name);

  return (
    <span
      style={
        {
          "--tc": color,
          "--tc-glow": hexToRgba(color, 0.35),
          "--tc-tint": hexToRgba(color, 0.12),
        } as CSSProperties
      }
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)]",
        "bg-[var(--color-surface-raised)] px-3.5 py-2 text-sm font-medium text-[var(--color-paper)]",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-[var(--tc)]",
        "hover:bg-[var(--tc-tint)] hover:shadow-[0_8px_24px_-8px_var(--tc-glow)]",
        className
      )}
    >
      <Icon
        aria-hidden
        className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{ color }}
      />
      {name}
    </span>
  );
}
