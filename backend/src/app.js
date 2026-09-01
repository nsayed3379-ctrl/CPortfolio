const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const env = require("./config/env");
const publicRoutes = require("./routes/publicRoutes");
const adminUiRoutes = require("./routes/adminUiRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false, // admin panel uses inline <script> for small UI helpers
  })
);
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.locals.resources = require("./resources/resourceConfig").resources;

app.use("/uploads", express.static(path.join(process.cwd(), env.uploadDir)));
app.use("/admin/assets", express.static(path.join(__dirname, "..", "public", "admin")));

app.get("/", (req, res) => {
  res.json({
    name: "Vicosoft API",
    status: "ok",
    docs: "See README.md — public content API under /api, admin panel under /admin",
  });
});

app.use("/api", publicRoutes);
app.use("/admin", adminUiRoutes);

app.use((req, res, next) => {
  next(Object.assign(new Error("Not found"), { status: 404 }));
});
app.use(errorHandler);

module.exports = app;
