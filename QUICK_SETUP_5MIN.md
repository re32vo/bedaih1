# 🔧 إجراء سريع: تفعيل بوابة الدفع في 5 دقائق

## ✅ المتطلبات
- حساب Moyasar نشط
- وصول إلى Vercel
- الموقع تم نشره بالفعل

---

## 📝 الخطوة 1: الحصول على مفتاح Moyasar

1. افتح: https://dashboard.moyasar.com
2. اذهب إلى: **Settings** → **API Keys**
3. انسخ **Secret Key** (يبدو مثل: `sk_live_XXXXXXX`)
   - يجب أن يكون طويل ويحتوي على أحرف وأرقام

---

## 🔐 الخطوة 2: إضافة المتغيرات في Vercel

### أ) افتح Vercel Project
- https://vercel.com/dashboard
- اختر مشروعك: **bedaih1-main** أو **bedaih-sa-org**

### ب) افتح Project Settings
```
Settings → Environment Variables
```

### ج) أضف المتغيرات التالية:

#### 1️⃣ MOYASAR_SECRET_KEY
```
Name: MOYASAR_SECRET_KEY
Value: sk_live_XXXXXXX (الذي نسخته أعلاه)
Production: ✅
Preview: ✅
Development: ✅
```
ثم اضغط **Save**

#### 2️⃣ APP_URL
```
Name: APP_URL
Value: https://bedaih-sa.org
Production: ✅
Preview: ✅
Development: ❌
```
ثم اضغط **Save**

#### 3️⃣ VITE_API_BASE_URL (اختياري)
```
Name: VITE_API_BASE_URL
Value: https://bedaih-sa.org
Production: ✅
Preview: ✅
Development: ❌
```
ثم اضغط **Save**

### النتيجة يجب أن تبدو كالتالي:
```
MOYASAR_SECRET_KEY     | sk_live_XXXXXXX  | Prod, Prev, Dev ✅
APP_URL                | https://...       | Prod, Prev ✅
VITE_API_BASE_URL      | https://...       | Prod, Prev ✅
```

---

## 🚀 الخطوة 3: إعادة النشر

بعد إضافة المتغيرات:

1. افتح **Deployments**
2. افتح آخر deployment
3. اضغط **Redeploy** (أو "إعادة النشر")
4. انتظر حتى ينتهي (~ 2 دقيقة)

---

## 🧪 الخطوة 4: اختبر الدفع

### اختبار محلي أولاً (اختياري):
```bash
# في المجلد الرئيسي:
npm install
npm run dev

# افتح: http://localhost:5173
# اضغط "تبرع"
# اختبر الدفع
```

### اختبار على الموقع المباشر:
1. افتح: https://bedaih-sa.org
2. اضغط على "تبرع" أو "رعاية"
3. أضف مبلغ (مثلاً 10 ريال)
4. اختر "بطاقة بنكية"
5. اضغط "الدفع" أو "متابعة"

**يجب أن ترى**:
```
✅ تحويل إلى موقع Moyasar
✅ نموذج دفع يظهر
```

### استخدم بيانات الاختبار:
```
رقم البطاقة: 4111 1111 1111 1111
CVV: 123
التاريخ: 12/25
```

**النتيجة المتوقعة**:
```
✅ دفع ناجح
✅ إعادة توجيه إلى صفحة الشكر
✅ تسجيل التبرع
✅ إيصال بريد
```

---

## ❌ إذا حدث خطأ

### خطأ: "تعذر إنشاء عملية الدفع"
- تحقق: المفتاح مُنسخ بشكل صحيح (بدون مسافات)
- تحقق: إعادة نشر تمت بنجاح
- جرّب: مفتاح test بدلاً من live

### خطأ: "لم يتم استلام رابط من ميسر"
- تحقق: الحساب نشط في Moyasar
- تحقق: المفتاح سليم
- جرّب: إنشاء مفتاح جديد

### الـ Callback لا يعمل (لا يُسجّل التبرع)
- تحقق: `APP_URL` صحيح
- اذهب إلى Moyasar → Settings → Webhooks
- أضف webhook:
  ```
  URL: https://bedaih-sa.org/api/moyasar/invoice-callback
  Events: invoice.paid ✅
  ```

---

## 📞 الدعم الإضافي

للتفاصيل الكاملة والمشاكل المعقدة، اقرأ:
- **PAYMENT_SUMMARY.md** - الملخص
- **PAYMENT_GATEWAY_ISSUES.md** - المشاكل التفصيلية
- **MOYASAR_SETUP_GUIDE.md** - الدليل الكامل
- **PAYMENT_CHECKLIST.md** - قائمة التحقق

---

## ✨ كل شيء جاهز؟

```
✅ MOYASAR_SECRET_KEY محدد
✅ APP_URL محدد
✅ إعادة نشر تمت
✅ الدفع يعمل
✅ التبرعات تُسجّل
```

**تهانينا! 🎉 بوابة الدفع جاهزة للاستخدام**

---

**وقت الإعداد**: ~5 دقائق  
**مستوى الصعوبة**: ⭐ سهل جداً  
**آخر تحديث**: 15 مايو 2026
