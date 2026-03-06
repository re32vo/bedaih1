import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Clock, MapPin } from "lucide-react";

export default function VolunteerForm() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">استمارة التطوع</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">كن جزءاً من صنع الفرق في مجتمعك</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Users className="w-6 h-6 text-emerald-500 mb-3" />
              <CardTitle>بناء علاقات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">تقابل أشخاصاً جدداً وتبني علاقات قيمة</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <FileText className="w-6 h-6 text-blue-500 mb-3" />
              <CardTitle>تطوير المهارات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">طور مهاراتك وكسب خبرة عملية قيمة</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MapPin className="w-6 h-6 text-red-500 mb-3" />
              <CardTitle>أثر حقيقي</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">ساهم في تحسين حياة الآخرين مباشرة</p>
            </CardContent>
          </Card>
        </div>

        {/* Form Info */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>متطلبات التطوع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
            <ul className="list-disc list-inside space-y-2">
              <li>أن تكون بعمر 18 سنة فما فوق</li>
              <li>امتلاك الشغف والرغبة في خدمة المجتمع</li>
              <li>الالتزام بالمواعيد والمسؤوليات</li>
              <li>اجتياز مقابلة تعريفية</li>
              <li>قضاء ساعة تدريب على الأقل</li>
            </ul>
          </CardContent>
        </Card>

        {/* How to Apply */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-purple-500" />
              <CardTitle>كيفية التقديم</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="font-bold text-emerald-500">1.</span>
                <p>قم بملء استمارة التطوع الإلكترونية</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-emerald-500">2.</span>
                <p>سيتمكن معنا خلال 3-5 أيام عمل</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-emerald-500">3.</span>
                <p>حضور جلسة توجيهية على Zoom</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-emerald-500">4.</span>
                <p>ابدأ تطوعك مع الفريق!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
