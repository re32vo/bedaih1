-- ============================================================
-- تحسينات وإضافات قاعدة البيانات
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================================

-- 1. إضافة حقول مفقودة في donations
ALTER TABLE donations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. إضافة حقول مفقودة في beneficiaries
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'under_review';
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS application_reason TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';

-- 3. إضافة حقول مفقودة في job_applications
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS reviewed_by TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS review_date TIMESTAMPTZ;

-- 4. إضافة حقول مفقودة في contact_messages
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS reply_message TEXT;

-- 5. إضافة حقول مفقودة في donors
ALTER TABLE donors ADD COLUMN IF NOT EXISTS total_donations NUMERIC DEFAULT 0;
ALTER TABLE donors ADD COLUMN IF NOT EXISTS donation_count INTEGER DEFAULT 0;
ALTER TABLE donors ADD COLUMN IF NOT EXISTS last_donation_date TIMESTAMPTZ;
ALTER TABLE donors ADD COLUMN IF NOT EXISTS preferred_contact_method TEXT;

-- 6. إضافة حقول مفقودة في volunteers
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS approved_by TEXT;

-- 7. إضافة فهارس إضافية للأداء
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_method ON donations(method, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_beneficiaries_status ON beneficiaries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_assistance_type ON beneficiaries(assistance_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_outgoing_emails_status ON outgoing_emails(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outgoing_emails_to_email ON outgoing_emails(to_email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_recurring_donations_email ON recurring_donations(full_name, created_at DESC);

-- 8. إنشاء دالة لتحديث إجمالي التبرعات للمتبرع (يمكن استدعاؤها بعد كل تبرع جديد)
CREATE OR REPLACE FUNCTION update_donor_stats(donor_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE donors
  SET 
    total_donations = (
      SELECT COALESCE(SUM(amount), 0)
      FROM donations
      WHERE email = donor_email AND status = 'completed'
    ),
    donation_count = (
      SELECT COUNT(*)
      FROM donations
      WHERE email = donor_email AND status = 'completed'
    ),
    last_donation_date = (
      SELECT MAX(created_at)
      FROM donations
      WHERE email = donor_email AND status = 'completed'
    )
  WHERE email = donor_email;
END;
$$;

-- 9. إنشاء دالة لتحديث إجمالي البريد المرسل
CREATE OR REPLACE FUNCTION get_email_status_summary()
RETURNS TABLE(status TEXT, count BIGINT)
LANGUAGE sql
AS $$
  SELECT status, COUNT(*)
  FROM outgoing_emails
  GROUP BY status;
$$;

-- 10. فهرس مركب لتحسين البحث عن التبرعات للمتبرع
CREATE INDEX IF NOT EXISTS idx_donations_email_status ON donations(email, status, created_at DESC);

-- 11. فهرس مركب لتحسين البحث عن طلبات التحويل البنكي
CREATE INDEX IF NOT EXISTS idx_bank_transfers_email_status ON bank_transfers(email, status, created_at DESC);

-- 12. إنشاء جدول اختياري لتخزين الإحصائيات (للأداء الأفضل)
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE DEFAULT CURRENT_DATE,
  total_donors INTEGER DEFAULT 0,
  total_donations_amount NUMERIC DEFAULT 0,
  total_donations_count INTEGER DEFAULT 0,
  pending_beneficiaries INTEGER DEFAULT 0,
  pending_job_applications INTEGER DEFAULT 0,
  pending_volunteers INTEGER DEFAULT 0,
  pending_messages INTEGER DEFAULT 0,
  pending_bank_transfers INTEGER DEFAULT 0,
  completed_bank_transfers INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(stat_date)
);

CREATE INDEX IF NOT EXISTS idx_dashboard_stats_date ON dashboard_stats(stat_date DESC);

-- 13. إنشاء جدول لتخزين الرموز المنسقة (QR codes، codes) للتبرعات
CREATE TABLE IF NOT EXISTS donation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  donation_id UUID,
  qr_code_url TEXT,
  barcode_url TEXT,
  print_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_donation_codes_code ON donation_codes(code);
CREATE INDEX IF NOT EXISTS idx_donation_codes_donation_id ON donation_codes(donation_id);

-- 14. إنشاء جدول اختياري لتخزين الملفات والمرفقات
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'beneficiary_request', 'job_application', 'bank_transfer', etc
  entity_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT, -- 'image', 'pdf', 'document', etc
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_attachments_entity ON attachments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_attachments_created_at ON attachments(created_at DESC);

-- 15. دالة للحصول على إحصائيات اليوم
CREATE OR REPLACE FUNCTION get_today_stats()
RETURNS TABLE (
  new_donors BIGINT,
  new_donations BIGINT,
  total_donations_today NUMERIC,
  new_beneficiary_requests BIGINT,
  new_volunteer_requests BIGINT,
  new_job_applications BIGINT,
  new_contact_messages BIGINT,
  new_bank_transfer_requests BIGINT
)
LANGUAGE sql
AS $$
  SELECT
    (SELECT COUNT(*) FROM donors WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(*) FROM donations WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE DATE(created_at) = CURRENT_DATE AND status = 'completed'),
    (SELECT COUNT(*) FROM beneficiaries WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(*) FROM volunteers WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(*) FROM job_applications WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(*) FROM bank_transfers WHERE DATE(created_at) = CURRENT_DATE);
$$;

-- 16. تحديث صلاحيات RLS (مثل السابق - معطّلة)
ALTER TABLE donation_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE attachments DISABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_stats DISABLE ROW LEVEL SECURITY;

-- ✅ نهاية التحسينات
-- هذا الملف آمن للتشغيل أكثر من مرة
