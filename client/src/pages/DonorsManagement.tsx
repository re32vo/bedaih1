import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Edit2, Trash2, Search, X, Check, Gift, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Donor {
  id: number;
  email: string;
  name: string;
  phone: string;
  created_at: string;
  last_login_at?: string;
  donationsCount: number;
  totalDonations: number;
}

export default function DonorsManagement() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [deletingDonor, setDeletingDonor] = useState<Donor | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "" });
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    verifyAccessAndFetch();
  }, []);

  const verifyAccessAndFetch = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      toast({
        title: "غير مصرح",
        description: "يرجى تسجيل الدخول أولاً",
        variant: "destructive",
      });
      window.location.href = "/login";
      return;
    }

    // Verify token and permissions
    try {
      const verifyRes = await fetch("/api/auth/verify-token", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!verifyRes.ok) {
        throw new Error("فشل التحقق");
      }

      const verifyData = await verifyRes.json();
      
      if (!verifyData.success) {
        throw new Error("صلاحية غير صحيحة");
      }

      // Check permission
      const hasPermission = verifyData.role === "president" || 
                           (verifyData.permissions && verifyData.permissions.includes("manage_donors"));
      
      if (!hasPermission) {
        toast({
          title: "غير مصرح",
          description: "ليس لديك صلاحية إدارة المتبرعين",
          variant: "destructive",
        });
        window.location.href = "/dashboard";
        return;
      }

      // If verified, fetch donors
      fetchDonors();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل التحقق من الصلاحيات",
        variant: "destructive",
      });
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const filtered = donors.filter(
      (d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm)
    );
    setFilteredDonors(filtered);
  }, [searchTerm, donors]);

  const fetchDonors = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const res = await fetch("/api/admin/donors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "فشل جلب البيانات");
      }

      const data = await res.json();
      setDonors(data.donors);
      setFilteredDonors(data.donors);
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (donor: Donor) => {
    setEditingDonor(donor);
    setEditForm({ name: donor.name, phone: donor.phone, email: donor.email });
  };

  const handleSaveEdit = async () => {
    if (!editingDonor) return;

    try {
      const token = sessionStorage.getItem("authToken");
      
      // إذا تغير البريد وما في verification mode، أرسل OTP
      if (editForm.email !== editingDonor.email && !verificationMode) {
        const res = await fetch(`/api/admin/donors/${editingDonor.email}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editForm.name,
            phone: editForm.phone,
            email: editForm.email
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "فشل التحديث");
        }

        if (data.requiresVerification) {
          setVerificationMode(true);
          toast({
            title: "تم إرسال رمز التحقق",
            description: `تم إرسال رمز التحقق إلى ${editForm.email}`,
          });
          return;
        }

        throw new Error(data.message || "فشل تغيير البريد");
      }

      // إذا كانت في verification mode، أرسل الكود
      if (verificationMode && verificationCode) {
        const res = await fetch(`/api/admin/donors/${editingDonor.email}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editForm.name,
            phone: editForm.phone,
            email: editForm.email,
            verificationCode: verificationCode
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "فشل التحديث");
        }

        const data = await res.json();
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث بيانات المتبرع بنجاح",
        });

        setEditingDonor(null);
        setVerificationMode(false);
        setVerificationCode("");
        fetchDonors();
        return;
      }

      // تحديث بدون تغيير بريد
      const res = await fetch(`/api/admin/donors/${editingDonor.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          phone: editForm.phone,
          email: editForm.email
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "فشل التحديث");
      }

      toast({
        title: "تم التحديث",
        description: "تم تحديث بيانات المتبرع بنجاح",
      });

      setEditingDonor(null);
      fetchDonors();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل تحديث البيانات",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingDonor) return;

    try {
      const token = sessionStorage.getItem("authToken");
      const res = await fetch(`/api/admin/donors/${deletingDonor.email}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "فشل الحذف");
      }

      toast({
        title: "تم الحذف",
        description: "تم حذف المتبرع بنجاح",
      });

      setDeletingDonor(null);
      
      // إعادة تحميل قائمة المتبرعين
      fetchDonors();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل حذف المتبرع",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" dir="rtl">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          جاري تحميل بيانات المتبرعين...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900">إدارة المتبرعين</h1>
        </div>
        <p className="text-slate-600">عرض وتعديل وحذف حسابات المتبرعين</p>
        <div className="mt-4 w-full lg:w-auto">
          <Button
            className="bg-black hover:bg-gray-800 text-white w-full lg:w-auto"
            onClick={() => { window.location.href = "/dashboard"; }}
          >
            عودة للوحة الموظفين
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث بالاسم أو البريد أو الهاتف..."
            className="w-full pr-10 pl-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Donors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">الاسم</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">البريد الإلكتروني</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">الهاتف</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">التبرعات</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">المبلغ الكلي</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">تاريخ التسجيل</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    لا توجد نتائج
                  </td>
                </tr>
              ) : (
                filteredDonors.map((donor) => (
                  <motion.tr
                    key={donor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{donor.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{donor.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{donor.phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{donor.donationsCount}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">
                      {donor.totalDonations.toLocaleString()} ر.س
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(donor.created_at).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(donor)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingDonor(donor)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      {editingDonor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {verificationMode ? "التحقق من البريد الجديد" : "تعديل بيانات المتبرع"}
            </h2>
            <div className="space-y-4">
              {!verificationMode ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الاسم</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الهاتف</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-blue-900">🔐 تحقق من البريد الجديد</p>
                    <p className="text-xs text-blue-700 mt-1">تم إرسال رمز تحقق إلى <strong>{editForm.email}</strong></p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">رمز التحقق</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="أدخل الرمز 6 أرقام"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                      maxLength={6}
                    />
                  </div>
                </>
              )}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEdit} disabled={verificationMode && verificationCode.length !== 6} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                  <Check className="w-4 h-4 ml-2" />
                  {verificationMode ? "تأكيد" : "حفظ"}
                </Button>
                <Button
                  onClick={() => {
                    setEditingDonor(null);
                    setVerificationMode(false);
                    setVerificationCode("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 ml-2" />
                  إلغاء
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingDonor} onOpenChange={() => setDeletingDonor(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              سيتم حذف حساب <strong className="text-white">{deletingDonor?.name}</strong> وجميع تبرعاته بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-white border-slate-700 hover:bg-slate-800">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}






