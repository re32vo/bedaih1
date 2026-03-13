import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { CreditCard, Smartphone, Landmark, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { donationProjects } from "@/data/donationProjects";

const paymentMethods = [
  { id: "card", label: "بطاقة بنكية", icon: CreditCard },
  { id: "apple", label: "Apple Pay", icon: Smartphone },
  { id: "bank", label: "تحويل بنكي", icon: Landmark },
];

type DonationFlowType = "quick" | "regular";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getTotalAmount, getTotalItems, clearCart } = useCart();
  const { toast } = useToast();

  const [method, setMethod] = useState("card");
  const [flowType, setFlowType] = useState<DonationFlowType>("quick");
  const [processing, setProcessing] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStage, setAuthStage] = useState<"email" | "code">("email");
  const [authEmail, setAuthEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const query = new URLSearchParams(window.location.search);
  const isHeroCheckout = query.get("mode") === "hero";
  const heroProjectId = query.get("projectId") || "";
  const heroAmount = Number(query.get("amount") || 0);

  const heroProject = useMemo(() => {
    if (!isHeroCheckout || !heroProjectId) return null;
    return donationProjects.find((project) => project.id === heroProjectId) || null;
  }, [isHeroCheckout, heroProjectId]);

  const checkoutItems = useMemo(() => {
    if (isHeroCheckout && heroProject && heroAmount > 0) {
      return [
        {
          id: `hero-${heroProject.id}`,
          title: heroProject.title,
          amount: heroAmount,
          quantity: 1,
        },
      ];
    }

    return items.map((item) => ({
      id: `${item.id}-${item.amount}`,
      title: item.title,
      amount: item.amount,
      quantity: item.quantity,
    }));
  }, [isHeroCheckout, heroProject, heroAmount, items]);

  const totalItems = isHeroCheckout ? (checkoutItems.length > 0 ? 1 : 0) : getTotalItems();
  const totalAmount = isHeroCheckout
    ? checkoutItems.reduce((acc, item) => acc + item.amount * item.quantity, 0)
    : getTotalAmount();

  const generateDonationCode = () => `DON-${Date.now().toString().slice(-8)}`;

  const submitDonation = async (token?: string) => {
    if (totalAmount <= 0) {
      toast({
        title: "لا يوجد مبلغ",
        description: "تعذر تحديد مبلغ التبرع",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const donationCode = generateDonationCode();
      const isQuick = flowType === "quick";
      const anonymousEmail = `anonymous-${Date.now()}@donation.local`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const authToken = token || sessionStorage.getItem("donorToken") || "";
      if (!isQuick && authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const res = await fetch("/api/donors/donation", {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: isQuick ? anonymousEmail : authEmail.trim().toLowerCase(),
          amount: totalAmount,
          method: `${method}-${flowType}`,
          code: donationCode,
          name: isQuick ? "فاعل خير" : undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "فشل تنفيذ التبرع");
      }

      if (!isHeroCheckout) {
        clearCart();
      }

      toast({
        title: "تم التبرع بنجاح",
        description: isQuick
          ? "تم تسجيل تبرعك كفاعل خير"
          : "تم تسجيل تبرعك وإرسال إيصال على البريد",
      });

      setLocation("/thank-you");
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء التبرع",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const sendOtpForRegularDonation = async () => {
    if (!authEmail.trim()) {
      toast({
        title: "البريد مطلوب",
        description: "أدخل البريد الإلكتروني للمتابعة",
        variant: "destructive",
      });
      return;
    }

    setAuthLoading(true);
    try {
      let res = await fetch("/api/donors/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail.trim().toLowerCase(),
          isLogin: true,
        }),
      });

      let data = await res.json().catch(() => ({}));

      // إذا الحساب غير موجود، ينشئ حساب بسيط ثم يرسل الكود
      if (!res.ok && data.shouldRegister) {
        res = await fetch("/api/donors/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: authEmail.trim().toLowerCase(),
            name: "متبرع",
            phone: "0500000000",
            isLogin: false,
          }),
        });
        data = await res.json().catch(() => ({}));
      }

      if (!res.ok) {
        throw new Error(data.message || "فشل إرسال كود التحقق");
      }

      setAuthStage("code");
      toast({
        title: "تم إرسال الكود",
        description: "تحقق من بريدك الإلكتروني",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل إرسال كود التحقق",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyOtpAndDonate = async () => {
    if (authCode.trim().length !== 6) {
      toast({
        title: "كود غير صحيح",
        description: "أدخل كود من 6 أرقام",
        variant: "destructive",
      });
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch("/api/donors/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail.trim().toLowerCase(),
          code: authCode.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "فشل التحقق");
      }

      if (data.token) {
        sessionStorage.setItem("donorToken", data.token);
        localStorage.setItem("donorEmail", authEmail.trim().toLowerCase());
      }

      setShowAuthModal(false);
      await submitDonation(data.token);
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل التحقق من الكود",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const startCheckout = async () => {
    if (flowType === "quick") {
      await submitDonation();
      return;
    }

    const token = sessionStorage.getItem("donorToken");
    if (token) {
      await submitDonation(token);
      return;
    }

    setShowAuthModal(true);
    setAuthStage("email");
    const savedEmail = localStorage.getItem("donorEmail") || "";
    setAuthEmail(savedEmail);
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 py-10" dir="rtl">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-3">صفحة الدفع</h1>
          <p className="text-slate-600 mb-6">لا توجد عناصر جاهزة للدفع حاليا</p>
          <Button onClick={() => setLocation("/banner-donate")} className="bg-sky-600 hover:bg-sky-700 text-white">
            العودة لصفحة التبرع
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10" dir="rtl">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-5">إتمام الدفع</h1>

          <div className="space-y-4">
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

            <div>
              <p className="mb-2 text-sm font-bold text-slate-700">نوع التبرع</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFlowType("quick")}
                  className={`rounded-xl border p-3 text-right transition ${
                    flowType === "quick"
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                >
                  <p className="font-bold text-slate-900">تبرع سريع</p>
                  <p className="text-xs text-slate-500 mt-1">بدون تسجيل دخول. يظهر لدى الجمعية باسم فاعل خير فقط.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFlowType("regular")}
                  className={`rounded-xl border p-3 text-right transition ${
                    flowType === "regular"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                >
                  <p className="font-bold text-slate-900">تبرع عادي</p>
                  <p className="text-xs text-slate-500 mt-1">يتطلب تحقق بالبريد. يسجل في لوحة المتبرع ويصلك إيصال.</p>
                </button>
              </div>
            </div>

            <Button
              type="button"
              onClick={startCheckout}
              disabled={processing}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-base font-extrabold"
            >
              {processing ? "جارٍ التنفيذ..." : "تأكيد الدفع"}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm h-fit">
          <h2 className="text-xl font-extrabold text-slate-800 mb-4">ملخص التبرع</h2>
          <div className="space-y-2 mb-4">
            {checkoutItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-700 line-clamp-1">{item.title}</span>
                <span className="font-bold text-slate-900">{item.amount * item.quantity} ر.س</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>عدد العناصر</span>
              <span className="font-bold">{totalItems}</span>
            </div>
            <div className="flex justify-between text-slate-900 text-lg font-extrabold">
              <span>الإجمالي</span>
              <span>{totalAmount} ر.س</span>
            </div>
            {isHeroCheckout && (
              <p className="text-xs text-emerald-700 mt-2">هذا الدفع خاص بمشروع البانر فقط ولا يشمل السلة.</p>
            )}
          </div>
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center text-slate-500">
                <User className="w-6 h-6" />
              </div>
              <div className="w-5" />
            </div>

            <h3 className="text-center text-2xl font-extrabold text-slate-900 mb-4">تسجيل الدخول</h3>

            {authStage === "email" ? (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                <Input
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="h-11"
                />
                <Button
                  type="button"
                  onClick={sendOtpForRegularDonation}
                  disabled={authLoading}
                  className="w-full h-11 bg-black hover:bg-slate-800 text-white font-bold"
                >
                  {authLoading ? "جارٍ الإرسال..." : "إرسال كود التحقق"}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">كود التحقق (6 أرقام)</label>
                <Input
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="000000"
                  maxLength={6}
                  className="h-11 text-center tracking-[0.35em]"
                />
                <Button
                  type="button"
                  onClick={verifyOtpAndDonate}
                  disabled={authLoading}
                  className="w-full h-11 bg-black hover:bg-slate-800 text-white font-bold"
                >
                  {authLoading ? "جارٍ التحقق..." : "تأكيد الكود والمتابعة"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
