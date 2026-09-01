require("dotenv").config();

function bool(v, fallback = false) {
  if (v === undefined) return fallback;
  return String(v).toLowerCase() === "true";
}

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  appUrl: process.env.APP_URL || "http://localhost:4000",
  corsOrigin: (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  databaseUrl: process.env.DATABASE_URL,
  pgSsl: bool(process.env.PGSSL, false),

  jwtSecret: process.env.JWT_SECRET || "insecure-dev-secret-change-me",
  sessionSecret: process.env.SESSION_SECRET || "insecure-dev-session-secret",

  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || "admin@vicosoft.com",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || "change-me-now",
  seedAdminName: process.env.SEED_ADMIN_NAME || "Vicosoft Admin",

  uploadDir: process.env.UPLOAD_DIR || "uploads",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 8),
};
