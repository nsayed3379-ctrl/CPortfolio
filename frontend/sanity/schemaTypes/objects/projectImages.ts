import { defineField, defineType } from "sanity";

// Mirrors `ProjectImages` in src/lib/constants.ts. Used by Product, Case
// Study, and Experiment — every "showcase" content type needs the same
// thumbnail/hero/gallery shape for consistent grid + detail-page rendering.
export default defineType({
  name: "projectImages",
  title: "Images",
  type: "object",
  fields: [
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "mediaRef",
      description: "Shown in grid tiles (ShowcaseGrid, ProductStack).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "mediaRef",
      description: "Shown full-bleed at the top of the detail page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "mediaRef" }],
      description: "Additional screenshots shown in the detail page's masonry gallery.",
    }),
  ],
});
