import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Heart, Users } from "lucide-react";

export default function TributeDonate() {
  const occasions = [
    { title: "في ذكرى عزيز", icon: "🕯️", description: "خلد ذكرى أحبائك برسالة حب عبر تبرع" },
    { title: "بمناسبة زفاف", icon: "💍", description: "شارك فرحتك مع المحتاجين في يومك الخاص" },
    { title: "لحفل ميلاد", icon: "🎂", description: "اجعل عيد ميلادك مميزاً بالعطاء للآخرين" },
    { title: "للشفاء", icon: "⚕️", description: "تمنى للمريض الشفاء العاجل برسالة دعم" },
    { title: "لتحقيق حلم", icon: "✨", description: "احتفل بإنجازاتك بمشاركة النعم مع الآخرين" },
    { title: "بدون مناسبة", icon: "❤️", description: "تبرع للخير في أي وقت وبأي مناسبة" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">إهداء التبرع</h1>
          <p className="text-xl text-slate-600 مناسباتك بالعطاء للآخرين</p>
        </div>

        {/* Occasions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {occasions.map((occasion, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-3">
                <div className="text-5xl mb-3">{occasion.icon}</div>
                <CardTitle className="text-lg">{occasion.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center text-sm mb-4">{occasion.description}</p>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition">
                  اختر هذه المناسبة
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>كيفية عمل إهداء التبرع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-semibold text-slate-900 المناسبة</p>
                  <p className="text-slate-600 text-sm">حدد المناسبة التي تود الإهداء بها</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-semibold text-slate-900 البيانات</p>
                  <p className="text-slate-600 text-sm">اسم المهدى إليه والرسالة (اختيارية)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="font-semibold text-slate-900 وأهد</p>
                  <p className="text-slate-600 text-sm">أكمل عملية التبرع وأرسل الإهداء</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <p className="font-semibold text-slate-900 شهادة</p>
                  <p className="text-slate-600 text-sm">استقبل شهادة رسمية للإهداء</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Gift className="w-6 h-6 text-emerald-500" />
              <CardTitle>مثال على رسالة الإهداء</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-700 text-sm leading-relaxed">
              \"بسم الله الرحمن الرحيم، تم إهداء هذا التبرع إلى روح عزيزنا [الاسم] الذي غادرنا، تبرع أهداه [اسم المهدي] حفظه الله. اللهم اجعله له صدقة جارية. نسأل الله أن تنفع به المحتاجين.\"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






