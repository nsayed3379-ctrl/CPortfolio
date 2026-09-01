"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";

export default function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "spotlight rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-200 hover:border-[var(--color-border-hover)]",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
