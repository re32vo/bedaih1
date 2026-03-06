import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

export default function Awards() {
  const awards = [
    { year: 2023, title: "جائزة أفضل جمعية خيرية", issuer: "وزارة الموارد البشرية والتنمية الاجتماعية" },
    { year: 2022, title: "شهادة التميز في العمل الإنساني", issuer: "المنظمة الوطنية للتنمية الاجتماعية" },
    { year: 2021, title: "جائزة الشفافية المالية", issuer: "جمعية المراجعين الداخليين" },
    { year: 2020, title: "شهادة الاعتماد الدولي ISO 9001", issuer: "هيئة الاعتماد الدولية" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">الجوائز والتكريمات</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">اعترافاً بجهودنا في خدمة المجتمع</p>
        </div>

        {/* Awards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {awards.map((award, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span className="text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-3 py-1 rounded-full">
                    {award.year}
                  </span>
                </div>
                <CardTitle className="text-lg">{award.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">جهة الإصدار: {award.issuer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <CardTitle>إنجازاتنا</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
            <p>
              تمثل هذه الجوائز والشهادات اعترافاً بالتزامنا المستمر بتقديم خدمات ذات جودة عالية وشفافية في العمل الخيري.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>تدريب أكثر من 5000 متطوع</li>
              <li>استفادة أكثر من 50,000 مستفيد من برامجنا</li>
              <li>تنفيذ أكثر من 100 مشروع خيري</li>
              <li>شراكات مع 20 منظمة دولية</li>
              <li>الحفاظ على معدل رضا المستفيدين 95%</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
