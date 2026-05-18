import { useState, useRef } from "react";
import { User, Phone, Banknote, Calendar, FileText, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BankTransferForm() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [transferCode, setTransferCode] = useState("");

  const quickAmounts = [500, 1000, 5000, 10000, 25000];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "حجم الملف كبير جداً",
        description: "الحد الأقصى للملف هو 10 ميجابايت",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "صيغة الملف غير مدعومة",
        description: "يرجى تحميل صورة (JPG/PNG) أو ملف PDF",
        variant: "destructive",
      });
      return;
    }

    setReceiptFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(""); // No preview for PDF
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !amount || !transferDate || !receiptFile) {
      toast({
        title: "بيانات ناقصة",
        description: "الرجاء تعبئة جميع الحقول وتحميل إيصال التحويل",
        variant: "destructive",
      });
      return;
    }

    if (Number(amount) <= 0) {
      toast({
        title: "مبلغ غير صحيح",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("amount", amount);
      formData.append("transferDate", transferDate);
      formData.append("receipt", receiptFile);

      const res = await fetch("/api/bank-transfers", {
        method: "POST",
        body: formData,
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.message || "تعذر إرسال الطلب");
      }

      setTransferCode(body.code);
      
      toast({
        title: "تم استلام طلبك بنجاح",
        description: `رقم الطلب: ${body.code}. سيتم مراجعة الإيصال وتحديث حالة التحويل`,
      });

      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setAmount("");
      setTransferDate("");
      setReceiptFile(null);
      setReceiptPreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: error instanceof Error ? error.message : "تعذر إرسال الطلب",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-5 md:py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-[760px]">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-emerald-100 p-4">
                <Banknote className="h-9 w-9 text-emerald-600" />
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              التبرع عبر التحويل البنكي
            </h1>
            <p className="text-lg text-slate-600">
              قدّم طلب تبرع عبر التحويل البنكي مع إيصال التحويل
            </p>
          </div>

          {/* Info Box */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="flex gap-3 pt-6">
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-blue-600" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold">كيفية التحويل:</p>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-xs">
                  <li>قم بتحويل المبلغ إلى الحساب البنكي للجمعية</li>
                  <li>احفظ إيصال التحويل (صورة أو PDF)</li>
                  <li>أرفق الإيصال في هذا النموذج</li>
                  <li>سيتم مراجعة الطلب وتحديثك عليه</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Main Form */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>بيانات التحويل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 flex items-center justify-center gap-2 text-base font-bold text-slate-800">
                  <User className="h-5 w-5 text-slate-500" />
                  الاسم الكامل
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل الاسم كاملاً"
                  className="h-12 rounded-xl border-slate-300 bg-white text-center text-base"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 flex items-center justify-center gap-2 text-base font-bold text-slate-800">
                  <FileText className="h-5 w-5 text-slate-500" />
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="h-12 rounded-xl border-slate-300 bg-white text-center text-base"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 flex items-center justify-center gap-2 text-base font-bold text-slate-800">
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

              {/* Amount */}
              <div>
                <label className="mb-2 flex items-center justify-center gap-2 text-base font-bold text-slate-800">
                  <Banknote className="h-5 w-5 text-emerald-500" />
                  المبلغ (بالريال)
                </label>
                
                {/* Quick Amount Buttons */}
                <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-5">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(String(quickAmount))}
                      className={`rounded-lg py-2 px-3 text-sm font-semibold transition ${
                        amount === String(quickAmount)
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {quickAmount.toLocaleString("ar-SA")}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="أو أدخل مبلغاً مخصصاً"
                  className="h-12 rounded-xl border-slate-300 bg-white text-center text-base"
                  min="1"
                />
              </div>

              {/* Transfer Date */}
              <div>
                <label className="mb-2 flex items-center justify-center gap-2 text-base font-bold text-slate-800">
                  <Calendar className="h-5 w-5 text-slate-500" />
                  تاريخ التحويل
                </label>
                <Input
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="h-12 rounded-xl border-slate-300 bg-white text-center text-base"
                />
              </div>

              {/* Receipt Upload */}
              <div>
                <label className="mb-2 flex items-center justify-center gap-2 text-base font-bold text-slate-800">
                  <Upload className="h-5 w-5 text-blue-500" />
                  إيصال التحويل
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 py-6 text-center hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  {receiptFile ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-700">{receiptFile.name}</p>
                      <p className="text-xs text-slate-500">
                        {(receiptFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-6 w-6 text-slate-400" />
                      <p className="text-sm font-semibold text-slate-600">
                        اضغط هنا لتحميل الإيصال
                      </p>
                      <p className="text-xs text-slate-500">JPG, PNG أو PDF</p>
                    </div>
                  )}
                </button>
              </div>

              {/* Image Preview */}
              {receiptPreview && (
                <div className="rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={receiptPreview}
                    alt="معاينة الإيصال"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-lg font-bold text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 transition"
              >
                {submitting ? "جاري الإرسال..." : "تقديم طلب التبرع"}
              </button>
            </CardContent>
          </Card>

          {/* Success Message */}
          {transferCode && (
            <Card className="mt-6 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="mb-2 text-sm font-semibold text-green-900">تم استلام طلبك بنجاح</p>
                  <p className="text-2xl font-bold text-green-700 font-mono">{transferCode}</p>
                  <p className="mt-2 text-xs text-green-800">
                    احفظ هذا الرقم للرجوع إليه لاحقاً
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <Card className="mt-6 border-slate-200">
            <CardHeader>
              <CardTitle>الأسئلة الشائعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold text-slate-900">كم وقت المراجعة؟</p>
                <p>عادة ما تتم مراجعة الطلب في غضون 24 ساعة عمل</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">هل سأتلقى تأكيد؟</p>
                <p>نعم، سنرسل لك رسالة بريد إلكتروني عند تأكيد التبرع</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">ماذا لو لم يظهر التحويل؟</p>
                <p>إذا لم يظهر تحويلك في غضون 48 ساعة، يرجى التواصل معنا</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
