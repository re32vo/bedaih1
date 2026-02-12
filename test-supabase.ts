import { getAllDonors, upsertDonor, createDonation, getDonationsByEmail, deleteDonor, getDonorByEmail } from './server/supabase';

async function testLocalDB() {
  console.log('\n=== اختبار قاعدة البيانات المحلية ===\n');

  console.log('📋 جميع المتبرعين:');
  const donors = await getAllDonors();
  console.table(donors.map(d => ({
    الاسم: d.name,
    'البريد الإلكتروني': d.email,
    الهاتف: d.phone,
    'تاريخ الإنشاء': d.created_at ? new Date(d.created_at).toLocaleString('ar-SA') : ''
  })));

  console.log('\n💰 جميع التبرعات (أحدث 10):');
  const donations = await getDonationsByEmail(donors[0]?.email || '', 10);
  console.table(donations.map(d => ({
    'البريد الإلكتروني': d.email,
    المبلغ: d.amount + ' ريال',
    الطريقة: d.method,
    'رقم الإيصال': d.code,
    التاريخ: d.createdAt ? new Date(d.createdAt).toLocaleString('ar-SA') : ''
  })));

  console.log('\n🧪 اختبار إضافة متبرع موقعي...');
  const testEmail = `test-${Date.now()}@example.com`;
  await upsertDonor({ email: testEmail, name: 'متبرع تجريبي', phone: '0500000000' });
  const afterAdd = await getDonorByEmail(testEmail);
  console.log('✅ تم إضافة المتبرع التجريبي:', afterAdd?.email);

  console.log('\n🔄 اختبار تحديث المتبرع...');
  await upsertDonor({ email: testEmail, name: 'متبرع محدث', phone: '0511111111' });
  const afterUpdate = await getDonorByEmail(testEmail);
  console.log('✅ التحديث:', afterUpdate?.name, afterUpdate?.phone);

  console.log('\n🗑️ حذف البيانات التجريبية...');
  await deleteDonor(testEmail);
  console.log('✅ تم الحذف');

  console.log('\n=== انتهى الاختبار ===\n');
}

testLocalDB().catch(console.error);
