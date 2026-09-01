// Query descriptors consumed by sanityFetch/sanityFetchList (see ./fetch.ts).
//
// These replace the old GROQ query strings 1:1 by name — every page file
// still does `import { SERVICE_LIST_QUERY } from "@/sanity/queries"` and
// `sanityFetchList<ServiceDoc>(SERVICE_LIST_QUERY, ...)` completely
// unchanged. Only what's *inside* each export changed: instead of a GROQ
// string, it's now `{ path, transform }` — path builds the backend's REST
// URL (see BACKEND_INTEGRATION.md for the full endpoint list), and
// transform reshapes the backend's snake_case JSON into the exact same
// camelCase `*Doc` shape (src/sanity/types.ts) the components already
// expect, so no component needs to change either.

import type {
  ServiceDoc, SolutionDoc, ProductDoc, ProductCategoryDoc, CaseStudyDoc,
  ExperimentDoc, JobDoc, FaqDoc, TeamMemberDoc, SiteSettingsDoc,
  ProjectImagesDoc, MediaRefDoc,
} from "./types";

export type QueryDef<T> = {
  path: (params: Record<string, string | number | undefined>) => string;
  transform: (raw: unknown) => T;
};

function qs(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
}

// ---------------------------------------------------------------- services
export const SERVICE_LIST_QUERY: QueryDef<ServiceDoc[]> = {
  path: () => "/services",
  transform: (raw) => (raw as any[]).map(toService),
};
export const SERVICE_BY_SLUG_QUERY: QueryDef<ServiceDoc> = {
  path: ({ slug }) => `/services/${slug}`,
  transform: (raw) => toService(raw),
};
export const SERVICE_SLUGS_QUERY: QueryDef<string[]> = {
  path: () => "/services",
  transform: (raw) => (raw as any[]).map((r) => r.slug),
};

function toService(r: any): ServiceDoc {
  return {
    _id: String(r.id),
    name: r.name,
    slug: { current: r.slug },
    shortDescription: r.short_description,
    icon: r.icon,
    problems: r.problems ?? [],
    features: r.features ?? [],
    technologies: r.technologies ?? [],
    process: r.process ?? [],
    deliverables: r.deliverables ?? [],
    order: r.display_order ?? undefined,
  };
}

// ---------------------------------------------------------------- solutions
export const SOLUTION_LIST_QUERY: QueryDef<SolutionDoc[]> = {
  path: () => "/solutions",
  transform: (raw) => (raw as any[]).map(toSolution),
};
export const SOLUTION_BY_SLUG_QUERY: QueryDef<SolutionDoc> = {
  path: ({ slug }) => `/solutions/${slug}`,
  transform: (raw) => toSolution(raw),
};
export const SOLUTION_SLUGS_QUERY: QueryDef<string[]> = {
  path: () => "/solutions",
  transform: (raw) => (raw as any[]).map((r) => r.slug),
};

function toSolution(r: any): SolutionDoc {
  return {
    _id: String(r.id),
    name: r.name,
    slug: { current: r.slug },
    shortDescription: r.short_description,
    outcomes: r.outcomes ?? [],
    relatedServices: Array.isArray(r.relatedServices) ? r.relatedServices.map(toService) : undefined,
    order: r.display_order ?? undefined,
  };
}

// ---------------------------------------------------------- product categories
export const PRODUCT_CATEGORY_LIST_QUERY: QueryDef<ProductCategoryDoc[]> = {
  path: () => "/product-categories",
  transform: (raw) => (raw as any[]).map((r) => ({ _id: String(r.id), name: r.name, slug: r.slug })),
};

