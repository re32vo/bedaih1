import fs from "fs";
import path from "path";

export type Employee = {
  id: string;
  name: string;
  email: string;
  role?: string; // أي دور نصي حر - مثال: staff, manager, president, محاسب، إلخ
  phone?: string;
  notes?: string;
  active: boolean;
  permissions?: string[]; // e.g. beneficiaries:view, jobs:edit, settings:all
};

type EmployeeDB = { employees: Employee[] };

const filePath = path.join(process.cwd(), "server", "employees.json");

function ensureFile() {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify({ employees: [] }, null, 2), "utf8");
  }
}

export function getEmployees(): Employee[] {
  ensureFile();
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as EmployeeDB;
  return parsed.employees || [];
}

export function saveEmployees(list: Employee[]) {
  ensureFile();
  const data: EmployeeDB = { employees: list };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function findEmployeeByEmail(email: string): Employee | undefined {
  return getEmployees().find((emp) => emp.email.toLowerCase() === email.toLowerCase());
}

export function addEmployee(payload: Omit<Employee, "id">): Employee {
  const employees = getEmployees();
  const existing = employees.find((emp) => emp.email.toLowerCase() === payload.email.toLowerCase());
  if (existing) {
    throw new Error("يوجد موظف بهذا البريد الإلكتروني");
  }

  const newEmployee: Employee = {
    ...payload,
    role: payload.role || "",
    permissions: payload.permissions || ["beneficiaries:view", "jobs:view", "contact:view", "volunteers:view"],
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };

  employees.push(newEmployee);
  saveEmployees(employees);
  return newEmployee;
}

export function updateEmployeePermissions(id: string, data: Partial<Pick<Employee, "permissions" | "active" | "role" | "name" | "phone" | "notes">>) {
  const employees = getEmployees();
  const idx = employees.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("الموظف غير موجود");
  
  // تحديث الموظف مع الحفاظ على القيم الحالية إذا لم تُرسل قيم جديدة
  const updated = { ...employees[idx] };
  if (data.name !== undefined) updated.name = data.name;
  if (data.phone !== undefined) updated.phone = data.phone;
  if (data.notes !== undefined) updated.notes = data.notes;
  if (data.role !== undefined) updated.role = data.role;
  if (data.active !== undefined) updated.active = data.active;
  if (data.permissions !== undefined) updated.permissions = data.permissions;
  
  employees[idx] = updated;
  console.log('تحديث الموظف:', id, 'البيانات الجديدة:', updated);
  saveEmployees(employees);
  return employees[idx];
}

export function removeEmployee(id: string) {
  const employees = getEmployees();
  const idx = employees.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("الموظف غير موجود");
  const removed = employees.splice(idx, 1)[0];
  saveEmployees(employees);
  return removed;
}

export function ensurePresident() {
  const presidentEmail = process.env.PRESIDENT_EMAIL || process.env.HEAD_EMAIL;
  if (!presidentEmail) return;
  const employees = getEmployees();
  const existing = employees.find((e) => e.email.toLowerCase() === presidentEmail.toLowerCase());
  if (existing) return;
  const president: Employee = {
    id: `${Date.now()}-president`,
    name: "رئيس الجمعية",
    email: presidentEmail,
    role: "president",
    active: true,
    permissions: [
      "beneficiaries:view",
      "jobs:view",
      "contact:view",
      "volunteers:view",
      "analytics:view",
      "employees:add",
      "employees:remove",
      "employees:edit",
      "audit:view",
    ],
  };
  employees.push(president);
  saveEmployees(employees);
}
