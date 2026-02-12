import { updateDonor, getDonorByEmail } from './server/supabase';

async function updateDonorName() {
  console.log('\n🔄 تحديث اسم المتبرع (local DB)...\n');

  const email = 're32vo@gmail.com';
  const newName = 'محمد العواضي';
  const newPhone = '0533170903';

  const before = await getDonorByEmail(email);
  console.log('📋 البيانات قبل التحديث:');
  console.log({
    الاسم: before?.name,
    'البريد الإلكتروني': before?.email,
    الهاتف: before?.phone
  });

  const updated = await updateDonor(email, { name: newName, phone: newPhone });

  if (!updated) {
    console.error('❌ لم يتم العثور على المتبرع للتحديث');
  } else {
    console.log('\n✅ تم التحديث بنجاح!\n');
    console.log('📋 البيانات بعد التحديث:');
    console.log({
      الاسم: updated.name,
      'البريد الإلكتروني': updated.email,
      الهاتف: updated.phone
    });
  }

  console.log('\n✨ انتهى التحديث!\n');
}

updateDonorName().catch(console.error);
