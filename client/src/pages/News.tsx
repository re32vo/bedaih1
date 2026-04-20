import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Calendar, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function News() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const news = [
    {
      date: "5 مارس 2026",
      title: "إطلاق برنامج جديد للدعم التعليمي",
      excerpt: "بدأت جمعية بداية برنامجاً جديداً لدعم الطلاب المحتاجين في المدارس الحكومية.",
      image: "📚",
    },
    {
      date: "1 مارس 2026",
      title: "حملة التبرع الربيعية تجاوزت الهدف",
      excerpt: "حققت حملتنا الخيرية نتائج رائعة وتجاوزت الهدف المخطط بنسبة 150%.",
      image: "🎉",
    },
    {
      date: "25 فبراير 2026",
      title: "تكريم المتطوعين المميزين",
      excerpt: "كرمت الجمعية 50 متطوعاً مميزاً لدورهم الفعال خلال هذا العام.",
      image: "🏆",
    },
    {
      date: "20 فبراير 2026",
      title: "توسيع خدماتنا إلى 3 مناطق جديدة",
      excerpt: "أعلنت جمعية بداية عن توسيع نطاق خدماتها لتشمل 3 مناطق جغرافية جديدة.",
      image: "🌍",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">الأخبار والتحديثات</h1>
          <p className="text-xl text-slate-600">تابع المستجدات من جمعية بداية</p>
        </div>

        {/* News List */}
        <div className="space-y-6">
          {news.map((item, index) => (
            <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-4xl">{item.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-600 mb-4">{item.excerpt}</p>
                <button onClick={() => toast({ title: "قريباً", description: "تفصيل الأخبار سيكون متاحاً قريباً" })} className="flex items-center gap-2 text-emerald-500 hover:text-emerald-600 font-semibold cursor-pointer">
                  اقرأ المزيد
                  <ArrowRight className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-12">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Newspaper className="w-6 h-6 text-blue-500" />
              <CardTitle>اشترك في النشرة البريدية</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              تلقَ آخر الأخبار والتحديثات مباشرة في بريدك الإلكتروني
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button onClick={() => {
                if (!email.trim() || !email.includes('@')) {
                  toast({ title: "خطأ", description: "أدخل بريداً إلكترونياً صحيحاً", variant: "destructive" });
                  return;
                }
                toast({ title: "تم الاشتراك", description: "سيصلك آخر الأخبار على بريدك الإلكتروني" });
                setEmail("");
              }} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-lg transition cursor-pointer">
                اشترك
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






