import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // اختبر البيئة (jsdom للعميل، node للخادم)
    environment: 'node',
    
    // المسارات التي تحتوي على الاختبارات
    include: ['**/*.spec.ts', '**/*.test.ts'],
    exclude: ['node_modules', 'dist'],

    // مهلة زمنية للاختبار الواحد (ميلي ثانية)
    testTimeout: 10000,

    // تقرير الاختبارات
    reporters: ['default', 'html'],
    outputFile: {
      html: './test-results.html',
    },

    // تغطية الكود
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
      ],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },

    // إعدادات الأداء
    slowTestThreshold: 1000,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
