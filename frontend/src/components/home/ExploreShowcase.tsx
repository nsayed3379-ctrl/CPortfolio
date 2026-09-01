"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import ShowcaseGrid from "@/components/showcase/ShowcaseGrid";
import ShowcaseTile from "@/components/showcase/ShowcaseTile";
import { PRODUCTS, CASE_STUDIES, EXPERIMENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProductDoc, CaseStudyDoc, ExperimentDoc } from "@/sanity/types";

type Kind = "product" | "work" | "lab";
type Filter = "all" | Kind;

const TABS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Products", value: "product" },
  { label: "Work", value: "work" },
  { label: "Labs", value: "lab" },
];

// This is a client component (needs useState for the filter tabs), so it
// can't call sanityFetch itself — the parent Server Component (homepage
// page.tsx) fetches the three collections and passes them down as props.
// Falls back to constants.ts per-collection (independently — e.g. Products
// might be populated in Sanity while Work still isn't) so the "ecosystem"
// feel holds up during the gradual migration from dummy to real content.
export default function ExploreShowcase({
  products: productsProp,
  work: workProp,
  labs: labsProp,
}: {
  products?: ProductDoc[];
  work?: CaseStudyDoc[];
  labs?: ExperimentDoc[];
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => {
    const products =
      productsProp && productsProp.length > 0
        ? productsProp.map((p) => ({
            kind: "product" as const,
            slug: p.slug.current,
            href: `/products/${p.slug.current}`,
            title: p.name,
            category: p.category?.name ?? "Uncategorized",
            status: p.status,
            media: p.images.thumbnail,
            size: p.size,
          }))
        : PRODUCTS.map((p) => ({
            kind: "product" as const,
            slug: p.slug,
            href: `/products/${p.slug}`,
            title: p.name,
            category: p.category,
            status: p.status,
            media: p.images.thumbnail,
            size: p.size,
          }));

    const work =
      workProp && workProp.length > 0
        ? workProp.map((c) => ({
            kind: "work" as const,
            slug: c.slug.current,
            href: `/work/${c.slug.current}`,
            title: c.title,
            category: c.industry,
            status: c.status,
            media: c.images.thumbnail,
            size: c.size,
          }))
        : CASE_STUDIES.map((c) => ({
            kind: "work" as const,
            slug: c.slug,
            href: `/work/${c.slug}`,
            title: c.title,
            category: c.industry,
            status: c.status,
            media: c.images.thumbnail,
            size: c.size,
          }));

    const labs =
      labsProp && labsProp.length > 0
        ? labsProp.map((e) => ({
            kind: "lab" as const,
            slug: e.slug.current,
            href: `/labs/${e.slug.current}`,
            title: e.title,
            category: e.category,
            status: e.status,
            media: e.images.thumbnail,
            size: e.size,
          }))
        : EXPERIMENTS.map((e) => ({
            kind: "lab" as const,
            slug: e.slug,
            href: `/labs/${e.slug}`,
            title: e.title,
            category: e.category,
            status: e.status,
            media: e.images.thumbnail,
            size: e.size,
          }));

    // Blend all three so the "All" view reads as one ecosystem rather than
    // three stacked lists — products lead since they're most representative
    // of VecoSoft's own work, work/labs interleaved after.
    return [...products, ...work, ...labs];
  }, [productsProp, workProp, labsProp]);

  const visible = filter === "all" ? items : items.filter((i) => i.kind === filter);

  return (
    <section className="relative overflow-hidden py-24">
      <div
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.15] blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--color-electric) 0%, transparent 70%)" }}
      />
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="What we build"
            title="Things we've built. Things we're building."
            description="Explore our products, experiments, and selected work."
          />
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                "focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                filter === tab.value
                  ? "border-[var(--color-electric)] bg-[var(--color-electric)]/10 text-[var(--color-paper)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-paper)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-16 text-center text-sm text-[var(--color-muted)]">
            Nothing published in this category yet — check back soon.
          </div>
        ) : (
          <ShowcaseGrid>
            {visible.map((item) => (
              <ShowcaseTile
                key={`${item.kind}-${item.slug}`}
                slug={item.slug}
                href={item.href}
                title={item.title}
                category={item.category}
                status={item.status}
                media={item.media}
                size={item.size}
              />
            ))}
          </ShowcaseGrid>
        )}

        <div className="mt-10 flex justify-center">
          <Button href="/work" variant="secondary" showArrow>
            Explore All Work
          </Button>
        </div>
      </Container>
    </section>
  );
}
