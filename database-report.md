# 📊 تقرير قاعدة البيانات الشامل

## ✅ الجداول المستخدمة والموجودة

### 1. **donations** - التبرعات
- **الاستخدام**: تخزين جميع التبرعات (قنوات مختلفة)
- **الحقول الأساسية**:
  - `id` (UUID)
  - `email` (TEXT) - بريد المتبرع
  - `amount` (NUMERIC) - المبلغ
  - `method` (TEXT) - طريقة الدفع (online, bank, check, etc)
  - `code` (TEXT UNIQUE) - رمز التبرع
  - `status` (TEXT) - الحالة (pending, completed)
  - `created_at` (TIMESTAMPTZ)
- **الفهارس**: ✅ `idx_donations_email`, `idx_donations_created_at`
- **الملاحظات**: يحتاج إلى `updated_at` لتتبع التحديثات

---

### 2. **bank_transfers** - التحويلات البنكية
- **الاستخدام**: طلبات التبرع عبر التحويل البنكي (تحت المراجعة)
- **الحقول**:
  - `id` (UUID)
  - `email` (TEXT)
  - `donor_name` (TEXT)
  - `phone` (TEXT)
  - `amount` (NUMERIC)
  - `transfer_date` (TEXT)
  - `receipt_url` (TEXT)
  - `code` (TEXT UNIQUE)
  - `status` (TEXT) - under_review, completed, cancelled, rejected
  - `admin_notes` (TEXT)
  - `created_at`, `updated_at` (TIMESTAMPTZ)
- **الفهارس**: ✅ موجودة وكاملة

---

### 3. **donors** - المتبرعون
- **الاستخدام**: تخزين بيانات المتبرعين المسجلين
- **الحقول**:
  - `id` (UUID)
  - `email` (TEXT UNIQUE)
  - `name` (TEXT)
  - `phone` (TEXT)
  - `created_at`, `last_login_at` (TIMESTAMPTZ)
- **الفهارس**: ✅ `idx_donors_email`
- **الملاحظات**: قد يحتاج إلى حقول إضافية مثل:
  - `total_donations` (NUMERIC) - إجمالي التبرعات
  - `donation_count` (INTEGER) - عدد التبرعات

---

### 4. **employees** - الموظفون/الإداريون
- **الاستخدام**: حسابات الموظفين والإداريين
- **الحقول**:
  - `id` (TEXT PRIMARY KEY)
  - `name` (TEXT)
  - `email` (TEXT UNIQUE)
  - `role` (TEXT)
  - `phone` (TEXT)
  - `notes` (TEXT)
  - `active` (BOOLEAN)
  - `permissions` (JSONB)
  - `created_at` (TIMESTAMPTZ)
- **الفهارس**: ✅ `idx_employees_email`

---

### 5. **beneficiaries** - المستفيدون
- **الاستخدام**: طلبات المساعدة من المستفيدين
- **الحقول**:
  - `id` (UUID)
  - `full_name` (TEXT)
  - `national_id` (TEXT)
  - `address` (TEXT)
  - `phone` (TEXT)
  - `email` (TEXT)
  - `assistance_type` (TEXT) - نوع المساعدة
  - `created_at` (TIMESTAMPTZ)
- **الفهارس**: ✅ موجودة
- **الملاحظات**: 
  - يطبق قاعدة 30 يوم لكل نوع مساعدة
  - قد يحتاج إلى حقل `status` (under_review, approved, rejected)

---

### 6. **job_applications** - طلبات التوظيف
- **الاستخدام**: حفظ طلبات التوظيف
- **الحقول**:
  - `id` (UUID)
  - `full_name`, `email`, `phone` (TEXT)
  - `experience`, `qualifications`, `skills` (TEXT)
  - `cv_url` (TEXT)
  - `created_at` (TIMESTAMPTZ)
- **الفهارس**: ✅ موجودة
- **الملاحظات**: قد يحتاج إلى حقل `status` (pending, accepted, rejected)

---

### 7. **contact_messages** - رسائل التواصل
- **الاستخدام**: حفظ رسائل الاتصال من الموقع
- **الحقول**:
  - `id` (UUID)
  - `name`, `email`, `phone`, `message` (TEXT)
  - `created_at` (TIMESTAMPTZ)
- **الفهارس**: ✅ موجودة
- **الملاحظات**: قد يحتاج إلى حقل `status` (new, read, replied)

---

### 8. **volunteers** - المتطوعون
- **الاستخدام**: طلبات التطوع
- **الحقول**:
  - `id` (UUID)
  - `full_name`, `email`, `phone` (TEXT)
  - `skills`, `availability` (TEXT)
  - `created_at` (TIMESTAMPTZ)
