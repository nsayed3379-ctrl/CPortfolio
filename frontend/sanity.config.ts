"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";

export default defineConfig({
  name: "vecobyte",
  title: "Vecobyte Admin",

  projectId,
  dataset,
  basePath: "/studio",

  plugins: [
    structureTool({ structure }),
    // GROQ playground — lets you write/test queries directly in the
    // Studio. Handy in Phase 2 while wiring up page queries; safe to
    // remove later if desired.
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: schemaTypes,
  },
});
