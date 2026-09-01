import { defineField, defineType } from "sanity";

// { title, description } — used by Product.features and Product.roadmap-adjacent lists.
export const featureItem = defineType({
  name: "featureItem",
  title: "Feature",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

// { title, description } — used by Service.process ("Discover", "Design"...).
export const processStep = defineType({
  name: "processStep",
  title: "Process step",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

// { step, description } — used by Product.howItWorks ("Input" → "AI Engine" → ...).
export const howItWorksStep = defineType({
  name: "howItWorksStep",
  title: "How it works — step",
  type: "object",
  fields: [
    defineField({ name: "step", title: "Step name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "step", subtitle: "description" } },
});

// { title, description, checkpoint } — used by SiteSettings.howWeWork.
export const workStep = defineType({
  name: "workStep",
  title: "Work step",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({
      name: "checkpoint",
      title: "Client checkpoint",
      type: "string",
      description: "How the client is involved at this step, e.g. \"Sprint demos\".",
    }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

// { group, items[] } — used by Product.technologies and SiteSettings.techStackGroups.
export const techGroup = defineType({
  name: "techGroup",
  title: "Technology group",
  type: "object",
  fields: [
    defineField({ name: "group", title: "Group name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "items",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "group", items: "items" },
    prepare({ title, items }) {
      return { title, subtitle: Array.isArray(items) ? items.join(", ") : "" };
    },
  },
});
