import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const donationTypes = [
  { id: "zakat-poor", label: "زكاة الفقراء والمساكين" },
  { id: "zakat-orphans", label: "زكاة الأيتام" },
  { id: "sadaqah", label: "صدقة عامة" },
  { id: "treatment", label: "دعم العلاج" },
];

export default function BannerDonate() {
  const [, setLocation] = useLocation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState(donationTypes[0]);
  const [amount, setAmount] = useState("100");

  const onDonate = () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      toast({
        title: "مبلغ غير صحيح",
        description: "فضلا أدخل مبلغ تبرع صحيح",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: `banner-${selectedType.id}`,
      title: selectedType.label,
      description: "تبرع مباشر عبر صفحة البانر",
      image: "/hero-therapy-desktop.jpg",
      amount: numericAmount,
      donationType: "quick",
      paymentMethod: 1,
    });

    toast({
      title: "تمت إضافة التبرع",
      description: "تم نقلك لصفحة الدفع",
    });

    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <section
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-therapy-desktop.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-900/50" />

        <div className="relative container mx-auto px-3 sm:px-4 py-10 sm:py-16 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-center">
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-white/70 shadow-xl p-4 sm:p-5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">تبرعك يصنع الأثر</h1>
                <p className="text-slate-600 text-sm sm:text-base mb-4">اختر نوع التبرع وحدد المبلغ ثم أكمل الدفع</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {donationTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`rounded-lg border px-2 py-2 text-xs sm:text-sm font-bold transition ${
                        selectedType.id === type.id
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <div className="relative mb-4">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">ريال</span>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    className="h-11 pr-12 text-base font-bold"
                    placeholder="ادخل مبلغ التبرع"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={onDonate}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold"
                  >
                    تبرع الآن
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/donate/opportunities")}
                    className="font-bold"
                  >
                    تفاصيل أكثر
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 text-white">
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight mb-3">
                تبرعك اليوم
                <br />
                أمل بكرة
              </h2>
              <p className="max-w-xl text-base sm:text-lg text-white/90 leading-8">
                صفحة تبرع سريعة بنمط بانر تساعد الزائر يختار نوع الدعم والمبلغ بسهولة،
                وبعدها ينتقل مباشرة لصفحة الدفع لإتمام العملية.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
