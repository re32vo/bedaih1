import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { useContactMessage } from "@/hooks/use-charity";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const mutation = useContactMessage();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

  return (
    <>
      <div className="min-h-screen bg-white">
      {/* Header */}
      {/* Banner Image */}
      {/* Banner Image */}
      <div className="w-full relative">
        <img src="https://i.postimg.cc/vmWMyPRz/12.jpg" alt="بانر تواصل معنا" className="w-full h-64 object-cover object-center" />
      </div>
      {/* Banner Text */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-8">
        <div className="text-center space-y-4 bg-white bg-opacity-90 rounded-xl py-8 shadow">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">تواصل معنا 💬</h1>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black max-w-2xl text-center mx-auto">نسعد باستقبال استفساراتكم واقتراحاتكم والإجابة عن جميع أسئلتكم بسرعة واهتمام</h2>
        </div>
      </div>
      {/* Description under banner */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 md:space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-emerald-400">معلومات الاتصال</h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-black shrink-0 border border-gray-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-sm sm:text-base">
                    <h4 className="font-bold text-black">الموقع</h4>
                    <p className="text-black text-xs sm:text-sm">المملكة العربية السعودية، جدة</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-black shrink-0 border border-gray-200">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-sm sm:text-base">
                    <h4 className="font-bold text-black">الهاتف</h4>
                    <p className="text-black text-xs sm:text-sm" dir="ltr">0595955800</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-black shrink-0 border border-gray-200">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-sm sm:text-base">
                    <h4 className="font-bold text-black">البريد الإلكتروني</h4>
                    <p className="text-black text-xs sm:text-sm">albaladone@hotmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-black shrink-0 border border-gray-200">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-sm sm:text-base">
                    <h4 className="font-bold text-black">ساعات العمل</h4>
                    <p className="text-black text-xs sm:text-sm">الأحد - الخميس: 8:00 ص - 4:00 م</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 md:p-10 rounded-2xl border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-black mb-6">أرسل لنا رسالة</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">الاسم</FormLabel>
                          <FormControl>
                            <Input placeholder="اسمك الكريم" className="h-12 bg-white border-gray-300 text-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="example@mail.com" className="h-12 bg-white border-gray-300 text-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="md:max-w-md md:mx-auto">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">رقم الهاتف</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="05xxxxxxxx" className="h-12 bg-white border-gray-300 text-black" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">نص الرسالة</FormLabel>
                        <FormControl>
                          <Textarea placeholder="كيف يمكننا مساعدتك؟" className="min-h-[150px] bg-white border-gray-300 text-black resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={mutation.isPending} className="w-full md:w-auto px-10 h-12 text-lg font-bold bg-black text-white">
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        "إرسال الرسالة"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}








