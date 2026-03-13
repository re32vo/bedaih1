import { useState } from "react";
import { useLocation } from "wouter";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Users, Clock3, HeartPulse, TrendingUp, UserRound, ShoppingCart, Share2, Facebook, MessageCircle, ChevronLeft, ChevronRight, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { donationProjects } from "@/data/donationProjects";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

const testimonials = [
  {
    id: "t1",
    name: "أم محمد",
    role: "متبرعة منتظمة",
    rating: 5,
    text: "جمعية بداية تستحق كل الدعم. أتبرع معهم منذ سنوات وأجد شفافية كاملة في كيف تُصرف التبرعات. أحس فعلاً أن تبرعي يصل لمن يستحق.",
  },
  {
    id: "t2",
    name: "عبدالله العمري",
    role: "متبرع",
    rating: 5,
    text: "سهولة في التبرع والدفع عبر الموقع، وأصلني إيصال فوري. الجمعية محترمة وخدماتها تصل فعلاً لمحتاجيها. بارك الله في القائمين عليها.",
  },
  {
    id: "t3",
    name: "سارة القحطاني",
    role: "متطوعة",
    rating: 5,
    text: "تطوعت مع الجمعية في عدة مخيمات صحية وكان التنظيم رائعاً. الفريق متعاون جداً والأثر على المستفيدين ملموس وحقيقي.",
  },
  {
    id: "t4",
    name: "خالد الزهراني",
    role: "مستفيد سابق",
    rating: 5,
    text: "استفدت من خدمات الجمعية في وقت عصيب، وكان التعامل بكل احترام وكرامة. لن أنسى هذا الجميل وسأسعى دائماً لأكون جزءاً من الدعم.",
  },
  {
    id: "t5",
    name: "نورة السلمي",
    role: "متبرعة",
    rating: 5,
    text: "أطفالي يعرفون جمعية بداية ويشاركون معي في اختيار مشاريع التبرع. هذه الجمعية علّمتنا ثقافة العطاء من الصغر.",
  },
  {
    id: "t6",
    name: "فهد البقمي",
    role: "شريك داعم",
    rating: 5,
    text: "شركتنا تدعم الجمعية ضمن مسؤوليتنا الاجتماعية. نجد دائماً تقارير واضحة وشفافية في الإنفاق. علاقة شراكة ناجحة ومثمرة.",
  },
];

const faqs = [
  {
    id: "f1",
    question: "كيف يمكنني التبرع لجمعية بداية؟",
    answer: "يمكنك التبرع بطرق متعددة: عبر الموقع الإلكتروني مباشرةً بالاضافة الى خيار اضافة المشاريع للسلة، أو التحويل البنكي لحساباتنا المعتمدة، أو عبر نقاط البيع في مقر الجمعية. جميع التبرعات مرخصة وآمنة.",
  },
  {
    id: "f2",
    question: "هل جمعية بداية معتمدة ومرخصة رسمياً؟",
    answer: "نعم، جمعية بداية حاصلة على ترخيص رسمي من وزارة الموارد البشرية والتنمية الاجتماعية، وهي مسجلة بسجل المنظمات غير الربحية بالمملكة العربية السعودية.",
  },
  {
    id: "f3",
    question: "ما هي المشاريع التي تدعمها الجمعية؟",
    answer: "تدعم الجمعية مشاريع علاجية لطب الأسنان وعمليات التخدير الكامل، ومشاريع دعم الأيتام، وبرامج التوعية الصحية، وفرص التطوع، وأوقاف بداية للصدقة الجارية.",
  },
  {
    id: "f4",
    question: "هل يمكنني التبرع بمبلغ محدد لمشروع معين؟",
    answer: "بالتأكيد، يمكنك اختيار أي مشروع من صفحة مشاريع التبرع وتحديد المبلغ الذي تريده. سيذهب تبرعك مباشرةً لذلك المشروع المختار.",
  },
  {
    id: "f5",
    question: "كيف أتأكد أن تبرعي وصل؟",
    answer: "بعد إتمام عملية التبرع ستصلك رسالة تأكيد إلكترونية فورية تحتوي على رقم العملية وتفاصيل تبرعك. يمكنك أيضاً تتبع تبرعاتك من خلال لوحة تحكم المتبرع بعد تسجيل الدخول.",
  },
  {
    id: "f6",
    question: "هل التبرع معفى من الضريبة؟",
    answer: "جمعية بداية منظمة غير ربحية معتمدة. للاستفسار عن الإعفاءات الضريبية لتبرعاتك، يُنصح بالتواصل مع المختص الضريبي الخاص بك أو الاطلاع على لوائح هيئة الزكاة والضريبة والجمارك.",
  },
  {
    id: "f7",
    question: "كيف يمكنني الانضمام كمتطوع؟",
    answer: "يسعدنا انضمامك! يمكنك تعبئة استمارة التطوع من خلال صفحة المركز التطوعي على موقعنا، وسيتواصل معك فريقنا لتحديد فرصة التطوع المناسبة لمهاراتك واهتماماتك.",
  },
];

const partners = [
  { id: "p1", name: "وزارة الصحة", image: "/asr.png" },
];

const stats = [
  { id: "s1", title: "خدمة علاجية", value: 39081, icon: HeartPulse },
  { id: "s2", title: "مستفيدو الجمعية", value: 40210, icon: TrendingUp },
  { id: "s3", title: "يتيم ويتيمة", value: 2369, icon: Users },
  { id: "s4", title: "ساعة تطوعية", value: 8459, icon: Clock3 },
  { id: "s5", title: "فرصة تطوعية", value: 323, icon: Users },
  { id: "s6", title: "خدمة علاجية لعمليات التخدير الكامل", value: 1195, icon: TrendingUp },
  { id: "s7", title: "متطوعو الجمعية", value: 1141, icon: UserRound },
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
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-slate-100 py-4 md:py-8" dir="rtl">
      <div className="container mx-auto space-y-6 px-3 sm:px-4 md:space-y-10 lg:space-y-14">
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
          <p className="text-center text-slate-500 text-sm sm:text-base mb-6 sm:mb-8">آراء متبرعين ومتطوعين ومستفيدين من خدمات الجمعية</p>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* قسم الأسئلة الشائعة */}
        <section>
          <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center gap-2 sm:gap-4">
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-56 bg-slate-300" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900">الأسئلة الشائعة</h2>
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-56 bg-slate-300" />
          </div>
          <p className="text-center text-slate-500 text-sm sm:text-base mb-6 sm:mb-8">إجابات على أكثر الأسئلة التي يطرحها زوارنا</p>

          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 text-right touch-manipulation"
                  onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">{faq.question}</span>
                  {openFaqId === faq.id
                    ? <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0 mr-2" />
                    : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
                  }
                </button>
                {openFaqId === faq.id && (
                  <div className="px-4 sm:px-5 pb-4 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}






