# Vecobyte — Website

The Vecobyte frontend, built around a **visual showcase ecosystem** —
Services / Solutions / Products / Work / Labs, tied together by a
signature `ShowcaseGrid` component — plus Sanity Studio as the future
CMS/admin panel.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The site runs fully without any Sanity setup —
see "Sanity Account Setup" below for the admin panel at `/studio`.

## Roadmap & Current Status

| Phase | What | Status |
|---|---|---|
| 1 | Foundation (Next.js, TypeScript, Tailwind, design tokens) | ✅ Done |
| 2 | Complete frontend (all pages, forms, showcase ecosystem, animations) | ✅ Done |
| 3 | **CMS integration (Sanity)** | 🟡 In progress — see "Where Phase 3 Stands" below |
| 4 | Backend wiring (Contact/Quote/Application → real storage, email) | ⬜ Not started |
| 5 | Premium motion (GSAP, 3D hero) | ⬜ Not started |
| 6 | Production (SEO, analytics, accessibility audit, deploy) | ⬜ Not started |
| 7 (future) | Live chat | ⬜ Not started |
| 8 (future) | AI assistant | ⬜ Not started |

### Where Phase 3 Stands

Phase 3 is being built in sub-steps so each one ships as a working,
verified increment instead of one giant change:

- **3.1 — Sanity Studio + public content schemas** ✅ Done.
- **3.2 — Migrate pages from `constants.ts` to live Sanity queries** ✅ Done
  this round (see below for full detail). `constants.ts` is no longer the
  live data source — every page now fetches from Sanity, falling back to
  `constants.ts`'s original content only when the corresponding Sanity
  collection is still empty (see "Fallback Strategy" below).
- **3.3 — Private data schemas** (`contactMessage`, `projectInquiry`,
  `jobApplication`) + dataset security ✅ Done this round (see below for
  full detail). These schemas exist and are manageable in Studio now, but
  nothing writes to them yet — see 3.4.
- **3.4 — Wire `/api/contact`, `/api/inquiry`, `/api/applications`** to
  write to the schemas from 3.3, replacing the `console.log()` stubs in
  the three forms. ✅ Done this round (see below for full detail). This
  is effectively Phase 4's work, done as part of the same CMS-adjacent
  effort.
- **3.5 — On-demand revalidation** (Sanity webhook → `revalidateTag()`) so
  publishing in the Studio reflects on the live site immediately, instead
  of waiting up to the 1-hour ISR window. ⬜ Not started.
- **3.6 — Sanity Presentation (visual editing)** — preview drafts directly
  on the live page layout instead of a plain form. ⬜ Not started.

## Site Structure

- **Services** (`/services`) — deep-dive service pages (problems, features,
  process, deliverables).
- **Solutions** (`/solutions`) — outcome-oriented bundles of services.
- **Products** (`/products`) — Vecobyte's own concept platforms. Each has a
  full scroll-storytelling detail page: Hero → Overview → The Problem → The
  Idea → How It Works → Features → Screens → Technology → Use Cases →
  Roadmap → CTA → Explore More.
- **Work** (`/work`) — real client case studies. Starts intentionally empty
  (`CASE_STUDIES = []` in constants) with an honest placeholder message —
  no fabricated results are shown. Add entries here as projects complete.
- **Labs** (`/labs`) — experimental / R&D work with its own status system.
- **Company** (`/about`, `/careers`, `/contact`) — unchanged since Phase 2.

Every Product / Work / Lab entry carries an honest **status** badge (Live,
In Development, Prototype, Concept, Research) — nothing is presented as
more finished than it is.

## The Signature Components

- **`ShowcaseGrid` + `ShowcaseTile`** (`src/components/showcase/`) — the
  bento-style grid powering Products/Work/Labs and the homepage's
  filterable `ExploreShowcase`. Hover dims sibling tiles via shared
  context; tile sizing (`standard`/`wide`/`tall`/`large`) comes from each
  item's `size` field.
- **`ProductStack`** (`src/components/products/ProductStack.tsx`) — a
  sticky-stacking card deck powering the homepage's "Vecobyte Products"
  section. Pure CSS `position: sticky` + a lightweight
  `IntersectionObserver` for the scroll-in entrance — no Lenis/GSAP
  dependency. Respects `motion-reduce:`.
- **`TextScramble`** (`src/components/ui/TextScramble.tsx`) — the
  hacker/decrypt-style headline reveal, bookending the homepage (Hero →
  Footer). SSR-safe (real text on first paint), respects
  `prefers-reduced-motion`, and always keeps real text available to screen
  readers via a `sr-only` span.
- A soft page-transition (`src/app/(site)/template.tsx`) gives navigation
  from tile → detail page a "continuation" feel instead of a hard reload.

## Image System

`src/lib/constants.ts` defines a `MediaRef` / `ProjectImages` shape
(`thumbnail`, `heroImage`, `gallery[]`) consumed by
`src/components/ui/MediaFrame.tsx`, which currently renders generative
placeholder compositions — not flat gradients, but one of three deliberate
styles picked via a `variant` field: `"ui"` (fake dashboard/app
screenshot), `"diagram"` (node-and-line architecture/workflow diagram), or
`"orbs"` (abstract blurred-orb brand visual) — deterministically varied per
item via a seeded hash of its label, so nothing looks identical. The
Sanity `mediaRef` schema (Phase 3.1) mirrors this exact shape, plus an
optional real `image` field — so once real photography exists, it's a
schema-compatible upgrade, not a rebuild.

## 3D-Ready, Not 3D-Built

The hero visual (`src/components/hero/HeroVisual.tsx`) is flat SVG + CSS
animation, but its four-node-around-a-hub layout is documented as the
contract a future Three.js scene should preserve. `src/components/future/`
is reserved for that swap-in later — nothing currently lives there.

## Forms

Contact, Get a Quote, and Career Application all use React Hook Form + Zod,
a honeypot field, and (for applications) PDF-only CV validation with a
data-consent checkbox. Shared form styling (`formInputClass` /
`formLabelClass` / `formErrorClass` in `src/lib/utils.ts`) and a sitewide
`.focus-ring` CSS class keep every interactive element visually consistent.
Forms currently log to console with a TODO marking where
`/api/contact`, `/api/applications`, `/api/inquiries` route handlers go
(Phase 3.4 / Phase 4).

## Known Environment Note

This sandbox has no network access to `fonts.googleapis.com`, so
`next/font/google` (Geist) was swapped for a system font stack in
`src/app/(site)/layout.tsx` / `globals.css`. Re-enable `next/font/google`
once deployed somewhere with outbound network access (e.g. Vercel) — it
works there without changes — or self-host Geist via `next/font/local`.

## Dynamic Routes & 404 Behavior

All `[slug]` routes (`services`, `solutions`, `products`, `work`, `labs`,
`careers`) read `params` as `Promise<{ slug: string }>` (required by
Next.js 16 — see "Fixed Bugs" below), and call `notFound()` when neither
Sanity nor the `constants.ts` fallback has a matching document.

