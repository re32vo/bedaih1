import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, User, Phone, ArrowRight, CheckCircle, Send, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function DonorLogin() {
  const [stage, setStage] = useState<'form' | 'verify'>('form');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email.trim()) {
      toast({
        title: "خطأ",
        description: "البريد الإلكتروني مطلوب",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && (!formData.name.trim() || !formData.phone.trim())) {
      toast({
        title: "خطأ",
        description: "الاسم ورقم الهاتف مطلوبان",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/donors/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          isLogin
        }),
      });

      // Check content type before parsing
      const contentType = res.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        // If not JSON, get text and throw error
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("حدث خطأ في الخادم. الرجاء المحاولة مرة أخرى.");
      }

      if (!res.ok) {
        // If account doesn't exist in login mode, suggest registration
        if (data.shouldRegister) {
          toast({
            title: "الحساب غير موجود",
            description: data.message,
            variant: "destructive",
          });
          setIsLogin(false); // Switch to registration mode
          return;
        }
        
        // If account exists in registration mode, suggest login
        if (data.shouldLogin) {
          toast({
            title: "الحساب موجود مسبقاً",
            description: data.message,
            variant: "destructive",
          });
          setIsLogin(true); // Switch to login mode
          return;
        }
        
        throw new Error(data.message || "فشل إرسال الكود");
      }

      setStage('verify');
      
      toast({
        title: "✅ تم إرسال الكود",
        description: `تحقق من البريد الإلكتروني ${formData.email}`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال الكود",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      toast({
        title: "خطأ",
        description: "أدخل كود من 6 أرقام",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/donors/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          code: verificationCode.trim()
        }),
      });

      // Check content type before parsing
      const contentType = res.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        // If not JSON, get text and throw error
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("حدث خطأ في الخادم. الرجاء المحاولة مرة أخرى.");
      }

      if (!res.ok) {
        throw new Error(data.message || "كود التحقق غير صحيح");
      }
      
      toast({
        title: "✅ نجح التحقق",
        description: data.message || (isLogin ? "تم تسجيل الدخول" : "تم إنشاء الحساب"),
      });

      // Store token if provided
      if (data.token) {
        sessionStorage.setItem("donorToken", data.token);
        localStorage.setItem("donorEmail", formData.email.trim().toLowerCase());
      }

      setTimeout(() => setLocation('/donor-dashboard?login=true'), 500);
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل التحقق من الكود. الحساب لم ينشأ.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate inputs
    if (name === "email") {
      setFormData(prev => ({
        ...prev,
        [name]: value.toLowerCase()
      }));
    } else if (name === "phone") {
      // Only allow numbers
      const sanitized = value.replace(/\D/g, "");
      setFormData(prev => ({
        ...prev,
        [name]: sanitized
      }));
    } else if (name === "name") {
      // Only allow Arabic characters and spaces
      const arabicRegex = /[\u0600-\u06FF\s]/g;
      const sanitized = value.match(arabicRegex)?.join("") || "";
      setFormData(prev => ({
        ...prev,
        [name]: sanitized
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg"
          >
            <Heart className="w-8 h-8 text-white fill-white" />
          </motion.div>
          
          {stage === 'form' ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 font-heading">
                {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
              </h1>
              <p className="text-slate-600 text-sm">
                {isLogin 
                  ? "أدخل بريدك الإلكتروني للدخول" 
                  : "أدخل بياناتك لإنشاء حساب جديد"}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 font-heading">
                التحقق من البريد الإلكتروني
              </h1>
              <p className="text-slate-600 text-sm">
                تم إرسال كود التحقق إلى {formData.email}
              </p>
            </>
          )}
        </div>

        {/* Form Stage */}
        {stage === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100"
          >
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  <Mail className="inline-block w-4 h-4 ml-2" />
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50"
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      <User className="inline-block w-4 h-4 ml-2" />
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      <Phone className="inline-block w-4 h-4 ml-2" />
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="أدخل رقم هاتفك"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50"
                      required
                    />
                  </div>
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>جاري الإرسال...</>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    إرسال كود التحقق
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-slate-600 text-sm mb-3">
                {isLogin 
                  ? "ليس لديك حساب؟" 
                  : "لديك حساب بالفعل؟"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ email: "", name: "", phone: "" });
                  setVerificationCode("");
                }}
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                {isLogin ? "إنشاء حساب جديد" : "تسجيل الدخول"}
              </motion.button>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLocation('/')}
                className="text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <Home className="w-4 h-4" />
                العودة للصفحة الرئيسية
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Verification Stage */}
        {stage === 'verify' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100"
          >
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-600">
                  تم إرسال كود تحقق من 6 أرقام إلى البريد الإلكتروني
                </p>
                {!isLogin && (
                  <p className="text-xs text-emerald-700 mt-2 font-semibold">
                    ⚠️ لن يتم إنشاء الحساب إلا بعد التحقق من البريد
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  كود التحقق
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50 text-center text-2xl tracking-widest font-mono"
                  required
                  inputMode="numeric"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>جاري التحقق...</>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {isLogin ? "تأكيد الدخول" : "إنشاء الحساب"}
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  setStage('form');
                  setVerificationCode("");
                }}
                disabled={loading}
                className="w-full text-slate-600 font-semibold hover:text-slate-900 transition-colors py-2 disabled:opacity-50"
              >
                العودة للخلف
              </button>

              <button
                type="button"
                onClick={() => setLocation('/')}
                disabled={loading}
                className="w-full text-slate-500 hover:text-slate-700 transition-colors py-2 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Home className="w-4 h-4" />
                العودة للصفحة الرئيسية
              </button>
            </form>
          </motion.div>
        )}

        {/* Info Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200"
        >
          <p className="text-sm text-slate-600 text-center">
            <Heart className="inline-block w-4 h-4 text-red-500 ml-2 fill-current" />
            {stage === 'form' 
              ? "بيانات حسابك آمنة وسرية تماماً"
              : "سيصلك الكود عبر البريد الإلكتروني"}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
