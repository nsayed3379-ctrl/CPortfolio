import type { MetadataRoute } from "next";
import { SITE, FEATURES } from "@/lib/constants";
import { sanityFetchList } from "@/sanity/fetch";
import { SERVICE_LIST_QUERY, JOB_LIST_QUERY } from "@/sanity/queries";
import { fallbackServices, fallbackJobs } from "@/sanity/fallbacks";
import type { ServiceDoc, JobDoc } from "@/sanity/types";

// Lives at the app root (a sibling of the `(site)` route group, `api/`, and
// `studio/`) — that's the required location for the file-convention sitemap
// to be served at /sitemap.xml; route groups don't nest into the URL, but
// they also don't host special files like this one.
//
// Only ever lists real, currently-public URLs:
// - static marketing pages that always exist
// - /services/[slug] and /careers/[slug], fetched live (same backend call
//   the pages themselves make), falling back to constants.ts only if the
//   backend is unreachable — matching every other page's resilience pattern
// - /solutions, /products, /work list pages, but ONLY while their FEATURES
//   flag is on — those routes 404 via notFound() while the flag is off, so
//   listing them would just hand Google a page that doesn't exist
//
// Deliberately excluded: /api/* (not pages), /studio/* (Sanity Studio
// leftover — an internal tool, not public content, see robots.ts), and the
// */[slug] detail pages for solutions/products/work — once one of those
// FEATURES flags flips on, extend this file the same way services/careers
// are handled below (fetch the list, map slug + updatedAt).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE.url;

  const [fetchedServices, fetchedJobs] = await Promise.all([
    sanityFetchList<ServiceDoc>(SERVICE_LIST_QUERY, {}, { tags: ["service"] }),
    sanityFetchList<JobDoc>(JOB_LIST_QUERY, {}, { tags: ["job"] }),
  ]);
  const services = fetchedServices.length > 0 ? fetchedServices : fallbackServices();
  const jobs = fetchedJobs.length > 0 ? fetchedJobs : fallbackJobs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/services`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/careers`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/get-a-quote`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // These 404 today (see src/lib/constants.ts's FEATURES comment) — only
  // list them once real content exists and the flag is flipped on.
  if (FEATURES.solutions) {
    staticPages.push({ url: `${baseUrl}/solutions`, changeFrequency: "weekly", priority: 0.7 });
  }
  if (FEATURES.products) {
    staticPages.push({ url: `${baseUrl}/products`, changeFrequency: "weekly", priority: 0.7 });
  }
  if (FEATURES.work) {
    staticPages.push({ url: `${baseUrl}/work`, changeFrequency: "weekly", priority: 0.7 });
  }

  // lastModified is only set when the backend actually reports an
  // updated_at — omitted rather than filled with today's date, so nothing
  // here is an invented modification time (constants.ts fallback data has
  // no real date at all, and correctly gets none).
  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${baseUrl}/services/${s.slug.current}`,
    ...(s.updatedAt ? { lastModified: new Date(s.updatedAt) } : {}),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const careerPages: MetadataRoute.Sitemap = jobs.map((j) => ({
    url: `${baseUrl}/careers/${j.slug.current}`,
    ...(j.updatedAt ? { lastModified: new Date(j.updatedAt) } : {}),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticPages, ...servicePages, ...careerPages];
}
