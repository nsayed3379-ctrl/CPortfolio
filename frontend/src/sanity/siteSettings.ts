import { cache } from "react";
import { sanityFetch } from "./fetch";
import { SITE_SETTINGS_QUERY } from "./queries";
import type { SiteSettingsDoc } from "./types";

// React's cache() memoizes this per server request, not globally — so
// calling getSiteSettings() from both the root layout (for <Footer>) and
// the homepage (for CapabilitySignal/CommitmentStrip/WhyVicosoft/
// TechnologySection/HowWeWork) triggers exactly one actual fetch per
// request, not five, even though Sanity's client doesn't go through
// Next's own fetch-deduplication the way native `fetch()` calls do.
export const getSiteSettings = cache(async (): Promise<SiteSettingsDoc | null> => {
  return sanityFetch<SiteSettingsDoc>(SITE_SETTINGS_QUERY, {}, { tags: ["siteSettings"] });
});
