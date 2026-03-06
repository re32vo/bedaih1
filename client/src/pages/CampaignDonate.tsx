import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Target, Users, TrendingUp } from "lucide-react";

export default function CampaignDonate() {
  const steps = [
    { title: "حدد حلمك", description: "ما الذي تريد جمع أموال له؟ برنامج، مشروع، أو قضية" },
    { title: "اكتب قصتك", description: "شارك رؤيتك وأهدافك بطريقة مؤثرة وملهمة" },
    { title: "اجمع التبرعات", description: "شارك حملتك مع أصدقائك والشبكات الاجتماعية" },
    { title: "حقق الحلم", description: "عندما تصل للهدف، نساعدك في تنفيذ المشروع" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">أطلق حملتك</h1>
          <p className="text-xl text-slate-600 حول حلمك إلى واقع بدعم الجميع</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Rocket className="w-6 h-6 text-orange-500 mb-3" />
              <CardTitle>حملة نشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">100+</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Target className="w-6 h-6 text-blue-500 mb-3" />
              <CardTitle>أموال مجموعة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">+10M</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="w-6 h-6 text-emerald-500 mb-3" />
              <CardTitle>حملات أنجزت</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">75+</p>
            </CardContent>
          </Card>
        </div>

        {/* Steps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">كيفية إطلاق حملتك</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                    <div>
                      <p className="font-semibold text-slate-900 text-lg">{step.title}</p>
                      <p className="text-slate-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              <CardTitle>فوائد إطلاق حملة</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-slate-700 
              <li>منصة موثوقة وآمنة لجمع الأموال</li>
              <li>دعم متكامل من فريق جمعية بداية</li>
              <li>وصول لآلاف المتبرعين المحتملين</li>
              <li>أدوات تسويقية قوية لنشر حملتك</li>
              <li>متابعة شفافة وآمنة للأموال المجموعة</li>
              <li>شهادات وإيصالات رسمية للمتبرعين</li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card>
          <CardHeader>
            <CardTitle>هل أنت مستعد لتغيير العالم؟</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 
              ابدأ حملتك اليوم وكن جزءاً من الحركة الاجتماعية التي تغير حياة الناس.
            </p>
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-lg transition">
              <Rocket className="w-5 h-5 inline-block mr-2" />
              ابدأ حملتك الآن
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}







