import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Search } from "lucide-react";

export default function MediaLibrary() {
  const resources = [
    { title: "الكتيبات التثقيفية", count: 25, type: "PDF" },
    { title: "الفيديوهات التوعوية", count: 50, type: "فيديو" },
    { title: "المقالات الصحفية", count: 100, type: "مقال" },
    { title: "الدراسات والأبحاث", count: 15, type: "دراسة" },
    { title: "الملصقات التوعوية", count: 40, type: "صورة" },
    { title: "المقاطع الصوتية", count: 30, type: "صوت" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">المكتبة الإعلامية</h1>
          <p className="text-xl text-slate-600">مورد شامل للمحتوى التثقيفي والإعلامي</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute right-4 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث في المكتبة..."
              className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {resources.map((resource, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <BookOpen className="w-6 h-6 text-emerald-500" />
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                    {resource.type}
                  </span>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 font-semibold">{resource.count} عنصر</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-500" />
              <CardTitle>المحتوى المميز</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-r-4 border-emerald-500 pr-4">
                <p className="font-semibold text-slate-900">الدليل الشامل للصحة النفسية</p>
                <p className="text-sm text-slate-600 mt-1">كتيب شامل يغطي جميع جوانب الصحة النفسية</p>
              </div>
              <div className="border-r-4 border-blue-500 pr-4">
                <p className="font-semibold text-slate-900">فيديوهات حياتك أهم</p>
                <p className="text-sm text-slate-600 mt-1">50 فيديو توعوي عن المهارات الحياتية</p>
              </div>
              <div className="border-r-4 border-purple-500 pr-4">
                <p className="font-semibold text-slate-900">مجلة جمعية بداية الشهرية</p>
                <p className="text-sm text-slate-600 mt-1">مجلة شاملة تصدر كل شهر</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






