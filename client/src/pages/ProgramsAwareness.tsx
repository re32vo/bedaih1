import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Radio, Users, CheckCircle2 } from "lucide-react";

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
      </div>
    </div>
  );
}