As of Phase 3.2, these routes no longer use `generateStaticParams()` /
`dynamicParams = false` — that pattern only made sense when
`constants.ts` was a fixed, fully-known-at-build-time list of slugs.
Content now lives in Sanity and can change without a rebuild, so every
detail route renders dynamically (ISR via `sanityFetch`'s `revalidate`
option) and resolves 404s per-request instead. This is verified at the
**content** level (real title/body per slug), not just HTTP status codes,
across both real Sanity data and the `constants.ts` fallback path.

## Phase 3.1: Sanity CMS Setup

Adds Sanity Studio as the site's future CMS/admin panel, without touching
any existing page's rendering yet — every page still reads from
`src/lib/constants.ts`. Phase 3.2 is the separate, later step that
actually switches pages over to live Sanity queries.

### What's new, folder by folder

```
vecobyte/
├── sanity.config.ts          ← Studio configuration (schemas, plugins, /studio path)
├── sanity.cli.ts              ← Used by `npx sanity` CLI commands
├── sanity/
│   ├── schemaTypes/
│   │   ├── documents/         ← product.ts, service.ts, solution.ts, caseStudy.ts,
│   │   │                        experiment.ts, job.ts, faq.ts, siteSettings.ts
│   │   ├── objects/            ← mediaRef.ts, projectImages.ts, sharedObjects.ts
│   │   ├── shared/options.ts   ← status/size/tone dropdown option lists
│   │   └── index.ts            ← registers every schema with the Studio
│   └── structure.ts            ← custom Studio sidebar grouping
├── src/
│   ├── sanity/
│   │   ├── env.ts               ← reads/validates the env vars below
│   │   ├── client.ts            ← read client for Phase 3.2's page queries
│   │   └── image.ts             ← Sanity image URL builder for Phase 3.2
│   └── app/
│       ├── (site)/               ← ALL existing public pages moved here (see below)
│       │   └── layout.tsx        ← the site's normal layout (Navbar/Footer)
│       └── studio/
│           ├── layout.tsx        ← Studio's OWN minimal layout (no Navbar/Footer)
│           └── [[...tool]]/page.tsx  ← embeds Sanity Studio itself
```

### Why the `(site)` folder appeared — a structural fix found while testing

`/studio` was inheriting the public site's root layout — the admin panel
was rendering with the marketing Navbar/Footer wrapped around it, and
picking up the site's SEO title. That's wrong: the admin panel is a
completely different application that happens to live at the same domain.

Fixed using Next.js's **"multiple root layouts"** pattern: every existing
page (`page.tsx`, `about/`, `services/`, `products/`, etc.) moved into a
`(site)` route group, which owns the original `layout.tsx` (Navbar,
Footer, site metadata, `<html>`/`<body>`). `studio/` sits alongside it as
its own top-level group with a separate, minimal `layout.tsx` — no
Navbar, no Footer, no site metadata, no imported CSS (Sanity Studio brings
its own styling). Route groups like `(site)` don't appear in the URL —
`/about` still resolves exactly as before; only the file's location on
disk changed. No `@/` imports needed updating (alias-based, not
relative) — only the one `./globals.css` import in `(site)/layout.tsx`
changed to `../globals.css` to match its new location.

### Sanity Account Setup (do this before running the Studio)

1. Go to [sanity.io](https://sanity.io) and create a free account (no
   credit card required).
2. Create a new project. Note the **Project ID** shown in the dashboard.
3. Create a dataset named `production`, and set its **visibility to
   Private** (not Public) — see "Why One Private Dataset Is Enough" below.
4. Copy `.env.local.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<your project ID>
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
   Leave `SANITY_API_TOKEN` empty for now — it isn't needed until Phase 3.3.
5. Run `npx sanity login` once, in the project folder, to authenticate the
   Sanity CLI with your account (needed to deploy schema changes and to
   become a project member so Google/GitHub login into `/studio` works).
6. `npm run dev`, then visit `http://localhost:3000/studio` and log in.

**Without `.env.local` configured**, the rest of the site (`/`, `/products`,
etc.) builds and runs completely normally — verified with a clean build
and full route regression test with zero env vars set. Only `/studio`
itself shows a clear "Missing environment variable" error until the steps
above are done. Nobody should be blocked from working on the frontend just
because Sanity isn't set up yet.

### Why One Private Dataset Is Enough

Every page on this site is server-rendered (`generateStaticParams` at
build time, or Server Components at request time) — the browser never
talks to Sanity directly. That means a **private** dataset
(token-required for every read, no anonymous access at all) works fine
for public marketing content too, since Next.js's server holds the token,
not the visitor's browser. This is why the earlier "public Sanity +
private Postgres" split simplifies down to just one Sanity dataset, with
all access mediated through Next.js Route Handlers, and no separate
database needed for Phase 3.3's private data either.

### The `mediaRef` bridge object

`sanity/schemaTypes/objects/mediaRef.ts` supports **both** a real uploaded
`image` and the placeholder `tone`/`variant`/`label` fields the frontend's
`MediaFrame` already uses. This means content can be published today
(before real photography exists) without anything looking broken, and
real images can be swapped in later per-item without a schema change —
`MediaFrame`'s Phase 3.2 update should simply prefer `image` when present
and fall back to the generated placeholder otherwise.

## Phase 3.2: Live Sanity Data (this round)

Every page that used to read from `src/lib/constants.ts` now fetches from
Sanity instead, using ISR (revalidate every hour, or instantly once Phase
3.5's webhook is wired up) rather than build-time `generateStaticParams`.
`constants.ts` itself is untouched and still exported — it's now used only
as fallback content (see below), not as the live source of truth.

### New files

```
src/sanity/
├── queries.ts      ← every GROQ query (list + by-slug) for all 8 content types
├── types.ts        ← hand-written types mirroring each Sanity schema exactly
├── fetch.ts         ← sanityFetch()/sanityFetchList() — ISR + graceful failure
├── fallbacks.ts     ← constants.ts → Sanity-Doc-shaped adapters (see below)
└── siteSettings.ts  ← getSiteSettings(), request-memoized via React's cache()
```

Every list page (`/services`, `/solutions`, `/products`, `/work`, `/labs`,
`/careers`) and detail page (`/services/[slug]`, etc.) was rewritten to
call these instead of importing arrays from `constants.ts` directly. The
homepage's Site-Settings-driven sections (`CapabilitySignal`,
`CommitmentStrip`, `WhyVecobyte`, `TechnologySection`, `HowWeWork`,
`Footer`, `Hero`'s tagline) now receive their content as props from
`getSiteSettings()`, fetched once per request.

### Fallback Strategy — why `constants.ts` still matters

`sanity/fallbacks.ts` converts each `constants.ts` array into the same
shape Sanity queries return. Every list/detail page tries Sanity first;
if a collection is empty (a fresh, unconfigured dataset) or a specific
document doesn't exist yet, it falls back to the matching `constants.ts`
entry — **consistently between list and detail pages**, so a tile shown
on `/products` via fallback data always resolves correctly when clicked,
rather than 404ing because Sanity has no matching document yet.

**Deliberate exception: Work / case studies has no fallback.**
`fallbackCaseStudies()` exists for code-consistency but always resolves to
`[]`, since `CASE_STUDIES` in `constants.ts` has always been intentionally
empty — a case study implies a real, verifiable client outcome, unlike
Products/Services/Labs, which have always shown legitimate concept-stage
placeholder content that never claimed to be something it wasn't. `/work`
is the one place that stays a true "honest empty state" (see
`components/shared/EmptyState.tsx`) until real entries exist, either in
Sanity or eventually in `constants.ts` itself.

### Two bugs found and fixed while converting

- **Cascading build failure from `MediaFrame`.** Adding real-image support
  to `MediaFrame` (via `urlFor`) meant it transitively imported
  `src/sanity/env.ts` — and since nearly every page renders `MediaFrame`
  somewhere, `env.ts`'s previous behavior (throwing when env vars were
  missing) took down the *entire site's build*, not just Sanity-dependent
  pages. Fixed by making `env.ts` never throw (falls back to empty
  strings, exposes a `hasSanityConfig` boolean) and making
  `src/sanity/client.ts` construct its Sanity client **lazily** — a
  top-level `export const client = createClient(...)` would throw
  synchronously on empty `projectId` the moment anything imported the
  module, which is exactly what `env.ts`'s fix was trying to avoid one
  layer up. `getClient()` defers that risk to the one place
  (`sanityFetch`) already wrapped in try/catch.
