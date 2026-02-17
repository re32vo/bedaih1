/**
 * ملف تحسين نظام الموارد الآمن
 * Security Enhancement Module
 */

import * as crypto from 'crypto';

export class SecurityManager {
  /**
   * تشفير البيانات الحساسة
   */
  static encryptData(data: string, encryptionKey?: string): string {
    try {
      const key = encryptionKey || process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key.slice(0, 32), 'hex'), iv);
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      console.error('[SecurityManager] Encryption error:', error);
      return data;
    }
  }

  /**
   * فك تشفير البيانات
   */
  static decryptData(encryptedData: string, encryptionKey?: string): string {
    try {
      const key = encryptionKey || process.env.ENCRYPTION_KEY || '';
      const [iv, authTag, encrypted] = encryptedData.split(':');
      
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(key.slice(0, 32), 'hex'),
        Buffer.from(iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('[SecurityManager] Decryption error:', error);
      return '';
    }
  }

  /**
   * تجزئة كلمات المرور (Password Hashing)
   */
  static hashPassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, crypto.randomBytes(16).toString('hex'), 100000, 64, 'sha512')
      .toString('hex');
  }

  /**
   * التحقق من كلمة المرور
   */
  static verifyPassword(password: string, hash: string): boolean {
    try {
      return crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(
          crypto
            .pbkdf2Sync(password, crypto.randomBytes(16).toString('hex'), 100000, 64, 'sha512')
            .toString('hex')
        )
      );
    } catch {
      return false;
    }
  }

  /**
   * توليد رمز عشوائي آمن
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * التحقق من صحة البريد الإلكتروني
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * التحقق من صحة الهاتف
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{9,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  /**
   * تنظيف المدخلات (Input Sanitization)
   */
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>\"'&]/g, (char) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;',
        };
        return entities[char] || char;
      });
  }

  /**
   * فحص الرموز الخطيرة
   */
  static hasDangerousPatterns(input: string): boolean {
    const dangerousPatterns = [
      /script/i,
      /javascript:/i,
      /on\w+=/i,
      /eval/i,
      /expression/i,
      /vbscript:/i,
      /data:text\/html/i,
    ];
    
    return dangerousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * التحقق من معدل الطلبات
   */
  static isRateLimited(
    key: string,
    limit: number = 100,
    windowMs: number = 15 * 60 * 1000
  ): boolean {
    // يجب تطبيقها مع Redis في المشروع الفعلي
    return false;
  }

  /**
   * محاولة إطالة الجلسة بأمان
   */
  static canExtendSession(lastActivity: number, maxInactivity: number = 30 * 60 * 1000): boolean {
    return Date.now() - lastActivity < maxInactivity;
  }
}

/**
 * إدارة الجلسات الآمنة
 */
export class SessionManager {
  private static sessions = new Map<string, {
    userId: string;
    createdAt: number;
    lastActivity: number;
    expiresAt: number;
    data: Record<string, any>;
  }>();

  static createSession(userId: string, expirationMinutes: number = 60): string {
    const sessionId = SecurityManager.generateSecureToken();
    const now = Date.now();
    
    this.sessions.set(sessionId, {
      userId,
      createdAt: now,
      lastActivity: now,
      expiresAt: now + expirationMinutes * 60 * 1000,
      data: {},
    });

    return sessionId;
  }

  static getSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      this.sessions.delete(sessionId);
      return null;
    }

    session.lastActivity = Date.now();
    return session;
  }

  static destroySession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  static updateSession(sessionId: string, data: Record<string, any>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.data = { ...session.data, ...data };
      session.lastActivity = Date.now();
    }
  }

  /**
   * تنظيف الجلسات المنتهية
   */
  static cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

/**
 * نموذج الاستجابة الآمن
 */
export interface SecureResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  requestId?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * منشئ الاستجابات الآمن
 */
export class ResponseBuilder {
  private requestId: string;

  constructor(requestId?: string) {
    this.requestId = requestId || SecurityManager.generateSecureToken(8);
  }

  success<T>(data: T, message: string = 'تم بنجاح', statusCode: number = 200): SecureResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
    };
  }

  error(message: string, statusCode: number = 400, errors?: Array<{ field: string; message: string }>): SecureResponse {
    return {
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
      errors,
    };
  }

  notFound(resource: string = 'المورد'): SecureResponse {
    return this.error(`${resource} غير موجود`, 404);
  }

  unauthorized(): SecureResponse {
    return this.error('غير مصرح - يجب تسجيل الدخول أولاً', 401);
  }

  forbidden(): SecureResponse {
    return this.error('ممنوع - ليس لديك صلاحية', 403);
  }

  validationError(errors: Array<{ field: string; message: string }>): SecureResponse {
    return this.error('خطأ في التحقق من البيانات', 400, errors);
  }
}

/**
 * نموذج بيانات الموظف الآمن
 */
export interface SecureEmployeeData {
  id: string;
  email: string;
  name: string;
  role: 'president' | 'employee' | 'admin';
  permissions: string[];
  active: boolean;
  lastLogin?: string;
  createdAt: string;
  // لا تشمل البيانات الحساسة مثل كلمات المرور
}

export function sanitizeEmployeeData(employee: any): SecureEmployeeData {
  return {
    id: employee.id,
    email: employee.email,
    name: employee.name,
    role: employee.role || 'employee',
    permissions: Array.isArray(employee.permissions) ? employee.permissions : [],
    active: Boolean(employee.active),
    lastLogin: employee.last_login_at,
    createdAt: employee.created_at,
  };
}
