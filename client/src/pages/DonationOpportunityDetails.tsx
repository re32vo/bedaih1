import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { ShoppingCart, Share2, Facebook, MessageCircle, Instagram, CreditCard, Landmark, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { donationProjects } from "@/data/donationProjects";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function DonationOpportunityDetails() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/donate/opportunities/:id");
  const selectedProject = match ? donationProjects.find((project) => project.id === params.id) : undefined;
  const { addItem, getTotalItems } = useCart();
  const { toast } = useToast();

  const [selectedAmount, setSelectedAmount] = useState<number>(selectedProject?.amounts[0] || 30);
  const [customAmount, setCustomAmount] = useState<string>(selectedProject?.amounts[0] ? String(selectedProject.amounts[0]) : "30");
  const [customDonation, setCustomDonation] = useState<boolean>(false);
  const [donationType, setDonationType] = useState<'single' | 'quick' | 'recurring'>('single');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-slate-100 py-10" dir="rtl">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-2xl font-extrabold text-slate-800">المشروع غير موجود</h1>
          <Button type="button" onClick={() => setLocation("/donate/opportunities")}>العودة إلى فرص التبرع</Button>
        </div>
      </div>
    );
  }

  const total = customAmount ? Number(customAmount) || 0 : selectedAmount;

  const paymentMethods = [
    { id: 1, title: "التحويل البنكي", icon: Landmark, emoji: "🏦" },
    { id: 2, title: "فيزا / مدى", icon: CreditCard, emoji: "💳" },
    { id: 3, title: "Apple Pay", icon: Smartphone, logo: "/ap.jpg" }
  ];

  const handleAddToCart = () => {
    if (!selectedProject) return;
    
    if (total <= 0) {
      toast({
        title: "تنبيه",
        description: "الرجاء اختيار مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: selectedProject.id,
      title: selectedProject.title,
      description: selectedProject.description,
      image: selectedProject.image,
      amount: total,
      donationType: donationType,
      paymentMethod: selectedPaymentMethod || undefined,
    });

    toast({
      title: "تمت الإضافة للسلة",
      description: `تمت إضافة "${selectedProject.title}" بمبلغ ${total} ريال للسلة بنجاح`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 md:py-10" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-800 md:text-3xl">تفاصيل المشروع</h1>
          <div className="flex items-center gap-3">
            {getTotalItems() > 0 && (
              <div className="relative">
                <Button type="button" variant="outline" onClick={() => setLocation("/cart")}>
                  <ShoppingCart className="h-4 w-4 ml-1" />
                  السلة
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {getTotalItems()}
                  </span>
                </Button>
              </div>
            )}
            <Button type="button" variant="outline" onClick={() => setLocation("/donate/opportunities")}>عودة</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 text-xl font-extrabold text-slate-800">مبلغ التبرع</h2>

            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[{ label: "سهم الجود", value: 10 }, { label: "سهم العطاء", value: 20 }, { label: "سهم الإحسان", value: 30 }, { label: "بما تجود به نفسك", value: 0 }].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    if (option.value === 0) {
                      setCustomDonation(true);
                      setSelectedAmount(0);
                      setCustomAmount("");
                      return;
                    }
                    setCustomDonation(false);
                    setSelectedAmount(option.value);
                    setCustomAmount(String(option.value));
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-bold transition ${
                    (option.value === 0 && customDonation) || (option.value > 0 && selectedAmount === option.value && !customDonation)
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="relative mb-4">
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600">ريال</span>
              <Input
                value={customAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setCustomAmount(value);
                  
                  // إذا كان المدخل صفر أو فارغ، فعّل زر "بما تجود به نفسك"
                  if (value === "0" || value === "") {
                    setCustomDonation(true);
                    setSelectedAmount(0);
                  } else {
                    setCustomDonation(false);
                    setSelectedAmount(0);
                  }
                }}
                className="h-12 rounded-xl border-slate-300 bg-white pr-12 text-center text-xl font-bold"
                inputMode="numeric"
                placeholder="0"
              />
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button 
                type="button" 
                onClick={() => setDonationType('single')}
                className={`rounded-lg px-2 py-2 text-xs sm:text-sm font-bold transition ${
                  donationType === 'single' ? 'bg-slate-200 text-slate-800' : 'text-slate-700'
                }`}
              >
                تبرع واحد
              </button>
              <button 
                type="button" 
                onClick={() => setDonationType('quick')}
                className={`rounded-lg px-2 py-2 text-xs sm:text-sm font-bold transition ${
                  donationType === 'quick' ? 'bg-slate-200 text-slate-800' : 'text-slate-700'
                }`}
              >
                تبرع سريع
              </button>
              <button 
                type="button" 
                onClick={() => setDonationType('recurring')}
                className={`rounded-lg px-2 py-2 text-xs sm:text-sm font-bold transition ${
                  donationType === 'recurring' ? 'bg-slate-200 text-slate-800' : 'text-slate-700'
                }`}
              >
                تبرع دوري
              </button>
            </div>

            <div className="mb-4 text-center">
              <p className="text-lg font-semibold text-slate-600">الإجمالي</p>
              <p className="text-3xl font-black text-slate-800">{total} ر.س</p>
            </div>

            <p className="mb-3 text-center text-lg font-bold text-slate-700">اختر وسيلة الدفع الملائمة</p>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 transition ${
                    selectedPaymentMethod === method.id
                      ? "border-[#26a1d0] bg-[#26a1d0]/10"
                      : "border-slate-200 bg-white hover:border-[#26a1d0]/50"
                  }`}
                >
                  {method.logo ? (
                    <img src={method.logo} alt={method.title} className="h-8 object-contain" />
                  ) : (
                    <span className="text-2xl">{method.emoji}</span>
                  )}
                  <span className="text-xs font-bold text-slate-800 text-center leading-tight">{method.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-800">{selectedProject.title}</h2>
              <div className="flex items-center gap-2">
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600"><Instagram className="h-4 w-4" /></button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600"><MessageCircle className="h-4 w-4" /></button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600"><Share2 className="h-4 w-4" /></button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600"><Facebook className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
              <img src={selectedProject.image} alt={selectedProject.title} className="h-[320px] w-full object-cover" />
            </div>

            <p className="text-lg leading-relaxed text-slate-700">{selectedProject.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button type="button" className="h-11 rounded-xl bg-[#26a1d0] text-white hover:bg-[#26a1d0]/90">تبرع</Button>
              <Button 
                type="button" 
                onClick={handleAddToCart}
                className="h-11 rounded-xl bg-[#283c6a] text-white hover:bg-[#283c6a]/90"
              >
                <ShoppingCart className="h-4 w-4" />
                إضافة للسلة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
