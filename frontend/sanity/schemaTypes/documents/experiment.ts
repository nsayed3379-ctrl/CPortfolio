import { defineField, defineType } from "sanity";
import { STATUS_OPTIONS, GRID_SIZE_OPTIONS } from "../shared/options";

export default defineType({
  name: "experiment",
  title: "Experiment (Labs)",
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
    defineField({ name: "category", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({
      name: "status",
      type: "string",
      group: "content",
      options: { list: STATUS_OPTIONS, layout: "radio" },
      initialValue: "research",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 2,
      group: "content",
      description: "Shown on the /labs grid card.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
      group: "content",
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
    defineField({ name: "order", title: "Display order", type: "number", group: "meta" }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "meta",
      initialValue: false,
      description: "Featured experiments can be pulled into the homepage's Labs preview first.",
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "images.thumbnail.image" },
  },
});
