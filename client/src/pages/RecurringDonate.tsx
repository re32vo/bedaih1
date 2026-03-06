import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";

export default function RecurringDonate() {
  const plans = [
    {
      name: "الخطة الأساسية",
      amount: 50,
      frequency: "شهري",
      description: "ساهم بشكل منتظم برمز التزامك المستمر",
      benefits: ["متابعة شهرية", "إيصالات رسمية", "شهادة تقدير"],
    },
    {
      name: "الخطة المميزة",
      amount: 150,
      frequency: "شهري",
      description: "دعم متعمق للبرامج الأساسية",
      benefits: ["متابعة مميزة", "تقارير شاملة", "دعوة لفعالياتنا"],
    },
    {
      name: "الخطة الفاخرة",
      amount: 500,
      frequency: "شهري",
      description: "شراكة عميقة في رؤية الجمعية",
      benefits: ["اجتماع ربع سنوي", "تقارير شاملة", "تميز في الفعاليات"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">التبرع الدوري</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">التزم بدعم مستمر لأجل أكبر</p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <Card key={index} className={`cursor-pointer transition-all ${index === 1 ? "ring-2 ring-emerald-500 transform md:scale-105" : ""}`}>
              <CardHeader>
                {index === 1 && <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 w-fit">الأشهر</div>}
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{plan.amount}</span>
                  <span className="text-slate-600 dark:text-slate-400">ر.س / {plan.frequency}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2 rounded-lg font-semibold transition ${index === 1 ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "border-2 border-slate-300 hover:border-emerald-500"}`}>
                  اختر هذه الخطة
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-red-500" />
              <CardTitle>فوائد التبرع الدوري</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <TrendingUp className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">تأثير مستدام</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">دعم مستمر يسمح لنا بتخطيط برامج طويلة الأجل</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">مرونة كاملة</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">يمكنك تعديل أو إيقاف الخطة في أي وقت</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-purple-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">متابعة شاملة</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">تقارير منتظمة عن أثر تبرعك</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Heart className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">شعور بالفرق</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">شاهد تأثيرك المباشر على حياة الناس</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>الأسئلة الشائعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white mb-2">هل يمكنني تغيير مبلغ التبرع؟</p>
              <p className="text-slate-600 dark:text-slate-300 text-sm">نعم، يمكنك تغيير المبلغ في أي وقت من خلال حسابك</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white mb-2">هل هناك رسوم إضافية؟</p>
              <p className="text-slate-600 dark:text-slate-300 text-sm">لا، بدون أي رسوم إضافية، 100% من تبرعك يذهب للبرامج</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white mb-2">كم مدة الالتزام؟</p>
              <p className="text-slate-600 dark:text-slate-300 text-sm">لا توجد مدة التزام، يمكنك الإيقاف في أي وقت</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
