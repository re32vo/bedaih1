import { useState, useEffect, useRef } from "react";
import { Heart, Smartphone, Landmark, CreditCard, Copy, Check, Zap, Users, Target, Award, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const donationMethods = [
  {
    id: 1,
    title: "التحويل البنكي",
    description: "حول الأموال مباشرة إلى حساب الجمعية",
    emoji: "🏦",
    icon: Landmark,
    details: {
      bank: "بنك الإنماء",
      accountName: "جمعية بداية الخيرية",
      accountNumber: "68206457616000",
      iban: "SA7705000068206457616000",
    }
  },
  {
    id: 2,
    title: "بطاقة الائتمان",
    description: "ادفع بأمان باستخدام بطاقتك",
    emoji: "💳",
    icon: CreditCard,
  },
  {
    id: 3,
    title: "Apple Pay",
    description: "ادفع بسهولة عبر Apple Pay",
    emoji: "🍎",
    icon: Smartphone,
  },
];



export default function Donate() {
  const [copied, setCopied] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [donorEmail, setDonorEmail] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const paymentDetailsRef = useRef<HTMLDivElement>(null);

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

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleProceedToPayment = () => {
    if (!finalAmount || finalAmount <= 0) {
      alert('الرجاء اختيار مبلغ صحيح');
      return;
    }
    setShowPaymentMethods(true);
    setTimeout(() => {
      paymentDetailsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCompletePayment = async () => {
    if (!selectedMethod) return;

    // إذا لم يكن مسجل دخول، اعرض الـ dialog
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }

    // إذا كان مسجل دخول، أكمل التبرع مباشرة
    await processDonation();
  };

  const processDonation = async () => {
    const method = donationMethods.find(m => m.id === selectedMethod);
    const donationCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    try {
      if (isLoggedIn && donorEmail) {
        await fetch('/api/donors/donation', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('donorToken')}`
          },
          body: JSON.stringify({
            email: donorEmail,
            amount: finalAmount,
            method: method?.title || 'غير محدد',
            code: donationCode
          })
        });
        
        setLocation('/thank-you?registered=true');
      } else {
        await fetch('/api/donors/donation', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'guest@donation.local',
            amount: finalAmount,
            method: method?.title || 'غير محدد',
            code: donationCode
          })
        });

        setLocation('/thank-you');
      }
    } catch (error) {
      console.error('خطأ في تسجيل التبرع:', error);
      alert('حدث خطأ في تسجيل التبرع');
    }
  };

  const selectedMethodObj = donationMethods.find(m => m.id === selectedMethod);
  const quickAmounts = [10, 20, 30, 50, 100, 500, 1000, 2000];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - banner like Home/About */}
      <section className="relative pt-0 pb-0 bg-white">
        <div className="w-full relative">
          <img src="https://h.top4top.io/p_3683pksu61.jpg" alt="بانر التبرع" className="w-full h-64 object-cover object-center" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 mb-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 bg-white bg-opacity-90 rounded-xl py-8 shadow"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <Heart className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 text-sm font-medium">تبرع وغير الحياة</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black leading-tight">
              كل ريال
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black max-w-3xl mx-auto">
              يحمل أملاً
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Amount Selection */}
      <section id="amount-selection" className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">اختر مبلغ التبرع</h2>
              <p className="text-slate-700">ادخل المبلغ الذي تود التبرع به</p>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {quickAmounts.map((amount) => (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setCustomAmount(amount.toString());
                    setSelectedAmount(null);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all font-bold ${
                    customAmount === amount.toString()
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-300 bg-white hover:border-emerald-500/50 text-slate-700'
                  }`}
                >
                  ر.س {amount}
                </motion.button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto w-full"
            >
              <label className="block text-sm font-bold text-slate-900 mb-3">أو ادخل مبلغاً آخر</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="مثال: 100"
                className="w-full px-4 py-3 border-2 border-slate-300 bg-white text-slate-900 rounded-lg focus:outline-none focus:border-emerald-500 text-lg"
                min="1"
              />
            </motion.div>

            {/* Proceed Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Button
                onClick={handleProceedToPayment}
                disabled={!finalAmount || finalAmount <= 0}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-12 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                <Heart className="w-5 h-5 ml-2" />
                متابعة التبرع
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Payment Methods Section */}
      {showPaymentMethods && (
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white" ref={paymentDetailsRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">اختر طريقة الدفع</h2>
              <p className="text-slate-700">
                مبلغ التبرع: <span className="font-bold text-emerald-600">ر.س {finalAmount}</span>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {donationMethods.map((method) => (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-6 rounded-lg border-2 transition-all text-center ${
                    selectedMethod === method.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-300 hover:border-emerald-500/50 bg-white text-slate-700'
                  }`}
                >
                  {method.id === 3 ? (
                    <div className="h-14 flex items-center justify-center mb-3">
                      <img 
                        src="/ap.jpg" 
                        alt="Apple Pay" 
                        className="h-14 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-14 flex items-center justify-center mb-3 text-5xl">
                      {method.emoji}
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900 mb-1">{method.title}</h3>
                  <p className="text-xs text-slate-700">{method.description}</p>
                </motion.button>
              ))}
            </div>

            {/* Payment Method Details */}
              {selectedMethodObj && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 md:p-8 max-w-2xl mx-auto border-2 border-slate-200 shadow-sm"
              >
                {selectedMethodObj.id === 1 && selectedMethodObj.details && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-slate-200">
                      <h4 className="font-bold text-slate-900 text-lg">بيانات التحويل البنكي</h4>
                      <img 
                        src="/Alinma-Bank-Symbol.png" 
                        alt="بنك الإنماء" 
                        className="h-10 object-contain"
                      />
                    </div>
                    {[
                      { label: 'البنك', value: selectedMethodObj.details.bank, id: 0 },
                      { label: 'اسم الحساب', value: selectedMethodObj.details.accountName, id: 1 },
                      { label: 'رقم الحساب', value: selectedMethodObj.details.accountNumber, id: 2 },
                      { label: 'الآيبان', value: selectedMethodObj.details.iban, id: 3 }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">{item.label}</p>
                          <p className="font-bold text-slate-900">{item.value}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.value, item.id)}
                          className="p-2 hover:bg-slate-100 rounded transition-colors"
                        >
                          {copied === item.id ? (
                            <Check className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Copy className="w-5 h-5 text-slate-500" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {selectedMethodObj.id === 2 && (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">💳</div>
                    <p className="text-slate-700 text-lg">سيتم تحويلك لبوابة الدفع الآمنة لإتمام العملية</p>
                  </div>
                )}
                {selectedMethodObj.id === 3 && (
                  <div className="text-center py-8">
                    <img 
                      src="/ap.jpg" 
                      alt="Apple Pay" 
                      className="h-16 mx-auto mb-4 object-contain"
                    />
                    <p className="text-slate-700 text-lg">ادفع بسهولة وأمان عبر Apple Pay</p>
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex gap-3 max-w-md mx-auto">
              <Button
                onClick={() => {
                  setShowPaymentMethods(false);
                  setSelectedMethod(null);
                }}
                variant="outline"
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleCompletePayment}
                disabled={!selectedMethod}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                <Heart className="w-4 h-4 ml-2" />
                تأكيد التبرع
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">أسئلة شائعة</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "هل تبرعي آمن وموثوق؟",
                a: "نعم بكل تأكيد. جمعية بداية منظمة رسمية معتمدة وجميع التبرعات تُستخدم وفقاً للقوانين والتشريعات."
              },
              {
                q: "كيف يمكنني معرفة كيفية استخدام تبرعي؟",
                a: "نوفر تقارير شفافة دورية توضح كيفية استخدام التبرعات ونتائج برامجنا الخيرية."
              },
              {
                q: "هل يمكنني التبرع بشكل دوري؟",
                a: "نعم، يمكنك التبرع بشكل شهري أو سنوي. يمكنك التواصل معنا للتفاصيل."
              },
              {
                q: "ماذا لو كان لدي استفسار عن تبرعي؟",
                a: "يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف وسنرد على جميع استفساراتك."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.q}</h3>
                <p className="text-slate-700 leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent className="max-w-md text-right" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-emerald-500" />
              شكراً لتبرعك!
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
              </ul>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                أو يمكنك المتابعة بدون تسجيل دخول
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel 
              onClick={() => {
                setShowLoginDialog(false);
                processDonation();
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              تبرع بدون تسجيل
            </AlertDialogCancel>
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







