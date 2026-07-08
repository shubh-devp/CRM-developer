"use strict";

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");

const PORT = parseInt(process.env.PORT || "3000", 10);
const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const frontendOutPath = path.join(__dirname, "frontend", "out");

app.use(
  express.static(frontendOutPath, {
    maxAge: "1y",
    immutable: true,
  })
);

const backendApp = require("./backend/dist/app").default;
app.use(backendApp);

app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendOutPath, "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `[CSV Importer] Server running on port ${PORT} in ${process.env.NODE_ENV || "production"} mode`
  );
});

process.on("SIGTERM", () => {
  console.log("[CSV Importer] SIGTERM received, shutting down gracefully");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("[CSV Importer] SIGINT received, shutting down gracefully");
  server.close(() => process.exit(0));
});
