import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertJobApplicationSchema, type InsertJobApplication } from "@shared/schema";
import { useApplyJob } from "@/hooks/use-charity";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function Jobs() {
  const mutation = useApplyJob();

  const form = useForm<InsertJobApplication>({
    resolver: zodResolver(insertJobApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      experience: "",
      qualifications: undefined,
      skills: "",
      cvUrl: "",
    },
  });

  const onSubmit = async (data: InsertJobApplication) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20 space-y-3 sm:space-y-4 md:space-y-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gray-200 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black">انضم لفريقنا</h1>
          <p className="text-sm sm:text-base md:text-lg text-black max-w-2xl mx-auto px-2 sm:px-0">
            نبحث دائماً عن الشغوفين بالعمل الخيري للانضمام إلى مسيرة العطاء. إذا كنت ترى في نفسك الكفاءة، شاركنا بياناتك.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block sticky top-24 relative overflow-hidden rounded-3xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632&auto=format&fit=crop" 
              alt="Work with us" 
              className="rounded-3xl shadow-2xl object-cover h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full"
            />
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading mb-4 sm:mb-6 border-b border-gray-200 pb-3 sm:pb-4 text-black">نموذج التقديم الوظيفي</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input placeholder="الاسم كما هو في الهوية" className="h-12 bg-white border-gray-300 text-black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input type="email" className="h-12 bg-white border-gray-300 text-black" {...field} />
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
                        <FormLabel className="text-black">رقم الجوال</FormLabel>
                        <FormControl>
                          <Input className="h-12 bg-white border-gray-300 text-black" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">المؤهل العلمي</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-white border-gray-300 text-black">
                            <SelectValue placeholder="اختر المؤهل العلمي" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ابتدائي">ابتدائي</SelectItem>
                          <SelectItem value="متوسط">متوسط</SelectItem>
                          <SelectItem value="ثانوي">ثانوي</SelectItem>
                          <SelectItem value="دبلوم">دبلوم</SelectItem>
                          <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
                          <SelectItem value="ماجستير">ماجستير</SelectItem>
                          <SelectItem value="دكتوراه">دكتوراه</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">المهارات</FormLabel>
                      <FormControl>
                        <Textarea placeholder="اذكر مهاراتك (مثال: مهارات الحاسوب، التواصل، القيادة...)" className="min-h-[100px] bg-white border-gray-300 text-black" {...field} />
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
                      <FormLabel className="text-black">الخبرات السابقة</FormLabel>
                      <FormControl>
                        <Textarea placeholder="الشركات والجهات التي عملت بها سابقاً..." className="min-h-[100px] bg-white border-gray-300 text-black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">رابط السيرة الذاتية (LinkedIn أو Google Drive) <span className="text-black/60">(اختياري)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." className="h-12 bg-white border-gray-300 text-black" value={field.value || ''} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={mutation.isPending} className="w-full h-14 text-lg font-bold bg-black text-white mt-4">
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    "إرسال طلب التوظيف"
                  )}
                </Button>

              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


