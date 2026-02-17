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
