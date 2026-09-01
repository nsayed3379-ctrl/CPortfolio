import { FEATURES } from "@/lib/constants";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import StatusBadge from "@/components/ui/StatusBadge";
import MediaFrame from "@/components/ui/MediaFrame";
import { sanityFetch } from "@/sanity/fetch";
import { CASE_STUDY_BY_SLUG_QUERY } from "@/sanity/queries";
import type { CaseStudyDoc } from "@/sanity/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = await sanityFetch<CaseStudyDoc>(CASE_STUDY_BY_SLUG_QUERY, { slug }, { tags: [`caseStudy:${slug}`] });
  if (!cs) return {};
  return { title: cs.title, description: cs.summary };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!FEATURES.work) notFound();
  const { slug } = await params;
  const cs = await sanityFetch<CaseStudyDoc>(CASE_STUDY_BY_SLUG_QUERY, { slug }, { tags: [`caseStudy:${slug}`] });
  if (!cs) notFound();

  const approach = cs.approach ?? [];
  const technologies = cs.technologies ?? [];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <MediaFrame media={cs.images.heroImage} className="absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-[var(--color-ink)]/40" />
        <Container className="relative py-24">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{cs.industry}</Badge>
            <StatusBadge status={cs.status} />
          </div>
          <h1 className="mt-6 max-w-2xl text-4xl font-medium tracking-tight text-[var(--color-paper)] sm:text-5xl">
            {cs.title}
          </h1>
          <p className="mt-4 text-sm text-[var(--color-muted)]">Client: {cs.client}</p>
        </Container>
      </section>

      <section className="border-b border-[var(--color-border)] py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">{cs.challenge}</p>
          </div>
          <div>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">{cs.solution}</p>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-border)] py-20">
        <Container>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {approach.map((a, i) => (
              <li key={a} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm leading-relaxed text-[var(--color-muted)]">
                <p className="mt-2">{a}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-[var(--color-border)] py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">{cs.architecture}</p>
          </div>
          <div>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">{cs.result}</p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="mt-6 flex flex-wrap gap-2">
            {technologies.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </Container>
      </section>
    </div>
  );
}
