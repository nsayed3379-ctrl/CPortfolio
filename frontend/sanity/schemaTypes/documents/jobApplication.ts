import { defineField, defineType } from "sanity";
import { APPLICATION_STATUS_OPTIONS } from "../shared/options";
import { CvFileInput } from "../../components/CvFileInput";

// PRIVATE document type — see contactMessage.ts for the shared design
// notes. Written via the future /api/applications route (Phase 3.4).
//
// CV storage: intentionally a base64 `text` field on the document itself,
// NOT a Sanity `file` asset. Sanity file/image assets are served from a
// predictable CDN URL pattern (cdn.sanity.io/files/...) — even with a
// private dataset, that's a meaningfully different exposure model than
// "requires the same API token as everything else," for a document as
// sensitive as someone's CV. Keeping it as a field on an already
// token-gated document avoids creating a second, separate access surface
// to reason about. The application form already caps CVs at 5MB, so
// base64 (~33% larger) stays well within Sanity's per-document limits.
export default defineType({
  name: "jobApplication",
  title: "Job Application",
  type: "document",
  fields: [
    // ── Submitted by the applicant — read-only in Studio. ──────────────
    defineField({
      name: "jobTitle",
      title: "Job title (snapshot)",
      type: "string",
      readOnly: true,
      description: "Captured at submission time, independent of the reference below — always populated, even if the job posting is later edited, closed, or was only fallback/placeholder content with no real Sanity document to reference.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "job",
      type: "reference",
      to: [{ type: "job" }],
      readOnly: true,
      description: "Optional — only set when the applicant applied to a real, published job document. Absent for applications against fallback/placeholder job listings (see jobTitle above, which is always reliable).",
    }),
    defineField({ name: "fullName", type: "string", readOnly: true, validation: (Rule) => Rule.required() }),
    defineField({ name: "email", type: "string", readOnly: true, validation: (Rule) => Rule.required().email() }),
    defineField({ name: "phone", type: "string", readOnly: true, validation: (Rule) => Rule.required() }),
    defineField({ name: "linkedin", type: "url", readOnly: true }),
    defineField({ name: "portfolio", title: "GitHub / Portfolio", type: "url", readOnly: true }),
    defineField({
      name: "coverLetter",
      type: "text",
      rows: 5,
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cvFileName",
      title: "CV file name",
      type: "string",
      readOnly: true,
      description: "The original file name, for reference — e.g. \"jane-doe-cv.pdf\".",
    }),
    defineField({
      name: "cvBase64",
      title: "CV (PDF)",
      type: "text",
      readOnly: true,
      description: "Stored as base64 text (see the file-level comment above for why) — rendered here as a one-click viewer/downloader instead of raw text, via a custom Studio input component.",
      components: { input: CvFileInput },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "consent",
      type: "boolean",
      readOnly: true,
      description: "Confirms the applicant agreed to our data handling terms at submission time.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedAt",
      type: "datetime",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),

    // ── Internal workflow — editable by admins. ────────────────────────
    defineField({
      name: "status",
      type: "string",
      options: { list: APPLICATION_STATUS_OPTIONS, layout: "radio" },
      initialValue: "new",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "adminNotes",
      title: "Admin notes",
      type: "text",
      rows: 3,
      description: "Private notes for the team — never shown to the applicant.",
    }),
    defineField({ name: "reviewedBy", type: "string" }),
    defineField({ name: "reviewedAt", type: "datetime" }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "fullName", subtitle: "jobTitle", status: "status" },
    prepare({ title, subtitle, status }) {
      return { title: `${title}  ·  ${status}`, subtitle };
    },
  },
});
