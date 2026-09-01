// Shared option lists used across multiple schemas. Keep these in sync with
// the `Status` and grid-size union types in `src/lib/constants.ts` — this is
// the Sanity-side mirror of that TypeScript type until Phase 2 replaces the
// frontend's hand-written types with Sanity-generated ones (see SETUP.md).

export const STATUS_OPTIONS = [
  { title: "Live", value: "live" },
  { title: "In Development", value: "in-development" },
  { title: "Prototype", value: "prototype" },
  { title: "Concept", value: "concept" },
  { title: "Research", value: "research" },
];

export const GRID_SIZE_OPTIONS = [
  { title: "Standard (1×1)", value: "standard" },
  { title: "Wide (2×1)", value: "wide" },
  { title: "Tall (1×2)", value: "tall" },
  { title: "Large (2×2)", value: "large" },
];

export const MEDIA_TONE_OPTIONS = [
  { title: "Electric (primary blue)", value: "electric" },
  { title: "Cyan (secondary)", value: "cyan" },
  { title: "Graphite (neutral)", value: "graphite" },
  { title: "Violet (rare emphasis only)", value: "violet" },
  { title: "Amber (rare emphasis only)", value: "amber" },
];

export const MEDIA_VARIANT_OPTIONS = [
  { title: "UI mockup", value: "ui" },
  { title: "Diagram", value: "diagram" },
  { title: "Abstract orbs", value: "orbs" },
];

// ── Phase 3.3: private operational-data workflows ──────────────────────
// These are intentionally separate from STATUS_OPTIONS above (which
// describes a public product/case-study's maturity). These describe an
// internal admin's workflow state for something a visitor submitted —
// a different concept entirely, so a different list, even though both
// happen to be called "status".

// Contact messages and project inquiries share the same simple workflow.
export const LEAD_STATUS_OPTIONS = [
  { title: "New", value: "new" },
  { title: "In Progress", value: "in-progress" },
  { title: "Replied", value: "replied" },
  { title: "Closed", value: "closed" },
  { title: "Archived", value: "archived" },
];

export const PRIORITY_OPTIONS = [
  { title: "Low", value: "low" },
  { title: "Medium", value: "medium" },
  { title: "High", value: "high" },
];

// Job applications need a richer pipeline than a generic lead.
export const APPLICATION_STATUS_OPTIONS = [
  { title: "New", value: "new" },
  { title: "Reviewing", value: "reviewing" },
  { title: "Shortlisted", value: "shortlisted" },
  { title: "Interview", value: "interview" },
  { title: "Rejected", value: "rejected" },
  { title: "Hired", value: "hired" },
  { title: "Archived", value: "archived" },
];
