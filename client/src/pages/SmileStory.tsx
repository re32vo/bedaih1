import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, Heart, Users, Award } from "lucide-react";

export default function SmileStory() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">قصة بداية</h1>
          <p className="text-xl text-slate-600">قصص نجاح حقيقية من الأشخاص الذين ساعدناهم</p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Heart className="w-6 h-6 text-red-500 mb-3" />
              <CardTitle>-</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">-</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Smile className="w-6 h-6 text-yellow-500 mb-3" />
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">-</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Award className="w-6 h-6 text-purple-500 mb-3" />
              <CardTitle>-</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">-</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}






