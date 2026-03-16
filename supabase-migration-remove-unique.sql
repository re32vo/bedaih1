-- ملف هجرة: إزالة قيود UNIQUE من البريد الإلكتروني
-- شغل هذا الملف في Supabase SQL Editor لتحديث قاعدة البيانات

-- حذف قيد UNIQUE على المتطوعين
DROP INDEX IF EXISTS idx_volunteers_email_unique;

-- حذف قيد UNIQUE على رسائل التواصل
DROP INDEX IF EXISTS idx_contact_messages_email_unique;

-- حذف قيد UNIQUE على طلبات الوظائف
DROP INDEX IF EXISTS idx_job_applications_email_unique;

-- إضافة فهارس عادية (بدون UNIQUE) لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_volunteers_email_regular ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email_regular ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_job_applications_email_regular ON job_applications(email);

-- =====================================================
-- Migration: السماح بطلبات متعددة للمستفيد بأنواع مساعدة مختلفة
-- شغّل هذا القسم في Supabase SQL Editor
-- =====================================================

-- إزالة قيد UNIQUE على رقم الهوية في جدول المستفيدين
-- (يُسمح الآن بأكثر من طلب بنفس رقم الهوية لكن بنوع مساعدة مختلف أو بعد مرور 30 يوم)
ALTER TABLE beneficiaries DROP CONSTRAINT IF EXISTS beneficiaries_national_id_key;

-- إضافة فهرس عادي بدل UNIQUE
CREATE INDEX IF NOT EXISTS idx_beneficiaries_national_id_regular ON beneficiaries(national_id);

-- فهرس مركب لتسريع التحقق من نوع المساعدة + رقم الهوية + التاريخ
CREATE INDEX IF NOT EXISTS idx_beneficiaries_national_id_type ON beneficiaries(national_id, assistance_type, created_at DESC);
