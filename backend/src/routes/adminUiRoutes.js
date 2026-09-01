const express = require("express");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("../utils/asyncHandler");
const { resources } = require("../resources/resourceConfig");
const genericModel = require("../models/genericModel");
const siteSettingsModel = require("../models/siteSettings");
const adminUserModel = require("../models/adminUser");
const { issueToken, setAuthCookie, clearAuthCookie, requireAdminUI } = require("../middleware/auth");
const { imageUpload, publicUrlFor, uploadRoot } = require("../middleware/upload");
const { slugify } = require("../utils/slugify");

const router = express.Router();

function resourceOr404(req, res, next) {
  const def = resources[req.params.resource];
  if (!def) {
    const err = new Error("Unknown resource");
    err.status = 404;
    return next(err);
  }
  req.resourceKey = req.params.resource;
  req.resourceDef = def;
  next();
}

// ---------------------------------------------------------------- auth ----
router.get("/login", (req, res) => {
  res.render("admin/login", { title: "Admin login", error: null, layout: false });
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await adminUserModel.findByEmail(email || "");
    const ok = user && (await adminUserModel.verifyPassword(user, password || ""));
    if (!ok) {
      return res.status(401).render("admin/login", { title: "Admin login", error: "Invalid email or password.", layout: false });
    }
    const token = issueToken(user);
    setAuthCookie(res, token);
    res.redirect("/admin");
  })
);

router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.redirect("/admin/login");
});

router.use(requireAdminUI);

// ------------------------------------------------------------- dashboard --
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const counts = {};
    for (const key of Object.keys(resources)) {
      counts[key] = await genericModel.count(key);
    }
    res.render("admin/dashboard", { title: "Dashboard", resources, counts });
  })
);

// ---------------------------------------------------------- media library -
router.get("/media", (req, res) => {
  const files = fs.existsSync(uploadRoot)
    ? fs.readdirSync(uploadRoot).filter((f) => !f.startsWith(".")).sort().reverse()
    : [];
  res.render("admin/media", { title: "Media library", files, uploaded: req.query.uploaded || null });
});

router.post(
  "/media/upload",
  imageUpload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.redirect("/admin/media");
    res.redirect(`/admin/media?uploaded=${encodeURIComponent(publicUrlFor(req.file.filename))}`);
  })
);

// --------------------------------------------------------- site settings --
router.get(
  "/site-settings",
  asyncHandler(async (req, res) => {
    const settings = await siteSettingsModel.get();
    res.render("admin/siteSettings", { title: "Site Settings", settings, error: null });
  })
);

router.post(
  "/site-settings",
  asyncHandler(async (req, res) => {
    await siteSettingsModel.update(req.body);
    res.redirect("/admin/site-settings");
  })
);

// ------------------------------------------------------------ generic CRUD
router.get(
  "/:resource",
  resourceOr404,
  asyncHandler(async (req, res) => {
    const rows = await genericModel.list(req.resourceKey);
    res.render("admin/list", { title: req.resourceDef.label, resourceKey: req.resourceKey, def: req.resourceDef, rows });
  })
);

router.get(
  "/:resource/new",
  resourceOr404,
  asyncHandler(async (req, res) => {
    if (req.resourceDef.private) return res.redirect(`/admin/${req.resourceKey}`);
    const refs = await loadReferenceOptions(req.resourceDef);
    res.render("admin/form", {
      title: `New ${req.resourceDef.singular}`,
      resourceKey: req.resourceKey,
      def: req.resourceDef,
      item: {},
      refs,
      error: null,
    });
  })
);

router.post(
  "/:resource",
  resourceOr404,
  imageUpload.any(),
  asyncHandler(async (req, res) => {
    if (req.resourceDef.private) return res.redirect(`/admin/${req.resourceKey}`);
    const payload = buildPayloadFromForm(req.resourceDef, req.body, req.files);
    try {
      const id = await genericModel.create(req.resourceKey, payload);
      res.redirect(`/admin/${req.resourceKey}/${id}/edit`);
    } catch (err) {
      const refs = await loadReferenceOptions(req.resourceDef);
      res.status(400).render("admin/form", {
        title: `New ${req.resourceDef.singular}`,
        resourceKey: req.resourceKey,
        def: req.resourceDef,
        item: req.body,
        refs,
        error: err.message,
      });
    }
  })
);

router.get(
  "/:resource/:id/edit",
  resourceOr404,
  asyncHandler(async (req, res, next) => {
    const item = await genericModel.getById(req.resourceKey, req.params.id);
    if (!item) return next(Object.assign(new Error("Not found"), { status: 404 }));
    const refs = await loadReferenceOptions(req.resourceDef);
    res.render("admin/form", {
      title: `Edit ${req.resourceDef.singular}`,
      resourceKey: req.resourceKey,
      def: req.resourceDef,
      item,
      refs,
      error: null,
    });
  })
);

router.post(
  "/:resource/:id",
  resourceOr404,
  imageUpload.any(),
  asyncHandler(async (req, res) => {
    const payload = buildPayloadFromForm(req.resourceDef, req.body, req.files);
    try {
      await genericModel.update(req.resourceKey, req.params.id, payload);
      res.redirect(`/admin/${req.resourceKey}/${req.params.id}/edit`);
    } catch (err) {
      const item = await genericModel.getById(req.resourceKey, req.params.id);
      const refs = await loadReferenceOptions(req.resourceDef);
      res.status(400).render("admin/form", {
        title: `Edit ${req.resourceDef.singular}`,
        resourceKey: req.resourceKey,
        def: req.resourceDef,
        item: { ...item, ...req.body },
        refs,
        error: err.message,
      });
    }
  })
);

router.post(
  "/:resource/:id/delete",
  resourceOr404,
  asyncHandler(async (req, res) => {
    if (req.resourceDef.private) return res.redirect(`/admin/${req.resourceKey}`);
    await genericModel.remove(req.resourceKey, req.params.id);
    res.redirect(`/admin/${req.resourceKey}`);
  })
);

// ------------------------------------------------------------- helpers ----
async function loadReferenceOptions(def) {
  const refs = {};
  for (const f of def.fields) {
    if ((f.type === "reference" || f.type === "multiref") && f.refResource) {
      refs[f.name] = await genericModel.list(f.refResource);
    }
  }
  return refs;
}

function buildPayloadFromForm(def, body, files = []) {
  const payload = {};
  for (const f of def.fields) {
    if (f.readOnly) continue;
    if (f.type === "slug") {
      const manual = body[f.name] && body[f.name].trim();
      payload[f.name] = manual ? slugify(body[f.name]) : slugify(body[def.slugSource] || "");
      continue;
    }
    if (f.type === "boolean") {
      payload[f.name] = body[f.name] === "on" || body[f.name] === "true";
      continue;
    }
    if (f.type === "multiref") {
      const raw = body[f.name];
      payload[f.name] = Array.isArray(raw) ? raw : raw ? [raw] : [];
      continue;
    }
    if (f.type === "image") {
      const uploaded = (files || []).find((file) => file.fieldname === `${f.name}_file`);
      payload[f.name] = uploaded ? publicUrlFor(uploaded.filename) : body[f.name]; // body[f.name] carries the hidden "keep current" value
      continue;
    }
    payload[f.name] = body[f.name];
  }
  return payload;
}

module.exports = router;
