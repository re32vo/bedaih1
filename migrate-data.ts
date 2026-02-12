import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.join(__dirname, 'server');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ خطأ: يجب تعيين SUPABASE_URL و SUPABASE_ANON_KEY في ملف .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function readJSONFile(filename: string) {
  try {
    const filePath = path.join(serverDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (error) {
    console.log(`⚠️  الملف ${filename} غير موجود أو فارغ`);
    return [];
  }
}

async function migrateDonors() {
  console.log('\n📦 نقل المتبرعين...');
  const donors = await readJSONFile('donors.json');
  
  if (donors.length === 0) {
    console.log('  لا يوجد متبرعين للنقل');
    return;
  }
  
  for (const donor of donors) {
    const { error } = await supabase
      .from('donors')
      .upsert({
        id: donor.id,
        email: donor.email,
        name: donor.name,
        phone: donor.phone,
        created_at: donor.created_at,
        last_login_at: donor.last_login_at,
      });
      
    if (error) {
      console.error(`  ❌ خطأ في نقل المتبرع ${donor.email}:`, error.message);
    } else {
      console.log(`  ✅ تم نقل: ${donor.email}`);
    }
  }
}

async function migrateDonations() {
  console.log('\n📦 نقل التبرعات...');
  const donations = await readJSONFile('donations.json');
  
  if (donations.length === 0) {
    console.log('  لا يوجد تبرعات للنقل');
    return;
  }
  
  for (const donation of donations) {
    const { error } = await supabase
      .from('donations')
      .upsert({
        id: donation.id,
        email: donation.email,
        amount: donation.amount,
        method: donation.method,
        code: donation.code,
        created_at: donation.created_at,
      });
      
    if (error) {
      console.error(`  ❌ خطأ في نقل التبرع ${donation.code}:`, error.message);
    } else {
      console.log(`  ✅ تم نقل التبرع: ${donation.code}`);
    }
  }
}

async function migrateEmployees() {
  console.log('\n📦 نقل الموظفين...');
  const employees = await readJSONFile('employees.json');
  
  if (employees.length === 0) {
    console.log('  لا يوجد موظفين للنقل');
    return;
  }
  
  for (const employee of employees) {
    const { error } = await supabase
      .from('employees')
      .upsert({
        id: employee.id,
        email: employee.email,
        name: employee.name,
        role: employee.role,
        phone: employee.phone,
        notes: employee.notes,
        active: employee.active,
        permissions: employee.permissions || [],
        created_at: employee.created_at || new Date().toISOString(),
      });
      
    if (error) {
      console.error(`  ❌ خطأ في نقل الموظف ${employee.email}:`, error.message);
    } else {
      console.log(`  ✅ تم نقل: ${employee.name} (${employee.email})`);
    }
  }
}

async function migrateBeneficiaries() {
  console.log('\n📦 نقل المستفيدين...');
  const beneficiaries = await readJSONFile('beneficiaries.json');
  
  if (beneficiaries.length === 0) {
    console.log('  لا يوجد مستفيدين للنقل');
    return;
  }
  
  for (const beneficiary of beneficiaries) {
    const { error } = await supabase
      .from('beneficiaries')
      .insert({
        full_name: beneficiary.full_name || beneficiary.fullName,
        national_id: beneficiary.national_id || beneficiary.nationalId,
        address: beneficiary.address,
        phone: beneficiary.phone,
        email: beneficiary.email,
        assistance_type: beneficiary.assistance_type || beneficiary.assistanceType,
        created_at: beneficiary.created_at,
      });
      
    if (error && error.code !== '23505') { // تجاهل خطأ التكرار
      console.error(`  ❌ خطأ في نقل المستفيد ${beneficiary.full_name}:`, error.message);
    } else {
      console.log(`  ✅ تم نقل: ${beneficiary.full_name || beneficiary.fullName}`);
    }
  }
}

async function migrateJobApplications() {
  console.log('\n📦 نقل طلبات التوظيف...');
  const applications = await readJSONFile('job_applications.json');
  
  if (applications.length === 0) {
    console.log('  لا يوجد طلبات توظيف للنقل');
    return;
  }
  
  for (const app of applications) {
    const { error } = await supabase
      .from('job_applications')
      .insert({
        full_name: app.full_name || app.fullName,
        email: app.email,
        phone: app.phone,
        experience: app.experience,
        qualifications: app.qualifications,
        skills: app.skills,
        cv_url: app.cv_url || app.cvUrl,
        created_at: app.created_at,
      });
      
    if (error && error.code !== '23505') {
      console.error(`  ❌ خطأ في نقل طلب التوظيف ${app.full_name}:`, error.message);
    } else {
      console.log(`  ✅ تم نقل: ${app.full_name || app.fullName}`);
    }
  }
}

async function migrateContactMessages() {
  console.log('\n📦 نقل رسائل التواصل...');
  const messages = await readJSONFile('contact_messages.json');
  
  if (messages.length === 0) {
    console.log('  لا يوجد رسائل للنقل');
    return;
  }
  
  for (const msg of messages) {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: msg.name,
        email: msg.email,
        phone: msg.phone,
        message: msg.message,
        created_at: msg.created_at,
      });
      
    if (error && error.code !== '23505') {
      console.error(`  ❌ خطأ في نقل الرسالة من ${msg.name}:`, error.message);
    } else {
      console.log(`  ✅ تم نقل رسالة من: ${msg.name}`);
    }
  }
}

async function migrateVolunteers() {
  console.log('\n📦 نقل المتطوعين...');
  const volunteers = await readJSONFile('volunteers.json');
  
  if (volunteers.length === 0) {
    console.log('  لا يوجد متطوعين للنقل');
    return;
  }
  
  for (const volunteer of volunteers) {
    const { error } = await supabase
      .from('volunteers')
      .insert({
        full_name: volunteer.name || volunteer.full_name,
        email: volunteer.email,
        phone: volunteer.phone,
        skills: volunteer.experience || volunteer.skills || '',
        availability: volunteer.opportunity_title || volunteer.availability || '',
        created_at: volunteer.created_at,
      });
      
    if (error && error.code !== '23505') {
      console.error(`  ❌ خطأ في نقل المتطوع ${volunteer.name}:`, error.message);
    } else {
      console.log(`  ✅ تم نقل: ${volunteer.name || volunteer.full_name}`);
    }
  }
}

async function main() {
  console.log('🚀 بدء نقل البيانات من JSON إلى Supabase...\n');
  console.log(`📍 الاتصال بـ: ${supabaseUrl}`);
  
  try {
    await migrateDonors();
    await migrateDonations();
    await migrateEmployees();
    await migrateBeneficiaries();
    await migrateJobApplications();
    await migrateContactMessages();
    await migrateVolunteers();
    
    console.log('\n✅ تم نقل جميع البيانات بنجاح!');
    console.log('\n💡 يمكنك الآن التحقق من البيانات في لوحة Supabase');
  } catch (error) {
    console.error('\n❌ حدث خطأ أثناء النقل:', error);
    process.exit(1);
  }
}

main();
