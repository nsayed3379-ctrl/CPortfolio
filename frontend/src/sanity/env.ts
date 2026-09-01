// Centralizes reading the backend API's URL so every file in this folder
// (and the three /api/* route handlers) reads from exactly one place.
//
// This used to hold Sanity project/dataset config. The project's backend
// is now the standalone Node.js + PostgreSQL service in ../backend (or
// wherever you deployed it) — see INTEGRATION_GUIDE.md at the repo root
// for the full story. Everything below just points at that service.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

// True as long as an API URL is configured — always true in practice since
// API_URL falls back to localhost, but kept for parity with the old
// `hasSanityConfig` flag and so fetch.ts's "not configured yet" skip path
// still exists if someone explicitly sets NEXT_PUBLIC_API_URL="".
export const hasApiConfig = Boolean(process.env.NEXT_PUBLIC_API_URL !== "" as string);

// Deprecated — kept only so `sanity.config.ts` (the old Studio config,
// unused now that content is managed at ${API_URL}/admin) still compiles
// if you haven't deleted it yet. Safe to delete both once you remove the
// /studio route and the `sanity`/`next-sanity`/`@sanity/*` packages.
export const apiVersion = "2025-01-01";
export const dataset = "";
export const projectId = "";
