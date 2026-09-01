import { defineField, defineType } from "sanity";

export default defineType({
  name: "solution",
  title: "Solution",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "outcomes",
      title: "What you get",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "relatedServices",
      title: "Related services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      description: "Shown on the solution detail page's \"Services Involved\" section.",
    }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "shortDescription" },
  },
});
