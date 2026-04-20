import { motion } from "framer-motion";
import { Heart, CheckCircle, ArrowRight, Home, Star } from "lucide-react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ThankYou() {
  const search = useSearch();
  const { toast } = useToast();
  const isLoggedIn = new URLSearchParams(search).get('login') === 'true';
  const isRegistered = new URLSearchParams(search).get('registered') === 'true';
  const initialEmail = new URLSearchParams(search).get('email') || localStorage.getItem('donorEmail') || '';

  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleSubmitReview = async () => {
    if (rating < 1) {
      toast({ title: "اختر التقييم", description: "الرجاء اختيار عدد النجوم", variant: "destructive" });
      return;
    }

    if (comment.trim().length < 5) {
      toast({ title: "التعليق قصير", description: "أدخل تعليقًا لا يقل عن 5 أحرف", variant: "destructive" });
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/public/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'متبرع',
          email: email.trim() || undefined,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'تعذر إرسال التقييم');
      }

      setRating(0);
      setComment('');
      toast({ title: "شكرًا لك", description: "تم إرسال تقييمك بنجاح" });
    } catch (err) {
      toast({
        title: "تعذر إرسال التقييم",
        description: err instanceof Error ? err.message : "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 font-heading">
            شكراً لك من القلب
            <Heart className="inline-block w-10 h-10 sm:w-12 sm:h-12 text-red-500 fill-current mx-2" />
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-700 leading-relaxed">
            تبرعك يعني الكثير لنا وللمحتاجين
          </p>

          <div className="card-elevated max-w-lg mx-auto p-8">
            <p className="text-lg text-slate-600 leading-relaxed">
              بفضل تبرعك السخي، نستطيع الوصول إلى المزيد من الأسر المحتاجة وتقديم الدعم الذي يستحقونه. 
              كل ريال يساهم في صنع فرق حقيقي في حياة الناس.
            </p>
          </div>
        </motion.div>

        {/* What's Next - Only for logged in users */}
        {(isLoggedIn || isRegistered) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6 mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              ماذا بعد؟
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <div className="card-base text-right">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="font-bold text-slate-900 mb-2">سنرسل لك إيصالاً</h3>
                <p className="text-sm text-slate-600">إيصال تبرعك سيصلك عبر البريد الإلكتروني قريباً</p>
              </div>
              
              <div className="card-base text-right">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold text-slate-900 mb-2">تابع تأثيرك</h3>
                <p className="text-sm text-slate-600">سنشاركك تقارير عن كيفية استخدام تبرعك</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (isLoggedIn || isRegistered) ? 0.8 : 0.6 }}
          className="space-y-6"
        >
          <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-right shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">قيّم تجربة التبرع</h3>
            <p className="text-slate-600 text-sm sm:text-base mb-4">يسعدنا تقييمك، وسيظهر تلقائيًا في الصفحة الرئيسية بعد الإرسال.</p>

            <div className="flex items-center justify-center gap-1 mb-4" dir="ltr">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)} className="p-1" aria-label={`تقييم ${value}`}>
                  <Star className={`w-7 h-7 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم (اختياري)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني (اختياري)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="اكتب تقييمك هنا"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 mb-3"
            />

            <Button onClick={handleSubmitReview} disabled={submittingReview} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
              {submittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
              >
                <Home className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
            
            <Link href="/donate">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
              >
                تبرع مرة أخرى
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>

          {/* Additional Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (isLoggedIn || isRegistered) ? 1.0 : 0.8 }}
            className="mt-12 p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white"
          >
            <p className="text-lg font-semibold mb-2">
              "خير الناس أنفعهم للناس"
            </p>
            <p className="text-sm text-slate-300">
              جزاك الله خيراً على عطائك وجعله في ميزان حسناتك
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}






