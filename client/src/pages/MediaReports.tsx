import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, FileText } from "lucide-react";

export default function MediaReports() {
  const reports = [
    { id: "annual-2025", title: "التقرير السنوي 2025", date: "ديسمبر 2025" },
    { id: "financial-2025", title: "التقرير المالي السنوي 2025", date: "يناير 2026" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">التقارير الدورية</h1>
          <p className="text-xl text-slate-600">نظرة شاملة عن إنجازاتنا وأثرنا المجتمعي</p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {reports.map((report, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">{report.date}</p>
                  </div>
                  <FileText className="w-6 h-6 text-blue-500 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <TrendingUp className="w-6 h-6 text-emerald-500 mb-3" />
              <CardTitle>النمو السنوي</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">-</p>
              <p className="text-sm text-slate-600 mt-2">-</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="w-6 h-6 text-blue-500 mb-3" />
              <CardTitle>الاستثمار في المجتمع</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">-</p>
              <p className="text-sm text-slate-600 mt-2">-</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <FileText className="w-6 h-6 text-purple-500 mb-3" />
              <CardTitle>أعداد التقارير</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">-</p>
              <p className="text-sm text-slate-600 mt-2">-</p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>اعرف المزيد عن التقارير</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              تنشر جمعية بداية تقارير شاملة بشكل دوري لتعكس شفافيتها وتقدمها في تحقيق أهدافها.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>تقارير سنوية شاملة عن الإنجازات والنشاطات</li>
              <li>تقارير مالية تفصيلية عن استخدام الموارد</li>
              <li>تقارير تأثير اجتماعي توثق النتائج والأثر</li>
              <li>تقارير شهرية عن البرامج والأنشطة الجارية</li>
              <li>جميع التقارير متاحة للعامة للاطلاع والتحميل</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






