"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MediaFrame from "@/components/ui/MediaFrame";
import StatusBadge from "@/components/ui/StatusBadge";
import Badge from "@/components/ui/Badge";
import { PRODUCTS, type Status } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { ProjectImagesDoc, TechGroupDoc } from "@/sanity/types";

// Sticky-stack deck: each card becomes `position: sticky` at a slightly
// larger `top` offset than the one before it. As the visitor scrolls, the
// next card slides up and settles directly over the previous one, which
// stays pinned just behind it — the classic overlapping-deck effect, done
// with plain CSS (no scroll-linked JS, no external animation library).
//
// The only JS involved is a lightweight IntersectionObserver that adds a
// "settled" fade/rise-in the first time each card enters the viewport, so
// the deck feels alive as you scroll to it instead of just snapping in.
// Everything degrades gracefully: with prefers-reduced-motion, cards render
// fully visible immediately (see the motion-reduce: classes below).

const STICKY_TOP_BASE = 96; // px — clears the sticky navbar
const STICKY_TOP_STEP = 18; // px — how much each card peeks above the last

export type ProductStackItem = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  status: Status;
  technologies: TechGroupDoc[];
  images: ProjectImagesDoc;
};

// Falls back to constants.ts's PRODUCTS (flattened to this same shape)
// when no Sanity data is passed in, so this still renders something
// sensible before the Products collection has been populated in Studio.
const FALLBACK: ProductStackItem[] = PRODUCTS.map((p) => ({
  slug: p.slug,
  name: p.name,
  category: p.category,
  tagline: p.tagline,
  description: p.description,
  status: p.status,
  technologies: p.technologies,
  images: p.images,
}));

export default function ProductStack({ products: productsProp }: { products?: ProductStackItem[] }) {
  const products = productsProp && productsProp.length > 0 ? productsProp : FALLBACK;
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(() => products.map(() => false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          if (entry.isIntersecting) {
            setVisible((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {products.map((product, i) => (
        <div
          key={product.slug}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          data-index={i}
          className="sticky pb-6"
          style={{ top: `${STICKY_TOP_BASE + i * STICKY_TOP_STEP}px`, zIndex: i + 1 }}
        >
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              "focus-ring group block overflow-hidden rounded-3xl border border-[var(--color-border-hover)] bg-[var(--color-surface)] shadow-2xl shadow-black/50 transition-all duration-700 ease-out motion-reduce:transition-none",
              "hover:border-[var(--color-electric-soft)] hover:shadow-[0_0_60px_-15px_rgba(46,94,255,0.4)]",
              visible[i]
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-10 scale-[0.97] opacity-0 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100"
            )}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="overflow-hidden">
                <MediaFrame
                  media={product.images.heroImage}
                  className="aspect-[16/10] transition-transform duration-700 ease-out group-hover:scale-[1.06] lg:aspect-auto lg:h-full lg:min-h-[320px]"
                />
              </div>
              <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{product.category}</Badge>
                  <StatusBadge status={product.status} />
                </div>
                <h3 className="text-2xl font-medium text-[var(--color-paper)] transition-colors duration-300 group-hover:text-[var(--color-cyan)] sm:text-3xl">
                  {product.name}
                </h3>
                <p className="text-sm font-medium text-[var(--color-cyan)]">{product.tagline}</p>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(product.technologies?.[0]?.items ?? []).slice(0, 3).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-paper)]">
                  Explore {product.name}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
