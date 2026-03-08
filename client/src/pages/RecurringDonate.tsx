import { useState } from "react";
import { User, Phone, FolderOpen, CalendarDays, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Frequency = "daily" | "weekly" | "monthly" | "yearly";

export default function RecurringDonate() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [project, setProject] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState("");

  const frequencies: { key: Frequency; label: string }[] = [
    { key: "daily", label: "يومي" },
    { key: "weekly", label: "أسبوعي" },
    { key: "monthly", label: "شهري" },
    { key: "yearly", label: "سنوي" },
  ];

  const amountOptions = [10, 50, 100];
  const finalAmount = customAmount ? Number(customAmount) || 0 : selectedAmount;

  const handleSubmit = () => {
    if (!fullName.trim() || !phone.trim() || !project || finalAmount <= 0) {
      alert("الرجاء تعبئة جميع الحقول واختيار مبلغ صحيح");
      return;
    }

    alert("تم استلام طلب الاستقطاع الدوري بنجاح");
  };

  return (
    <div className="min-h-screen bg-slate-100 py-5 md:py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-[760px] rounded-[24px] border border-slate-200 bg-white p-3 md:p-4 shadow-sm">
          <div className="mb-7 text-center">
            <Banknote className="mx-auto mb-4 h-9 w-9 text-sky-500" />
            <h1 className="mb-4 text-2xl font-extrabold text-slate-900 md:text-3xl">التبرع الدوري</h1>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-600">
              اكتشف سهولة التبرع والعطاء بخدمة التبرع الدوري! اترك لنا العناية بتنفيذ تبرعاتك تلقائيا وفق الجداول الزمنية التي تناسبك، وساهم معنا!
            </div>
          </div>

          <div className="mb-6 border-t border-slate-200" />

          <div className="space-y-5">
            <div>
              <label className="mb-2 flex items-center justify-center gap-2 text-base font-bold text-slate-800 md:text-lg">
                <User className="h-5 w-5 text-slate-500" />
                الاسم
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل الإسم كاملاً"
                className="h-12 rounded-xl border-slate-300 bg-white text-center text-base"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center justify-center gap-2 text-base font-bold text-slate-800 md:text-lg">
                <Phone className="h-5 w-5 text-slate-500" />
                رقم الجوال
              </label>
              <div className="flex h-12 items-center rounded-xl border border-slate-300 bg-white px-3">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="051 234 5678"
                  className="h-auto border-0 p-0 text-center text-lg shadow-none focus-visible:ring-0"
                />
                <div className="mx-3 h-8 w-px bg-slate-200" />
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-600" dir="ltr">
                  <span>+966</span>
                  <span>🇸🇦</span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center justify-center gap-2 text-base font-bold text-slate-800 md:text-lg">
                <FolderOpen className="h-5 w-5 text-slate-500" />
                المشروع
              </label>
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger className="h-12 rounded-xl border-slate-300 bg-white text-base">
                  <SelectValue placeholder="اختر المشروع" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="food">السلال الغذائية</SelectItem>
                  <SelectItem value="health">الدعم الصحي</SelectItem>
                  <SelectItem value="education">الدعم التعليمي</SelectItem>
                  <SelectItem value="housing">ترميم المنازل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-3 flex items-center justify-center gap-2 text-base font-bold text-slate-800 md:text-lg">
                <CalendarDays className="h-5 w-5 text-sky-500" />
                التكرار
              </label>
              <div className="grid grid-cols-4 gap-2">
                {frequencies.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFrequency(item.key)}
                    className={`h-10 rounded-xl border text-sm font-bold transition-colors md:h-11 md:text-base ${
                      frequency === item.key
                        ? "border-sky-500 bg-sky-50 text-sky-600"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 flex items-center justify-center gap-2 text-base font-bold text-slate-800 md:text-lg">
                <Banknote className="h-5 w-5 text-slate-500" />
                المبلغ
              </label>
              <div className="grid grid-cols-3 gap-2">
                {amountOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount(String(amount));
                    }}
                    className={`rounded-2xl border p-3 text-center transition-colors ${
                      selectedAmount === amount
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                    type="button"
                  >
                    <p className="text-2xl font-extrabold text-slate-900 md:text-3xl">{amount}</p>
                    <p className="text-xs font-bold text-slate-500 md:text-sm">ريال</p>
                  </button>
                ))}
              </div>

              <div className="relative mt-3">
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                  ريال
                </span>
                <Input
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value.replace(/[^0-9]/g, ""));
                    setSelectedAmount(0);
                  }}
                  placeholder="0"
                  className="h-11 rounded-xl border-slate-300 bg-white pr-16 text-center text-xl font-bold md:h-12 md:text-2xl"
                  inputMode="numeric"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="mt-2 h-11 w-full justify-center rounded-2xl bg-sky-500 text-center text-base font-extrabold text-white hover:bg-sky-600 md:h-12 md:text-lg"
            >
              تبرع الآن
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}






