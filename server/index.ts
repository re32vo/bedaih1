import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import rateLimit from "express-rate-limit";
import { Logger, AppError, handleError, validateEnvironment } from "./logger";

const logger = new Logger("Server");

// Validate environment
try {
  validateEnvironment();
} catch (error) {
  logger.error("Failed to start server", error);
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// CORS Configuration
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", corsOrigin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Security Headers
app.use((req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  next();
});

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: "طلبات كثيرة جداً من هذا العنوان، الرجاء المحاولة لاحقاً."
    });
  }
});

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 form submissions per hour
  message: "Too many form submissions, please try again later.",
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    res.status(429).json({
      message: "طلبات كثيرة جداً، الرجاء المحاولة بعد ساعة."
    });
  }
});

app.use("/api/", apiLimiter);
app.use("/api/contact", formLimiter);
app.use("/api/beneficiaries", formLimiter);
app.use("/api/jobs/apply", formLimiter);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

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

(async () => {
  try {
    await registerRoutes(httpServer, app);
    
    // Setup static/vite serving (SPA fallback)
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    // Error handling middleware (must be after routes)
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

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(port, () => {
      logger.info(`✅ Server running on port ${port}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server");
      httpServer.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Fatal error during server initialization", error);
    process.exit(1);
  }
})();
