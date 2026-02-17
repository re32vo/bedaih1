-- إنشاء جداول قاعدة البيانات لمشروع bedaih1
-- شغل هذا الملف في Supabase SQL Editor

-- جدول المتبرعين
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
CREATE TABLE IF NOT EXISTS beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  national_id TEXT UNIQUE NOT NULL,
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
  email TEXT UNIQUE NOT NULL,
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
  email TEXT UNIQUE NOT NULL,
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
  email TEXT UNIQUE NOT NULL,
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

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(email);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_created_at ON beneficiaries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_national_id ON beneficiaries(national_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON volunteers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_otp_tokens_email ON otp_tokens(email, expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- تفعيل Row Level Security (RLS) - اختياري
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول الأساسية (يمكن تعديلها حسب الحاجة)
-- السماح بالقراءة والكتابة لجميع المستخدمين المصادق عليهم
CREATE POLICY "Enable read access for authenticated users" ON donors
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON donors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON donors
  FOR UPDATE USING (true);

-- نفس السياسات للجداول الأخرى
CREATE POLICY "Enable all access for donations" ON donations
  FOR ALL USING (true);

CREATE POLICY "Enable all access for beneficiaries" ON beneficiaries
  FOR ALL USING (true);

CREATE POLICY "Enable all access for job_applications" ON job_applications
  FOR ALL USING (true);

CREATE POLICY "Enable all access for contact_messages" ON contact_messages
  FOR ALL USING (true);

CREATE POLICY "Enable all access for employees" ON employees
  FOR ALL USING (true);

CREATE POLICY "Enable all access for volunteers" ON volunteers
  FOR ALL USING (true);
