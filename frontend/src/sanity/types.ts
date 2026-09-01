// Hand-written types mirroring sanity/schemaTypes/ exactly. Once the
// project has real Sanity credentials configured, these can be replaced
// with `npx sanity typegen generate` output (auto-generated from the same
// schemas) — kept hand-written for now since typegen requires a live
// connection to introspect the dataset, which isn't available in every
// environment. The shapes below match the schema field-for-field, so
// swapping to generated types later should be a no-op for consumers.

export type SanitySlug = { current: string };

export type Status = "live" | "in-development" | "prototype" | "concept" | "research";

export type MediaRefDoc = {
  label: string;
  imageUrl?: string;
  tone: "electric" | "cyan" | "graphite" | "violet" | "amber";
  variant?: "ui" | "diagram" | "orbs";
};

export type ProjectImagesDoc = {
  thumbnail: MediaRefDoc;
  heroImage: MediaRefDoc;
  gallery?: MediaRefDoc[];
};

export type FeatureItemDoc = { title: string; description: string };
export type ProcessStepDoc = { title: string; description: string };
export type HowItWorksStepDoc = { step: string; description: string };
export type TechGroupDoc = { group: string; items: string[] };
export type WorkStepDoc = { title: string; description: string; checkpoint?: string };

export type GridSize = "standard" | "wide" | "tall" | "large";

export type ServiceDoc = {
  _id: string;
  name: string;
  slug: SanitySlug;
  shortDescription: string;
  icon: string;
  problems: string[];
  features: string[];
  technologies: string[];
  process: ProcessStepDoc[];
  deliverables: string[];
  order?: number;
};

export type SolutionDoc = {
  _id: string;
  name: string;
  slug: SanitySlug;
  shortDescription: string;
  outcomes: string[];
  relatedServices?: ServiceDoc[]; // dereferenced in the GROQ query
  order?: number;
};

export type ProductCategoryDoc = {
  _id: string;
  name: string;
  slug: string; // note: already unwrapped to a plain string by the GROQ query
};

export type ProductDoc = {
  _id: string;
  name: string;
  slug: SanitySlug;
  category: { name: string; slug: string } | null; // dereferenced from productCategory — null if the reference is unset/broken
  tagline: string;
  status: Status;
  description: string;
  problem: string;
  idea: string;
  howItWorks: HowItWorksStepDoc[];
  features: FeatureItemDoc[];
  technologies: TechGroupDoc[];
  useCases: string[];
  roadmap?: string[];
  images: ProjectImagesDoc;
  size: GridSize;
  featured?: boolean;
  order?: number;
};

export type CaseStudyDoc = {
  _id: string;
  title: string;
  slug: SanitySlug;
  client: string;
  industry: string;
  status: Status;
  summary: string;
  challenge: string;
  approach: string[];
  solution: string;
  architecture: string;
  result: string;
  technologies: string[];
  images: ProjectImagesDoc;
  size: GridSize;
  featured?: boolean;
  publishedAt?: string;
  clientApproved: boolean;
};

export type ExperimentDoc = {
  _id: string;
  title: string;
  slug: SanitySlug;
  category: string;
  status: Status;
  summary: string;
  description: string;
  technologies: string[];
  images: ProjectImagesDoc;
  size: GridSize;
  order?: number;
  featured?: boolean;
};

export type JobDoc = {
  _id: string;
  title: string;
  slug: SanitySlug;
  location: string;
  type: string;
  experience: string;
  tags?: string[];
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  benefits?: string[];
  status: "open" | "closed";
  deadline?: string;
};

export type FaqDoc = {
  _id: string;
  question: string;
  answer: string;
  order?: number;
};

export type TeamMemberDoc = {
  _id: string;
  name: string;
  role: string;
  photoUrl?: string;
  quote: string;
  linkedin?: string;
};

export type SiteSettingsDoc = {
  companyName: string;
  tagline: string;
  email: string;
  location: string;
  socialLinks?: { linkedin?: string; github?: string; facebook?: string; x?: string };
  capabilities: string[];
  commitments: FeatureItemDoc[];
  whyVicosoft: FeatureItemDoc[];
  techStackGroups: TechGroupDoc[];
  howWeWork: WorkStepDoc[];
  seo?: { title?: string; description?: string; ogImageUrl?: string };
};
