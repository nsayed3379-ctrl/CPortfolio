const { Pool } = require("pg");
const env = require("./env");

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.pgSsl ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("[pg] unexpected idle client error", err);
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
