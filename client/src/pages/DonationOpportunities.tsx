import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingCart, Share2, Facebook, MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { donationProjects } from "@/data/donationProjects";

export default function DonationOpportunities() {
  const [, setLocation] = useLocation();

  const [projectAmounts, setProjectAmounts] = useState<Record<string, { selected: number; custom: string }>>(
    donationProjects.reduce((acc, project) => {
      acc[project.id] = { selected: 0, custom: "" };
      return acc;
    }, {} as Record<string, { selected: number; custom: string }>)
  );

  const updateProjectAmount = (projectId: string, selected: number, custom: string = "") => {
    setProjectAmounts({
      ...projectAmounts,
      [projectId]: { selected, custom },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-6 md:py-10" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-sky-600 md:text-4xl">فرص التبرع</h1>
          <p className="mt-2 text-base font-medium text-slate-700">
            اختر المشروع الذي ترغب في دعمه وساهم في صناعة الفرق
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {donationProjects.map((project) => {
            const quickAmounts = project.amounts.slice(0, 3);

            return (
            <div
              key={project.id}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              {/* صورة المشروع */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* أيقونات المشاركة */}
              <div className="flex items-center justify-center gap-2 bg-slate-100 py-2">
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600 transition hover:bg-slate-400">
                  <Instagram className="h-4 w-4" />
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600 transition hover:bg-slate-400">
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600 transition hover:bg-slate-400">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600 transition hover:bg-slate-400">
                  <Facebook className="h-4 w-4" />
                </button>
              </div>

              {/* محتوى البطاقة */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-2 min-h-[56px] text-center text-xl font-bold text-slate-900">{project.title}</h3>
                <p className="mb-4 min-h-[88px] line-clamp-4 text-center text-sm leading-relaxed text-slate-600">
                  {project.description}
                </p>

                {/* أزرار المبالغ السريعة */}
                <div className="mb-3 grid min-h-[44px] grid-cols-3 gap-2">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => updateProjectAmount(project.id, amount, String(amount))}
                        className={`rounded-lg border px-2 py-2 text-sm font-bold transition ${
                          projectAmounts[project.id].selected === amount
                            ? "border-sky-500 bg-sky-50 text-sky-700"
                            : "border-slate-300 bg-white text-slate-700 hover:border-sky-300"
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                    {Array.from({ length: Math.max(0, 3 - quickAmounts.length) }).map((_, index) => (
                      <div key={`empty-${project.id}-${index}`} className="rounded-lg border border-transparent" />
                    ))}
                </div>

                {/* حقل المبلغ */}
                <div className="relative mb-3">
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                    ريال
                  </span>
                  <Input
                    value={projectAmounts[project.id].custom}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      updateProjectAmount(project.id, 0, value);
                    }}
                    className="h-11 rounded-lg border-slate-300 bg-white pr-12 text-center text-lg font-bold"
                    placeholder="0"
                    inputMode="numeric"
                  />
                </div>

                {/* أزرار التبرع */}
                <div className="mb-3 mt-auto grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    className="h-10 rounded-lg bg-sky-500 text-sm font-bold text-white transition hover:bg-sky-600"
                  >
                    تبرع
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-10 rounded-lg bg-indigo-900 text-sm font-bold text-white transition hover:bg-indigo-800"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    إضافة للسلة
                  </Button>
                </div>

                {/* رابط تفاصيل المشروع */}
                <button
                  type="button"
                  onClick={() => setLocation(`/donate/opportunities/${project.id}`)}
                  className="w-full text-center text-sm font-semibold text-slate-600 transition hover:text-sky-600"
                >
                  ← تفاصيل المشروع
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}






