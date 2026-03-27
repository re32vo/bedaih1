import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function DirectorContact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">بيانات التواصل مع الجمعية</h1>
          <p className="text-xl text-slate-600">للتواصل مع  جمعية بداية واستقبال آرائكم واقتراحاتكم</p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Phone className="w-6 h-6 text-blue-500" />
                <CardTitle>الهاتف</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
                <p className="text-slate-700">966596282033+</p>
                <p className="text-slate-600 text-sm mt-2">مباشر من الساعة 9 صباحاً حتى 5 مساءً</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-red-500" />
                <CardTitle>البريد الإلكتروني</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">bedaya.org.sa@gmail.com</p>
              <p className="text-slate-600 text-sm mt-2">ساعات العمل الرسمية: 8:00 ص - 4:00 م</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-emerald-500" />
                <CardTitle>العنوان</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">حي الربوة طريق الملك فهد الفرعي</p>
              <p className="text-slate-600 text-sm">جده، المملكة العربية السعودية</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-purple-500" />
                <CardTitle>ساعات العمل</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">ساعات العمل الرسمية: 8:00 ص - 4:00 م</p>
              <p className="text-slate-600 text-sm">ايام العمل الرسمية من الأحد إلى الخميس</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}






