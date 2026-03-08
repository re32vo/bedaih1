import { useState } from "react";
import { RefreshCw, User, Phone, FolderOpen, CalendarDays, Banknote, Hash } from "lucide-react";
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
    <div className="min-h-screen bg-slate-100 py-8 md:py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-5 md:p-8 shadow-sm">
          <div className="mb-7 text-center">
            <RefreshCw className="mx-auto mb-4 h-9 w-9 text-sky-500" />
            <h1 className="mb-4 text-4xl font-extrabold text-slate-900">التبرع الدوري</h1>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold leading-7 text-slate-600">
              اكتشف سهولة التبرع والعطاء بخدمة التبرع الدوري! اترك لنا العناية بتنفيذ تبرعاتك تلقائيا وفق الجداول الزمنية التي تناسبك، وساهم معنا!
            </div>
          </div>

          <div className="mb-6 border-t border-slate-200" />

          <div className="space-y-5">
            <div>
              <label className="mb-2 flex items-center justify-end gap-2 text-xl font-bold text-slate-800">
                <User className="h-5 w-5 text-slate-500" />
                الاسم
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل الإسم كاملاً"
                className="h-14 rounded-xl border-slate-300 bg-white text-right text-lg"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center justify-end gap-2 text-xl font-bold text-slate-800">
                <Phone className="h-5 w-5 text-slate-500" />
                رقم الجوال
              </label>
              <div className="flex h-14 items-center rounded-xl border border-slate-300 bg-white px-3">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="051 234 5678"
                  className="h-auto border-0 p-0 text-right text-2xl shadow-none focus-visible:ring-0"
                />
                <div className="mx-3 h-8 w-px bg-slate-200" />
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-600" dir="ltr">
                  <span>+966</span>
                  <span>🇸🇦</span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center justify-end gap-2 text-xl font-bold text-slate-800">
                <FolderOpen className="h-5 w-5 text-slate-500" />
                المشروع
              </label>
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger className="h-14 rounded-xl border-slate-300 bg-white text-lg">
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
              <label className="mb-3 flex items-center justify-end gap-2 text-xl font-bold text-slate-800">
                <CalendarDays className="h-5 w-5 text-sky-500" />
                التكرار
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {frequencies.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFrequency(item.key)}
                    className={`h-12 rounded-xl border text-lg font-bold transition-colors ${
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
              <label className="mb-3 flex items-center justify-end gap-2 text-xl font-bold text-slate-800">
                <Banknote className="h-5 w-5 text-slate-500" />
                المبلغ
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {amountOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`rounded-2xl border p-4 text-center transition-colors ${
                      selectedAmount === amount && !customAmount
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                    type="button"
                  >
                    <p className="text-4xl font-extrabold text-slate-900">{amount}</p>
                    <p className="text-sm font-bold text-slate-500">ريال</p>
                  </button>
                ))}
              </div>

              <div className="relative mt-3">
                <Hash className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="0"
                  className="h-14 rounded-xl border-slate-300 bg-white pr-10 text-left text-3xl font-bold"
                  inputMode="numeric"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="mt-2 h-14 w-full rounded-2xl bg-sky-500 text-xl font-extrabold text-white hover:bg-sky-600"
            >
              <RefreshCw className="h-5 w-5" />
              بدأ الاستقطاع
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}






