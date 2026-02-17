/**
 * نظام إدارة الجلسات الآمنة والموثوقة
 * Secure Session Management System
 */

import * as crypto from 'crypto';
import { SecurityManager } from './security';

/**
 * واجهة بيانات الجلسة
 */
export interface SessionData {
  userId: string;
  sessionId: string;
  fingerprint: string;
  createdAt: number;
  expiresAt: number;
  lastActivity: number;
  ipAddress: string;
  userAgent: string;
  deviceId?: string;
  metadata?: Record<string, any>;
}

/**
 * واجهة معلومات الجلسة النشطة
 */
export interface ActiveSession extends SessionData {
  isValid: boolean;
  isExpired: boolean;
  remainingTime: number;
  activityDuration: number;
}

/**
 * مدير الجلسات الآمن
 */
export class SessionManager {
  private sessions: Map<string, SessionData> = new Map();
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 ساعة
  private readonly ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 دقيقة
  private readonly MAX_CONCURRENT_SESSIONS = 3;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // بدء تنظيف الجلسات المنتهية كل 5 دقائق
    this.startCleanupTask();
  }

  /**
   * إنشاء جلسة جديدة
   */
  createSession(
    userId: string,
    ipAddress: string,
    userAgent: string,
    deviceId?: string,
    metadata?: Record<string, any>
  ): SessionData {
    // التحقق من عدد الجلسات النشطة
    const userSessions = Array.from(this.sessions.values()).filter(
      (s) => s.userId === userId && !this.isSessionExpired(s)
    );

    // إغلاق أقدم الجلسات إذا كان هناك أكثر من MAX_CONCURRENT_SESSIONS
    if (userSessions.length >= this.MAX_CONCURRENT_SESSIONS) {
      const oldestSession = userSessions.sort(
        (a, b) => a.lastActivity - b.lastActivity
      )[0];
      this.destroySession(oldestSession.sessionId);
    }

    const sessionId = this.generateSessionId();
    const now = Date.now();

    const session: SessionData = {
      userId,
      sessionId,
      fingerprint: this.generateFingerprint(userId, ipAddress, userAgent),
      createdAt: now,
      expiresAt: now + this.SESSION_TIMEOUT,
      lastActivity: now,
      ipAddress,
      userAgent,
      deviceId,
      metadata,
    };

    this.sessions.set(sessionId, session);

    return session;
  }

  /**
   * الحصول على بيانات الجلسة
   */
  getSession(sessionId: string): ActiveSession | null {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    if (this.isSessionExpired(session)) {
      this.destroySession(sessionId);
      return null;
    }

    const now = Date.now();
    return {
      ...session,
      isValid: true,
      isExpired: false,
      remainingTime: Math.max(0, session.expiresAt - now),
      activityDuration: now - session.lastActivity,
    };
  }

  /**
   * التحقق من صحة الجلسة
   */
  validateSession(
    sessionId: string,
    expectedFingerprint: string,
    expectedIpAddress?: string
  ): boolean {
    const session = this.getSession(sessionId);

    if (!session) {
      return false;
    }

    // التحقق من البصمة
    if (session.fingerprint !== expectedFingerprint) {
      console.warn(`⚠️ تحذير: عدم تطابق بصمة الجلسة للمستخدم ${session.userId}`);
      this.destroySession(sessionId);
      return false;
    }

    // التحقق من عنوان IP (اختياري)
    if (expectedIpAddress && session.ipAddress !== expectedIpAddress) {
      console.warn(`⚠️ تحذير: تغيير عنوان IP للمستخدم ${session.userId}`);
      // لا نحذف الجلسة فوراً لأن IP قد يتغير بسبب تغيير الشبكة
    }

    // التحقق من انتهاء الجلسة بسبب الخمول
    const activityDuration = Date.now() - session.lastActivity;
    if (activityDuration > this.ACTIVITY_TIMEOUT) {
      this.destroySession(sessionId);
      return false;
    }

    return true;
  }

  /**
   * تحديث نشاط الجلسة
   */
  updateActivity(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return false;
    }

    if (this.isSessionExpired(session)) {
      this.destroySession(sessionId);
      return false;
    }

    session.lastActivity = Date.now();
    return true;
  }

  /**
   * تحديث بيانات الجلسة الإضافية
   */
  updateMetadata(sessionId: string, metadata: Record<string, any>): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return false;
    }

    session.metadata = {
      ...session.metadata,
      ...metadata,
    };

    return true;
  }

  /**
   * محو الجلسة
   */
  destroySession(sessionId: string): boolean {
    if (this.sessions.has(sessionId)) {
      const session = this.sessions.get(sessionId);
      console.log(
        `🔐 تم محو الجلسة: ${sessionId} للمستخدم ${session?.userId}`
      );
      return this.sessions.delete(sessionId);
    }

    return false;
  }

  /**
   * محو جميع جلسات المستخدم
   */
  destroyUserSessions(userId: string): number {
    let count = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(sessionId);
        count++;
      }
    }

    console.log(`🔐 تم محو ${count} جلسات للمستخدم ${userId}`);
    return count;
  }

  /**
   * الحصول على جميع جلسات المستخدم النشطة
   */
  getUserSessions(userId: string): ActiveSession[] {
    const sessions: ActiveSession[] = [];
    const now = Date.now();

    for (const session of this.sessions.values()) {
      if (session.userId === userId && !this.isSessionExpired(session)) {
        sessions.push({
          ...session,
          isValid: true,
          isExpired: false,
          remainingTime: Math.max(0, session.expiresAt - now),
          activityDuration: now - session.lastActivity,
        });
      }
    }

    return sessions;
  }

  /**
   * الحصول على إحصائيات الجلسات
   */
  getStatistics(): {
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
    averageSessionTime: number;
    uniqueUsers: number;
  } {
    const now = Date.now();
    const sessions = Array.from(this.sessions.values());

    const activeSessions = sessions.filter((s) => !this.isSessionExpired(s));
    const expiredSessions = sessions.filter((s) => this.isSessionExpired(s));

    const uniqueUsers = new Set(sessions.map((s) => s.userId)).size;
    const averageSessionTime =
      activeSessions.length > 0
        ? activeSessions.reduce(
            (sum, s) => sum + (now - s.createdAt),
            0
          ) / activeSessions.length
        : 0;

    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      expiredSessions: expiredSessions.length,
      averageSessionTime,
      uniqueUsers,
    };
  }

  /**
   * تنظيف الجلسات المنتهية
   */
  cleanup(): number {
    let count = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (this.isSessionExpired(session)) {
        this.sessions.delete(sessionId);
        count++;
      }
    }

    if (count > 0) {
      console.log(`🧹 تم تنظيف ${count} جلسات منتهية`);
    }

    return count;
  }

  /**
   * بدء مهمة التنظيف الدورية
   */
  private startCleanupTask(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // كل 5 دقائق

    console.log('✅ تم بدء مهمة تنظيف الجلسات الدورية');
  }

  /**
   * إيقاف مهمة التنظيف
   */
  stopCleanupTask(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('⛔ تم إيقاف مهمة تنظيف الجلسات');
    }
  }

  /**
   * التحقق من انتهاء الجلسة
   */
  private isSessionExpired(session: SessionData): boolean {
    const now = Date.now();
    return now > session.expiresAt;
  }

  /**
   * توليد معرف الجلسة
   */
  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * توليد بصمة الجلسة
   */
  private generateFingerprint(
    userId: string,
    ipAddress: string,
    userAgent: string
  ): string {
    const data = `${userId}:${ipAddress}:${userAgent}`;
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }
}

