# Vicosoft — Frontend + Backend Integration Guide

> Note: the frontend here is built on the `CPortfolio-main` codebase
> (the corrected upload) — functionally identical to the earlier version,
> just with updated branding ("VecoSoft"), a new 3D hero visual, and a
> `FEATURES` flag in `src/lib/constants.ts` that currently hides the
> Solutions/Products/Work sections site-wide until real content is ready
> (flip the flags back to `true` there once it is — nothing else needs to
> change). None of that affects the backend integration described below.

This zip contains **two separate projects, as siblings**:

```
vicosoft/
  backend/     ← Node.js + Express + PostgreSQL (was Sanity.io)
  frontend/    ← your existing Next.js site (was reading from Sanity)
```

## Do NOT put them in the same folder

They are two independent servers with two independent `package.json`s,
two independent `node_modules`, and they run on two different ports
(backend on `:4000`, frontend on `:3000`). Merging them into one folder
would mean one `npm install`/`npm run dev` trying to run both an Express
app and a Next.js app at once — that doesn't work, and it's not how any
real Next.js + separate-API-backend project is set up anyway.

Keeping them as siblings (optionally inside one git repo — that's fine,
that's just a monorepo, still two separate npm projects) is correct and
normal. In production they can even live on completely different
machines/hosts — the *only* thing that connects them is one URL
(`NEXT_PUBLIC_API_URL` in the frontend, pointing at wherever the backend
is deployed).

## What actually changed in the frontend

**Short answer: nothing you need to touch by hand — it's already done in
this zip.** For your own understanding, here's exactly what changed and
why, so you're not flying blind:

| File | What changed | Why |
|---|---|---|
| `src/sanity/env.ts` | Now exports `API_URL` (from `NEXT_PUBLIC_API_URL`) instead of a Sanity project ID/dataset | One env var now points at your backend instead of Sanity |
| `src/sanity/fetch.ts` | `sanityFetch` / `sanityFetchList` now call the backend's REST API instead of Sanity's GROQ endpoint | Same function names/signatures — **zero page files changed** |
| `src/sanity/queries.ts` | Each `..._QUERY` export is now `{ path, transform }` instead of a GROQ string — `transform` converts the backend's snake_case JSON into the exact same camelCase shapes your components already expect | Keeps every page (`services/page.tsx`, `products/[slug]/page.tsx`, etc.) importing and calling these exactly as before |
| `src/sanity/image.ts` | `urlFor(sanityImage)` → `mediaUrl(path)` — just prefixes `/uploads/xyz.jpg` with the backend's URL | The backend serves plain uploaded files, not a Sanity CDN |
| `src/sanity/types.ts` | `MediaRefDoc.image` (Sanity image object) → `MediaRefDoc.imageUrl` (plain string); same for `TeamMemberDoc.photo` → `photoUrl`, `seo.ogImage` → `seo.ogImageUrl` | Matches what the backend actually returns |
| `src/components/ui/MediaFrame.tsx`, `ShowcaseTile.tsx`, `TeamSection.tsx` | Updated to use `imageUrl`/`photoUrl` instead of the old Sanity image field | Small, mechanical follow-on from the type change above |
| `src/app/api/contact/route.ts`, `inquiry/route.ts`, `applications/route.ts` | Now `fetch()` the backend's `/api/contact` etc. instead of writing to Sanity with `writeClient` | Same validation, rate-limiting, and honeypot logic as before — only the storage target changed |
| `src/sanity/client.ts`, `writeClient.ts` | **Deleted** | No longer needed — nothing talks to Sanity anymore |

Every other file — every page, every non-image component, `constants.ts`,
`fallbacks.ts`, `productCategories.ts`, `siteSettings.ts` — is **byte-for-byte
unchanged**. This was verified with `npx tsc --noEmit` (zero errors) and a
full `npm run build` + `npm start`, checked against a running backend.

## Running both locally

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET, admin creds
npm run migrate
npm run seed
npm run dev                  # http://localhost:4000

# Terminal 2 — frontend
cd frontend
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev                  # http://localhost:3000
```

Open `http://localhost:4000/admin`, log in, add/edit some content — refresh
`http://localhost:3000` and you'll see it (subject to the 1-hour ISR cache
described below; for instant feedback during content edits, `npm run dev`
on the frontend fetches on every request rather than caching).

## How content updates reach the live site (ISR)

Pages fetch through `sanityFetch(...)`, which passes `next: { revalidate:
3600 }` to Next's `fetch` — same caching model as before, just pointed at
a different origin. That means:
- In **dev** (`npm run dev`): every request refetches, so admin panel
  edits show up on refresh immediately.
- In **production** (`next build && next start`): a page is cached for up
  to 1 hour, then silently revalidates in the background on the next
  visit. If you want changes to appear immediately after publishing from
  the admin panel, the clean way is to add a `revalidate` webhook: have
  the backend call `POST {frontend}/api/revalidate?tag=...&secret=...`
  after a create/update in `src/routes/adminUiRoutes.js`, and add that
  route to the frontend calling Next's `revalidateTag()`. Not required to
  ship, just a nice-to-have — until then, a manual redeploy or waiting out
  the hour both work fine.

## Deploying

- **Backend**: any Node host (Render, Railway, Fly.io, a VPS, etc.) with a
  managed Postgres add-on. Set the same `.env` vars as local, plus
  `PGSSL=true` if your Postgres provider requires SSL, and
  `CORS_ORIGIN=https://your-frontend-domain.com`.
- **Frontend**: deploy exactly as you would any Next.js app (Vercel, or
  wherever you were already planning to host it). Just set
  `NEXT_PUBLIC_API_URL` to the backend's public URL.
- They do not need to share a domain, a server, or a deploy pipeline —
  only that one env var connects them.

## Cleanup you can do later (optional, not required for anything to work)

The frontend still has the old Sanity Studio route (`src/app/studio`,
`sanity.config.ts`, `sanity/schemaTypes/*`) and the `sanity` /
`next-sanity` / `@sanity/*` packages sitting unused. Nothing reads from
them anymore, so they're safe to delete whenever you want a smaller
`node_modules` — just not required for the site to work correctly today.
