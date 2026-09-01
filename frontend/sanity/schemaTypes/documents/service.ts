import { defineField, defineType } from "sanity";

const ICON_OPTIONS = [
  { title: "Code2 (Web Development)", value: "Code2" },
  { title: "BrainCircuit (AI & ML)", value: "BrainCircuit" },
  { title: "Smartphone (Mobile)", value: "Smartphone" },
  { title: "PenTool (UI/UX)", value: "PenTool" },
  { title: "Cloud (Cloud & DevOps)", value: "Cloud" },
  { title: "Settings2 (Custom Software)", value: "Settings2" },
];

export default defineType({
  name: "service",
  title: "Service",
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
      description: "Shown on the /services grid and homepage preview.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      type: "string",
      options: { list: ICON_OPTIONS },
      description: "Must match a name already supported in the frontend's icon map (src/components/home/WhatWeDo.tsx and services pages). Adding a new icon requires a small code change.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "problems",
      title: "Problems we solve",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "features",
      title: "What you get",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "technologies",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "process",
      title: "Our process",
      type: "array",
      of: [{ type: "processStep" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "deliverables",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first on the /services grid.",
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "shortDescription" },
  },
});
