import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useVolunteerApplication } from "@/hooks/use-charity";
import { FileText, Users, Clock, MapPin, Loader2, HeartHandshake } from "lucide-react";

const volunteerProjects = [
  {
    id: "p1",
    title: "مشروع السلال الغذائية",
    summary: "مساندة الفرق الميدانية في تجهيز وتوزيع السلال للأسر المحتاجة.",
  },
  {
    id: "p2",
    title: "مشروع كسوة الشتاء",
    summary: "تنظيم وفرز المواد الشتوية وتسليمها للمستفيدين في الوقت المناسب.",
  },
  {
    id: "p3",
    title: "مشروع التوعية المجتمعية",
    summary: "المشاركة في حملات التوعية والأنشطة الميدانية داخل الأحياء.",
  },
  {
    id: "p4",
    title: "مشروع الدعم الإداري",
    summary: "المساعدة في إدخال البيانات والمتابعة التنظيمية داخل مقر الجمعية.",
  },
];

const volunteerFormSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن لا يقل عن حرفين"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(9, "رقم الجوال غير مكتمل"),
  experience: z.string().min(10, "يرجى كتابة نبذة لا تقل عن 10 أحرف"),
  opportunityTitle: z.string().min(2, "اختر مشروع تطوعي أولاً"),
});

type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

export default function VolunteerForm() {
  const mutation = useVolunteerApplication();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      experience: "",
      opportunityTitle: "",
    },
  });

  const onSubmit = (data: VolunteerFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        setSelectedProjectId("");
      },
    });
  };

  const handleSelectProject = (projectId: string) => {
    const project = volunteerProjects.find((item) => item.id === projectId);
    if (!project) return;

    setSelectedProjectId(projectId);
    form.setValue("opportunityTitle", project.title, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">استمارة التطوع</h1>
          <p className="text-xl text-slate-600">كن جزءاً من صنع الفرق في مجتمعك</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Users className="w-6 h-6 text-emerald-500 mb-3" />
              <CardTitle>بناء علاقات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">تعرف على أشخاص جدد وابنِ علاقات قيمة</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <FileText className="w-6 h-6 text-blue-500 mb-3" />
              <CardTitle>تطوير المهارات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">طور مهاراتك واكسب خبرة عملية قيمة</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MapPin className="w-6 h-6 text-red-500 mb-3" />
              <CardTitle>أثر حقيقي</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">ساهم في تحسين حياة الآخرين بشكل مباشر</p>
            </CardContent>
          </Card>
        </div>

        {/* Form Info */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>متطلبات التطوع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <ul className="list-disc list-inside space-y-2">
              <li>أن تكون بعمر 18 سنة فما فوق</li>
              <li>امتلاك الشغف والرغبة في خدمة المجتمع</li>
              <li>الالتزام بالمواعيد والمسؤوليات</li>
              <li>اجتياز مقابلة تعريفية</li>
              <li>قضاء ساعة تدريب على الأقل</li>
            </ul>
          </CardContent>
        </Card>

        {/* How to Apply */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-purple-500" />
              <CardTitle>كيفية التقديم</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="font-bold text-emerald-500">1.</span>
                <p>قم بملء استمارة التطوع الإلكترونية</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-emerald-500">2.</span>
                <p>سيتمكن معنا خلال 3-5 أيام عمل</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-emerald-500">3.</span>
                <p>حضور جلسة توجيهية على Zoom</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-emerald-500">4.</span>
                <p>ابدأ تطوعك مع الفريق!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Application Form */}
        <Card className="mt-12">
          <CardHeader>
            <div className="flex items-center gap-3">
              <HeartHandshake className="w-6 h-6 text-emerald-500" />
              <CardTitle>استمارة التطوع</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input placeholder="الاسم كما في الهوية" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الجوال</FormLabel>
                        <FormControl>
                          <Input placeholder="05xxxxxxxx" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@mail.com" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الخبرات والدافع للتطوع</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="اكتب نبذة مختصرة عن خبراتك والدافع للمشاركة"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="opportunityTitle"
                  render={() => (
                    <FormItem>
                      <FormLabel>اختر المشروع التطوعي</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {volunteerProjects.map((project) => {
                          const isSelected = selectedProjectId === project.id;
                          return (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() => handleSelectProject(project.id)}
                              className={`rounded-xl border p-4 text-right transition ${
                                isSelected
                                  ? "border-emerald-500 bg-emerald-50"
                                  : "border-slate-200 bg-white hover:bg-slate-50"
                              }`}
                            >
                              <p className="text-sm font-extrabold text-slate-900">{project.title}</p>
                              <p className="mt-1 text-xs leading-6 text-slate-600">{project.summary}</p>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        عند الإرسال سيتم تحويل الطلب تلقائياً إلى لوحة تحكم الموظفين.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={mutation.isPending} className="w-full h-12 font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري إرسال الطلب...
                    </>
                  ) : (
                    "إرسال طلب التطوع"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






