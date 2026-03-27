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
                <p className="text-slate-700">011 1234 5678</p>
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
              <p className="text-slate-700">director@bidayah.org</p>
              <p className="text-slate-600 text-sm mt-2">نرد على جميع الرسائل خلال 24 ساعة</p>
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
              <p className="text-slate-700">شارع الملك عبدالله</p>
              <p className="text-slate-600 text-sm">الرياض، المملكة العربية السعودية</p>
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
              <p className="text-slate-700">من 9 ص إلى 5 م</p>
              <p className="text-slate-600 text-sm">مغلق أيام الجمعة والسبت</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}






