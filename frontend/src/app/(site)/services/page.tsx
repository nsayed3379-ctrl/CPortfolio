import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { sanityFetchList } from "@/sanity/fetch";
import { SERVICE_LIST_QUERY } from "@/sanity/queries";
import { fallbackServices } from "@/sanity/fallbacks";
import type { ServiceDoc } from "@/sanity/types";
import ServiceCardGrid from "@/components/services/ServiceCardGrid";

export const metadata: Metadata = {
  title: "Services",
  description: "Web development, AI & ML, mobile apps, UI/UX design, cloud & DevOps, and custom software from VecoSoft.",
};

export default async function ServicesPage() {
  const fetched = await sanityFetchList<ServiceDoc>(SERVICE_LIST_QUERY, {}, { tags: ["service"] });
  const services = fetched.length > 0 ? fetched : fallbackServices();

  return (
    <div className="py-24">
      <Container>
        <SectionHeading
          title="Everything a growing product needs, under one roof."
          description="We work across the full stack — from first design concept to the infrastructure keeping your product online."
          className="mb-16"
        />

        <ServiceCardGrid services={services} />
      </Container>
    </div>
  );
}
