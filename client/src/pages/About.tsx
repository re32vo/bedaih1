import { motion } from "framer-motion";
import { Heart, Target, Users, Lightbulb, CheckCircle, Award, Handshake, ShieldCheck, Puzzle, UserPlus } from "lucide-react";

export default function About() {
  return (
    <>
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-0 pb-0 bg-white">
        {/* Banner Image */}
        <div className="w-full relative">
          <img src="https://i.postimg.cc/nhvxqddh/12.jpg" alt="بانر نبذة عن الجمعية" className="w-full h-64 object-cover object-center" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 bg-white bg-opacity-90 rounded-xl py-8 shadow"
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-black/10">
              <Heart className="w-4 h-4 text-black" />
              <span className="text-black text-sm font-medium">نبذة عن الجمعية</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black leading-tight">
              جمعية بداية لعلاج ورعاية وتأهيل مرضى الإدمان وأسرهم
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black max-w-3xl mx-auto">
              نبني الأمل ونصنع الفرق في حياة المستفيدين
            </h2>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">نبذة عن الجمعية</h2>
              <div className="w-24 h-1 bg-black mx-auto rounded-full mb-8" />
              <p className="text-lg text-black leading-relaxed">
                جمعية خيرية تهدف إلى رفع مستوى الوعي لدى جميع شرائح المجتمع عن أضرار المخدرات والمؤثرات العقلية،
                وعلاج ورعاية وتأهيل مرضى الإدمان وأسرهم عبر برامج متخصصة ومستدامة.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {[
                { icon: CheckCircle, text: "رفع الوعي بأضرار المخدرات والمؤثرات العقلية" },
                { icon: CheckCircle, text: "رعاية مرضى الإدمان وأسرهم باحتواء وسرية" },
                { icon: CheckCircle, text: "برامج علاجية وتأهيلية متخصصة" },
                { icon: CheckCircle, text: "شراكة فاعلة مع المجتمع والجهات ذات العلاقة" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 bg-white p-4 rounded-lg border border-black/10"
                >
                  <item.icon className="w-6 h-6 text-black shrink-0" />
                  <span className="text-black">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">رؤيتنا ورسالتنا</h2>
            <div className="w-24 h-1 bg-black mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "رؤيتنا",
                desc: "مجتمع آمن خالٍ من الإدمان"
              },
              {
                icon: Heart,
                title: "رسالتنا",
                desc: "أن يكون مجتمعنا واعياً، وأن نأخذ بيد المتعاطي ونوفر له العلاج والتأهيل ليعود لبنة صالحة تسهم في بناء وطنه"
              },
              {
                icon: Target,
                title: "أهدافنا",
                desc: "تقديم الرعاية لمرضى الإدمان وتأهيلهم من خلال برامج علاجية متخصصة"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-black/10"
              >
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{item.title}</h3>
                <p className="text-black leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">قيمنا الأساسية</h2>
            <div className="w-24 h-1 bg-black mx-auto rounded-full mb-4" />
            <p className="text-black max-w-2xl mx-auto">المبادئ التي توجه كل عمل نقوم به</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "السرية", desc: "نحفظ خصوصية المستفيدين وأسرهم في جميع مراحل الخدمة" },
              { icon: Award, title: "المهنية", desc: "نلتزم بالممارسات المتخصصة والجودة في تقديم البرامج" },
              { icon: Heart, title: "الشغف", desc: "نؤمن برسالتنا ونبادر لصناعة أثر حقيقي" },
              { icon: Users, title: "التقبل", desc: "نتعامل مع المستفيد باحترام واحتواء دون وصم" },
              { icon: Puzzle, title: "التكامل", desc: "ننسق الجهود العلاجية والاجتماعية لتحقيق تعافٍ مستدام" },
              { icon: Lightbulb, title: "التأهيل", desc: "نساعد المستفيد على استعادة دوره الفاعل في المجتمع" },
              { icon: UserPlus, title: "الدمج", desc: "ندعم عودة المتعافي للمجتمع والأسرة والعمل" },
              { icon: CheckCircle, title: "الاحتواء", desc: "نساند المستفيد وأسرته في بيئة آمنة وداعمة" },
              { icon: Target, title: "التعزيز", desc: "نعزز السلوك الإيجابي وخطوات التعافي المستمرة" },
              { icon: Handshake, title: "الشراكة", desc: "نعمل مع الجهات والمجتمع لتحقيق أهداف مشتركة" }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-xl p-6 border border-black/10"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{value.title}</h3>
                <p className="text-black text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Work Areas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">مجالات عملنا</h2>
            <div className="w-24 h-1 bg-black mx-auto rounded-full mb-4" />
            <p className="text-black max-w-2xl mx-auto">نعمل في مسارات متكاملة تخدم الوقاية والعلاج والتأهيل والدعم المستمر</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                emoji: "❤️", 
                title: "التوعية الوقائية", 
                items: ["حملات توعوية", "محاضرات وندوات", "ورش عمل", "مواد تثقيفية"] 
              },
              { 
                emoji: "📚", 
                title: "المساعدة في العلاج والرعاية", 
                items: ["إحالة للجهات المختصة", "متابعة علاجية", "دعم الأسرة", "خدمات مساندة"] 
              },
              { 
                emoji: "🏠", 
                title: "التأهيل للمستفيدين", 
                items: ["برامج تعافٍ", "مهارات حياتية", "إرشاد اجتماعي", "تهيئة للاندماج"] 
              },
              { 
                emoji: "👨‍👩‍👧", 
                title: "الدعم والسند المستمر", 
                items: ["رعاية لاحقة", "متابعة أسرية", "مجموعات دعم", "شراكات مجتمعية"] 
              }
            ].map((area, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-black/10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">{area.emoji}</span>
                  <h3 className="text-2xl font-bold text-black">{area.title}</h3>
                </div>
                <ul className="space-y-3">
                  {area.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-black">
                      <span className="w-2 h-2 bg-black rounded-full shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6">
              كن جزءاً من التغيير
            </h2>
            <p className="text-lg sm:text-xl text-black mb-10 leading-relaxed">
              انضم إلينا اليوم وساهم في صنع الفرق. بالتبرع، كل مساهمة لها قيمة.
            </p>
            <div className="flex justify-center">
              <a 
                href="/donate" 
                className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl"
              >
                تبرع الآن
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
}






