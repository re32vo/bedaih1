import type { Express } from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs20.x",
  maxDuration: 60,
};

let cachedApp: Express | null = null;
let appInitPromise: Promise<Express> | null = null;

async function getApp(): Promise<Express> {
  if (cachedApp) {
    return cachedApp;
  }

  if (!appInitPromise) {
    appInitPromise = (async () => {
      try {
        // In Vercel, try to import from the compiled dist directory first
        const { createApp } = await import("../dist/server/app.js").catch(async () => {
          // Fallback to source for development
          return await import("../server/app.js");
        });
        
        const { app } = await createApp({ serveClient: false });
        cachedApp = app;
        return app;
      } catch (importError) {
        console.error("Failed to import createApp:", importError);
        throw new Error("Failed to load server module: " + String(importError));
      }
    })();
  }

  return appInitPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error: any) {
    console.error("Vercel API handler initialization error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error?.message || "تعذر تهيئة الخادم",
      });
    }
  }
}
