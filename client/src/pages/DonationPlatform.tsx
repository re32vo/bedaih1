import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users, TrendingUp, Heart } from "lucide-react";

export default function DonationPlatform() {
  const features = [
    { title: "توزيع فعال", description: "نوصل تبرعاتك مباشرة للمحتاجين" },
    { title: "متابعة شاملة", description: "تابع رحلة تبرعك من البداية إلى النهاية" },
    { title: "تأثير مقاس", description: "شاهد الأثر المباشر لتبرعاتك" },
    { title: "تمويل آمن", description: "منصة آمنة وموثوقة للتبرعات" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">منصة التبرع</h1>
          <p className="text-xl text-slate-600 آمنة وشفافة للتبرعات الخيرية</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 text-emerald-500" />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Heart className="w-6 h-6 text-red-500 mb-3" />
              <CardTitle>التبرعات المستقبلة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 ر.س</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="w-6 h-6 text-blue-500 mb-3" />
              <CardTitle>المستفيدون</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="w-6 h-6 text-emerald-500 mb-3" />
              <CardTitle>معدل الشفافية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>كيفية عمل المنصة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-semibold text-slate-900 المشروع</p>
                  <p className="text-slate-600 text-sm">اختر المشروع أو البرنامج الذي تريد المساهمة فيه</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-semibold text-slate-900 بأمان</p>
                  <p className="text-slate-600 text-sm">تبرع عبر طرق دفع آمنة ومشفرة</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="font-semibold text-slate-900 الأثر</p>
                  <p className="text-slate-600 text-sm">شاهد كيفية استخدام تبرعك بالتفصيل</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