/**
 * محفظة الجلسات العالمية
 */
export class SessionStore {
  private managers: Map<string, SessionManager> = new Map();
  private static instance: SessionStore;

  private constructor() {}

  static getInstance(): SessionStore {
    if (!SessionStore.instance) {
      SessionStore.instance = new SessionStore();
    }
    return SessionStore.instance;
  }

  /**
   * الحصول على مدير الجلسات
   */
  getManager(key: string = 'default'): SessionManager {
    if (!this.managers.has(key)) {
      this.managers.set(key, new SessionManager());
    }
    return this.managers.get(key)!;
  }

  /**
   * إنشاء مدير جلسات جديد
   */
  createManager(key: string): SessionManager {
    const manager = new SessionManager();
    this.managers.set(key, manager);
    return manager;
  }

  /**
   * حذف مدير الجلسات
   */
  deleteManager(key: string): boolean {
    const manager = this.managers.get(key);
    if (manager) {
      manager.stopCleanupTask();
      return this.managers.delete(key);
    }
    return false;
  }

  /**
   * الحصول على الإحصائيات الكاملة
   */
  getGlobalStatistics(): Record<string, any> {
    const stats: Record<string, any> = {};

    for (const [key, manager] of this.managers.entries()) {
      stats[key] = manager.getStatistics();
    }

    return stats;
  }
}

/**
 * تصدير مثيل مدير الجلسات الافتراضي
 */
export const sessionManager = SessionStore.getInstance().getManager('default');

/**
 * Middleware للتحقق من الجلسة
 */
export function sessionValidationMiddleware(req: any, res: any, next: any) {
  try {
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'جلسة غير موجودة',
      });
    }

    const session = sessionManager.getSession(sessionId);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'جلسة منتهية أو غير صحيحة',
      });
    }

    // تحديث نشاط الجلسة
    sessionManager.updateActivity(sessionId);

    // إضافة بيانات الجلسة إلى الطلب
    req.session = session;
    req.sessionId = sessionId;

    next();
  } catch (error) {
    console.error('❌ خطأ في التحقق من الجلسة:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في التحقق من الجلسة',
    });
  }
}
