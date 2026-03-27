import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BriefcaseBusiness, BadgeCheck } from "lucide-react";

export default function Members() {
  const executiveTeam = [
    { name: "أحمد محمد", position: "الرئيس التنفيذي", department: "الإدارة العليا" },
    { name: "فاطمة علي", position: "مدير العمليات", department: "العمليات" },
    { name: "محمود حسن", position: "مسؤول البرامج", department: "البرامج الخيرية" },
    { name: "نورا سارة", position: "مديرة الموارد البشرية", department: "الموارد البشرية" },
  ];

  const generalAssemblyMembers = Array.from({ length: 21 }, (_, index) => ({
    id: index + 1,
    image: `/now/${index + 1}.jpg`,
  }));

  const [activeSection, setActiveSection] = useState<"general-assembly" | "executive-team" | "experience">("general-assembly");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">الهيكل الإداري</h1>
          <p className="text-xl text-slate-600">تعرف على الجمعية العمومية والفريق التنفيذي والخبرة</p>
        </div>

        {/* Toggle Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button type="button" onClick={() => setActiveSection("general-assembly")} className="text-right">
            <Card className={`transition-all ${activeSection === "general-assembly" ? "border-slate-900 shadow-md" : "hover:shadow-sm"}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <Users className="w-8 h-8 text-emerald-500" />
                <div>
                  <CardTitle>الجمعية العمومية</CardTitle>
                  <CardDescription>عدد أعضاء الجمعية العمومية الحالي</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </button>

          <button type="button" onClick={() => setActiveSection("executive-team")} className="text-right">
            <Card className={`transition-all ${activeSection === "executive-team" ? "border-slate-900 shadow-md" : "hover:shadow-sm"}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <BriefcaseBusiness className="w-8 h-8 text-blue-500" />
                <div>
                  <CardTitle>الفريق التنفيذي</CardTitle>
                  <CardDescription>كوادر تقود العمل اليومي للجمعية</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </button>

          <button type="button" onClick={() => setActiveSection("experience")} className="text-right">
            <Card className={`transition-all ${activeSection === "experience" ? "border-slate-900 shadow-md" : "hover:shadow-sm"}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <BadgeCheck className="w-8 h-8 text-amber-500" />
              <div>
                <CardTitle>الإعتمادات</CardTitle>
                <CardDescription>-</CardDescription>
              </div>
              </CardHeader>
            </Card>
          </button>
        </div>

        {/* Active Content */}
        <Card className="mt-12">
          {activeSection === "general-assembly" && (
            <>
              <CardHeader>
                <CardTitle>الجمعية العمومية</CardTitle>
                <CardDescription>عدد أعضاء الجمعية العمومية الحالي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-700">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-500 mb-2">عدد الأعضاء</p>
                  <p className="text-4xl font-extrabold text-slate-900">21 عضو</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {generalAssemblyMembers.map((member) => (
                    <div key={member.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <img
                        src={member.image}
                        alt={`عضو الجمعية العمومية ${member.id}`}
                        className="w-full h-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {activeSection === "executive-team" && (
            <>
              <CardHeader>
                <CardTitle>الفريق التنفيذي</CardTitle>
                <CardDescription>كوادر متخصصة تشرف على تشغيل الجمعية وبرامجها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {executiveTeam.map((member, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription>{member.position}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600">{member.department}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {activeSection === "experience" && (
            <>
              <CardHeader>
                <CardTitle>الخبرة</CardTitle>
                <CardDescription>-</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-700">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-lg font-bold text-slate-900 mb-3">الخبرة :-</p>
                  <p className="text-slate-600">-</p>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}






