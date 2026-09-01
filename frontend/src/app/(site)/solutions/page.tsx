import { notFound } from "next/navigation";
import { FEATURES } from "@/lib/constants";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { sanityFetchList } from "@/sanity/fetch";
import { SOLUTION_LIST_QUERY } from "@/sanity/queries";
import { fallbackSolutions } from "@/sanity/fallbacks";
import type { SolutionDoc } from "@/sanity/types";
import SolutionCardGrid from "@/components/solutions/SolutionCardGrid";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Outcome-focused solutions from VecoSoft — product development, AI automation, and digital transformation.",
};

export default async function SolutionsPage() {
  if (!FEATURES.solutions) notFound();
  const fetched = await sanityFetchList<SolutionDoc>(SOLUTION_LIST_QUERY, {}, { tags: ["solution"] });
  const solutions = fetched.length > 0 ? fetched : fallbackSolutions();

  return (
    <div className="py-24">
      <Container>
        <SectionHeading
          title="Outcomes, not just deliverables."
          description="Solutions combine our services into a focused path toward a specific business outcome."
          className="mb-16"
        />

        <SolutionCardGrid solutions={solutions} />
      </Container>
    </div>
  );
}
