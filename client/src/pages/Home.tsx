import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Users, Clock3, HeartPulse, TrendingUp, UserRound, ShoppingCart, Share2, Facebook, MessageCircle, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { donationProjects } from "@/data/donationProjects";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

const testimonials = [
  {
    id: "t1",
    name: "أم محمد",
    role: "متبرعة",
    rating: 5,
    text: "بداية صراحة تستاهل كل خير، لي سنين أتبرع معهم ومرتاحه مرة من وضوحهم. أحس تبرعي فعلًا يوصل للي يحتاجه.",
  },
  {
    id: "t2",
    name: "عبدالله العمري",
    role: "متبرع",
    rating: 5,
    text: "التبرع عن طريق الموقع سهل جدًا وما ياخذ وقت، وبعدها يجيني إشعار مباشرة. تعاملهم ممتاز والله يجزاهم خير.",
  },
  {
    id: "t3",
    name: "سارة القحطاني",
    role: "متبرعة",
    rating: 5,
    text: "جربت أتـبرع من الموقع وكانت التجربة سلسة وسريعة، اخترت المشروع ودفعته خلال دقايق. كل التفاصيل كانت واضحة.",
  },
  {
    id: "t4",
    name: "خالد الزهراني",
    role: "متبرع",
    rating: 5,
    text: "أكثر شي عجبني عندهم الشفافية في المشاريع والمبالغ. هالشي خلاني أكرر التبرع وأنا مطمّن إن المبلغ يروح لمكانه الصح.",
  },
  {
    id: "t5",
    name: "نورة السلمي",
    role: "متبرعة",
    rating: 5,
    text: "حتى عيالي صاروا يشاركوني باختيار مشاريع التبرع في بداية، وهذا الشي خلانا نتعلم قيمة العطاء من بدري.",
  },
  {
    id: "t6",
    name: "فهد البقمي",
    role: "متبرع",
    rating: 5,
    text: "تبرعت معهم بأكثر من حملة، وكل مرة نفس الجودة والترتيب. دعمهم سريع وتقاريرهم واضحة وهذا يعطيك ثقة كبيرة.",
  },
];

const partners = [
  { id: "p1", name: "وزارة الصحة", image: "/asr.png" },
];

type PublicStatsResponse = {
  totalDonationsAmount: number;
  donationsCount: number;
  donorsCount: number;
  lastUpdatedAt: string;
};

