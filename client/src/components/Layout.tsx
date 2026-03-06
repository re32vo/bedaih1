import { Link, useLocation } from "wouter";
import { Heart, Menu, X, Phone, MapPin, Mail, LogIn, User, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme.tsx";

import logoImg from "@/assets/logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [isDonorLoggedIn, setIsDonorLoggedIn] = useState(false);
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
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <img src={logoImg} alt="شعار جمعية بداية" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <div className="flex flex-col">
                <h1 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">جمعية بداية</h1>
                <p className="text-xs sm:text-xs text-slate-600 dark:text-slate-300">جمعية خيرية موثوقة</p>
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

            {/* donation options dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => toggleDesktopDropdown("donation")}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
              >
                خيارات التبرع <ChevronDown className="w-4 h-4 mr-1" />
              </button>
              {openDesktopDropdown === "donation" && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
                  {donationOptionsLinks.map((link) => (
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
              <Button className="hidden md:flex text-white text-sm font-bold rounded-full px-5 h-10 bg-slate-700 hover:bg-slate-600">
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

            <Button onClick={handleDonateClick} className="hidden md:flex text-white text-sm font-bold rounded-full px-5 h-10 bg-gradient-to-r from-primary to-secondary">
              <Heart className="w-4 h-4 mr-2" /> تبرع الآن
            </Button>

            <button className="md:hidden p-2 text-slate-900 dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden w-full">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${location === link.href ? "font-semibold bg-emerald-500 text-white dark:bg-emerald-600" : "text-slate-700 dark:text-white hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"}`}>
                    {link.label}
                  </span>
                </Link>
              ))}

              {/* mobile about section */}
              <button
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                onClick={() => toggleMobileDropdown("about")}
              >
                من نحن {openMobileDropdown === "about" ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              </button>
              {openMobileDropdown === "about" && (
                <div className="flex flex-col gap-1 mt-1">
                  {aboutLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* mobile programs section */}
              <button
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                onClick={() => toggleMobileDropdown("programs")}
              >
                برامجنا {openMobileDropdown === "programs" ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              </button>
              {openMobileDropdown === "programs" && (
                <div className="flex flex-col gap-1 mt-1">
                  {programsLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* mobile volunteer section */}
              <button
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                onClick={() => toggleMobileDropdown("volunteer")}
              >
                المركز التطوعي {openMobileDropdown === "volunteer" ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              </button>
              {openMobileDropdown === "volunteer" && (
                <div className="flex flex-col gap-1 mt-1">
                  {volunteerLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* mobile media center section */}
              <button
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                onClick={() => toggleMobileDropdown("media")}
              >
                المركز الإعلامي {openMobileDropdown === "media" ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              </button>
              {openMobileDropdown === "media" && (
                <div className="flex flex-col gap-1 mt-1">
                  {mediaCenterLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* mobile donation options section */}
              <button
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                onClick={() => toggleMobileDropdown("donation")}
              >
                خيارات التبرع {openMobileDropdown === "donation" ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              </button>
              {openMobileDropdown === "donation" && (
                <div className="flex flex-col gap-1 mt-1">
                  {donationOptionsLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}  

              <Link href={isDonorLoggedIn ? "/donor-dashboard" : "/donor-login"}>
                <Button className="w-full mt-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-full flex items-center justify-center gap-2">
                  {isDonorLoggedIn ? <><User className="w-4 h-4" /> الملف التعريفي</> : <><LogIn className="w-4 h-4" /> دخول المتبرع</>}
                </Button>
              </Link>

              <Button onClick={handleDonateClick} className="w-full mt-2 bg-accent text-accent-foreground font-bold rounded-full">
                <Heart className="w-4 h-4 mr-2" /> تبرع الآن
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow bg-white">{children}</main>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/966533170903"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="تواصل عبر واتساب"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 bg-slate-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          واتساب
        </span>
      </a>

      <footer className="bg-slate-900 text-slate-200 mt-0">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logoImg} alt="شعار" className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="text-lg font-bold">جمعية بداية</h3>
                  <p className="text-sm">جمعية خيرية موثوقة</p>
                </div>
              </div>
              <p className="text-sm">نسعى لبناء مجتمع متكافل من خلال مبادرات خيرية مستدامة تصل للمستحقين بكرامة وشفافية.</p>
            </div>

            <div>
              <h4 className="text-base font-bold mb-3">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link href="/"><span className="text-white">الرئيسية</span></Link></li>
                <li><Link href="/about"><span className="text-white">من نحن</span></Link></li>
                <li><Link href="/donate"><span className="text-white">تبرع</span></Link></li>
                <li><Link href="/contact"><span className="text-white">اتصل بنا</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-bold mb-3">الخدمات الإلكترونية</h4>
              <ul className="space-y-2">
                <li><Link href="/beneficiary"><span className="text-white">تسجيل مستفيد</span></Link></li>
                <li><Link href="/jobs"><span className="text-white">بوابة التوظيف</span></Link></li>
                <li><Link href="/volunteer"><span className="text-white">سجل كمتطوع</span></Link></li>
                <li><Link href="/login"><span className="text-white">دخول الموظفين</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-bold mb-3">تواصل معنا</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><MapPin className="w-5 h-5" /> المملكة العربية السعودية، الرياض</li>
                <li className="flex items-center gap-2"><Phone className="w-5 h-5" /> <a href="tel:+966-555-0000" className="text-white">+966-555-0000</a></li>
                <li className="flex items-center gap-2"><Mail className="w-5 h-5" /> <a href="mailto:info@bedaya.org" className="text-white">info@bedaya.org</a></li>
                <li className="flex items-center gap-2"><MessageCircle className="w-5 h-5" /> <Link href="/contact"><span className="text-white hover:text-emerald-400 transition cursor-pointer">اتصل بنا</span></Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-4 mt-6 border-slate-800 text-center text-sm font-semibold">
            <p>&copy; {new Date().getFullYear()} جمعية بداية للأعمال الخيرية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

