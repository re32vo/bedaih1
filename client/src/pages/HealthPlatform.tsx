import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Stethoscope, Users, CheckCircle2 } from "lucide-react";

export default function HealthPlatform() {
  const services = [
    { title: "التوعية الوقائية", description: "مشاركة المتطوعين في حملات ومحاضرات توعوية عن أضرار المخدرات" },
    { title: "الإرشاد والمساندة", description: "دعم المستفيدين وأسرهم بالتوجيه الأولي والإحالة المناسبة" },
    { title: "الرعاية اللاحقة", description: "مساندة المتعافين في برامج المتابعة والثبات على التعافي" },
    { title: "تنظيم المبادرات", description: "المشاركة في المعارض وورش العمل والفعاليات المجتمعية" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">منصة التطوع الصحي</h1>
          <p className="text-xl text-slate-600">مسار تطوعي لدعم الوقاية والتعافي وخدمة المستفيدين وأسرهم</p>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Stethoscope className="w-5 h-5 text-blue-500" />
                  <CardTitle>{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Volunteers Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-red-500" />
                <CardTitle>مجالات التطوع</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-700">
              <p>التوعية والوقاية</p>
              <p>الإرشاد والمساندة الأسرية</p>
              <p>تنظيم المبادرات والفعاليات</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-emerald-500" />
                <CardTitle>الفئات المستهدفة</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-700">
              <p>مرضى الإدمان وأسرهم</p>
              <p>المتعافون في مرحلة الرعاية اللاحقة</p>
              <p>فئات المجتمع المستهدفة بالتوعية الوقائية</p>
            </CardContent>
          </Card>
        </div>

        {/* How to Join */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <CardTitle>كيفية الانضمام</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>إذا كنت ترغب في التطوع ضمن برامج جمعية بداية:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>عبئ استمارة التطوع من الموقع</li>
              <li>حدد المجال التطوعي المناسب لخبرتك واهتمامك</li>
              <li>ينسق معك فريق الجمعية للتعريف بالمهام</li>
              <li>انضم للمبادرات والبرامج حسب الاحتياج</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}





