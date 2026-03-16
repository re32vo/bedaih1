import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Plus, Users, Save, Trash2, Edit, LogOut, Home, Search, Filter, UserCheck, UserX, Shield } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  notes?: string;
  active: boolean;
  permissions?: string[];
}

const AVAILABLE_PERMISSIONS = [
  { id: "beneficiaries:view", label: "عرض طلبات المستفيدين" },
  { id: "jobs:view", label: "عرض الطلبات الوظيفية" },
  { id: "contact:view", label: "عرض رسائل التواصل" },
  { id: "volunteers:view", label: "عرض طلبات المتطوعين" },
  { id: "analytics:view", label: "عرض الإحصاءات والتقارير" },
  { id: "employees:add", label: "إضافة موظفين جدد" },
  { id: "employees:remove", label: "حذف موظفين" },
  { id: "employees:edit", label: "تعديل بيانات الموظفين" },
  { id: "manage_donors", label: "إدارة العملاء" },
  { id: "audit:view", label: "عرض سجلات النظام" },
];

export default function Admin() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isPresident, setIsPresident] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    notes: "",
    permissions: ["beneficiaries:view", "jobs:view", "contact:view", "volunteers:view"] as string[],
    sendWelcomeEmail: true,
  });

  useEffect(() => {
    verifyAccess();
  }, []);

  const verifyAccess = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-token", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        sessionStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      
      if (!data.success) {
        sessionStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
      }

      setCurrentUser(data);
      setIsPresident(data.role === "president");
      setUserPermissions(data.permissions || []);
      setAuthToken(token);
      
      const canAccess = data.role === "president" || (data.permissions || []).some((p: string) => p.startsWith("employees:"));
      if (!canAccess) {
        toast({ title: "غير مسموح", description: "لا يمكنك الوصول لهذه الصفحة", variant: "destructive" });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
        return;
      }
      fetchEmployees(token);
    } catch (err) {
      console.error("Error verifying access:", err);
      sessionStorage.removeItem("authToken");
      window.location.href = "/login";
    }
  };

  const hasPermission = (perm: string) => isPresident || userPermissions.includes(perm);

  const fetchEmployees = async (tokenOverride?: string | null) => {
    const token = tokenOverride ?? authToken ?? sessionStorage.getItem("authToken");
    try {
      const res = await fetch("/api/employees", {
        headers: token ? { "Authorization": `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (err) {
      toast({ title: "خطأ", description: "فشل جلب الموظفين", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = authToken || sessionStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, active: true }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "خطأ إضافة موظف");
      }

      // إرسال بريد ترحيبي إذا كان الخيار مفعلاً
      if ((form as any).sendWelcomeEmail) {
        try {
          await fetch("/api/email/welcome", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ email: form.email, name: form.name, role: form.role }),
          });
        } catch (emailErr) {
          console.error("خطأ إرسال البريد الترحيبي:", emailErr);
        }
      }

      toast({ title: "نجح", description: "تم إضافة الموظف بنجاح" });
      setForm({ name: "", email: "", role: "", phone: "", notes: "", permissions: [], sendWelcomeEmail: true });
      setDialogOpen(false);
      fetchEmployees();
    } catch (err) {
      toast({ title: "خطأ", description: err instanceof Error ? err.message : "خطأ إضافة موظف", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (employee: Employee) => {
    const token = authToken || sessionStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    try {
      const updatePayload: any = {
        name: employee.name,
        active: employee.active,
        permissions: employee.permissions || [],
      };
      
      // إضافة الحقول الاختيارية فقط إذا كانت موجودة وليست فارغة
      if (employee.role && employee.role.trim()) {
        updatePayload.role = employee.role;
      }
      if (employee.phone && employee.phone.trim()) {
        updatePayload.phone = employee.phone;
      }
      if (employee.notes && employee.notes.trim()) {
        updatePayload.notes = employee.notes;
      }
      
      const res = await fetch(`/api/employees/${employee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "خطأ تحديث موظف");
      }

      const updated = await res.json();
      
      toast({ title: "نجح", description: "تم تحديث الموظف بنجاح" });
      setEditingEmployee(null);
      
      const refreshRes = await fetch('/api/employees', {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setEmployees(refreshData.employees || []);
      }
    } catch (err) {
      toast({ title: "خطأ", description: err instanceof Error ? err.message : "خطأ تحديث موظف", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;

    const token = authToken || sessionStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("خطأ حذف موظف");

      toast({ title: "نجح", description: "تم حذف الموظف بنجاح" });
      setEmployees(prev => prev.filter(e => e.id !== employeeId));
      fetchEmployees();
    } catch (err) {
      toast({ title: "خطأ", description: err instanceof Error ? err.message : "خطأ حذف موظف", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const setEditingWithClone = (emp: Employee | null) => {
    if (!emp) {
      setEditingEmployee(null);
      return;
    }
    setEditingEmployee({ ...emp, permissions: emp.permissions ? [...emp.permissions] : [] });
  };

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = searchQuery ? 
      (e.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       e.email?.toLowerCase().includes(searchQuery.toLowerCase())) : true;
    const matchesRole = roleFilter === 'all' ? true : e.role === roleFilter;
    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    // رئيس الجمعية يظهر أولاً
    if (a.role === 'president' && b.role !== 'president') return -1;
    if (a.role !== 'president' && b.role === 'president') return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-white text-black py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-black">إدارة الموظفين</h1>
              <p className="text-black">مرحباً {currentUser.name} • {employees.length} موظف</p>
            </div>
            <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-2 lg:flex gap-2 sm:gap-3">
              <Button variant="outline" onClick={() => window.location.href = "/dashboard"} className="w-full lg:w-auto text-black hover:text-black">
                <Home className="w-4 h-4 ml-2" />لوحة التحكم
              </Button>
              <Button variant="outline" onClick={() => { sessionStorage.removeItem("authToken"); window.location.href = "/login"; }} className="w-full lg:w-auto text-black hover:text-black">
                <LogOut className="w-4 h-4 ml-2" />تسجيل الخروج
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm font-semibold mb-1">عدد الموظفين</p>
                <p className="text-3xl font-bold text-black">{employees.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 bg-white border border-blue-200 shadow-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-base bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm font-semibold mb-1">نشط</p>
                <p className="text-3xl font-bold text-black">{employees.filter(e => e.active).length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-green-600 bg-white border border-green-200 shadow-lg">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-base bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm font-semibold mb-1">غير نشط</p>
                <p className="text-3xl font-bold text-black">{employees.filter(e => !e.active).length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-red-600 bg-white border border-red-200 shadow-lg">
                <UserX className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-base bg-white border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm font-semibold mb-1">رؤساء</p>
                <p className="text-3xl font-bold text-black">{employees.filter(e => e.role === 'president').length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-black bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </div>

        {(isPresident || hasPermission("employees:add")) && (
          <motion.div className="card-base mb-8 bg-white border border-gray-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-black">إضافة موظف جديد</h2>
              <p className="text-black/80 text-sm">سيتم إنشاء حساب للموظف وإرسال بيانات الدخول</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white shadow-lg">
                  <Plus className="w-4 h-4" />
                  إضافة موظف
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" dir="rtl">
                <button
                  onClick={() => setDialogOpen(false)}
                  className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6l-12 12M6 6l12 12"></path>
                  </svg>
                </button>
                <DialogHeader>
                  <DialogTitle className="text-white text-xl font-bold">إضافة موظف جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded mb-4 bg-white border border-gray-200">
                    <Checkbox
                      checked={(form as any).sendWelcomeEmail || false}
                      onCheckedChange={(checked) => setForm({ ...form, sendWelcomeEmail: checked as boolean })}
                    />
                    <Label className="text-black mb-0">إرسال بريد ترحيبي للموظف الجديد</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-black">الاسم *</Label>
                      <Input placeholder="مثال: أحمد محمد" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-black">الايميل *</Label>
                      <Input type="email" placeholder="example@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-black">الوظيفة</Label>
                      <Input 
                        value={form.role} 
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        placeholder="مثال: محاسب، مدير، سكرتير..."
                      />
                    </div>
                    <div>
                      <Label className="text-black">الهاتف</Label>
                      <Input placeholder="مثال: 0505555555" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-black">الصلاحيات</Label>
                    <div className="space-y-2 p-4 rounded mt-2 bg-white border border-gray-200">
                      {AVAILABLE_PERMISSIONS.map(perm => (
                        <div key={perm.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={form.permissions.includes(perm.id)}
                            onCheckedChange={(checked) => {
                              setForm({
                                ...form,
                                permissions: checked
                                  ? [...form.permissions, perm.id]
                                  : form.permissions.filter(p => p !== perm.id)
                              });
                            }}
                            className="!text-black"
                          />
                          <Label className={form.permissions.includes(perm.id) ? "!text-black font-bold" : "!text-black"}>{perm.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="btn-premium w-full bg-black text-black hover:bg-gray-800 disabled:opacity-50" disabled={loading} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: 'black', color: 'white' }}>
                    {loading ? "جاري الإضافة..." : "إضافة الموظف"}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}

        <motion.div className="card-base bg-white border border-gray-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-black">
                <Users className="w-5 h-5" />
                قائمة الموظفين ({filteredEmployees.length})
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mb-6">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/70" />
                <Input
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 w-full sm:w-64 text-black placeholder:text-black/50"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40 text-black !text-black">
                  <Filter className="w-4 h-4 ml-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="!text-black">الكل</SelectItem>
                  {Array.from(new Set(employees.map(e => e.role))).map(role => (
                    <SelectItem key={role} value={role || ''} className="!text-black">{role || 'غير محدد'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="p-4 border-0 rounded-lg bg-white">
                {editingEmployee?.id === employee.id ? (
                  <div className="space-y-4">
                    {editingEmployee.email === currentUser.email && !isPresident && (
                      <div className="bg-white border border-gray-200 rounded p-3 mb-4">
                        <div className="flex items-center gap-2 text-red-400">
                          <span className="text-2xl">⚠️</span>
                          <div>
                            <p className="font-bold">تحذير مهم</p>
                            <p className="text-xs">لا يمكنك التعديل على حسابك الشخصي مباشرة - اتصل بمسؤول النظام للمساعدة</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {editingEmployee.role === "president" && !isPresident && (
                      <div className="bg-white border border-gray-200 rounded p-3 mb-4">
                        <div className="flex items-center gap-2 text-red-400">
                          <span className="text-2xl">⚠️</span>
                          <div>
                            <p className="font-bold">صلاحية محمية جداً</p>
                            <p className="text-xs">لا يمكنك تعديل حساب الرئيس - الصلاحية فقط للرئيس نفسه</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-black">الاسم</Label>
                        <Input 
                          placeholder="مثال: أحمد محمد"
                          value={editingEmployee.name || ""} 
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                          disabled={
                            (editingEmployee.email === currentUser.email && !isPresident) ||
                            (editingEmployee.role === "president" && !isPresident)
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-black">الهاتف</Label>
                        <Input 
                          placeholder="مثال: 0505555555"
                          value={editingEmployee.phone || ""} 
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                          disabled={
                            (editingEmployee.email === currentUser.email && !isPresident) ||
                            (editingEmployee.role === "president" && !isPresident)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-black">الوظيفة</Label>
                        <Input 
                          value={editingEmployee.role || ""} 
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                          placeholder="مثال: محاسب، مدير، سكرتير..."
                          disabled={editingEmployee.role === "president" || !isPresident}
                        />
                      </div>
                      <div>
                        <Label className="text-black">الحالة</Label>
                        <Select 
                          value={editingEmployee.active ? "active" : "inactive"} 
                          onValueChange={(value) => setEditingEmployee({ ...editingEmployee, active: value === "active" })}
                          disabled={editingEmployee.role === "president" || !isPresident}
                        >
                          <SelectTrigger className="text-black"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active" className="text-black">نشط</SelectItem>
                            <SelectItem value="inactive" className="text-black">غير نشط</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-black">ملاحظات</Label>
                      <Input 
                        value={editingEmployee.notes || ""} 
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, notes: e.target.value })}
                        placeholder="أي ملاحظات إضافية..."
                        disabled={
                          (editingEmployee.email === currentUser.email && !isPresident) ||
                          (editingEmployee.role === "president" && !isPresident)
                        }
                      />
                    </div>
                    {(isPresident || hasPermission("employees:edit")) && editingEmployee?.role !== "president" && (
                      <div>
                        <Label className="text-black">الصلاحيات</Label>
                        <div className="space-y-2 p-4 rounded mt-2 bg-white border border-gray-200">
                          {AVAILABLE_PERMISSIONS.map(perm => (
                            <div key={perm.id} className="flex items-center gap-2">
                              <Checkbox
                                checked={editingEmployee.permissions?.includes(perm.id)}
                                onCheckedChange={(checked) => {
                                  if (!editingEmployee) return;
                                  const current = editingEmployee.permissions || [];
                                  const next = checked
                                    ? [...current, perm.id]
                                    : current.filter((p) => p !== perm.id);
                                  setEditingEmployee({ ...editingEmployee, permissions: next });
                                }}
                              />
                              <Label className="text-black">{perm.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdate(editingEmployee)} disabled={loading} className="bg-black text-white hover:bg-gray-800 font-bold">
                        <Save className="w-4 h-4 ml-2" />حفظ التعديلات
                      </Button>
                      <Button variant="outline" onClick={() => setEditingEmployee(null)} className="text-black hover:text-black">
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg text-black">{employee.name}</h4>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-sm text-black/80">{employee.email}</span>
                        {employee.role && (
                          <span className="text-xs text-black px-2 py-1 rounded bg-blue-100 border border-blue-300">
                            {employee.role === "president" ? "رئيس" : employee.role === "manager" ? "مدير" : employee.role}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${employee.active ? "bg-emerald-100 text-black border border-emerald-400" : "bg-red-100 text-black border border-red-400"}`}> 
                          {employee.active ? "نشط" : "غير نشط"}
                        </span>
                      </div>
                    </div>
                    {(isPresident || hasPermission("employees:edit") || hasPermission("employees:remove")) && employee.role !== "president" && (
                      <div className="flex gap-2">
                        {hasPermission("employees:edit") && (
                          <Button variant="outline" size="sm" onClick={() => setEditingWithClone(employee)} className="text-black hover:text-black">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {hasPermission("employees:remove") && (
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(employee.id)} className="text-black hover:text-black hover:bg-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                    {employee.role === "president" && (
                      <div className="flex gap-2">
                        {isPresident && (
                          <Button variant="outline" size="sm" onClick={() => setEditingWithClone(employee)} className="text-black hover:text-black">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {!isPresident && (
                          <div className="text-xs bg-white text-amber-400 px-3 py-1 rounded font-semibold border border-gray-200">
                            🛡️ محمي - لا يمكن التعديل
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}






