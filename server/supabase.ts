import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

// Ensure correct filesystem paths on all platforms (Windows vs POSIX).
const DATA_DIR = path.dirname(fileURLToPath(import.meta.url));

function filePath(table: string) {
  return path.join(DATA_DIR, `${table}.json`);
}

async function readTable(table: string) {
  try {
    const p = filePath(table);
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

async function writeTable(table: string, data: any) {
  const p = filePath(table);
  await fs.writeFile(p, JSON.stringify(data, null, 2), "utf-8");
}

function normalizeEmail(email?: string) {
  return (email || "").toLowerCase();
}

const ALL_EMPLOYEE_PERMISSIONS = [
  "beneficiaries:view",
  "jobs:view",
  "contact:view",
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

async function ensureOwnerFullPermissions() {
  const ownerEmail = getOwnerEmail();
  if (!ownerEmail) return;
  const t = await readTable("employees");
  const matches = t.filter((e: any) => normalizeEmail(e.email) === ownerEmail);
  if (matches.length === 0) return;

  const primary = matches[0];
  const mergedPermissions = Array.from(
    new Set([...(primary.permissions || []), ...ALL_EMPLOYEE_PERMISSIONS])
  );

  const normalized = {
    ...primary,
    email: ownerEmail,
    role: "president",
    active: true,
    permissions: mergedPermissions,
  };

  const filtered = t.filter((e: any) => normalizeEmail(e.email) !== ownerEmail);
  filtered.unshift(normalized);
  await writeTable("employees", filtered);
}

// Use local JSON adapter only. Supabase integration removed for local development.
const useSupabase = false;

// --- Exported functions (file-backed, used when Supabase is not configured) ---
export async function getDonorByEmail(email: string) {
  const donors = await readTable("donors");
  return donors.find((d: any) => normalizeEmail(d.email) === normalizeEmail(email));
}

export async function upsertDonor(donor: { email: string; name?: string; phone?: string; lastLogin?: boolean }) {
  const email = normalizeEmail(donor.email);
  const donors = await readTable("donors");
  const idx = donors.findIndex((d: any) => normalizeEmail(d.email) === email);

  if (idx !== -1) {
    const existing = donors[idx];
    const updates: any = { ...existing };
    updates.last_login_at = donor.lastLogin ? new Date().toISOString() : existing.last_login_at;
    if (donor.name !== undefined) updates.name = donor.name && donor.name !== "متبرع" ? donor.name : existing.name;
    if (donor.phone !== undefined) updates.phone = donor.phone && donor.phone.trim() !== "" ? donor.phone : existing.phone;
    donors[idx] = { ...existing, ...updates };
    await writeTable("donors", donors);
    return donors[idx];
  }

  const newDonor = {
    id: randomUUID(),
    email,
    name: donor.name || null,
    phone: donor.phone || null,
    created_at: new Date().toISOString(),
    last_login_at: donor.lastLogin ? new Date().toISOString() : null,
  };
  donors.push(newDonor);
  await writeTable("donors", donors);
  return newDonor;
}

export async function getAllDonors() {
  const donors = await readTable("donors");
  return donors.sort((a: any, b: any) => (b.created_at || "").localeCompare(a.created_at || ""));
}

export async function updateDonor(email: string, updates: { name?: string; phone?: string; newEmail?: string }) {
  const donors = await readTable("donors");
  const idx = donors.findIndex((d: any) => normalizeEmail(d.email) === normalizeEmail(email));
  if (idx === -1) return null;

  if (updates.newEmail) {
    // update donations emails
    const donations = await readTable("donations");
    for (const d of donations) {
      if (normalizeEmail(d.email) === normalizeEmail(email)) d.email = normalizeEmail(updates.newEmail);
    }
    await writeTable("donations", donations);
    donors[idx].email = normalizeEmail(updates.newEmail);
  }
  if (updates.name !== undefined) donors[idx].name = updates.name;
  if (updates.phone !== undefined) donors[idx].phone = updates.phone;
  await writeTable("donors", donors);
  return donors[idx];
}

export async function deleteDonor(email: string) {
  const donors = await readTable("donors");
  const newDonors = donors.filter((d: any) => normalizeEmail(d.email) !== normalizeEmail(email));
  await writeTable("donors", newDonors);

  const donations = await readTable("donations");
  const remaining = donations.filter((d: any) => normalizeEmail(d.email) !== normalizeEmail(email));
  await writeTable("donations", remaining);
  return true;
}

export async function createDonation(donation: { email: string; amount: number; method: string; code?: string }) {
  const donations = await readTable("donations");
  const record = {
    id: randomUUID(),
    email: normalizeEmail(donation.email),
    amount: Number(donation.amount) || 0,
    method: donation.method,
    code: donation.code || null,
    created_at: new Date().toISOString(),
  };
  donations.push(record);
  await writeTable("donations", donations);
  return record;
}

export async function getDonationsByEmail(email: string, limit = 20) {
  const donations = await readTable("donations");
  const filtered = donations
    .filter((d: any) => normalizeEmail(d.email) === normalizeEmail(email))
    .sort((a: any, b: any) => (b.created_at || "").localeCompare(a.created_at || ""))
    .slice(0, limit)
    .map((d: any) => ({ id: d.id, email: d.email, amount: d.amount, method: d.method, code: d.code, createdAt: d.created_at }));
  return filtered;
}

export async function logAuditToSupabase(entry: { actor: string; action: string; details?: any }) {
  const logs = await readTable("audit_logs");
  const rec = { id: randomUUID(), actor: entry.actor, action: entry.action, details: entry.details || {}, timestamp: new Date().toISOString() };
  logs.push(rec);
  await writeTable("audit_logs", logs);
  return rec;
}

export async function createBeneficiary(beneficiary: any) {
  const table = await readTable("beneficiaries");
  const rec = { id: randomUUID(), full_name: beneficiary.fullName, national_id: beneficiary.nationalId, address: beneficiary.address, phone: beneficiary.phone, email: beneficiary.email, assistance_type: beneficiary.assistanceType, created_at: new Date().toISOString() };
  table.push(rec);
  await writeTable("beneficiaries", table);
  return rec;
}

export async function getBeneficiariesCount() {
  const t = await readTable("beneficiaries");
  return t.length;
}

export async function getRecentBeneficiaries(limit = 10) {
  try {
    const t = await readTable("beneficiaries");
    if (!Array.isArray(t)) return [];
    
    return t
      .sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, limit)
      .filter((item: any) => item && typeof item === 'object')
      .map((item: any) => {
        return {
          id: String(item.id || ''),
          fullName: String(item.full_name || item.fullName || ''),
          nationalId: String(item.national_id || item.nationalId || ''),
          address: String(item.address || ''),
          phone: String(item.phone || ''),
          email: String(item.email || ''),
          assistanceType: String(item.assistance_type || item.assistanceType || ''),
          createdAt: String(item.created_at || item.createdAt || ''),
          type: 'beneficiary'
        };
      });
  } catch (err) {
    console.error("Error in getRecentBeneficiaries:", err);
    return [];
  }
}

export async function createJobApplication(application: any) {
  const t = await readTable("job_applications");
  const rec = { id: randomUUID(), full_name: application.fullName, email: application.email, phone: application.phone, experience: application.experience, qualifications: application.qualifications, skills: application.skills, cv_url: application.cvUrl, created_at: new Date().toISOString() };
  t.push(rec);
  await writeTable("job_applications", t);
  return rec;
}

export async function getJobApplicationsCount() {
  const t = await readTable("job_applications");
  return t.length;
}

export async function getRecentJobApplications(limit = 10) {
  try {
    const t = await readTable("job_applications");
    if (!Array.isArray(t)) return [];
    
    return t
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, limit)
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        id: String(item.id || ''),
        fullName: String(item.full_name || item.fullName || ''),
        email: String(item.email || ''),
        phone: String(item.phone || ''),
        experience: String(item.experience || ''),
        qualifications: String(item.qualifications || ''),
        skills: String(item.skills || ''),
        cvUrl: String(item.cv_url || item.cvUrl || ''),
        createdAt: String(item.created_at || item.createdAt || ''),
        type: 'job'
      }));
  } catch (err) {
    console.error("Error in getRecentJobApplications:", err);
    return [];
  }
}

