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

  // Outbound email (contact/inquiry/application notifications). Any SMTP
  // provider works (Zoho Mail, Google Workspace, cPanel webmail, ...).
  // Leaving SMTP_HOST unset disables sending entirely — see src/utils/mailer.js;
  // forms still save to the database either way.
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: bool(process.env.SMTP_SECURE, false), // true for port 465, false for 587/25 (STARTTLS)
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.MAIL_FROM || "VecoSoft Website <no-reply@vecosoft.com>",
  },
  // Where each form's notification email is sent — separate per form so
  // e.g. job applications can go straight to a hiring inbox.
  notify: {
    contact: process.env.CONTACT_NOTIFY_EMAIL || "hello@vecosoft.com",
    inquiry: process.env.INQUIRY_NOTIFY_EMAIL || "hello@vecosoft.com",
    careers: process.env.CAREERS_NOTIFY_EMAIL || "careers@vecosoft.com",
  },
};
