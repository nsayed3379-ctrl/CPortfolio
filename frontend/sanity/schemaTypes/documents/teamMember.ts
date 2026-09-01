import { defineField, defineType } from "sanity";

// Not fixed to "exactly 3 people" or specific role labels (Owner/CEO/
// Chairman) — `role` is free text so this scales to however many team
// members the site ends up showing, in whatever roles actually exist.
export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      description: "e.g. \"Founder & CEO\", \"Chairman\", \"Owner\" — shown exactly as written, no fixed list.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Quote / Bio",
      type: "text",
      rows: 4,
      description: "A short personal statement or bio — shown alongside their photo.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
      description: "Optional — shown as a small link icon if set.",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
