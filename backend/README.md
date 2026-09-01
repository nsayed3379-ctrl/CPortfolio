# Vicosoft Backend — Node.js + PostgreSQL

This replaces the old **Sanity.io** backend and Studio admin panel with a
self-hosted **Node.js (Express) + PostgreSQL** backend and a built-in admin
panel. It was generated from the original `vicosoft/sanity/schemaTypes/*`
and `vicosoft/src/sanity/*` files — every document type, field, and query
has a 1:1 equivalent here. It has been installed, migrated, seeded, and
smoke-tested (public API, admin login, create/edit, image upload, CV
upload, reference fields, and the case-study approval gate) before being
handed to you.

## What you get

- **PostgreSQL schema** (`src/db/schema.sql`) — one table per old Sanity
  document type, JSONB columns for the old "object" types (images,
  feature lists, tech groups, etc.), real foreign keys for real relations.
- **Public REST API** under `/api/...` — same data, same shapes, as the old
  GROQ queries in `src/sanity/queries.ts`.
- **Admin panel** under `/admin` — a server-rendered replacement for Sanity
  Studio: login, dashboard, list/create/edit/delete for every content
  type, a media library for image uploads, and a Site Settings editor.
- **Visitor-submitted forms** (contact, get-a-quote, job applications with
  CV upload) — private tables, never exposed on any public GET route,
  manageable only from the admin inbox — exactly like the old
  `contactMessage` / `projectInquiry` / `jobApplication` private Sanity
  types.

## 1. Requirements

- Node.js 18+
- PostgreSQL 14+ (a `docker-compose.yml` is included if you don't have one
  running locally)

## 2. Setup

```bash
cd vicosoft-backend
npm install

cp .env.example .env
# edit .env: set DATABASE_URL, JWT_SECRET, SESSION_SECRET, and the
# SEED_ADMIN_* values (your first admin login).

# option A — local Postgres via Docker
docker compose up -d

# option B — your own Postgres: just make sure DATABASE_URL in .env points to it

npm run migrate   # creates all tables (safe to re-run)
npm run seed      # creates your admin user + a little sample content

npm run dev        # or: npm start
```

Visit:
- Admin panel: **http://localhost:4000/admin** — log in with the
  `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` you set in `.env`.
- Public API: **http://localhost:4000/api/services** (etc.)

## 3. Content model — Sanity → Postgres mapping

| Old Sanity type   | Postgres table       | Notes |
|--------------------|----------------------|-------|
| `service`          | `services`           | |
| `solution`          | `solutions`          | `relatedServices` → `related_service_ids` (INTEGER[] FK to services) |
| `productCategory`   | `product_categories` | |
| `product`           | `products`           | `category` reference → `category_id` FK |
| `caseStudy`         | `case_studies`       | `clientApproved` gate preserved — public API only ever returns approved rows |
| `experiment`        | `experiments`        | |
| `job`                | `jobs`               | |
| `faq`                | `faqs`               | |
| `teamMember`         | `team_members`       | `photo` → `photo_url` (uploaded file, served from `/uploads`) |
| `siteSettings`       | `site_settings`      | singleton, always `id = 1` |
| `contactMessage`     | `contact_messages`   | private — visitor-submitted, admin-managed |
| `projectInquiry`     | `project_inquiries`  | private — visitor-submitted, admin-managed |
| `jobApplication`     | `job_applications`   | private — CV stored as an uploaded PDF file (`cv_url`) instead of base64, see schema.sql comment |

Nested Sanity **objects** (`mediaRef`, `projectImages`, `featureItem`,
`processStep`, `howItWorksStep`, `workStep`, `techGroup`) are stored as
**JSONB** columns with the same shape they had in GROQ query results (just
snake_case at the top level of each row). The admin panel edits these as
structured JSON in a textarea, with the expected shape shown as a hint —
this keeps the schema simple while still fully editable.

All content-model rules — one edit away — live in
`src/resources/resourceConfig.js`. That single file drives the admin
CRUD API, the admin panel forms, and the public API's field selection.
Add a field there (and a matching column in `schema.sql`) and it shows up
everywhere automatically.

