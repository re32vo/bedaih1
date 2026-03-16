import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBeneficiarySchema, type InsertBeneficiary } from "@shared/schema";
import { useCreateBeneficiary } from "@/hooks/use-charity";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, HandHeart } from "lucide-react";

type BeneficiaryRequestFormProps = {
  title?: string;
  description?: string;
  assistanceOptions?: Array<{ value: string; label: string }>;
};

const defaultAssistanceOptions = [
  { value: "financial", label: "مساعدة مالية" },
  { value: "food", label: "سلة غذائية" },
  { value: "medical", label: "علاج ودواء" },
  { value: "housing", label: "ترميم منازل" },
  { value: "education", label: "دعم تعليمي" },
];

export default function BeneficiaryRequestForm({
  title = "استمارة مستفيد",
  description = "إذا كنت من الفئات المستحقة للدعم، يمكنك تعبئة النموذج التالي وسيصل طلبك مباشرة لفريق الجمعية.",
  assistanceOptions = defaultAssistanceOptions,
}: BeneficiaryRequestFormProps) {
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
      },
    });
  };

  return (
    <Card className="mt-12 border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <HandHeart className="w-6 h-6 text-emerald-500" />
          <CardTitle className="text-2xl text-slate-900">{title}</CardTitle>
        </div>
        <p className="text-sm leading-7 text-slate-600">{description}</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900">الاسم الرباعي</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسمك الكامل" className="h-11 bg-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900">رقم الهوية / الإقامة</FormLabel>
                    <FormControl>
                      <Input placeholder="رقم الهوية المكون من 10 أرقام" className="h-11 bg-white" {...field} />
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
                    <FormLabel className="text-slate-900">رقم الجوال</FormLabel>
                    <FormControl>
                      <Input placeholder="05xxxxxxxx" className="h-11 bg-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900">البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@domain.com" className="h-11 bg-white" {...field} />
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
                    <FormLabel className="text-slate-900">نوع المساعدة المطلوبة</FormLabel>
                    <FormControl>
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="h-11 w-full rounded-md border border-input bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="" disabled>اختر نوع المساعدة</option>
                        {assistanceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
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
                  <FormLabel className="text-slate-900">العنوان السكني بالتفصيل</FormLabel>
                  <FormControl>
                    <Textarea placeholder="المدينة، الحي، الشارع، رقم المنزل" className="min-h-[110px] bg-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              {mutation.isPending ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                "إرسال طلب المستفيد"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}