import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { sanityFetch } from "@/sanity/fetch";
import { JOB_BY_SLUG_QUERY } from "@/sanity/queries";
import { fallbackJobBySlug } from "@/sanity/fallbacks";
import type { JobDoc } from "@/sanity/types";
import { Briefcase, Check, Clock, GraduationCap, MapPin, Wallet, type LucideIcon } from "lucide-react";

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
  const niceToHave = job.niceToHave ?? [];
  const benefits = job.benefits ?? [];

  // Quick-scan facts strip under the title — duration/stipend only appear
  // when the job actually has them (mainly internships; a full-time role
  // just shows location/type/experience).
  const metaFacts: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Briefcase, label: "Type", value: job.type },
    { icon: GraduationCap, label: "Experience", value: job.experience },
    ...(job.duration ? [{ icon: Clock, label: "Duration", value: job.duration }] : []),
    ...(job.stipend ? [{ icon: Wallet, label: "Stipend", value: job.stipend }] : []),
  ];

  return (
    <div className="py-14 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{job.type}</Badge>
            {job.deadline && (
              <span className="text-xs text-[var(--color-muted-2)]">
                Apply by{" "}
                {new Date(job.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </span>
            )}
          </div>

          <h1 className="text-fluid-h1 mt-3 font-medium text-[var(--color-paper)]">
            {job.title}
          </h1>

          {job.tags && job.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {job.tags.map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:grid-cols-3 sm:p-6">
            {metaFacts.map((f) => (
              <div key={f.label} className="flex items-start gap-2.5">
                <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-cyan)]" />
                <div className="min-w-0">
                  <p className="text-xs text-[var(--color-muted-2)]">{f.label}</p>
                  <p className="text-sm font-medium text-[var(--color-paper)]">{f.value}</p>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-10">
            <Badge>Description</Badge>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">{job.about}</p>
          </section>

          {benefits.length > 0 && (
            <section className="mt-10">
              <Badge>What you get</Badge>
              <ul className="mt-4 space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-cyan)]" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10">
            <Badge>Responsibilities</Badge>
            <ul className="mt-4 space-y-3">
              {responsibilities.map((r) => (
                <li key={r} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-electric-soft)]" />
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <Badge>Requirements</Badge>
            <ul className="mt-4 space-y-3">
              {requirements.map((r) => (
                <li key={r} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-cyan)]" />
                  {r}
                </li>
              ))}
            </ul>
          </section>

          {niceToHave.length > 0 && (
            <section className="mt-10">
              <Badge>Good to have (not required)</Badge>
              <ul className="mt-4 space-y-3">
                {niceToHave.map((r) => (
                  <li key={r} className="flex gap-3 text-sm leading-relaxed text-[var(--color-muted)]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-muted-2)]" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div>
          <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <h2 className="mb-6 text-lg font-medium text-[var(--color-paper)]">Apply for this role</h2>
            <ApplicationForm jobTitle={job.title} jobId={jobId} />
          </div>
        </div>
      </Container>
    </div>
  );
}
