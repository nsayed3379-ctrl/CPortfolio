const jwt = require("jsonwebtoken");
const env = require("../config/env");

const COOKIE_NAME = "vicosoft_admin_token";

function issueToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, name: user.name, role: user.role }, env.jwtSecret, {
    expiresIn: "12h",
  });
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    maxAge: 12 * 60 * 60 * 1000,
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

function getTokenFromReq(req) {
  if (req.cookies && req.cookies[COOKIE_NAME]) return req.cookies[COOKIE_NAME];
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

// For the server-rendered admin UI: redirects to /admin/login when unauthenticated.
function requireAdminUI(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) return res.redirect("/admin/login");
  try {
    req.admin = jwt.verify(token, env.jwtSecret);
    res.locals.admin = req.admin;
    return next();
  } catch (e) {
    clearAuthCookie(res);
    return res.redirect("/admin/login");
  }
}

// For the JSON admin API: returns 401 JSON when unauthenticated.
function requireAdminAPI(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    req.admin = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

module.exports = { COOKIE_NAME, issueToken, setAuthCookie, clearAuthCookie, requireAdminUI, requireAdminAPI };
