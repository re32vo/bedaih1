import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBeneficiarySchema, type InsertBeneficiary } from "@shared/schema";
import { useCreateBeneficiary } from "@/hooks/use-charity";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PageLoadingOverlay } from "@/components/PageLoadingOverlay";

export default function Beneficiaries() {
  const mutation = useCreateBeneficiary();

  const form = useForm<InsertBeneficiary>({
    resolver: zodResolver(insertBeneficiarySchema),
    defaultValues: {
      fullName: "",
      nationalId: "",
      address: "",
      phone: "",
      email: "",
      assistanceType: "",
    },
  });

  const onSubmit = (data: InsertBeneficiary) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

  return (
    <>
      <PageLoadingOverlay />
      <div className="min-h-screen bg-white py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-2 sm:mb-3 md:mb-4">تسجيل مستفيد جديد</h1>
            <p className="text-xs sm:text-sm md:text-base text-black px-2 sm:px-4 lg:px-0">نحن هنا لخدمتكم. يرجى تعبئة النموذج أدناه وسيتم التواصل معكم لدراسة الحالة.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-200"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base text-black">الاسم الرباعي</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسمك الكامل" className="h-10 sm:h-12 text-sm sm:text-base bg-white border-gray-300 text-black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">رقم الهوية / الإقامة</FormLabel>
                        <FormControl>
                          <Input placeholder="رقم الهوية المكون من 10 أرقام" className="h-12 bg-white border-gray-300 text-black" {...field} />
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
                          <Input placeholder="05xxxxxxxx" className="h-12 bg-white border-gray-300 text-black" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@domain.com" className="h-12 bg-white border-gray-300 text-black" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assistanceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">نوع المساعدة المطلوبة</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-white border-gray-300 text-black">
                              <SelectValue placeholder="اختر نوع المساعدة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-300">
                            <SelectItem value="financial" className="text-black hover:bg-gray-100">مساعدة مالية</SelectItem>
                            <SelectItem value="food" className="text-black hover:bg-gray-100">سلة غذائية</SelectItem>
                            <SelectItem value="medical" className="text-black hover:bg-gray-100">علاج ودواء</SelectItem>
                            <SelectItem value="housing" className="text-black hover:bg-gray-100">ترميم منازل</SelectItem>
                            <SelectItem value="education" className="text-black hover:bg-gray-100">دعم تعليمي</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">العنوان السكني بالتفصيل</FormLabel>
                      <FormControl>
                        <Textarea placeholder="المدينة، الحي، الشارع، رقم المنزل" className="min-h-[100px] bg-white border-gray-300 text-black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button type="submit" disabled={mutation.isPending} className="w-full h-14 text-lg font-bold bg-black text-white">
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "إرسال الطلب"
                    )}
                  </Button>
                </div>

              </form>
            </Form>
          </motion.div>
        </div>
      </div>
      </div>
    </>
  );
}


