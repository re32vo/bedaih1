import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "فاطمة محمد",
      role: "مستفيدة من برنامج الرعاية الطبية",
      text: "جمعية بداية غيرت حياتي تماماً. حصلت على العلاج الذي احتاجه بعد سنوات من المعاناة. شكراً لكم من القلب.",
      rating: 5,
    },
    {
      name: "أحمد علي",
      role: "متطوع نشط",
      text: "العمل مع جمعية بداية أعطاني شعوراً بالرضا والإنجاز. تجربة متميزة وفريق رائع جداً.",
      rating: 5,
    },
    {
      name: "نورا سارة",
      role: "مانحة وداعمة",
      text: "أتابع تطبيقات تبرعاتي وأرى الأثر المباشر. شفافية وكفاءة عالية جداً. أنصح الجميع بدعمهم.",
      rating: 5,
    },
    {
      name: "محمود حسن",
      role: "رب أسرة مستفيدة",
      text: "برنامج الدعم التعليمي ساعد أطفالي كثيراً في دراستهم. شكري الدائم لجميع فريق جمعية بداية.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">قالوا عن الجمعية</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">تجارب حقيقية من المستفيدين والمتطوعين</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <Quote className="w-8 h-8 text-emerald-500 opacity-40 absolute top-4 right-4" />
                <div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                </div>
                <div className="flex gap-1 mt-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 italic">\"{testimonial.text}\"</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Heart className="w-6 h-6 text-red-500 mb-3" />
              <CardTitle>رضا العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">95%</p>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">of customers are satisfied</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Star className="w-6 h-6 text-yellow-500 mb-3" />
              <CardTitle>التقييم العام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">4.8</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Heart className="w-6 h-6 text-emerald-500 mb-3" />
              <CardTitle>التقييمات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">1,200+</p>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">تقييمات موثقة</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
