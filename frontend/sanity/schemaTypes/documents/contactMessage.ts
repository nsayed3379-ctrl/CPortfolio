import { defineField, defineType } from "sanity";
import { LEAD_STATUS_OPTIONS, PRIORITY_OPTIONS } from "../shared/options";

// PRIVATE document type. Deliberately never referenced by any query in
// src/sanity/queries.ts — the public site has no read access path to
// these at all (see SETUP.md's "Why One Private Dataset Is Enough" note:
// the whole dataset already requires a token, so this needs no extra
// access-control config beyond what Phase 3.1 already set up). Documents
// here are created by the future /api/contact route (Phase 3.4) using the
// server-only SANITY_API_TOKEN — visitors never talk to Sanity directly.
export default defineType({
  name: "contactMessage",
  title: "Contact Message",
  type: "document",
  fields: [
    // ── Submitted by the visitor — read-only in Studio so an admin can't
    // accidentally alter what someone actually wrote. ──────────────────
    defineField({ name: "name", type: "string", readOnly: true, validation: (Rule) => Rule.required() }),
    defineField({ name: "email", type: "string", readOnly: true, validation: (Rule) => Rule.required().email() }),
    defineField({ name: "company", type: "string", readOnly: true }),
    defineField({ name: "subject", type: "string", readOnly: true, validation: (Rule) => Rule.required() }),
    defineField({ name: "message", type: "text", rows: 5, readOnly: true, validation: (Rule) => Rule.required() }),
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
      options: { list: LEAD_STATUS_OPTIONS, layout: "radio" },
      initialValue: "new",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priority",
      type: "string",
      options: { list: PRIORITY_OPTIONS, layout: "radio" },
      initialValue: "medium",
    }),
    defineField({ name: "assignedTo", title: "Assigned to", type: "string" }),
    defineField({
      name: "internalNote",
      title: "Internal note",
      type: "text",
      rows: 3,
      description: "Private notes for the team — never shown to the sender.",
    }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "subject", subtitle: "name", status: "status" },
    prepare({ title, subtitle, status }) {
      return { title: `${title}  ·  ${status}`, subtitle };
    },
  },
});
