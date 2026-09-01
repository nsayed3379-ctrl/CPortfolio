import { defineField, defineType } from "sanity";
import { LEAD_STATUS_OPTIONS, PRIORITY_OPTIONS } from "../shared/options";

// PRIVATE document type — see contactMessage.ts for the shared design
// notes (never queried publicly, written via the future /api/inquiry
// route in Phase 3.4).
export default defineType({
  name: "projectInquiry",
  title: "Project Inquiry",
  type: "document",
  fields: [
    // ── Submitted by the visitor — read-only in Studio. ────────────────
    defineField({
      name: "projectType",
      type: "string",
      readOnly: true,
      options: { list: ["Web", "Mobile", "AI/ML", "Software", "UI/UX", "Other"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "budget", type: "string", readOnly: true, validation: (Rule) => Rule.required() }),
    defineField({ name: "timeline", type: "string", readOnly: true, validation: (Rule) => Rule.required() }),
    defineField({
      name: "description",
      title: "Project description",
      type: "text",
      rows: 5,
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "name", type: "string", readOnly: true, validation: (Rule) => Rule.required() }),
    defineField({ name: "email", type: "string", readOnly: true, validation: (Rule) => Rule.required().email() }),
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
      name: "internalNotes",
      title: "Internal notes",
      type: "text",
      rows: 3,
      description: "Private notes for the team — never shown to the sender.",
    }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "projectType", budget: "budget", status: "status" },
    prepare({ title, subtitle, budget, status }) {
      return { title: `${title}  ·  ${status}`, subtitle: `${subtitle} — ${budget}` };
    },
  },
});
