import { FEATURES } from "@/lib/constants";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatusBadge from "@/components/ui/StatusBadge";
import MediaFrame from "@/components/ui/MediaFrame";
import ShowcaseGrid from "@/components/showcase/ShowcaseGrid";
import ShowcaseTile from "@/components/showcase/ShowcaseTile";
import { sanityFetch, sanityFetchList } from "@/sanity/fetch";
import { PRODUCT_BY_SLUG_QUERY, PRODUCT_LIST_QUERY } from "@/sanity/queries";
import { fallbackProductBySlug, fallbackProducts } from "@/sanity/fallbacks";
import type { ProductDoc } from "@/sanity/types";
import { Check, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = (await sanityFetch<ProductDoc>(PRODUCT_BY_SLUG_QUERY, { slug }, { tags: [`product:${slug}`] })) ?? fallbackProductBySlug(slug);
  if (!product) return {};
  return { title: product.name, description: product.tagline };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!FEATURES.products) notFound();
  const { slug } = await params;
  const product = (await sanityFetch<ProductDoc>(PRODUCT_BY_SLUG_QUERY, { slug }, { tags: [`product:${slug}`] })) ?? fallbackProductBySlug(slug);
  if (!product) notFound();

  // Normalized once here rather than scattering `?? []` through the JSX
  // below: Sanity's "required" schema validation only blocks *new*
  // publishes from the Studio UI — it doesn't retroactively guarantee
  // older documents, drafts, or manually-written data actually have these
  // fields populated. Treating every array field as possibly-missing at
  // read time avoids a runtime crash (seen in production testing) if any
  // one of them comes back undefined.
  const howItWorks = product.howItWorks ?? [];
  const features = product.features ?? [];
  const technologies = product.technologies ?? [];
  const useCases = product.useCases ?? [];
  const roadmap = product.roadmap ?? [];

  const fetchedList = await sanityFetchList<ProductDoc>(PRODUCT_LIST_QUERY, {}, { tags: ["product"] });
  const allProducts = fetchedList.length > 0 ? fetchedList : fallbackProducts();
  const more = allProducts.filter((p) => p.slug.current !== slug).slice(0, 3);
  const [firstScreen, ...restScreens] = product.images.gallery ?? [];

  return (
    <div>
      {/* Product Hero — full-bleed, story opens here */}
      <section className="relative overflow-hidden">
        <MediaFrame media={product.images.heroImage} className="absolute inset-0 opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/75 to-[var(--color-ink)]/30" />
        <Container className="relative py-28 sm:py-36">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{product.category?.name ?? "Uncategorized"}</Badge>
            <StatusBadge status={product.status} />
          </div>
          <h1 className="mt-6 max-w-2xl text-4xl font-medium tracking-tight text-[var(--color-paper)] sm:text-6xl">
            {product.name}
          </h1>
          <p className="mt-4 max-w-lg text-lg text-[var(--color-muted)]">{product.tagline}</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-paper)]/80">
            {product.description}
          </p>
          <div className="mt-8">
            <Button href="/get-a-quote" variant="primary" showArrow>
              Start a Similar Project
            </Button>
          </div>
        </Container>
      </section>

      {/* The Problem */}
      <section className="py-24 sm:py-32">
        <Container className="mx-auto max-w-3xl text-center">
          <p className="text-balance mt-6 text-2xl font-medium leading-snug text-[var(--color-paper)] sm:text-4xl">
            {product.problem}
          </p>
        </Container>
      </section>

      {/* The Idea */}
      <section className="bg-[var(--color-surface)] py-24 sm:py-32">
        <Container className="mx-auto max-w-3xl text-center">
          <p className="text-balance mt-6 text-2xl font-medium leading-snug text-[var(--color-cyan)] sm:text-4xl">
            {product.idea}
          </p>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="relative mt-12">
            <div
              className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-[var(--color-border-hover)] to-transparent lg:block"
              aria-hidden
            />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {howItWorks.map((step, i) => (
                <div key={step.step} className="relative">
                  <div className="flex items-center gap-3 lg:flex-col lg:items-start">
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-hover)] bg-[var(--color-ink)] text-xs font-medium text-[var(--color-cyan)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-medium text-[var(--color-paper)] lg:mt-4">{step.step}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {step.description}
                  </p>
                  {i < howItWorks.length - 1 && (
                    <ArrowRight className="mt-3 hidden h-4 w-4 text-[var(--color-muted-2)] lg:absolute lg:-right-3 lg:top-3 lg:mt-0 lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Product in action — full-bleed visual break */}
      <section className="border-y border-[var(--color-border)]">
        <MediaFrame media={product.images.heroImage} className="aspect-[16/9] w-full sm:aspect-[21/9]" />
      </section>

      {/* Key Features */}
      <section className="bg-[var(--color-surface)] py-24 sm:py-32">
        <Container>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="bg-[var(--color-ink)] p-8">
                <Check className="h-4 w-4 text-[var(--color-cyan)]" />
                <h3 className="mt-4 text-base font-medium text-[var(--color-paper)]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{f.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Product Screens — masonry: first screen large, rest smaller */}
      {(firstScreen || restScreens.length > 0) && (
        <section className="py-24 sm:py-32">
          <Container>
            <div className="mt-10 space-y-4">
              {firstScreen && (
                <MediaFrame
                  media={firstScreen}
                  className="aspect-[16/9] w-full rounded-2xl border border-[var(--color-border)]"
                />
              )}
              {restScreens.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {restScreens.map((img, i) => (
                    <MediaFrame
                      key={i}
                      media={img}
                      className="aspect-video rounded-2xl border border-[var(--color-border)]"
                    />
                  ))}
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Technology */}
      <section className="bg-[var(--color-surface)] py-24">
        <Container>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {technologies.map((group) => (
              <div key={group.group}>
                <h3 className="text-sm font-medium text-[var(--color-paper)]">{group.group}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(group.items ?? []).map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Use Cases + Roadmap */}
      <section className="py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <ul className="mt-6 space-y-3">
              {useCases.map((u) => (
                <li key={u} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-electric-soft)]" />
                  {u}
                </li>
              ))}
            </ul>
          </div>
          {roadmap.length > 0 && (
            <div>
              <ul className="mt-6 space-y-3">
                {roadmap.map((r, i) => (
                  <li key={r} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                    <span className="mt-0.5 text-xs text-[var(--color-muted-2)]">{String(i + 1).padStart(2, "0")}</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border)] py-24 text-center">
        <Container>
          <h2 className="text-balance mx-auto max-w-lg text-3xl font-medium tracking-tight text-[var(--color-paper)]">
            Interested in a platform like {product.name}?
          </h2>
          <div className="mt-8 flex justify-center gap-4">
            <Button href="/get-a-quote" variant="primary" showArrow>Get a Quote</Button>
            <Button href="/contact" variant="secondary">Contact Us</Button>
          </div>
        </Container>
      </section>

      {/* Explore more */}
      {more.length > 0 && (
        <section className="bg-[var(--color-surface)] py-24">
          <Container>
            <div className="mt-8">
              <ShowcaseGrid className="sm:grid-cols-3 auto-rows-[180px]">
                {more.map((p) => (
                  <ShowcaseTile
                    key={p._id}
                    slug={p.slug.current}
                    href={`/products/${p.slug.current}`}
                    title={p.name}
                    category={p.category?.name ?? "Uncategorized"}
                    status={p.status}
                    media={p.images.thumbnail}
                    size="standard"
                  />
                ))}
              </ShowcaseGrid>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
