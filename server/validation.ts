/**
 * نظام التحقق المتقدم من البيانات
 * Advanced Validation System
 */

import { z } from 'zod';
import { SecurityManager } from './security';

/**
 * مخطط تحقق محسّن
 */
export const EnhancedSchemas = {
  // البريد الإلكتروني
  email: z.string()
    .email('بريد إلكتروني غير صحيح')
    .toLowerCase()
    .max(254, 'البريد الإلكتروني طويل جداً')
    .refine((email) => SecurityManager.isValidEmail(email), 'بريد إلكتروني غير صحيح'),

  // الهاتف
  phone: z.string()
    .regex(/^[0-9\-\+\s]{9,15}$/, 'رقم الهاتف غير صحيح')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((phone) => SecurityManager.isValidPhone(phone), 'رقم الهاتف يجب أن يكون 9-15 أرقام'),

  // كلمة المرور
  password: z.string()
    .min(12, 'كلمة المرور يجب أن تكون 12 حرف على الأقل')
    .max(128, 'كلمة المرور طويلة جداً')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
    .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم')
    .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي على رمز خاص'),

  // رمز OTP
  otp: z.string()
    .length(6, 'رمز OTP يجب أن يكون 6 أرقام')
    .regex(/^[0-9]{6}$/, 'رمز OTP يجب أن يحتوي على أرقام فقط'),

  // الاسم
  name: z.string()
    .min(2, 'الاسم قصير جداً')
    .max(100, 'الاسم طويل جداً')
    .refine((name) => !SecurityManager.hasDangerousPatterns(name), 'الاسم يحتوي على محتوى غير آمن'),

  // الاسم العربي
  arabicName: z.string()
    .min(2, 'الاسم قصير جداً')
    .max(100, 'الاسم طويل جداً')
    .regex(/^[\u0600-\u06FF\s]+$/, 'الاسم يجب أن يحتوي على أحرف عربية فقط')
    .refine((name) => !SecurityManager.hasDangerousPatterns(name), 'الاسم يحتوي على محتوى غير آمن'),

  // معرف الهوية الوطنية
  nationalId: z.string()
    .length(10, 'رقم الهوية يجب أن يكون 10 أرقام')
    .regex(/^[0-9]{10}$/, 'رقم الهوية يجب أن يحتوي على أرقام فقط'),

  // العنوان
  address: z.string()
    .min(5, 'العنوان قصير جداً')
    .max(200, 'العنوان طويل جداً')
    .refine((addr) => !SecurityManager.hasDangerousPatterns(addr), 'العنوان يحتوي على محتوى غير آمن'),

  // معرف المورد
  resourceId: z.string()
    .regex(/^[a-zA-Z0-9_-]{1,50}$/, 'معرف المورد غير صحيح'),

  // التوكن/الرمز
  token: z.string()
    .min(32, 'الرمز قصير جداً')
    .max(256, 'الرمز طويل جداً')
    .regex(/^[a-zA-Z0-9_-]+$/, 'الرمز يحتوي على أحرف غير صحيحة'),

  // URL
  url: z.string()
    .url('عنوان الموقع غير صحيح')
    .max(2048, 'عنوان الموقع طويل جداً'),

  // نص عام
  text: z.string()
    .min(1, 'النص مطلوب')
    .max(5000, 'النص طويل جداً')
    .refine((text) => !SecurityManager.hasDangerousPatterns(text), 'النص يحتوي على محتوى غير آمن'),
};

/**
 * نتيجة التحقق
 */
export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

/**
 * أداة التحقق
 */
export class Validator {
  /**
   * التحقق من البيانات
   */
  static validate<T>(schema: z.ZodSchema, data: unknown): ValidationResult<T> {
    try {
      const validatedData = schema.parse(data);
      return {
        success: true,
        data: validatedData as T,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return {
          success: false,
          errors,
        };
      }

      return {
        success: false,
        errors: [{ field: 'unknown', message: 'خطأ غير متوقع في التحقق' }],
      };
    }
  }

  /**
   * التحقق الآمن من الطلب
   */
  static validateRequest<T>(
    schema: z.ZodSchema,
    data: any,
    sanitize: boolean = true
  ): ValidationResult<T> {
    // تنقية البيانات أولاً
    if (sanitize) {
      data = this.deepSanitize(data);
    }

    return this.validate<T>(schema, data);
  }

  /**
   * تنقية عميقة للبيانات
   */
  private static deepSanitize(data: any): any {
    if (typeof data === 'string') {
      return SecurityManager.sanitizeInput(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.deepSanitize(item));
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.deepSanitize(value);
      }
      return sanitized;
    }

    return data;
  }

  /**
   * التحقق من الهوية الوطنية
   */
  static validateNationalId(id: string): boolean {
    // تحقق بسيط - يمكن تحسينه
    return /^[0-9]{10}$/.test(id);
  }

  /**
   * التحقق من صلاحيات الدخول
   */
  static validatePermissions(permissions: any): string[] {
    if (!Array.isArray(permissions)) {
      return [];
    }

    const validPermissions = [
      'beneficiaries:view',
      'jobs:view',
      'contact:view',
      'volunteers:view',
      'analytics:view',
      'employees:add',
      'employees:remove',
      'employees:edit',
      'manage_donors',
      'audit:view',
    ];

    return permissions.filter((perm) => validPermissions.includes(perm));
  }

  /**
   * التحقق من نطاق التواريخ
   */
  static validateDateRange(startDate: string, endDate: string): boolean {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return start < end;
    } catch {
      return false;
    }
  }

  /**
   * التحقق من حجم الملف
   */
  static validateFileSize(sizeInBytes: number, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return sizeInBytes <= maxSizeBytes;
  }

  /**
   * التحقق من نوع الملف
   */
  static validateFileType(filename: string, allowedExtensions: string[]): boolean {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return allowedExtensions.includes(ext);
  }
}

/**
 * Middleware للتحقق
 */
export function createValidationMiddleware(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    const result = Validator.validateRequest(schema, req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'خطأ في التحقق من البيانات',
        errors: result.errors,
      });
    }

    req.validatedData = result.data;
    next();
  };
}

/**
 * أداة بناء مخططات التحقق
 */
export class SchemaBuilder {
  static createLoginSchema() {
    return z.object({
      email: EnhancedSchemas.email,
      password: z.string().min(1, 'كلمة المرور مطلوبة'),
    });
  }

  static createRegisterSchema() {
    return z.object({
      email: EnhancedSchemas.email,
      password: EnhancedSchemas.password,
      confirmPassword: z.string(),
      name: EnhancedSchemas.name,
    }).refine((data) => data.password === data.confirmPassword, {
      message: 'كلمات المرور غير متطابقة',
      path: ['confirmPassword'],
    });
  }

  static createUpdateProfileSchema() {
    return z.object({
      name: EnhancedSchemas.name.optional(),
      phone: EnhancedSchemas.phone.optional(),
      address: EnhancedSchemas.address.optional(),
    });
  }

  static createOTPSchema() {
    return z.object({
      email: EnhancedSchemas.email,
      code: EnhancedSchemas.otp,
    });
  }
}
