import "dotenv/config";
import { createApp } from "./app";
import { Logger } from "./logger";

const logger = new Logger("Server");

(async () => {
  try {
    const { httpServer } = await createApp({ serveClient: true });

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
