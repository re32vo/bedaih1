import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Share2, Facebook, MessageCircle, Instagram, CreditCard, Landmark, Smartphone, LogIn, Check, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { donationProjects } from "@/data/donationProjects";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function DonationOpportunityDetails() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/donate/opportunities/:id");
  const selectedProject = match ? donationProjects.find((project) => project.id === params.id) : undefined;
  const { addItem } = useCart();
  const { toast } = useToast();

  const [selectedAmount, setSelectedAmount] = useState<number>(selectedProject?.amounts[0] || 30);
  const [customAmount, setCustomAmount] = useState<string>(selectedProject?.amounts[0] ? String(selectedProject.amounts[0]) : "30");
  const [customDonation, setCustomDonation] = useState<boolean>(false);
  const [donationType, setDonationType] = useState<'single' | 'quick' | 'recurring'>('quick');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [shareAmount, setShareAmount] = useState<number>(30);
  const [sharesCount, setSharesCount] = useState<number>(1);
  const [recurringPeriod, setRecurringPeriod] = useState<string>("monthly");
  const [selectedShareType, setSelectedShareType] = useState<'good' | 'giving' | 'kindness' | 'custom'>('good');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [donorEmail, setDonorEmail] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('donorToken');
    if (token) {
      fetch('/api/donors/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsLoggedIn(true);
          setDonorEmail(data.email);
        }
      })
      .catch(() => setIsLoggedIn(false));
    }
  }, []);

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

  const handleDonateClick = () => {
    if (total <= 0) {
      toast({
        title: "تنبيه",
        description: "الرجاء اختيار مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    // تبرع سريع - بدون تسجيل دخول
    if (donationType === 'quick') {
      // التوجه مباشرة للدفع
      toast({
        title: "تبرع",
        description: "سيتم توجيهك لإتمام التبرع بمبلغ " + total + " ريال",
      });
      return;
    }

    // تبرع واحد أو دوري - يتطلب تسجيل دخول
    if (donationType === 'single' || donationType === 'recurring') {
      if (!isLoggedIn) {
        setShowLoginDialog(true);
        return;
      }
      
      // إذا كان مسجل دخول، أكمل التبرع
      processDonation();
    }
  };

  const processDonation = async () => {
    const donationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const donationData = {
      email: donorEmail || 'guest@donation.local',
      amount: total,
      method: selectedPaymentMethod ? paymentMethods.find(m => m.id === selectedPaymentMethod)?.title : 'غير محدد',
      code: donationCode,
      type: donationType,
      recurringPeriod: donationType === 'recurring' ? recurringPeriod : undefined
    };

    try {
      await fetch('/api/donors/donation', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(isLoggedIn && { 'Authorization': `Bearer ${sessionStorage.getItem('donorToken')}` })
        },
        body: JSON.stringify(donationData)
      });
      
      toast({
        title: "تم التبرع بنجاح",
        description: `شكراً لك على تبرعك بمبلغ ${total} ريال`,
      });
      
      setLocation('/thank-you');
    } catch (error) {
      console.error('خطأ في تسجيل التبرع:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تسجيل التبرع",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 md:py-10" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-800 md:text-3xl">تفاصيل المشروع</h1>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => setLocation("/donate/opportunities")}>عودة</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 order-2 lg:order-1">
            <h2 className="mb-4 text-xl font-extrabold text-slate-800">مبلغ التبرع</h2>

            {/* خيارات التبرع */}
            <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCustomDonation(false);
                  setSelectedShareType('good');
                  setShareAmount(30);
                  setCustomAmount(String(30 * sharesCount));
                  setSelectedAmount(30 * sharesCount);
                }}
                className={`rounded-lg border px-3 py-2.5 text-sm font-bold transition ${
                  selectedShareType === 'good' && !customDonation
                    ? "border-[#26a1d0] bg-[#26a1d0]/10 text-[#26a1d0]"
                    : "border-slate-300 bg-white text-slate-700 hover:border-[#26a1d0]/50"
                }`}
              >
                سهم الجود
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomDonation(false);
                  setSelectedShareType('giving');
                  setShareAmount(20);
                  setCustomAmount(String(20 * sharesCount));
                  setSelectedAmount(20 * sharesCount);
                }}
                className={`rounded-lg border px-3 py-2.5 text-sm font-bold transition ${
                  selectedShareType === 'giving' && !customDonation
                    ? "border-[#26a1d0] bg-[#26a1d0]/10 text-[#26a1d0]"
                    : "border-slate-300 bg-white text-slate-700 hover:border-[#26a1d0]/50"
                }`}
              >
                سهم العطاء
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomDonation(false);
                  setSelectedShareType('kindness');
                  setShareAmount(30);
                  setCustomAmount(String(30 * sharesCount));
                  setSelectedAmount(30 * sharesCount);
                }}
                className={`rounded-lg border px-3 py-2.5 text-sm font-bold transition ${
                  selectedShareType === 'kindness' && !customDonation
                    ? "border-[#26a1d0] bg-[#26a1d0]/10 text-[#26a1d0]"
                    : "border-slate-300 bg-white text-slate-700 hover:border-[#26a1d0]/50"
                }`}
              >
                سهم الإحسان
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomDonation(true);
                  setSelectedShareType('custom');
                  setSelectedAmount(0);
                  setCustomAmount("");
                }}
                className={`rounded-lg border px-3 py-2.5 text-sm font-bold transition ${
                  customDonation
                    ? "border-[#26a1d0] bg-[#26a1d0]/10 text-[#26a1d0]"
                    : "border-slate-300 bg-white text-slate-700 hover:border-[#26a1d0]/50"
                }`}
              >
                بما تجود به نفسك
              </button>
            </div>

            {/* حقل المبلغ مع عدد الأسهم */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600">ريال</span>
                <Input
                  value={customAmount}
                  onChange={(e) => {
                    if (!customDonation) return;
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setCustomAmount(value);
                    
                    if (value === "0" || value === "") {
                      setSelectedAmount(0);
                    } else {
                      setSelectedAmount(Number(value));
                    }
                  }}
                  readOnly={!customDonation}
                  className={`h-14 rounded-xl border-2 border-slate-300 pr-14 text-left text-2xl font-bold focus:border-[#26a1d0] ${
                    customDonation ? 'bg-white' : 'bg-slate-50 cursor-not-allowed'
                  }`}
                  inputMode="numeric"
                  placeholder="0"
                />
              </div>
              
              {/* عدد الأسهم */}
              <div className="relative w-24">
                <select
                  value={String(sharesCount)}
                  onChange={(e) => {
                    const count = Number(e.target.value);
                    setSharesCount(count);
                    if (!customDonation && shareAmount > 0) {
                      setCustomAmount(String(shareAmount * count));
                      setSelectedAmount(shareAmount * count);
                    }
                  }}
                  className="h-14 w-full appearance-none rounded-xl border-2 border-slate-300 bg-white px-8 text-center text-xl font-bold text-slate-900 outline-none transition focus:border-[#26a1d0]"
                  aria-label="عدد الأسهم"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((num) => (
                    <option key={num} value={String(num)}>
                      {num}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* الإجمالي */}
            <div className="mb-4 text-center py-2">
              <p className="text-base font-semibold text-slate-600">الإجمالي</p>
              <p className="text-3xl font-black text-slate-900">{total} ر.س</p>
            </div>

            {/* وسائل الدفع */}
            <p className="mb-3 text-center text-base font-bold text-slate-700">اختر وسيلة الدفع الملائمة</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
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

            {/* زر التبرع */}
            <Button 
              type="button" 
              onClick={handleDonateClick}
              className="h-12 w-full rounded-xl bg-[#26a1d0] text-white hover:bg-[#26a1d0]/90 text-lg font-bold"
            >
              تبرع
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 order-1 lg:order-2">
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
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent className="max-w-md text-right" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-emerald-500" />
              {donationType === 'recurring' ? 'التبرع الدوري يتطلب تسجيل دخول' : 'شكراً لتبرعك!'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-700 text-base space-y-4 pt-4">
              <p className="font-semibold">سجل دخول للحصول على:</p>
              <ul className="space-y-2 mr-4">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>إيصال التبرع عبر البريد الإلكتروني</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>حفظ سجل تبرعاتك في لوحة المتبرعين</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>متابعة تبرعاتك في أي وقت</span>
                </li>
                {donationType === 'recurring' && (
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>إدارة تبرعاتك الدورية وإيقافها عند الحاجة</span>
                  </li>
                )}
              </ul>
              {donationType !== 'recurring' && (
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  أو يمكنك المتابعة بدون تسجيل دخول
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            {donationType !== 'recurring' && (
              <AlertDialogCancel 
                onClick={() => {
                  setShowLoginDialog(false);
                  processDonation();
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                تبرع بدون تسجيل
              </AlertDialogCancel>
            )}
            <AlertDialogAction 
              onClick={() => {
                setShowLoginDialog(false);
                setLocation('/donor-login');
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <LogIn className="w-4 h-4 ml-2" />
              تسجيل الدخول
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
