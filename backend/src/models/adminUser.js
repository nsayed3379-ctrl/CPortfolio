const bcrypt = require("bcryptjs");
const { query } = require("../config/db");

async function findByEmail(email) {
  const { rows } = await query("SELECT * FROM admin_users WHERE email = $1", [email]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await query("SELECT id, name, email, role FROM admin_users WHERE id = $1", [id]);
  return rows[0] || null;
}

async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password_hash);
}

async function create({ name, email, password, role = "admin" }) {
  const hash = await bcrypt.hash(password, 12);
  const { rows } = await query(
    "INSERT INTO admin_users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role",
    [name, email, hash, role]
  );
  return rows[0];
}

module.exports = { findByEmail, findById, verifyPassword, create };
