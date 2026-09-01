const { query } = require("../config/db");

const COLUMNS = [
  "company_name", "tagline", "email", "location", "social_links",
  "capabilities", "commitments", "why_vicosoft", "tech_stack_groups", "how_we_work", "seo",
];

async function get() {
  const { rows } = await query(`SELECT * FROM site_settings WHERE id = 1`);
  return rows[0];
}

function serialize(payload) {
  const jsonCols = new Set(["social_links", "commitments", "why_vicosoft", "tech_stack_groups", "how_we_work", "seo"]);
  const arrayCols = new Set(["capabilities"]);
  const out = {};
  for (const col of COLUMNS) {
    if (payload[col] === undefined) continue;
    let v = payload[col];
    if (arrayCols.has(col) && typeof v === "string") {
      v = v.split("\n").map((s) => s.trim()).filter(Boolean);
    }
    if (jsonCols.has(col) && typeof v === "string") {
      v = v.trim() === "" ? {} : JSON.parse(v);
    }
    out[col] = jsonCols.has(col) || arrayCols.has(col) ? JSON.stringify(v) : v;
  }
  return out;
}

async function update(payload) {
  const data = serialize(payload);
  const cols = Object.keys(data);
  if (cols.length === 0) return get();
  const setClauses = cols.map((c, i) => `${c} = $${i + 1}`);
  const values = cols.map((c) => data[c]);
  await query(`UPDATE site_settings SET ${setClauses.join(", ")} WHERE id = 1`, values);
  return get();
}

module.exports = { get, update, COLUMNS };
