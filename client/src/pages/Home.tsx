import { useState } from "react";
import { useLocation } from "wouter";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Calendar, FileText, Newspaper, Users, Clock3, HeartPulse, TrendingUp, UserRound, ShoppingCart, Share2, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { donationProjects } from "@/data/donationProjects";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

type MediaItem = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  type: string;
};

const mediaItems: MediaItem[] = [
  {
    id: "m1",
    title: "بيان إعلامي",
    excerpt: "جمعية ابتسم تقدم خدمات طب الفم والأسنان للمواطنين القادمين من دول مجلس التعاون.",
    image: "/1.jpg",
    date: "2026-03-01",
    type: "أخبار",
  },
  {
    id: "m2",
    title: "أخطاء شائعة في العناية بالأسنان خلال الصيام",
    excerpt: "خلال شهر الصيام، يتعرض البعض لأخطاء شائعة في تنظيف الأسنان ونمط الغذاء اليومي.",
    image: "/2.jpg",
    date: "2026-03-02",
    type: "مقالات",
  },
  {
    id: "m3",
    title: "مرضى السكري.. كيف يعتنون بصحة الفم أثناء الصيام؟",
    excerpt: "توعية خاصة لمرضى السكري حول أفضل ممارسات العناية بالفم في رمضان.",
    image: "/3.jpg",
    date: "2026-03-03",
    type: "مقالات",
  },
];

const partners = [
  { id: "p1", name: "السندس Dental Care" },
  { id: "p2", name: "وزارة الصحة" },
  { id: "p3", name: "زمزم" },
  { id: "p4", name: "وزارة الموارد البشرية" },
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

  return (
    <div className="min-h-screen bg-slate-100 py-4 md:py-8" dir="rtl">
      <div className="container mx-auto space-y-6 px-3 sm:px-4 md:space-y-10 lg:space-y-14">
        <section ref={statsRef} className="rounded-xl md:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 md:p-6">
          <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center gap-2 sm:gap-4">
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-64 bg-slate-300" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900">ابتسم في ارقام</h2>
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
          
          <div className="relative">
            <div className="flex gap-4 sm:gap-6 animate-scroll-rtl">
              {/* نسخة أولى من الشركاء */}
              {partners.map((partner) => (
                <div key={`first-${partner.id}`} className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] h-24 sm:h-28 md:h-32 flex items-center justify-center rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 text-center text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-600">
                  {partner.name}
                </div>
              ))}
              {/* نسخة ثانية من الشركاء (للحركة المستمرة) */}
              {partners.map((partner) => (
                <div key={`second-${partner.id}`} className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] h-24 sm:h-28 md:h-32 flex items-center justify-center rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 text-center text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-600">
                  {partner.name}
                </div>
              ))}
              {/* نسخة ثالثة (لضمان استمرارية الحركة) */}
              {partners.map((partner) => (
                <div key={`third-${partner.id}`} className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] h-24 sm:h-28 md:h-32 flex items-center justify-center rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 text-center text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-600">
                  {partner.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center gap-2 sm:gap-4">
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-56 bg-slate-300" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900">المركز الإعلامي</h2>
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-56 bg-slate-300" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mediaItems.map((item) => (
              <article key={item.id} className="rounded-xl md:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
                <img src={item.image} alt={item.title} loading="lazy" className="mb-3 sm:mb-4 h-36 sm:h-40 md:h-44 w-full rounded-lg sm:rounded-xl object-cover" />
                <div className="mb-2 sm:mb-3 flex items-center justify-between text-xs sm:text-sm text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 sm:px-3 py-0.5 sm:py-1 text-xs">{item.type}</span>
                  <span className="text-xs">{item.date}</span>
                </div>
                <h3 className="mb-1.5 sm:mb-2 text-base sm:text-lg font-extrabold text-slate-900 leading-snug">{item.title}</h3>
                <p className="line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">{item.excerpt}</p>
                <button type="button" className="mt-2 sm:mt-3 font-bold text-slate-800 hover:text-sky-600 text-xs sm:text-sm touch-manipulation">اقرا المزيد</button>
                <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 text-slate-400">
                  <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 md:mt-8 text-center">
            <Button type="button" className="rounded-lg sm:rounded-xl bg-sky-500 px-6 sm:px-8 text-white hover:bg-sky-600 text-sm sm:text-base h-10 sm:h-11 touch-manipulation" onClick={() => setLocation("/media/news")}>
              عرض المزيد
            </Button>
          </div>
        </section>

        <section className="rounded-xl md:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 md:p-6">
          <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center gap-2 sm:gap-4">
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-72 bg-slate-300" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900">المزيد هنا</h2>
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-72 bg-slate-300" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-3">
            <button type="button" onClick={() => setLocation("/media/library")} className="rounded-lg sm:rounded-xl p-3 sm:p-4 transition hover:bg-slate-50 touch-manipulation flex flex-col items-center justify-center">
              <Newspaper className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-sky-600 mb-2 sm:mb-3" />
              <p className="text-base sm:text-lg md:text-xl font-bold text-slate-800 text-center">المركز الإعلامي</p>
            </button>
            <button type="button" onClick={() => setLocation("/media/announcements")} className="rounded-lg sm:rounded-xl p-3 sm:p-4 transition hover:bg-slate-50 touch-manipulation flex flex-col items-center justify-center">
              <FileText className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-sky-600 mb-2 sm:mb-3" />
              <p className="text-base sm:text-lg md:text-xl font-bold text-slate-800 text-center">الإصدارات والأنظمة</p>
            </button>
            <button type="button" onClick={() => setLocation("/media/news")} className="rounded-lg sm:rounded-xl p-3 sm:p-4 transition hover:bg-slate-50 touch-manipulation flex flex-col items-center justify-center">
              <Calendar className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-sky-600 mb-2 sm:mb-3" />
              <p className="text-base sm:text-lg md:text-xl font-bold text-slate-800 text-center">المدونة والأخبار</p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}






