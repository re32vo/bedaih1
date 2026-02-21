import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, LogOut, Edit2, Plus, TrendingUp, Gift, Copy, Check, User, Phone, Mail, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import logoImg from "@/assets/logo.png";

interface Donation {
  id: string;
  amount: number;
  date: string;
  method: string;
  code: string;
}

interface DonorProfile {
  name: string;
  email: string;
  phone: string;
}

export default function DonorDashboard() {
  const [, setLocation] = useLocation();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [profileData, setProfileData] = useState<DonorProfile>({
    name: "",
    email: "",
    phone: "",
  });
  const [stats, setStats] = useState({
    totalDonations: 0,
    donationCount: 0,
    avgDonation: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
    
    // تحقق كل 5 ثوان إذا كان الحساب لسه موجود
    const checkInterval = setInterval(checkAccountExists, 5000);
    
    return () => clearInterval(checkInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = sessionStorage.getItem('donorToken');
      if (!token) {
        setLocation('/donor-login');
        return;
      }

      const res = await fetch('/api/donors/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem('donorToken');
          setLocation('/donor-login');
          return;
        }
        throw new Error('فشل جلب البيانات');
      }

      const data = await res.json();
      setProfileData(data.donor);
      setDonations(data.donations);
      setStats(data.stats);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('donorToken');
    localStorage.removeItem('donorEmail');
    setLocation('/');
  };

  const checkAccountExists = async () => {
    try {
      const token = sessionStorage.getItem('donorToken');
      if (!token) return;

      const res = await fetch('/api/donors/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        // إذا الـ API رجع خطأ (404 أو 401)، يعني الحساب محذوف
        toast({
          title: "تم حذف الحساب",
          description: "تم حذف حسابك من قبل المسؤولين",
          variant: "destructive"
        });
        
        sessionStorage.removeItem('donorToken');
        localStorage.removeItem('donorEmail');
        
        setTimeout(() => {
          setLocation('/');
        }, 2000);
      }
    } catch (error) {
      // تجاهل الأخطاء المؤقتة
    }
  };

  const handleBrowseSite = () => {
    // العودة للموقع بدون تسجيل خروج - المتبرع يظل مسجل دخول
    setLocation('/');
  };

  const handleSaveProfile = async () => {
    try {
      const token = sessionStorage.getItem('donorToken');
      const currentEmail = profileData.email; // البريد الحالي
      
      // جلب البريد الحالي من السيرفر
      const dashRes = await fetch('/api/donors/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const dashData = await dashRes.json();
      const serverEmail = dashData.donor.email;
      
      // إذا تغير البريد
      if (currentEmail !== serverEmail && !verificationMode) {
        console.log('📧 محاولة تغيير البريد من', serverEmail, 'إلى', currentEmail);
        
        const emailRes = await fetch("/api/donors/email", {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            newEmail: currentEmail
          })
        });

        const emailData = await emailRes.json();
        console.log('📧 رد البريد:', emailData);

        if (emailData.requiresVerification) {
          setVerificationMode(true);
          toast({
            title: "تم إرسال رمز التحقق",
            description: `تم إرسال رمز التحقق إلى ${currentEmail}`,
          });
          return;
        }

        throw new Error(emailData.message || "فشل تغيير البريد");
      }

      // إذا كان في verification mode، تحقق من الرمز
      if (verificationMode && verificationCode && currentEmail !== serverEmail) {
        console.log('✅ التحقق من الرمز:', verificationCode);
        
        const verifyRes = await fetch("/api/donors/email", {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            newEmail: currentEmail,
            verificationCode: verificationCode
          })
        });

        const verifyData = await verifyRes.json();
        console.log('✅ رد التحقق:', verifyData);

        if (!verifyRes.ok) {
          throw new Error(verifyData.message || "فشل التحقق");
        }

        // تحديث الـ token بالجديد
        if (verifyData.token) {
          sessionStorage.setItem('donorToken', verifyData.token);
          localStorage.setItem('donorEmail', currentEmail);
          console.log('🔑 تم تحديث الـ token:', verifyData.token.substring(0, 10) + '...');
        }

        // تحديث البيانات المحلية فوراً
        setProfileData({
          ...profileData,
          email: currentEmail
        });

        toast({
          title: "تم تحديث البريد",
          description: "تم تحديث بريدك الإلكتروني بنجاح"
        });
        
        setShowEditProfile(false);
        setVerificationMode(false);
        setVerificationCode("");
        
        // إعادة تحميل البيانات بعد تأكيد حفظ الـ token
        setTimeout(() => {
          fetchDashboardData();
        }, 100);
        return;
      }

      // تحديث الاسم والهاتف فقط (بدون تغيير البريد)
      if (!verificationMode || currentEmail === serverEmail) {
        console.log('📝 تحديث الاسم والهاتف');
        
        const response = await fetch("/api/donors/profile", {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            name: profileData.name,
            phone: profileData.phone
          })
        });

        const result = await response.json();
        console.log('📝 رد التحديث:', result);

        if (result.success) {
          setProfileData({
            ...profileData,
            name: result.donor.name,
            phone: result.donor.phone,
            email: result.donor.email
          });
          
          setShowEditProfile(false);
          toast({
            title: "تم التحديث",
            description: "تم تحديث بيانات الحساب بنجاح"
          });
        } else {
          throw new Error(result.message || 'فشل التحديث');
        }
      }
    } catch (error) {
      console.error('❌ خطأ في التحديث:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل تحديث البيانات",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <img 
            src={logoImg} 
            alt="شعار جمعية بداية" 
            className="w-32 h-32 object-contain mx-auto animate-logo-pulse" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-emerald-50 shadow-lg border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between mb-8 text-center sm:text-right">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <img 
                src={logoImg}
                alt="شعار جمعية بداية"
                className="w-24 h-24 object-contain"
              />
              <div className="text-center sm:text-right">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">لوحة المتبرعين</h1>
                <p className="text-slate-600 text-sm">مرحباً بك {profileData.name}</p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
              <Button
                onClick={handleBrowseSite}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Home className="w-4 h-4 ml-2" />
                تصفح الموقع
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full sm:w-auto bg-white hover:bg-red-50 text-red-500 border-2 border-red-500"
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">إجمالي التبرعات</p>
                  <p className="text-3xl font-bold mt-1 text-emerald-700">{stats.totalDonations.toLocaleString()}</p>
                  <p className="text-emerald-600 text-xs mt-1">ريال سعودي</p>
                </div>
                <Gift className="w-10 h-10 text-emerald-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">عدد التبرعات</p>
                  <p className="text-3xl font-bold mt-1 text-blue-700">{stats.donationCount}</p>
                  <p className="text-blue-600 text-xs mt-1">تبرعات</p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-600 text-sm font-medium">متوسط التبرع</p>
                  <p className="text-3xl font-bold mt-1 text-rose-700">{stats.avgDonation}</p>
                  <p className="text-rose-600 text-xs mt-1">ريال سعودي</p>
                </div>
                <Heart className="w-10 h-10 text-rose-500 fill-current" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Donations List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Gift className="w-6 h-6 text-emerald-500" />
                سجل التبرعات
              </h2>

              <div className="space-y-4">
                {donations.length > 0 ? (
                  donations.map((donation, index) => (
                    <motion.div
                      key={donation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-slate-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-6 h-6">
                              <path d="M50 30 L50 70 M30 50 L70 50" stroke="#10b981" strokeWidth="10" strokeLinecap="round"/>
                              <circle cx="50" cy="50" r="35" fill="none" stroke="#10b981" strokeWidth="6"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-emerald-700">{donation.amount} ريال</p>
                            <p className="text-sm text-slate-600">{donation.method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">{donation.date}</p>
                        </div>
                      </div>

                      <div className="bg-slate-100 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-800">{donation.code}</span>
                          <span className="text-xs text-slate-600">كود التبرع</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(donation.code)}
                          className="p-2 hover:bg-slate-200 rounded transition-colors"
                        >
                          {copiedCode === donation.code ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">لا توجد تبرعات حتى الآن</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-500" />
                بيانات الحساب
              </h3>

              {!showEditProfile ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">الاسم الكامل</p>
                    <p className="font-semibold text-slate-900">{profileData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">البريد الإلكتروني</p>
                    <p className="font-semibold text-slate-700 text-sm">{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">رقم الهاتف</p>
                    <p className="font-semibold text-slate-900">{profileData.phone}</p>
                  </div>
                  <Button
                    onClick={() => setShowEditProfile(true)}
                    className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <Edit2 className="w-4 h-4 ml-2" />
                    تعديل البيانات
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {!verificationMode ? (
                    <>
                      <div>
                        <label className="text-xs text-slate-700 mb-1 block">الاسم الكامل</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="أدخل اسمك الكامل"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right bg-white text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-700 mb-1 block">البريد الإلكتروني</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="أدخل بريدك الإلكتروني"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right bg-white text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-700 mb-1 block">رقم الهاتف</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="أدخل رقم هاتفك"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right bg-white text-slate-900"
                          dir="ltr"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSaveProfile}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          حفظ التغييرات
                        </Button>
                        <Button
                          onClick={() => setShowEditProfile(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-3">
                        <p className="text-sm text-blue-700">🔐 تحقق من البريد الجديد</p>
                        <p className="text-xs text-blue-600 mt-1">تم إرسال رمز تحقق إلى <strong>{profileData.email}</strong></p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-700 mb-1 block">رمز التحقق</label>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="أدخل الرمز 6 أرقام"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center text-2xl tracking-widest bg-white text-slate-900"
                          maxLength={6}
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={verificationCode.length !== 6}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
                        >
                          تأكيد
                        </Button>
                        <Button
                          onClick={() => {
                            setVerificationMode(false);
                            setVerificationCode("");
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200 p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-3">نصائح مهمة</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  احفظ كود التبرع لكل عملية
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  يمكنك تحديث بيانات حسابك
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  سنرسل لك تقارير شهرية
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
