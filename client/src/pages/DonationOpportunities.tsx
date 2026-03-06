import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Users, Target, Heart } from "lucide-react";

export default function DonationOpportunities() {
  const opportunities = [
    {
      title: "برنامج تعليم الأطفال",
      description: "ساعد الأطفال المحرومين على الحصول على التعليم الجيد",
      needsAmount: "50,000 ر.س",
      impact: "100 طالب",
      icon: "📚",
    },
    {
      title: "عمليات طبية حتمية",
      description: "ساهم في إجراء عمليات جراحية تنقذ الأرواح",
      needsAmount: "100,000 ر.س",
      impact: "10 حالات",
      icon: "⚕️",
    },
    {
      title: "برنامج الإسكان الطارئ",
      description: "وفر مأوى آمن للعائلات بلا مأوى",
      needsAmount: "75,000 ر.س",
      impact: "20 أسرة",
      icon: "🏠",
    },
    {
      title: "برنامج الأمن الغذائي",
      description: "وفر الغذاء الصحي للعائلات الجائعة",
      needsAmount: "30,000 ر.س",
      impact: "500 شخص",
      icon: "🍲",
    },
    {
      title: "دعم الحرفيين والصغار",
      description: "ساعد الشباب على بدء مشاريعهم الخاصة",
      needsAmount: "60,000 ر.س",
      impact: "30 شاب",
      icon: "🔧",
    },
    {
      title: "برنامج الرعاية العمرو",
      description: "كفالة شاملة لكبار السن المحتاجين",
      needsAmount: "40,000 ر.س",
      impact: "50 مسن",
      icon: "👴",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">فرص التبرع</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">اختر المجال الذي يلمس قلبك والساهم فيه</p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {opportunities.map((opportunity, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 p-4 text-center">
                <div className="text-5xl mb-2">{opportunity.icon}</div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{opportunity.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-600 dark:text-slate-300 text-sm">{opportunity.description}</p>
                <div className="space-y-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">المبلغ المطلوب:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{opportunity.needsAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">المتوقع الاستفادة:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{opportunity.impact}</span>
                  </div>
                </div>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition">
                  ساهم الآن
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How to Choose */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <CardTitle>كيفية اختيار فرصتك</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              اختر المجال الذي يناسب قيمك واهتماماتك. كل فرصة تبرع لها أثر مباشر وقابل للقياس.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <Heart className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">حسب الشغف</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">اختر ما يهمك من برامج</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Target className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">حسب الأثر</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">اختر الفئات الأكثر احتياجاً</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">حسب الفئة</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">دعم فئة محددة من المجتمع</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">حسب المشروع</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">مشروع معين يقترحه آخرون</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle>تصفية الفرص</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">المجال</label>
                <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg">
                  <option>كل المجالات</option>
                  <option>التعليم</option>
                  <option>الصحة</option>
                  <option>الإسكان</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">نطاق الميزانية</label>
                <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg">
                  <option>كل الميزانيات</option>
                  <option>أقل من 30,000</option>
                  <option>30,000 - 70,000</option>
                  <option>أكثر من 70,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">الأثر</label>
                <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg">
                  <option>الأكثر استعجالية</option>
                  <option>الأكثر تأثيراً</option>
                  <option>الأقرب للانتهاء</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
