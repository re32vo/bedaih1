import { createClient } from '@supabase/supabase-js';
import { randomUUID } from "crypto";

// إنشاء Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

function normalizeEmail(email?: string) {
  return (email || "").toLowerCase();
}

const ALL_EMPLOYEE_PERMISSIONS = [
  "beneficiaries:view",
  "jobs:view",
  "contact:view",
  "volunteers:view",
  "analytics:view",
  "employees:add",
  "employees:remove",
  "employees:edit",
  "manage_donors",
  "audit:view",
];

function getOwnerEmail() {
  return normalizeEmail(process.env.PRESIDENT_EMAIL || process.env.HEAD_EMAIL || "bedaihsa@gmail.com");
}

function normalizePermissions(value: any): string[] {
  if (Array.isArray(value)) {
    return value.filter((perm) => typeof perm === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((perm) => typeof perm === "string") : [];
    } catch {
      return [];
    }
  }

  return [];
}

async function ensureOwnerFullPermissions() {
  if (!supabase) return;
  
  const ownerEmail = getOwnerEmail();
  if (!ownerEmail) return;
  
  const { data: employees } = await supabase
    .from('employees')
    .select('*')
    .eq('email', ownerEmail);
    
  if (!employees || employees.length === 0) return;

  const primary = employees[0];
  const currentPermissions = normalizePermissions(primary.permissions);
  const mergedPermissions = Array.from(
    new Set([...currentPermissions, ...ALL_EMPLOYEE_PERMISSIONS])
  );

  await supabase
    .from('employees')
    .update({
      role: "president",
      active: true,
      permissions: mergedPermissions,
    })
    .eq('email', ownerEmail);
}

// --- Exported functions (Supabase-backed) ---
export async function getDonorByEmail(email: string) {
  if (!supabase) return null;
  
  const { data } = await supabase
    .from('donors')
    .select('*')
    .eq('email', normalizeEmail(email))
    .maybeSingle();
    
  return data;
}

export async function upsertDonor(donor: { email: string; name?: string; phone?: string; lastLogin?: boolean }) {
  if (!supabase) return null;
  
  const email = normalizeEmail(donor.email);
  
  const { data: existing } = await supabase
    .from('donors')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    const updates: any = {};
    if (donor.lastLogin) updates.last_login_at = new Date().toISOString();
    if (donor.name !== undefined && donor.name && donor.name !== "متبرع") updates.name = donor.name;
    if (donor.phone !== undefined && donor.phone && donor.phone.trim() !== "") updates.phone = donor.phone;
    
    const { data } = await supabase
      .from('donors')
      .update(updates)
      .eq('email', email)
      .select();
      
    return data?.[0] || null;
  }

  const { data } = await supabase
    .from('donors')
    .insert({
      email,
      name: donor.name || null,
      phone: donor.phone || null,
      last_login_at: donor.lastLogin ? new Date().toISOString() : null,
    })
    .select();
    
  return data?.[0] || null;
}

export async function getAllDonors() {
  if (!supabase) return [];
  
  const { data } = await supabase
    .from('donors')
    .select('*')
    .order('created_at', { ascending: false });
    
  return data || [];
}

export async function updateDonor(email: string, updates: { name?: string; phone?: string; newEmail?: string }) {
  if (!supabase) return null;
  
  const oldEmail = normalizeEmail(email);
  
  if (updates.newEmail) {
    const newEmail = normalizeEmail(updates.newEmail);
    
    // التحقق من أن البريد الجديد غير مستخدم
    const { data: existing } = await supabase
      .from('donors')
      .select('id')
      .eq('email', newEmail)
      .maybeSingle();
      
    if (existing) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }
    
    // Update donations emails
    const { error: donationsError } = await supabase
      .from('donations')
      .update({ email: newEmail })
      .eq('email', oldEmail);
      
    if (donationsError) {
      console.error('Error updating donations:', donationsError);
      throw new Error('فشل تحديث التبرعات: ' + donationsError.message);
    }
      
    // Update donor email
    const updateData: any = { email: newEmail };
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    
    const { data, error } = await supabase
      .from('donors')
      .update(updateData)
      .eq('email', oldEmail)
      .select();
      
    if (error) {
      console.error('Error updating donor:', error);
      throw new Error('فشل تحديث البريد: ' + error.message);
    }
      
    return data?.[0] || null;
  }
  
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  
  const { data, error } = await supabase
    .from('donors')
    .update(updateData)
    .eq('email', oldEmail)
    .select();
    
  if (error) {
    console.error('Error updating donor profile:', error);
    throw new Error('فشل تحديث البيانات: ' + error.message);
  }
    
  return data?.[0] || null;
}

