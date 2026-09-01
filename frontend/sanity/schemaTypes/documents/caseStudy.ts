import { defineField, defineType } from "sanity";
import { STATUS_OPTIONS, GRID_SIZE_OPTIONS } from "../shared/options";

export default defineType({
  name: "caseStudy",
  title: "Case Study (Work)",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Images" },
    { name: "meta", title: "Display" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "client", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "industry", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({
      name: "status",
      type: "string",
      group: "content",
      options: { list: STATUS_OPTIONS, layout: "radio" },
      initialValue: "live",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 2,
      group: "content",
      description: "Shown on the /work grid card.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "challenge",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "approach",
      title: "Our approach",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "solution",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "architecture",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "result",
      type: "text",
      rows: 3,
      group: "content",
      description: "Only publish results that are real and verifiable — no invented metrics.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "technologies",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "images",
      type: "projectImages",
      group: "media",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "size",
      title: "Grid tile size",
      type: "string",
      group: "meta",
      options: { list: GRID_SIZE_OPTIONS, layout: "radio" },
      initialValue: "standard",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "featured", type: "boolean", group: "meta", initialValue: false }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "date",
      group: "meta",
    }),
    defineField({
      name: "clientApproved",
      title: "Client approved for publishing",
      type: "boolean",
      group: "meta",
      initialValue: false,
      description:
        "A distinct gate from Sanity's own Publish button (which controls draft vs. live content) — this specifically confirms the client has signed off on their case study being shown publicly. Keep OFF until that approval exists, even if the document itself is otherwise ready and published in Sanity's sense.",
    }),
  ],
  orderings: [
    { title: "Published date, newest", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "client", clientApproved: "clientApproved", media: "images.thumbnail.image" },
    prepare({ title, subtitle, clientApproved, media }) {
      return { title: clientApproved ? title : `${title} (awaiting client approval)`, subtitle, media };
    },
  },
});
