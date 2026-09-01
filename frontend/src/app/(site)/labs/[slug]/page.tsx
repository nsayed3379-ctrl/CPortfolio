import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatusBadge from "@/components/ui/StatusBadge";
import MediaFrame from "@/components/ui/MediaFrame";
import { sanityFetch } from "@/sanity/fetch";
import { EXPERIMENT_BY_SLUG_QUERY } from "@/sanity/queries";
import { fallbackExperimentBySlug } from "@/sanity/fallbacks";
import type { ExperimentDoc } from "@/sanity/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const exp = (await sanityFetch<ExperimentDoc>(EXPERIMENT_BY_SLUG_QUERY, { slug }, { tags: [`experiment:${slug}`] })) ?? fallbackExperimentBySlug(slug);
  if (!exp) return {};
  return { title: exp.title, description: exp.summary };
}

export default async function ExperimentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exp = (await sanityFetch<ExperimentDoc>(EXPERIMENT_BY_SLUG_QUERY, { slug }, { tags: [`experiment:${slug}`] })) ?? fallbackExperimentBySlug(slug);
  if (!exp) notFound();

  const technologies = exp.technologies ?? [];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <MediaFrame media={exp.images.heroImage} className="absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-[var(--color-ink)]/40" />
        <Container className="relative py-24">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{exp.category}</Badge>
            <StatusBadge status={exp.status} />
          </div>
          <h1 className="mt-6 max-w-2xl text-4xl font-medium tracking-tight text-[var(--color-paper)] sm:text-5xl">
            {exp.title}
          </h1>
          <p className="mt-4 max-w-lg text-lg text-[var(--color-muted)]">{exp.summary}</p>
        </Container>
      </section>

      <section className="border-b border-[var(--color-border)] py-20">
        <Container>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">{exp.description}</p>
        </Container>
      </section>

      <section className="border-b border-[var(--color-border)] py-20">
        <Container>
            <div className="mt-6 flex flex-wrap gap-2">
            {technologies.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </Container>
      </section>

      <section className="py-20 text-center">
        <Container>
          <h2 className="text-balance mx-auto max-w-lg text-3xl font-medium tracking-tight text-[var(--color-paper)]">
            Curious where this could go?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-muted)]">
            Labs work is early-stage by nature. If this direction is relevant to your business, we&apos;d like to talk.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button href="/contact" variant="primary" showArrow>Talk to Us</Button>
            <Button href="/labs" variant="secondary">Back to Labs</Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
