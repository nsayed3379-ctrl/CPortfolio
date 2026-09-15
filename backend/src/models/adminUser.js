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

async function setResetToken(id, tokenHash, expiresAt) {
  await query(
    "UPDATE admin_users SET reset_token_hash = $1, reset_token_expires = $2 WHERE id = $3",
    [tokenHash, expiresAt, id]
  );
}

// Only matches a token that hasn't expired yet — an expired row is treated
// exactly like no match, so the caller doesn't need a separate expiry check.
async function findByValidResetTokenHash(tokenHash) {
  const { rows } = await query(
    "SELECT * FROM admin_users WHERE reset_token_hash = $1 AND reset_token_expires > now()",
    [tokenHash]
  );
  return rows[0] || null;
}

// Clears the reset token in the same statement so it can't be reused —
// a password reset link is single-use.
async function resetPassword(id, password) {
  const hash = await bcrypt.hash(password, 12);
  await query(
    "UPDATE admin_users SET password_hash = $1, reset_token_hash = NULL, reset_token_expires = NULL WHERE id = $2",
    [hash, id]
  );
}

module.exports = {
  findByEmail, findById, verifyPassword, create,
  setResetToken, findByValidResetTokenHash, resetPassword,
};
