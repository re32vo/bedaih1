import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Briefcase, BarChart3 } from "lucide-react";

export default function Governance() {
  const principles = [
    { title: "الشفافية", description: "نعمل بشفافية تامة في جميع تعاملتنا المالية والإدارية" },
    { title: "المساءلة", description: "نتحمل المسؤولية الكاملة تجاه المستفيدين والمانحين" },
    { title: "الكفاءة", description: "نستخدم الموارد بكفاءة عالية لتحقيق أقصى تأثير" },
  ];

  const structure = [
    { title: "الجمعية العمومية", description: "أعلى سلطة تشريعية في الجمعية" },
    { title: "مجلس الإدارة", description: "يشرف على العمليات الإدارية والمالية" },
    { title: "اللجان المتخصصة", description: "تتولى مسؤوليات برامج وعمليات محددة" },
    { title: "الإدارة التنفيذية", description: "تنفذ قرارات مجلس الإدارة" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">الحوكمة</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">إطار عمل يضمن الشفافية والمساءلة</p>
        </div>

        {/* Core Principles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">المبادئ الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {principles.map((principle, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <CardTitle>{principle.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Organizational Structure */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">الهيكل التنظيمي</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {structure.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-6 h-6 text-blue-500" />
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Governance Policies */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-purple-500" />
              <CardTitle>سياسات الحوكمة</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
            <p>
              تعتمد جمعية بداية على مجموعة شاملة من السياسات والإجراءات التي تضمن إدارة فعالة وشفافة، مما يعكس التزامنا بأعلى معايير الحوكمة.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>سياسة مكافحة الفساد والرشوة</li>
              <li>سياسة الافصاح والشفافية المالية</li>
              <li>سياسة حقوق الموظفين</li>
              <li>سياسة حماية البيانات والخصوصية</li>
              <li>سياسة إدارة المخاطر</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
