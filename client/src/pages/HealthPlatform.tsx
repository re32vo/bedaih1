import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Stethoscope, Users, CheckCircle2 } from "lucide-react";

export default function HealthPlatform() {
  const services = [
    { title: "الفحوصات الطبية", description: "فحوصات صحية دورية ومتخصصة" },
    { title: "الاستشارات الطبية", description: "استشارات طبية مع أطباء متخصصين عبر الإنترنت" },
    { title: "البرامج التشجيرية", description: "برامج للوقاية من الأمراض المزمنة" },
    { title: "المتابعة الصحية", description: "متابعة دورية للمصابين والمرضى" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">منصة التطوع الصحي</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">رعاية صحية متطوعة لكل مجتمع</p>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Stethoscope className="w-5 h-5 text-blue-500" />
                  <CardTitle>{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Volunteers Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-red-500" />
                <CardTitle>متطوعونا الطبيون</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-700 dark:text-slate-300">
              <p>أطباء وممرضون متطوعون</p>
              <p>متخصصون في مجالات مختلفة</p>
              <p>مكرسون لخدمة المجتمع</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-emerald-500" />
                <CardTitle>الفئات المستهدفة</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-700 dark:text-slate-300">
              <p>الأطفال والأمهات</p>
              <p>كبار السن</p>
              <p>الأسر المحتاجة</p>
            </CardContent>
          </Card>
        </div>

        {/* How to Join */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <CardTitle>كيفية الانضمام</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
            <p>إذا كنت متخصصاً صحياً وترغب في التطوع:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>تواصل معنا على health@bedaya.org</li>
              <li>أرسل سيرتك الذاتية والشهادات</li>
              <li>اجتز المقابلة والتقييم</li>
              <li>انضم لفريقنا الصحي</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
