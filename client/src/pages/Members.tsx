import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Heart } from "lucide-react";

export default function Members() {
  const members = [
    { name: "أحمد محمد", position: "الرئيس التنفيذي", department: "الإدارة العليا" },
    { name: "فاطمة علي", position: "مدير العمليات", department: "العمليات" },
    { name: "محمود حسن", position: "مسؤول البرامج", department: "البرامج الخيرية" },
    { name: "نورا سارة", position: "مديرة الموارد البشرية", department: "الموارد البشرية" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">أعضاء الجمعية</h1>
          <p className="text-xl text-slate-600 متخصص مكرس لخدمة المجتمع</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Users className="w-8 h-8 text-emerald-500" />
              <div>
                <CardTitle>15 عضو</CardTitle>
                <CardDescription>فريق عمل رئيسي</CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Award className="w-8 h-8 text-blue-500" />
              <div>
                <CardTitle>خبرة 20+ سنة</CardTitle>
                <CardDescription>في العمل الخيري</CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Heart className="w-8 h-8 text-red-500" />
              <div>
                <CardTitle>4 دول</CardTitle>
                <CardDescription>تواجد دولي</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Members List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {members.map((member, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription>{member.position}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 {member.department}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>عن الفريق</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700            <p>
              يتكون فريق جمعية بداية من متخصصين في مجالات متعددة، مكرسين لتقديم أفضل الخدمات الخيرية للمجتمع. نعمل بروح الفريق الواحد لتحقيق أهدافنا المشتركة.
            </p>
            <p>
              من خلال خبراتنا المتنوعة وتفانينا في العمل، نسعى لإحداث تأثير إيجابي دائم في حياة الأفراد والعائلات.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






