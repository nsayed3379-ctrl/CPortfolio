import { API_URL } from "./env";

/**
 * Turns a media URL stored by the backend (e.g. "/uploads/xyz.jpg") into an
 * absolute URL the browser/Next <Image> can load. Already-absolute URLs
 * (http://, https://) are returned unchanged, so this is safe to call on
 * anything.
 *
 * Replaces the old Sanity `urlFor(image).width(w).auto("format").url()`
 * builder — the backend serves static files as-is rather than through an
 * image CDN, so there's no transform pipeline to chain here.
 */
export function mediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