const heroSlides = [
  {
    id: "h1",
    image: "/12344.png",
    title: "أهداف الجمعية",
    subtitle: "نسعى إلى الوقاية والتأهيل والتوعية وبناء مجتمع أكثر وعيًا واستقرارًا.",
    projectId: "6",
  },
  {
    id: "h2",
    image: "/oz.png",
    title: "رسالة الجمعية",
    subtitle: "تقديم برامج نوعية للمستفيد وأسرته تعزز الأمان والتعافي والاندماج وخدمة المجتمع.",
    projectId: "12",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const featuredProjects = donationProjects.slice(0, 4);
  const [projectAmounts, setProjectAmounts] = useState<Record<string, { selected: number; custom: string }>>(
    featuredProjects.reduce((acc, project) => {
      acc[project.id] = { selected: project.amounts[0] || 0, custom: project.amounts[0] ? String(project.amounts[0]) : "" };
      return acc;
    }, {} as Record<string, { selected: number; custom: string }>)
  );
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [heroAmount, setHeroAmount] = useState("100");
  const [publicStats, setPublicStats] = useState<PublicStatsResponse>({
    totalDonationsAmount: 0,
    donationsCount: 0,
    donorsCount: 0,
    lastUpdatedAt: "",
  });

  const currentHeroSlide = heroSlides[currentHeroIndex];
  const currentHeroProject = donationProjects.find((project) => project.id === currentHeroSlide.projectId) || donationProjects[0];
  const heroQuickAmounts = currentHeroProject.amounts.length > 0 ? currentHeroProject.amounts.slice(0, 3) : [500, 300, 100];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setHeroAmount(String(heroQuickAmounts[0] || 100));
  }, [currentHeroIndex]);

  useEffect(() => {
    // Preload hero images to prevent white flash during slide changes on mobile.
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPublicStats = async () => {
      try {
        const response = await fetch("/api/public/stats", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as PublicStatsResponse;
        if (!isMounted) return;

        setPublicStats({
          totalDonationsAmount: Number(data.totalDonationsAmount) || 0,
          donationsCount: Number(data.donationsCount) || 0,
          donorsCount: Number(data.donorsCount) || 0,
          lastUpdatedAt: data.lastUpdatedAt || new Date().toISOString(),
        });
      } catch {
        // Keep latest rendered values if stats endpoint is temporarily unavailable.
      }
    };

    fetchPublicStats();
    const intervalId = window.setInterval(fetchPublicStats, 20000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchPublicStats();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const stats = [
    { id: "s1", title: "إجمالي التبرعات (ر.س)", value: publicStats.totalDonationsAmount, icon: HeartPulse },
    { id: "s2", title: "عدد عمليات التبرع", value: publicStats.donationsCount, icon: TrendingUp },
    { id: "s3", title: "يتيم ويتيمة", value: 2369, icon: Users },
    { id: "s4", title: "ساعة تطوعية", value: 8459, icon: Clock3 },
    { id: "s5", title: "فرصة تطوعية", value: 323, icon: Users },
    { id: "s6", title: "خدمة علاجية لعمليات التخدير الكامل", value: 1195, icon: TrendingUp },
    { id: "s7", title: "عدد المتبرعين", value: publicStats.donorsCount, icon: UserRound },
  ];

  const updateProjectAmount = (projectId: string, selected: number, custom: string = "") => {
    setProjectAmounts((prev) => ({ ...prev, [projectId]: { selected, custom } }));
  };

  const addProjectToCart = (projectId: string) => {
    const project = featuredProjects.find((item) => item.id === projectId);
    if (!project) return;

    const amount = projectAmounts[projectId]?.custom
      ? Number(projectAmounts[projectId].custom) || 0
      : projectAmounts[projectId]?.selected || 0;

    if (amount <= 0) {
      toast({
        title: "خطأ",
        description: "اختر مبلغا صحيحا قبل الإضافة للسلة",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      amount,
      donationType: "single",
      paymentMethod: 1,
    });

    toast({
      title: "تمت الإضافة للسلة",
      description: `تمت إضافة ${project.title} بمبلغ ${amount} ريال`,
    });
  };

  const goToNextPartner = () => {
    setCurrentPartnerIndex((prev) => (prev + 1) % partners.length);
  };

  const goToPrevPartner = () => {
    setCurrentPartnerIndex((prev) => (prev - 1 + partners.length) % partners.length);
  };

  const goToNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const goToPrevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const donateFromHero = () => {
    const numericAmount = Number(heroAmount);

    if (!numericAmount || numericAmount <= 0) {
      toast({
        title: "خطأ",
        description: "حدد مبلغ زكاة صحيح",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تحويل لصفحة الدفع",
      description: "سيتم الدفع لهذا المشروع فقط",
    });

    setLocation(`/checkout?mode=hero&projectId=${currentHeroProject.id}&amount=${numericAmount}`);
  };

  const heroProjectSection = (
    <section className="rounded-xl md:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5 md:gap-6 items-center">
        <div className="space-y-3 lg:order-2">
          <div className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs sm:text-sm font-bold text-sky-700">
            المشروع المرتبط بالبانر الحالي
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{currentHeroProject.title}</h2>
          <p className="text-sm sm:text-base leading-7 text-slate-600 max-w-3xl">{currentHeroProject.description}</p>
        </div>

        <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4 lg:order-1">
          <p className="mb-3 text-center text-sm sm:text-base font-extrabold text-slate-800">تبرع لهذا المشروع</p>

          <div className="mb-3 flex flex-wrap justify-center gap-2">
            {heroQuickAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setHeroAmount(String(amount))}
                className={`rounded-lg border px-3 py-2 text-sm font-bold transition ${
                  heroAmount === String(amount)
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {amount} ر.س
              </button>
            ))}
          </div>

          <div className="relative mb-3">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-bold text-slate-500">ر.س</span>
            <Input
              value={heroAmount}
              onChange={(e) => setHeroAmount(e.target.value.replace(/[^0-9]/g, ""))}
              className="h-10 sm:h-11 pr-12 text-center text-base font-bold"
              inputMode="numeric"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button type="button" onClick={donateFromHero} className="h-10 sm:h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold lg:order-2">
              تبرع
            </Button>
            <Button type="button" onClick={() => setLocation(`/donate/opportunities/${currentHeroProject.id}`)} className="h-10 sm:h-11 bg-indigo-900 hover:bg-indigo-800 text-white font-bold lg:order-1">
              تفاصيل المشروع
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-slate-100 py-4 md:py-8" dir="rtl">
      <div className="container mx-auto space-y-6 px-3 sm:px-4 md:space-y-10 lg:space-y-14">
        <section className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm min-h-[320px] sm:min-h-[360px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.10),_transparent_28%)]" />

          <button
            type="button"
            onClick={goToPrevHero}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-sm"
            aria-label="السابق"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToNextHero}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-sm"
            aria-label="التالي"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="relative z-10 min-h-[320px] sm:min-h-[360px] p-6 sm:p-8 md:p-10 flex items-center justify-center text-center">
            <div className="w-full max-w-4xl">
              <div className="mx-auto mb-5 inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
                جمعية بداية
              </div>
              <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4 text-slate-900">
                  {heroSlides[currentHeroIndex].title}
                </h1>
                <p className="text-base sm:text-xl md:text-2xl font-bold leading-8 text-slate-600">
                  {heroSlides[currentHeroIndex].subtitle}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">وقاية</span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">تأهيل</span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">إرشاد</span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">توعية</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentHeroIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentHeroIndex ? "w-6 bg-sky-500" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`الانتقال للبنر ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {heroProjectSection}

        <section ref={statsRef} className="rounded-xl md:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 md:p-6">
          <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center gap-2 sm:gap-4">
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-64 bg-slate-300" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900">بداية في ارقام</h2>
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-64 bg-slate-300" />
          </div>

          {/* الصف الأول: 4 عناصر */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 mb-3 sm:mb-4">
            {stats.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-500 leading-tight mb-1">{item.title}</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900">
                      {statsInView ? <CountUp end={item.value} duration={1.6} separator="," /> : 0}
                    </p>
                  </div>
                  <div className="rounded-xl md:rounded-2xl bg-sky-500 p-2 sm:p-2.5 md:p-3 text-white flex-shrink-0">
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* الصف الثاني: 2 عنصر */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-2 mb-3 sm:mb-4">
            {stats.slice(4, 6).map((item) => (
              <div key={item.id} className="rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-500 leading-tight mb-1">{item.title}</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900">
                      {statsInView ? <CountUp end={item.value} duration={1.6} separator="," /> : 0}
                    </p>
                  </div>
                  <div className="rounded-xl md:rounded-2xl bg-sky-500 p-2 sm:p-2.5 md:p-3 text-white flex-shrink-0">
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* الصف الثالث: 1 عنصر في المنتصف */}
          <div className="flex justify-center">
            <div className="w-full max-w-[340px] lg:max-w-[400px] rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm md:text-base font-semibold leading-tight sm:leading-7 text-slate-500 mb-1">{stats[6].title}</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900">
                    {statsInView ? <CountUp end={stats[6].value} duration={1.6} separator="," /> : 0}
                  </p>
                </div>
                <div className="rounded-xl md:rounded-2xl bg-sky-500 p-2 sm:p-2.5 md:p-3 text-white flex-shrink-0">
                  <UserRound className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 sm:mb-6 md:mb-8 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900">من مشاريع الجمعية</h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project) => {
              const amounts = project.amounts.slice(0, 3);
              return (
                <div key={project.id} className="rounded-xl md:rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <img src={project.image} alt={project.title} loading="lazy" className="h-28 sm:h-32 md:h-36 w-full rounded-t-xl md:rounded-t-2xl object-cover" />

                  <div className="border-y border-slate-100 bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 text-slate-400">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 p-3 sm:p-4">
                    <h3 className="m-0 text-center text-base sm:text-lg md:text-xl font-extrabold text-slate-900">{project.title}</h3>
                    <p className="line-clamp-3 sm:line-clamp-4 text-center text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">{project.description}</p>

                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {amounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => updateProjectAmount(project.id, amount, String(amount))}
                          className={`rounded-lg sm:rounded-xl border px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition touch-manipulation ${
                            projectAmounts[project.id]?.selected === amount
                              ? "border-sky-500 bg-sky-50 text-sky-700"
                              : "border-slate-300 bg-white text-slate-700"
                          }`}
                        >
                          {amount}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <span className="pointer-events-none absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-bold text-slate-600">ريال</span>
                      <Input
                        value={projectAmounts[project.id]?.custom || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          updateProjectAmount(project.id, 0, value);
                        }}
                        className="h-9 sm:h-10 rounded-lg sm:rounded-xl border-slate-300 pr-12 sm:pr-14 text-center text-base sm:text-lg font-bold touch-manipulation"
                        inputMode="numeric"
                        placeholder="0"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      <Button type="button" className="rounded-lg sm:rounded-xl bg-sky-500 font-bold text-white hover:bg-sky-600 text-xs sm:text-sm h-9 sm:h-10 touch-manipulation" onClick={() => setLocation(`/donate/opportunities/${project.id}`)}>
                        تبرع
                      </Button>
                      <Button type="button" className="rounded-lg sm:rounded-xl bg-indigo-900 font-bold text-white hover:bg-indigo-800 h-9 sm:h-10 touch-manipulation" onClick={() => addProjectToCart(project.id)}>
                        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>

                    <button type="button" onClick={() => setLocation(`/donate/opportunities/${project.id}`)} className="w-full text-center font-bold text-slate-700 hover:text-sky-600 text-xs sm:text-sm touch-manipulation py-1">
                      تفاصيل المشروع ←
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 sm:mt-6 md:mt-8 text-center">
            <Button type="button" className="rounded-lg sm:rounded-xl bg-sky-500 px-6 sm:px-8 text-white hover:bg-sky-600 text-sm sm:text-base h-10 sm:h-11 touch-manipulation" onClick={() => setLocation("/donate/opportunities")}>
              عرض المزيد
            </Button>
          </div>
        </section>

        <section className="rounded-xl md:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 md:p-6 overflow-hidden">
          <h2 className="mb-4 sm:mb-6 md:mb-8 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900">شركاء النجاح</h2>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={goToPrevPartner}
              className="h-10 w-10 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center"
              aria-label="الشريك السابق"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 min-h-28 flex flex-col items-center justify-center shadow-sm gap-2">
              <img
                src={partners[currentPartnerIndex].image}
                alt={partners[currentPartnerIndex].name}
                loading="lazy"
                className="h-16 w-full object-contain"
              />
              <p className="text-center text-sm sm:text-base font-bold text-slate-600 leading-snug">{partners[currentPartnerIndex].name}</p>
            </div>

            <button
              type="button"
              onClick={goToNextPartner}
              className="h-10 w-10 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center"
              aria-label="الشريك التالي"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* قسم التقييمات */}
        <section>
          <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center gap-2 sm:gap-4">
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-56 bg-slate-300" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900">ماذا قالوا عنّا</h2>
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-56 bg-slate-300" />
          </div>
          <p className="text-center text-slate-500 text-sm sm:text-base mb-6 sm:mb-8">آراء متبرعين حول تجربتهم مع جمعية بداية</p>

          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={goToPrevTestimonial}
                className="h-10 w-10 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center shrink-0"
                aria-label="التقييم السابق"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm flex flex-col gap-3 min-h-[210px] sm:min-h-[190px]">
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonials[currentTestimonialIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed flex-1">
                  {testimonials[currentTestimonialIndex].text}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {testimonials[currentTestimonialIndex].name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{testimonials[currentTestimonialIndex].name}</p>
                    <p className="text-xs text-slate-500">{testimonials[currentTestimonialIndex].role}</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={goToNextTestimonial}
                className="h-10 w-10 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center shrink-0"
                aria-label="التقييم التالي"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5">
              {testimonials.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentTestimonialIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentTestimonialIndex ? "w-6 bg-emerald-500" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`الانتقال إلى التقييم ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}






