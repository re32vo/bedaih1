import { useState } from "react";
import { ShoppingCart, Share2, Facebook, MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  amounts: number[];
};

export default function TributeDonate() {
  const projects: Project[] = [
    {
      id: "1",
      title: "إبتسامة حافظ",
      description: "مجموعة من معلمي ومعلمات وحفاظ كتاب الله تعالى بحاجة للعلاج والأدوية بأمراض الفم والأسنان، تبرعك يحقق لك الأجر وبعور التلاوة الصحيحة والنطق السلـ...",
      image: "/1.jpg",
      amounts: [500, 240, 120],
    },
    {
      id: "2",
      title: "السنابل المضاعفة",
      description: "ضاعف أجرك بالمساهمة في ثلاثة مشاريع بتبرع واحد، لدعم المحتاجين من الفقراء والمساكين والأيتام تبرعك يساهم في البرامج التالية: أوقاف ابتسم والصدقة اليوم...",
      image: "/2.jpg",
      amounts: [500, 300, 100],
    },
    {
      id: "3",
      title: "الصدقة اليومية",
      description: "صدقتك اليوم .. عن كل يوم. يومياً حسنة والحسنة بعشر أمثالها والله يضاعف لمن يشاء، تصدق بـ ريال واحد عن كل يوم من أيام العام المساهمة في علاج الفقر...",
      image: "/3.jpg",
      amounts: [500, 360, 90],
    },
    {
      id: "4",
      title: "فرحة محتاج",
      description: "ساهم في علاج وتوعية المرضى المحتاجين الذين يعجزون عن تحمل التكاليف، بتبرعك تمنحهم الابتسامة التي يستحقونها، وتساعدهم على استعادة صحتهم وكرامتهم.",
      image: "/1.jpg",
      amounts: [500, 300, 50],
    },
    {
      id: "5",
      title: "هدية الوالدين",
      description: "ما أعظمها من هدية حين تتصدق عن والديك ترفع بها درجاتهما ومنازلهما في الج نة، برأ بهما ورحمة وإحساناً، فهما السبب بعد الله في وجودك في الحياة، وخصهما الـ...",
      image: "/2.jpg",
      amounts: [500, 265, 95],
    },
    {
      id: "6",
      title: "بزكاتك يبتسم",
      description: "تطهر الزكاة مال صاحبها وتضاعفه، وتقربه إلى الله تعالى طالما أنه يقدم هذه الزكاة بنفس مؤمنة، طاهرة لرضى الله تعالى.",
      image: "/3.jpg",
      amounts: [],
    },
    {
      id: "7",
      title: "الصدقة الجارية",
      description: "الصدقة الجارية من أفضل الصدقات التي يمكن لا تنقطع فساهم الآن في صدقة جارية عنك وعن أحد تحب، لدى المحتاجين من الفقراء والمساكين والأيتام ليدوم أجرك ويبقى أثرك.",
      image: "/1.jpg",
      amounts: [300, 100, 50],
    },
    {
      id: "8",
      title: "بسمة يتيم",
      description: "أيتام يعانون من ألم المرض وألم الفقد، وليس لديهم ما يكفيهم لعلاجهم ونوعيتهم من المرض.",
      image: "/2.jpg",
      amounts: [500, 300, 100],
    },
    {
      id: "9",
      title: "أوقاف ابتسم",
      description: "الوقف أفضل أنواع الصدقات والأعمال الصالحة وأنفعها، تنتظم أثر الوقف من خلال ستة مشاريع وقفية هي: تأسيس وتشغيل عيادات أسنان وقفية ...",
      image: "/3.jpg",
      amounts: [800, 500, 50],
    },
    {
      id: "10",
      title: "الصدقة الجارية للوالدين",
      description: "قال رسول الله (إذا مات ابن آدم انقطع عمله إلا من ثلاث: صدقة جارية، أو علم ينتفع به أو ولد صالح يدعو له).",
      image: "/1.jpg",
      amounts: [300, 100, 50],
    },
    {
      id: "11",
      title: "تفريج كربة",
      description: "العديد من المرضى من ذوي الحاجة والفقراء يعانون من آلام الأسنان الشديدة، وينتظرون يد العون لتخفيف معاناتهم، بدعمك تمنحهم الإبتسامة ونكف...",
      image: "/2.jpg",
      amounts: [],
    },
    {
      id: "12",
      title: "صدقة ليالي رمضان 🌙",
      description: "🌙 في شهر الرحمة، اجعل عطاؤك حياة 💛 ساهم في صدقة ليالي رمضان مع جمعية ابتسم أنسم لدعم المحتاجين الأيتام والأوقاف والوقائع ابتسم المستدامة. ✨ 💛 ...",
      image: "/3.jpg",
      amounts: [],
    },
  ];

  const [projectAmounts, setProjectAmounts] = useState<Record<string, { selected: number; custom: string }>>(
    projects.reduce((acc, project) => {
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
          {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
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
              <div className="p-4">
                <h3 className="mb-2 text-center text-xl font-bold text-slate-900">{project.title}</h3>
                <p className="mb-4 line-clamp-4 text-center text-sm leading-relaxed text-slate-600">
                  {project.description}
                </p>

                {/* أزرار المبالغ السريعة */}
                {project.amounts.length > 0 && (
                  <div className="mb-3 flex justify-center gap-2">
                    {project.amounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => updateProjectAmount(project.id, amount, String(amount))}
                        className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                          projectAmounts[project.id].selected === amount
                            ? "border-sky-500 bg-sky-50 text-sky-700"
                            : "border-slate-300 bg-white text-slate-700 hover:border-sky-300"
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                )}

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
                <div className="mb-3 grid grid-cols-2 gap-2">
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
                  </Button>
                </div>

                {/* رابط تفاصيل المشروع */}
                <button className="w-full text-center text-sm font-semibold text-slate-600 transition hover:text-sky-600">
                  ← تفاصيل المشروع
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}






