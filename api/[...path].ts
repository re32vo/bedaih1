import type { Express } from "express";
import { createApp } from "../server/app";

let cachedApp: Express | null = null;
let appInitPromise: Promise<Express> | null = null;

async function getApp(): Promise<Express> {
  if (cachedApp) {
    return cachedApp;
  }

  if (!appInitPromise) {
    appInitPromise = createApp({ serveClient: false }).then(({ app }) => {
      cachedApp = app;
      return app;
    });
  }

  return appInitPromise;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
  return app(req, res);
}