export async function deleteDonor(email: string) {
  if (!supabase) return true;
  
  const normalizedEmail = normalizeEmail(email);
  
  // Delete donations first
  await supabase
    .from('donations')
    .delete()
    .eq('email', normalizedEmail);
    
  // Delete donor
  await supabase
    .from('donors')
    .delete()
    .eq('email', normalizedEmail);
    
  return true;
}

export async function createDonation(donation: { email: string; amount: number; method: string; code?: string }) {
  if (!supabase) return null;
  
  const { data } = await supabase
    .from('donations')
    .insert({
      email: normalizeEmail(donation.email),
      amount: Number(donation.amount) || 0,
      method: donation.method,
      code: donation.code || null,
    })
    .select();
    
  return data?.[0] || null;
}

export async function getDonationsByEmail(email: string, limit = 20) {
  if (!supabase) return [];
  
  const { data } = await supabase
    .from('donations')
    .select('*')
    .eq('email', normalizeEmail(email))
    .order('created_at', { ascending: false })
    .limit(limit);
    
  return (data || []).map((d: any) => ({
    id: d.id,
    email: d.email,
    amount: d.amount,
    method: d.method,
    code: d.code,
    createdAt: d.created_at
  }));
}

export async function logAuditToSupabase(entry: { actor: string; action: string; details?: any }) {
  if (!supabase) return null;
  
  const { data } = await supabase
    .from('audit_log')
    .insert({
      action: entry.action,
      user_email: entry.actor,
      details: entry.details || {},
    })
    .select();
    
  return data?.[0] || null;
}

export async function createBeneficiary(beneficiary: any) {
  if (!supabase) {
    throw new Error('Supabase غير مهيأ - تحقق من SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY');
  }
  
  // التحقق من وجود الرقم الوطني مسبقاً
  if (beneficiary.nationalId) {
    const { data: existing, error: checkError } = await supabase
      .from('beneficiaries')
      .select('id')
      .eq('national_id', beneficiary.nationalId)
      .maybeSingle();
    
    if (existing) {
      throw new Error('الرقم الوطني مسجل بالفعل في النظام');
    }
  }
  
  const { data, error } = await supabase
    .from('beneficiaries')
    .insert({
      full_name: beneficiary.fullName,
      national_id: beneficiary.nationalId,
      address: beneficiary.address,
      phone: beneficiary.phone,
      email: beneficiary.email,
      assistance_type: beneficiary.assistanceType,
    })
    .select();

  if (error) {
    throw new Error(`فشل حفظ طلب المستفيد: ${error.message}`);
  }
  if (!data || data.length === 0) {
    throw new Error('فشل حفظ طلب المستفيد: لم يتم إرجاع بيانات من قاعدة البيانات');
  }
    
  return data[0];
}

export async function getBeneficiariesCount() {
  if (!supabase) return 0;
  
  const { count } = await supabase
    .from('beneficiaries')
    .select('*', { count: 'exact', head: true });
    
  return count || 0;
}

