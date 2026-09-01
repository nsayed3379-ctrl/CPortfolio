const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const ctrl = require("../controllers/publicController");
const { cvUpload } = require("../middleware/upload");

const router = express.Router();
const h = asyncHandler;

// ---- reads (mirrors src/sanity/queries.ts) ----
router.get("/services", h(ctrl.listServices));
router.get("/services/:slug", h(ctrl.getService));

router.get("/solutions", h(ctrl.listSolutions));
router.get("/solutions/:slug", h(ctrl.getSolution));

router.get("/product-categories", h(ctrl.listProductCategories));

router.get("/products", h(ctrl.listProducts));
router.get("/products/featured", h(ctrl.listFeaturedProducts));
router.get("/products/category/:categorySlug", h(ctrl.listProductsByCategory));
router.get("/products/:slug", h(ctrl.getProduct));

router.get("/case-studies", h(ctrl.listCaseStudies));
router.get("/case-studies/featured", h(ctrl.listFeaturedCaseStudies));
router.get("/case-studies/:slug", h(ctrl.getCaseStudy));

router.get("/experiments", h(ctrl.listExperiments));
router.get("/experiments/featured", h(ctrl.listFeaturedExperiments));
router.get("/experiments/:slug", h(ctrl.getExperiment));

router.get("/jobs", h(ctrl.listJobs));
router.get("/jobs/:slug", h(ctrl.getJob));

router.get("/faqs", h(ctrl.listFaqs));
router.get("/team-members", h(ctrl.listTeamMembers));
router.get("/site-settings", h(ctrl.getSiteSettings));

// ---- writes (replaces the planned /api/contact, /api/inquiry, /api/applications) ----
router.post("/contact", express.json(), h(ctrl.submitContact));
router.post("/inquiry", express.json(), h(ctrl.submitInquiry));
router.post("/applications", cvUpload.single("cv"), h(ctrl.submitApplication));

module.exports = router;
