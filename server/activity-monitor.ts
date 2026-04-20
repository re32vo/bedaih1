/**
 * نظام رصد الأنشطة المتقدم والكشف عن التهديدات
 * Advanced Activity Monitoring and Threat Detection
 */

/**
 * نوع حدث الأنشطة
 */
export enum ActivityEventType {
  // تسجيل الدخول والخروج
  LOGIN_ATTEMPT = 'LOGIN_ATTEMPT',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  TIMEOUT = 'TIMEOUT',

  // العمليات الحساسة
  OTP_SENT = 'OTP_SENT',
  OTP_VERIFIED = 'OTP_VERIFIED',
  OTP_FAILED = 'OTP_FAILED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET = 'PASSWORD_RESET',

  // عمليات قاعدة البيانات
  DATA_CREATED = 'DATA_CREATED',
  DATA_UPDATED = 'DATA_UPDATED',
  DATA_DELETED = 'DATA_DELETED',
  DATA_EXPORTED = 'DATA_EXPORTED',

  // عمليات إدارية
  USER_CREATED = 'USER_CREATED',
  USER_DELETED = 'USER_DELETED',
  USER_MODIFIED = 'USER_MODIFIED',
  PERMISSION_CHANGED = 'PERMISSION_CHANGED',

  // أنشطة مريبة
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
}

/**
 * مستوى خطورة النشاط
 */
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * سجل حدث النشاط
 */
export interface ActivityEvent {
  id: string;
  timestamp: number;
  eventType: ActivityEventType;
  userId: string;
  sessionId?: string;
  ipAddress: string;
  userAgent: string;
  riskLevel: RiskLevel;
  details?: Record<string, any>;
  duration?: number;
  success: boolean;
  metadata?: Record<string, any>;
}

/**
 * تقرير الأنشطة المريبة
 */
export interface ThreatReport {
  id: string;
  timestamp: number;
  userId: string;
  ipAddress: string;
  threatType: string;
  severity: RiskLevel;
  events: string[]; // معرفات الأحداث المرتبطة
  description: string;
  actions: string[];
  resolved: boolean;
}

/**
 * مراقب الأنشطة
 */
export class ActivityMonitor {
  private events: ActivityEvent[] = [];
  private threats: Map<string, ThreatReport> = new Map();
  private readonly MAX_EVENTS = 10000;
  private readonly FRAUD_THRESHOLD = 5; // عدد المحاولات الفاشلة قبل التنبيه

  // المعاملات الدقيقة
  private loginAttempts: Map<string, { timestamp: number; count: number }> =
    new Map();
  private failedOtpAttempts: Map<
    string,
    { timestamp: number; count: number; lastEmail?: string }
  > = new Map();
  private suspiciousPatterns: Map<string, { count: number; lastSeen: number }> =
    new Map();

  /**
   * تسجيل حدث نشاط
   */
  logEvent(
    eventType: ActivityEventType,
    userId: string,
    ipAddress: string,
    userAgent: string,
    success: boolean,
    details?: Record<string, any>,
    duration?: number
  ): ActivityEvent {
    const riskLevel = this.calculateRiskLevel(eventType, success, details);

    const event: ActivityEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      eventType,
      userId,
      ipAddress,
      userAgent,
      riskLevel,
      details,
      duration,
      success,
    };

    this.events.push(event);

    // الحفاظ على حد أقصى من الأحداث
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // الكشف عن التهديدات
    this.detectThreats(event);

