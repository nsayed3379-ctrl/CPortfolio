module.exports = function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  if (req.path.startsWith("/admin") && !req.path.startsWith("/admin/api")) {
    return res.status(status).render("admin/error", { title: "Error", message, layout: false });
  }
  return res.status(status).json({ error: message });
};
