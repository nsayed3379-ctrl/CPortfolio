import type { SchemaTypeDefinition } from "sanity";

// Reusable objects
import mediaRef from "./objects/mediaRef";
import projectImages from "./objects/projectImages";
import { featureItem, processStep, howItWorksStep, techGroup, workStep } from "./objects/sharedObjects";

// Public content documents (Phase 1 — see SETUP.md for the full roadmap)
import service from "./documents/service";
import solution from "./documents/solution";
import productCategory from "./documents/productCategory";
import product from "./documents/product";
import caseStudy from "./documents/caseStudy";
import experiment from "./documents/experiment";
import job from "./documents/job";
import faq from "./documents/faq";
import siteSettings from "./documents/siteSettings";
import teamMember from "./documents/teamMember";

// Private operational-data documents (Phase 3.3). Deliberately never
// referenced by any query in src/sanity/queries.ts — the public site has
// no read path to these at all. Written only via the /api/contact,
// /api/inquiry, /api/applications route handlers (Phase 3.4, not yet
// built) using the server-only SANITY_API_TOKEN. See SETUP.md.
import contactMessage from "./documents/contactMessage";
import projectInquiry from "./documents/projectInquiry";
import jobApplication from "./documents/jobApplication";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects first (documents reference them)
  mediaRef,
  projectImages,
  featureItem,
  processStep,
  howItWorksStep,
  techGroup,
  workStep,

  // Documents
  service,
  solution,
  productCategory,
  product,
  caseStudy,
  experiment,
  job,
  faq,
  siteSettings,
  teamMember,

  // Private
  contactMessage,
  projectInquiry,
  jobApplication,
];
