import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { ShoppingCart, Share2, Facebook, MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { donationProjects } from "@/data/donationProjects";

export default function DonationOpportunityDetails() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/donate/opportunities/:id");
  const selectedProject = match ? donationProjects.find((project) => project.id === params.id) : undefined;

  const [selectedAmount, setSelectedAmount] = useState<number>(selectedProject?.amounts[0] || 30);
  const [customAmount, setCustomAmount] = useState<string>(selectedProject?.amounts[0] ? String(selectedProject.amounts[0]) : "30");

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

  return (
    <div className="min-h-screen bg-slate-100 py-6 md:py-10" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-[#283c6a] md:text-3xl">تفاصيل المشروع</h1>
          <Button type="button" variant="outline" onClick={() => setLocation("/donate/opportunities")}>عودة</Button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-[9px] border border-slate-300 bg-white p-4">
            <h2 className="mb-3 text-xl font-extrabold text-[#283c6a]">مبلغ التبرع</h2>

            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[{ label: "سهم الجود", value: 10 }, { label: "سهم العطاء", value: 20 }, { label: "سهم الإحسان", value: 30 }, { label: "بما تجود به نفسك", value: 0 }].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    if (option.value === 0) {
                      setSelectedAmount(0);
                      setCustomAmount("");
                      return;
                    }
                    setSelectedAmount(option.value);
                    setCustomAmount(String(option.value));
                  }}
                  className={`rounded-[9px] border px-3 py-2 text-sm font-bold transition ${
                    option.value > 0 && selectedAmount === option.value
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
                  setSelectedAmount(0);
                }}
                className="h-12 rounded-[9px] border-slate-300 bg-white pr-12 text-center text-xl font-bold"
                inputMode="numeric"
                placeholder="0"
              />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2 rounded-[9px] border border-slate-200 bg-slate-50 p-1">
              <button type="button" className="rounded-[9px] bg-slate-200 px-3 py-2 text-sm font-bold text-slate-800">تبرع واحد</button>
              <button type="button" className="rounded-[9px] px-3 py-2 text-sm font-semibold text-slate-700">التبرع الدوري</button>
            </div>

            <div className="mb-4 text-center">
              <p className="text-lg font-semibold text-slate-600">الإجمالي</p>
              <p className="text-3xl font-black text-[#283c6a]">{total} ر.س</p>
            </div>

            <p className="mb-3 text-center text-lg font-bold text-slate-700">اختر وسيلة الدفع الملائمة</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button type="button" className="h-11 rounded-[9px] bg-[#283c6a] text-white hover:bg-[#1f3058]">التحويل البنكي</Button>
              <Button type="button" className="h-11 rounded-[9px] bg-[#26a1d0] text-white hover:bg-[#1f91bb]">VISA / mada</Button>
            </div>
          </div>

          <div className="rounded-[9px] border border-slate-300 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-[#283c6a]">{selectedProject.title}</h2>
              <div className="flex items-center gap-2">
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dbe7fe] text-[#9ca3af]"><Instagram className="h-4 w-4" /></button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dbe7fe] text-[#9ca3af]"><MessageCircle className="h-4 w-4" /></button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dbe7fe] text-[#9ca3af]"><Share2 className="h-4 w-4" /></button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dbe7fe] text-[#9ca3af]"><Facebook className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
              <img src={selectedProject.image} alt={selectedProject.title} className="h-[320px] w-full object-cover" />
            </div>

            <p className="text-lg leading-relaxed text-slate-700">{selectedProject.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button type="button" className="h-11 rounded-[9px] bg-[#26a1d0] text-white hover:bg-[#1f91bb]">تبرع</Button>
              <Button type="button" className="h-11 rounded-[9px] bg-[#283c6a] text-white hover:bg-[#1f3058]">
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
