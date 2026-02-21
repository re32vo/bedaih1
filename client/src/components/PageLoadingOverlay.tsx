import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

export function PageLoadingOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // إخفاء الـ overlay بعد 2 ثانية من دخول الصفحة
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      dir="rtl"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Glow Effect Background */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 py-16 sm:py-20">
        {/* Logo */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 20px rgba(16, 185, 129, 0.3)",
              "0 0 40px rgba(16, 185, 129, 0.6)",
              "0 0 20px rgba(16, 185, 129, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <img
            src={logoImg}
            alt="شعار جمعية بداية"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Organization Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center space-y-2"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">جمعية بداية</h1>
          <p className="text-sm sm:text-base text-emerald-600 font-medium">جمعية خيرية موثوقة</p>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-2 pt-6"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-emerald-400 rounded-full"
            />
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs sm:text-sm text-slate-600 mt-4"
        >
          جاري التحميل...
        </motion.p>
      </div>
    </motion.div>
  );
}