- **The `notFound()`-returns-200 bug, again — this time from
  `loading.tsx`.** Removing `generateStaticParams`/`dynamicParams = false`
  (needed for ISR — content shouldn't require a full rebuild to appear)
  reintroduced the exact streaming-shell status-code bug fixed earlier in
  the project, but for a different reason this time: `(site)/loading.tsx`
  wrapped every route in that segment in an implicit Suspense boundary,
  which streams a `200` shell immediately — and by the time a page's async
  data-fetch resolves to `null` and calls `notFound()`, the response
  status is already committed. Fixed by removing the blanket
  `loading.tsx` entirely. This was a real trade-off, not a free fix: the
  site no longer shows a global loading spinner during navigation.
  Correct HTTP status codes were judged more important than a loading
  spinner, especially for a CMS-driven site where "is a page real"
  correctness matters for SEO. If loading UI is wanted later, add
  `<Suspense>` boundaries *inside* individual pages, wrapped only around
  genuinely slow, non-critical sections — never around the data-fetch that
  determines whether `notFound()` fires.

## Phase 3.3: Private Data Schemas (this round)

Adds the schemas for Contact Messages, Project Inquiries, and Job
Applications — the private, operational counterpart to Phase 3.1/3.2's
public content. **Nothing writes to these yet**: the three forms
(`ContactForm`, `QuoteForm`, `ApplicationForm`) still only `console.log()`
on submit. That connection is Phase 3.4. This round is schema +
Studio-structure only, so you can already see the "Leads" and
"Applications" sections in the Studio sidebar and understand the shape
before any code writes to them.

### New schemas

```
sanity/schemaTypes/documents/
├── contactMessage.ts     ← Contact form submissions
├── projectInquiry.ts     ← Get a Quote form submissions
└── jobApplication.ts     ← Career application submissions (references `job`)
```

All three share a deliberate pattern:

- **Applicant-submitted fields are `readOnly: true`** in the Studio (name,
  email, message, CV, etc.) — an admin can change the *workflow* fields
  (status, priority, notes) but can't accidentally edit what someone
  actually wrote or submitted.
- **A workflow `status` field**, using one of two new option lists in
  `sanity/schemaTypes/shared/options.ts`:
  - `LEAD_STATUS_OPTIONS` (New → In Progress → Replied → Closed →
    Archived) for Contact Messages and Project Inquiries.
  - `APPLICATION_STATUS_OPTIONS` (New → Reviewing → Shortlisted →
    Interview → Rejected/Hired → Archived) for Job Applications — a
    richer pipeline since hiring has more real stages than a generic lead.
  - Both include an "Archived" end-state rather than only relying on
    deletion, per the earlier "don't destroy data by accident" principle
    from the original project notes.
- **`internalNote`/`internalNotes`/`adminNotes` fields** — private,
  visible only in the Studio, never surfaced anywhere on the public site
  (there is no query anywhere that could expose them).

### CV storage: base64, not a Sanity file asset

`jobApplication.cvBase64` is a plain `text` field holding the PDF's
base64-encoded contents, not Sanity's `file` field type. This was a
deliberate call made earlier in the project: Sanity file/image assets are
served from a predictable public CDN URL pattern
(`cdn.sanity.io/files/...`), which is a meaningfully different exposure
model than "requires the same API token as the rest of the private
dataset" — for something as sensitive as a CV, keeping it as a field on
an already token-gated document avoids creating a second access surface
to reason about. The application form already caps uploads at 5MB;
base64 encoding adds roughly 33% overhead, which stays comfortably within
Sanity's per-document size limits.

### Why "dataset security" needed no extra code this round

Phase 3.3's stated scope included "+ dataset security," but this is
already fully satisfied by the Phase 3.1 decision to make the whole
dataset private with `perspective: "published"` on the client (see
`src/sanity/client.ts`) — every read, public or private content alike,
already requires the server-only `SANITY_API_TOKEN`. There is no GROQ
query anywhere in `src/sanity/queries.ts` for these three new types, and
none should ever be added — the only legitimate way data reaches them is
Phase 3.4's future API routes, writing with that same token, server-side.

**One thing that's a manual Sanity dashboard step, not a code change**:
if this project ever adds a second Studio user, the earlier project notes
proposed a "Content Manager" role that can edit Products/Services/etc.
but should *not* see Messages/Inquiries/Applications (since those contain
another person's email, phone, CV). Sanity's role-based permissions for
this live in the project's settings at manage.sanity.io, not in schema
code — worth setting up before inviting anyone besides the current
Administrator.

### What's still simulated, not real, until Phase 3.4

- Submitting any of the three forms still only logs to the browser/server
  console — no document is created in Sanity yet.
- There's currently no way to create a *test* Contact Message /
  Inquiry / Application except manually inside the Studio itself (useful
  for getting familiar with the new "Leads" section, but not a substitute
  for testing the real form flow).

## Major Rebrand & Design Direction Shift (this round)

A large, multi-part round following a new design reference (a light,
Swiss/portfolio-style site) and an explicit request to rebrand and
simplify several recurring UI patterns site-wide.

### Rebrand: Vecobyte → Vicosoft

Every reference to the old brand name was renamed — company name, email
domain, Sanity Studio titles ("Vicosoft Admin", "Vicosoft Content"),
`package.json`'s `name` field, and all in-code comments/documentation.
Done via a case-aware `sed` pass (`Vecobyte`→`Vicosoft`,
`VECOBYTE`→`VICOSOFT`, `vecobyte`→`vicosoft`) across every `.ts`/`.tsx`
file, rather than editing ~27 files individually.

**A real bug this caused, caught immediately by the build**: `sed` only
rewrites file *contents*, not filenames — `WhyVecobyte.tsx` still existed
on disk under its old name after its own `import`/export statements had
already been rewritten to say `WhyVicosoft`, so the homepage's import
(`@/components/home/WhyVicosoft`) pointed at a file that didn't exist.
Fixed by renaming the file to match. Worth remembering for any future
rebrand: content and filenames are two separate problems.

**Product names (`VecoAI`, `VecoHR`, etc.) were deliberately left
unchanged** — only the company/brand name was in scope for this rebrand,
not the product line's own naming.

### Eyebrow tags removed site-wide

Every small "// LABEL" style tag that sat above a section or page
heading (`// SERVICES`, `// WHAT WE DO`, `SOLUTION`, `CAREERS`, the
`VICOSOFT ENGINEERING` hero badge, etc.) was removed, per an explicit
design decision to simplify the visual language. Handled in two ways:

1. **`SectionHeading.tsx`** (the shared component most homepage/listing
   sections use) had its `eyebrow` rendering removed entirely — the prop
   is still *accepted* (and now silently ignored) so every existing call
   site across the codebase keeps compiling without needing individual
   edits.
2. **Standalone inline eyebrow spans** on individual detail/page headers
   (18 files) were removed via a targeted regex pass matching the exact
   `<span className="eyebrow ...">LABEL</span>` / `<h2 className="eyebrow
   ...">LABEL</h2>` pattern.

**Deliberately NOT touched**: `ShowcaseTile.tsx`'s small category label on
grid tiles (e.g. "AI PLATFORM" on a product card) — that's a functional
categorization label for scanning a grid, not a decorative page-header
tag, and removing it would have hurt usability rather than simplified
anything. `Footer.tsx`'s column headers and `Preloader.tsx`'s loading-
screen wordmark were left alone for the same reason (different,
functional purposes).

**A real regression this caused, caught by re-reading the affected
files**: the same regex pattern that correctly stripped decorative
"// LABEL" tags also matched *numbered step-index badges* like `{String(i
+ 1).padStart(2, "0")}` in `HowWeWork.tsx`, `WhatWeDo.tsx`, and
`TechnologySection.tsx` — since those were also `<span className="eyebrow
...">` elements structurally, just with number content instead of a text
label. This silently deleted the "01/02/03..." sequencing from three
components. Caught by reviewing each affected file individually rather
than trusting the regex output blindly, and restored (as a plain styled
`<span>`, no longer using the now-removed `.eyebrow` visual language) in
all three.

### `TextScramble` → `TextReveal`: a calmer heading animation

The earlier hacker/decrypt-style scramble effect was removed entirely
(`TextScramble.tsx` deleted) and replaced with **`TextReveal.tsx`** — a
word-by-word rise-and-fade reveal, inspired by the staggered line-reveal
pattern common on premium portfolio sites (each word rises from below a
mask into place, staggered by index). SSR-safe (real text always in the
DOM — this only animates opacity/transform, never swaps characters, so
nothing is ever hidden from search engines or screen readers even before
the animation plays) and respects `prefers-reduced-motion`. Same call
sites as before: Hero headline, the closing CTA headline, and the footer
tagline.

### Hover effects added: `CommitmentStrip` and `HowWeWork`

Both were static grids with no interaction. Now: hovering one card lifts
and scales it slightly while dimming its siblings (matching the same
"focus one, recede the rest" language already used by `ShowcaseGrid`),
implemented with simple local `useState` hover-index tracking rather than
pulling in the full shared hover-context abstraction, since each is a
self-contained grid with no need to share state across files.

### Technology section: redesigned into group cards

Previously a flat grid of individual tech-name tiles. Redesigned per
explicit direction into **one large card per category** (Frontend,
Backend, AI & Machine Learning, Database, Cloud & DevOps, Design), each
containing smaller individual item-chips for every technology in that
group. Hovering an individual item chip shifts it up-and-right and
recolors it — a "nudge" rather than the grow/dim pattern used elsewhere,
matching the specific horizontal-shift interaction requested.
`TECH_STACK_GROUPS` in `constants.ts` was also updated to the full,
specific technology list (26 items across 6 groups, including Django,
FastAPI, Spring Boot, PHP Laravel, MySQL, GitHub Actions, Figma, Design
Systems, etc.) rather than the smaller placeholder list it had before.

### Theme: dark → light, pastel-blue gradient

The single largest and riskiest change this round: every core color
token in `globals.css`'s `@theme` block was redefined — background tokens
(`--color-ink`, `--color-surface`, `--color-surface-raised`) flipped from
near-black to white/near-white, text tokens (`--color-paper`, `--color-
muted`) flipped from light to dark, borders lightened, and a soft
multi-layer radial+linear gradient (`body`'s `background-image`) added
for the pastel blue-white wash. `--color-electric`/`--color-cyan` (the
accent colors used throughout for buttons, links, and highlights) were
kept as saturated blues, adjusted slightly for contrast against a light
background instead of a dark one. `.grid-field`'s decorative grid lines
were flipped from white to dark-blue-tinted (they'd have been invisible
against a light background otherwise).

**Why this was low-risk to attempt as a token-only change**: this
project's components have consistently referenced these CSS custom
properties (`bg-[var(--color-surface)]`, `text-[var(--color-paper)]`,
etc.) rather than hardcoding Tailwind color utilities throughout every
phase of this build — a design-system discipline maintained since Phase
2. That meant redefining the *values* of a dozen tokens cascades correctly
through essentially the entire site automatically, rather than requiring
per-component edits. A targeted audit for any hardcoded
`text-white`/`bg-black`/`shadow-black`-style Tailwind utilities that could
have bypassed the token system and looked wrong on a light background
found only cases where they're contextually correct regardless of the
page theme (white text over a dark image-overlay scrim on showcase
tiles, dark drop-shadows for depth — both look right on light OR dark
pages) — nothing needed changing.

**Honest limitation, stated plainly**: this sandbox has no way to render
actual pixels or take a screenshot — every check below confirms the site
still *builds, serves every route correctly, and contains the right
text/structure*, not that the new color palette actually looks good,
reads legibly, or matches the reference image's specific mood. A real
visual pass in a browser is essential before considering this "done,"
and is the single most important thing to check first after this update.

## Dynamic Team / Leadership Section (this round)

Replaced the previous About page's single hardcoded "founder quote" block
(name, role, and quote all typed directly into the page, no CMS control,
and a "Founder Name" placeholder that was never filled in) with a fully
Sanity-driven team section supporting any number of people.

**New Sanity document type**: `teamMember` (`sanity/schemaTypes/
documents/teamMember.ts`) — `name`, `role` (free text, not a fixed
Owner/CEO/Chairman list — whatever's typed is what shows), `photo`
(image, with hotspot cropping), `quote`/bio, optional `linkedin` URL, and
`order` for display sequence. Added to the Studio sidebar under
"Website Content" as "Team Members".

**New query/type/fallback**: `TEAM_MEMBER_LIST_QUERY` in `queries.ts`,
`TeamMemberDoc` in `types.ts` (`photo` is optional — see below),
`fallbackTeamMembers()` in `fallbacks.ts` reading from a new
`TEAM_MEMBERS` array in `constants.ts` (currently 3 placeholder people —
Founder & CEO, Chairman, Co-Founder & Owner — replace the names/quotes
there, or better, just add real people directly in Sanity Studio once
credentials are live, and the fallback data stops being used entirely).

**New component**: `src/components/about/TeamSection.tsx` — one row per
team member, alternating photo-left/text-right and photo-right/text-left
by index (matching "photo on one side, their words on the other"), each
row fading/rising into view via `IntersectionObserver` as it scrolls
into the viewport, and the quote itself using the existing `TextReveal`
word-by-word animation. Photos go through `MediaFrame` — the same
component used for product/case-study imagery elsewhere on the site —
which already handles "real uploaded photo, once added in Studio" vs.
"no photo yet, show a generative placeholder" automatically, so this
looks intentional immediately, before any real photos are uploaded.

**Why `photo` is optional in the type, not required**: the schema itself
requires a photo before a real Studio document can be published, but the
*type* used by fallback/placeholder data needs to allow no photo at all
(since there's no real Sanity asset for placeholder people) — `MediaFrame`
was already built to render a nice generative placeholder in exactly this
situation, so leaning on that rather than requiring dummy image data was
the simpler, already-proven path.

**Also fixed as part of this same page rewrite** (client-reported, from
before this round's rebrand had been applied to the copy they reviewed):
the founder-quote block's small circular "V" avatar badge that was
reported as visually overlapping nearby text — that whole block no
longer exists, replaced by real per-person layout, so the overlap can't
recur in the old form. The `SectionHeading` `eyebrow` props left over
from the previous About page draft ("Our approach", "Why Vicosoft") were
also cleaned up to match the eyebrow-removal decision from the prior
round — they were harmless (the prop is silently ignored) but stale.

**Note on scale**: nothing here is hardcoded to "3 people." Add a 4th,
5th, 10th `teamMember` document in Studio and the section grows to match
automatically — same pattern as every other content type on this site.

## CV Viewer Fix: Blob URL Instead of data: URI (this round)

Real-world testing caught a genuine bug in the CV viewer built the round
before: clicking "View / Download CV" opened a blank "Untitled" browser
tab instead of the PDF. Root cause: the button's `href` was a `data:`
URI (`data:application/pdf;base64,...`) — this looked correct and is a
commonly-shown pattern in examples, but modern Chrome/Edge/Firefox block
top-level navigation to `data:` URIs as an anti-phishing measure, so the
click silently failed to load anything.

**Fixed with a Blob URL instead** — `CvFileInput.tsx` now decodes the
base64 string into a `Blob` and calls `URL.createObjectURL()` inside a
`useEffect` (never during render, to avoid calling browser-only APIs
during any SSR pass Next.js might attempt for the Studio shell), then
points the button at that blob URL. Blob URLs aren't subject to the same
navigation restriction. The object URL is revoked in the effect's cleanup
function to avoid leaking memory. A `decodeError` state also now handles
the case where the stored base64 is somehow corrupted, showing a clear
message instead of a silent failure.

Two more of the same `react-hooks/set-state-in-effect` lint situation
from `Preloader.tsx` came up here too — both resolved the same way (one
by simply removing an unnecessary early-reset branch since the state's
initial values were already correct, one by a justified, documented
`eslint-disable` for the genuinely unavoidable case of storing a
browser-only decoded value).

## CV Viewer: Making the base64 Field Actually Usable (this round)

Found via real-world testing: the `jobApplication.cvBase64` field (see
Phase 3.3's design notes on why it's base64 text, not a Sanity file
asset) rendered as Sanity's default text input — an enormous, completely
unreadable wall of characters, with no way for an admin to actually open
the CV they're reviewing. Storing it safely and being able to *use* it
are different problems; this fixes the second one.

### New file

```
sanity/components/CvFileInput.tsx   ← custom Studio input for cvBase64
```

Wired in via `jobApplication.ts`'s field definition:
`components: { input: CvFileInput }`. This **fully replaces** the default
textarea with a small `@sanity/ui` panel and a single "View / Download CV
(PDF)" button. Clicking it opens `data:application/pdf;base64,<the
stored string>` in a new tab — the browser's own built-in PDF viewer
handles displaying and downloading it from there. Everything happens
client-side, in the admin's own browser; nothing is re-uploaded,
re-fetched from anywhere else, or exposed via any new URL — the "why
base64 instead of a file asset" security reasoning from Phase 3.3 is
completely unaffected by this.

### Two real `@sanity/ui`/`@sanity/icons` API mismatches caught by the build

Both of these looked correct based on common Sanity documentation
examples, but the *specific installed versions* in this project disagree
— caught by `npm run build`'s type-check step, not guessed at:

- `@sanity/icons`' root entry no longer exports individual icons like
  `DownloadIcon` directly (they're `deprecated`/`never`-typed stubs at
  that path in this version) — the real export lives at the subpath
  `@sanity/icons/Download`.
- `@sanity/ui`'s `<Stack>` component deprecated its `space` prop in favor
  of `gap` in this installed version (`space` is now typed `never`) —
  using `space={3}` failed type-checking with a confusing-looking "number
  is not assignable to undefined" error until traced back to this.

Both are now correctly using `@sanity/icons/Download` and `<Stack gap={3}>`.

## Signature Motion Pass: Preloader, Lenis, Stack Cards (this round)

Inspired by exploring a reference portfolio site (Snigdha Chandra Paik's,
shared during a design discussion) — the specific *patterns* were
adapted into Vecobyte's own dark/electric-blue design language and
original copy, not the reference's visual styling or text copied
outright.

### New files

```
src/components/shared/Preloader.tsx     ← counting intro animation
src/components/shared/SmoothScroll.tsx  ← Lenis momentum scroll (no visual output)
```

### Lenis smooth scroll

`SmoothScroll.tsx` mounts once in `(site)/layout.tsx` and drives real
momentum-based scroll physics via `requestAnimationFrame` — a
meaningfully heavier, smoother feel than the browser's built-in
`scroll-behavior: smooth` (which only affects anchor-link jumps, not
normal wheel/trackpad scrolling). The old CSS `scroll-behavior: smooth`
rule was **removed** from `globals.css`, not just left alongside Lenis —
running both at once causes the two smoothing systems to visibly fight
each other, and removing it also resolves the Next.js console warning
about `data-scroll-behavior` during route transitions that showed up in
earlier dev-server logs. Skips initializing entirely under
`prefers-reduced-motion`, leaving native instant scroll as the accessible
fallback.

### Preloader

A brief (1.4s), full-screen counting animation (`000` → `100`) shown
before first paint, adapted from the reference site's "Presenting
000/100" pattern into Vecobyte's own mono-numeral, electric-blue-progress-
bar treatment. Two deliberate constraints:

- **Shows once per browser session**, not on every page — a
  `sessionStorage` flag prevents it from re-appearing on a hard refresh
  of a different page later in the same session. It doesn't need special
  handling for *client-side* navigation, since `(site)/layout.tsx` (where
  it lives) stays mounted across soft route changes anyway.
- **Skipped entirely under `prefers-reduced-motion`** — this is a
  stylistic flourish, not something that should override an explicit
  motion preference.

**A note on an intentional lint override**: `Preloader.tsx` has one
targeted `eslint-disable-next-line react-hooks/set-state-in-effect`.
This component's `visible` state must start `false` (SSR-safe —
`window`/`sessionStorage` don't exist server-side) and flip to `true`
inside a `useEffect`, once, after confirming this is a genuine
first-visit-this-session client. The alternative (computing the initial
value via a lazy `useState` initializer that checks `window` directly)
would make the server's render and the client's *first* render disagree
on whether the preloader exists in the DOM at all — a real hydration
mismatch, not just a lint nitpick. The disable comment documents this
reasoning inline, rather than silently suppressing the rule.

### Technology section → individual "Stack" cards

`TechnologySection.tsx` previously rendered technologies as grouped badge
lists (one heading per group, badges below). Redesigned into one card per
individual technology — a small category eyebrow (the old group name) and
a large tech name per card, in a responsive grid, each with the same
hover-lift-and-glow treatment used elsewhere on the site (`ProductStack`,
`ShowcaseTile`) for visual consistency. This directly mirrors the
reference site's "one tile per tool" Stack section, flattening our
existing `TECH_STACK_GROUPS` data (`{ group, items[] }`) into individual
`{ category, name }` cards rather than requiring any new content model.

### Navbar: added a "Home" link

`NAV_LINKS` in `constants.ts` previously had no explicit "Home" entry —
only the logo linked back to `/`. Added `{ label: "Home", href: "/" }` as
the first item, matching the reference site's nav structure.

## Featured Content Strategy & ProductStack Hover Fix (this round)

Two related issues raised during real-world testing, both about the
homepage not scaling or feeling premium once real content exists.

### Homepage was showing everything, unfiltered

`ProductsEcosystem`, `LabsPreview`, and the homepage's `ExploreShowcase`
were all fetching and rendering **every** Product/Work/Labs item that
exists in Sanity — fine at 4 items, unusable at 100+. Fixed with a
three-way "featured" strategy, implemented once in
`src/lib/selectFeatured.ts` and reused by all three homepage sections:

1. **No real Sanity items exist yet** → show the `constants.ts` fallback
   (capped at 6).
2. **Real items exist and at least one is marked `featured`** → show only
   those (capped at 6).
3. **Real items exist but none are marked `featured` yet** → show the
   first 6 real items anyway — **never** fall back to fake/dummy content
   just because nothing's been curated. Showing placeholder "VecoAI"-style
   content while a real, unfeatured product exists would recreate the
   exact footer/services inconsistency bug fixed earlier in the project.

This required:
- Adding a `featured` boolean field to the `experiment` schema (`product`
  and `caseStudy` already had one).
- Extending `PRODUCT_LIST_QUERY` to also project `technologies`,
  `description`, and `featured` (previously missing — meaning
  `ProductStack`'s tech-badge row was silently always empty for real
  Sanity products, since the field was never even fetched).
- Extending `CASE_STUDY_LIST_QUERY` and `EXPERIMENT_LIST_QUERY` to project
  `featured` too.
- `fallbackFeaturedProducts()` / `fallbackFeaturedCaseStudies()` /
  `fallbackFeaturedExperiments()` added to `fallbacks.ts` (simple capped
  slices of the existing fallback arrays).

Verified with an isolated unit-style test of `selectFeatured()`'s four
branches (empty→fallback, mixed-featured→featured-only, none-featured→
first-N-real, and limit/capping) — all four confirmed correct before this
was wired into the three homepage components.

**Full listing pages (`/products`, `/work`, `/labs`) are unaffected** —
they still show everything, uncapped, exactly as before. Only the
homepage's preview sections are curated now.

### `ProductStack` had no hover treatment at all

Investigating a "hover doesn't do anything" report found a real, concrete
gap: `ShowcaseTile` (used everywhere else — `/products`, `/services`,
`/work`, `/labs`, and the homepage's `ExploreShowcase`) has a fully
built-out hover state (lift, scale, glow, sibling-dimming), but
`ProductStack` — the large sticky-stacking cards specifically used for
the homepage's "Vecobyte Products" section — never had one. Only a small
arrow icon inside each card moved on hover; the card itself (border,
shadow, image, title) was static. Fixed by adding: a border-color and
glow-shadow transition on the whole card, an image zoom on the
`MediaFrame` (`group-hover:scale-[1.06]`), and a title color shift to
cyan — matching the hover language used everywhere else on the site, so
the "premium" feel is now consistent whether a visitor is looking at the
homepage's product stack or any other showcase grid.

## Phase 3.4: Forms Actually Work Now (this round)

Contact, Get a Quote, and Career Application submissions now genuinely
write to Sanity — the `console.log()` stubs are gone. This is the piece
that turns Phase 3.3's schemas from "structure that exists" into
"something real happens when a visitor submits a form."

### New files

```
src/sanity/writeClient.ts     ← privileged, token-based Sanity client — SERVER-ONLY
src/lib/rateLimit.ts          ← simple in-memory rate limiter (see its own comments)
src/app/api/
├── contact/route.ts          ← writes contactMessage documents
├── inquiry/route.ts          ← writes projectInquiry documents
└── applications/route.ts     ← writes jobApplication documents (handles the CV file)
```

### How each route works

1. **Rate limit check first** — 5/minute for contact and inquiry, a
   stricter 3/10-minutes for applications (a genuine applicant only
   submits once; rapid repeats are almost always abuse). Rejected
   requests get a `429` before anything else runs.
2. **Server-side re-validation with Zod** — a *separate* schema from the
   client-side one in `src/lib/validations/`, not a shared import. The
   client schemas' honeypot field (`company_website: z.string().max(0)`)
   would make the whole parse fail on a bot submission; the server
   instead checks the honeypot explicitly and responds with a **fake
   success** (`200 { ok: true }`) without writing anything — never a
   different status code or message that would teach a bot which field
   to leave empty.
3. **Applications additionally**: reads `multipart/form-data` (not JSON,
   since a file is involved), and **re-validates the CV server-side**
   (PDF only, ≤5MB) — the client-side file picker restrictions are
   trivially bypassable by anyone calling the endpoint directly, so this
   check is not optional. The file is converted to base64 via
   `Buffer.from(arrayBuffer).toString("base64")` before being written to
   `jobApplication.cvBase64`.
4. **On success**, a document is created directly as *published* (not a
   draft) via the write client, so it shows up immediately in the
   Studio's "Leads"/"Applications" sections without needing a manual
   Publish click.
5. **On any failure**, the client gets a generic, non-revealing error
   message; the real error (e.g. a missing token, a Sanity API error) is
   logged server-side via `console.error` for debugging — verified by
   intentionally testing with no token configured (see "Verified" below).

### The `jobApplication.job` reference — a fix made along the way

Phase 3.3's `jobApplication` schema originally made the `job` reference
**required**. Testing this route surfaced a real gap: fallback job
listings (from `constants.ts`, shown when Sanity has no real Jobs yet)
use their slug as a synthetic `_id` — not a real Sanity document, so a
reference to one would fail. Fixed by:

- Adding a **`jobTitle`** string field (always populated — a snapshot of
  the title at submission time, which is also useful even for real jobs,
  in case the posting is later edited or closed).
- Making **`job`** optional — only set when `careers/[slug]/page.tsx` can
  tell the application came from a genuine Sanity document (tracked via a
  `realJob` vs. fallback distinction in that page, then passed down as an
  optional `jobId` prop to `ApplicationForm`).

### Why rate limiting is in-memory, not Upstash, for now

`src/lib/rateLimit.ts` is a small, dependency-free `Map`-based limiter.
Its documented limitation: state lives in one Node process's memory, so
it doesn't share counts across multiple serverless instances the way a
platform like Vercel might spin up under real concurrent load — the
effective limit becomes "N × active instances," not a strict global N.
For this project's current traffic (not yet live), that's an acceptable
stopgap rather than a reason to require setting up a new external service
(Upstash Redis, previously discussed) before forms could work at all. The
upgrade path is isolated to this one file; call sites in the three routes
wouldn't need to change.

## Product Categories & Filterable Navigation

Products previously listed each individual product by name in the
Navbar's "Products" dropdown — a pattern that stops scaling almost
immediately (10 products is already too many for a dropdown, and 100
would be unusable). Fixed by introducing a proper category taxonomy:

- **New schema**: `productCategory` (`sanity/schemaTypes/documents/productCategory.ts`)
  — just `name` + `slug` + `order`. A handful of these should exist
  (e.g. "AI Platform", "HR Platform"), not one per product.
- **`Product.category`** changed from free-text string to a **reference**
  to `productCategory`. This means categories are now a controlled,
  reusable list — picked from a dropdown in the Studio, not typed fresh
  (and potentially inconsistently) on every product.
- **Navbar dropdown** (`src/components/layout/Navbar.tsx`) now merges in
  categories fetched from Sanity at render time (via
  `src/sanity/productCategories.ts`, request-memoized) instead of a
  hardcoded per-product list in `constants.ts`. Adding a 50th product
  doesn't add a 50th dropdown row — it just joins whichever category it
  belongs to.
- **`/products?category=<slug>`** — the Products page now accepts a
  category filter via search param (no new route needed), with filter
  pills at the top and an honest "No products in this category yet"
  state for an empty/unknown category rather than a crash or 404.
- Every place that previously read `product.category` as a plain string
  (`ProductStack`, `ExploreShowcase`, `ProductsEcosystem`, the product
  detail page, the products list page) was updated to read
  `product.category.name` instead, since it's now a dereferenced object
  (`{ name, slug }`) rather than a string. `fallbacks.ts` synthesizes the
  same shape from `constants.ts`'s plain `category` strings (via a small
  `slugifyCategory()` helper), so the fallback path and Navbar dropdown
  work identically before any real Sanity content exists.

**Note**: this only changed Product's category — Experiment (Labs)
still uses a plain-string `category` field. Labs wasn't part of this
request, and a handful of experiments is unlikely to need the same
scaling treatment soon, but the same reference-taxonomy pattern could be
applied there later if it ever does.

## Fixed Bugs (chronological)

- **Footer's Services links were hardcoded to specific slugs.** Same root
  cause as the earlier Navbar issue: `Footer.tsx`'s "Services" column
  linked to three fixed slugs (`web-development`, `ai-machine-learning`,
  `mobile-development`) baked into the component, not derived from real
  content. Once real Services existed in Sanity with different
  names/slugs, `/services` showed the real list while the footer kept
  linking to services that no longer appeared there at all — a confusing
  "link exists but the destination has vanished from the actual listing"
  inconsistency. Fixed by fetching the same `SERVICE_LIST_QUERY` (with the
  same `fallbackServices()` fallback) once in `(site)/layout.tsx` and
  passing the top 3 as a `services` prop to `<Footer>`, so the footer and
  `/services` can never drift apart — they're reading from the same
  source.

- **Crash on null `category` reference.** Found via real-world testing:
  `product.category.name` crashed with `Cannot read properties of null`
  when a Product's `category` reference was unset or pointed at a
  deleted/missing `productCategory` document — GROQ's dereference syntax
  (`category->{...}`) returns `null` in that case, not an object with
  empty fields. Same root cause as the earlier "required array field
  missing" bug: `Rule.required()` only blocks *new* publishes through the
  Studio UI, it doesn't retroactively guarantee older documents (or ones
  edited mid-way, category not yet selected) have the field. Fixed by:
  changing `ProductDoc.category`'s type to explicitly allow `null`, and
  updating every render site (`ProductsEcosystem`, `ExploreShowcase`, the
  product detail page, the products list page) to fall back to the label
  "Uncategorized" via `p.category?.name ?? "Uncategorized"` instead of
  assuming the reference always resolves. Verified the same way as the
  earlier crash: reproduced the exact `null` condition in a temporary test
  mutation, confirmed the crash, confirmed it was gone after the fix, then
  reverted the test mutation.

- **The "published" field shadowed Sanity's own Publish button.**
  Confirmed by real-world testing: a Solution created and published
  through the Studio's own Publish button (visible in the Studio as
  "Last published X sec. ago") still 404'd on the live site and didn't
  appear in `/solutions`. Root cause: several schemas (`service`,
  `solution`, `product`, `experiment`, and — under the name `published`
  but meaning something different — `caseStudy`) had a *custom* boolean
  field also named `published`, separate from Sanity's own draft/published
  document state. GROQ queries filtered on this custom field
  (`&& published == true`), but its `initialValue: true` doesn't reliably
  get set on every newly created document depending on whether the editor
  scrolls to and interacts with that part of the form — so a document
  could be genuinely published in Sanity's sense while still being
  invisible to the site.

  **Fixed at the root, not patched around**: the custom `published` field
  was removed entirely from `service`, `solution`, `product`, and
  `experiment` — the Sanity client already has `perspective: "published"`
  configured (see `client.ts`), which excludes drafts at the API level on
  its own, making the custom field redundant *and* the source of this bug.
  Every affected GROQ query, TypeScript type, and fallback adapter was
  updated to match. Case Study's field was a distinct, legitimate concept
  in disguise (client sign-off to publish a case study publicly, not
  content readiness) — renamed to `clientApproved` (defaulting to `false`,
  an explicit opt-in) rather than removed, so that real intent survives
  without the confusing name collision.

  **What this means for existing content**: any Service/Solution/Product/
  Experiment document already published in Sanity (like the
  "AI-Powered Business Automation" Solution from testing) should now
  appear on the site automatically after this fix — it no longer depends
  on that separate field at all. Any Case Study documents created before
  this fix will need `clientApproved` explicitly turned on once, since it
  now defaults to `false`.
- **Crash on missing "required" array fields with real Sanity data.**
  Found via real-world testing (not by us): publishing an actual Product
  in the Studio without every array field populated (`technologies`, in
  the reported case) crashed `ProductStack` with
  `Cannot read properties of undefined (reading '0')`. Schema-level
  `Rule.required().min(1)` only blocks *new* publishes through the Studio
  UI — it doesn't retroactively guarantee that field is present when
  reading a document back, whether because of legacy data, a Studio quirk
  around draft/publish state, or content written directly via API. Every
  page that maps over a Sanity-sourced array field
  (`howItWorks`, `features`, `technologies`, `useCases`, `roadmap`,
  `problems`, `process`, `deliverables`, `outcomes`, `approach`,
  `responsibilities`, `requirements`) across all 6 content types now
  normalizes with `?? []` once near the top of the component instead of
  accessing the field directly in JSX — verified by temporarily
  reproducing the exact crash condition (a fallback product with
  `technologies: undefined`), confirming the crash, then confirming it
  was gone after the fix, then reverting the test mutation. `images`
  being entirely missing was deliberately left unguarded, since Sanity's
  Studio-side validation should block publishing without any image at
  all — worth watching for if it ever recurs.
- **Async `params` (Next.js 16).** The `params` prop on dynamic route
  pages became a `Promise` rather than a plain object. All six `[slug]`
  pages read `params.slug` synchronously, which silently resolved to
  `undefined` and made `notFound()` fire on *every* detail page —
  including valid ones — while still returning HTTP 200. Invisible to
  status-code-only smoke tests; only caught by checking actual page
  content (wrong title, stray `noindex` meta, missing body). Fixed by
  making `generateMetadata` and each page component `async` and
  `await`-ing `params`.
- **`ProductsEcosystem` sizing bug.** Hardcoded every tile to
  `size="standard"`, ignoring the per-product `size` field already in
  `constants.ts`. Fixed (and since superseded by `ProductStack`, which
  reads `size` correctly by construction).
- **`ShowcaseTile` hover bug.** The hover-scale wrapper around each tile's
  media was empty — it scaled a div with no visible content, so hover
  zoom never actually happened. Fixed by wrapping `MediaFrame` itself in
  the scaling container.
- **Duplicate React key.** Navbar's "Work" dropdown had two items pointing
  to the same `/work` href, both keyed by `href`. Removed the redundant
  dropdown; scoped remaining dropdown item keys to their parent label as a
  safeguard.
- **Missing `.gitignore`.** An earlier zip export's exclude pattern
  (`-x "*.git*"`) accidentally matched and dropped `.gitignore` itself.
  Restored.
- **`/studio` inheriting the public site's layout.** See "Why the `(site)`
  folder appeared" above.

## Verified

- `npm run build` — passes. Static pages (`/`, `/about`, `/contact`,
  etc.) plus each list page prerender as static; every `[slug]` detail
  route (`services`, `solutions`, `products`, `work`, `labs`, `careers`)
  now builds as **Dynamic** (ƒ) per Phase 3.2's ISR approach rather than
  enumerating individual slugs via `generateStaticParams` — this is
  expected, not a regression (see "Phase 3.2: Live Sanity Data" above).
- `npx eslint .` — zero errors.
- **Content-level** production smoke testing (not just status codes):
  every dynamic detail page (`services`, `solutions`, `products`, `work`,
  `labs`, `careers`) renders its real title and body for valid slugs (200)
  and correctly 404s for invalid slugs.
- Full route regression re-run after the Sanity/route-group changes, with
  **zero environment variables set** — confirms the whole public site
  builds and serves normally without any Sanity setup, and `/studio`
  fails with a clear, actionable error rather than silently.
- Confirmed `/studio` no longer renders the public Navbar/Footer or site
  metadata after the `(site)` route-group fix (0 matches for site-only
  content on `/studio`, homepage unaffected).
- **Phase 3.2 regression sweep** (zero Sanity credentials configured, same
  as a fresh clone): all static pages 200; all 6 list pages 200 showing
  fallback content; all fallback-slug detail pages (e.g.
  `/products/veco-ai`, `/careers/frontend-developer`) 200 with correct
  content — confirming list-page tiles and detail pages resolve
  consistently; all fake slugs across all 6 content types 404; `/work`
  confirmed to show its honest empty state with zero fallback content;
  `/studio` fails with a clean error (500 + server-log detail) without
  crashing the rest of the site.
- **Phase 3.3 regression sweep**: confirmed the new private schemas
  compile and register cleanly (`npm run build` / `eslint` both pass with
  zero errors) and, critically, that adding them changed **nothing** on
  the public site — full route regression (all public pages + `/studio`)
  re-run and unaffected, exactly as expected since Phase 3.3 is
  schema/Studio-structure only with no frontend page changes.
- **Phase 3.4 API route testing** (no `SANITY_API_TOKEN` configured, since
  this sandbox has no network path to Sanity's API at all — see the note
  on that limitation in an earlier project decision): every route was
  tested directly with `curl`, confirming each piece of logic
  independently rather than trusting the code by inspection alone —
  - Valid payloads reach the Sanity write attempt and fail with a clean,
    generic `500` (proving the token-missing error is caught, not an
    unhandled crash) while the *real* error is logged server-side.
  - A filled honeypot field returns `200 { ok: true }` **without**
    reaching the Sanity write step at all (confirmed by the different
    status code vs. the valid-payload case above — if it had continued to
    the write attempt, it would have 500'd too).
  - Invalid payloads (bad email, missing required field, malformed JSON)
    all correctly return `400`.
  - Rate limiting confirmed with 6 rapid requests against a 5/minute
    limit: requests 1–5 proceed to the (expected) 500, request 6 is
    rejected with `429` before any validation or Sanity call runs.
  - The Applications route's CV validation tested directly: a non-PDF
    MIME type is rejected (`400`), an oversized (6MB against a 5MB limit)
    file is rejected (`400`), and a valid PDF-shaped submission proceeds
    through to the (expected, token-missing) Sanity write step.
  - Full public-site route regression re-run after all form changes —
    unaffected, as expected, since these changes only added new `/api/*`
    routes and modified the three form components' submit handlers.
- **Featured content + ProductStack hover fix**: `selectFeatured()`'s four
  logic branches (empty-collection fallback, mixed-featured filtering,
  none-featured-shows-real-data, and limit/capping) each verified in
  isolation with direct test calls before being wired into the three
  homepage components. Full public-site route regression re-run after —
  unaffected. `ProductStack`'s new hover classes confirmed present in the
  rendered homepage HTML.
- **Signature motion pass** (Preloader, Lenis, Stack cards, Home nav
  link): a real ESLint error (`react-hooks/set-state-in-effect`) was
  caught and deliberately resolved with a justified, documented override
  rather than restructured into a hydration-unsafe pattern — see
  `Preloader.tsx`'s inline comment. Confirmed `lenis.css`'s rules actually
  compile into the production CSS bundle (grepped the built `.next`
  output directly, not just trusted that the import "should" work).
  Confirmed the Preloader is correctly **absent** from the server-rendered
  HTML (0 matches for its counter text) — proving the SSR-safe
  `visible=false` default works as designed, not just assumed. Full
  public-site route regression (all static/dynamic pages, fake-slug 404s,
  `/studio` graceful-fail) re-run after and unaffected.
- **CV viewer component**: caught two real `@sanity/icons`/`@sanity/ui`
  API mismatches via `npm run build`'s type-check step (not assumed
  correct from memory/docs) — see the section above for both. Full
  public-site route regression re-run after adding the component —
  unaffected, as expected, since this change only touches the Studio
  bundle (`jobApplication.ts` + the new component file), not any public
  page. Honest limitation: this sandbox has no live Sanity connection, so
  the actual click-to-view-PDF behavior couldn't be exercised end-to-end
  here — verified as far as this environment allows (compiles cleanly,
  correct types, standard/well-established base64-to-data-URI technique)
  and should be manually confirmed once tested against a real submitted
  application.
- **CV viewer Blob URL fix**: this was a real bug caught by actual
  end-to-end testing (not something this sandbox could have caught on its
  own, since it has no live Sanity connection to click through) — the
  `data:` URI approach's browser-navigation restriction only shows up
  when genuinely clicking the button in a real browser against a real
  document. Fixed, then re-verified with the same build/lint/regression
  discipline as every other change: `npm run build` and `eslint` both
  clean, full public-site route regression re-run and unaffected.
