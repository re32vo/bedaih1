// Logger utility for better logging
export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatTime(): string {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  private formatLog(level: string, message: string, data?: any): string {
    const time = this.formatTime();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : "";
    return `[${time}] [${this.context}] [${level}] ${message}${dataStr}`;
  }

  info(message: string, data?: any) {
    console.log(this.formatLog("INFO", message, data));
  }

  warn(message: string, data?: any) {
    console.warn(this.formatLog("WARN", message, data));
  }

  error(message: string, error?: any) {
    const errorData = error instanceof Error ? error.message : error;
    console.error(this.formatLog("ERROR", message, errorData));
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatLog("DEBUG", message, data));
    }
  }
}

// Error handler middleware
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleError(error: any): AppError {
  const logger = new Logger("ErrorHandler");

  // Zod validation errors
  if (error.name === "ZodError") {
    const firstError = error.errors?.[0];
    logger.warn("Validation error", {
      field: firstError?.path?.join("."),
      message: firstError?.message,
    });
    return new AppError(
      firstError?.message || "Validation failed",
      400,
      error.errors
    );
  }

  // Network/timeout errors
  if (error.code === "ECONNREFUSED") {
    logger.error("Connection refused");
    return new AppError("Connection failed", 503);
  }

  if (error.code === "ETIMEDOUT") {
    logger.error("Request timeout");
    return new AppError("Request timeout", 504);
  }

  // Default error
  if (error instanceof AppError) {
    return error;
  }

  logger.error("Unexpected error", error);
  return new AppError(
    error?.message || "An unexpected error occurred",
    500
  );
}

// Environment validation
export function validateEnvironment() {
  const logger = new Logger("Environment");
  const required = ["PORT"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.warn("Optional environment variables not set:", missing);
  }

  logger.info("Environment validated successfully");
}
