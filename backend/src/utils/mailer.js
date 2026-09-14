const nodemailer = require("nodemailer");
const env = require("../config/env");

// Lazily created — many deployments (and local dev by default) never
// configure SMTP, and the site must keep working (forms still save to the
// database) even then. sendMail() no-ops with a console warning instead of
// throwing, the same graceful-degradation pattern the frontend's
// sanityFetch() uses for a missing/unreachable backend.
let transporter = null;
function getTransporter() {
  if (!env.smtp.host) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure, // true for port 465, false for 587/25 (STARTTLS)
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    });
  }
  return transporter;
}

// Minimal HTML-escaping for visitor-submitted text dropped into an email
// body — this is only ever emailed to our own inbox, but a name/message
// containing "<" or "&" shouldn't be able to mangle the HTML either way.
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

// Never throws — a mail failure must not take down the visitor-facing
// request that triggered it (their submission is already safely in the
// database by the time this is called).
async function sendMail({ to, subject, html, text, replyTo }) {
  const t = getTransporter();
  if (!t) {
    console.warn(`[mailer] SMTP not configured — skipped email "${subject}" to ${to}`);
    return { sent: false, skipped: true };
  }
  try {
    await t.sendMail({ from: env.smtp.from, to, subject, html, text, replyTo });
    return { sent: true };
  } catch (err) {
    console.error(`[mailer] failed to send "${subject}" to ${to}:`, err.message);
    return { sent: false, error: err.message };
  }
}

module.exports = { sendMail, escapeHtml };
