import { useState } from "react";
import { useLocation } from "wouter";
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
    <div className="min-h-screen bg-slate-100 py-8 md:py-12" dir="rtl">
      <div className="container mx-auto space-y-14 px-4 md:space-y-20">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-slate-300 md:w-72" />
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-5xl">المزيد هنا</h2>
            <div className="h-px w-20 bg-slate-300 md:w-72" />
          </div>

          <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
            <button type="button" onClick={() => setLocation("/media/library")} className="rounded-xl p-4 transition hover:bg-slate-50">
              <div className="mb-3 flex justify-center"><Newspaper className="h-14 w-14 text-sky-600" /></div>
              <p className="text-3xl font-bold text-slate-800">المركز الإعلامي</p>
            </button>
            <button type="button" onClick={() => setLocation("/media/announcements")} className="rounded-xl p-4 transition hover:bg-slate-50">
              <div className="mb-3 flex justify-center"><FileText className="h-14 w-14 text-sky-600" /></div>
              <p className="text-3xl font-bold text-slate-800">الإصدارات والأنظمة</p>
            </button>
            <button type="button" onClick={() => setLocation("/media/news")} className="rounded-xl p-4 transition hover:bg-slate-50">
              <div className="mb-3 flex justify-center"><Calendar className="h-14 w-14 text-sky-600" /></div>
              <p className="text-3xl font-bold text-slate-800">المدونة والأخبار</p>
            </button>
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-slate-300 md:w-56" />
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-5xl">المركز الإعلامي</h2>
            <div className="h-px w-20 bg-slate-300 md:w-56" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {mediaItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <img src={item.image} alt={item.title} className="mb-4 h-52 w-full rounded-xl object-cover" />
                <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{item.type}</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="mb-2 text-xl font-extrabold text-slate-900">{item.title}</h3>
                <p className="line-clamp-3 text-base leading-7 text-slate-600">{item.excerpt}</p>
                <button type="button" className="mt-3 font-bold text-slate-800 hover:text-sky-600">اقرا المزيد</button>
                <div className="mt-4 flex items-center gap-2 text-slate-400">
                  <Share2 className="h-4 w-4" />
                  <Facebook className="h-4 w-4" />
                  <MessageCircle className="h-4 w-4" />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button type="button" className="rounded-xl bg-sky-500 px-8 text-white hover:bg-sky-600" onClick={() => setLocation("/media/news")}>
              عرض المزيد
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
          <h2 className="mb-10 text-center text-4xl font-extrabold text-slate-900 md:text-6xl">شركاء النجاح</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner) => (
              <div key={partner.id} className="flex h-44 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-center text-2xl font-bold text-slate-600">
                {partner.name}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-8 text-center text-4xl font-extrabold text-slate-900 md:text-6xl">من مشاريع الجمعية</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project) => {
              const amounts = project.amounts.slice(0, 3);
              return (
                <div key={project.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <img src={project.image} alt={project.title} className="h-40 w-full rounded-t-2xl object-cover" />

                  <div className="border-y border-slate-100 bg-slate-50 px-4 py-2 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      <MessageCircle className="h-4 w-4" />
                      <Facebook className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <h3 className="m-0 text-center text-2xl font-extrabold text-slate-900">{project.title}</h3>
                    <p className="line-clamp-4 text-center text-base leading-7 text-slate-600">{project.description}</p>

                    <div className="grid grid-cols-3 gap-2">
                      {amounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => updateProjectAmount(project.id, amount, String(amount))}
                          className={`rounded-xl border px-2 py-2 text-base font-bold transition ${
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
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base font-bold text-slate-600">ريال</span>
                      <Input
                        value={projectAmounts[project.id]?.custom || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          updateProjectAmount(project.id, 0, value);
                        }}
                        className="h-11 rounded-xl border-slate-300 pr-14 text-center text-xl font-bold"
                        inputMode="numeric"
                        placeholder="0"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button type="button" className="rounded-xl bg-sky-500 font-bold text-white hover:bg-sky-600" onClick={() => setLocation(`/donate/opportunities/${project.id}`)}>
                        تبرع
                      </Button>
                      <Button type="button" className="rounded-xl bg-indigo-900 font-bold text-white hover:bg-indigo-800" onClick={() => addProjectToCart(project.id)}>
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>

                    <button type="button" onClick={() => setLocation(`/donate/opportunities/${project.id}`)} className="w-full text-center font-bold text-slate-700 hover:text-sky-600">
                      تفاصيل المشروع ←
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Button type="button" className="rounded-xl bg-sky-500 px-8 text-white hover:bg-sky-600" onClick={() => setLocation("/donate/opportunities")}>
              عرض المزيد
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-slate-300 md:w-64" />
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-6xl">ابتسم في ارقام</h2>
            <div className="h-px w-20 bg-slate-300 md:w-64" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-semibold text-slate-500">{item.title}</p>
                    <p className="text-5xl font-extrabold text-slate-900">{item.value}</p>
                  </div>
                  <div className="rounded-2xl bg-sky-500 p-4 text-white">
                    <item.icon className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.slice(4).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-semibold leading-8 text-slate-500">{item.title}</p>
                    <p className="text-5xl font-extrabold text-slate-900">{item.value}</p>
                  </div>
                  <div className="rounded-2xl bg-sky-500 p-4 text-white">
                    <item.icon className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}






