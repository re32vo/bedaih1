import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Banknote, Smartphone, Heart } from "lucide-react";

export default function DonationMethods() {
  const methods = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "البطاقات الائتمانية",
      description: "تبرع بسهولة عبر Visa أو MasterCard أو American Express",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Banknote className="w-8 h-8" />,
      title: "التحويل البنكي",
      description: "حول أموالك مباشرة إلى حسابنا البنكي برقم IBAN",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "المحفظة الرقمية",
      description: "تبرع عبر Apple Pay أو Google Pay أو محافظ محلية",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "التبرع بالأجل",
      description: "تبرع شهري منتظم يساهم في استدامة برامجنا",
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">طرق التبرع</h1>
          <p className="text-xl text-slate-600">متعددة وآمنة لدعم جمعيتك</p>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {methods.map((method, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-lg ${method.color}`}>{method.icon}</div>
                  <CardTitle>{method.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{method.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات مهمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>
              <strong>الأمان والخصوصية:</strong> جميع عمليات التبرع محمية بأعلى معايير التشفير والأمان. لا نحتفظ ببيانات بطاقتك.
            </p>
            <p>
              <strong>الشفافية:</strong> نوضح لك كيفية استخدام تبرعك في دعم برامجنا الخيرية.
            </p>
            <p>
              <strong>الإيصالات:</strong> ستتلقى إيصال رسمي لكل تبرع لأغراض الضرائب والسجلات.
            </p>
            <p>
              <strong>الدعم:</strong> إذا واجهت أي مشاكل، تواصل معنا على support@bedaya.org
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






