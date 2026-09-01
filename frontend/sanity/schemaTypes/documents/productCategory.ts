import { defineField, defineType } from "sanity";

// A small, curated set of categories (AI Platform, HR Platform, etc.) that
// Products reference. This is what makes the Products nav dropdown scale —
// it lists categories (typically a handful), never individual products
// (which could grow to dozens or hundreds). See product.ts's `category`
// field, which references this type instead of storing free text.
export default defineType({
  name: "productCategory",
  title: "Product Category",
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
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first in the Products nav dropdown.",
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name" },
  },
});
