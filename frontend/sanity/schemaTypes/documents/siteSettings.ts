import { defineField, defineType } from "sanity";

// Singleton: only one document of this type should ever exist. Enforced via
// the Structure Builder in sanity.config.ts (single fixed document ID, no
// "create new" option) rather than at the schema level.
export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "homepage", title: "Homepage Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "companyName", type: "string", group: "general", initialValue: "VecoSoft" }),
    defineField({
      name: "tagline",
      type: "string",
      group: "general",
      description: "Used in the footer and as the Hero/CTA/Footer text-scramble bookend.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "email", type: "string", group: "general", validation: (Rule) => Rule.required() }),
    defineField({ name: "location", type: "string", group: "general", validation: (Rule) => Rule.required() }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      group: "general",
      fields: [
        defineField({ name: "linkedin", type: "url" }),
        defineField({ name: "github", type: "url" }),
        defineField({ name: "facebook", type: "url" }),
        defineField({ name: "x", title: "X (Twitter)", type: "url" }),
      ],
    }),

    defineField({
      name: "capabilities",
      title: "Capability signal strip",
      type: "array",
      group: "homepage",
      of: [{ type: "string" }],
      description: "The scrolling marquee under the hero, e.g. Software, AI, Digital Products, Automation, Cloud, Data.",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "commitments",
      title: "Trust commitments",
      type: "array",
      group: "homepage",
      of: [{ type: "featureItem" }],
      description: "NDA / response time / ownership / support strip.",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "whyVicosoft",
      title: "Why VecoSoft",
      type: "array",
      group: "homepage",
      of: [{ type: "featureItem" }],
      description: "Powers the homepage's \"Why VecoSoft\" section. Leave empty to use default text.",
    }),
    defineField({
      name: "techStackGroups",
      title: "Technology stack (grouped)",
      type: "array",
      group: "homepage",
      of: [{ type: "techGroup" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "howWeWork",
      title: "How we work",
      type: "array",
      group: "homepage",
      of: [{ type: "workStep" }],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "seo",
      title: "Default SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text", rows: 2 }),
        defineField({ name: "ogImage", title: "Default OG image", type: "image" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
