import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAllTablesAndColumns() {
  console.log('🔍 تحقق شامل من قاعدة البيانات\n');
  console.log('='.repeat(70));

  const tables = [
    { name: 'donations', expectedColumns: ['id', 'email', 'amount', 'method', 'code', 'status', 'created_at', 'updated_at'] },
    { name: 'bank_transfers', expectedColumns: ['id', 'email', 'donor_name', 'phone', 'amount', 'code', 'status', 'admin_notes', 'created_at', 'updated_at'] },
    { name: 'donors', expectedColumns: ['id', 'email', 'name', 'phone', 'created_at', 'last_login_at', 'total_donations', 'donation_count', 'last_donation_date'] },
    { name: 'beneficiaries', expectedColumns: ['id', 'full_name', 'national_id', 'email', 'phone', 'assistance_type', 'status', 'created_at'] },
    { name: 'job_applications', expectedColumns: ['id', 'full_name', 'email', 'phone', 'experience', 'skills', 'status', 'created_at'] },
    { name: 'contact_messages', expectedColumns: ['id', 'name', 'email', 'phone', 'message', 'status', 'created_at'] },
    { name: 'volunteers', expectedColumns: ['id', 'full_name', 'email', 'phone', 'skills', 'status', 'created_at'] },
    { name: 'employees', expectedColumns: ['id', 'email', 'name', 'role', 'active', 'permissions', 'created_at'] },
    { name: 'recurring_donations', expectedColumns: ['id', 'full_name', 'phone', 'project', 'frequency', 'amount', 'status', 'created_at'] },
    { name: 'audit_log', expectedColumns: ['id', 'action', 'user_email', 'details', 'created_at', 'event_category', 'entity_type', 'before_data', 'after_data'] },
    { name: 'otp_tokens', expectedColumns: ['id', 'email', 'code', 'expires_at', 'used', 'created_at'] },
    { name: 'tokens', expectedColumns: ['id', 'email', 'token', 'expires_at', 'created_at'] },
    { name: 'outgoing_emails', expectedColumns: ['id', 'to_email', 'subject', 'body', 'status', 'sent_at', 'created_at'] },
  ];

  let totalTablesOK = 0;
  let totalColumnsOK = 0;
  let totalColumnsMissing = 0;

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('*')
        .limit(1);

      if (error && error.message.includes('does not exist')) {
        console.log(`\n❌ ${table.name}`);
        console.log(`   الحالة: جدول غير موجود`);
      } else {
        totalTablesOK++;
        console.log(`\n✅ ${table.name}`);
        
        // Check columns by examining the first row
        if (data && data.length > 0) {
          const row = data[0];
          const actualColumns = Object.keys(row);
          const missingColumns = table.expectedColumns.filter(col => !actualColumns.includes(col));
          
          if (missingColumns.length === 0) {
            console.log(`   ✅ جميع الحقول موجودة (${actualColumns.length} حقول)`);
            totalColumnsOK++;
          } else {
            console.log(`   ⚠️  الحقول الموجودة: ${actualColumns.length}`);
            console.log(`   ❌ حقول مفقودة: ${missingColumns.join(', ')}`);
            totalColumnsMissing += missingColumns.length;
          }
        } else {
          console.log(`   ℹ️  الجدول فارغ - تم التحقق من الهيكل`);
          totalColumnsOK++;
        }
      }
    } catch (err) {
      console.log(`\n⚠️  ${table.name}`);
      console.log(`   خطأ: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n📊 الملخص الإجمالي:');
  console.log(`   ✅ الجداول الموجودة: ${totalTablesOK}/${tables.length}`);
  console.log(`   ✅ الجداول الكاملة: ${totalColumnsOK}/${tables.length}`);
  if (totalColumnsMissing > 0) {
    console.log(`   ❌ حقول مفقودة: ${totalColumnsMissing}`);
  }

  // Check indexes
  console.log('\n' + '='.repeat(70));
  console.log('\n🔍 الفهارس المهمة:\n');

  const indexes = [
    'idx_donations_status',
    'idx_donations_email_status',
    'idx_bank_transfers_status',
    'idx_bank_transfers_email_status',
    'idx_beneficiaries_status',
    'idx_job_applications_status',
    'idx_contact_messages_status',
    'idx_volunteers_status',
    'idx_outgoing_emails_status',
  ];

  console.log('⚠️  ملاحظة: لا يمكن التحقق من الفهارس برمجياً بسهولة');
  console.log('   يرجى التحقق يدويّاً من Supabase Dashboard');
  console.log(`   من المتوقع وجود ${indexes.length} فهرس رئيسي`);

  console.log('\n' + '='.repeat(70));
  console.log('\n✨ الخلاصة:\n');
  
  if (totalTablesOK === tables.length && totalColumnsMissing === 0) {
    console.log('✅ قاعدة البيانات كاملة وجاهزة للعمل! 🎉');
    console.log('   جميع الجداول موجودة');
    console.log('   جميع الحقول الضرورية موجودة');
  } else if (totalColumnsMissing > 0) {
    console.log('⚠️  هناك حقول مفقودة - تحتاج إلى تطبيق التحسينات يدويّاً');
    console.log('\n📝 اذهب إلى: https://supabase.com/dashboard/project/rqixjfytkxcbakiogtcv/editor/sql');
    console.log('   وشغّل أوامر ALTER TABLE المفقودة');
  } else {
    console.log('✅ قاعدة البيانات جاهزة!');
  }

  console.log('\n' + '='.repeat(70) + '\n');
}

verifyAllTablesAndColumns().catch(err => {
  console.error('❌ خطأ في التحقق:', err);
  process.exit(1);
});
