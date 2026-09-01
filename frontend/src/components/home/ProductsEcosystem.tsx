import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductStack from "@/components/products/ProductStack";
import { sanityFetchList } from "@/sanity/fetch";
import { PRODUCT_LIST_QUERY } from "@/sanity/queries";
import { fallbackFeaturedProducts } from "@/sanity/fallbacks";
import { selectFeatured } from "@/lib/selectFeatured";
import type { ProductDoc } from "@/sanity/types";

export default async function ProductsEcosystem() {
  // See src/lib/selectFeatured.ts — the homepage stays a curated
  // highlight reel (featured items, capped) no matter how many Products
  // exist in total. "All Products" below always leads to the complete,
  // uncapped /products list.
  const fetched = await sanityFetchList<ProductDoc>(PRODUCT_LIST_QUERY, {}, { tags: ["product"] });
  const products = selectFeatured(fetched, fallbackFeaturedProducts(), 6);
  const items = products.map((p) => ({
    slug: p.slug.current,
    name: p.name,
    category: p.category?.name ?? "Uncategorized",
    tagline: p.tagline,
    description: p.description,
    status: p.status,
    technologies: p.technologies,
    images: p.images,
  }));

  return (
    <section className="py-24">
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="VecoSoft products"
            title="Our own product ecosystem."
            description="Concept platforms that show how we approach product design and engineering."
          />
          <Button href="/products" variant="secondary" showArrow className="shrink-0">
            All Products
          </Button>
        </div>

        <ProductStack products={items} />
      </Container>
    </section>
  );
}
