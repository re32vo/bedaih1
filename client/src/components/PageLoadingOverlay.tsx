import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
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

  // منع التمرير وإخفاء العناصر الأخرى عندما يكون الـ overlay مرئياً
  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    if (isVisible) {
      // منع الـ address bar من الظهور
      htmlElement.style.overflow = 'hidden !important';
      htmlElement.style.height = '100vh !important';
      htmlElement.style.margin = '0 !important';
      htmlElement.style.padding = '0 !important';
      htmlElement.style.position = 'fixed !important';
      htmlElement.style.width = '100% !important';
      
      bodyElement.style.overflow = 'hidden !important';
      bodyElement.style.height = '100vh !important';
      bodyElement.style.margin = '0 !important';
      bodyElement.style.padding = '0 !important';
      bodyElement.style.width = '100vw !important';
      bodyElement.style.position = 'fixed !important';
      bodyElement.style.top = '0 !important';
      bodyElement.style.left = '0 !important';
    } else {
      // استعادة الحالة الطبيعية
      htmlElement.style.overflow = '';
      htmlElement.style.height = '';
      htmlElement.style.margin = '';
      htmlElement.style.padding = '';
      htmlElement.style.position = '';
      htmlElement.style.width = '';
      
      bodyElement.style.overflow = '';
      bodyElement.style.height = '';
      bodyElement.style.margin = '';
      bodyElement.style.padding = '';
      bodyElement.style.width = '';
      bodyElement.style.position = '';
      bodyElement.style.top = '';
      bodyElement.style.left = '';
    }

    return () => {
      htmlElement.style.overflow = '';
      htmlElement.style.height = '';
      htmlElement.style.margin = '';
      htmlElement.style.padding = '';
      htmlElement.style.position = '';
      htmlElement.style.width = '';
      
      bodyElement.style.overflow = '';
      bodyElement.style.height = '';
      bodyElement.style.margin = '';
      bodyElement.style.padding = '';
      bodyElement.style.width = '';
      bodyElement.style.position = '';
      bodyElement.style.top = '';
      bodyElement.style.left = '';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const overlayContent = (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-white"
      dir="rtl"
      style={{ 
        position: 'fixed !important' as any,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw !important' as any,
        height: '100vh !important' as any,
        minHeight: '100vh !important' as any,
        maxHeight: '100vh !important' as any,
        minWidth: '100vw !important' as any,
        maxWidth: '100vw !important' as any,
        margin: 0,
        padding: 0,
        overflow: 'hidden !important' as any,
        zIndex: 999999,
        pointerEvents: 'auto',
        opacity: 1,
        backgroundColor: '#ffffff !important' as any,
        display: 'flex !important' as any,
        inset: 0,
        viewTransitionName: 'loader'
      }}
    >
      {/* Glow Effect Background */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Content Container */}
      <div className="relative flex flex-col items-center justify-center gap-6 px-4" style={{ minHeight: '100vh', minWidth: '100%', zIndex: 10, position: 'relative' }}>
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
      </div>
    </motion.div>
  );

  return createPortal(overlayContent, document.body);
}
