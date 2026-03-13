import { Link, useLocation } from "wouter";
import { Heart, Menu, X, Phone, MapPin, Mail, LogIn, User, ChevronDown, ChevronUp, MessageCircle, Clock3, CalendarDays, Gift, Rocket, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme.tsx";
import { useCart } from "@/hooks/use-cart";

import logoImg from "@/assets/logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [isDonorLoggedIn, setIsDonorLoggedIn] = useState(false);
  const [isDonationWidgetVisible, setIsDonationWidgetVisible] = useState(true);
  const { getTotalItems } = useCart();
  // تم تعطيل التبديل بين الوضعين، الموقع دائمًا أبيض

  useEffect(() => {
    const token = sessionStorage.getItem("donorToken");
    setIsDonorLoggedIn(!!token);
  }, [location]);

  useEffect(() => setIsMenuOpen(false), [location]);

  const isEmployeePage = ["/dashboard", "/admin", "/login", "/logs"].includes(location);
  const isDonorPage = ["/donor-dashboard", "/donor-login"].includes(location);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
  ];

  const aboutLinks = [
    { href: "/about", label: "نبذه علي الجمعية" },
    { href: "/members", label: "أعضاء الجمعية" },
    { href: "/governance", label: "الحوكمة" },
    { href: "/awards", label: "الجوائز" },
    { href: "/director-contact", label: "بيانات التواصل مع المدير" },
    { href: "/donation-methods", label: "طرق التبرع" },
    { href: "/bank-accounts", label: "الحسابات البنكية" },
  ];

  const volunteerLinks = [
    { href: "/volunteer/form", label: "استمارة التطوع" },
    { href: "/volunteer/health-platform", label: "منصة التطوع الصحي" },
    { href: "/volunteer/donation-platform", label: "منصة التبرع" },
    { href: "/volunteer/reports", label: "التقارير التطوعية" },
  ];

  const programsLinks = [
    { href: "/programs/treatment", label: "البرامج العلاجية" },
    { href: "/programs/awareness", label: "البرامج التوعوية" },
  ];

  const mediaCenterLinks = [
    { href: "/media/library", label: "المكتبة الإعلامية" },
    { href: "/media/news", label: "الأخبار" },
    { href: "/media/testimonials", label: "قالوا عن الجمعية" },
    { href: "/media/announcements", label: "إعلانات" },
    { href: "/media/smile-story", label: "قصة ابتسامة" },
    { href: "/media/reports", label: "التقارير الدورية" },
    { href: "/jobs", label: "التوظيف" },
  ];

  const donationOptionsLinks = [
    { href: "/donate", label: "التبرع السريع" },
    { href: "/donate/recurring", label: "التبرع الدوري" },
    { href: "/donate/tribute", label: "إهداء التبرع" },
    { href: "/donate/campaign", label: "أطلق حملتك" },
    { href: "/donate/opportunities", label: "فرص التبرع" },
  ];

  const handleDonateClick = () => {
    const el = document.getElementById("donate-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.location.href = "/#donate-section";
  };

  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<"about" | "programs" | "volunteer" | "media" | "donation" | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<"about" | "programs" | "volunteer" | "media" | "donation" | null>(null);

  // Helper functions for desktop dropdowns
  const toggleDesktopDropdown = (name: "about" | "programs" | "volunteer" | "media" | "donation") => {
    setOpenDesktopDropdown(openDesktopDropdown === name ? null : name);
  };

  // Helper functions for mobile dropdowns
  const toggleMobileDropdown = (name: "about" | "programs" | "volunteer" | "media" | "donation") => {
    setOpenMobileDropdown(openMobileDropdown === name ? null : name);
  };

  if (isEmployeePage || isDonorPage) return <div className="min-h-screen font-body rtl" dir="rtl">{children}</div>;

  return (
    <div className="min-h-screen font-body flex flex-col rtl bg-slate-900 overflow-x-hidden" dir="rtl">
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 w-full">
        <div className="relative container mx-auto px-3 sm:px-4 py-2.5 sm:py-3 min-h-[76px] sm:min-h-[84px] flex items-center justify-between">
          <div className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2">
            <button
              className="p-2 text-white bg-slate-800 rounded-lg border border-slate-700 shadow-sm hover:bg-slate-700 touch-manipulation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="فتح قائمة التصنيفات"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {location !== '/cart' && (
              <Link href="/cart">
                <button
                  className="relative overflow-visible bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full px-3 py-2 shadow-lg flex items-center gap-1.5 touch-manipulation"
                  aria-label="الانتقال إلى السلة"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-xs font-bold">السلة</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-white leading-none">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </Link>
            )}
          </div>

          <Link href="/" className="absolute right-3 sm:right-4 md:static md:right-auto">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <img src={logoImg} alt="شعار جمعية بداية" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <div className="flex flex-col">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white">جمعية بداية</h1>
                <p className="text-xs text-slate-600 dark:text-slate-300">جمعية خيرية موثوقة</p>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2 relative">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${location === link.href ? "font-semibold bg-emerald-500 text-white dark:bg-emerald-600" : "text-slate-700 dark:text-white hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"}`}>
                  {link.label}
                </span>
              </Link>
            ))}

            {/* about dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => toggleDesktopDropdown("about")}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
              >
                من نحن <ChevronDown className="w-4 h-4 mr-1" />
              </button>
              {openDesktopDropdown === "about" && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
                  {aboutLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={`block px-4 py-2 text-sm cursor-pointer transition-colors ${
                          location === link.href
                            ? "bg-emerald-500 text-white"
                            : "text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                        }`}
                        onClick={() => setOpenDesktopDropdown(null)}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* programs dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => toggleDesktopDropdown("programs")}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
              >
                برامجنا <ChevronDown className="w-4 h-4 mr-1" />
              </button>
              {openDesktopDropdown === "programs" && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
                  {programsLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={`block px-4 py-2 text-sm cursor-pointer transition-colors ${
                          location === link.href
                            ? "bg-emerald-500 text-white"
                            : "text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                        }`}
                        onClick={() => setOpenDesktopDropdown(null)}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* volunteer dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => toggleDesktopDropdown("volunteer")}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
              >
                المركز التطوعي <ChevronDown className="w-4 h-4 mr-1" />
              </button>
              {openDesktopDropdown === "volunteer" && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
                  {volunteerLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={`block px-4 py-2 text-sm cursor-pointer transition-colors ${
                          location === link.href
                            ? "bg-emerald-500 text-white"
                            : "text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                        }`}
                        onClick={() => setOpenDesktopDropdown(null)}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* media center dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => toggleDesktopDropdown("media")}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
              >
                المركز الإعلامي <ChevronDown className="w-4 h-4 mr-1" />
              </button>
              {openDesktopDropdown === "media" && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
                  {mediaCenterLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={`block px-4 py-2 text-sm cursor-pointer transition-colors ${
                          location === link.href
                            ? "bg-emerald-500 text-white"
                            : "text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                        }`}
                        onClick={() => setOpenDesktopDropdown(null)}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>


          </nav>

          <div className="flex items-center gap-3">
            {/* تم حذف زر تبديل الوضع */}

            <Link href={isDonorLoggedIn ? "/donor-dashboard" : "/donor-login"}>
              <Button className="hidden md:flex text-white text-sm font-bold rounded-full px-4 lg:px-5 h-9 lg:h-10 bg-slate-700 hover:bg-slate-600 touch-manipulation">
                {isDonorLoggedIn ? (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    الملف التعريفي
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    دخول المتبرع
                  </>
                )}
              </Button>
            </Link>

            {/* زر السلة */}
            <Link href="/cart">
              <Button className="hidden md:flex items-center gap-2 text-white text-sm font-bold rounded-full px-4 lg:px-5 h-9 lg:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md relative touch-manipulation">
                <ShoppingCart className="w-5 h-5" />
                السلة
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm font-extrabold rounded-full min-w-[24px] h-6 px-1.5 flex items-center justify-center shadow-lg border-2 border-white">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            <Button onClick={handleDonateClick} className="hidden md:flex text-white text-sm font-bold rounded-full px-4 lg:px-5 h-9 lg:h-10 bg-gradient-to-r from-primary to-secondary touch-manipulation">
              <Heart className="w-4 h-4 mr-2" /> تبرع الآن
            </Button>

          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden w-full max-h-[80vh] overflow-y-auto">
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-1.5 sm:gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-all touch-manipulation ${location === link.href ? "font-semibold bg-emerald-500 text-white dark:bg-emerald-600" : "text-slate-700 dark:text-white hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"}`}>
                    {link.label}
                  </span>
                </Link>
              ))}

              {/* mobile about section */}
              <button
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 touch-manipulation"
                onClick={() => toggleMobileDropdown("about")}
              >
                من نحن {openMobileDropdown === "about" ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              </button>
              {openMobileDropdown === "about" && (
                <div className="flex flex-col gap-0.5 mt-0.5 mb-1">
                  {aboutLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="block px-4 sm:px-5 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 touch-manipulation" onClick={() => setIsMenuOpen(false)}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* mobile programs section */}
              <button
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 touch-manipulation"
                onClick={() => toggleMobileDropdown("programs")}
              >
                برامجنا {openMobileDropdown === "programs" ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              </button>
              {openMobileDropdown === "programs" && (
                <div className="flex flex-col gap-0.5 mt-0.5 mb-1">
                  {programsLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="block px-4 sm:px-5 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 touch-manipulation" onClick={() => setIsMenuOpen(false)}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* mobile volunteer section */}
              <button
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 touch-manipulation"
                onClick={() => toggleMobileDropdown("volunteer")}
              >
                المركز التطوعي {openMobileDropdown === "volunteer" ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              </button>
              {openMobileDropdown === "volunteer" && (
                <div className="flex flex-col gap-0.5 mt-0.5 mb-1">
                  {volunteerLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="block px-4 sm:px-5 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 touch-manipulation" onClick={() => setIsMenuOpen(false)}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* mobile media center section */}
              <button
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 touch-manipulation"
                onClick={() => toggleMobileDropdown("media")}
              >
                المركز الإعلامي {openMobileDropdown === "media" ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              </button>
              {openMobileDropdown === "media" && (
                <div className="flex flex-col gap-0.5 mt-0.5 mb-1">
                  {mediaCenterLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="block px-4 sm:px-5 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 touch-manipulation" onClick={() => setIsMenuOpen(false)}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}



              <Link href={isDonorLoggedIn ? "/donor-dashboard" : "/donor-login"}>
                <Button className="w-full mt-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-full flex items-center justify-center gap-2 h-11 touch-manipulation">
                  {isDonorLoggedIn ? <><User className="w-4 h-4" /> الملف التعريفي</> : <><LogIn className="w-4 h-4" /> دخول المتبرع</>}
                </Button>
              </Link>

              <Button onClick={handleDonateClick} className="w-full mt-2 bg-accent text-accent-foreground font-bold rounded-full h-11 touch-manipulation">
                <Heart className="w-4 h-4 mr-2" /> تبرع الآن
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow bg-white">{children}</main>

      {/* Right-side donation shortcuts - hidden on donation pages */}
      {isDonationWidgetVisible && 
       location !== '/donate' && 
       location !== '/donate/recurring' && 
       location !== '/donate/tribute' && 
       location !== '/donate/campaign' && 
       location !== '/cart' && 
       !location.startsWith('/donate/opportunities') ? (
        <div className="fixed top-20 sm:top-24 right-1.5 sm:right-2 z-50 w-[88px] sm:w-[92px] rounded-lg sm:rounded-xl bg-white/95 shadow-xl border border-slate-200 backdrop-blur-sm">
          <button
            onClick={() => setIsDonationWidgetVisible(false)}
            className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md hover:bg-sky-600 transition-colors touch-manipulation"
            aria-label="إخفاء خيارات التبرع"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="py-1.5 sm:py-2">
            {donationOptionsLinks.map((link, index) => {
              const icon =
                index === 0 ? <Clock3 className="w-5 h-5 text-slate-700" /> :
                index === 1 ? <CalendarDays className="w-5 h-5 text-slate-700" /> :
                index === 2 ? <Gift className="w-5 h-5 text-slate-700" /> :
                index === 3 ? <Rocket className="w-5 h-5 text-slate-700" /> :
                <Heart className="w-5 h-5 text-slate-700" />;

              return (
                <Link key={link.href} href={link.href}>
                  <span className="block px-1.5 sm:px-2 py-1.5 text-center cursor-pointer hover:bg-slate-50 transition-colors touch-manipulation">
                    <span className="flex justify-center mb-1 sm:mb-1.5">{icon}</span>
                    <span className="block h-px bg-sky-300 mx-0.5 sm:mx-1 mb-1 sm:mb-1.5" />
                    <span className={`block text-[13px] sm:text-[14px] leading-5 font-medium ${location === link.href ? "text-sky-600" : "text-slate-800"}`}>
                      {link.label}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
      
      {!isDonationWidgetVisible && 
       location !== '/donate' && 
       location !== '/donate/recurring' && 
       location !== '/donate/tribute' && 
       location !== '/donate/campaign' && 
       location !== '/cart' && 
       !location.startsWith('/donate/opportunities') && (
        <button
          onClick={() => setIsDonationWidgetVisible(true)}
          className="fixed top-24 sm:top-28 right-0.5 sm:right-1 z-50 bg-sky-500 text-white rounded-l-lg rounded-r-md px-1.5 py-2.5 shadow-lg hover:bg-sky-600 transition-colors touch-manipulation"
          aria-label="إظهار خيارات التبرع"
        >
          <Heart className="w-4 h-4" />
        </button>
      )}

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/966533170903"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group touch-manipulation"
        aria-label="تواصل عبر واتساب"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute right-full mr-2 sm:mr-3 bg-slate-900 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          واتساب
        </span>
      </a>

      <footer className="bg-slate-900 text-slate-200 mt-0">
        <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <img src={logoImg} alt="شعار" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold">جمعية بداية</h3>
                  <p className="text-xs sm:text-sm">جمعية خيرية موثوقة</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">نسعى لبناء مجتمع متكافل من خلال مبادرات خيرية مستدامة تصل للمستحقين بكرامة وشفافية.</p>
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">روابط سريعة</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link href="/"><span className="text-white">الرئيسية</span></Link></li>
                <li><Link href="/about"><span className="text-white">من نحن</span></Link></li>
                <li><Link href="/donate"><span className="text-white">تبرع</span></Link></li>
                <li><Link href="/contact"><span className="text-white">اتصل بنا</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">الخدمات الإلكترونية</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link href="/login"><span className="text-white">دخول الموظفين</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">تواصل معنا</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> <span className="leading-relaxed">المملكة العربية السعودية، الرياض</span></li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> <a href="tel:+966-555-0000" className="text-white hover:text-emerald-400 transition-colors">+966-555-0000</a></li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> <a href="mailto:info@bedaya.org" className="text-white hover:text-emerald-400 transition-colors break-all">info@bedaya.org</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-3 sm:pt-4 mt-5 sm:mt-6 border-slate-800 text-center text-xs sm:text-sm font-semibold">
            <p>&copy; {new Date().getFullYear()} جمعية بداية للأعمال الخيرية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

