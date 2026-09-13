import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

// Lives at the app root for the same reason as sitemap.ts — served at
// /robots.txt regardless of the `(site)` route group. Everything public is
// allowed; /api/* (form-submission endpoints, not pages) and /studio/*
// (the leftover Sanity Studio tool — internal, not public content) are the
// only disallowed paths, so nothing a visitor should find is blocked.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/studio/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
