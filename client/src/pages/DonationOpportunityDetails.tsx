import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Share2, Facebook, MessageCircle, Instagram, CreditCard, Landmark, Smartphone, LogIn, Check, Heart, ChevronDown, Copy } from "lucide-react";
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
import ResponsiveProjectImage from "@/components/ResponsiveProjectImage";
import { donationProjects } from "@/data/donationProjects";
import { useToast } from "@/hooks/use-toast";
import { startMoyasarPayment } from "@/lib/moyasar";

export default function DonationOpportunityDetails() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/donate/opportunities/:id");
  const selectedProject = match ? donationProjects.find((project) => project.id === params.id) : undefined;
  const { toast } = useToast();

  const [selectedAmount, setSelectedAmount] = useState<number>(selectedProject?.amounts[0] || 30);
  const [customAmount, setCustomAmount] = useState<string>(selectedProject?.amounts[0] ? String(selectedProject.amounts[0]) : "30");
  const [customDonation, setCustomDonation] = useState<boolean>(false);
  const [donationType, setDonationType] = useState<'single' | 'quick'>('quick');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [shareAmount, setShareAmount] = useState<number>(30);
  const [sharesCount, setSharesCount] = useState<number>(1);
  const [selectedShareType, setSelectedShareType] = useState<'good' | 'giving' | 'kindness' | 'custom'>('good');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [donorEmail, setDonorEmail] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [copiedDetail, setCopiedDetail] = useState<string | null>(null);

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

  const bankTransferDetails = {
    bank: "بنك الإنماء",
    accountName: "جمعية بداية الخيرية",
    accountNumber: "68206457616000",
    iban: "SA7705000068206457616000",
  };

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

    if (!selectedPaymentMethod) {
      toast({
        title: "اختر طريقة الدفع",
        description: "حدد التحويل البنكي أو البطاقة أو Apple Pay للمتابعة",
        variant: "destructive",
      });
      return;
    }

    // تبرع سريع - بدون تسجيل دخول
    if (donationType === 'quick') {
      processDonation();
      return;
    }

    // تبرع عادي - يتطلب تسجيل دخول
        if (donationType === 'single') {
          if (!isLoggedIn) {
            setLocation('/donor-login');
            return;
          }
          
          processDonation();
        }
  };

  const handleBankTransferDonation = async () => {
    try {
      const response = await fetch('/api/donors/donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isLoggedIn ? { Authorization: `Bearer ${sessionStorage.getItem('donorToken')}` } : {}),
        },
        body: JSON.stringify({
          amount: total,
          method: 'bank',
          status: 'under_review',
          email: donorEmail || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ أثناء تسجيل التحويل البنكي');
      }

      const query = new URLSearchParams();
      query.set('status', 'under_review');
      query.set('bank', '1');
      if (donationType === 'single') {
        query.set('donationType', donationType);
      }

      setLocation(`/thank-you?${query.toString()}`);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل تسجيل التبرع',
        variant: 'destructive',
      });
    }
  };

  const processDonation = async () => {
    const methodTitle = selectedPaymentMethod ? paymentMethods.find(m => m.id === selectedPaymentMethod)?.title : 'غير محدد';

    if (selectedPaymentMethod === 1) {
      await handleBankTransferDonation();
      return;
    }

    try {
      await startMoyasarPayment({
        amount: total,
        method: `${methodTitle}-${donationType}`,
        email: donorEmail || undefined,
        token: isLoggedIn ? sessionStorage.getItem('donorToken') || undefined : undefined,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تجهيز الدفع",
        variant: "destructive",
      });
    }
  };

  const getShareData = () => {
    const url = `${window.location.origin}/donate/opportunities/${selectedProject.id}`;
    const text = `ادعم ${selectedProject.title} الآن عبر موقعنا: ${url}`;
    return { url, text };
  };

  const handleShare = async () => {
    const { url, text } = getShareData();

    if (navigator.share) {
      try {
        await navigator.share({ title: selectedProject.title, text, url });
        return;
      } catch (error) {
        // إلغاء المستخدم أو خطأ بسيط
      }
    }

    await navigator.clipboard.writeText(url);
    toast({
      title: "تم نسخ الرابط",
      description: "يمكنك الآن لصق الرابط في أي تطبيق مشاركة.",
    });
  };

  const handleShareWhatsApp = () => {
    const { text } = getShareData();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareFacebook = () => {
    const { url } = getShareData();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  const handleCopyLink = async () => {
    const { url } = getShareData();
    await navigator.clipboard.writeText(url);
    toast({
      title: "تم نسخ الرابط",
      description: "يمكنك لصق الرابط ومشاركته في أي تطبيق.",
    });
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

            <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-bold text-slate-700">نوع التبرع</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    id: 'quick',
                    label: 'تبرع سريع',
                    description: 'بدون تسجيل دخول، يظهر لدى الجمعية باسم فاعل خير فقط.',
                  },
                  {
                    id: 'single',
                    label: 'تبرع عادي',
                    description: 'يتطلب تحقق بالبريد الإلكتروني، ويسجل في لوحة المتبرع ويصلك إيصال.',
                  },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDonationType(option.id as 'quick' | 'single')}
                    className={`rounded-3xl border p-4 text-left transition ${
                      donationType === option.id
                        ? 'border-[#26a1d0] bg-[#26a1d0]/10 text-[#0d6b82]'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-[#26a1d0]/50'
                    }`}
                  >
                    <p className="mb-1 text-sm font-bold">{option.label}</p>
                    <p className="text-xs leading-relaxed text-slate-600">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

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

            {selectedPaymentMethod === 1 && (
              <>
                <div className="mb-4 rounded-3xl border border-[#26a1d0] bg-[#f0fbff] p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-slate-900">التحويل البنكي</p>
                      <p className="text-sm text-slate-600">انسخ بيانات الحساب وأكمل التحويل من تطبيق البنك.</p>
                    </div>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#26a1d0]/10 text-[#26a1d0]">
                      <Landmark className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'البنك', value: bankTransferDetails.bank },
                      { label: 'اسم الحساب', value: bankTransferDetails.accountName },
                      { label: 'رقم الحساب', value: bankTransferDetails.accountNumber },
                      { label: 'آيبان', value: bankTransferDetails.iban },
                      { label: 'المبلغ', value: `${total.toLocaleString()} ر.س` },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm">
                        <div>
                          <p className="text-xs text-slate-500">{item.label}</p>
                          <p className="font-semibold text-slate-900">{item.value}</p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            await navigator.clipboard.writeText(String(item.value));
                            setCopiedDetail(item.label);
                            setTimeout(() => setCopiedDetail(null), 2000);
                          }}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-600 transition hover:bg-slate-100"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="mr-2 text-xs font-semibold">{copiedDetail === item.label ? 'تم النسخ' : 'نسخ'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 text-right text-sm font-semibold text-slate-700">
                  {donationType === 'quick'
                    ? 'تبرعك بتحويل بنكي سيتم تسجيله تحت المراجعة. بعد التحقق سيُرسل لك الإيصال.'
                    : 'تبرعك العادي بتحويل بنكي سيتم تسجيله تحت المراجعة. بعد الموافقة سيُرسل لك إشعار الإيصال.'}
                </div>
              </>
            )}

            {/* زر التبرع */}
            <Button 
              type="button" 
              onClick={handleDonateClick}
              className="h-12 w-full rounded-xl bg-[#26a1d0] text-white hover:bg-[#26a1d0]/90 text-lg font-bold"
            >
              {selectedPaymentMethod === 1 ? 'تم التحويل' : 'تبرع'}
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 order-1 lg:order-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-800">{selectedProject.title}</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600"
                >
                  <Instagram className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600"
                >
                  <Facebook className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ResponsiveProjectImage
              src={selectedProject.image}
              alt={selectedProject.title}
              wrapperClassName="mb-4 rounded-xl border border-slate-200"
            />

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
              {donationType === 'single' ? 'التبرع العادي يتطلب تسجيل دخول' : 'شكراً لتبرعك!'}
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
                  <span>حفظ سجل تبرعاتك في لوحة تحكم العميل</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>متابعة تبرعاتك في أي وقت</span>
                </li>
                {donationType === 'single' && (
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>يمكنك متابعة سجل تبرعاتك والإيصالات بعد تسجيل الدخول</span>
                  </li>
                )}
              </ul>
              {donationType === 'quick' && (
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  أو يمكنك المتابعة بدون تسجيل دخول
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            {donationType === 'quick' && (
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
