# دليل المطور - التصميم المتجاوب

## نقاط التوقف (Breakpoints) في Tailwind CSS

```javascript
// tailwind.config.ts
screens: {
  'sm': '640px',   // شاشات صغيرة وما فوق
  'md': '768px',   // أجهزة لوحية وما فوق
  'lg': '1024px',  // كمبيوتر محمول وما فوق
  'xl': '1280px',  // شاشات كبيرة وما فوق
  '2xl': '1536px'  // شاشات ضخمة وما فوق
}
```

## أفضل الممارسات

### 1. أحجام النصوص المتدرجة
```jsx
// ❌ غير محسّن
<h1 className="text-4xl">عنوان</h1>

// ✅ محسّن - يتدرج مع الشاشة
<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">عنوان</h1>
```

### 2. المسافات المتكيفة
```jsx
// ❌ غير محسّن
<div className="p-6 gap-8">

// ✅ محسّن - تقل على الموبايل
<div className="p-3 sm:p-4 md:p-6 gap-3 sm:gap-6 md:gap-8">
```

### 3. الشبكات المرنة
```jsx
// ❌ غير محسّن
<div className="grid grid-cols-4 gap-4">

// ✅ محسّن - عمود واحد على الموبايل
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
```

### 4. حجم الأزرار للمس
```jsx
// ❌ صغير جداً - أقل من 44px
<button className="h-8 px-3">زر</button>

// ✅ مناسب للمس - 44px على الأقل
<button className="h-10 sm:h-11 px-4 sm:px-6 touch-manipulation">
  زر
</button>
```

### 5. الصور المحسّنة
```jsx
// ❌ غير محسّن
<img src="/image.jpg" alt="صورة" className="w-full h-64" />

// ✅ محسّن - ارتفاع تدريجي + lazy loading
<img 
  src="/image.jpg" 
  alt="صورة" 
  loading="lazy"
  className="w-full h-36 sm:h-48 md:h-64 object-cover" 
/>
```

### 6. الأيقونات المتكيفة
```jsx
// ❌ حجم ثابت
<Icon className="w-6 h-6" />

// ✅ حجم متدرج
<Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:w-6" />
```

## فئات CSS المساعدة الجديدة

### Touch Manipulation
```jsx
// استخدمها على جميع العناصر التفاعلية
<button className="touch-manipulation">
  زر محسّن للمس
</button>
```

### Will Change (للعناصر المتحركة)
```jsx
<div className="will-change-transform hover:scale-105">
  عنصر متحرك
</div>
```

### Active Scale
```jsx
<button className="active-scale">
  ينكمش عند الضغط
</button>
```

## معايير التحسين

### الحد الأدنى لحجم النقر
- ✅ الأزرار: 44x44 px على الأقل
- ✅ الروابط: 48x48 px المساحة حولها
- ✅ حقول الإدخال: 44px ارتفاع

### أحجام الخطوط
```
موبايل:
- العناوين الرئيسية: 20-28px (text-xl - text-2xl)
- العناوين الفرعية: 16-20px (text-base - text-lg)
- النص العادي: 14-16px (text-sm - text-base)
- النص الصغير: 12-14px (text-xs - text-sm)

سطح المكتب:
- العناوين الرئيسية: 36-48px (text-4xl - text-5xl)
- العناوين الفرعية: 24-30px (text-2xl - text-3xl)
- النص العادي: 16-18px (text-base - text-lg)
- النص الصغير: 14px (text-sm)
```

### المسافات
```
موبايل: 12-16px (p-3 - p-4)
لوحي: 16-24px (p-4 - p-6)
سطح المكتب: 24-32px (p-6 - p-8)
```

## قائمة التحقق للمطورين

عند إضافة عنصر جديد للموقع:

- [ ] هل النصوص تتدرج مع حجم الشاشة؟
- [ ] هل الأزرار كبيرة بما يكفي للمس (44px+)؟
- [ ] هل الصور تستخدم `loading="lazy"`؟
- [ ] هل المسافات مناسبة للموبايل؟
- [ ] هل العناصر التفاعلية تستخدم `touch-manipulation`؟
- [ ] هل الشبكات تتكيف (grid-cols-1 → متعددة)؟
- [ ] هل البطاقات والعناصر المستديرة تتدرج (rounded-lg → rounded-2xl)؟
- [ ] هل تم اختبار العنصر على شاشة 320px؟

## أمثلة جاهزة

### بطاقة متجاوبة كاملة
```jsx
<div className="rounded-xl md:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 md:p-6 shadow-sm">
  <img 
    src="/image.jpg" 
    alt="عنوان"
    loading="lazy"
    className="w-full h-36 sm:h-44 md:h-52 rounded-lg sm:rounded-xl object-cover mb-3 sm:mb-4"
  />
  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">
    عنوان البطاقة
  </h3>
  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 sm:mb-4">
    وصف البطاقة يظهر هنا
  </p>
  <button className="w-full h-10 sm:h-11 rounded-lg sm:rounded-xl bg-sky-500 text-white font-bold text-sm sm:text-base touch-manipulation hover:bg-sky-600">
    زر التفاعل
  </button>
</div>
```

### قسم بعنوان وفواصل
```jsx
<section className="rounded-xl md:rounded-2xl border bg-white p-3 sm:p-4 md:p-6">
  <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center gap-2 sm:gap-4">
    <div className="h-px w-8 sm:w-16 md:w-20 lg:w-32 bg-slate-300" />
    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">
      عنوان القسم
    </h2>
    <div className="h-px w-8 sm:w-16 md:w-20 lg:w-32 bg-slate-300" />
  </div>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
    {/* المحتوى */}
  </div>
</section>
```

### زر عائم محسّن
```jsx
<button className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-sky-500 hover:bg-sky-600 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all hover:scale-110 touch-manipulation">
  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
</button>
```

## أدوات الاختبار

### في المتصفح (Chrome DevTools):
1. افتح DevTools (F12)
2. اضغط على أيقونة الجوال (Ctrl+Shift+M)
3. جرب المقاسات:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1280px+)

### اختبار سريع:
```bash
# في terminal المتصفح
document.documentElement.clientWidth
```

### Lighthouse Audit:
1. افتح DevTools
2. اذهب إلى "Lighthouse"
3. اختر "Mobile" و "Performance"
4. شغّل التحليل

الأهداف:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

تاريخ التحديث: 2026-03-10
