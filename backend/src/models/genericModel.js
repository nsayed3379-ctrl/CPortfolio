const { query } = require("../config/db");
const { resources } = require("../resources/resourceConfig");

const JSON_FIELD_TYPES = new Set(["json", "array"]);

function getResource(key) {
  const def = resources[key];
  if (!def) throw new Error(`Unknown resource: ${key}`);
  return def;
}

// Columns actually present in the `fields` config (excludes id/timestamps,
// which are managed by the DB itself).
function editableColumns(def) {
  return def.fields.map((f) => f.name);
}

// multiref fields (e.g. solutions.related_service_ids) are Postgres
// INTEGER[] columns, not JSONB — handled distinctly from json/array (JSONB).
function isMultiref(def, name) {
  const f = def.fields.find((x) => x.name === name);
  return f && f.type === "multiref";
}

function isJsonColumn(def, name) {
  const f = def.fields.find((x) => x.name === name);
  return f && JSON_FIELD_TYPES.has(f.type);
}

function serializeValue(def, name, value) {
  if (isJsonColumn(def, name)) {
    if (value === undefined || value === null || value === "") return JSON.stringify([]);
    if (typeof value === "string") {
      // Comes from a textarea (array = one item per line, json = raw JSON text)
      const f = def.fields.find((x) => x.name === name);
      if (f.type === "array") {
        const items = value.split("\n").map((s) => s.trim()).filter(Boolean);
        return JSON.stringify(items);
      }
      try {
        return JSON.stringify(JSON.parse(value));
      } catch (e) {
        throw new Error(`Field "${name}" must be valid JSON: ${e.message}`);
      }
    }
    return JSON.stringify(value);
  }
  if (isMultiref(def, name)) {
    if (Array.isArray(value)) return value.map(Number).filter((n) => !Number.isNaN(n));
    if (typeof value === "string" && value.trim()) {
      return value.split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
    }
    return [];
  }
  const f = def.fields.find((x) => x.name === name);
  if (f && f.type === "boolean") return value === true || value === "true" || value === "on" || value === "1";
  if (f && f.type === "number") return value === "" || value === undefined || value === null ? null : Number(value);
  if (f && (f.type === "date") && value === "") return null;
  if (f && f.type === "reference" && (value === "" || value === undefined)) return null;
  return value === undefined ? null : value;
}

async function list(resourceKey, { where = "", params = [], limit } = {}) {
  const def = getResource(resourceKey);
  const ts = def.timestamps === false ? [] : ["created_at", "updated_at"];
  const cols = ["id", ...editableColumns(def), ...ts].filter((c, i, a) => a.indexOf(c) === i);
  let sql = `SELECT ${cols.join(", ")} FROM ${def.table}`;
  if (where) sql += ` WHERE ${where}`;
  if (def.orderBy) sql += ` ORDER BY ${def.orderBy}`;
  if (limit) sql += ` LIMIT ${Number(limit)}`;
  const { rows } = await query(sql, params);
  return rows;
}

async function getById(resourceKey, id) {
  const def = getResource(resourceKey);
  const ts = def.timestamps === false ? [] : ["created_at", "updated_at"];
  const cols = ["id", ...editableColumns(def), ...ts].filter((c, i, a) => a.indexOf(c) === i);
  const sql = `SELECT ${cols.join(", ")} FROM ${def.table} WHERE id = $1 LIMIT 1`;
  const { rows } = await query(sql, [id]);
  return rows[0] || null;
}

async function getBySlug(resourceKey, slug) {
  const def = getResource(resourceKey);
  if (!def.slugField) throw new Error(`Resource ${resourceKey} has no slug field`);
  const ts = def.timestamps === false ? [] : ["created_at", "updated_at"];
  const cols = ["id", ...editableColumns(def), ...ts].filter((c, i, a) => a.indexOf(c) === i);
  const sql = `SELECT ${cols.join(", ")} FROM ${def.table} WHERE ${def.slugField} = $1 LIMIT 1`;
  const { rows } = await query(sql, [slug]);
  return rows[0] || null;
}

async function create(resourceKey, payload) {
  const def = getResource(resourceKey);
  const columns = editableColumns(def);
  const values = columns.map((c) => serializeValue(def, c, payload[c]));
  const placeholders = columns.map((_, i) => `$${i + 1}`);
  const sql = `INSERT INTO ${def.table} (${columns.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING id`;
  const { rows } = await query(sql, values);
  return rows[0].id;
}

async function update(resourceKey, id, payload) {
  const def = getResource(resourceKey);
  const columns = editableColumns(def).filter((c) => {
    const f = def.fields.find((x) => x.name === c);
    return !(f && f.readOnly && payload[c] === undefined); // allow admin to still overwrite editable non-readonly fields
  });
  const setClauses = [];
  const values = [];
  columns.forEach((c) => {
    const f = def.fields.find((x) => x.name === c);
    if (f && f.readOnly) return; // never mutate submitted visitor data from the edit form
    if (payload[c] === undefined) return;
    values.push(serializeValue(def, c, payload[c]));
    setClauses.push(`${c} = $${values.length}`);
  });
  if (setClauses.length === 0) return;
  values.push(id);
  const sql = `UPDATE ${def.table} SET ${setClauses.join(", ")} WHERE id = $${values.length}`;
  await query(sql, values);
}

async function remove(resourceKey, id) {
  const def = getResource(resourceKey);
  await query(`DELETE FROM ${def.table} WHERE id = $1`, [id]);
}

async function count(resourceKey, where = "", params = []) {
  const def = getResource(resourceKey);
  let sql = `SELECT count(*)::int AS n FROM ${def.table}`;
  if (where) sql += ` WHERE ${where}`;
  const { rows } = await query(sql, params);
  return rows[0].n;
}

module.exports = { getResource, list, getById, getBySlug, create, update, remove, count };