export async function createContactMessage(message: any) {
  const t = await readTable("contact_messages");
  const rec = { id: randomUUID(), name: message.name, email: message.email, phone: message.phone, message: message.message, created_at: new Date().toISOString() };
  t.push(rec);
  await writeTable("contact_messages", t);
  return rec;
}

export async function getContactMessagesCount() {
  const t = await readTable("contact_messages");
  return t.length;
}

export async function getRecentContactMessages(limit = 10) {
  try {
    const t = await readTable("contact_messages");
    if (!Array.isArray(t)) return [];
    
    return t
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, limit)
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        id: String(item.id || ''),
        name: String(item.name || ''),
        email: String(item.email || ''),
        phone: String(item.phone || ''),
        message: String(item.message || ''),
        createdAt: String(item.created_at || item.createdAt || ''),
        type: 'contact'
      }));
  } catch (err) {
    console.error("Error in getRecentContactMessages:", err);
    return [];
  }
}

export async function createVolunteer(volunteer: any) {
  const t = await readTable("volunteers");
  const rec = { id: randomUUID(), name: volunteer.name, email: volunteer.email, phone: volunteer.phone, experience: volunteer.experience, opportunity_title: volunteer.opportunityTitle, created_at: new Date().toISOString() };
  t.push(rec);
  await writeTable("volunteers", t);
  return rec;
}

