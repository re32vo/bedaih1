/**
 * نظام التسجيل المتقدم
 * Advanced Logging System
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: any;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  requestId?: string;
  duration?: number; // بالميلي ثانية
}

/**
 * Logger محسّن مع دعم المستويات والسياق
 */
export class AdvancedLogger {
  private context: string;
  private isDevelopment: boolean;
  private logHistory: LogEntry[] = [];
  private maxHistorySize: number = 1000;

  constructor(context: string) {
    this.context = context;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    error?: Error,
    requestId?: string,
    duration?: number
  ): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      context: this.context,
      message,
      data,
      error: error ? {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        code: (error as any).code,
      } : undefined,
      requestId,
      duration,
    };
  }

  private storeLogEntry(entry: LogEntry): void {
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  private formatConsoleOutput(entry: LogEntry): string {
    const { timestamp, level, context, message } = entry;
    const badge = this.getLevelBadge(level);
    return `${badge} [${timestamp}] [${context}] ${message}`;
  }

  private getLevelBadge(level: LogLevel): string {
    const badges: Record<LogLevel, string> = {
      DEBUG: '🔍',
      INFO: 'ℹ️',
      WARN: '⚠️',
      ERROR: '❌',
      FATAL: '🔴',
    };
    return badges[level] || '';
  }

  debug(message: string, data?: any, requestId?: string): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, data, undefined, requestId);
    this.storeLogEntry(entry);

    if (this.isDevelopment) {
      console.log(this.formatConsoleOutput(entry), data || '');
    }
  }

  info(message: string, data?: any, requestId?: string): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, data, undefined, requestId);
    this.storeLogEntry(entry);

    console.info(this.formatConsoleOutput(entry), data || '');
  }

  warn(message: string, data?: any, requestId?: string): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, data, undefined, requestId);
    this.storeLogEntry(entry);

    console.warn(this.formatConsoleOutput(entry), data || '');
  }

  error(message: string, error?: Error | any, data?: any, requestId?: string): void {
    const actualError = error instanceof Error ? error : new Error(String(error));
    const entry = this.createLogEntry(LogLevel.ERROR, message, data, actualError, requestId);
    this.storeLogEntry(entry);

    console.error(this.formatConsoleOutput(entry), {
      error: actualError.message,
      ...(this.isDevelopment && { stack: actualError.stack }),
      ...data,
    });
  }

  fatal(message: string, error?: Error | any, data?: any): void {
    const actualError = error instanceof Error ? error : new Error(String(error));
    const entry = this.createLogEntry(LogLevel.FATAL, message, data, actualError);
    this.storeLogEntry(entry);

    console.error(this.formatConsoleOutput(entry), {
      error: actualError.message,
      stack: actualError.stack,
      ...data,
    });

    // في الإنتاج، يجب إرسال تنبيه
    if (!this.isDevelopment) {
      this.sendAlert(entry);
    }
  }

  /**
   * تسجيل محاولة الدخول
   */
  logAuthAttempt(email: string, success: boolean, requestId?: string): void {
    const message = success
      ? `✅ محاولة دخول ناجحة: ${email}`
      : `⚠️  محاولة دخول فاشلة: ${email}`;

    if (success) {
      this.info(message, { email }, requestId);
    } else {
      this.warn(message, { email }, requestId);
    }
  }

  /**
   * تسجيل العمليات
   */
  logOperation(action: string, actor: string, details?: any, requestId?: string): void {
    this.info(`🔄 عملية: ${action}`, { actor, details }, requestId);
  }

  /**
   * تسجيل الأداء
   */
  logPerformance(operation: string, duration: number, requestId?: string): void {
    const warningThreshold = 1000; // ميلي ثانية
    const level = duration > warningThreshold ? LogLevel.WARN : LogLevel.INFO;
    
    const entry = this.createLogEntry(
      level,
      `⏱️  أداء: ${operation}`,
      { duration: `${duration}ms` },
      undefined,
      requestId,
      duration
    );
    
    this.storeLogEntry(entry);

    const badge = this.getLevelBadge(level);
    const output = `${badge} ${operation}: ${duration}ms`;
    
    if (level === LogLevel.WARN) {
      console.warn(output);
    } else {
      console.log(output);
    }
  }

  /**
   * الحصول على سجل السجلات
   */
  getHistory(level?: LogLevel, limit: number = 100): LogEntry[] {
    let filtered = [...this.logHistory];

    if (level) {
      filtered = filtered.filter(entry => entry.level === level);
    }

    return filtered.slice(-limit);
  }

  /**
   * تنظيف السجل
   */
  clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * إرسال تنبيه المسؤول في حالة خطأ حرج
   */
  private sendAlert(entry: LogEntry): void {
    // يمكن تطبيق هذه الدالة بإرسال بريد أو SMS
    console.error('[ALERT] شيء حرج حدث في النظام:', entry);
  }

  /**
   * الحصول على إحصائيات
   */
  getStatistics() {
    const stats = {
      totalLogs: this.logHistory.length,
      byLevel: {
        DEBUG: 0,
        INFO: 0,
        WARN: 0,
        ERROR: 0,
        FATAL: 0,
      },
      lastLog: this.logHistory[this.logHistory.length - 1] || null,
    };

    for (const entry of this.logHistory) {
      stats.byLevel[entry.level]++;
    }

    return stats;
  }
}

/**
 * Logger عام للتطبيق
 */
export const appLogger = new AdvancedLogger('App');

/**
 * Middleware لتسجيل الطلبات
 */
export function createLoggingMiddleware() {
  return (req: any, res: any, next: any) => {
    const requestId = req.headers['x-request-id'] as string || generateRequestId();
    const startTime = Date.now();

    // حفظ معرف الطلب في الطلب
    req.requestId = requestId;

    // تسجيل الطلب الوارد
    if (req.path.startsWith('/api')) {
      appLogger.debug(`📥 طلب وارد: [${req.method}] ${req.path}`, { requestId });
    }

    // تسجيل الرد عند إرساله
    const originalJson = res.json.bind(res);
    res.json = function (data: any) {
      const duration = Date.now() - startTime;
      const status = res.statusCode;

      if (req.path.startsWith('/api')) {
        if (status >= 400) {
          appLogger.warn(`📤 رد خطأ: [${status}] [${req.method}] ${req.path}`, { duration, requestId });
        } else {
          appLogger.debug(`📤 رد: [${status}] [${req.method}] ${req.path}`, { duration, requestId });
        }
      }

      return originalJson(data);
    };

    next();
  };
}

/**
 * توليد معرف الطلب
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * قائمة مستويات السجلات
 */
export function getLogLevelColor(level: LogLevel): string {
  const colors: Record<LogLevel, string> = {
    DEBUG: '\x1b[36m', // Cyan
    INFO: '\x1b[32m',  // Green
    WARN: '\x1b[33m',  // Yellow
    ERROR: '\x1b[31m', // Red
    FATAL: '\x1b[35m', // Magenta
  };
  return colors[level] || '';
}

const reset = '\x1b[0m';

/**
 * طباعة سجل ملون
 */
export function printColoredLog(entry: LogEntry): void {
  const color = getLogLevelColor(entry.level);
  console.log(
    `${color}[${entry.timestamp}] [${entry.level}] [${entry.context}] ${entry.message}${reset}`,
    entry.data || ''
  );
}
