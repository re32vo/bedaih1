import "dotenv/config";
import express, { type Request, Response, NextFunction, type Express } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { Logger, handleError, validateEnvironment } from "./logger";

const logger = new Logger("Server");

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

function setupCors(app: Express) {
  const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  function isAllowedOrigin(origin: string): boolean {
    return corsOrigins.some((allowed) => {
      if (allowed === "*") return true;
      if (allowed.startsWith("*.")) {
        const suffix = allowed.slice(1);
        return origin.endsWith(suffix);
      }
      return allowed === origin;
    });
  }

  app.use((req, res, next) => {
    const requestOrigin = req.headers.origin;

    if (requestOrigin && isAllowedOrigin(requestOrigin)) {
      res.header("Access-Control-Allow-Origin", requestOrigin);
      res.header("Vary", "Origin");
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
}

function setupSecurityHeaders(app: Express) {
  app.use((req, res, next) => {
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");
    res.header("X-XSS-Protection", "1; mode=block");
    next();
  });
}

function setupRateLimits(app: Express) {
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        message: "طلبات كثيرة جداً من هذا العنوان، الرجاء المحاولة لاحقاً.",
      });
    },
  });

  // No rate limiting for form submissions - allow unlimited
  app.use("/api/", apiLimiter);
}

function setupBodyParsers(app: Express) {
  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

function setupRequestLogging(app: Express) {
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        log(logLine);
      }
    });

    next();
  });
}

function setupErrorHandler(app: Express) {
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const appError = handleError(err);
    const status = appError.statusCode || 500;
    const message = appError.message || "Internal Server Error";

    logger.error(`[${status}] ${message}`, appError.details);

    if (res.headersSent) {
      return;
    }

    return res.status(status).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && { details: appError.details }),
    });
  });
}

export async function createApp(options?: { serveClient?: boolean }): Promise<{ app: Express; httpServer: Server }> {
  validateEnvironment();

  const app = express();
  const httpServer = createServer(app);

  setupCors(app);
  setupSecurityHeaders(app);
  setupRateLimits(app);
  setupBodyParsers(app);
  setupRequestLogging(app);

  await registerRoutes(httpServer, app);

  if (options?.serveClient) {
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }
  }

  setupErrorHandler(app);

  return { app, httpServer };
}
