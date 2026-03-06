import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, TrendingUp, Calendar } from "lucide-react";

export default function VolunteerReports() {
  const reports = [
    { month: "ديسمبر 2025", volunteers: 450, hours: 1800, projects: 12 },
    { month: "نوفمبر 2025", volunteers: 420, hours: 1680, projects: 11 },
    { month: "أكتوبر 2025", volunteers: 410, hours: 1640, projects: 10 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">التقارير التطوعية</h1>
          <p className="text-xl text-slate-600">تفصيلية عن نشاطاتنا التطوعية</p>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <TrendingUp className="w-6 h-6 text-emerald-500 mb-2" />
              <CardTitle className="text-lg">متطوع نشط</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">450</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <Calendar className="w-6 h-6 text-blue-500 mb-2" />
              <CardTitle className="text-lg">ساعات في الشهر</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">1,800</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <FileText className="w-6 h-6 text-purple-500 mb-2" />
              <CardTitle className="text-lg">مشروع</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">12</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <BarChart3 className="w-6 h-6 text-orange-500 mb-2" />
              <CardTitle className="text-lg">معدل الرضا</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">94%</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Reports */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">التقارير الشهرية</h2>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{report.month}</CardTitle>
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-slate-600 text-sm mb-1">عدد المتطوعين</p>
                      <p className="text-2xl font-bold text-slate-900">{report.volunteers}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm mb-1">ساعات العمل</p>
                      <p className="text-2xl font-bold text-slate-900">{report.hours}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm mb-1">عدد المشاريع</p>
                      <p className="text-2xl font-bold text-slate-900">{report.projects}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Download Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-500" />
              <CardTitle>تحميل التقارير الكاملة</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              يمكنك تحميل التقارير الشاملة بصيغة PDF للاطلاع على التفاصيل الكاملة لأنشطتنا التطوعية.
            </p>
            <div className="space-y-2">
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                تحميل التقرير السنوي 2025
              </button>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                تحميل التقرير النصف سنوي
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






