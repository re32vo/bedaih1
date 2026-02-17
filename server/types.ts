/**
 * ملف الأنواع المركزي للخادم
 * يحتوي على جميع الواجهات والأنواع المستخدمة
 */

import { Request, Response } from 'express';

/**
 * بيانات المستخدم (الموظف)
 */
export interface AuthenticatedUser {
  email: string;
  name: string;
  role: string;
  permissions: string[];
  active: boolean;
  id?: string;
}

/**
 * طلب معاد مع مستخدم مصرح
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * بيانات رمز OTP
 */
export interface OTPTokenData {
  code: string;
  email: string;
  isRegistration?: boolean;
  name?: string;
  phone?: string;
  expiresAt?: string;
  used?: boolean;
}

/**
 * بيانات الرد القياسية
 */
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
  token?: string;
}

/**
 * فئة الخطأ
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * بيانات سجل الموظف
 */
export interface EmployeeRecord {
  id: string;
  email: string;
  name: string;
  role: 'president' | 'employee' | 'admin';
  phone?: string;
  notes?: string;
  active: boolean;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * بيانات سجل المتبرع
 */
export interface DonorRecord {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  totalDonations?: number;
  lastLogin?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * بيانات الإحصائيات
 */
export interface DashboardStats {
  beneficiaries: number;
  jobs: number;
  contacts: number;
  volunteers: number;
  total: number;
}

/**
 * بيانات البنود الأخيرة
 */
export interface RecentItems {
  beneficiaries: any[];
  jobs: any[];
  contacts: any[];
  volunteers: any[];
}
