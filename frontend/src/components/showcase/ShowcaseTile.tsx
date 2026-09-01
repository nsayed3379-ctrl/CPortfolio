"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MediaFrame from "@/components/ui/MediaFrame";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Status } from "@/lib/constants";
import { SIZE_CLASS, useShowcaseHover } from "./ShowcaseGrid";

// Accepts either the frontend's local placeholder-only MediaRef (legacy
// content still on constants.ts) or the backend's MediaRefDoc (which may
// carry a real uploaded imageUrl) — MediaFrame itself already handles both.
type TileMedia = {
  tone: "electric" | "cyan" | "violet" | "amber" | "graphite";
  label: string;
  variant?: "ui" | "diagram" | "orbs";
  imageUrl?: string | null;
};

export type ShowcaseTileProps = {
  slug: string;
  href: string;
  title: string;
  category: string;
  status?: Status;
  media: TileMedia;
  size: "wide" | "tall" | "large" | "standard";
};

export default function ShowcaseTile({ slug, href, title, category, status, media, size }: ShowcaseTileProps) {
  const { hovered, setHovered } = useShowcaseHover();
  const isHovered = hovered === slug;
  const isDimmed = hovered !== null && hovered !== slug;

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(slug)}
      onFocus={() => setHovered(slug)}
      className={cn(
        "focus-ring group relative block overflow-hidden rounded-2xl border border-[var(--color-border)] transition-[opacity,transform,box-shadow] duration-500 ease-out",
        SIZE_CLASS[size],
        isDimmed && "opacity-55",
        isHovered && "z-10 -translate-y-1 scale-[1.015] border-[var(--color-border-hover)] shadow-2xl shadow-black/40"
      )}
      style={{ viewTransitionName: `tile-${slug}` }}
    >
      <div
        className={cn(
          "absolute inset-0 h-full w-full transition-transform duration-700 ease-out",
          isHovered && "scale-[1.08]"
        )}
      >
        <MediaFrame media={media} className="absolute inset-0" />
      </div>

      {/* Base gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {status && (
        <div className="absolute left-4 top-4 z-10">
          <StatusBadge status={status} />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <span className="eyebrow text-sm text-[var(--color-cyan)]">{category.toUpperCase()}</span>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h3 className="text-lg font-medium leading-tight text-white sm:text-xl">{title}</h3>
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-transform duration-300",
              isHovered && "-translate-y-0.5 translate-x-0.5"
            )}
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <div
          className={cn(
            "grid overflow-hidden transition-all duration-300 ease-out",
            isHovered ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <p className="min-h-0 overflow-hidden text-xs text-white/70">Explore {title} →</p>
        </div>
      </div>
    </Link>
  );
}
