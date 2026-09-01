import { defineField, defineType } from "sanity";
import { MEDIA_TONE_OPTIONS, MEDIA_VARIANT_OPTIONS } from "../shared/options";

// Mirrors the `MediaRef` type in src/lib/constants.ts, plus an optional real
// `image` field. The frontend's <MediaFrame> component should prefer
// `image` when present, and fall back to the generative tone/variant
// placeholder when it isn't — this lets editors publish products/work
// entries today, before real screenshots exist, without anything looking
// broken, and swap in real photography later without a schema change.
export default defineType({
  name: "mediaRef",
  title: "Media",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Description (alt text)",
      type: "string",
      description: "Accessible description of the image — used as alt text, and as the placeholder's label until a real image is uploaded.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "Optional for now — leave empty to use the generated placeholder below until real photography is ready.",
    }),
    defineField({
      name: "tone",
      title: "Placeholder tone",
      type: "string",
      options: { list: MEDIA_TONE_OPTIONS, layout: "radio" },
      initialValue: "electric",
      description: "Used only when no image is uploaded above.",
    }),
    defineField({
      name: "variant",
      title: "Placeholder style",
      type: "string",
      options: { list: MEDIA_VARIANT_OPTIONS, layout: "radio" },
      initialValue: "orbs",
      description: "Used only when no image is uploaded above.",
    }),
  ],
  preview: {
    select: { title: "label", media: "image" },
  },
});
