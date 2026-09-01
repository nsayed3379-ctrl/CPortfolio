// Converts constants.ts's original dummy content into the same shape
// Sanity queries return, so every page — list AND detail — can fall back
// consistently. Without this, the homepage (which already falls back to
// constants.ts, e.g. ProductStack) would show "VecoAI" while /products
// showed an empty state, and clicking through from the homepage tile
// would 404 since no matching Sanity document exists yet. This keeps
// list pages and detail pages in sync during the gradual migration from
// dummy to real content.
//
// Deliberate exception: Work (case studies) has NO fallback here — see
// the comment on fallbackCaseStudies() below.

import { SERVICES, SOLUTIONS, PRODUCTS, CASE_STUDIES, EXPERIMENTS, JOBS, TEAM_MEMBERS } from "@/lib/constants";
import type {
  ServiceDoc, SolutionDoc, ProductDoc, ProductCategoryDoc, CaseStudyDoc, ExperimentDoc, JobDoc, TeamMemberDoc,
} from "./types";

// Turns a free-text category string ("AI Platform") into the same
// slug shape a real productCategory document would have ("ai-platform"),
// so fallback data matches Sanity's dereferenced category shape.
function slugifyCategory(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function fallbackProductCategories(): ProductCategoryDoc[] {
  const seen = new Map<string, ProductCategoryDoc>();
  for (const p of PRODUCTS) {
    const slug = slugifyCategory(p.category);
    if (!seen.has(slug)) {
      seen.set(slug, { _id: slug, name: p.category, slug });
    }
  }
  return Array.from(seen.values());
}


export function fallbackServices(): ServiceDoc[] {
  return SERVICES.map((s) => ({
    _id: s.slug,
    name: s.name,
    slug: { current: s.slug },
    shortDescription: s.shortDescription,
    icon: s.icon,
    problems: s.problems,
    features: s.features,
    technologies: s.technologies,
    process: s.process,
    deliverables: s.deliverables,
  }));
}

export function fallbackServiceBySlug(slug: string): ServiceDoc | null {
  return fallbackServices().find((s) => s.slug.current === slug) ?? null;
}

export function fallbackSolutions(): SolutionDoc[] {
  return SOLUTIONS.map((s) => ({
    _id: s.slug,
    name: s.name,
    slug: { current: s.slug },
    shortDescription: s.shortDescription,
    outcomes: s.outcomes,
    relatedServices: fallbackServices().filter((svc) => s.relatedServices.includes(svc.slug.current)),
  }));
}

export function fallbackSolutionBySlug(slug: string): SolutionDoc | null {
  return fallbackSolutions().find((s) => s.slug.current === slug) ?? null;
}

export function fallbackProducts(): ProductDoc[] {
  return PRODUCTS.map((p) => ({
    _id: p.slug,
    name: p.name,
    slug: { current: p.slug },
    category: { name: p.category, slug: slugifyCategory(p.category) },
    tagline: p.tagline,
    status: p.status,
    description: p.description,
    problem: p.problem,
    idea: p.idea,
    howItWorks: p.howItWorks,
    features: p.features,
    technologies: p.technologies,
    useCases: p.useCases,
    roadmap: p.roadmap,
    images: p.images,
    size: p.size,
  }));
}

export function fallbackProductBySlug(slug: string): ProductDoc | null {
  return fallbackProducts().find((p) => p.slug.current === slug) ?? null;
}

export function fallbackProductsByCategory(categorySlug: string): ProductDoc[] {
  return fallbackProducts().filter((p) => p.category?.slug === categorySlug);
}

// Homepage-only cap, mirroring the Sanity-side "featured" queries — since
// constants.ts arrays are already small, this is mostly about keeping the
// code path consistent (same shape/limit) regardless of data source, not
// a behavior change today.
export function fallbackFeaturedProducts(limit = 6): ProductDoc[] {
  return fallbackProducts().slice(0, limit);
}

// No fallback content for Work/case studies, on purpose: CASE_STUDIES has
// always been an intentionally empty array (see constants.ts's own
// comment), since a "case study" implies a real, verifiable client
// outcome — unlike Products/Services/Labs, which have always shown
// legitimate concept-stage placeholder content that never claimed to be
// something it wasn't. Faking a client engagement, even as a "fallback,"
// would cross the line this project has held since Phase 2. This function
// exists only so /work's page code can call the same pattern as every
// other list page for consistency, while still resolving to [].
export function fallbackCaseStudies(): CaseStudyDoc[] {
  return CASE_STUDIES.map((c) => ({
    _id: c.slug,
    title: c.title,
    slug: { current: c.slug },
    client: c.client,
    industry: c.industry,
    status: c.status,
    summary: c.summary,
    challenge: c.challenge,
    approach: c.approach,
    solution: c.solution,
    architecture: c.architecture,
    result: c.result,
    technologies: c.technologies,
    images: c.images,
    size: c.size,
    clientApproved: true,
  }));
}

export function fallbackCaseStudyBySlug(slug: string): CaseStudyDoc | null {
  return fallbackCaseStudies().find((c) => c.slug.current === slug) ?? null;
}

export function fallbackFeaturedCaseStudies(limit = 6): CaseStudyDoc[] {
  return fallbackCaseStudies().slice(0, limit);
}

export function fallbackExperiments(): ExperimentDoc[] {
  return EXPERIMENTS.map((e) => ({
    _id: e.slug,
    title: e.title,
    slug: { current: e.slug },
    category: e.category,
    status: e.status,
    summary: e.summary,
    description: e.description,
    technologies: e.technologies,
    images: e.images,
    size: e.size,
  }));
}

export function fallbackExperimentBySlug(slug: string): ExperimentDoc | null {
  return fallbackExperiments().find((e) => e.slug.current === slug) ?? null;
}

export function fallbackFeaturedExperiments(limit = 6): ExperimentDoc[] {
  return fallbackExperiments().slice(0, limit);
}

export function fallbackJobs(): JobDoc[] {
  return JOBS.map((j) => ({
    _id: j.slug,
    title: j.title,
    slug: { current: j.slug },
    location: j.location,
    type: j.type,
    experience: j.experience,
    tags: j.tags,
    about: j.about,
    responsibilities: j.responsibilities,
    requirements: j.requirements,
    niceToHave: j.niceToHave,
    benefits: j.benefits,
    status: "open" as const,
  }));
}

export function fallbackJobBySlug(slug: string): JobDoc | null {
  return fallbackJobs().find((j) => j.slug.current === slug) ?? null;
}

export function fallbackTeamMembers(): TeamMemberDoc[] {
  return TEAM_MEMBERS.map((m) => ({
    _id: m.slug,
    name: m.name,
    role: m.role,
    quote: m.quote,
  }));
}
