import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { sanityFetch } from "@/sanity/fetch";
import { SERVICE_BY_SLUG_QUERY } from "@/sanity/queries";
import { fallbackServiceBySlug } from "@/sanity/fallbacks";
import type { ServiceDoc } from "@/sanity/types";
import { Check, ChevronRight } from "lucide-react";

// No generateStaticParams here on purpose: with content now living in
// Sanity, the site shouldn't need a full rebuild every time a service is
// added or renamed. Next.js renders + caches each slug on first request
// (ISR via the `revalidate` option inside sanityFetch), so a slug added in
// the Studio five minutes ago works immediately, not just after the next
// deploy. `notFound()` below still 404s correctly for real — it just does
// so per-request instead of at build time.

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = (await sanityFetch<ServiceDoc>(SERVICE_BY_SLUG_QUERY, { slug }, { tags: [`service:${slug}`] })) ?? fallbackServiceBySlug(slug);
  if (!service) return {};
  return { title: service.name, description: service.shortDescription };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = (await sanityFetch<ServiceDoc>(SERVICE_BY_SLUG_QUERY, { slug }, { tags: [`service:${slug}`] })) ?? fallbackServiceBySlug(slug);
  if (!service) notFound();

  // See products/[slug]/page.tsx for why every array field is normalized
  // here rather than accessed directly — Sanity's "required" validation
  // doesn't retroactively guarantee older or manually-written documents
  // actually have these populated.
  const problems = service.problems ?? [];
  const features = service.features ?? [];
  const process = service.process ?? [];
  const technologies = service.technologies ?? [];
  const deliverables = service.deliverables ?? [];

  // A natural-language stack mention for the Overview paragraph (e.g.
  // "Next.js, TypeScript, Tailwind CSS, and PostgreSQL") — built from the
  // same `technologies` list rendered as badges further down the page,
  // so the two never drift out of sync.
  const techSentence =
    technologies.length === 0
      ? ""
      : technologies.length === 1
        ? technologies[0]
        : `${technologies.slice(0, -1).join(", ")}, and ${technologies[technologies.length - 1]}`;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)] pt-20 pb-14 text-center">
        <div className="grid-field absolute inset-0 -z-10" />
        <div
          className="absolute -top-32 left-1/2 -z-10 h-[380px] w-[680px] -translate-x-1/2 rounded-full opacity-25 blur-[110px]"
          style={{ background: "radial-gradient(circle, var(--color-electric) 0%, transparent 70%)" }}
        />
        <Container>
          <h1 className="mx-auto max-w-3xl text-4xl font-medium tracking-tight text-[var(--color-paper)] sm:text-5xl">
            {service.name}
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-electric)] to-[var(--color-cyan)] px-5 py-2.5 text-base font-medium text-white"
          >
            <Link href="/" className="hover:opacity-80">Home</Link>
            <ChevronRight className="h-4 w-4 opacity-80" />
            <Link href="/services" className="hover:opacity-80">Services</Link>
            <ChevronRight className="h-4 w-4 opacity-80" />
            <span className="opacity-90">{service.name}</span>
          </nav>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">
            {service.shortDescription}
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/get-a-quote" variant="primary" showArrow>
              Start a Project
            </Button>
          </div>
        </Container>
      </section>

      <section className="pt-14 pb-20">
        <Container>
          <div className="rounded-2xl bg-[var(--color-surface-raised)] px-6 py-4">
            <h2 className="text-lg font-medium text-[var(--color-paper)]">Overview</h2>
          </div>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-muted)]">
            {service.shortDescription}
            {techSentence && (
              <>
                {" "}Our team leverages modern technologies such as {techSentence} to build
                high-performance {service.name.toLowerCase()} solutions tailored to your needs.
              </>
            )}
          </p>

          <div className="mt-10 grid gap-16 lg:grid-cols-2">
            <div>
              <Badge>Problems we solve</Badge>
              <ul className="mt-6 space-y-4">
                {problems.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-electric-soft)]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Badge>Key features</Badge>
              <ul className="mt-6 space-y-4">
                {features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-cyan)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-[var(--color-border)] py-20">
        <Container>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mt-3 text-base font-medium text-[var(--color-paper)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-[var(--color-border)] py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="mt-6 flex flex-wrap gap-2">
              {technologies.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </div>
          <div>
            <ul className="mt-6 space-y-3">
              {deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-cyan)]" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-t border-[var(--color-border)] py-20 text-center">
        <Container>
          <h2 className="text-balance mx-auto max-w-lg text-3xl font-medium tracking-tight text-[var(--color-paper)]">
            Ready to talk about your {service.name.toLowerCase()} project?
          </h2>
          <div className="mt-8 flex justify-center gap-4">
            <Button href="/get-a-quote" variant="primary" showArrow>Get a Quote</Button>
            <Button href="/contact" variant="secondary">Contact Us</Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
