import { notFound } from "next/navigation";
import { FEATURES } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { EmptyStateSection } from "@/components/shared/EmptyState";
import ShowcaseGrid from "@/components/showcase/ShowcaseGrid";
import ShowcaseTile from "@/components/showcase/ShowcaseTile";
import { sanityFetchList } from "@/sanity/fetch";
import { CASE_STUDY_LIST_QUERY } from "@/sanity/queries";
import type { CaseStudyDoc } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected work and case studies from VecoSoft.",
};

export default async function WorkPage() {
  if (!FEATURES.work) notFound();
  const caseStudies = await sanityFetchList<CaseStudyDoc>(CASE_STUDY_LIST_QUERY, {}, { tags: ["caseStudy"] });

  return (
    <div className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          title="How we work, through real projects."
          description="Client engagements, the problems we solved, and how we approached them."
          className="mb-16"
        />
      </Container>

      {caseStudies.length === 0 ? (
        <EmptyStateSection
          message={
            <>
              We&apos;re currently working with our first clients and will publish case studies here
              once projects are complete. We don&apos;t publish placeholder results — in the
              meantime, take a look at{" "}
              <Link href="/products" className="focus-ring text-[var(--color-cyan)] underline underline-offset-2">
                what we&apos;re building
              </Link>{" "}
              in-house.
            </>
          }
        />
      ) : (
        <Container>
          <ShowcaseGrid>
            {caseStudies.map((cs) => (
              <ShowcaseTile
                key={cs._id}
                slug={cs.slug.current}
                href={`/work/${cs.slug.current}`}
                title={cs.title}
                category={cs.industry}
                status={cs.status}
                media={cs.images.thumbnail}
                size={cs.size}
              />
            ))}
          </ShowcaseGrid>
        </Container>
      )}
    </div>
  );
}
