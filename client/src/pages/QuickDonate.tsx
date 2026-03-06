import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Heart, CheckCircle2 } from "lucide-react";

export default function QuickDonate() {
  const amounts = [50, 100, 250, 500, 1000, 2500];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">التبرع السريع</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">ساهم الآن بسرعة وسهولة</p>
        </div>

        {/* Quick Donate */}
        <Card className="max-w-2xl mx-auto mb-12">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              <CardTitle>اختر المبلغ</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  className="p-4 border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-lg font-semibold text-slate-900 dark:text-white transition"
                >
                  {amount} ر.س
                </button>
              ))}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">مبلغ مخصص</label>
              <div className="flex gap-2">
                <input type="number" placeholder="أدخل المبلغ" className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <span className="py-2 px-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold">ر.س</span>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition">
              <Heart className="w-5 h-5 inline-block mr-2" />
              تبرع الآن
            </button>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-3" />
              <CardTitle>سريع وآمن</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">إكمل تبرعك في ثوانٍ معدودة عبر طرق دفع آمنة</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CheckCircle2 className="w-6 h-6 text-blue-500 mb-3" />
              <CardTitle>بدون حد أدنى</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">بدون تحديد حد أدنى للتبرع، اختر ما يناسبك</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CheckCircle2 className="w-6 h-6 text-purple-500 mb-3" />
              <CardTitle>إيصال فوري</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">احصل على إيصال رسمي فوراً على بريدك الإلكتروني</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
