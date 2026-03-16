-- ============================================================
-- ملف الإعداد الكامل لـ Supabase - مشروع بديه
-- شغّل هذا الملف كاملاً في Supabase SQL Editor
-- تاريخ آخر تحديث: مارس 2026
-- ============================================================
-- قسم 1: إنشاء الجداول (آمن - لا يؤثر على البيانات الموجودة)
-- ============================================================

-- جدول المتبرعين / العملاء
CREATE TABLE IF NOT EXISTS donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- جدول التبرعات
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  method TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول المستفيدين
-- ملاحظة: national_id بدون UNIQUE لأن نفس الشخص يقدر يقدم طلبات بأنواع مختلفة
CREATE TABLE IF NOT EXISTS beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  national_id TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  assistance_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول طلبات التوظيف
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  skills TEXT NOT NULL,
  cv_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول رسائل التواصل
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الموظفين
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول المتطوعين
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  skills TEXT NOT NULL,
  availability TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول رموز OTP
CREATE TABLE IF NOT EXISTS otp_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الرموز المميزة (Tokens)
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول سجل التدقيق
-- مهم جداً: تُخزَّن فيه حالات طلبات المتطوعين والمستفيدين (action = 'request_status_update')
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  user_email TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول البريد الصادر
CREATE TABLE IF NOT EXISTS outgoing_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول طلبات التبرع الدوري (تشغيلي حتى يتم ربط بوابة الدفع)
CREATE TABLE IF NOT EXISTS recurring_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  project TEXT NOT NULL,
  frequency TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- قسم 2: إزالة قيود UNIQUE القديمة (migrations)
-- ============================================================

-- إزالة UNIQUE عن national_id في المستفيدين
-- (اللوجيك الآن في الكود: 30 يوم لكل نوع مساعدة)
ALTER TABLE beneficiaries DROP CONSTRAINT IF EXISTS beneficiaries_national_id_key;

-- إزالة أي unique قديم على email في الجداول التي تسمح بتعدد الطلبات
DROP INDEX IF EXISTS idx_volunteers_email_unique;
DROP INDEX IF EXISTS idx_contact_messages_email_unique;
DROP INDEX IF EXISTS idx_job_applications_email_unique;

-- ============================================================
-- قسم 3: إنشاء الفهارس (لتسريع الاستعلامات)
-- ============================================================

-- donors
CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email);

-- donations
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(email);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);

-- beneficiaries
CREATE INDEX IF NOT EXISTS idx_beneficiaries_email ON beneficiaries(email);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_created_at ON beneficiaries(created_at DESC);
-- فهرس مركب لقاعدة 30 يوم (national_id + نوع المساعدة)
CREATE INDEX IF NOT EXISTS idx_beneficiaries_national_id_type ON beneficiaries(national_id, assistance_type, created_at DESC);

-- volunteers
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON volunteers(created_at DESC);

-- job_applications
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);

-- contact_messages
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- employees
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);

-- otp_tokens
CREATE INDEX IF NOT EXISTS idx_otp_tokens_email ON otp_tokens(email, expires_at);

-- audit_log
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
-- فهرس لتسريع استعلامات حالات الطلبات
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action, created_at DESC);

-- tokens
CREATE INDEX IF NOT EXISTS idx_tokens_token ON tokens(token);
CREATE INDEX IF NOT EXISTS idx_tokens_email ON tokens(email, expires_at);

-- recurring_donations
CREATE INDEX IF NOT EXISTS idx_recurring_donations_created_at ON recurring_donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recurring_donations_status ON recurring_donations(status, created_at DESC);

-- ============================================================
-- قسم 4: تعطيل RLS (Row Level Security)
-- الخادم يتحكم في الصلاحيات بنفسه
-- ============================================================

ALTER TABLE donors DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers DISABLE ROW LEVEL SECURITY;
ALTER TABLE otp_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE outgoing_emails DISABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_donations DISABLE ROW LEVEL SECURITY;
