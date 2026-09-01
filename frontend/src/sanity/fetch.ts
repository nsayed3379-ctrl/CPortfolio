import { API_URL, hasApiConfig } from "./env";
import type { QueryDef } from "./queries";

// Same two functions, same names, same call signature every page already
// uses — `sanityFetch<T>(QUERY, params, options)`. Only the inside changed:
// QUERY is now a { path, transform } descriptor (see ./queries.ts) instead
// of a GROQ string, and this calls the Node/PostgreSQL backend's REST API
// instead of Sanity's /data/query endpoint. Same graceful-failure and ISR
// behavior as before:
//
// 1. ISR wiring: `next: { revalidate, tags }` lets Next.js cache each
//    request and only refetch after `revalidate` seconds (or immediately
//    once a webhook/admin action calls `revalidateTag(tag)`, if you wire
//    one up against the backend later).
// 2. Graceful failure: if the backend is unreachable, a thrown fetch error
//    falls back to `null` (or `[]` via sanityFetchList) instead of taking
//    down the page — every page already renders that as an honest
//    "nothing here yet" state.
export async function sanityFetch<T>(
  query: QueryDef<T>,
  params: Record<string, string | number | undefined> = {},
  options: { revalidate?: number | false; tags?: string[] } = {}
): Promise<T | null> {
  if (!hasApiConfig) return null;

  try {
    const res = await fetch(`${API_URL}/api${query.path(params)}`, {
      next: { revalidate: options.revalidate ?? 30, tags: options.tags },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Backend API responded ${res.status}`);
    const json = await res.json();
    return query.transform(json);
  } catch (error) {
    console.error(`[sanityFetch] request failed:`, error);
    return null;
  }
}

// Convenience wrapper for list queries — same graceful-failure behavior,
// but always returns an array (never null) so callers can map over it
// directly without a null check at every call site.
export async function sanityFetchList<T>(
  query: QueryDef<T[]>,
  params: Record<string, string | number | undefined> = {},
  options: { revalidate?: number | false; tags?: string[] } = {}
): Promise<T[]> {
  const result = await sanityFetch<T[]>(query, params, options);
  return result ?? [];
}