// -------------------------------------------------------------------- products
export const PRODUCT_LIST_QUERY: QueryDef<ProductDoc[]> = {
  path: () => "/products",
  transform: (raw) => (raw as any[]).map(toProduct),
};
export const PRODUCT_LIST_BY_CATEGORY_QUERY: QueryDef<ProductDoc[]> = {
  path: ({ categorySlug }) => `/products/category/${categorySlug}`,
  transform: (raw) => (raw as any[]).map(toProduct),
};
export const PRODUCT_FEATURED_QUERY: QueryDef<ProductDoc[]> = {
  path: ({ limit }) => `/products/featured${qs({ limit })}`,
  transform: (raw) => (raw as any[]).map(toProduct),
};
export const PRODUCT_BY_SLUG_QUERY: QueryDef<ProductDoc> = {
  path: ({ slug }) => `/products/${slug}`,
  transform: (raw) => toProduct(raw),
};
export const PRODUCT_SLUGS_QUERY: QueryDef<string[]> = {
  path: () => "/products",
  transform: (raw) => (raw as any[]).map((r) => r.slug),
};

function toProduct(r: any): ProductDoc {
  return {
    _id: String(r.id),
    name: r.name,
    slug: { current: r.slug },
    category: r.category ? { name: r.category.name, slug: r.category.slug } : null,
    tagline: r.tagline,
    status: r.status,
    description: r.description,
    problem: r.problem,
    idea: r.idea,
    howItWorks: r.how_it_works ?? [],
    features: r.features ?? [],
    technologies: r.technologies ?? [],
    useCases: r.use_cases ?? [],
    roadmap: r.roadmap ?? [],
    images: toProjectImages(r.images),
    size: r.size,
    featured: r.featured ?? false,
    order: r.display_order ?? undefined,
  };
}

// ------------------------------------------------------------- case studies
export const CASE_STUDY_LIST_QUERY: QueryDef<CaseStudyDoc[]> = {
  path: () => "/case-studies",
  transform: (raw) => (raw as any[]).map(toCaseStudy),
};
export const CASE_STUDY_FEATURED_QUERY: QueryDef<CaseStudyDoc[]> = {
  path: ({ limit }) => `/case-studies/featured${qs({ limit })}`,
  transform: (raw) => (raw as any[]).map(toCaseStudy),
};
export const CASE_STUDY_BY_SLUG_QUERY: QueryDef<CaseStudyDoc> = {
  path: ({ slug }) => `/case-studies/${slug}`,
  transform: (raw) => toCaseStudy(raw),
};
export const CASE_STUDY_SLUGS_QUERY: QueryDef<string[]> = {
  path: () => "/case-studies",
  transform: (raw) => (raw as any[]).map((r) => r.slug),
};

function toCaseStudy(r: any): CaseStudyDoc {
  return {
    _id: String(r.id),
    title: r.title,
    slug: { current: r.slug },
    client: r.client,
    industry: r.industry,
    status: r.status,
    summary: r.summary,
    challenge: r.challenge,
    approach: r.approach ?? [],
    solution: r.solution,
    architecture: r.architecture,
    result: r.result,
    technologies: r.technologies ?? [],
    images: toProjectImages(r.images),
    size: r.size,
    featured: r.featured ?? false,
    publishedAt: r.published_at ?? undefined,
    clientApproved: r.client_approved ?? false,
  };
}

// -------------------------------------------------------------- experiments
export const EXPERIMENT_LIST_QUERY: QueryDef<ExperimentDoc[]> = {
  path: () => "/experiments",
  transform: (raw) => (raw as any[]).map(toExperiment),
};
export const EXPERIMENT_FEATURED_QUERY: QueryDef<ExperimentDoc[]> = {
  path: ({ limit }) => `/experiments/featured${qs({ limit })}`,
  transform: (raw) => (raw as any[]).map(toExperiment),
};
export const EXPERIMENT_BY_SLUG_QUERY: QueryDef<ExperimentDoc> = {
  path: ({ slug }) => `/experiments/${slug}`,
  transform: (raw) => toExperiment(raw),
};
export const EXPERIMENT_SLUGS_QUERY: QueryDef<string[]> = {
  path: () => "/experiments",
  transform: (raw) => (raw as any[]).map((r) => r.slug),
};

