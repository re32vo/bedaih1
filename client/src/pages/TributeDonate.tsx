import { useMemo, useState } from "react";
import { Gift, CalendarClock, Plus, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Template = { id: string; label: string; src: string };

export default function TributeDonate() {
  const [selectedOccasion, setSelectedOccasion] = useState("general");
  const [selectedTemplate, setSelectedTemplate] = useState("t1");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [showAmountInCard, setShowAmountInCard] = useState(false);
  const [donationDate, setDonationDate] = useState("");
  const [donationTime, setDonationTime] = useState("04:00");
  const [giftMessage, setGiftMessage] = useState("إهداء مشروع أوقاف ابتسم");

  const templates: Template[] = [
    { id: "t1", label: "نموذج 1", src: "/1.jpg" },
    { id: "t2", label: "نموذج 2", src: "/2.jpg" },
    { id: "t3", label: "نموذج 3", src: "/3.jpg" },
  ];

  const selectedTemplateData = useMemo(
    () => templates.find((template) => template.id === selectedTemplate) || templates[0],
    [selectedTemplate]
  );

  const finalAmount = customAmount ? Number(customAmount) || 0 : selectedAmount;

  const submitGift = () => {
    if (!recipientName.trim() || !senderName.trim() || !phone.trim() || finalAmount <= 0) {
      alert("الرجاء تعبئة بيانات البطاقة والمبلغ بشكل صحيح");
      return;
    }
    alert("تم إرسال الإهداء بنجاح");
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-sky-600">إهداء التبرع</h1>
          <p className="mt-2 text-lg text-slate-700">خدمة لتقديم التبرعات عن الغير كهدية للأهل والأصدقاء في مختلف المناسبات الاجتماعية</p>
        </div>

        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-4 rounded-2xl border border-slate-300 bg-white p-3 lg:grid-cols-[1fr_1.15fr]">
          <div className="rounded-xl border border-slate-300 bg-slate-50 p-3">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <img src={selectedTemplateData.src} alt="معاينة بطاقة الإهداء" className="h-[760px] w-full object-cover" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-300 bg-slate-50 p-3">
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto flex w-40 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-900 py-2 text-white">
                  <Gift className="h-5 w-5" />
                </div>
                <h2 className="mt-2 text-4xl font-bold text-slate-900">اختر المناسبة</h2>
              </div>

              <div className="mx-auto grid max-w-[160px] grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOccasion("general")}
                  className={`rounded-md border p-2 text-center transition ${
                    selectedOccasion === "general" ? "border-sky-500 bg-sky-50" : "border-slate-300 bg-white"
                  }`}
                >
                  <img src="/1.jpg" alt="إهداء عام" className="h-28 w-full rounded object-cover" />
                  <p className="mt-2 text-xl font-bold text-slate-700">إهداء عام</p>
                </button>
              </div>

              <div>
                <h3 className="mb-2 text-center text-4xl font-bold text-slate-900">اختر نموذج بطاقة الإهداء</h3>
                <div className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`min-w-[130px] rounded-md border p-1 transition ${
                        selectedTemplate === template.id ? "border-sky-500 bg-sky-50" : "border-slate-200"
                      }`}
                    >
                      <img src={template.src} alt={template.label} className="h-44 w-full rounded object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Input
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="h-14 rounded-xl border-slate-300 bg-white text-center text-2xl"
                  placeholder="نص الإهداء"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-100 p-3">
                <h3 className="mb-3 text-center text-4xl font-bold text-slate-800">بيانات البطاقة</h3>

                <div className="space-y-2">
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="h-11 rounded-lg border-slate-300 bg-white text-right text-base"
                    placeholder="اسم المهدي"
                  />
                  <Input
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="h-11 rounded-lg border-slate-300 bg-white text-right text-base"
                    placeholder="اسم المهدي إليه"
                  />

                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <div className="flex h-11 items-center rounded-lg border border-slate-300 bg-white px-3">
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="051 234 5678"
                        className="h-auto border-0 p-0 text-center shadow-none focus-visible:ring-0"
                      />
                      <div className="mx-2 h-6 w-px bg-slate-200" />
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-600" dir="ltr">
                        <span>+966</span>
                        <span>🇸🇦</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                      {[50, 100, 150].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount(String(amount));
                          }}
                          className={`h-11 rounded-lg border px-3 text-sm font-bold ${
                            selectedAmount === amount ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-300 bg-white text-slate-700"
                          }`}
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <div className="relative">
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">ريال</span>
                      <Input
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value.replace(/[^0-9]/g, ""));
                          setSelectedAmount(0);
                        }}
                        className="h-11 rounded-lg border-slate-300 bg-white pr-12 text-center font-bold"
                        placeholder="0"
                        inputMode="numeric"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={showAmountInCard}
                        onChange={(e) => setShowAmountInCard(e.target.checked)}
                        className="h-4 w-4 accent-sky-500"
                      />
                      إظهار المبلغ المهدي إليه
                    </label>
                  </div>
                </div>
              </div>

              <Button type="button" className="h-11 w-full rounded-xl bg-indigo-900 text-base font-bold text-white hover:bg-indigo-800">
                <Plus className="h-4 w-4" />
                إضافة بطاقة أخرى
              </Button>

              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <h3 className="mb-3 flex items-center justify-center gap-2 text-lg font-bold text-slate-800">
                  <CalendarClock className="h-4 w-4" />
                  جدولة الإهداء
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-slate-500">اختر التاريخ</label>
                    <Input type="date" value={donationDate} onChange={(e) => setDonationDate(e.target.value)} className="h-11 rounded-lg border-slate-300" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-500">اختر الوقت</label>
                    <Input type="time" value={donationTime} onChange={(e) => setDonationTime(e.target.value)} className="h-11 rounded-lg border-slate-300" />
                  </div>
                </div>
              </div>

              <Button
                onClick={submitGift}
                className="h-12 w-full rounded-xl bg-sky-500 text-lg font-extrabold text-white hover:bg-sky-600"
                type="button"
              >
                <CircleDollarSign className="h-5 w-5" />
                أهدي الآن
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