    return event;
  }

  /**
   * تسجيل محاولة تسجيل دخول
   */
  logLoginAttempt(
    userId: string,
    ipAddress: string,
    userAgent: string,
    success: boolean
  ): ActivityEvent {
    // تتبع محاولات تسجيل الدخول الفاشلة
    if (!success) {
      const key = `${userId}:${ipAddress}`;
      const attempt = this.loginAttempts.get(key) || {
        timestamp: Date.now(),
        count: 0,
      };

      attempt.count++;
      attempt.timestamp = Date.now();
      this.loginAttempts.set(key, attempt);

      // تنبيه إذا تجاوز الحد المسموح
      if (attempt.count >= this.FRAUD_THRESHOLD) {
        console.warn(
          `🚨 تحذير: محاولات تسجيل دخول فاشلة متعددة من ${ipAddress}`
        );
      }
    }

    return this.logEvent(
      success ? ActivityEventType.LOGIN_SUCCESS : ActivityEventType.LOGIN_FAILURE,
      userId,
      ipAddress,
      userAgent,
      success,
      { method: 'email' }
    );
  }

  /**
   * تسجيل محاولة التحقق من OTP
   */
  logOtpAttempt(
    userId: string,
    email: string,
    ipAddress: string,
    userAgent: string,
    success: boolean
  ): ActivityEvent {
    if (!success) {
      const key = `${email}:${ipAddress}`;
      const attempt = this.failedOtpAttempts.get(key) || {
        timestamp: Date.now(),
        count: 0,
        lastEmail: email,
      };

      attempt.count++;
      attempt.timestamp = Date.now();
      this.failedOtpAttempts.set(key, attempt);

      if (attempt.count >= 5) {
        console.warn(
          `🚨 تحذير: محاولات OTP فاشلة متعددة للبريد ${email}`
        );
      }
    }

    return this.logEvent(
      success ? ActivityEventType.OTP_VERIFIED : ActivityEventType.OTP_FAILED,
      userId,
      ipAddress,
      userAgent,
      success,
      { email }
    );
  }

  /**
   * تسجيل عملية حساسة
   */
  logSensitiveOperation(
    userId: string,
    operation: string,
    ipAddress: string,
    userAgent: string,
    details?: Record<string, any>,
    duration?: number
  ): ActivityEvent {
    return this.logEvent(
      ActivityEventType.DATA_CREATED,
      userId,
      ipAddress,
      userAgent,
      true,
      { operation, ...details },
      duration
    );
  }

  /**
   * الحصول على أحداث المستخدم
   */
  getUserEvents(userId: string, limit: number = 100): ActivityEvent[] {
    return this.events
      .filter((e) => e.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * الحصول على أحداث عنوان IP
   */
  getIpEvents(ipAddress: string, limit: number = 100): ActivityEvent[] {
    return this.events
      .filter((e) => e.ipAddress === ipAddress)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * الحصول على الأحداث المريبة
   */
  getSuspiciousEvents(limit: number = 50): ActivityEvent[] {
    return this.events
      .filter((e) => e.riskLevel === RiskLevel.HIGH || e.riskLevel === RiskLevel.CRITICAL)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * الحصول على التقارير النشطة
   */
  getActiveThreatReports(): ThreatReport[] {
    return Array.from(this.threats.values()).filter((t) => !t.resolved);
  }

  /**
   * إغلاق تقرير التهديد
   */
  resolveThreat(threatId: string, actions: string[]): boolean {
    const threat = this.threats.get(threatId);
    if (threat) {
      threat.resolved = true;
      threat.actions = actions;
      return true;
    }
    return false;
  }

  /**
   * الكشف عن التهديدات
   */
  private detectThreats(event: ActivityEvent): void {
    // اكتشاف محاولات الاستخدام القاسي
    if (
      event.eventType === ActivityEventType.LOGIN_FAILURE ||
      event.eventType === ActivityEventType.OTP_FAILED
    ) {
      this.detectBruteForce(event);
    }

    // اكتشاف محاولات XSS
    if (
      event.details &&
      this.containsXssPattern(JSON.stringify(event.details))
    ) {
      this.createThreatReport(
        event,
        'XSS_ATTEMPT',
        RiskLevel.HIGH,
        'تم اكتشاف محاولة حقن XSS'
      );
    }

    // اكتشاف محاولات SQL Injection
    if (
      event.details &&
      this.containsSqlInjectionPattern(JSON.stringify(event.details))
    ) {
      this.createThreatReport(
        event,
        'SQL_INJECTION_ATTEMPT',
        RiskLevel.CRITICAL,
        'تم اكتشاف محاولة SQL injection'
      );
    }

    // اكتشاف أنشطة غير عادية
    if (this.isAnomalousActivity(event)) {
      this.detectAnomalies(event);
    }
  }

  /**
   * اكتشاف محاولات الاستخدام القاسي
   */
  private detectBruteForce(event: ActivityEvent): void {
    const key = `${event.userId}:${event.ipAddress}`;
    const pattern = this.suspiciousPatterns.get(key) || {
      count: 0,
      lastSeen: 0,
    };

    pattern.count++;
    pattern.lastSeen = Date.now();

    // إذا كان هناك أكثر من 10 محاولات فاشلة في دقيقة واحدة
    if (pattern.count >= 10 && Date.now() - pattern.lastSeen < 60000) {
      this.createThreatReport(
        event,
        'BRUTE_FORCE_ATTEMPT',
        RiskLevel.CRITICAL,
        `تم اكتشاف ${pattern.count} محاولات فاشلة`
      );
    }

    this.suspiciousPatterns.set(key, pattern);
  }

  /**
   * اكتشاف الأنشطة الشاذة
   */
  private detectAnomalies(event: ActivityEvent): void {
    const userEvents = this.getUserEvents(event.userId, 50);
    const avgOperationTime =
      userEvents.reduce((sum, e) => sum + (e.duration || 0), 0) /
      userEvents.length;

    if (event.duration && event.duration > avgOperationTime * 3) {
      this.createThreatReport(
        event,
        'ANOMALOUS_BEHAVIOR',
        RiskLevel.MEDIUM,
        'الوقت المستغرق أطول بكثير من المعتاد'
      );
    }
  }

  /**
   * حساب مستوى الخطر
   */
  private calculateRiskLevel(
    eventType: ActivityEventType,
    success: boolean,
    details?: Record<string, any>
  ): RiskLevel {
    if (!success) {
      if (
        eventType === ActivityEventType.LOGIN_FAILURE ||
        eventType === ActivityEventType.OTP_FAILED
      ) {
        return RiskLevel.HIGH;
      }
      return RiskLevel.MEDIUM;
    }

    if (
      eventType === ActivityEventType.PASSWORD_CHANGED ||
      eventType === ActivityEventType.PERMISSION_CHANGED
    ) {
      return RiskLevel.MEDIUM;
    }

    return RiskLevel.LOW;
  }

  /**
   * التحقق من نمط XSS
   */
  private containsXssPattern(data: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<svg\s+onload/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(data));
  }

  /**
   * التحقق من نمط SQL Injection
   */
  private containsSqlInjectionPattern(data: string): boolean {
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
   * التحقق من النشاط الشاذ
   */
  private isAnomalousActivity(event: ActivityEvent): boolean {
    const recentEvents = this.events.filter(
      (e) =>
        e.userId === event.userId &&
        Date.now() - e.timestamp < 5 * 60 * 1000 // آخر 5 دقائق
    );

    // أكثر من 20 عملية في 5 دقائق = نشاط شاذ
    return recentEvents.length > 20;
  }

  /**
   * إنشاء تقرير تهديد
   */
  private createThreatReport(
    event: ActivityEvent,
    threatType: string,
    severity: RiskLevel,
    description: string
  ): void {
    const report: ThreatReport = {
      id: this.generateThreatId(),
      timestamp: Date.now(),
      userId: event.userId,
      ipAddress: event.ipAddress,
      threatType,
      severity,
      events: [event.id],
      description,
      actions: [],
      resolved: false,
    };

    this.threats.set(report.id, report);

    console.error(
      `🚨 تحذير أمني: ${threatType} - ${description} (المستخدم: ${event.userId})`
    );
  }

  /**
   * توليد معرف الحدث
   */
  private generateEventId(): string {
    return `EVT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * توليد معرف التهديد
   */
  private generateThreatId(): string {
    return `THR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * الحصول على الإحصائيات
   */
  getStatistics() {
    const totalEvents = this.events.length;
    const suspiciousEvents = this.events.filter(
      (e) =>
        e.riskLevel === RiskLevel.HIGH || e.riskLevel === RiskLevel.CRITICAL
    ).length;
    const failedOperations = this.events.filter((e) => !e.success).length;
    const activeThreatReports = Array.from(this.threats.values()).filter(
      (t) => !t.resolved
    ).length;

    return {
      totalEvents,
      suspiciousEvents,
      failedOperations,
      activeThreatReports,
      eventDensity: totalEvents > 0 ? suspiciousEvents / totalEvents : 0,
    };
  }

  /**
   * تنظيف الأحداث القديمة
   */
  cleanup(daysOld: number = 30): number {
    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    const initialLength = this.events.length;

    this.events = this.events.filter((e) => e.timestamp > cutoffTime);

    return initialLength - this.events.length;
  }
}

/**
 * تصدير مثيل مراقب الأنشطة
 */
export const activityMonitor = new ActivityMonitor();
