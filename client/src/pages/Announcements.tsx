import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Calendar, MapPin } from "lucide-react";

export default function Announcements() {
  const announcements = [
    {
      date: "10 مارس 2026",
      title: "الإعلان عن التسجيل المفتوح للمتطوعين",
      description: "فتحنا باب التسجيل للمتطوعين الجدد في جميع المناطق",
      type: "تسجيل",
    },
    {
      date: "8 مارس 2026",
      title: "إغلاق المكتب في أيام الإجازة الرسمية",
      description: "تنبيه بإغلاق فروعنا خلال الإجازات الرسمية",
      type: "إشعار",
    },
    {
      date: "5 مارس 2026",
      title: "حملة تبرع خاصة لدعم برنامج التعليم",
      description: "إطلاق حملة تبرع موجهة لدعم الطلاب المحتاجين",
      type: "حملة",
    },
    {
      date: "1 مارس 2026",
      title: "ورشة عمل مجانية عن الصحة النفسية",
      description: "دعوة للجميع للحضور إلى ورشة عمل مجانية",
      type: "ورشة",
    },
    {
      date: "28 فبراير 2026",
      title: "تحديث نظام التبرع الإلكتروني",
      description: "تحسينات أمنية وتقنية على منصة التبرع",
      type: "تحديث",
    },
    {
      date: "25 فبراير 2026",
      title: "استقطاب متخصصين جدد",
      description: "نبحث عن متخصصين في المجالات الطبية والاجتماعية",
      type: "فرصة",
    },
  ];

  const typeColors: any = {
    تسجيل: "bg-blue-100 text-blue-800",
    إشعار: "bg-orange-100 text-orange-800",
    حملة: "bg-red-100 text-red-800",
    ورشة: "bg-purple-100 text-purple-800",
    تحديث: "bg-emerald-100 text-emerald-800",
    فرصة: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">الإعلانات والإخطارات</h1>
          <p className="text-xl text-slate-600 الإعلانات والفرص من جمعية بداية</p>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600                        <Calendar className="w-4 h-4" />
                        {announcement.date}
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColors[announcement.type]}`}>
                        {announcement.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-slate-600                  </div>
                  <Megaphone className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subscribe */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>المتابعة والتنبيهات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              تفعيل التنبيهات لتلقي آخر الإعلانات والفرص مباشرة
            </p>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition">
              فعّل التنبيهات
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






