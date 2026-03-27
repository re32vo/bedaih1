import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeneficiaryRequestForm from "@/components/BeneficiaryRequestForm";
import { Radio, Users, CheckCircle2 } from "lucide-react";

export default function ProgramsAwareness() {
  const activities = [
    { title: "الندوات التثقيفية", description: "ندوات توعوية عن الصحة والسلامة والتنمية الاجتماعية" },
    { title: "البرامج الإذاعية", description: "بث محتوى توعوي مباشر على المحطات الإذاعية" },
    { title: "المقالات التثقيفية", description: "نشر مقالات توعوية في المنصات الإعلامية" },
    { title: "الورش التدريبية", description: "تدريب عملي على مهارات حياتية ومهنية" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">البرامج التوعوية</h1>
          <p className="text-xl text-slate-600">تعزيز الوعي والمعرفة في المجتمع</p>
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






