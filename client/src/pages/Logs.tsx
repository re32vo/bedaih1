import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table } from "@/components/ui/table";
import { useLocation } from "wouter";
import { FileText, Filter, RefreshCw, ShieldCheck, AlertCircle } from "lucide-react";
import logoImg from "@/assets/logo.png";

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export default function Logs() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [fetching, setFetching] = useState(false);

  const [action, setAction] = useState<string>("all");
  const [from, setFrom] = useState<string>(""); // datetime-local
  const [to, setTo] = useState<string>(""); // datetime-local

  useEffect(() => {
    const sessionToken = sessionStorage.getItem("authToken");
    setToken(sessionToken);
    if (!sessionToken) {
      setLoading(false);
      navigate("/login");
      return;
    }

    fetch("/api/auth/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setRole(data.role || null);
        setPermissions(data.permissions || []);
        setLoading(false);
        const isPresident = data.role === "president";
        const canView = isPresident || (Array.isArray(data.permissions) && data.permissions.includes("audit:view"));
        if (!canView) {
          navigate("/dashboard");
        } else {
          // Fetch logs with session token
          fetchLogsWithToken(sessionToken);
        }
      })
      .catch(() => {
        setLoading(false);
        navigate("/login");
      });
  }, []);

  // Fetch logs when filters change
  useEffect(() => {
    if (token && !loading) {
      fetchLogs();
    }
  }, [action, from, to]);

  const actionsList = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      if (e.action) set.add(e.action);
    });
    return Array.from(set);
  }, [entries]);

  const quickFilters = [
    { label: "الكل", value: "all" },
    { label: "سجلات الدخول", value: "otp_verified" },
    { label: "إرسال أكواد الدخول", value: "send_otp" },
    { label: "إدارة الموظفين", value: "update_employee" },
    { label: "إضافة موظف", value: "add_employee" },
    { label: "فصل موظف", value: "delete_employee" },
    { label: "صلاحيات الموظفين", value: "update_permissions" },
    { label: "طلبات المساعدة", value: "create_beneficiary" },
    { label: "الطلبات الوظيفية", value: "create_job" },
    { label: "رسائل التواصل", value: "create_contact" },
    { label: "طلبات المتطوعين", value: "create_volunteer" },
    { label: "إدارة المتبرعين", value: "update_donor" },
    { label: "حذف متبرع", value: "delete_donor" },
  ];

  const getActionText = (action: string) => {
    const map: Record<string, string> = {
      send_otp: "إرسال رمز التحقق",
      otp_verified: "تم التحقق من الدخول",
      add_employee: "إضافة موظف",
      update_employee: "تعديل بيانات موظف",
      delete_employee: "فصل موظف",
      update_permissions: "تحديث صلاحيات",
      create_beneficiary: "طلب مستفيد جديد",
      create_job: "طلب وظيفي جديد",
      create_contact: "رسالة تواصل جديدة",
      create_volunteer: "طلب تطوع جديد",
      update_donor: "تحديث بيانات متبرع",
      delete_donor: "حذف متبرع",
    };
    return map[action] || action;
  };

  const getActionDetails = (entry: AuditEntry) => {
    const details = entry.details || {};
    const action = entry.action;

    if (action === "add_employee") {
      return `إضافة موظف: ${details.name || details.email || ""}`;
    }
    if (action === "delete_employee") {
      return `فصل موظف: ${details.email || details.id || ""}`;
    }
    if (action === "update_employee" || action === "update_permissions") {
      return `تعديل موظف: ${details.id || ""}`;
    }
    if (action === "send_otp") {
      return `إرسال كود التحقق`;
    }
    if (action === "otp_verified") {
      return `تم الدخول بنجاح`;
    }
    if (action === "create_beneficiary") {
      return `طلب مساعدة جديد - ${details.fullName || details.name || ""}`;
    }
    if (action === "create_job") {
      return `طلب وظيفي جديد - ${details.fullName || details.name || ""}`;
    }
    if (action === "create_contact") {
      return `رسالة تواصل جديدة من ${details.name || ""}`;
    }
    if (action === "create_volunteer") {
      return `طلب تطوع جديد - ${details.name || ""}`;
    }
    if (action === "update_donor") {
      return `تحديث متبرع: ${details.email || details.name || ""}`;
    }
    if (action === "delete_donor") {
      return `حذف متبرع: ${details.email || ""}`;
    }
    
    return getActionText(action);
  };

  const toIso = (val: string) => {
    if (!val) return "";
    // datetime-local is in local time; convert to ISO (UTC)
    const d = new Date(val);
    return d.toISOString();
  };

  const fetchLogs = async () => {
    if (!token) return;
    setFetching(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "200");
      if (action && action !== "all") params.set("action", action);
      if (from) params.set("from", toIso(from));
      if (to) params.set("to", toIso(to));

      const res = await fetch(`/api/audit?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      } else {
        setEntries([]);
        console.error("Failed to fetch logs:", res.status, res.statusText);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setEntries([]);
    } finally {
      setFetching(false);
    }
  };

  const fetchLogsWithToken = async (sessionToken: string) => {
    setFetching(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "1000");
      if (action && action !== "all") params.set("action", action);
      if (from) params.set("from", toIso(from));
      if (to) params.set("to", toIso(to));

      const res = await fetch(`/api/audit?${params.toString()}`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      } else {
        const errorText = await res.text();
        console.error("Failed to fetch logs:", res.status, res.statusText);
        setEntries([]);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setEntries([]);
    } finally {
      setFetching(false);
    }
  };

  const setPreset = (preset: "hour" | "today") => {
    const now = new Date();
    if (preset === "hour") {
      const fromDate = new Date(now.getTime() - 60 * 60 * 1000);
      setFrom(new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
      setTo(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    } else {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      setFrom(new Date(start.getTime() - start.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
      setTo(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <img 
            src={logoImg} 
            alt="شعار جمعية بداية" 
            className="w-32 h-32 object-contain mx-auto animate-logo-pulse" 
          />
        </div>
      </div>
    );
  }

  const isPresident = role === "president";
  const canViewAudit = isPresident || permissions.includes("audit:view");
  if (!canViewAudit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <Card className="max-w-md shadow-2xl bg-white border-slate-300">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-amber-600 mb-4" />
            <CardTitle className="text-black">صلاحية غير كافية</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black/80 mb-4">هذه الصفحة تتطلب صلاحية عرض السجلات.</p>
            <a href="/dashboard">
              <Button className="w-full" variant="outline">العودة للوحة التحكم</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black py-6 sm:py-8 md:py-12 lg:py-16" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-1 sm:mb-2">سجلات النظام</h1>
            <p className="text-xs sm:text-sm md:text-base text-black/80">عرض ومتابعة نشاط النظام حسب النوع والزمن</p>
          </div>
          <div className="w-full lg:w-auto">
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="w-full lg:w-auto text-xs sm:text-sm text-black border-slate-200 hover:bg-slate-100">عودة للوحة التحكم</Button>
          </div>
        </div>

        <Alert className="mb-4 bg-white border-slate-200">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
          <AlertDescription className="text-xs sm:text-sm text-black/90">
            هذه الصفحة مرئية لمن لديه صلاحية "عرض السجلات" أو للرئيس. يتم جلب السجلات عبر تفويض آمن.
          </AlertDescription>
        </Alert>

        <Card className="mb-6 bg-white border-slate-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg text-black">عوامل التصفية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3">
              <div>
                <label className="text-xs text-black/70 mb-1 block">نوع الحدث</label>
                <Select value={action} onValueChange={(v) => setAction(v)}>
                  <SelectTrigger className="bg-white border-slate-300 text-black">
                    <SelectValue placeholder="اختر نوع الحدث" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-300">
                    <SelectItem value="all">الكل</SelectItem>
                    {actionsList.map((a) => (
                      <SelectItem key={a} value={a}>{getActionText(a)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-black/70 mb-1 block">من (تاريخ/وقت)</label>
                <Input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-white border-slate-300 text-black" />
              </div>
              <div>
                <label className="text-xs text-black/70 mb-1 block">إلى (تاريخ/وقت)</label>
                <Input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} className="bg-white border-slate-300 text-black" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => { setToken(sessionStorage.getItem("authToken")); setTimeout(fetchLogs, 0); }} disabled={fetching}>
                  <Filter className={`w-4 h-4 ml-2 ${fetching ? 'animate-spin' : ''}`} />
                  تطبيق التصفية
                </Button>
                <Button variant="outline" onClick={() => { setAction("all"); setFrom(""); setTo(""); setToken(sessionStorage.getItem("authToken")); setTimeout(fetchLogs, 0); }} className="text-black border-slate-300 hover:bg-slate-100">
                  مسح
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
              {quickFilters.map((q) => (
                <Button
                  key={q.value}
                  size="sm"
                  variant={action === q.value ? "default" : "outline"}
                  onClick={() => {
                    setAction(q.value);
                    setTimeout(fetchLogs, 0);
                  }}
                  className={action === q.value ? "bg-blue-600 text-white border-blue-600 w-full" : "text-black border-slate-300 hover:bg-slate-100 w-full"}
                >
                  {q.label}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => setPreset("hour")} className="text-black border-slate-300 hover:bg-slate-100">
                آخر ساعة
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPreset("today")} className="text-black border-slate-300 hover:bg-slate-100">
                اليوم
              </Button>
              <Button size="sm" variant="outline" onClick={() => {
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                setFrom(new Date(weekAgo.getTime() - weekAgo.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
                setTo(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
              }} className="text-black border-slate-300 hover:bg-slate-100">
                آخر أسبوع
              </Button>
              <Button size="sm" variant="outline" onClick={() => {
                const now = new Date();
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                setFrom(new Date(monthAgo.getTime() - monthAgo.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
                setTo(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
              }} className="text-black border-slate-300 hover:bg-slate-100">
                آخر شهر
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <FileText className="w-5 h-5" />
              السجلات ({entries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-10 text-black/60">
                لا توجد سجلات مطابقة
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((e) => {
                  const date = new Date(e.timestamp);
                  const dateStr = date.toLocaleDateString('ar-SA');
                  const timeStr = date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div key={e.id} className="border rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-slate-200">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-black/60">
                          <span className="font-semibold">الزمن:</span>
                          <span>{dateStr}</span>
                          <span className="text-blue-600 font-bold">{timeStr}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-black/70 font-semibold">الفاعل:</span>
                          <span className="text-black">{e.actor}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-black/70 font-semibold text-sm">ما الذي حدث:</span>
                          <span className="text-blue-600 font-bold">{getActionDetails(e)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

