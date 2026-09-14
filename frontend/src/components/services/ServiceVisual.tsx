import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// All built from the site's own palette (electric/cyan tinted toward
// white), rotating per row so consecutive services stay visually distinct
// without leaving the light Swiss theme — mirrors ServiceCardGrid's
// CARD_TINTS convention.
const TONES = [
  { bg: "from-[#eef2ff] to-[#e7fbff]", icon: "text-[var(--color-electric)]" },
  { bg: "from-[#e6fbf8] to-[#eef2ff]", icon: "text-[var(--color-cyan)]" },
  { bg: "from-[#fdf6ec] to-[#fdf0f0]", icon: "text-[var(--color-electric)]" },
  { bg: "from-[#f3eefd] to-[#eafaf6]", icon: "text-[var(--color-cyan)]" },
];

export default function ServiceVisual({ icon: Icon, index }: { icon: LucideIcon; index: number }) {
  const tone = TONES[index % TONES.length];
  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br",
        tone.bg
      )}
    >
      <div className="grid-field absolute inset-0 opacity-40" />
      <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[var(--color-electric)]/10 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[var(--color-cyan)]/10 blur-3xl" />
      <div
        className={cn(
          "relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--color-surface)] shadow-lg sm:h-28 sm:w-28",
          tone.icon
        )}
      >
        <Icon className="h-11 w-11 sm:h-12 sm:w-12" />
      </div>
    </div>
  );
}
