import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import ShowcaseGrid from "@/components/showcase/ShowcaseGrid";
import ShowcaseTile from "@/components/showcase/ShowcaseTile";
import { sanityFetchList } from "@/sanity/fetch";
import { EXPERIMENT_LIST_QUERY } from "@/sanity/queries";
import { selectFeatured } from "@/lib/selectFeatured";
import type { ExperimentDoc } from "@/sanity/types";

export default async function LabsPreview() {
  // See src/lib/selectFeatured.ts for the fallback/featured/all-real logic.
  const fetched = await sanityFetchList<ExperimentDoc>(EXPERIMENT_LIST_QUERY, {}, { tags: ["experiment"] });
  if (fetched.length === 0) return null;
  const selected = selectFeatured(fetched, [], 6);
  const experiments = selected.map((e) => ({
    slug: e.slug.current,
    title: e.title,
    category: e.category,
    status: e.status,
    images: e.images,
  }));

  return (
    <section className="py-24">
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="VecoSoft labs"
            title="Beyond what exists."
            description="Experimental work, research, and early-stage explorations that may become products."
          />
          <Button href="/labs" variant="secondary" showArrow className="shrink-0">
            Visit Labs
          </Button>
        </div>

        <ShowcaseGrid className="auto-rows-[160px] sm:auto-rows-[180px] sm:grid-cols-3">
          {experiments.map((exp) => (
            <ShowcaseTile
              key={exp.slug}
              slug={exp.slug}
              href={`/labs/${exp.slug}`}
              title={exp.title}
              category={exp.category}
              status={exp.status}
              media={exp.images.thumbnail}
              size="standard"
            />
          ))}
        </ShowcaseGrid>
      </Container>
    </section>
  );
}
