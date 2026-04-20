import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

export function serveStatic(app: Express) {
  const distPath = path.resolve(MODULE_DIR, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // SPA fallback: return index.html for all non-API routes
  app.use((req, res, next) => {
    // Skip API routes and static assets
    if (req.path.startsWith('/api') || req.path.includes('.')) {
      return next();
    }
    // Send index.html for all other routes
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
