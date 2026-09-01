import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { WHY_VICOSOFT } from "@/lib/constants";

export default function WhyVicosoft({
  items: itemsProp,
}: {
  items?: { title: string; description: string }[];
}) {
  const items = itemsProp && itemsProp.length > 0 ? itemsProp : WHY_VICOSOFT;
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Why VecoSoft"
          title="What working with us actually looks like."
          align="center"
          className="mx-auto mb-12"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <SpotlightCard key={item.title}>
            <h3 className="mt-3 text-lg font-medium text-[var(--color-paper)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                {item.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
