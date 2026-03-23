import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeneficiaryRequestForm from "@/components/BeneficiaryRequestForm";
import { Heart, Users, Target, TrendingUp } from "lucide-react";

export default function ProgramsTreatment() {
  const programs = [
    { title: "المنطقة الآمنة", description: "هو برنامج توعوي وقائي يهدف إلى توعية المراهقين في دور الملاحظة والأحداث من خطر المخدرات" },
    { title: "بناء", description: "وهو برنامج تدريبي يقدم دورات في تحسين نفسية المستفيد للابتعاد عن السلوكيات السلبية" },
    { title: "نادي الرعاية اللاحقة", description: "إعادة تأهيل المستفيد وضمان سلامة عودته للاندماج مرة أخرى" },
    { title: "جيل واعي", description: "برنامج توعوي يضمن صناعة جيل واعي بكل ما يدور حوله" },
    { title: "حماية الأجيال", description: "يهدف إلى تعزيز القيم والمبادئ لدى أبناء اليوم وقادة المستقبل" },
    { title: "القرار الصحيح", description: "تعزيز القيم لدى الطلاب لاختيار القرارات الصحيحة في حياتهم المستقبلية" },
    { title: "مشروع إحياء", description: "برنامج علاجي يهدف إلى معالجة آثار التعاطي وإعادة التوجيه نحو الاستقرار النفسي والاجتماعي والمهني" },
    { title: "معًا نحو غد مشرق", description: "برنامج توعوي يهدف إلى توعية المستفيد ورفع مستوى الوعي في اختيار الصحبة الصالحة" },
    { title: "بيت أمن", description: "برنامج توعوي تثقيفي يهدف إلى توفير الأمان للمستفيد وأسرته" },
    { title: "الشفاء المشترك", description: "يهدف إلى تقبل الأسرة للمستفيد بعد عودته من رحلة الشفاء" },
    { title: "خلك واعي", description: "برنامج يهدف إلى المشاركة في الفعاليات والمؤتمرات وذلك لتوعية المجتمع من خطورة وأضرار المخدرات" },
    { title: "إرشادني", description: "تقديم استشارات نفسية واجتماعية للمستفيد وأسرته" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">البرامج العلاجية</h1>
          <p className="text-xl text-slate-600">برامج الجمعية المعتمدة</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <Heart className="w-6 h-6 text-red-500 mb-2" />
              <CardTitle className="text-lg">مستفيد</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">1,200+</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <Users className="w-6 h-6 text-blue-500 mb-2" />
              <CardTitle className="text-lg">متطوع</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">300+</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <Target className="w-6 h-6 text-emerald-500 mb-2" />
              <CardTitle className="text-lg">عملية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">180+</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <TrendingUp className="w-6 h-6 text-purple-500 mb-2" />
              <CardTitle className="text-lg">معدل النجاح</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">95%</p>
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
                <p className="text-slate-600">{program.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>عن البرامج العلاجية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              تركز البرامج العلاجية في جمعية بداية على توفير الرعاية الصحية الشاملة والعالية الجودة للأفراد والعائلات المحتاجة، بما يساهم في تحسين جودة حياتهم.
            </p>
            <p>
              نعمل على تقديم خدمات طبية متخصصة وشاملة تشمل الكشف الطبي والفحوصات والعمليات الجراحية والمتابعة الدورية.
            </p>
          </CardContent>
        </Card>

        <BeneficiaryRequestForm
          title="استمارة مستفيد للبرامج العلاجية"
          description="إذا كنت بحاجة إلى دعم علاجي أو صحي، عبئ النموذج التالي وسيتولى فريق الجمعية مراجعة الحالة والتواصل معك."
          assistanceOptions={[
            { value: "medical", label: "علاج ودواء" },
            { value: "financial", label: "مساعدة مالية للعلاج" },
            { value: "housing", label: "تجهيزات صحية منزلية" },
            { value: "education", label: "تثقيف صحي وتأهيل" },
          ]}
        />
      </div>
    </div>
  );
}






