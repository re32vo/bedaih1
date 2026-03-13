import { useState } from "react";
import { useLocation } from "wouter";
import { CreditCard, Smartphone, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  { id: "card", label: "بطاقة بنكية", icon: CreditCard },
  { id: "apple", label: "Apple Pay", icon: Smartphone },
  { id: "bank", label: "تحويل بنكي", icon: Landmark },
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getTotalAmount, getTotalItems, clearCart } = useCart();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("card");

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 py-10" dir="rtl">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-3">صفحة الدفع</h1>
          <p className="text-slate-600 mb-6">لا توجد عناصر في السلة حاليا</p>
          <Button onClick={() => setLocation("/banner-donate")} className="bg-sky-600 hover:bg-sky-700 text-white">
            العودة لصفحة التبرع
          </Button>
        </div>
      </div>
    );
  }

  const completeDonation = () => {
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "بيانات ناقصة",
        description: "فضلا أدخل الاسم ورقم الجوال",
        variant: "destructive",
      });
      return;
    }

    clearCart();
    toast({
      title: "تم الدفع بنجاح",
      description: "شكرا لك على تبرعك الكريم",
    });
    setLocation("/thank-you");
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10" dir="rtl">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-5">إتمام الدفع</h1>

          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-bold text-slate-700">الاسم</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="اكتب الاسم" className="h-11" />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-bold text-slate-700">رقم الجوال</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="05xxxxxxxx"
                className="h-11"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-slate-700">طريقة الدفع</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {paymentMethods.map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setMethod(pm.id)}
                      className={`rounded-xl border p-3 flex items-center justify-center gap-2 text-sm font-bold transition ${
                        method === pm.id
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {pm.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="button"
              onClick={completeDonation}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-base font-extrabold"
            >
              تأكيد الدفع
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm h-fit">
          <h2 className="text-xl font-extrabold text-slate-800 mb-4">ملخص التبرع</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.amount}`} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-700 line-clamp-1">{item.title}</span>
                <span className="font-bold text-slate-900">{item.amount * item.quantity} ر.س</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>عدد العناصر</span>
              <span className="font-bold">{getTotalItems()}</span>
            </div>
            <div className="flex justify-between text-slate-900 text-lg font-extrabold">
              <span>الإجمالي</span>
              <span>{getTotalAmount()} ر.س</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
