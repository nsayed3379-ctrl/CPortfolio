// Used by every homepage section that shows a curated subset of a larger
// collection (Products, Work, Labs). Three-way logic, deliberately in
// this order:
//
// 1. No real Sanity items at all → use the constants.ts fallback (capped).
//    This is the only case where dummy/placeholder content should appear.
// 2. Real items exist AND at least one is marked `featured` → show those.
// 3. Real items exist but NONE are marked `featured` yet → show the first
//    `limit` real items anyway, rather than falling back to dummy data.
//    Showing fake "VecoAI"-style placeholders while a real, unfeatured
//    product exists would recreate the exact "footer links to services
//    that don't match /services" inconsistency bug fixed earlier — once
//    real content exists, the homepage should reflect it, "featured" or
//    not, until someone deliberately curates it.
export function selectFeatured<T extends { featured?: boolean }>(
  realItems: T[],
  fallbackItems: T[],
  limit = 6
): T[] {
  if (realItems.length === 0) return fallbackItems.slice(0, limit);
  const featured = realItems.filter((item) => item.featured);
  return (featured.length > 0 ? featured : realItems).slice(0, limit);
}
