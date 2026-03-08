import { useMemo, useState } from "react";
import { Gift, CalendarClock, Plus, CircleDollarSign, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Template = { id: string; label: string; src: string };

type Card = {
  id: string;
  recipientName: string;
  senderName: string;
  phone: string;
  selectedAmount: number;
  customAmount: string;
  showAmountInCard: boolean;
};

export default function TributeDonate() {
  const [selectedOccasion, setSelectedOccasion] = useState("general");
  const [selectedTemplate, setSelectedTemplate] = useState("t1");
  const [donationDate, setDonationDate] = useState("");
  const [donationTime, setDonationTime] = useState("04:00");
  const [isSchedulingEnabled, setIsSchedulingEnabled] = useState(false);
  const [giftMessage, setGiftMessage] = useState("إهداء مشروع أوقاف بداية");
  
  const [cards, setCards] = useState<Card[]>([
    {
      id: "1",
      recipientName: "",
      senderName: "",
      phone: "",
      selectedAmount: 100,
      customAmount: "",
      showAmountInCard: false,
    },
  ]);

  const templates: Template[] = [
    { id: "t1", label: "نموذج 1", src: "/1.jpg" },
    { id: "t2", label: "نموذج 2", src: "/2.jpg" },
    { id: "t3", label: "نموذج 3", src: "/3.jpg" },
  ];

  const selectedTemplateData = useMemo(
    () => templates.find((template) => template.id === selectedTemplate) || templates[0],
    [selectedTemplate]
  );

  const addCard = () => {
    const newCard: Card = {
      id: String(Date.now()),
      recipientName: "",
      senderName: "",
      phone: "",
      selectedAmount: 100,
      customAmount: "",
      showAmountInCard: false,
    };
    setCards([...cards, newCard]);
  };

  const removeCard = (cardId: string) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const updateCard = (cardId: string, field: keyof Card, value: any) => {
    setCards(cards.map((card) => (card.id === cardId ? { ...card, [field]: value } : card)));
  };

  const submitGift = () => {
    // Validate all cards
    for (const card of cards) {
      const finalAmount = card.customAmount ? Number(card.customAmount) || 0 : card.selectedAmount;
      if (!card.recipientName.trim() || !card.senderName.trim() || !card.phone.trim() || finalAmount <= 0) {
        alert("الرجاء تعبئة بيانات جميع البطاقات والمبلغ بشكل صحيح");
        return;
      }
    }

    if (isSchedulingEnabled && (!donationDate || !donationTime)) {
      alert("الرجاء اختيار تاريخ ووقت جدولة الإهداء");
      return;
    }

    alert(isSchedulingEnabled ? "تمت جدولة الإهداء بنجاح" : "تم إرسال الإهداء فورا بنجاح");
  };

  return (
    <div className="min-h-screen bg-slate-100 py-5 md:py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-sky-600 md:text-4xl">إهداء التبرع</h1>
          <p className="mt-2 text-base font-medium text-slate-700">خدمة لتقديم التبرعات عن الغير كهدية للأهل والأصدقاء في مختلف المناسبات الاجتماعية</p>
        </div>

        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-4 rounded-2xl border border-slate-300 bg-white p-3 lg:grid-cols-[1fr_1.15fr]">
          <div className="rounded-xl border border-slate-300 bg-slate-50 p-3">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <img src={selectedTemplateData.src} alt="معاينة بطاقة الإهداء" className="h-[460px] w-full object-cover md:h-[760px]" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-300 bg-slate-50 p-3">
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto flex w-40 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-900 py-2 text-white">
                  <Gift className="h-5 w-5" />
                </div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">اختر المناسبة</h2>
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
                  <p className="mt-2 text-lg font-bold text-slate-700">إهداء عام</p>
                </button>
              </div>

              <div>
                <h3 className="mb-2 text-center text-2xl font-bold text-slate-900 md:text-3xl">اختر نموذج بطاقة الإهداء</h3>
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
                  className="h-11 rounded-xl border-slate-300 bg-white text-center text-lg md:h-12 md:text-xl"
                  placeholder="نص الإهداء"
                />
              </div>

              {cards.map((card, index) => (
                <div key={card.id} className="relative rounded-xl border border-slate-200 bg-slate-100 p-3">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeCard(card.id)}
                      className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-900 text-white transition hover:bg-indigo-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  
                  <h3 className="mb-3 text-center text-2xl font-bold text-slate-800 md:text-3xl">بيانات البطاقة</h3>

                  <div className="space-y-2">
                    <Input
                      value={card.recipientName}
                      onChange={(e) => updateCard(card.id, "recipientName", e.target.value)}
                      className="h-11 rounded-lg border-slate-300 bg-white text-center text-base"
                      placeholder="اسم المهدي"
                    />
                    <Input
                      value={card.senderName}
                      onChange={(e) => updateCard(card.id, "senderName", e.target.value)}
                      className="h-11 rounded-lg border-slate-300 bg-white text-center text-base"
                      placeholder="اسم المهدي إليه"
                    />

                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <div className="flex h-11 items-center rounded-lg border border-slate-300 bg-white px-3">
                        <Input
                          value={card.phone}
                          onChange={(e) => updateCard(card.id, "phone", e.target.value)}
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
                              updateCard(card.id, "selectedAmount", amount);
                              updateCard(card.id, "customAmount", String(amount));
                            }}
                            className={`h-11 rounded-lg border px-3 text-sm font-bold ${
                              card.selectedAmount === amount ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-300 bg-white text-slate-700"
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
                          value={card.customAmount}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            updateCard(card.id, "customAmount", value);
                            updateCard(card.id, "selectedAmount", 0);
                          }}
                          className="h-11 rounded-lg border-slate-300 bg-white pr-12 text-center font-bold"
                          placeholder="0"
                          inputMode="numeric"
                        />
                      </div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={card.showAmountInCard}
                          onChange={(e) => updateCard(card.id, "showAmountInCard", e.target.checked)}
                          className="h-4 w-4 accent-sky-500"
                        />
                        إظهار المبلغ المهدي إليه
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <Button 
                type="button" 
                onClick={addCard}
                className="h-11 w-full rounded-xl bg-indigo-900 text-base font-bold text-white hover:bg-indigo-800"
              >
                <Plus className="h-4 w-4" />
                إضافة بطاقة أخرى
              </Button>

              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <label className="mb-2 flex cursor-pointer items-center justify-center gap-2 text-xl font-bold text-slate-800 md:text-2xl">
                  <input
                    type="checkbox"
                    checked={isSchedulingEnabled}
                    onChange={(e) => setIsSchedulingEnabled(e.target.checked)}
                    className="h-5 w-5 accent-sky-500"
                  />
                  <CalendarClock className="h-5 w-5" />
                  جدولة الإهداء
                </label>

                <p className="mb-3 text-center text-sm font-semibold text-slate-600">
                  في حال عدم تفعيل الجدولة سيتم إرسال الإهداء مباشرة
                </p>

                {isSchedulingEnabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-center text-sm font-semibold text-slate-500">اختر التاريخ</label>
                      <Input
                        type="date"
                        value={donationDate}
                        onChange={(e) => setDonationDate(e.target.value)}
                        className="h-11 rounded-lg border-slate-300 text-center"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-center text-sm font-semibold text-slate-500">اختر الوقت</label>
                      <Input
                        type="time"
                        value={donationTime}
                        onChange={(e) => setDonationTime(e.target.value)}
                        className="h-11 rounded-lg border-slate-300 text-center"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={submitGift}
                className="h-11 w-full rounded-xl bg-sky-500 text-base font-extrabold text-white hover:bg-sky-600 md:h-12 md:text-lg"
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






