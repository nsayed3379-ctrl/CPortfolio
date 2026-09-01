import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { EmptyStateSection } from "@/components/shared/EmptyState";
import ShowcaseGrid from "@/components/showcase/ShowcaseGrid";
import ShowcaseTile from "@/components/showcase/ShowcaseTile";
import { sanityFetchList } from "@/sanity/fetch";
import { EXPERIMENT_LIST_QUERY } from "@/sanity/queries";
import type { ExperimentDoc } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Labs",
  description: "Experimental and research work from VecoSoft — beyond what exists today.",
};

export default async function LabsPage() {
  const experiments = await sanityFetchList<ExperimentDoc>(EXPERIMENT_LIST_QUERY, {}, { tags: ["experiment"] });

  return (
    <div className="py-24">
      <Container>
        <SectionHeading
          title="Beyond what exists."
          description="Early-stage research and prototypes. Not every experiment becomes a product — that's the point of a lab."
          className="mb-16"
        />
      </Container>

      {experiments.length === 0 ? (
        <EmptyStateSection
          showCta={false}
          message="We're currently building research partnerships and early-stage experiments. Details on our collaborators and ongoing work will be published here soon."
        />
      ) : (
        <Container>
          <ShowcaseGrid className="sm:grid-cols-3">
            {experiments.map((exp) => (
              <ShowcaseTile
                key={exp._id}
                slug={exp.slug.current}
                href={`/labs/${exp.slug.current}`}
                title={exp.title}
                category={exp.category}
                status={exp.status}
                media={exp.images.thumbnail}
                size="standard"
              />
            ))}
          </ShowcaseGrid>
        </Container>
      )}
    </div>
  );
}