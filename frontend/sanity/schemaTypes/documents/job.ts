import { defineField, defineType } from "sanity";

export default defineType({
  name: "job",
  title: "Job",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "location", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "type",
      title: "Employment type",
      type: "string",
      options: { list: ["Full-time", "Part-time", "Contract", "Internship"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "experience", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Short skill tags shown on the job card (e.g. React, Next.js, TypeScript).",
    }),
    defineField({ name: "about", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({
      name: "responsibilities",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "requirements",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "niceToHave",
      title: "Nice to have",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "benefits",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "status",
      type: "string",
      options: { list: [{ title: "Open", value: "open" }, { title: "Closed", value: "closed" }], layout: "radio" },
      initialValue: "open",
      description: "Closed roles are hidden from /careers but kept for record-keeping.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deadline",
      title: "Application deadline",
      type: "date",
      description: "Optional — shown on the job detail page if set.",
    }),
  ],
  orderings: [
    { title: "Newest first", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "location", status: "status" },
    prepare({ title, subtitle, status }) {
      return { title: status === "closed" ? `${title} (closed)` : title, subtitle };
    },
  },
});
