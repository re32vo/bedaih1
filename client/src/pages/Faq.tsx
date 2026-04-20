import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    id: "f1",
    question: "كيف يمكنني التبرع لجمعية بداية؟",
    answer:
      "يمكنك التبرع بطرق متعددة: عبر الموقع الإلكتروني مباشرةً بالاضافة الى خيار اضافة المشاريع للسلة، أو التحويل البنكي لحساباتنا المعتمدة، أو عبر نقاط البيع في مقر الجمعية. جميع التبرعات مرخصة وآمنة.",
  },
  {
    id: "f2",
    question: "هل جمعية بداية معتمدة ومرخصة رسمياً؟",
    answer:
      "نعم، جمعية بداية حاصلة على ترخيص رسمي من وزارة الموارد البشرية والتنمية الاجتماعية، وهي مسجلة بسجل المنظمات غير الربحية بالمملكة العربية السعودية.",
  },
  {
    id: "f3",
    question: "ما هي المشاريع التي تدعمها الجمعية؟",
    answer:
      "تدعم الجمعية مشاريع علاجية لطب الأسنان وعمليات التخدير الكامل، ومشاريع دعم الأيتام، وبرامج التوعية الصحية، وفرص التطوع، وأوقاف بداية للصدقة الجارية.",
  },
  {
    id: "f4",
    question: "هل يمكنني التبرع بمبلغ محدد لمشروع معين؟",
    answer:
      "بالتأكيد، يمكنك اختيار أي مشروع من صفحة مشاريع التبرع وتحديد المبلغ الذي تريده. سيذهب تبرعك مباشرةً لذلك المشروع المختار.",
  },
  {
    id: "f5",
    question: "كيف أتأكد أن تبرعي وصل؟",
    answer:
      "بعد إتمام عملية التبرع ستصلك رسالة تأكيد إلكترونية فورية تحتوي على رقم العملية وتفاصيل تبرعك. يمكنك أيضاً تتبع تبرعاتك من خلال لوحة تحكم المتبرع بعد تسجيل الدخول.",
  },
  {
    id: "f6",
    question: "هل التبرع معفى من الضريبة؟",
    answer:
      "جمعية بداية منظمة غير ربحية معتمدة. للاستفسار عن الإعفاءات الضريبية لتبرعاتك، يُنصح بالتواصل مع المختص الضريبي الخاص بك أو الاطلاع على لوائح هيئة الزكاة والضريبة والجمارك.",
  },
  {
    id: "f7",
    question: "كيف يمكنني الانضمام كمتطوع؟",
    answer:
      "يسعدنا انضمامك! يمكنك تعبئة استمارة التطوع من خلال صفحة المركز التطوعي على موقعنا، وسيتواصل معك فريقنا لتحديد فرصة التطوع المناسبة لمهاراتك واهتماماتك.",
  },
];

export default function Faq() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  return (
    <div className="bg-slate-50 py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4 space-y-8 sm:space-y-10">
        <section>
          <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center gap-2 sm:gap-4">
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-56 bg-slate-300" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900">الأسئلة الشائعة</h1>
            <div className="h-px w-8 sm:w-16 md:w-20 lg:w-56 bg-slate-300" />
          </div>
          <p className="text-center text-slate-500 text-sm sm:text-base mb-6 sm:mb-8">
            إجابات على أكثر الأسئلة التي يطرحها زوار جمعية بداية
          </p>

          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 text-right touch-manipulation"
                  onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">{faq.question}</span>
                  {openFaqId === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0 mr-2" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
                  )}
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
