import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Heart, Users, Globe, BookOpen, Target, HandHeart, Handshake, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PageLoadingOverlay } from "@/components/PageLoadingOverlay";

// Animation Variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function StatCounter() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const stats = [
    { icon: Users, label: "مستفيد", value: 15000, color: "from-blue-500 to-cyan-500" },
    { icon: Target, label: "مبادرة خيرية", value: 120, color: "from-purple-500 to-pink-500" },
    { icon: HandHeart, label: "ساعة تطوع", value: 8500, color: "from-indigo-500 to-blue-500" },
    { icon: Globe, label: "منطقة نخدمها", value: 25, color: "from-cyan-500 to-teal-500" },
  ];

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-slate-300 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 md:p-8 lg:p-12"
    >
      {stats.map((stat, index) => (
        <motion.div 
          key={index} 
          className="text-center space-y-2 sm:space-y-3"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={`mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 sm:mb-4 shadow-lg`}>
            <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900" style={{ fontFamily: 'Cairo, Tajawal, sans-serif', fontWeight: 800, letterSpacing: '-1px' }}>
            {inView ? <CountUp end={stat.value} duration={2} separator="," /> : "0"}+
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function Home() {
  return (
    <>
      <PageLoadingOverlay />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-0 pb-0 bg-white">
        {/* Banner Image */}
        <div className="w-full relative">
          <img src="https://i.postimg.cc/FR2kMGwx/12-(1).jpg" alt="بانر الرئيسية" className="w-full h-64 object-cover object-center" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 mb-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 bg-white rounded-xl py-8 shadow"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black leading-tight">
              معاً نصنع الأثر الحقيقي
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black max-w-3xl mx-auto">
              كن جزءاً من التغيير وشاركنا في بناء مستقبل أفضل للمجتمع
            </h2>
            <div className="flex justify-center mt-6">
              <button
                className="px-8 py-4 rounded-lg bg-slate-800 text-white border-2 border-emerald-500/50 shadow-md flex items-center justify-center gap-2 font-semibold hover:bg-slate-700 transition-all text-lg"
                onClick={() => {
                  document.getElementById('donate-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>تبرع الآن</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-8 mb-8 relative z-20 bg-white">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <StatCounter />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-8 mb-8 bg-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <motion.div variants={fadeIn} className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
                  رسالتنا: <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">الإنسان أولاً</span>
                </h2>
                <div className="w-24 h-1 bg-emerald-500 rounded-full" />
              </motion.div>
              
              <motion.p variants={fadeIn} className="text-base sm:text-lg text-slate-700 leading-relaxed">
                تأسست جمعية بداية برؤية واضحة تهدف إلى تمكين الفئات الأقل حظاً في المجتمع. نحن لا نقدم المساعدات فحسب، بل نبني جسوراً من الأمل والفرص المستدامة.
              </motion.p>
              
              <motion.ul variants={fadeIn} className="space-y-4">
                {[
                  "دعم الأسر المتعففة وتوفير الاحتياجات الأساسية.",
                  "برامج تعليمية وتدريبية لتأهيل الشباب لسوق العمل.",
                  "مبادرات صحية توفر الرعاية الطبية للمحتاجين.",
                  "كفالة الأيتام ورعايتهم اجتماعياً ونفسياً."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={fadeIn}>
                <Link href="/about">
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all">
                    اقرأ المزيد عنا
                  </button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative overflow-x-hidden"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl" />
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop" 
                alt="Charity Projects" 
                className="relative rounded-2xl shadow-2xl border-2 border-emerald-500/30 w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 mb-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 md:mb-6">ركائز طموحنا</h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-700 max-w-2xl mx-auto">نعمل وفق استراتيجية متكاملة تضمن تحقيق أثر مستدام في المجتمع</p>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {[
            { icon: Users, title: "الدعم المجتمعي", desc: "تعزيز التكافل الاجتماعي وتلبية احتياجات الأسر.", gradient: "from-blue-500 to-cyan-500" },
            { icon: BookOpen, title: "التمكين", desc: "تحويل المستفيدين إلى أعضاء فاعلين ومنتجين.", gradient: "from-purple-500 to-pink-500" },
            { icon: Handshake, title: "الشراكات", desc: "التعاون مع القطاعين العام والخاص لتحقيق الأهداف.", gradient: "from-indigo-500 to-blue-500" },
            { icon: Monitor, title: "الحلول الرقمية", desc: "تسخير التقنية لتسهيل وصول الخدمات للمستحقين.", gradient: "from-cyan-500 to-teal-500" },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-300 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-700 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-8 mb-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 sm:mb-3 md:mb-4">🌟 مشاريعنا الخيرية</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-4" />
            <p className="text-sm sm:text-base md:text-lg text-slate-700 max-w-2xl mx-auto">مبادرات متنوعة نعمل بها لتحسين حياة المحتاجين والمهمشين</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {[
              { icon: "❤️", title: "دعم صحي", desc: "توفير الرعاية الطبية والأدوية للمحتاجين بدون مقابل", gradient: "from-red-500 to-pink-500" },
              { icon: "📚", title: "تمكين تعليمي", desc: "برامج تعليمية وتدريبية لتأهيل الشباب للعمل", gradient: "from-blue-500 to-indigo-500" },
              { icon: "🏠", title: "دعم سكني", desc: "مساعدة الأسر المتعثرة بالحصول على مأوى آمن", gradient: "from-green-500 to-teal-500" },
            ].map((project, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-300 rounded-2xl p-8 hover:border-emerald-500/50 transition-all"
              >
                <div className="text-5xl mb-4">{project.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{project.title}</h3>
                <p className="text-slate-700 leading-relaxed">{project.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section id="donate-section" className="py-8 mb-0 bg-white">
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 md:mb-6 lg:mb-8">تبرعك يصنع مستقبلاً</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-700 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            مساهمتك البسيطة قد تكون سبباً في تغيير حياة أسرة كاملة. كن جزءاً من الخير.
          </p>
          <button 
            className="px-8 py-4 bg-white text-emerald-700 rounded-lg font-bold shadow-xl hover:shadow-2xl hover:bg-emerald-50 transition-all" 
            onClick={() => window.location.href = '/donate'}
          >
            تبرع الآن
          </button>
        </div>
      </section>
      </div>
    </>
  );
}
