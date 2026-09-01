import { notFound } from "next/navigation";
import { FEATURES } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ShowcaseGrid from "@/components/showcase/ShowcaseGrid";
import ShowcaseTile from "@/components/showcase/ShowcaseTile";
import { sanityFetchList } from "@/sanity/fetch";
import { PRODUCT_LIST_QUERY, PRODUCT_LIST_BY_CATEGORY_QUERY } from "@/sanity/queries";
import { fallbackProducts, fallbackProductsByCategory } from "@/sanity/fallbacks";
import { getProductCategories } from "@/sanity/productCategories";
import type { ProductDoc } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Products",
  description: "Concept platforms from VecoSoft showing how we approach product design and engineering.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  if (!FEATURES.products) notFound();
  const { category: categorySlug } = await searchParams;

  const [fetched, categories] = await Promise.all([
    categorySlug
      ? sanityFetchList<ProductDoc>(PRODUCT_LIST_BY_CATEGORY_QUERY, { categorySlug }, { tags: ["product", `product-category:${categorySlug}`] })
      : sanityFetchList<ProductDoc>(PRODUCT_LIST_QUERY, {}, { tags: ["product"] }),
    getProductCategories(),
  ]);

  const products =
    fetched.length > 0
      ? fetched
      : categorySlug
        ? fallbackProductsByCategory(categorySlug)
        : fallbackProducts();

  const activeCategory = categorySlug ? categories.find((c) => c.slug === categorySlug) : null;

  return (
    <div className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Products"
          title={activeCategory ? activeCategory.name : "Platforms built from real business problems."}
          description="These are concept products that demonstrate how we think about product design, architecture, and user experience. Each carries an honest status — nothing here is presented as more finished than it is."
          className="mb-8"
        />

        {categories.length > 0 && (
          <div className="mb-16 flex flex-wrap gap-2">
            <Link
              href="/products"
              className={`focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors ${!categorySlug
                ? "border-[var(--color-electric)] bg-[var(--color-electric)]/10 text-[var(--color-paper)]"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-paper)]"
                }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className={`focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors ${categorySlug === c.slug
                  ? "border-[var(--color-electric)] bg-[var(--color-electric)]/10 text-[var(--color-paper)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-paper)]"
                  }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-16 text-center text-sm text-[var(--color-muted)]">
            No products in this category yet.
          </div>
        ) : (
          <ShowcaseGrid>
            {products.map((p) => (
              <ShowcaseTile
                key={p._id}
                slug={p.slug.current}
                href={`/products/${p.slug.current}`}
                title={p.name}
                category={p.category?.name ?? "Uncategorized"}
                status={p.status}
                media={p.images.thumbnail}
                size={p.size}
              />
            ))}
          </ShowcaseGrid>
        )}
      </Container>
    </div>
  );
}
