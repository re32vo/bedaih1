# 🛠️ دليل إعداد بوابة الدفع Moyasar

## خطوات الإعداد السريعة

### 1️⃣ الحصول على مفتاح API من Moyasar

1. تسجيل الدخول إلى لوحة التحكم: https://dashboard.moyasar.com
2. اذهب إلى **Settings** → **API Keys**
3. انسخ **Secret Key** (المفتاح السري)
   - يبدو كالتالي: `sk_live_...` أو `sk_test_...`

### 2️⃣ تحديث متغيرات البيئة

#### في Vercel:
```bash
# في Project Settings → Environment Variables

MOYASAR_SECRET_KEY=sk_live_xxxxxxxxxxxx
APP_URL=https://bedaih-sa.org
VITE_API_BASE_URL=https://bedaih-sa.org
```

#### في `.env.vercel.all` (للتطوير المحلي):
```env
MOYASAR_SECRET_KEY=sk_test_xxxxxxxxxxxx
APP_URL=http://localhost:5000
VITE_API_BASE_URL=
```

### 3️⃣ إعدادات Moyasar Dashboard

#### تكوين Webhook:
1. اذهب إلى **Settings** → **Webhooks**
2. أضف webhook جديد:
   - **URL**: `https://bedaih-sa.org/api/moyasar/invoice-callback`
   - **Events**: اختر `invoice.paid`
3. احفظ الإعدادات

#### تكوين طرق الدفع المدعومة:
1. اذهب إلى **Settings** → **Payment Methods**
2. تأكد من تفعيل:
   - ✅ Credit/Debit Card
   - ✅ Apple Pay (اختياري)
   - ✅ SADAD (البنك الأهلي)

---

## اختبار الدفع

### خطوات الاختبار:
1. افتح الموقع وادهب إلى صفحة التبرع
2. أضف مبلغ (مثلاً 1 ريال)
3. اختر طريقة الدفع
4. انقر "متابعة"
5. استخدم بيانات الاختبار:
   - **رقم البطاقة**: `4111 1111 1111 1111`
   - **CVV**: `123`
   - **التاريخ**: أي تاريخ مستقبلي

### الأخطاء الشائعة:

❌ **خطأ: "تعذر إنشاء عملية الدفع"**
- تحقق: هل `MOYASAR_SECRET_KEY` محدد بشكل صحيح؟

❌ **خطأ: "لم يتم استلام رابط الدفع من ميسر"**
- تحقق: هل الـ credentials صحيحة في Moyasar؟

❌ **خطأ: الـ callback لا يعمل**
- تحقق: هل `APP_URL` محدد بشكل صحيح؟
- تحقق: هل Webhook URL في Moyasar صحيح؟

---

## تدفق الدفع الكامل

```
المستخدم
  ↓
[الدفع] صفحة الدفع
  ↓
POST /api/moyasar/create-payment
  ↓ (في الخادم)
  ├─ تحقق: MOYASAR_SECRET_KEY ✓
  ├─ بناء URLs (APP_URL) ✓
  ├─ استدعاء: POST api.moyasar.com/v1/invoices
  └─ أرسل paymentUrl
  ↓
[في المتصفح]
window.location.href = paymentUrl
  ↓
موقع Moyasar
  ↓
[المستخدم يدفع]
  ↓
Moyasar → POST /api/moyasar/invoice-callback
  ↓ (في الخادم)
  ├─ تحقق: حالة الدفع = "paid" ✓
  ├─ اطلب: GET api.moyasar.com/v1/payments/{id}
  ├─ سجّل التبرع في قاعدة البيانات ✓
  └─ أرسل إيصال بريد ✓
  ↓
→ /thank-you?moyasar=1&amount=XXX
  ↓
شاشة الشكر
```

---

## أوامر مفيدة

### التحقق من أن متغيرات البيئة محددة:
```bash
# في الخادم:
echo $MOYASAR_SECRET_KEY    # يجب أن يطبع المفتاح
echo $APP_URL                # يجب أن يطبع الـ domain
```

### مراجعة الـ Logs:
```bash
# في Vercel Dashboard:
# Deployments → Function Logs → Filter: "Moyasar"
```

### اختبار الـ API مباشرة:
```bash
curl -X POST http://localhost:5000/api/moyasar/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "method": "card-quick",
    "email": "test@example.com",
    "name": "تاجر اختبار"
  }'
```

---

## الدعم والمساعدة

- **توثيق Moyasar**: https://moyasar.com/docs
- **حساب المطور**: https://dashboard.moyasar.com
- **الدعم**: support@moyasar.com

---

## ملفات ذات صلة

- [PAYMENT_GATEWAY_ISSUES.md](PAYMENT_GATEWAY_ISSUES.md) - الأخطاء الشائعة والحلول
- [server/routes.ts#L3371](server/routes.ts#L3371) - كود معالجة الدفع
- [client/src/lib/moyasar.ts](client/src/lib/moyasar.ts) - تطبيق العميل
- [.env.example](.env.example) - متغيرات البيئة
