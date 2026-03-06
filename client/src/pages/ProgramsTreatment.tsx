import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Target, TrendingUp } from "lucide-react";

export default function ProgramsTreatment() {
  const programs = [
    { title: "الرعاية الطبية", description: "توفير الرعاية الطبية الشاملة للمحتاجين" },
    { title: "البرامج الدوائية", description: "توزيع الأدوية والدعم الطبي للعائلات المحتاجة" },
    { title: "العمليات الجراحية", description: "تمويل العمليات الجراحية الضرورية" },
    { title: "الفحوصات الطبية", description: "توفير الفحوصات الطبية الدورية والكشف المبكر" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">البرامج العلاجية</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">رعاية صحية شاملة للمحتاجين</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <Heart className="w-6 h-6 text-red-500 mb-2" />
              <CardTitle className="text-lg">مستفيد</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">15,000+</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <Users className="w-6 h-6 text-blue-500 mb-2" />
              <CardTitle className="text-lg">متطوع</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">500+</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <Target className="w-6 h-6 text-emerald-500 mb-2" />
              <CardTitle className="text-lg">عملية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">2,500+</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <TrendingUp className="w-6 h-6 text-purple-500 mb-2" />
              <CardTitle className="text-lg">معدل النجاح</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">98%</p>
            </CardContent>
          </Card>
        </div>

        {/* Programs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {programs.map((program, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{program.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">{program.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>عن البرامج العلاجية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
            <p>
              تركز البرامج العلاجية في جمعية بداية على توفير الرعاية الصحية الشاملة والعالية الجودة للأفراد والعائلات المحتاجة، بما يساهم في تحسين جودة حياتهم.
            </p>
            <p>
              نعمل على تقديم خدمات طبية متخصصة وشاملة تشمل الكشف الطبي والفحوصات والعمليات الجراحية والمتابعة الدورية.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
