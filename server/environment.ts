/**
 * ملف فحص ومعالجة البيئة
 */

export interface EnvironmentConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  smtpEnabled: boolean;
  supabaseEnabled: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  supabaseUrl?: string;
  corsOrigins: string[];
  presidentEmail?: string;
}

/**
 * فحص المتغيرات البيئية الضرورية
 */
export function validateAndLoadEnvironment(): EnvironmentConfig {
  const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
  const port = parseInt(process.env.PORT || '5000', 10);

  // البيانات الاختيارية
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  const corsOrigins = corsOrigin
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const presidentEmail = process.env.PRESIDENT_EMAIL || process.env.HEAD_EMAIL || 'bedaya.org.sa@gmail.com';

  // التحقق من صحة الإعدادات المهمة
  if (!Number.isFinite(port) || port < 1 || port > 65535) {
    throw new Error(`❌ PORT غير صحيح: ${process.env.PORT}, يجب أن يكون رقم بين 1 و 65535`);
  }

  if (corsOrigins.length === 0) {
    throw new Error('❌ CORS_ORIGIN مطلوب ومع قيمة واحدة على الأقل');
  }

  // التحقق من SMTP
  const smtpConfigured = !!(smtpHost && smtpUser && smtpPass);
  if (!smtpConfigured && nodeEnv === 'production') {
    console.warn('⚠️  تحذير: إعدادات SMTP غير مكتملة. رسائل البريد لن يتم إرسالها');
  }

  // التحقق من Supabase
  const supabaseConfigured = !!(supabaseUrl && supabaseKey);
  if (!supabaseConfigured) {
    console.warn('⚠️  تحذير: Supabase غير مكتملة. سيتم استخدام التخزين المحلي فقط');
  }

  return {
    port,
    nodeEnv,
    smtpEnabled: smtpConfigured,
    supabaseEnabled: supabaseConfigured,
    smtpHost,
    smtpPort,
    smtpUser,
    supabaseUrl,
    corsOrigins,
    presidentEmail,
  };
}

/**
 * طباعة تقرير البيئة
 */
export function printEnvironmentReport(config: EnvironmentConfig): void {
  const logger = console;
  logger.log('\n═══════════════════════════════════════════════════════');
  logger.log('📋 تقرير إعدادات البيئة');
  logger.log('═══════════════════════════════════════════════════════');
  logger.log(`🔌 المنفذ: ${config.port}`);
  logger.log(`🌍 البيئة: ${config.nodeEnv}`);
  logger.log(`📧 SMTP: ${config.smtpEnabled ? '✅ مفعل' : '❌ معطل'}`);
  logger.log(`🗄️  Supabase: ${config.supabaseEnabled ? '✅ مشغل' : '❌ معطل'}`);
  logger.log(`🔐 الأصول المسموحة: ${config.corsOrigins.length}`);
  logger.log(`👤 بريد الرئيس: ${config.presidentEmail}`);
  logger.log('═══════════════════════════════════════════════════════\n');
}
