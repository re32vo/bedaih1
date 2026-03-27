import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, TrendingUp, Calendar } from "lucide-react";

export default function VolunteerReports() {
  const reports = [
    { month: "ديسمبر 2025", volunteers: "-", hours: "-", projects: "-" },
    { month: "نوفمبر 2025", volunteers: "-", hours: "-", projects: "-" },
    { month: "أكتوبر 2025", volunteers: "-", hours: "-", projects: "-" },
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
              <CardTitle className="text-lg">إجمالي المتطوعين</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">-</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <Calendar className="w-6 h-6 text-blue-500 mb-2" />
              <CardTitle className="text-lg">إجمالي ساعات التطوع</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">-</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <FileText className="w-6 h-6 text-purple-500 mb-2" />
              <CardTitle className="text-lg">عدد المشاريع</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">-</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <BarChart3 className="w-6 h-6 text-orange-500 mb-2" />
              <CardTitle className="text-lg">متوسط المتطوعين شهرياً</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">-</p>
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
                      <p className="text-slate-600 text-sm mb-1">ساعات التطوع</p>
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


      </div>
    </div>
  );
}






