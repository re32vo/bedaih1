/**
 * ملف المساعد الموحد للمسارات
 * يحتوي على دوال مشتركة لجميع المسارات
 */

import { Response } from 'express';
import { z } from 'zod';
import { ApiResponse, ApiError } from './types';

/**
 * معالج الأخطاء الموحد
 */
export function handleZodError(error: z.ZodError): ApiError {
  const firstError = error.errors[0];
  return new ApiError(
    firstError.message,
    'VALIDATION_ERROR',
    400,
    {
      field: firstError.path.join('.'),
      errors: error.errors,
    }
  );
}

/**
 * إرسال رد نجح
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    message: message || 'تم بنجاح',
    data,
  };
  return res.status(statusCode).json(response);
}

/**
 * إرسال رد خطأ
 */
export function sendError(
  res: Response,
  error: ApiError,
  message?: string
): Response {
  const statusCode = error.statusCode || 500;
  const response: ApiResponse = {
    success: false,
    message: message || error.message || 'حدث خطأ',
    error: error.code,
  };

  console.error(`[API Error ${statusCode}] ${response.message}`, {
    code: error.code,
    details: error.details,
  });

  return res.status(statusCode).json(response);
}

/**
 * تحويل خطأ إلى ApiError
 */
export function normalizeError(error: any): ApiError {
  if (error instanceof z.ZodError) {
    return handleZodError(error);
  }

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, undefined, 500);
  }

  return new ApiError('خطأ غير متوقع', undefined, 500);
}

/**
 * إنشء خطأ API مخصص
 */
export function createApiError(
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): ApiError {
  return new ApiError(
    message,
    code || `ERROR_${statusCode}`,
    statusCode,
    details
  );
}

/**
 * التحقق من الأذن
 */
export function checkPermission(
  userPermissions: string[] | undefined,
  requiredPermission: string,
  isPresident: boolean = false
): boolean {
  if (isPresident) return true;
  if (!userPermissions) return false;
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(requiredPermission);
}

/**
 * تسجيل العملية
 */
export function logOperation(
  action: string,
  actor: string,
  details?: Record<string, any>
): void {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    action,
    actor,
    ...(details && { details }),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`[OPERATION] ${action}`, logData);
  }
}
