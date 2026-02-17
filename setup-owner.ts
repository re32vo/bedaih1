import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupOwner() {
  const ownerEmail = "bedaihsa@gmail.com";
  const ownerName = "مالك الجمعية";
  
  console.log("🔧 جاري إعداد حساب المالك...\n");

  try {
    // 1. Create/Update Donor Account
    console.log("📝 1️⃣ إنشاء/تحديث حساب متبرع المالك...");
    
    const { data: existingDonor } = await supabase
      .from("donors")
      .select("*")
      .eq("email", ownerEmail)
      .maybeSingle();

    if (existingDonor) {
      console.log(`   ✓ حساب المتبرع موجود بالفعل: ${existingDonor.email}`);
    } else {
      const { data: newDonor, error: donorError } = await supabase
        .from("donors")
        .insert({
          email: ownerEmail,
          name: ownerName,
          phone: null,
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
        })
        .select();

      if (donorError) {
        console.error(`   ❌ خطأ في إنشاء حساب المتبرع:`, donorError.message);
        return;
      }
      console.log(`   ✓ تم إنشاء حساب المتبرع بنجاح`);
    }

    // 2. Create/Update Employee Account (President)
    console.log("\n📝 2️⃣ إنشاء/تحديث حساب موظف المالك (President)...");
    
    const { data: existingEmployee } = await supabase
      .from("employees")
      .select("*")
      .eq("email", ownerEmail)
      .maybeSingle();

    const allPermissions = [
      "beneficiaries:view",
      "beneficiaries:create",
      "beneficiaries:edit",
      "beneficiaries:delete",
      "jobs:view",
      "jobs:create",
      "jobs:edit",
      "jobs:delete",
      "contact:view",
      "contact:edit",
      "contact:delete",
      "volunteers:view",
      "volunteers:edit",
      "donations:view",
      "donations:edit",
      "employees:view",
      "employees:add",
      "employees:edit",
      "employees:remove",
      "audit:view",
      "audit:delete",
      "settings:manage",
      "*", // All permissions wildcard
    ];

    if (existingEmployee) {
      // Update existing employee to be president with all permissions
      const { error: updateError } = await supabase
        .from("employees")
        .update({
          role: "president",
          permissions: allPermissions,
          active: true,
        })
        .eq("email", ownerEmail);

      if (updateError) {
        console.error(`   ❌ خطأ في تحديث حساب الموظف:`, updateError.message);
        return;
      }
      console.log(`   ✓ تم تحديث حساب الموظف ليكون president بكل الصلاحيات`);
    } else {
      // Create new employee account as president
      const employeeId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      
      const { error: createError } = await supabase
        .from("employees")
        .insert({
          id: employeeId,
          email: ownerEmail,
          name: ownerName,
          role: "president",
          phone: null,
          notes: "مالك ورئيس الجمعية - جميع الصلاحيات",
          active: true,
          permissions: allPermissions,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (createError) {
        console.error(`   ❌ خطأ في إنشاء حساب الموظف:`, createError.message);
        return;
      }
      console.log(`   ✓ تم إنشاء حساب الموظف كـ president بكل الصلاحيات`);
    }

    // 3. Verify the setup
    console.log("\n✅ 3️⃣ التحقق من الإعداد...");
    
    const { data: donorVerify } = await supabase
      .from("donors")
      .select("*")
      .eq("email", ownerEmail)
      .maybeSingle();

    const { data: employeeVerify } = await supabase
      .from("employees")
      .select("*")
      .eq("email", ownerEmail)
      .maybeSingle();

    if (donorVerify) {
      console.log(`\n📊 حساب المتبرع:`);
      console.log(`   • البريد: ${donorVerify.email}`);
      console.log(`   • الاسم: ${donorVerify.name}`);
      console.log(`   • تاريخ الإنشاء: ${donorVerify.created_at}`);
    }

    if (employeeVerify) {
      console.log(`\n📊 حساب الموظف:`);
      console.log(`   • البريد: ${employeeVerify.email}`);
      console.log(`   • الاسم: ${employeeVerify.name}`);
      console.log(`   • الرتبة: ${employeeVerify.role}`);
      console.log(`   • نشط: ${employeeVerify.active}`);
      console.log(`   • الصلاحيات: ${employeeVerify.permissions?.length || 0}`);
      if (employeeVerify.permissions?.includes("*")) {
        console.log(`   • ✨ لديه جميع الصلاحيات (wildcard)`);
      }
    }

    console.log("\n✨ تم إعداد حساب المالك بنجاح!");
    console.log("\n🔐 يمكن تسجيل الدخول الآن باستخدام:");
    console.log(`   البريد الإلكتروني: ${ownerEmail}`);
    console.log(`   الرتبة: President (مالك)`);
    console.log(`   الصلاحيات: جميع الصلاحيات (كاملة)`);

  } catch (err) {
    console.error("\n❌ حدث خطأ:", err);
    process.exit(1);
  }
}

setupOwner();