## 4. Public API

```
GET  /api/services                       GET  /api/services/:slug
GET  /api/solutions                      GET  /api/solutions/:slug        (includes relatedServices[])
GET  /api/product-categories
GET  /api/products                       GET  /api/products/:slug         (includes category)
GET  /api/products/featured?limit=6
GET  /api/products/category/:categorySlug
GET  /api/case-studies                   GET  /api/case-studies/:slug     (client_approved only)
GET  /api/case-studies/featured?limit=6
GET  /api/experiments                    GET  /api/experiments/:slug
GET  /api/experiments/featured?limit=6
GET  /api/jobs                           GET  /api/jobs/:slug             (list = status=open only)
GET  /api/faqs
GET  /api/team-members
GET  /api/site-settings

POST /api/contact       { name, email, company?, subject, message }
POST /api/inquiry       { projectType, budget, timeline, description, name, email }
POST /api/applications  multipart/form-data: jobSlug or jobTitle, fullName, email, phone,
                         linkedin?, portfolio?, coverLetter, consent, cv (PDF file)
```

## 5. Connecting your existing Next.js frontend

The old frontend's `src/sanity/*.ts` files are the only place that need to
change — the React components (`MediaFrame`, `ShowcaseGrid`, page files,
etc.) already consume plain JS objects/arrays shaped like the query
results, so they don't need to change.

1. Delete/ignore `src/sanity/client.ts`, `env.ts`, `fetch.ts`, `image.ts`,
   `queries.ts`, `writeClient.ts`.
2. Add one small fetch helper, e.g. `src/lib/api.ts`:
   ```ts
   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
   export async function apiFetch<T>(path: string, revalidate = 3600): Promise<T | null> {
     try {
       const res = await fetch(`${API_URL}/api${path}`, { next: { revalidate } });
       if (!res.ok) return null;
       return res.json();
     } catch {
       return null;
     }
   }
   export async function apiFetchList<T>(path: string, revalidate = 3600): Promise<T[]> {
     return (await apiFetch<T[]>(path, revalidate)) ?? [];
   }
   ```
3. Replace each `sanityFetch(SOME_QUERY, ...)` call with the matching
   `apiFetch("/products/" + slug)` call from the table in section 4.
4. Image URLs are now plain strings (`/uploads/xyz.jpg` served by this
   backend) instead of Sanity asset refs — drop `urlFor()` and use
   `<img src={API_URL + product.images.thumbnail.imageUrl} />` (or a
   Next `<Image>` with that as `src` and `unoptimized` if you don't want
   to configure a remote pattern).
5. Point the three form routes (`/api/contact`, `get-a-quote`,
   `/careers/[slug]` apply form) at `${API_URL}/api/contact`,
   `${API_URL}/api/inquiry`, `${API_URL}/api/applications` instead of the
   Next.js API routes that were never built in the Sanity version.

## 6. Security notes for production

- Change `JWT_SECRET`, `SESSION_SECRET`, and the seed admin password —
  the `.env.example` defaults are for local dev only.
- Set `PGSSL=true` if your Postgres provider requires SSL (most managed
  providers do).
- Put this behind HTTPS (a reverse proxy like Nginx/Caddy, or your
  hosting provider's TLS) — the auth cookie is marked `secure` in
  production (`NODE_ENV=production`), so it will only be sent over HTTPS.
- `/uploads` is served as-is from local disk. For real production traffic,
  consider swapping `src/middleware/upload.js`'s disk storage for an S3 (or
  similar) storage engine — the rest of the app only ever deals with the
  resulting URL string, so this is a small, contained change.
- Add a second admin user (via `admin_users` table or a small script using
  `src/models/adminUser.js`'s `create()`), and remove/rotate the seeded one.

## 7. Scripts

```bash
npm run migrate   # apply schema.sql (idempotent)
npm run seed      # create admin user + tiny sample content (idempotent)
npm run dev        # start with nodemon
npm start           # start for production
```