export async function getVolunteersCount() {
  const t = await readTable("volunteers");
  return t.length;
}

export async function getRecentVolunteers(limit = 10) {
  try {
    const t = await readTable("volunteers");
    if (!Array.isArray(t)) return [];
    
    return t
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, limit)
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        id: String(item.id || ''),
        name: String(item.name || ''),
        email: String(item.email || ''),
        phone: String(item.phone || ''),
        experience: String(item.experience || ''),
        opportunityTitle: String(item.opportunity_title || item.opportunityTitle || ''),
        createdAt: String(item.created_at || item.createdAt || ''),
        type: 'volunteer'
      }));
  } catch (err) {
    console.error("Error in getRecentVolunteers:", err);
    return [];
  }
}

export async function getEmployeeByEmail(email: string) {
  const t = await readTable("employees");
  const ownerEmail = getOwnerEmail();
  const normalized = normalizeEmail(email);
  if (normalized && normalized === ownerEmail) {
    await ensureOwnerFullPermissions();
  }
  const refreshed = normalized === ownerEmail ? await readTable("employees") : t;
  return refreshed.find((e: any) => normalizeEmail(e.email) === normalized);
}

export async function getAllEmployees() {
  const t = await readTable("employees");
  return t.sort((a: any, b: any) => (b.created_at || "").localeCompare(a.created_at || ""));
}

export async function createEmployee(employee: any) {
  const t = await readTable("employees");
  const rec = { id: employee.id || randomUUID(), email: normalizeEmail(employee.email), name: employee.name, role: employee.role || "", phone: employee.phone || null, notes: employee.notes || null, active: employee.active !== false, permissions: employee.permissions || [], created_at: new Date().toISOString() };
  t.push(rec);
  await writeTable("employees", t);
  return rec;
}

export async function updateEmployee(id: string, updates: any) {
  const t = await readTable("employees");
  const idx = t.findIndex((e: any) => e.id === id);
  if (idx === -1) return null;
  const updated = { ...t[idx], ...updates };
  t[idx] = updated;
  await writeTable("employees", t);
  return updated;
}

export async function deleteEmployee(id: string) {
  const t = await readTable("employees");
  const remaining = t.filter((e: any) => e.id !== id);
  await writeTable("employees", remaining);
  return true;
}
export async function storeOTPToken(email: string, code: string, expiresAt: Date, metadata?: any) {
  const t = await readTable("otp_tokens");
  const rec: any = { id: randomUUID(), email: normalizeEmail(email), code, expires_at: expiresAt.toISOString(), used: false, created_at: new Date().toISOString() };
  if (metadata) rec.metadata = metadata;
  t.push(rec);
  await writeTable("otp_tokens", t);
  return rec;
}

export async function verifyOTPToken(email: string, code: string) {
  const t = await readTable("otp_tokens");
  const now = new Date().toISOString();
  const idx = t.findIndex((r: any) => normalizeEmail(r.email) === normalizeEmail(email) && r.code === code && !r.used && (r.expires_at || "") > now);
  if (idx === -1) return null;
  const token = t[idx];
  token.used = true;
  await writeTable("otp_tokens", t);
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
