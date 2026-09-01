const genericModel = require("../models/genericModel");
const siteSettingsModel = require("../models/siteSettings");
const { query } = require("../config/db");
const { publicUrlFor } = require("../middleware/upload");

function pick(row, columns) {
  const out = {};
  for (const c of columns) out[c] = row[c];
  return out;
}

// ------------------------------------------------------------------ services
async function listServices(req, res) {
  const rows = await genericModel.list("services");
  res.json(rows.map((r) => pick(r, ["id", "name", "slug", "short_description", "icon"])));
}
async function getService(req, res) {
  const row = await genericModel.getBySlug("services", req.params.slug);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
}

// ----------------------------------------------------------------- solutions
async function listSolutions(req, res) {
  const rows = await genericModel.list("solutions");
  res.json(rows.map((r) => pick(r, ["id", "name", "slug", "short_description"])));
}
async function getSolution(req, res) {
  const row = await genericModel.getBySlug("solutions", req.params.slug);
  if (!row) return res.status(404).json({ error: "Not found" });
  if (row.related_service_ids && row.related_service_ids.length) {
    const { rows } = await query(
      `SELECT id, name, slug, short_description FROM services WHERE id = ANY($1)`,
      [row.related_service_ids]
    );
    row.relatedServices = rows;
  } else {
    row.relatedServices = [];
  }
  res.json(row);
}

// ------------------------------------------------------------ product cats
async function listProductCategories(req, res) {
  const rows = await genericModel.list("product_categories");
  res.json(rows);
}

// -------------------------------------------------------------------- products
async function listProducts(req, res) {
  const rows = await genericModel.list("products");
  res.json(await attachCategory(rows));
}
async function listFeaturedProducts(req, res) {
  const rows = await genericModel.list("products", { where: "featured = true", limit: req.query.limit || 6 });
  res.json(await attachCategory(rows));
}
async function listProductsByCategory(req, res) {
  const cat = await genericModel.getBySlug("product_categories", req.params.categorySlug);
  if (!cat) return res.json([]);
  const rows = await genericModel.list("products", { where: "category_id = $1", params: [cat.id] });
  res.json(await attachCategory(rows));
}
async function getProduct(req, res) {
  const row = await genericModel.getBySlug("products", req.params.slug);
  if (!row) return res.status(404).json({ error: "Not found" });
  const [withCat] = await attachCategory([row]);
  res.json(withCat);
}
async function attachCategory(rows) {
  const ids = [...new Set(rows.map((r) => r.category_id).filter(Boolean))];
  let byId = {};
  if (ids.length) {
    const { rows: cats } = await query(`SELECT id, name, slug FROM product_categories WHERE id = ANY($1)`, [ids]);
    byId = Object.fromEntries(cats.map((c) => [c.id, c]));
  }
  return rows.map((r) => ({ ...r, category: byId[r.category_id] || null }));
}

// ---------------------------------------------------------------- case studies
async function listCaseStudies(req, res) {
  const rows = await genericModel.list("case_studies", { where: "client_approved = true" });
  res.json(rows);
}
async function listFeaturedCaseStudies(req, res) {
  const rows = await genericModel.list("case_studies", {
    where: "client_approved = true AND featured = true",
    limit: req.query.limit || 6,
  });
  res.json(rows);
}
async function getCaseStudy(req, res) {
  const row = await genericModel.getBySlug("case_studies", req.params.slug);
  if (!row || !row.client_approved) return res.status(404).json({ error: "Not found" });
  res.json(row);
}

// ------------------------------------------------------------------ experiments
async function listExperiments(req, res) {
  res.json(await genericModel.list("experiments"));
}
async function listFeaturedExperiments(req, res) {
  res.json(await genericModel.list("experiments", { where: "featured = true", limit: req.query.limit || 6 }));
}
async function getExperiment(req, res) {
  const row = await genericModel.getBySlug("experiments", req.params.slug);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
}

// ------------------------------------------------------------------------- jobs
async function listJobs(req, res) {
  res.json(await genericModel.list("jobs", { where: "status = 'open'" }));
}
async function getJob(req, res) {
  const row = await genericModel.getBySlug("jobs", req.params.slug);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
}

// ------------------------------------------------------------------------- faqs
async function listFaqs(req, res) {
  res.json(await genericModel.list("faqs"));
}

// ------------------------------------------------------------------ team members
async function listTeamMembers(req, res) {
  res.json(await genericModel.list("team_members"));
}

// ---------------------------------------------------------------- site settings
async function getSiteSettings(req, res) {
  res.json(await siteSettingsModel.get());
}

// ============================================================================
// Public WRITE endpoints — visitor-submitted forms (private tables, never
// readable through any GET route above).
// ============================================================================

async function submitContact(req, res) {
  const { name, email, company, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "name, email, subject and message are required." });
  }
  const { rows } = await query(
    `INSERT INTO contact_messages (name, email, company, subject, message) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [name, email, company || null, subject, message]
  );
  res.status(201).json({ ok: true, id: rows[0].id });
}

async function submitInquiry(req, res) {
  const { projectType, budget, timeline, description, name, email } = req.body;
  if (!projectType || !budget || !timeline || !description || !name || !email) {
    return res.status(400).json({ error: "projectType, budget, timeline, description, name and email are required." });
  }
  const { rows } = await query(
    `INSERT INTO project_inquiries (project_type, budget, timeline, description, name, email)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [projectType, budget, timeline, description, name, email]
  );
  res.status(201).json({ ok: true, id: rows[0].id });
}

async function submitApplication(req, res) {
  const { jobSlug, jobId: jobIdRaw, jobTitle, fullName, email, phone, linkedin, portfolio, coverLetter, consent } = req.body;
  if (!fullName || !email || !phone || !coverLetter || !req.file) {
    return res.status(400).json({ error: "fullName, email, phone, coverLetter and a PDF cv file are required." });
  }
  let jobId = null;
  let resolvedTitle = jobTitle;
  if (jobIdRaw && !Number.isNaN(Number(jobIdRaw))) {
    const job = await genericModel.getById("jobs", Number(jobIdRaw));
    if (job) {
      jobId = job.id;
      resolvedTitle = resolvedTitle || job.title;
    }
  } else if (jobSlug) {
    const job = await genericModel.getBySlug("jobs", jobSlug);
    if (job) {
      jobId = job.id;
      resolvedTitle = resolvedTitle || job.title;
    }
  }
  if (!resolvedTitle) return res.status(400).json({ error: "jobTitle (or a valid jobId/jobSlug) is required." });

  const cvUrl = publicUrlFor(req.file.filename);
  const { rows } = await query(
    `INSERT INTO job_applications
      (job_title, job_id, full_name, email, phone, linkedin, portfolio, cover_letter, cv_filename, cv_url, consent)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    [resolvedTitle, jobId, fullName, email, phone, linkedin || null, portfolio || null, coverLetter, req.file.originalname, cvUrl, consent === "true" || consent === true]
  );
  res.status(201).json({ ok: true, id: rows[0].id });
}

module.exports = {
  listServices, getService,
  listSolutions, getSolution,
  listProductCategories,
  listProducts, listFeaturedProducts, listProductsByCategory, getProduct,
  listCaseStudies, listFeaturedCaseStudies, getCaseStudy,
  listExperiments, listFeaturedExperiments, getExperiment,
  listJobs, getJob,
  listFaqs,
  listTeamMembers,
  getSiteSettings,
  submitContact, submitInquiry, submitApplication,
};
