# ✅ قائمة التحقق من بوابة الدفع

استخدم هذه القائمة قبل نشر الموقع للإنتاج.

## 🔐 متغيرات البيئة

- [ ] `MOYASAR_SECRET_KEY` محدد في Vercel
  - اختبر: `echo $MOYASAR_SECRET_KEY` (لا يجب أن يكون فارغًا)
  - تأكد: المفتاح يبدأ بـ `sk_live_` (للإنتاج) أو `sk_test_` (للاختبار)

- [ ] `APP_URL` محدد ويشير إلى الـ domain الصحيح
  - مثال: `https://bedaih-sa.org` (ليس `http://`)

- [ ] `VITE_API_BASE_URL` محدد بشكل صحيح
  - إذا كان API على نفس الـ domain: اترك فارغًا
  - إذا كان API منفصل: `https://api.domain.com`

- [ ] `CORS_ORIGIN` يتضمن الـ frontend domain
  - مثال: `*.vercel.app,https://bedaih-sa.org`

## 🛠️ إعدادات Moyasar

- [ ] تسجيل الدخول إلى https://dashboard.moyasar.com
- [ ] انتقل إلى **Settings** → **API Keys**
- [ ] تم نسخ **Secret Key** بشكل صحيح
- [ ] انتقل إلى **Settings** → **Webhooks**
- [ ] Webhook URL محدد بشكل صحيح:
  - `https://bedaih-sa.org/api/moyasar/invoice-callback`
- [ ] Webhook Events: `invoice.paid` مفعّل
- [ ] طرق الدفع مفعّلة:
  - [ ] Credit/Debit Card
  - [ ] (اختياري) Apple Pay
  - [ ] (اختياري) SADAD

## 💻 الكود والـ Logs

- [ ] لا توجد أخطاء TypeScript في `server/routes.ts` (Moyasar section)
- [ ] لا توجد أخطاء TypeScript في `client/src/lib/moyasar.ts`
- [ ] لا توجد أخطاء TypeScript في `client/src/pages/Checkout.tsx`

- [ ] عند بدء الخادم، تحقق من الـ logs:
  ```
  ✅ Environment validated successfully
  ⚠️ MOYASAR_SECRET_KEY غير محدد - بوابة الدفع لن تعمل
  ```
  - يجب أن تكون الرسالة الثانية **غير موجودة** إذا تم التكوين بشكل صحيح

## 🧪 اختبار الدفع

- [ ] في بيئة التطوير المحلية:
  - [ ] افتح صفحة التبرع
  - [ ] أضف مبلغ (مثلاً 10 ريال)
  - [ ] اختر "بطاقة بنكية"
  - [ ] اضغط "الدفع"
  - [ ] يجب أن ترى صفحة Moyasar (أو رسالة خطأ واضحة)

- [ ] في البيئة الإنتاجية (بعد النشر):
  - [ ] افتح الموقع الفعلي
  - [ ] أكمل العملية السابقة
  - [ ] تأكد: الرابط يحتوي على domain صحيح
  - [ ] اختبر الدفع بـ بطاقة الاختبار:
    - رقم: `4111111111111111`
    - CVV: `123`
    - التاريخ: `12/25`

## 📋 الأخطاء المتوقعة والحلول

### ❌ "تعذر إنشاء عملية الدفع"
- [ ] تحقق: `MOYASAR_SECRET_KEY` موجود وصحيح
- [ ] تحقق: الـ format صحيح (`sk_...`)
- [ ] تحقق: المفتاح لم يتغير في Moyasar

### ❌ "لم يتم استلام رابط الدفع من ميسر"
- [ ] تحقق: حسابك في Moyasar نشط
- [ ] تحقق: لا توجد مشاكل مع الـ API key
- [ ] جرّب: مفتاح test بدلاً من live

### ❌ الـ Callback لا يصل (التبرع لا يُسجّل)
- [ ] تحقق: Webhook URL في Moyasar صحيح
- [ ] تحقق: `APP_URL` يشير إلى الـ domain الصحيح
- [ ] تحقق: الـ domain يقبل connections من Moyasar

### ❌ "CORS Error" في المتصفح
- [ ] تحقق: `CORS_ORIGIN` يتضمن frontend domain
- [ ] تحقق: Frontend يطلب من domain صحيح

## 📊 مراقبة ما بعد الإطلاق

- [ ] راقب **Vercel Logs** للأخطاء:
  ```
  Moyasar create payment error
  Moyasar invoice callback error
  Failed to send Moyasar donation receipt
  ```

- [ ] راقب **Supabase** للتبرعات المسجلة
- [ ] راقب **Moyasar Dashboard** لحركة الدفع

## 🚀 ما يجب تنفيذه قبل النشر

1. [ ] أكمل جميع الفحوصات أعلاه
2. [ ] اختبر العملية الكاملة مرتين على الأقل
3. [ ] تحقق من الـ Logs على Vercel (بدون أخطاء)
4. [ ] تحقق من قاعدة البيانات (وجود تبرعات جديدة)
5. [ ] تحقق من البريد الإلكتروني (استقبال الإيصالات)

---

## 📞 معلومات الاتصال

- **Moyasar Support**: support@moyasar.com
- **Moyasar Docs**: https://moyasar.com/docs
- **Moyasar Dashboard**: https://dashboard.moyasar.com
- **Vercel Logs**: https://vercel.com → Project → Deployments → Function Logs

---

**آخر تحديث**: 15 مايو 2026
