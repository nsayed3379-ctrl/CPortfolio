// A deliberately simple, dependency-free rate limiter for the form
// submission routes (/api/contact, /api/inquiry, /api/applications).
//
// Known limitation, stated plainly: this state lives in the Node
// process's memory. It works correctly for a single, long-running server
// process (e.g. a traditional Node server, or a single Vercel instance
// that stays warm) but does NOT share state across multiple serverless
// function instances — under real concurrent load on a platform that
// spins up several instances, each instance has its own independent
// counter, so the effective limit is "N × number of active instances,"
// not a true global N. For this project's current stage (low traffic,
// not yet handling production load), that's an acceptable stopgap rather
// than a reason to block Phase 3.4 on setting up a new external service.
//
// Documented upgrade path: swap this for Upstash Redis (a serverless
// Redis with a generous free tier, previously discussed) when real
// traffic or a genuine abuse attempt makes the distributed-state gap
// matter — the call sites in each route wouldn't need to change, only
// this file's internals.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodically forget old buckets so this Map doesn't grow forever on a
// long-running process. Cheap and approximate is fine here.
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();
function cleanupIfDue() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

/**
 * Returns true if the request should be ALLOWED, false if it should be
 * rejected as rate-limited.
 *
 * @param identifier Usually the requester's IP address.
 * @param limit Max requests allowed within the window.
 * @param windowMs Window length in milliseconds.
 */
export function checkRateLimit(identifier: string, limit: number, windowMs: number): boolean {
  cleanupIfDue();

  const now = Date.now();
  const existing = buckets.get(identifier);

  if (!existing || existing.resetAt < now) {
    buckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  return true;
}

/**
 * Best-effort extraction of the requester's IP from a Next.js Request,
 * for use as the rate-limit key. Falls back to a constant string if no
 * forwarding header is present (e.g. local dev) — this means local
 * requests all share one bucket, which is fine since it's dev-only.
 */
export function getRequestIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
