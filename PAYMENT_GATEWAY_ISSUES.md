# 🔴 مشاكل بوابة الدفع (Moyasar Payment Gateway Issues)

## المشاكل المكتشفة

### 1. **❌ مفتاح Moyasar السري غير محدد**
**المشكلة**: ملف `.env.vercel.all` لا يحتوي على `MOYASAR_SECRET_KEY`

**الملف المتأثر**: 
- [server/routes.ts](server/routes.ts#L3372-L3376)
- [.env.vercel.all](.env.vercel.all)

**السبب**: بدون هذا المفتاح، الخادم لا يستطيع الاتصال بـ API ميسر

**رسالة الخطأ المتوقعة**:
```
Error: MOYASAR_SECRET_KEY is missing
```

**الحل**:
```bash
# أضف إلى .env.vercel.all:
MOYASAR_SECRET_KEY=your_moyasar_secret_key_here
```

---

### 2. **❌ عنوان URL الموقع غير محدد**
**المشكلة**: لا يوجد `APP_URL` أو `PUBLIC_APP_URL` في البيئة الإنتاجية

**الملف المتأثر**:
- [server/routes.ts](server/routes.ts#L3382-L3388)
- [.env.vercel.all](.env.vercel.all)

**السبب**: هذا يؤثر على بناء URLs الـ redirect و callback:
- `success_url` → `/thank-you` (غير كامل)
- `back_url` → `/donate` (غير كامل)
- `callback_url` → `/api/moyasar/invoice-callback` (غير كامل)

**الحل**:
```bash
# أضف إلى .env.vercel.all:
APP_URL=https://bedaih-sa.org
# أو:
PUBLIC_APP_URL=https://bedaih-sa.org
```

---

### 3. **❌ API Base URL على جانب العميل قد لا يكون صحيحًا**
**المشكلة**: `VITE_API_BASE_URL` قد يكون فارغًا في الإنتاج

**الملف المتأثر**:
- [client/src/main.tsx](client/src/main.tsx#L5-L19)
- `.env` (Frontend)

**السبب**: عندما يكون فارغًا، جميع طلبات `/api` تذهب مباشرة إلى نفس الـ origin

**الحل**: إذا كان الـ API على domain مختلف:
```bash
# في بيئة Vercel:
VITE_API_BASE_URL=https://api.bedaih-sa.org
```

---

## تتبع سريع لتدفق الدفع

```
1. Client (Checkout.tsx)
   ↓ startMoyasarPayment()
   ↓ POST /api/moyasar/create-payment
   ↓
2. Server (routes.ts:3523)
   ↓ يتحقق من MOYASAR_SECRET_KEY ❌ المشكلة 1
   ↓ بناء URLs (يستخدم APP_URL) ❌ المشكلة 2
   ↓ POST https://api.moyasar.com/v1/invoices
   ↓ ترسل جواب مع paymentUrl
   ↓
3. Client يحول المستخدم إلى Moyasar
   ↓ المستخدم يدفع
   ↓ Moyasar يرسل callback إلى callback_url
   ↓
4. Server يعالج webhook (routes.ts:3630)
   ↓ يسجل التبرع
   ↓
5. Client يحول المستخدم إلى /thank-you
```

---

## الإجراءات المطلوبة

### ✅ الخطوة 1: تحديث `.env.vercel.all`
```env
# أضف أو حدّث هذه السطور:
MOYASAR_SECRET_KEY=<your-secret-key-from-moyasar-dashboard>
APP_URL=https://bedaih-sa.org
VITE_API_BASE_URL=https://bedaih-sa.org
```

### ✅ الخطوة 2: تحديث `.env.example`
```env
# للتوثيق:
MOYASAR_SECRET_KEY=your-moyasar-secret-key-from-dashboard
APP_URL=https://yourdomain.com
VITE_API_BASE_URL=https://yourdomain.com  # إذا كان API على domain مختلف
```

### ✅ الخطوة 3: اختبار الاتصال
1. تحقق من حصول `/api/moyasar/create-payment` على `MOYASAR_SECRET_KEY`
2. تحقق من الـ logs للرسالة "تعذر إنشاء عملية الدفع"
3. اختبر بمبلغ صغير (1 ريال)

### ✅ الخطوة 4: تحقق من Moyasar Dashboard
- تأكد من أن المفتاح السري صحيح
- تأكد من الـ webhook settings تشير إلى الـ callback URL الصحيح
- تحقق من أن حسابك يدعم الاختبار

---

## Logs للتحقق

عند فشل الدفع، ستجد أخطاء في:
- **Browser Console**: رسائل الخطأ من `startMoyasarPayment()`
- **Server Logs**: رسائل من `logger.error("Moyasar create payment error")`

```log
❌ Moyasar create payment error: MOYASAR_SECRET_KEY is missing
❌ Moyasar create payment error: تعذر إنشاء رابط الدفع من ميسر
❌ Moyasar create payment error: لم ترسل ميسر رابط دفع صالح
```

---

## ملفات ذات صلة
- [client/src/lib/moyasar.ts](client/src/lib/moyasar.ts) - Client payment logic
- [server/routes.ts#L3371-L3680](server/routes.ts#L3371-L3680) - Moyasar endpoints
- [client/src/pages/Checkout.tsx](client/src/pages/Checkout.tsx) - Checkout page
- [server/environment.ts](server/environment.ts) - Environment validation