- **الفهارس**: ✅ موجودة
- **الملاحظات**: قد يحتاج إلى حقل `status` (pending, approved, rejected)

---

### 9. **recurring_donations** - التبرعات الدورية
- **الاستخدام**: طلبات التبرعات المتكررة
- **الحقول**:
  - `id` (UUID)
  - `full_name`, `phone`, `project` (TEXT)
  - `frequency` (TEXT) - monthly, yearly, etc
  - `amount` (NUMERIC)
  - `status` (TEXT)
  - `created_at` (TIMESTAMPTZ)
- **الفهارس**: ✅ موجودة

---

### 10. **audit_log** - سجل التدقيق
- **الاستخدام**: تتبع جميع العمليات والتغييرات
- **الحقول الإضافية** (من قسم 5 في SUPABASE_SETUP.sql):
  - `event_category` (TEXT)
  - `entity_type` (TEXT)
  - `entity_id` (TEXT)
  - `actor_role` (TEXT)
  - `ip_address` (INET)
  - `user_agent` (TEXT)
  - `before_data` (JSONB)
  - `after_data` (JSONB)
  - `success` (BOOLEAN)
  - `severity` (TEXT)
  - `source` (TEXT)
  - `request_id` (TEXT)
- **الفهارس**: ✅ موجودة بكثرة
- **الملاحظات**: محسّن جداً للبحث والتحليل

---

### 11. **otp_tokens** - رموز OTP
- **الاستخدام**: التحقق بـ OTP
- **الحقول**:
  - `id` (UUID)
  - `email` (TEXT)
  - `code` (TEXT)
  - `expires_at` (TIMESTAMPTZ)
  - `used` (BOOLEAN)
  - `created_at` (TIMESTAMPTZ)
- **الفهارس**: ✅ `idx_otp_tokens_email`

---

### 12. **tokens** - الرموز المميزة (JWT)
- **الاستخدام**: حفظ JWT والرموز الأخرى
- **الحقول**:
  - `id` (UUID)
  - `email` (TEXT)
  - `token` (TEXT UNIQUE)
  - `expires_at` (TIMESTAMPTZ)
  - `created_at` (TIMESTAMPTZ)
- **الفهارس**: ✅ موجودة

---

## 🔧 الجداول الإضافية المستخدمة

### 13. **outgoing_emails** - البريد الصادر
- **الاستخدام**: تتبع رسائل البريد المرسلة
- **الحقول**:
  - `id` (UUID)
  - `to_email` (TEXT)
  - `subject`, `body` (TEXT)
  - `status` (TEXT) - pending, sent, failed
  - `sent_at`, `created_at` (TIMESTAMPTZ)
- **الملاحظات**: يحتاج إلى فهرس على `status` و `created_at`

---

## 📝 التحسينات المقترحة

### 1. إضافة View للسجلات:
```sql
-- موجود في SUPABASE_SETUP.sql كـ v_audit_log_readable
```

### 2. دالة تنظيف الأرشيف:
```sql
-- موجودة كـ prune_audit_log()
```

### 3. حقول مفقودة في جداول مختلفة:

#### في جدول **donations**:
- `updated_at` (TIMESTAMPTZ) - لتتبع آخر تحديث

#### في جدول **beneficiaries**:
- `status` (TEXT) - under_review, approved, rejected
- `application_reason` (TEXT)
- `verification_status` (TEXT)

#### في جدول **job_applications**:
- `status` (TEXT)
- `reviewed_by` (TEXT)
- `review_date` (TIMESTAMPTZ)

#### في جدول **contact_messages**:
- `status` (TEXT) - new, read, replied
- `replied_at` (TIMESTAMPTZ)
- `reply_message` (TEXT)

#### في جدول **donors**:
- `total_donations` (NUMERIC)
- `donation_count` (INTEGER)
- `last_donation_date` (TIMESTAMPTZ)
- `preferred_contact_method` (TEXT)

#### في جدول **volunteers**:
- `status` (TEXT)
- `approval_date` (TIMESTAMPTZ)
- `approved_by` (TEXT)

---

## ✨ الحالة الحالية

- ✅ **جميع الجداول الأساسية موجودة**
- ✅ **الفهارس مُحسّنة**
- ✅ **سجل التدقيق مُحدّث**
- ✅ **RLS معطّل** (الخادم يتحكم بالأمان)
- ⚠️ **بعض الحقول الاختيارية مفقودة** (لا تؤثر على التشغيل)

---

## 🚀 الخطوات التالية

1. **الاختبار**: تشغيل التطبيق والتحقق من جميع العمليات
2. **البيانات التجريبية**: إدراج بيانات اختبارية
3. **الأداء**: مراقبة سرعة الاستعلامات
4. **النسخ الاحتياطي**: إعداد نسخ احتياطية آلية

