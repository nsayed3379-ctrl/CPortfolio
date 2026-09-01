/* Creates the first admin user (from .env) and, optionally, a little sample
 * content so the admin panel and public API aren't empty on first boot.
 * Safe to re-run — uses ON CONFLICT / existence checks throughout. */
const bcrypt = require("bcryptjs");
const { pool, query } = require("../config/db");
const env = require("../config/env");

async function seedAdmin() {
  const existing = await query("SELECT id FROM admin_users WHERE email = $1", [env.seedAdminEmail]);
  if (existing.rows.length > 0) {
    console.log(`Admin user ${env.seedAdminEmail} already exists, skipping.`);
    return;
  }
  const hash = await bcrypt.hash(env.seedAdminPassword, 12);
  await query(
    "INSERT INTO admin_users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')",
    [env.seedAdminName, env.seedAdminEmail, hash]
  );
  console.log(`✔ Created admin user: ${env.seedAdminEmail}`);
}

async function seedSampleContent() {
  const { rows } = await query("SELECT count(*)::int AS n FROM services");
  if (rows[0].n > 0) {
    console.log("Sample content already present, skipping.");
    return;
  }

  await query(
    `INSERT INTO services (name, slug, short_description, icon, problems, features, technologies, process, deliverables, display_order)
     VALUES
     ('Web Development','web-development','Modern, fast, and scalable web applications.','Code2',
      '["Slow legacy websites","No mobile support"]',
      '["Responsive design","SEO-friendly builds"]',
      '["Next.js","TypeScript","PostgreSQL"]',
      '[{"title":"Discover","description":"We learn your goals and users."},{"title":"Design","description":"We design the experience."}]',
      '["Production-ready codebase","Documentation"]', 1)`
  );

  await query(
    `INSERT INTO product_categories (name, slug, display_order) VALUES ('AI Platform','ai-platform',1)`
  );

  await query(
    `INSERT INTO faqs (question, answer, display_order) VALUES
     ('How do I get started?','Reach out through the contact form and we will schedule a call.',1)`
  );

  console.log("✔ Inserted sample services / product category / FAQ.");
}

async function main() {
  await seedAdmin();
  await seedSampleContent();
  await pool.end();
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
