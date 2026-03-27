import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, Heart, Users, Award } from "lucide-react";

export default function SmileStory() {
  const stories = [
    {
      name: "-",
      age: 8,
      story: "-",
      image: "🎓",
    },
    {
      name: "-",
      age: 45,
      story: "-",
      image: "❤️",
    },
    {
      name: "-",
      age: 16,
      story: "-",
      image: "🌟",
    },
    {
      name: "-",
      size: 6,
      story: "-",
      image: "🏠",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">قصة بداية</h1>
          <p className="text-xl text-slate-600">قصص نجاح حقيقية من الأشخاص الذين ساعدناهم</p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {stories.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl">{item.name}</CardTitle>
                    <p className="text-emerald-100 text-sm mt-1">
                      {'age' in item ? `العمر: ${item.age} سنة` : `الحجم: ${item.size} أفراد`}
                    </p>
                  </div>
                  <div className="text-4xl">{item.image}</div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 leading-relaxed">{item.story}</p>
              </CardContent>
            </Card>
          ))}
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






