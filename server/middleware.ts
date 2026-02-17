/**
 * نظام محسّن لـ Middleware والـ Utilities
 * Enhanced Middleware and Utilities System
 */

import { Request, Response, NextFunction } from 'express';
import { appLogger } from './advanced-logger';
import { SecurityManager } from './security';
import { SessionManager } from './session';
import { activityMonitor, ActivityEventType, RiskLevel } from './activity-monitor';
import { sendError, sendSuccess, normalizeError } from './helpers';
import { ApiError } from './types';

const logger = appLogger;

/**
 * Middleware لتسجيل جميع الطلبات
 */
export function requestLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] as string || 
    `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  req.headers['x-request-id'] = requestId;

  // تسجيل الطلب
  logger.info(`[${req.method}] ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // قياس الوقت المستغرق
  const originalJson = res.json;
  res.json = function (data: any) {
    const duration = Date.now() - startTime;
    
    logger.logPerformance(`[${req.method}] ${req.path}`, duration, requestId);

    return originalJson.call(this, data);
  };

  next();
}

/**
 * Middleware لمعالجة الأخطاء العامة
 */
export function errorHandlingMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = req.ip || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const requestId = req.headers['x-request-id'] as string;

  logger.error(`Error in [${req.method}] ${req.path}`, err);

  // تحويل الخطأ إلى ApiError
  const apiError = normalizeError(err);

  // تسجيل النشاط المريب
  activityMonitor.logEvent(
    ActivityEventType.SUSPICIOUS_ACTIVITY,
    'system',
    ip,
    userAgent,
    false,
    {
      error: err.message,
      requestId,
      path: req.path,
    }
  );

  return sendError(res, apiError);
}

/**
 * Middleware للتحقق من صحة الجلسة
 */
export function sessionValidationMiddleware(
  sessionManager: SessionManager
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = 
        req.cookies?.sessionId || 
        req.headers['x-session-id'] as string;

      if (!sessionId) {
        const apiError = new ApiError('جلسة غير موجودة', 'NO_SESSION', 401);
        return sendError(res, apiError);
      }

      const session = sessionManager.getSession(sessionId);

      if (!session) {
        const apiError = new ApiError('جلسة منتهية', 'EXPIRED_SESSION', 401);
        return sendError(res, apiError);
      }

      // تحديث نشاط الجلسة
      sessionManager.updateActivity(sessionId);

      // إضافة بيانات الجلسة إلى الطلب
      (req as any).session = session;
      (req as any).sessionId = sessionId;

      next();
    } catch (error) {
      logger.error('Session validation error', error as any);
      const apiError = new ApiError('خطأ في التحقق من الجلسة', 'SESSION_ERROR', 500);
      return sendError(res, apiError);
    }
  };
}

/**
 * Middleware للتحقق من صلاحيات المستخدم
 */
export function authorizationMiddleware(requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const ip = req.ip || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      if (!user) {
        activityMonitor.logEvent(
          ActivityEventType.UNAUTHORIZED_ACCESS,
          'unknown',
          ip,
          userAgent,
          false,
          { path: req.path }
        );

        const apiError = new ApiError('غير مصرح', 'UNAUTHORIZED', 401);
        return sendError(res, apiError);
      }

      // التحقق من الصلاحيات
      const hasPermission = requiredPermissions.some((perm) =>
        user.permissions?.includes(perm) || 
        user.permissions?.includes('*')
      );

      if (!hasPermission) {
        activityMonitor.logEvent(
          ActivityEventType.UNAUTHORIZED_ACCESS,
          user.id || user.email,
          ip,
          userAgent,
          false,
          { 
            path: req.path,
            requiredPermissions,
            userPermissions: user.permissions
          }
        );

        const apiError = new ApiError('لا توجد صلاحيات كافية', 'FORBIDDEN', 403);
        return sendError(res, apiError);
      }

      next();
    } catch (error) {
      logger.error('Authorization error', error as any);
      const apiError = new ApiError('خطأ في التحقق من الصلاحيات', 'AUTH_ERROR', 500);
      return sendError(res, apiError);
    }
  };
}

/**
 * Middleware لتنقية البيانات المدخلة
 */
