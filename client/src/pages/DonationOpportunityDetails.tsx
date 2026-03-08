import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { ShoppingCart, Share2, Facebook, MessageCircle, Instagram, CreditCard, Landmark, Smartphone, LogIn, Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const { addItem, getTotalItems } = useCart();
  const { toast } = useToast();

  const [selectedAmount, setSelectedAmount] = useState<number>(selectedProject?.amounts[0] || 30);
  const [customAmount, setCustomAmount] = useState<string>(selectedProject?.amounts[0] ? String(selectedProject.amounts[0]) : "30");
  const [customDonation, setCustomDonation] = useState<boolean>(false);
  const [donationType, setDonationType] = useState<'single' | 'quick' | 'recurring'>('quick');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [shareAmount, setShareAmount] = useState<number>(30);
  const [sharesCount, setSharesCount] = useState<number>(1);
  const [recurringPeriod, setRecurringPeriod] = useState<string>("monthly");
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
        title: "تبرع سريع",
        description: "سيتم توجيهك لإتمام التبرع مباشرة",
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

            {/* سهم الجود مع إمكانية تعديل المبلغ وعدد الأسهم */}
            <div className="mb-4 rounded-xl border-2 border-[#26a1d0] bg-[#26a1d0]/5 p-4">
              <h3 className="mb-3 text-sm font-bold text-slate-700">سهم الجود</h3>
              
              <div className="relative">
                <div className="flex items-center gap-2">
                  {/* عدد الأسهم على اليمين */}
                  <Select value={String(sharesCount)} onValueChange={(value) => {
                    const count = Number(value);
                    setSharesCount(count);
                    setCustomAmount(String(shareAmount * count));
                    setSelectedAmount(shareAmount * count);
                  }}>
                    <SelectTrigger className="h-12 w-20 rounded-lg bg-white text-center font-bold text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* المبلغ على اليسار */}
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600">ر.س</span>
                    <Input
                      type="number"
                      value={shareAmount}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        setShareAmount(value);
                        setCustomAmount(String(value * sharesCount));
                        setSelectedAmount(value * sharesCount);
                      }}
                      className="h-12 rounded-lg border-slate-300 bg-white text-center font-bold text-xl pl-14"
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="mt-3 bg-white rounded-lg p-2 border border-slate-200 text-center">
                  <span className="text-lg font-black text-[#26a1d0]">{shareAmount * sharesCount}</span>
                  <span className="text-sm text-slate-600 mr-1">ر.س</span>
                </div>
              </div>
            </div>

            {/* خيارات أخرى */}
            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[{ label: "سهم العطاء", value: 20 }, { label: "سهم الإحسان", value: 30 }, { label: "بما تجود به نفسك", value: 0 }].map((option) => (
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
                onClick={() => setDonationType('quick')}
                className={`rounded-lg px-2 py-2 text-xs sm:text-sm font-bold transition ${
                  donationType === 'quick' ? 'bg-slate-200 text-slate-800' : 'text-slate-700'
                }`}
              >
                تبرع سريع
              </button>
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
                onClick={() => setDonationType('recurring')}
                className={`rounded-lg px-2 py-2 text-xs sm:text-sm font-bold transition ${
                  donationType === 'recurring' ? 'bg-slate-200 text-slate-800' : 'text-slate-700'
                }`}
              >
                تبرع دوري
              </button>
            </div>

            {/* قسم اختيار المدة للتبرع الدوري */}
            {donationType === 'recurring' && (
              <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
                <h3 className="mb-3 text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-amber-600" />
                  التكرار
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'daily', label: 'يومي' },
                    { value: 'weekly', label: 'أسبوعي' },
                    { value: 'monthly', label: 'شهري' },
                    { value: 'annual', label: 'سنوي' }
                  ].map((period) => (
                    <button
                      key={period.value}
                      type="button"
                      onClick={() => setRecurringPeriod(period.value)}
                      className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                        recurringPeriod === period.value
                          ? 'bg-sky-500 text-white'
                          : 'bg-white text-slate-700 border border-slate-300'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-amber-700 bg-amber-100 rounded-lg p-2">
                  {isLoggedIn 
                    ? `سيتم خصم ${total} ريال ${recurringPeriod === 'daily' ? 'يومياً' : recurringPeriod === 'weekly' ? 'أسبوعياً' : recurringPeriod === 'monthly' ? 'شهرياً' : 'سنوياً'} تلقائياً`
                    : 'يتطلب تسجيل الدخول لتفعيل التبرع الدوري'}
                </p>
              </div>
            )}

            {/* رسالة توضيحية لكل نوع تبرع */}
            {donationType === 'quick' && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs text-emerald-700 font-semibold">
                  ⚡ تبرع سريع - يمكنك التبرع مباشرة بدون تسجيل دخول
                </p>
              </div>
            )}

            {donationType === 'single' && (
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-xs text-blue-700 font-semibold">
                  {isLoggedIn 
                    ? '✓ أنت مسجل دخول - يمكنك إتمام التبرع' 
                    : '🔐 يتطلب تسجيل الدخول لتسجيل التبرع في حسابك'}
                </p>
              </div>
            )}

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
              <Button 
                type="button" 
                onClick={handleDonateClick}
                className="h-11 rounded-xl bg-[#26a1d0] text-white hover:bg-[#26a1d0]/90"
              >
                تبرع
              </Button>
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
