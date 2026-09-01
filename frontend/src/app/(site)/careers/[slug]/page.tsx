import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { sanityFetch } from "@/sanity/fetch";
import { JOB_BY_SLUG_QUERY } from "@/sanity/queries";
import { fallbackJobBySlug } from "@/sanity/fallbacks";
import type { JobDoc } from "@/sanity/types";
import { MapPin, Briefcase, GraduationCap, Check } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = (await sanityFetch<JobDoc>(JOB_BY_SLUG_QUERY, { slug }, { tags: [`job:${slug}`] })) ?? fallbackJobBySlug(slug);
  if (!job) return {};
  return { title: job.title, description: job.about };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const realJob = await sanityFetch<JobDoc>(JOB_BY_SLUG_QUERY, { slug }, { tags: [`job:${slug}`] });
  const job = realJob ?? fallbackJobBySlug(slug);
  if (!job) notFound();

  // Only a real Sanity document has a genuine _id we can safely reference
  // from a jobApplication — fallback/placeholder jobs (from constants.ts)
  // use their slug as a synthetic _id, which isn't a real document to
  // reference. See jobApplication.ts's schema comment for the full reasoning.
  const jobId = realJob ? realJob._id : undefined;

  const responsibilities = job.responsibilities ?? [];
  const requirements = job.requirements ?? [];

  return (
    <div className="py-20">
      <Container className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-[var(--color-paper)] sm:text-4xl">
            {job.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{job.location}</span>
            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{job.type}</span>
            <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" />{job.experience}</span>
          </div>
          {job.tags && job.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {job.tags.map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          )}

          <p className="mt-8 text-base leading-relaxed text-[var(--color-muted)]">{job.about}</p>

          <div className="mt-10">
            <ul className="mt-4 space-y-3">
              {responsibilities.map((r) => (
                <li key={r} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-electric-soft)]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <ul className="mt-4 space-y-3">
              {requirements.map((r) => (
                <li key={r} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-cyan)]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {job.niceToHave && job.niceToHave.length > 0 && (
            <div className="mt-10">
            <ul className="mt-4 space-y-3">
                {job.niceToHave.map((r) => (
                  <li key={r} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-muted-2)]" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div className="mt-10">
            <div className="mt-4 flex flex-wrap gap-2">
                {job.benefits.map((b) => <Badge key={b}>{b}</Badge>)}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <h2 className="text-lg font-medium text-[var(--color-paper)]">Apply for this role</h2>
            <p className="mt-2 mb-6 text-sm text-[var(--color-muted)]">
              We review every application personally. Expect a response within 24–48 hours.
            </p>
            <ApplicationForm jobTitle={job.title} jobId={jobId} />
          </div>
        </div>
      </Container>
    </div>
  );
}
