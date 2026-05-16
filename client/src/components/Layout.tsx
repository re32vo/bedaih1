import { Link, useLocation } from "wouter";
import { Heart, Menu, X, Phone, MapPin, Mail, User, ChevronDown, ChevronUp, MessageCircle, Clock3, CalendarDays, Gift, Rocket, ShoppingCart, LayoutGrid } from "lucide-react";
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

  const routeMetadata: Record<string, { title: string; description: string; url: string; keywords: string }> = {
    "/": {
      title: "جمعية بداية لعلاج ورعاية وتأهيل مرضى الإدمان وأسرهم | بداية",
      description: "جمعية بداية خيرية متخصصة في علاج الإدمان والرعاية الأسرية، تقدم برامج تأهيلية ونفسية واجتماعية، وتدعو إلى التبرع لدعم التعافي المستدام.",
      url: "https://www.bedaih.org.sa/",
      keywords: "جمعية خيرية, تبرع, علاج الإدمان, رعاية أسرية, تأهيل, دعم نفسي, جمعيات خيرية السعودية, جمعية بداية",
    },
    "/about": {
      title: "نبذة عن الجمعية | جمعية بداية",
      description: "اعرف أكثر عن جمعية بداية، مهمتنا، فريقنا، ورسالتنا في دعم مرضى الإدمان وأسرهم للتعافي والاندماج الاجتماعي.",
      url: "https://www.bedaih.org.sa/about",
      keywords: "نبذة عن الجمعية, جمعية بداية, علاج الإدمان, الدعم الاجتماعي, التأهيل النفسي, جمعيات خيرية",
    },
    "/members": {
      title: "الفريق التنفيذي | جمعية بداية",
      description: "تعرف على الفريق القيادي والخبراء الذين يقودون جمعية بداية في برامج علاج الإدمان والرعاية الأسرية والتأهيل.",
      url: "https://www.bedaih.org.sa/members",
      keywords: "الفريق التنفيذي, جمعية بداية, خبراء علاج الإدمان, قيادة الجمعية, الرعاية الأسرية",
    },
    "/governance": {
      title: "الحوكمة | جمعية بداية",
      description: "اطلع على مبادئ الحوكمة والشفافية في جمعية بداية وكيف ندير الموارد والخدمات بما يفيد المستفيدين والمجتمع.",
      url: "https://www.bedaih.org.sa/governance",
      keywords: "حوكمة, شفافية, جمعية خيرية, جمعية بداية, إدارة الموارد, المسؤولية الاجتماعية",
    },
    "/awards": {
      title: "الجوائز والتكريم | جمعية بداية",
      description: "اكتشف الجوائز والتكريمات التي حصلت عليها جمعية بداية لدورها في علاج الإدمان ودعم الأسر والمجتمع.",
      url: "https://www.bedaih.org.sa/awards",
      keywords: "جوائز, تكريم, جمعية خيرية, جمعية بداية, علاج الإدمان, التقدير الاجتماعي",
    },
    "/director-contact": {
      title: "بيانات التواصل مع الجمعية | جمعية بداية",
      description: "احصل على أرقام الاتصال والبريد الإلكتروني الخاص بجمعية بداية لتواصل سريع حول التبرعات وبرامج العلاج والرعاية.",
      url: "https://www.bedaih.org.sa/director-contact",
      keywords: "تواصل, جمعية بداية, تبرع, خدمات الجمعية, معلومات الاتصال, رعاية أسرية",
    },
    "/donation-methods": {
      title: "طرق التبرع | جمعية بداية",
      description: "اكتشف طرق التبرع المختلفة مع جمعية بداية لدعم برامج العلاج والتأهيل والخدمات المجتمعية لمرضى الإدمان.",
      url: "https://www.bedaih.org.sa/donation-methods",
      keywords: "طرق التبرع, تبرع, جمعية خيرية, جمعية بداية, دعم العلاج, التبرع عبر البنك",
    },
    "/bank-accounts": {
      title: "الحسابات البنكية للتبرع | جمعية بداية",
      description: "تعرّف على الحسابات البنكية الرسمية لدفع التبرعات لجمعية بداية ودعم برامج علاج الإدمان والرعاية الأسرية.",
      url: "https://www.bedaih.org.sa/bank-accounts",
      keywords: "حسابات بنكية, تبرع, جمعية بداية, دعم الجمعيات, محفظة التبرع, تبرعات بنكية",
    },
    "/donate": {
      title: "تبرع الآن | جمعية بداية",
      description: "ادعم برامج جمعية بداية لعلاج الإدمان وتقديم الرعاية الأسرية، تبرع الآن لتكون جزءًا من مبادرات التعافي والتأهيل.",
      url: "https://www.bedaih.org.sa/donate",
      keywords: "تبرع الآن, جمعية خيرية, جمعية بداية, علاج الإدمان, دعم الأسرة, تأهيل الإدمان, تبرعات خيرية",
    },
    "/donate/recurring": {
      title: "تبرع دوري | جمعية بداية",
      description: "انضم لبرنامج التبرع الدوري مع جمعية بداية وساهم بانتظام في دعم العلاج والتأهيل والخدمات المجتمعية.",
      url: "https://www.bedaih.org.sa/donate/recurring",
      keywords: "تبرع دوري, تبرع منتظم, جمعية بداية, دعم دائم, علاج الإدمان, تبرعات مستمرة",
    },
    "/donate/tribute": {
      title: "تبرع بإسم شخص | جمعية بداية",
      description: "قدم تبرعًا تكريميًا بإسم شخص عزيز وساعد جمعية بداية في توفير الدعم لعلاج الإدمان وتأهيل الأسر.",
      url: "https://www.bedaih.org.sa/donate/tribute",
      keywords: "تبرع إهداء, تبرع تكريمي, جمعية بداية, دعم مرضى الإدمان, تبرعات خيرية",
    },
    "/donate/campaign": {
      title: "أطلق حملتك التبرعية | جمعية بداية",
      description: "ابدأ حملة تبرعات خاصة لدعم برامج العلاج والتأهيل في جمعية بداية وادعُ المجتمع للمشاركة.",
      url: "https://www.bedaih.org.sa/donate/campaign",
      keywords: "حملة تبرعية, أطلق حملة, تبرعات جماعية, جمعية بداية, دعم الإدمان",
    },
    "/donate/opportunities": {
      title: "فرص التبرع | جمعية بداية",
      description: "اكتشف فرص التبرع المتاحة مع جمعية بداية لدعم مشاريع علاج الإدمان والتأهيل والخدمات المجتمعية.",
      url: "https://www.bedaih.org.sa/donate/opportunities",
      keywords: "فرص تبرع, جمعيات خيرية, جمعية بداية, دعم المشاريع, تبرعات علاج الإدمان",
    },
    "/programs/treatment": {
      title: "البرامج العلاجية | جمعية بداية",
      description: "تعرف على برامج جمعية بداية العلاجية المتخصصة في علاج الإدمان، إعادة التأهيل، والدعم النفسي للمستفيدين وأسرهم.",
      url: "https://www.bedaih.org.sa/programs/treatment",
      keywords: "البرامج العلاجية, علاج الإدمان, إعادة التأهيل, دعم نفسي, جمعية بداية",
    },
    "/programs/awareness": {
      title: "البرامج التوعوية | جمعية بداية",
      description: "اكتشف برامج جمعية بداية التوعوية للتثقيف عن مخاطر الإدمان وطرق الوقاية ودعم الصحة النفسية في المجتمع.",
      url: "https://www.bedaih.org.sa/programs/awareness",
      keywords: "برامج توعوية, الوقاية من الإدمان, التثقيف الصحي, جمعية بداية, الصحة النفسية",
    },
    "/volunteer/form": {
      title: "استمارة التطوع | جمعية بداية",
      description: "انضم إلى فريق التطوع في جمعية بداية وساهم في دعم برامج العلاج والرعاية الاجتماعية للمتعافين وأسرهم.",
      url: "https://www.bedaih.org.sa/volunteer/form",
      keywords: "استمارة التطوع, تطوع, جمعية بداية, دعم المجتمعات, علاج الإدمان",
    },
    "/volunteer/health-platform": {
      title: "منصة التطوع الصحي | جمعية بداية",
      description: "شارك في منصة التطوع الصحي مع جمعية بداية وساعد في تقديم خدمات طبية ومساندة نفسية للمستفيدين.",
      url: "https://www.bedaih.org.sa/volunteer/health-platform",
      keywords: "منصة التطوع الصحي, تطوع, جمعية بداية, خدمات طبية, دعم نفسي",
    },
    "/volunteer/reports": {
      title: "التقارير التطوعية | جمعية بداية",
      description: "اطلع على تقارير الجمعية التطوعية وأثرها في دعم علاج الإدمان وخدمات الرعاية للأسر.",
      url: "https://www.bedaih.org.sa/volunteer/reports",
      keywords: "تقارير تطوعية, جمعية بداية, تطوع, تأثير اجتماعي, دعم الإدمان",
    },
    "/media/library": {
      title: "المكتبة الإعلامية | جمعية بداية",
      description: "استعرض مكتبة جمعية بداية الإعلامية من الصور والفيديوهات والتقارير عن أنشطة الجمعية وبرامج العلاج.",
      url: "https://www.bedaih.org.sa/media/library",
      keywords: "المكتبة الإعلامية, جمعية بداية, صور, فيديو, تقارير, أنشطة الجمعية",
    },
    "/media/announcements": {
      title: "الإعلانات | جمعية بداية",
      description: "تابع أحدث الإعلانات والأخبار الرسمية من جمعية بداية حول التبرعات والبرامج والخدمات المجتمعية.",
      url: "https://www.bedaih.org.sa/media/announcements",
      keywords: "إعلانات, جمعية بداية, أخبار الجمعية, فعاليات, تحديثات",
    },
    "/media/smile-story": {
      title: "قصة بداية | جمعية بداية",
      description: "اكتشف قصص النجاح والتعافي من خلال قصة بداية ودور الجمعية في دعم المتعافين وأسرهم.",
      url: "https://www.bedaih.org.sa/media/smile-story",
      keywords: "قصة بداية, قصص نجاح, تعافي, جمعية بداية, دعم المتعافين",
    },
    "/media/reports": {
      title: "التقارير الدورية | جمعية بداية",
      description: "اطلع على التقارير الدورية لجمعية بداية حول أثر برامج العلاج والتأهيل والتطوع في المجتمع.",
      url: "https://www.bedaih.org.sa/media/reports",
      keywords: "تقارير, جمعيات خيرية, جمعية بداية, تأثير اجتماعي, علاج الإدمان",
    },
    "/jobs": {
      title: "التوظيف | جمعية بداية",
      description: "تعرف على فرص التوظيف المتاحة في جمعية بداية وساهم في تقديم الدعم لبرامج علاج الإدمان وخدمات الأسر.",
      url: "https://www.bedaih.org.sa/jobs",
      keywords: "التوظيف, وظائف, جمعية بداية, فرص عمل, علاج الإدمان, دعم المجتمع",
    },
    "/contact": {
      title: "تواصل معنا | جمعية بداية",
      description: "اتصل بجمعية بداية للحصول على معلومات حول التبرع، العلاج، التأهيل والدعم النفسي للمستفيدين وأسرهم.",
      url: "https://www.bedaih.org.sa/contact",
      keywords: "تواصل معنا, جمعية بداية, تبرع, علاج الإدمان, الدعم النفسي, رعاية أسرية",
    },
    "/faq": {
      title: "الأسئلة الشائعة | جمعية بداية",
      description: "اطلع على الأسئلة المتكررة حول التبرع، العلاج، البرامج التأهيلية، التطوع وخدمات جمعية بداية.",
      url: "https://www.bedaih.org.sa/faq",
      keywords: "أسئلة شائعة, تبرع, علاج الإدمان, جمعية خيرية, جمعية بداية, التطوع",
    },
    "/privacy-policy": {
      title: "سياسة الخصوصية | جمعية بداية",
      description: "تعرف على سياسة الخصوصية الخاصة بجمعية بداية وكيف نحبس بيانات المتبرعين والمستفيدين ونحميها.",
      url: "https://www.bedaih.org.sa/privacy-policy",
      keywords: "سياسة الخصوصية, حماية البيانات, جمعية بداية, منصة التبرع, معلومات شخصية",
    },
    "/terms": {
      title: "الشروط والأحكام | جمعية بداية",
      description: "اطلع على الشروط والأحكام الخاصة باستخدام موقع جمعية بداية وخدمات التبرع والدعم المجتمعي.",
      url: "https://www.bedaih.org.sa/terms",
      keywords: "الشروط والأحكام, جمعية بداية, استخدام الموقع, التبرع، القوانين",
    },
    "/media/news": {
      title: "أخبار الجمعية | جمعية بداية",
      description: "تابع أحدث الأخبار والإعلانات والتقارير الخاصة بجمعية بداية ودورها في دعم علاج الإدمان والرعاية المجتمعية.",
      url: "https://www.bedaih.org.sa/media/news",
      keywords: "أخبار الجمعية, جمعية بداية, الأخبار الصحفية, التبرعات, علاج الإدمان",
    },
  };

  const getMetadata = () => {
    const pathname = location.split("?")[0];
    if (routeMetadata[pathname]) return routeMetadata[pathname];
    if (pathname.startsWith("/donate/opportunities/")) {
      return {
        title: "فرص التبرع | جمعية بداية",
        description: "اكتشف فرص التبرع المتاحة في جمعية بداية لدعم برامج علاج الإدمان وتأهيل الأسر.",
        url: `https://www.bedaih.org.sa${pathname}`,
        keywords: "فرص تبرع, جمعية خيرية, تبرع, علاج الإدمان, دعم أسر",
      };
    }
    if (location.startsWith("/media/")) {
      return {
        title: "المركز الإعلامي | جمعية بداية",
        description: "تابع أخبار جمعية بداية، القصص الإعلامية، والإعلانات الخاصة بأنشطة الجمعية وخدماتها.",
        url: `https://www.bedaih.org.sa${location}`,
        keywords: "مركز إعلامي, جمعية بداية, أخبار الجمعية, تقارير, إعلام",
      };
    }
    if (location.startsWith("/volunteer/")) {
      return {
        title: "المركز التطوعي | جمعية بداية",
        description: "اكتشف فرص التطوع والمبادرات التي تنظمها جمعية بداية لدعم الخدمات الاجتماعية والطبية.",
        url: `https://www.bedaih.org.sa${location}`,
        keywords: "تطوع, مركز تطوعي, جمعية خيرية, جمعية بداية, فرص تطوع",
      };
    }
    return routeMetadata["/"];
  };

  useEffect(() => {
    const meta = getMetadata();

    document.title = meta.title;

    const updateMeta = (selector: string, attr: string, value: string) => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attr, value);
      }
    };

    updateMeta('meta[name="description"]', "content", meta.description);
    updateMeta('meta[name="keywords"]', "content", meta.keywords);
    updateMeta('meta[property="og:title"]', "content", meta.title);
    updateMeta('meta[property="og:description"]', "content", meta.description);
    updateMeta('meta[property="og:url"]', "content", meta.url);
    updateMeta('meta[name="twitter:title"]', "content", meta.title);
    updateMeta('meta[name="twitter:description"]', "content", meta.description);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", meta.url);
    }
  }, [location]);

  const isEmployeePage = ["/dashboard", "/admin", "/login", "/logs", "/donors-management"].includes(location);
  const isDonorPage = ["/donor-dashboard", "/donor-login"].includes(location);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
  ];

  const aboutLinks = [
    { href: "/about", label: "نبذة عن الجمعية" },
    { href: "/members", label: "الفريق التنفيذي" },
    { href: "/governance", label: "الحوكمة" },
    { href: "/awards", label: "الجوائز والتكريم" },
    { href: "/director-contact", label: "بيانات التواصل مع الجمعية" },
    { href: "/donation-methods", label: "طرق التبرع" },
    { href: "/bank-accounts", label: "الحسابات البنكية" },
  ];

  const volunteerLinks = [
    { href: "/volunteer/form", label: "استمارة التطوع" },
    { href: "/volunteer/health-platform", label: "منصة التطوع الصحي" },
    { href: "/volunteer/reports", label: "التقارير التطوعية" },
  ];

  const programsLinks = [
    { href: "/programs/treatment", label: "البرامج العلاجية" },
    { href: "/programs/awareness", label: "البرامج التوعوية" },
  ];

  const mediaCenterLinks = [
    { href: "/media/library", label: "المكتبة الإعلامية" },
    { href: "/media/news", label: "الأخبار" },
    { href: "/media/announcements", label: "إعلانات" },
    { href: "/media/smile-story", label: "قصة بداية" },
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

  const [showLogoModal, setShowLogoModal] = useState(false);
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
      <header className="sticky top-0 z-50 bg-white shadow-sm w-full">
        {/* الهيدر الرئيسي */}
        <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3 min-h-[56px] sm:min-h-[64px] flex items-center justify-between border-b border-slate-200 gap-4 lg:gap-8">
          <button onClick={() => setShowLogoModal(true)} className="flex items-center gap-0 cursor-pointer bg-transparent border-0 p-0">
            <div className="flex items-center gap-0">
              <div className="flex items-center gap-2 sm:gap-3 bg-white px-2 py-1">
                <div className="flex items-center gap-2 sm:gap-3 bg-white px-2 py-1">
                  <img src={logoImg} alt="شعار جمعية بداية" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                  <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 whitespace-nowrap">جمعية بداية</h1>
                </div>
              </div>
              <img
                src="/arev.png"
                alt="شهادة ترخيص الجمعية"
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
                loading="lazy"
              />
            </div>
          </button>

          <div className="hidden md:flex flex-1 items-center justify-start gap-2 pr-6 lg:pr-12 xl:pr-16">
            <Link href="/">
              <span className={`px-3 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all ${location === "/" ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-100"}`}>
                الرئيسية
              </span>
            </Link>

            <div className="relative">
              <button
                onClick={() => toggleDesktopDropdown("about")}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-bold text-slate-900 hover:bg-slate-100"
              >
                من نحن <ChevronDown className="w-4 h-4 mr-1" />
              </button>
              {openDesktopDropdown === "about" && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  {aboutLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={`block px-4 py-2 text-sm cursor-pointer transition-colors ${location === link.href ? "bg-emerald-500 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                        onClick={() => setOpenDesktopDropdown(null)}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleDesktopDropdown("programs")}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-bold text-slate-900 hover:bg-slate-100"
              >
                برامجنا <ChevronDown className="w-4 h-4 mr-1" />
              </button>
              {openDesktopDropdown === "programs" && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  {programsLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={`block px-4 py-2 text-sm cursor-pointer transition-colors ${location === link.href ? "bg-emerald-500 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                        onClick={() => setOpenDesktopDropdown(null)}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleDesktopDropdown("volunteer")}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-bold text-slate-900 hover:bg-slate-100"
              >
                المركز التطوعي <ChevronDown className="w-4 h-4 mr-1" />
              </button>
              {openDesktopDropdown === "volunteer" && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  {volunteerLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={`block px-4 py-2 text-sm cursor-pointer transition-colors ${location === link.href ? "bg-emerald-500 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                        onClick={() => setOpenDesktopDropdown(null)}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleDesktopDropdown("media")}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-bold text-slate-900 hover:bg-slate-100"
              >
                المركز الإعلامي <ChevronDown className="w-4 h-4 mr-1" />
              </button>
              {openDesktopDropdown === "media" && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  {mediaCenterLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        className={`block px-4 py-2 text-sm cursor-pointer transition-colors ${location === link.href ? "bg-emerald-500 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                        onClick={() => setOpenDesktopDropdown(null)}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleDonateClick} className="text-slate-900 text-sm font-bold rounded-full px-5 lg:px-7 h-9 lg:h-10 bg-slate-100 border border-slate-300 hover:bg-slate-200 touch-manipulation">
              تبرع معنا
            </Button>

            <button
              className="md:hidden p-2 text-slate-900 hover:bg-slate-50 rounded-lg touch-manipulation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="فتح قائمة التصنيفات"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* مودال الشعار والترخيص */}
      {showLogoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={() => setShowLogoModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-80 max-w-[90vw] p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-slate-900">أين تريد الانتقال ؟</h2>
              <button onClick={() => setShowLogoModal(false)} className="text-slate-400 hover:text-slate-700 text-xl leading-none">×</button>
            </div>
            <Link href="/" onClick={() => setShowLogoModal(false)}>
              <span className="block w-full text-center bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer">
                الانتقال للصفحة الرئيسية
              </span>
            </Link>
            <a href="https://www.dropbox.com/scl/fi/vqokgqcbl1btjkb8ua25s/shtr-1.pdf?rlkey=0sljefcr9ttvq7xo6txu7xw0c&st=kwy9af41&raw=1" target="_blank" rel="noopener noreferrer" onClick={() => setShowLogoModal(false)}>
              <span className="block w-full text-center bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer">
                عرض تصريح الجمعية
              </span>
            </a>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden w-full max-h-[80vh] overflow-y-auto">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow bg-white pb-14">{children}</main>

      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bg-white text-slate-900">
        <div className="container mx-auto px-2">
          <div className="mx-auto grid max-w-sm grid-cols-2 items-center gap-1.5 py-1.5">
            <Link href="/cart">
              <span className="relative flex flex-col items-center justify-center py-1 text-[11px] font-bold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 leading-tight">
                <ShoppingCart className="w-4 h-4 mb-0.5" />
                السلة
                {getTotalItems() > 0 && (
                  <span className="absolute top-0.5 right-[30%] bg-red-600 text-white text-[9px] font-extrabold rounded-full min-w-[14px] h-3.5 px-1 flex items-center justify-center leading-none">
                    {getTotalItems()}
                  </span>
                )}
              </span>
            </Link>

            <Link href={isDonorLoggedIn ? "/donor-dashboard" : "/donor-login"}>
              <span className="flex flex-col items-center justify-center py-1 text-[11px] font-bold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 leading-tight">
                <User className="w-4 h-4 mb-0.5" />
                حسابي
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Right-side donation shortcuts */}
      {isDonationWidgetVisible ? (
        <div className="fixed top-1/2 -translate-y-1/2 right-1 sm:right-2 z-50 w-[68px] sm:w-[74px] rounded-md sm:rounded-lg bg-white/95 shadow-lg border border-slate-200 backdrop-blur-sm">
          <button
            onClick={() => setIsDonationWidgetVisible(false)}
            className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md hover:bg-sky-600 transition-colors touch-manipulation"
            aria-label="إخفاء خيارات التبرع"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="py-1">
            {donationOptionsLinks.map((link, index) => {
              const icon =
                index === 0 ? <Clock3 className="w-4 h-4 text-slate-700" /> :
                index === 1 ? <CalendarDays className="w-4 h-4 text-slate-700" /> :
                index === 2 ? <Gift className="w-4 h-4 text-slate-700" /> :
                index === 3 ? <Rocket className="w-4 h-4 text-slate-700" /> :
                <Heart className="w-4 h-4 text-slate-700" />;

              return (
                <Link key={link.href} href={link.href}>
                  <span className="block px-1 py-1 text-center cursor-pointer hover:bg-slate-50 transition-colors touch-manipulation">
                    <span className="flex justify-center mb-0.5">{icon}</span>
                    <span className="block h-px bg-sky-300 mx-1 mb-0.5" />
                    <span className={`block text-[11px] sm:text-[12px] leading-4 font-medium ${location === link.href ? "text-sky-600" : "text-slate-800"}`}>
                      {link.label}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
      
      {!isDonationWidgetVisible && (
        <button
          onClick={() => setIsDonationWidgetVisible(true)}
          className="fixed top-1/2 -translate-y-1/2 right-0 z-50 bg-sky-500 text-white rounded-l-md rounded-r-sm px-1 py-2 shadow-md hover:bg-sky-600 transition-colors touch-manipulation"
          aria-label="إظهار خيارات التبرع"
        >
          <Heart className="w-3.5 h-3.5" />
        </button>
      )}

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/966596282033"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 sm:bottom-24 right-4 sm:right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group touch-manipulation"
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
                <li><Link href="/faq"><span className="text-white">الأسئلة الشائعة</span></Link></li>
                <li><Link href="/contact"><span className="text-white">اتصل بنا</span></Link></li>
                <li><Link href="/privacy-policy"><span className="text-white">سياسة الخصوصية</span></Link></li>
                <li><Link href="/terms"><span className="text-white">الشروط والأحكام</span></Link></li>
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
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> <span className="leading-relaxed">المملكة العربية السعودية، جده</span></li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> <a href="tel:+966-555-0000" className="text-white hover:text-emerald-400 transition-colors">+966596282033</a></li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> <a href="mailto:info@bedaya.org" className="text-white hover:text-emerald-400 transition-colors break-all">bedaya.org.sa@gmail.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-3 sm:pt-4 mt-5 sm:mt-6 border-slate-800 text-center text-xs sm:text-sm font-semibold">
            <p>&copy; {new Date().getFullYear()} جمعية بداية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
