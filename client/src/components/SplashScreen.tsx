import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

export function SplashScreen({ isVisible, onComplete }: { isVisible: boolean; onComplete: () => void }) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000); // اختفاء بعد 3 ثواني

    return () => clearTimeout(timer);
  }, [isVisible]);

  useEffect(() => {
    if (!isAnimating && isVisible) {
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 500); // وقت الخروج
      return () => clearTimeout(exitTimer);
    }
  }, [isAnimating, isVisible, onComplete]);

  // منع جميع التفاعلات عندما تكون شاشة الانتظار مرئية
  useEffect(() => {
    if (!isVisible) return;

    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    htmlElement.style.overflow = 'hidden !important';
    bodyElement.style.overflow = 'hidden !important';
    bodyElement.style.touchAction = 'none !important';
    bodyElement.style.userSelect = 'none !important';

    const preventInteraction = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    const preventScroll = (e: WheelEvent | TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    document.addEventListener('click', preventInteraction, true);
    document.addEventListener('pointermove', preventInteraction, true);
    document.addEventListener('wheel', preventScroll as any, { passive: false, capture: true });
    document.addEventListener('touchmove', preventScroll as any, { passive: false, capture: true });
    document.addEventListener('contextmenu', preventInteraction, true);
    document.addEventListener('keydown', preventInteraction, true);
    document.addEventListener('keyup', preventInteraction, true);
    document.addEventListener('input', preventInteraction, true);

    return () => {
      htmlElement.style.overflow = '';
      bodyElement.style.overflow = '';
      bodyElement.style.touchAction = '';
      bodyElement.style.userSelect = '';

      document.removeEventListener('click', preventInteraction, true);
      document.removeEventListener('pointermove', preventInteraction, true);
      document.removeEventListener('wheel', preventScroll as any, true);
      document.removeEventListener('touchmove', preventScroll as any, true);
      document.removeEventListener('contextmenu', preventInteraction, true);
      document.removeEventListener('keydown', preventInteraction, true);
      document.removeEventListener('keyup', preventInteraction, true);
      document.removeEventListener('input', preventInteraction, true);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isAnimating ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-50"
      dir="rtl"
      style={{
        touchAction: 'none !important' as any,
        userSelect: 'none !important' as any,
        WebkitUserSelect: 'none !important' as any,
        MozUserSelect: 'none !important' as any,
        cursor: 'not-allowed'
      }}
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

      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* animated Logo */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
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
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Text Container */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl sm:text-3xl font-bold text-slate-900"
          >
            جمعية بداية
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-sm sm:text-base text-emerald-600"
          >
            جمعية خيرية موثوقة
          </motion.p>

          {/* Loading Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-2 pt-4"
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
        </div>
      </div>
    </motion.div>
  );
}