export function inputSanitizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // تنقية JSON body إذا موجود
    if (req.body && typeof req.body === 'object') {
      req.body = deepSanitize(req.body);
    }

    // ملاحظة: req.query هو read-only في Express
    // Query parameters آمنة لأنها تأتي من URL parsing بواسطة Express

    next();
  } catch (error) {
    logger.error('Input sanitization error', error as any);
    const apiError = new ApiError('خطأ في معالجة البيانات', 'SANITIZATION_ERROR', 400);
    return sendError(res, apiError);
  }
}

/**
 * Middleware لكشف محاولات الحقن والهجمات
 */
export function attackDetectionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ip = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // التحقق من محتوى الطلب
    const bodyString = JSON.stringify(req.body || {});
    const queryString = JSON.stringify(req.query || {});
    const fullContent = bodyString + queryString;

    // كشف نماذج XSS
    if (SecurityManager.hasDangerousPatterns(fullContent)) {
      activityMonitor.logEvent(
        ActivityEventType.XSS_ATTEMPT,
        'unknown',
        ip,
        userAgent,
        false,
        { path: req.path }
      );

      const apiError = new ApiError('محتوى غير آمن تم كشفه', 'XSS_DETECTED', 400);
      return sendError(res, apiError);
    }

    // كشف محاولات SQL Injection
    if (containsSqlInjectionPattern(fullContent)) {
      activityMonitor.logEvent(
        ActivityEventType.SQL_INJECTION_ATTEMPT,
        'unknown',
        ip,
        userAgent,
        false,
        { path: req.path }
      );

      const apiError = new ApiError('محاولة حقن SQL تم كشفها', 'SQL_INJECTION_DETECTED', 400);
      return sendError(res, apiError);
    }

    next();
  } catch (error) {
    logger.error('Attack detection error', error as any);
    next();
  }
}

/**
 * Middleware لقياس الأداء
 */
export function performanceMonitoringMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = process.hrtime.bigint();
  const requestId = req.headers['x-request-id'] as string;

  const originalJson = res.json;
  res.json = function (data: any) {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // تحويل إلى ميلي ثانية

    logger.logPerformance(`${req.method} ${req.path}`, Math.round(duration), requestId);

    return originalJson.call(this, data);
  };

  next();
}

/**
 * Middleware لتتبع محاولات تسجيل الدخول
 */
export function loginTrackingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.path === '/api/auth/verify-otp' || req.path === '/api/donors/verify-otp') {
    const originalJson = res.json;
    res.json = function (data: any) {
      const ip = req.ip || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      const email = req.body?.email || 'unknown';
      const success = res.statusCode === 200;

      activityMonitor.logLoginAttempt(
        email,
        ip,
        userAgent,
        success
      );

      return originalJson.call(this, data);
    };
  }

  next();
}

/**
 * دالة تنقية عميقة للبيانات
 */
function deepSanitize(data: any): any {
  if (typeof data === 'string') {
    return SecurityManager.sanitizeInput(data);
  }

  if (Array.isArray(data)) {
    return data.map((item) => deepSanitize(item));
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = deepSanitize(value);
    }
    return sanitized;
  }

  return data;
}

/**
 * التحقق من نمط SQL Injection
 */
function containsSqlInjectionPattern(data: string): boolean {
  const sqlPatterns = [
    /("\s*or\s*"?1\s*=\s*1|'?\s*or\s*'?1\s*=\s*1)/gi,
    /union\s+select/gi,
    /drop\s+table/gi,
    /exec\s*\(/gi,
    /execute\s*\(/gi,
  ];

  return sqlPatterns.some((pattern) => pattern.test(data));
}

/**
 * Middleware لإضافة رؤوس الأمان
 */
export function securityHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // منع XSS
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // سياسة الأمان - السماح بـ Google Fonts والـ inline scripts للتطوير
  const isDevelopment = process.env.NODE_ENV === 'development';
  const cspPolicy = isDevelopment
    ? "default-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
    : "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self'; style-src 'self' https://fonts.googleapis.com;";
  
  res.setHeader('Content-Security-Policy', cspPolicy);
  
  // منع التخزين المؤقت للبيانات الحساسة
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  next();
}

/**
 * Middleware لتتبع الطلبات البطيئة
 */
export function slowRequestDetectionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();

  const originalJson = res.json;
  res.json = function (data: any) {
    const duration = Date.now() - startTime;

    if (duration > 5000) {
      logger.warn(`Slow request detected: [${req.method}] ${req.path} (${duration}ms)`, {
        path: req.path,
        method: req.method,
        duration,
      } as any);
    }

    return originalJson.call(this, data);
  };

  next();
}
