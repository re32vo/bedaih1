import type { Express } from "express";

export const config = {
  runtime: "nodejs",
  maxDuration: 60,
  memory: 1024,
};

let cachedApp: Express | null = null;
let appInitPromise: Promise<Express> | null = null;
let lastInitTime = 0;
const CACHE_TTL = 60000; // 1 minute cache

async function getApp(): Promise<Express> {
  const now = Date.now();
  
  // Use cached app if still fresh
  if (cachedApp && (now - lastInitTime) < CACHE_TTL) {
    return cachedApp;
  }

  if (!appInitPromise) {
    appInitPromise = (async () => {
      try {
        console.log("[API] Loading app from compiled dist...");
        // In Vercel, try to import from the compiled dist directory first
        let createApp;
        try {
          // @ts-ignore - Importing compiled JavaScript from dist
          const module = await import("../dist/server/app.js");
          createApp = module.createApp;
          console.log("[API] Successfully loaded from dist/server/app.js");
        } catch (distError) {
          console.warn("[API] Failed to load from dist, using source:", distError);
          const module = await import("../server/app.ts");
          createApp = module.createApp;
        }
        
        const { app } = await createApp({ serveClient: false });
        console.log("[API] App created successfully");
        cachedApp = app;
        lastInitTime = Date.now();
        return app;
      } catch (importError) {
        console.error("[API] Failed to import createApp:", importError);
        throw new Error("Failed to load server module: " + String(importError));
      }
    })();
  }

  return appInitPromise;
}

export default async function handler(req: any, res: any) {
  try {
    console.log(`[API] Incoming ${req.method} request to ${req.url}`);
    const app = await getApp();
    return app(req, res);
  } catch (error: any) {
    console.error("[API] Handler error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error?.message || "تعذر تهيئة الخادم",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }
}
