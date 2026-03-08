import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CampaignDonate() {
  const [campaignTitle, setCampaignTitle] = useState("");
  const [launcherName, setLauncherName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState("5000");
  const [project, setProject] = useState("");

  const titleSuggestions = ["صدقة عن () رحمه الله", "مساهمة جماعية عن ()", "صدقة عن والدي", "صدقة عن أمي"];
  const quickAmounts = [5000, 15000, 25000];

  const finalAmount = customAmount ? Number(customAmount) || 0 : selectedAmount;

  const handleSubmit = () => {
    if (!campaignTitle.trim() || !launcherName.trim() || !phone.trim() || !project || finalAmount <= 0) {
      alert("الرجاء تعبئة البيانات بشكل صحيح");
      return;
    }

    alert("تم إرسال طلب إطلاق الحملة بنجاح");
  };

  return (
    <div className="min-h-screen bg-slate-100 py-5 md:py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-[980px] rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
          <button
            type="button"
            className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-4 rounded-2xl border border-slate-200 bg-white py-4 text-center text-2xl font-extrabold text-slate-900 md:py-6 md:text-4xl">
            أطلق حملتك
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="rounded-2xl border border-sky-500 bg-white p-2">
              <div className="mb-2 flex flex-wrap justify-center gap-2">
                {titleSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setCampaignTitle(suggestion)}
                    className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 md:px-4 md:text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-xl bg-red-100 px-3 text-sm font-bold text-red-500 hover:bg-red-100 md:h-11 md:px-4 md:text-base"
                  onClick={() => setCampaignTitle("")}
                >
                  مسح
                </Button>

                <Input
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="h-10 rounded-xl border-0 bg-transparent text-center text-lg font-bold shadow-none focus-visible:ring-0 md:h-11 md:text-xl"
                  placeholder="عنوان الحملة"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-300 bg-white p-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-sky-100 px-3 py-2 text-sm font-bold text-sky-700 md:px-4 md:text-base">حدد كفاعل خير</span>
                <Input
                  value={launcherName}
                  onChange={(e) => setLauncherName(e.target.value)}
                  className="h-10 rounded-xl border-0 bg-transparent text-center text-lg font-bold shadow-none focus-visible:ring-0 md:h-11 md:text-xl"
                  placeholder="اسم مطلق الحملة"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-500 bg-white px-3 py-2">
              <div className="flex h-10 items-center md:h-11">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-auto border-0 p-0 text-center text-xl font-medium text-slate-600 shadow-none focus-visible:ring-0 md:text-3xl"
                  placeholder="051 234 5678"
                />
                <div className="mx-2 h-7 w-px bg-slate-200" />
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-700" dir="ltr">
                  <ChevronDown className="h-4 w-4" />
                  <span>🇸🇦</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-300 bg-white p-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 md:text-2xl">ريال</span>
                <Input
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value.replace(/[^0-9]/g, ""));
                    setSelectedAmount(0);
                  }}
                  className="h-10 rounded-xl border-0 bg-transparent text-center text-xl font-bold shadow-none focus-visible:ring-0 md:h-11 md:text-3xl"
                  placeholder="0"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount(String(amount));
                  }}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors md:px-5 md:text-base ${
                    selectedAmount === amount
                      ? "bg-sky-500 text-white"
                      : "bg-sky-100 text-sky-600"
                  }`}
                >
                  {amount} ريال
                </button>
              ))}
            </div>

            <Select value={project} onValueChange={setProject}>
              <SelectTrigger className="h-12 rounded-2xl border-slate-300 text-center text-xl font-bold md:h-14 md:text-2xl">
                <SelectValue placeholder="اختر المشروع" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="education">الدعم التعليمي</SelectItem>
                <SelectItem value="health">الدعم الصحي</SelectItem>
                <SelectItem value="housing">ترميم المنازل</SelectItem>
                <SelectItem value="food">السلال الغذائية</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-center pt-2">
              <Button
                type="button"
                onClick={handleSubmit}
                className="h-11 min-w-[170px] rounded-2xl bg-sky-500 text-xl font-extrabold text-white hover:bg-sky-600 md:h-14 md:min-w-[220px] md:text-2xl"
              >
                أطلق حملتك
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







