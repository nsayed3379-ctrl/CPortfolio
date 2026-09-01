import { FEATURES } from "@/lib/constants";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { sanityFetch } from "@/sanity/fetch";
import { SOLUTION_BY_SLUG_QUERY } from "@/sanity/queries";
import { fallbackSolutionBySlug } from "@/sanity/fallbacks";
import type { SolutionDoc } from "@/sanity/types";
import { Check, ArrowUpRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = (await sanityFetch<SolutionDoc>(SOLUTION_BY_SLUG_QUERY, { slug }, { tags: [`solution:${slug}`] })) ?? fallbackSolutionBySlug(slug);
  if (!solution) return {};
  return { title: solution.name, description: solution.shortDescription };
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!FEATURES.solutions) notFound();
  const { slug } = await params;
  const solution = (await sanityFetch<SolutionDoc>(SOLUTION_BY_SLUG_QUERY, { slug }, { tags: [`solution:${slug}`] })) ?? fallbackSolutionBySlug(slug);
  if (!solution) notFound();

  const related = solution.relatedServices ?? [];
  const outcomes = solution.outcomes ?? [];

  return (
    <div>
      <section className="border-b border-[var(--color-border)] py-20">
        <Container>
          <h1 className="mt-6 max-w-2xl text-4xl font-medium tracking-tight text-[var(--color-paper)] sm:text-5xl">
            {solution.name}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-muted)]">
            {solution.shortDescription}
          </p>
          <div className="mt-8">
            <Button href="/get-a-quote" variant="primary" showArrow>Start a Project</Button>
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--color-border)] py-20">
        <Container>
          <ul className="mt-6 max-w-xl space-y-4">
            {outcomes.map((o) => (
              <li key={o} className="flex gap-3 text-base leading-relaxed text-[var(--color-muted)]">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-cyan)]" />
                {o}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="py-20">
          <Container>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service.slug.current}`}
                  className="focus-ring group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-border-hover)]"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-medium text-[var(--color-paper)]">{service.name}</h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--color-muted-2)] group-hover:text-[var(--color-cyan)]" />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{service.shortDescription}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
