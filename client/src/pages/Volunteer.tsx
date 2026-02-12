import { useState } from "react";
import { Heart, Users, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const volunteerSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(9, "رقم الهاتف غير صحيح"),
  experience: z.string().min(10, "اكتب عن خبرتك"),
});

type VolunteerForm = z.infer<typeof volunteerSchema>;

const opportunities = [
  {
    id: 1,
    title: "مساعدة في التوعية الصحية",
    description: "ساعد في نشر الوعي الصحي والتثقيف الطبي",
    skills: "التواصل، الإدراك الصحي",
    commitment: "4 ساعات/أسبوع",
    icon: Heart,
    color: "bg-white",
  },
  {
    id: 2,
    title: "تدريس وتثقيف",
    description: "علم الأطفال والكبار مهارات جديدة",
    skills: "التدريس، الصبر، التواصل",
    commitment: "6 ساعات/أسبوع",
    icon: Users,
    color: "bg-white",
  },
  {
    id: 3,
    title: "مساعدة إدارية وتنظيمية",
    description: "ساعد في إدارة المشاريع والفعاليات",
    skills: "التنظيم، إدارة الوقت، التخطيط",
    commitment: "5 ساعات/أسبوع",
    icon: Clock,
    color: "bg-white",
  },
  {
    id: 4,
    title: "مشاريع تطوعية خاصة",
    description: "اقترح فكرتك الخاصة وساهم بما تستطيع",
    skills: "الإبداع، المرونة، الحماس",
    commitment: "متغير",
    icon: Award,
    color: "bg-white",
  },
];

const benefits = [
  "تطوير مهاراتك الشخصية والمهنية",
  "التواصل مع مجتمع من المتطوعين الملتزمين",
  "اكتساب خبرة عملية قيمة",
  "المساهمة الفعالة في تغيير المجتمع",
  "شهادة تطوع معترف بها",
];

export default function Volunteer() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VolunteerForm>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit = async (data: VolunteerForm) => {
    try {
      const selectedOpp = opportunities.find(o => o.id === selectedOpportunity);
      
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          experience: data.experience,
          opportunityTitle: selectedOpp?.title || "فرصة عامة",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit volunteer application");
      }

      toast({
        title: "شكراً لك",
        description: "تم استقبال طلب التطوع الخاص بك بنجاح",
      });
      reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الطلب",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20 pb-10 sm:pb-16 md:pb-20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4 sm:mb-6">
            <Heart className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-black" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 text-black">انضم إلى فريقنا</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black max-w-2xl mx-auto px-2 sm:px-0">
            كن جزءاً من حركة التطوع والعمل الإنساني. معك نستطيع تحقيق أحلاماً أكبر
          </p>
        </motion.div>
      </div>

      {/* Why Volunteer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14 md:mb-16 lg:mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-black">لماذا التطوع معنا؟</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white border-gray-200 transition-all">
                <CardContent className="pt-6 text-center bg-white">
                  <p className="text-black font-semibold">{benefit}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14 md:mb-16 lg:mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-black">فرص التطوع المتاحة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white border-gray-200 transition-all">
                <CardHeader className="bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <opportunity.icon className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-xs bg-white text-black px-3 py-1 rounded-full border border-gray-300">
                      {opportunity.commitment}
                    </span>
                  </div>
                  <CardTitle className="text-black">{opportunity.title}</CardTitle>
                  <CardDescription className="text-black">{opportunity.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 bg-white">
                  <div>
                    <p className="text-sm font-semibold text-black mb-1">المهارات المطلوبة:</p>
                    <p className="text-sm text-black">{opportunity.skills}</p>
                  </div>
                  <Dialog open={isDialogOpen && selectedOpportunity === opportunity.id} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedOpportunity(opportunity.id)}
                        className="w-full bg-black text-white"
                      >
                        تقديم طلب
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white border-0">
                    <DialogHeader className="bg-white">
                      <DialogTitle className="text-black">طلب التطوع: {opportunity.title}</DialogTitle>
                      <DialogDescription className="text-black">
                        أخبرنا عن نفسك ولماذا تريد التطوع معنا
                      </DialogDescription>
                      {/* image removed per request */}
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-black">الاسم الكامل</Label>
                        <Input
                          id="name"
                          placeholder="أدخل اسمك الكامل"
                          {...register("name")}
                          className="text-right bg-white border-gray-300 text-black"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-400">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-black">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          {...register("email")}
                          className="text-right bg-white border-gray-300 text-black"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-400">{errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-black">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+966XXXXXXXXX"
                          {...register("phone")}
                          className="text-right bg-white border-gray-300 text-black"
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-400">{errors.phone.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-black">خبرتك وملاحظاتك</Label>
                        <Textarea
                          id="experience"
                          placeholder="أخبرنا عن خبرتك وسبب رغبتك في التطوع..."
                          {...register("experience")}
                          className="text-right min-h-24 bg-white border-gray-300 text-black"
                        />
                        {errors.experience && (
                          <p className="text-sm text-red-400">{errors.experience.message}</p>
                        )}
                      </div>
                      <Button type="submit" className="w-full bg-black text-white">
                        إرسال الطلب
                      </Button>
                    </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4">
        <Card className="border-0 bg-gradient-to-r from-emerald-600 to-teal-600">
          <CardHeader className="text-center bg-white">
            <CardTitle className="text-3xl font-bold text-black">كن الفرق الذي تريد أن تراه</CardTitle>
            <CardDescription className="text-black text-lg font-semibold mt-4">
              تطوعك اليوم يصنع غداً أفضل لمجتمعنا
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center bg-white">
            <p className="text-black text-xl font-medium leading-relaxed">
              ساهم في بناء مستقبل مشرق وكن جزءاً من الحركة الخيرية التي تغير حياة الآلاف
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

