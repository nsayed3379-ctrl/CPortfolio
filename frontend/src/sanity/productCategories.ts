import { cache } from "react";
import { sanityFetchList } from "./fetch";
import { PRODUCT_CATEGORY_LIST_QUERY } from "./queries";
import { fallbackProductCategories } from "./fallbacks";
import type { ProductCategoryDoc } from "./types";

// Memoized per request (see src/sanity/siteSettings.ts for why) — Navbar
// renders on every page and needs this list, so without cache() it would
// otherwise be fetched once per page load unnecessarily.
export const getProductCategories = cache(async (): Promise<ProductCategoryDoc[]> => {
  const fetched = await sanityFetchList<ProductCategoryDoc>(PRODUCT_CATEGORY_LIST_QUERY, {}, { tags: ["productCategory"] });
  return fetched.length > 0 ? fetched : fallbackProductCategories();
});
