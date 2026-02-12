import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader, Home, CheckCircle2 } from "lucide-react";

export default function Login() {
  const [stage, setStage] = useState<'form' | 'verify'>('form');
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "فشل إرسال الكود");
      }

      setStage('verify');
      toast({
        title: "✅ تم إرسال الكود",
        description: `تحقق من البريد الإلكتروني ${email}`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل إرسال الكود",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
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
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: verificationCode.trim()
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "كود التحقق غير صحيح");
      }

      const data = await res.json();
      
      toast({
        title: "✅ تم التحقق بنجاح",
        description: "جاري التوجيه للوحة التحكم...",
      });

      // Store token
      if (data.token) {
        sessionStorage.setItem("authToken", data.token);
      }

      setTimeout(() => setLocation("/dashboard"), 500);
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل التحقق من الكود",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="text-center bg-white rounded-t-lg p-6 sm:p-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-blue-100 rounded-full p-2 sm:p-3">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-3xl text-black">دخول الموظفين</CardTitle>
            <CardDescription className="text-gray-700 mt-2">
              {stage === 'form' ? 'أدخل بريدك الإلكتروني' : 'أدخل كود التحقق'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            {stage === 'form' ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-900">
                      سيتم إرسال كود التحقق إلى بريدك الإلكتروني
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-black font-semibold">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="employee@charity.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-right border-2 border-gray-300 focus:border-primary h-12 bg-white text-black"
                      dir="ltr"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary font-bold text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        جاري الإرسال...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        إرسال الكود
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-gray-700 hover:bg-gray-100"
                    onClick={() => setLocation("/")}
                  >
                    <Home className="w-4 h-4 ml-2" />
                    العودة للموقع
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-sm text-green-900">
                      تحقق من بريدك الإلكتروني وأدخل الكود
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-black font-semibold">
                      كود التحقق (6 أرقام)
                    </Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center border-2 border-gray-300 focus:border-primary h-12 text-2xl tracking-widest font-mono bg-white text-black"
                      maxLength="6"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary font-bold text-lg"
                    disabled={loading || verificationCode.length !== 6}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        جاري التحقق...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        تأكيد الدخول
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setStage('form');
                      setVerificationCode('');
                    }}
                  >
                    رجوع
                  </Button>
                </form>
              </motion.div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-300 text-center text-sm text-black">
              <p className="text-black">هل واجهت مشكلة؟</p>
              <a href="mailto:admin@charity.com" className="text-blue-600 hover:underline font-semibold">
                تواصل مع المسؤول
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gray-100 backdrop-blur rounded-lg p-4 text-center text-sm text-black border border-gray-300"
        >
          <p className="text-black">هذه الصفحة مخصصة للموظفين فقط</p>
          <p className="text-black mt-1">لا تشارك بيانات الدخول مع أحد</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