export async function getRecentBeneficiaries(limit = 10) {
  try {
    if (!supabase) return [];
    
    const { data } = await supabase
      .from('beneficiaries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (!data) return [];
    
    return data.map((item: any) => ({
      id: String(item.id || ''),
      fullName: String(item.full_name || ''),
      nationalId: String(item.national_id || ''),
      address: String(item.address || ''),
      phone: String(item.phone || ''),
      email: String(item.email || ''),
      assistanceType: String(item.assistance_type || ''),
      createdAt: String(item.created_at || ''),
      type: 'beneficiary'
    }));
  } catch (err) {
    console.error("Error in getRecentBeneficiaries:", err);
    return [];
  }
}

export async function createJobApplication(application: any) {
  if (!supabase) {
    throw new Error('Supabase غير مهيأ - تحقق من SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY');
  }
  
  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      full_name: application.fullName,
      email: application.email.toLowerCase(),
      phone: application.phone,
      experience: application.experience,
      qualifications: application.qualifications,
      skills: application.skills,
      cv_url: application.cvUrl || null,
    })
    .select();

  if (error) {
    throw new Error(`فشل حفظ الطلب الوظيفي: ${error.message}`);
  }
  if (!data || data.length === 0) {
    throw new Error('فشل حفظ الطلب الوظيفي: لم يتم إرجاع بيانات من قاعدة البيانات');
  }
    
  return data[0];
}

export async function getJobApplicationsCount() {
  if (!supabase) return 0;
  
  const { count } = await supabase
    .from('job_applications')
    .select('*', { count: 'exact', head: true });
    
  return count || 0;
}

export async function getRecentJobApplications(limit = 10) {
  try {
    if (!supabase) return [];
    
    const { data } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (!data) return [];
    
    return data.map((item) => ({
      id: String(item.id || ''),
      fullName: String(item.full_name || ''),
      email: String(item.email || ''),
      phone: String(item.phone || ''),
      experience: String(item.experience || ''),
      qualifications: String(item.qualifications || ''),
      skills: String(item.skills || ''),
      cvUrl: String(item.cv_url || ''),
      createdAt: String(item.created_at || ''),
      type: 'job'
    }));
  } catch (err) {
    console.error("Error in getRecentJobApplications:", err);
    return [];
  }
}

export async function createContactMessage(message: any) {
  if (!supabase) {
    throw new Error('Supabase غير مهيأ - تحقق من SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY');
  }
  
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name: message.name,
      email: message.email.toLowerCase(),
      phone: message.phone,
      message: message.message,
    })
    .select();

  if (error) {
    throw new Error(`فشل حفظ رسالة التواصل: ${error.message}`);
  }
  if (!data || data.length === 0) {
    throw new Error('فشل حفظ رسالة التواصل: لم يتم إرجاع بيانات من قاعدة البيانات');
  }
    
  return data[0];
}

export async function getContactMessagesCount() {
  if (!supabase) return 0;
  
  const { count } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true });
    
  return count || 0;
}

export async function getRecentContactMessages(limit = 10) {
  try {
    if (!supabase) return [];
    
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (!data) return [];
    
    return data.map((item) => ({
      id: String(item.id || ''),
      name: String(item.name || ''),
      email: String(item.email || ''),
      phone: String(item.phone || ''),
      message: String(item.message || ''),
      createdAt: String(item.created_at || ''),
      type: 'contact'
    }));
  } catch (err) {
    console.error("Error in getRecentContactMessages:", err);
    return [];
  }
}

export async function createVolunteer(volunteer: any) {
  if (!supabase) {
    throw new Error('Supabase غير مهيأ - تحقق من SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY');
  }
  
  const { data, error } = await supabase
    .from('volunteers')
    .insert({
      full_name: volunteer.name,
      email: volunteer.email.toLowerCase(),
      phone: volunteer.phone,
      skills: volunteer.experience || '',
      availability: volunteer.opportunityTitle || '',
    })
    .select();

  if (error) {
    throw new Error(`فشل حفظ طلب التطوع: ${error.message}`);
  }
  if (!data || data.length === 0) {
    throw new Error('فشل حفظ طلب التطوع: لم يتم إرجاع بيانات من قاعدة البيانات');
  }
    
  return data[0];
}

