const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const env = require("../config/env");

const uploadRoot = path.join(process.cwd(), env.uploadDir);
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadRoot),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    cb(null, name);
  },
});

const imageUpload = multer({
  storage,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.mimetype);
    cb(ok ? null : new Error("Only image files are allowed"), ok);
  },
});

const cvUpload = multer({
  storage,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype === "application/pdf";
    cb(ok ? null : new Error("CV must be a PDF file"), ok);
  },
});

function publicUrlFor(filename) {
  return `/uploads/${filename}`;
}

module.exports = { imageUpload, cvUpload, publicUrlFor, uploadRoot };