function toExperiment(r: any): ExperimentDoc {
  return {
    _id: String(r.id),
    title: r.title,
    slug: { current: r.slug },
    category: r.category,
    status: r.status,
    summary: r.summary,
    description: r.description,
    technologies: r.technologies ?? [],
    images: toProjectImages(r.images),
    size: r.size,
    order: r.display_order ?? undefined,
    featured: r.featured ?? false,
  };
}

// -------------------------------------------------------------------- jobs
export const JOB_LIST_QUERY: QueryDef<JobDoc[]> = {
  path: () => "/jobs",
  transform: (raw) => (raw as any[]).map(toJob),
};
export const JOB_BY_SLUG_QUERY: QueryDef<JobDoc> = {
  path: ({ slug }) => `/jobs/${slug}`,
  transform: (raw) => toJob(raw),
};
export const JOB_SLUGS_QUERY: QueryDef<string[]> = {
  path: () => "/jobs",
  transform: (raw) => (raw as any[]).map((r) => r.slug),
};

function toJob(r: any): JobDoc {
  return {
    _id: String(r.id),
    title: r.title,
    slug: { current: r.slug },
    location: r.location,
    type: r.type,
    experience: r.experience,
    tags: r.tags ?? [],
    about: r.about,
    responsibilities: r.responsibilities ?? [],
    requirements: r.requirements ?? [],
    niceToHave: r.nice_to_have ?? [],
    benefits: r.benefits ?? [],
    status: r.status,
    deadline: r.deadline ?? undefined,
  };
}

// -------------------------------------------------------------------- faqs
export const FAQ_LIST_QUERY: QueryDef<FaqDoc[]> = {
  path: () => "/faqs",
  transform: (raw) => (raw as any[]).map((r) => ({ _id: String(r.id), question: r.question, answer: r.answer, order: r.display_order ?? undefined })),
};

// ------------------------------------------------------------- team members
export const TEAM_MEMBER_LIST_QUERY: QueryDef<TeamMemberDoc[]> = {
  path: () => "/team-members",
  transform: (raw) =>
    (raw as any[]).map((r) => ({
      _id: String(r.id),
      name: r.name,
      role: r.role,
      photoUrl: r.photo_url ?? undefined,
      quote: r.quote,
      linkedin: r.linkedin ?? undefined,
    })),
};

// ------------------------------------------------------------ site settings
export const SITE_SETTINGS_QUERY: QueryDef<SiteSettingsDoc> = {
  path: () => "/site-settings",
  transform: (raw: any) => ({
    companyName: raw.company_name,
    tagline: raw.tagline,
    email: raw.email,
    location: raw.location,
    socialLinks: raw.social_links ?? {},
    capabilities: raw.capabilities ?? [],
    commitments: raw.commitments ?? [],
    whyVicosoft: raw.why_vicosoft ?? [],
    techStackGroups: raw.tech_stack_groups ?? [],
    howWeWork: raw.how_we_work ?? [],
    seo: raw.seo
      ? { title: raw.seo.title, description: raw.seo.description, ogImageUrl: raw.seo.ogImageUrl }
      : undefined,
  }),
};

// ------------------------------------------------------------------- shared
function toProjectImages(images: any): ProjectImagesDoc {
  const media = (m: any): MediaRefDoc | undefined =>
    m ? { label: m.label, tone: m.tone, variant: m.variant, imageUrl: m.imageUrl } : undefined;
  const empty: MediaRefDoc = { label: "", tone: "electric", imageUrl: undefined };
  return {
    thumbnail: media(images?.thumbnail) ?? empty,
    heroImage: media(images?.heroImage) ?? empty,
    gallery: Array.isArray(images?.gallery) ? images.gallery.map(media) : [],
  };
}
