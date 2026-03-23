import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeneficiaryRequestForm from "@/components/BeneficiaryRequestForm";
import { BookOpen, Radio, Users, CheckCircle2 } from "lucide-react";

export default function ProgramsAwareness() {
  const activities = [
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
          <h1 className="text-4xl font-bold text-slate-900 mb-4">البرامج التوعوية</h1>
          <p className="text-xl text-slate-600">برامج الجمعية المعتمدة</p>
        </div>

        {/* Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {activities.map((activity, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <CardTitle>{activity.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{activity.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Topics */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <CardTitle>المواضيع الرئيسية</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "الصحة العامة",
                "الصحة النفسية",
                "التعليم والتطوير",
                "المهارات الحياتية",
                "حقوق الطفل",
                "تمكين المرأة",
              ].map((topic, index) => (
                <div key={index} className="bg-gradient-to-br from-emerald-100 to-blue-100 p-3 rounded-lg text-center">
                  <p className="text-slate-900 font-semibold">{topic}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>عن البرامج التوعوية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              تؤمن جمعية بداية بأن التوعية والتثقيف هما أساس التطور المجتمعي والاستدامة. نعمل على نشر الوعي من خلال برامج متنوعة وفعالة.
            </p>
            <p>
              نستهدف مختلف فئات المجتمع بمحتوى توعوي متخصص يتناول القضايا الصحية والاجتماعية والاقتصادية ذات الأهمية الحيوية.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>أكثر من 100 ندوة تثقيفية سنوياً</li>
              <li>برامج إذاعية أسبوعية</li>
              <li>شراكات مع المؤسسات التعليمية</li>
              <li>محتوى توعوي رقمي منتظم</li>
            </ul>
          </CardContent>
        </Card>

        <BeneficiaryRequestForm
          title="استمارة مستفيد للبرامج التوعوية"
          description="إذا كنت ترغب بالاستفادة من برامج التوعية أو التدريب أو الدعم المعرفي، عبئ البيانات التالية وسيتم فرز طلبك من فريق الجمعية."
          assistanceOptions={[
            { value: "education", label: "دعم تعليمي وتوعوي" },
            { value: "financial", label: "دعم رسوم برامج تدريبية" },
            { value: "food", label: "مساندة أسرية مرتبطة بالبرنامج" },
            { value: "medical", label: "إحالة لبرنامج توعية صحية" },
          ]}
        />
      </div>
    </div>
  );
}






