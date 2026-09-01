import Hero from "@/components/home/Hero";
import CapabilitySignal from "@/components/home/CapabilitySignal";
import WhatWeDo from "@/components/home/WhatWeDo";
import ExploreShowcase from "@/components/home/ExploreShowcase";
import ProductsEcosystem from "@/components/home/ProductsEcosystem";
import LabsPreview from "@/components/home/LabsPreview";
import TechnologySection from "@/components/home/TechnologySection";
import HowWeWork from "@/components/home/HowWeWork";
import CommitmentStrip from "@/components/shared/CommitmentStrip";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import { getSiteSettings } from "@/sanity/siteSettings";
import { sanityFetchList } from "@/sanity/fetch";
import { FAQ_LIST_QUERY, PRODUCT_LIST_QUERY, CASE_STUDY_LIST_QUERY, EXPERIMENT_LIST_QUERY } from "@/sanity/queries";
import { selectFeatured } from "@/lib/selectFeatured";
import type { FaqDoc, ProductDoc, CaseStudyDoc, ExperimentDoc } from "@/sanity/types";
import { FEATURES } from "@/lib/constants";
export default async function Home() {
  // getSiteSettings() is request-memoized (see src/sanity/siteSettings.ts),
  // so this doesn't duplicate the fetch already made in (site)/layout.tsx
  // for the Footer — both resolve to the same single call per request.
  const [settings, faqs, products, work, labs] = await Promise.all([
    getSiteSettings(),
    sanityFetchList<FaqDoc>(FAQ_LIST_QUERY, {}, { tags: ["faq"] }),
    sanityFetchList<ProductDoc>(PRODUCT_LIST_QUERY, {}, { tags: ["product"] }),
    sanityFetchList<CaseStudyDoc>(CASE_STUDY_LIST_QUERY, {}, { tags: ["caseStudy"] }),
    sanityFetchList<ExperimentDoc>(EXPERIMENT_LIST_QUERY, {}, { tags: ["experiment"] }),
  ]);

  // Cap to featured + a sane limit before handing off to ExploreShowcase
  // (see src/lib/selectFeatured.ts) — this section is meant to be a
  // curated highlight reel, not a full browse of every Product/Work/Labs
  // item, which stops scaling once any collection grows past a handful.
  // No fallback array passed here (`[]`) — ExploreShowcase already has its
  // own constants.ts fallback for the "genuinely no real data yet" case;
  // this only handles the featured/capping logic on top of real data.
  const featuredProducts = selectFeatured(products, [], 6);
  const featuredWork = selectFeatured(work, [], 6);
  const featuredLabs = selectFeatured(labs, [], 6);

  return (
    <>
      <Hero tagline={settings?.tagline} />
      <CapabilitySignal capabilities={settings?.capabilities} />
      <CommitmentStrip commitments={settings?.commitments} />
      <WhatWeDo />
      {(FEATURES.products || FEATURES.work) && (
        <ExploreShowcase products={featuredProducts} work={featuredWork} labs={featuredLabs} />
      )}
      {FEATURES.products && <ProductsEcosystem />}
      <LabsPreview />
      <TechnologySection groups={settings?.techStackGroups} />
      <HowWeWork steps={settings?.howWeWork} />
      <FAQSection faqs={faqs} />
      <CTASection />
    </>
  );
}