export async function getVolunteersCount() {
  if (!supabase) return 0;
  
  const { count } = await supabase
    .from('volunteers')
    .select('*', { count: 'exact', head: true });
    
  return count || 0;
}

export async function getRecentVolunteers(limit = 10) {
  try {
    if (!supabase) return [];
    
    const { data } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (!data) return [];
    
    return data.map((item) => ({
      id: String(item.id || ''),
      name: String(item.full_name || ''),
      email: String(item.email || ''),
      phone: String(item.phone || ''),
      experience: String(item.skills || ''),
      opportunityTitle: String(item.availability || ''),
      createdAt: String(item.created_at || ''),
      type: 'volunteer'
    }));
  } catch (err) {
    console.error("Error in getRecentVolunteers:", err);
    return [];
  }
}

export async function getEmployeeByEmail(email: string) {
  if (!supabase) return null;
  
  const ownerEmail = getOwnerEmail();
  const normalized = normalizeEmail(email);
  
  if (normalized && normalized === ownerEmail) {
    await ensureOwnerFullPermissions();
  }
  
  const { data } = await supabase
    .from('employees')
    .select('*')
    .eq('email', normalized)
    .maybeSingle();
    
  return data;
}

export async function getAllEmployees() {
  if (!supabase) return [];
  
  const { data } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });
    
  return data || [];
}

export async function createEmployee(employee: any) {
  if (!supabase) return null;
  
  const { data } = await supabase
    .from('employees')
    .insert({
      id: employee.id || randomUUID(),
      email: normalizeEmail(employee.email),
      name: employee.name,
      role: employee.role || "",
      phone: employee.phone || null,
      notes: employee.notes || null,
      active: employee.active !== false,
      permissions: employee.permissions || [],
    })
    .select();
    
  return data?.[0] || null;
}

export async function updateEmployee(id: string, updates: any) {
  if (!supabase) return null;
  
  const { data } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id)
    .select();
    
  return data?.[0] || null;
}

export async function deleteEmployee(id: string) {
  if (!supabase) return true;
  
  await supabase
    .from('employees')
    .delete()
    .eq('id', id);
    
  return true;
}
export async function storeOTPToken(email: string, code: string, expiresAt: Date, metadata?: any) {
  if (!supabase) return null;
  
  const insertData: any = {
    email: normalizeEmail(email),
    code,
    expires_at: expiresAt.toISOString(),
    used: false,
  };
  
  const { data } = await supabase
    .from('otp_tokens')
    .insert(insertData)
    .select();
    
  return data?.[0] || null;
}

export async function verifyOTPToken(email: string, code: string) {
  if (!supabase) return null;
  
  const now = new Date().toISOString();
  
  const { data: tokens } = await supabase
    .from('otp_tokens')
    .select('*')
    .eq('email', normalizeEmail(email))
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', now)
    .limit(1);
    
  if (!tokens || tokens.length === 0) return null;
  
  const token = tokens[0];
  
  // Mark as used
  await supabase
    .from('otp_tokens')
    .update({ used: true })
    .eq('id', token.id);
    
  return token;
}

export async function ensurePresidentExists() {
  const presidentEmail = getOwnerEmail();
  if (!presidentEmail) return;

  const existing = await getEmployeeByEmail(presidentEmail);
  if (existing) {
    await ensureOwnerFullPermissions();
    return;
  }

  const presidentId = `${Date.now()}-president`;
  await createEmployee({
    id: presidentId,
    email: presidentEmail,
    name: "رئيس الجمعية",
    role: "president",
    phone: "",
    notes: "حساب الرئيس - تم إنشاؤه تلقائياً",
    active: true,
    permissions: ALL_EMPLOYEE_PERMISSIONS,
  });

  console.log(`✅ تم إنشاء حساب الرئيس: ${presidentEmail}`);
}
