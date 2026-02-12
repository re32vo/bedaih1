import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { LogOut, Users, Heart, Briefcase, Mail, CheckCircle, AlertCircle, Phone, MapPin, FileText, Calendar, RefreshCw, Search, Download, Bell, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({ beneficiaries: 0, jobs: 0, contacts: 0, volunteers: 0, total: 0 });
  const [userRole, setUserRole] = useState<string>("");
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const isPresident = userRole === "president";
  const hasPermission = (perm: string) => isPresident || userPermissions.includes(perm) || userPermissions.includes("*");

  const fetchStats = async (token: string) => {
    const res = await fetch("/api/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("فشل جلب الإحصاءات");
    const data = await res.json();
    setStats({
      beneficiaries: data.beneficiaries || 0,
      jobs: data.jobs || 0,
      contacts: data.contacts || 0,
        volunteers: data.volunteers || 0,
      total: data.total || 0,
    });
  };

  const fetchRecent = async (token: string) => {
    const res = await fetch("/api/dashboard/recent", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("فشل جلب آخر البيانات");
    const data = await res.json();
    setRecentItems(data || {});
  };

  const verifyAccess = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        setIsAuthenticated(false);
        setLoading(false);
        sessionStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      if (!data?.success) {
        setIsAuthenticated(false);
        setLoading(false);
        sessionStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
      }

      setIsAuthenticated(true);
      setUserRole(data.role || "");
      setUserPermissions(data.permissions || []);
      setUserName(data.name || "");
      setUserEmail(data.email || "");

      await Promise.all([fetchStats(token), fetchRecent(token)]);
    } catch (_err) {
      setIsAuthenticated(false);
      sessionStorage.removeItem("authToken");
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) return;
    try {
      setRefreshing(true);
      await Promise.all([fetchStats(token), fetchRecent(token)]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    window.location.href = "/login";
  };
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const handleViewItem = (item: any, type: string) => { 
    setSelectedItem(item); 
    setDialogOpen(true);
  };
  const itemVariants = {};

  // تعريف المتغيرات المطلوبة
  const [recentItems, setRecentItems] = useState<any>({});
  const [activeView, setActiveView] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    verifyAccess();
  }, []);

  // تعريف safeRecentItems بشكل آمن بعد recentItems
  const safeRecentItems = {
    beneficiaries: Array.isArray(recentItems?.beneficiaries) ? recentItems.beneficiaries : [],
    jobs: Array.isArray(recentItems?.jobs) ? recentItems.jobs : [],
    contacts: Array.isArray(recentItems?.contacts) ? recentItems.contacts : [],
    volunteers: Array.isArray(recentItems?.volunteers) ? recentItems.volunteers : [],
  };


  const getFilteredItems = () => {
    let items = [];
    if (activeView === 'all') {
      // Combine all items and sort by date - only include items user has permission to view
      const all = [
        ...(hasPermission('beneficiaries:view') ? safeRecentItems.beneficiaries.map((item: any) => ({ ...item, type: 'beneficiary' })) : []),
        ...(hasPermission('jobs:view') ? safeRecentItems.jobs.map((item: any) => ({ ...item, type: 'job' })) : []),
        ...(hasPermission('contact:view') ? safeRecentItems.contacts.map((item: any) => ({ ...item, type: 'contact' })) : []),
        ...(hasPermission('volunteers:view') ? safeRecentItems.volunteers.map((item: any) => ({ ...item, type: 'volunteer' })) : []),
      ];
      items = all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeView === 'beneficiaries' && hasPermission('beneficiaries:view')) {
      items = safeRecentItems.beneficiaries.map((item: any) => ({ ...item, type: 'beneficiary' }));
    } else if (activeView === 'jobs' && hasPermission('jobs:view')) {
      items = safeRecentItems.jobs.map((item: any) => ({ ...item, type: 'job' }));
    } else if (activeView === 'contacts' && hasPermission('contact:view')) {
      items = safeRecentItems.contacts.map((item: any) => ({ ...item, type: 'contact' }));
    } else if (activeView === 'volunteers' && hasPermission('volunteers:view')) {
      items = safeRecentItems.volunteers.map((item: any) => ({ ...item, type: 'volunteer' }));
    }

    // Apply search filter
    if (searchQuery.trim()) {
      items = items.filter((item: any) => {
        const query = searchQuery.toLowerCase();
        return (
          item.email?.toLowerCase().includes(query) ||
          item.name?.toLowerCase().includes(query) ||
          item.fullName?.toLowerCase().includes(query) ||
          item.phone?.includes(query) ||
          item.address?.toLowerCase().includes(query) ||
          item.assistanceType?.toLowerCase().includes(query) ||
          item.opportunityTitle?.toLowerCase().includes(query)
        );
      });
    }

    return items;
  };

  const getPaginatedItems = () => {
    const filtered = getFilteredItems();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filtered.slice(start, end);
  };

  const totalPages = Math.ceil(getFilteredItems().length / itemsPerPage);

  const handleExportData = () => {
    const items = getFilteredItems();
    
    // Build CSV with proper escaping for Arabic text
    const csvRows = [];
    
    // Headers
    csvRows.push(['النوع', 'الاسم الكامل', 'البريد الإلكتروني', 'رقم الهاتف', 'العنوان', 'نوع الطلب', 'التاريخ والوقت']);
    
    // Data rows
    items.forEach((item: any) => {
      const type = item.type === 'beneficiary' ? 'مستفيد' : item.type === 'job' ? 'طلب وظيفي' : item.type === 'volunteer' ? 'متطوع' : 'رسالة تواصل';
      const name = item.name || item.fullName || 'غير محدد';
      const email = item.email || 'غير محدد';
      // Use ="value" format to force Excel to treat as text and prevent scientific notation
      const phone = item.phone ? `="${item.phone}"` : 'غير محدد';
      const address = item.address || 'غير محدد';
      const requestType = item.assistanceType || item.subject || item.experience || item.opportunityTitle || 'غير محدد';
      const date = new Date(item.createdAt).toLocaleString('ar-SA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      csvRows.push([type, name, email, phone, address, requestType, date]);
    });
    
    // Convert to CSV format with proper quoting
    const csv = csvRows.map(row => 
      row.map(cell => {
        // Don't quote the phone number formula (="...")
        if (String(cell).startsWith('="')) return cell;
        // Quote all other cells and escape internal quotes
        return `"${String(cell).replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\r\n');

    // Add BOM for UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `بيانات_الطلبات_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getItemIcon = (type: string) => {
    if (type === 'beneficiary') return Heart;
    if (type === 'job') return Briefcase;
    if (type === 'contact') return Mail;
    if (type === 'volunteer') return Users;
    return FileText;
  };

  const translateAssistanceType = (type: string): string => {
    const translations: Record<string, string> = {
      'financial': 'مساعدة مالية',
      'food': 'سلة غذائية',
      'medical': 'علاج ودواء',
      'housing': 'ترميم منازل',
      'education': 'دعم تعليمي',
      'إسكان': 'ترميم منازل',
      'مساعدة مالية': 'مساعدة مالية',
    };
    return translations[type] || type;
  };

  const getItemTitle = (item: any, type: string) => {
    if (type === 'beneficiary') {
      const name = item.fullName || item.name || 'مستفيد جديد';
      return `طلب مساعدة - ${name}`;
    }
    if (type === 'job') return `طلب وظيفي - ${item.fullName || 'بيانات ناقصة'}`;
    if (type === 'contact') return `رسالة من ${item.name || 'باعث'}`;
    if (type === 'volunteer') return `طلب تطوع - ${item.name || 'متطوع جديد'}`;
    return 'طلب';
  };

  const getItemColor = (type: string) => {
    if (type === 'beneficiary') return 'text-red-600';
    if (type === 'job') return 'text-blue-600';
    if (type === 'contact') return 'text-green-600';
    if (type === 'volunteer') return 'text-purple-600';
    return 'text-slate-900';
  };

  const formatDate = (date: any) => {
    if (!date) return 'بيانات ناقصة';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  // ...existing code...

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-purple-500/10">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
            <AlertCircle className="w-12 h-12 mx-auto text-amber-400 mb-4" />
            <h2 className="text-2xl font-bold font-heading text-black mb-2">صلاحية غير صحيحة</h2>
            <p className="text-black/80 mb-6">
              لم يتم التحقق من الدخول
            </p>
            <p className="text-black/80 mb-6">
              يرجى إعادة تسجيل الدخول
            </p>
            <a href="/login" className="block">
              <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg">
                العودة لتسجيل الدخول
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!stats || !recentItems) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">تعذر تحميل البيانات</h2>
          <p>حدث خطأ في جلب بيانات لوحة التحكم. يرجى المحاولة لاحقاً أو التواصل مع الدعم.</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "طلبات المساعدة",
      value: (stats?.beneficiaries ?? 0).toString(),
      icon: Heart,
      gradient: "from-red-500 to-pink-500",
      permission: "beneficiaries:view",
    },
    {
      title: "الطلبات الوظيفية",
      value: (stats?.jobs ?? 0).toString(),
      icon: Briefcase,
      gradient: "from-blue-500 to-indigo-500",
      permission: "jobs:view",
    },
    {
      title: "رسائل التواصل",
      value: (stats?.contacts ?? 0).toString(),
      icon: Mail,
      gradient: "from-green-500 to-teal-500",
      permission: "contact:view",
    },
    {
      title: "إجمالي الطلبات",
      value: (stats?.total ?? 0).toString(),
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      permission: null, // always visible
    },
  ].filter(card => !card.permission || hasPermission(card.permission));

  return (
    <div className="min-h-screen bg-white text-black py-4">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-3">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">لوحة التحكم</h1>
              <p className="text-sm sm:text-base text-black/80">مرحباً بك في نظام إدارة الجمعية</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Button
                onClick={refreshData}
                disabled={refreshing}
                className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 flex-1 sm:flex-none text-xs sm:text-sm h-10 sm:h-auto"
              >
                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">تحديث البيانات</span>
                <span className="sm:hidden">تحديث</span>
              </Button>
              <Button
                onClick={handleExportData}
                className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 flex-1 sm:flex-none text-xs sm:text-sm h-10 sm:h-auto"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">تصدير البيانات</span>
                <span className="sm:hidden">تصدير</span>
              </Button>
              {(userRole === 'president' || userPermissions.some(p => p.startsWith('employees:'))) && (
                <Button
                  onClick={() => window.location.href = "/admin"}
                  className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 flex-1 sm:flex-none text-xs sm:text-sm h-10 sm:h-auto"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">إدارة الموظفين</span>
                  <span className="sm:hidden">موظفين</span>
                </Button>
              )}              {(isPresident || hasPermission("manage_donors")) && (
                <Button
                  onClick={() => window.location.href = "/donors-management"}
                  className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 flex-1 sm:flex-none text-xs sm:text-sm h-10 sm:h-auto"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">إدارة المتبرعين</span>
                  <span className="sm:hidden">متبرعين</span>
                </Button>
              )}              {(userRole === 'president' || userPermissions.includes('audit:view')) && (
                <Button
                  onClick={() => window.location.href = "/logs"}
                  className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 flex-1 sm:flex-none text-xs sm:text-sm h-10 sm:h-auto"
                >
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">سجلات النظام</span>
                  <span className="sm:hidden">سجلات</span>
                </Button>
              )}
              <Button
                onClick={handleLogout}
                className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 flex-1 sm:flex-none text-xs sm:text-sm h-10 sm:h-auto"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
                <span className="sm:hidden">خروج</span>
              </Button>
            </div>
          </div>

          <motion.div 
            className="bg-white border border-slate-200 rounded-xl p-3 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 shrink-0" />
              <div className="text-sm sm:text-base">
                <p className="text-black font-semibold">✓ تم تسجيل الدخول بنجاح</p>
                <p className="text-black text-xs sm:text-sm"><span className="font-bold">{userName || userEmail}</span> {userRole && <span className="badge-ultra text-[10px] sm:text-xs ml-2">{userRole}</span>}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {/* Recent Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-black">آخر الطلبات</CardTitle>
                    <CardDescription className="text-black/80">طلبات المساعدة والتطبيقات الوظيفية الأخيرة</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="ابحث..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pr-10 w-full sm:w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getPaginatedItems().length === 0 ? (
                    <div className="text-center py-8 text-black/70">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد طلبات حالياً'}</p>
                    </div>
                  ) : (
                    <>
                      {getPaginatedItems().map((item: any, index: number) => {
                        const Icon = getItemIcon(item.type);
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 text-black"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getItemColor(item.type)}`} style={{ background: `linear-gradient(to br, rgb(var(--primary)), rgb(var(--secondary)))` }}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-black">{getItemTitle(item, item.type)}</p>
                                <p className="text-xs text-black/70">{formatDate(item.createdAt)}</p>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-black hover:bg-gray-800 text-white"
                              onClick={() => handleViewItem(item, item.type)}
                            >
                              عرض
                            </Button>
                          </div>
                        );
                      })}
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                          <span className="text-sm text-black">
                            صفحة {currentPage} من {totalPages}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-black">الإجراءات السريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hasPermission('beneficiaries:view') && (
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold justify-between"
                    onClick={() => { setActiveView('beneficiaries'); setCurrentPage(1); }}
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      عرض الطلبات
                    </span>
                    <Badge variant="secondary">{stats.beneficiaries}</Badge>
                  </Button>
                )}
                {hasPermission('jobs:view') && (
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold justify-between"
                    onClick={() => { setActiveView('jobs'); setCurrentPage(1); }}
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      الطلبات الوظيفية
                    </span>
                    <Badge variant="secondary">{stats.jobs}</Badge>
                  </Button>
                )}
                {hasPermission('contact:view') && (
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold justify-between"
                    onClick={() => { setActiveView('contacts'); setCurrentPage(1); }}
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      رسائل التواصل
                    </span>
                    <Badge variant="secondary">{stats.contacts}</Badge>
                  </Button>
                )}
                {hasPermission('volunteers:view') && (
                <Button 
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold justify-between"
                  onClick={() => { setActiveView('volunteers'); setCurrentPage(1); }}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    المتطوعين
                  </span>
                  <Badge variant="secondary">{stats.volunteers || 0}</Badge>
                </Button>
                )}
                {userRole === 'president' && (
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold"
                    onClick={() => window.location.href = '/admin'}
                  >
                    <Users className="w-4 h-4 ml-2" />
                    الموظفون
                  </Button>
                )}
                {activeView !== 'all' && (
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 font-bold"
                    onClick={() => { setActiveView('all'); setCurrentPage(1); }}
                    variant="outline"
                  >
                    عرض الكل
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card className="mt-6 bg-white border-slate-200 text-black">
              <CardHeader>
                <CardTitle className="text-sm text-black">معلومات الجلسة</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-black">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  الجلسة نشطة وآمنة
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-black" />
                  {new Date().toLocaleDateString('ar-SA')}
                </p>
                <p className="text-[10px] text-black">
                  آخر تحديث: {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6 bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-sm text-black">إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-xs text-black">
                  <span>معدل الاستجابة</span>
                  <Badge variant="outline" className="bg-green-500/30 text-green-900 border-green-500/50 font-semibold">98%</Badge>
                </div>
                <div className="flex justify-between items-center text-xs text-black">
                  <span>الطلبات الجديدة اليوم</span>
                  <Badge variant="outline" className="bg-blue-500/30 text-blue-900 border-blue-300 font-semibold">{Math.floor(stats.total * 0.05)}</Badge>
                </div>
                <div className="flex justify-between items-center text-xs text-black">
                  <span>متوسط وقت المعالجة</span>
                  <Badge variant="outline" className="bg-amber-500/30 text-amber-900 border-amber-300 font-semibold">2.5 ساعة</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Item Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-black">
                {selectedItem && getItemTitle(selectedItem, selectedItem.type)}
              </DialogTitle>
              <DialogDescription className="text-black">
                تفاصيل الطلب الكاملة
              </DialogDescription>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-4 mt-4">
                {selectedItem.type === 'beneficiary' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-black flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          الاسم الرباعي
                        </label>
                        <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.fullName && selectedItem.fullName.trim() ? selectedItem.fullName.trim() : 'غير محدد'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-black flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          رقم الهوية / الإقامة
                        </label>
                        <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.nationalId && selectedItem.nationalId.trim() ? selectedItem.nationalId.trim() : 'غير محدد'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-black flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          رقم الجوال
                        </label>
                        <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.phone && selectedItem.phone.trim() ? selectedItem.phone.trim() : 'غير محدد'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-black flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          البريد الإلكتروني
                        </label>
                        <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.email && selectedItem.email.trim() ? selectedItem.email.trim() : 'غير محدد'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-black flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        نوع المساعدة المطلوبة
                      </label>
                      <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.assistanceType ? translateAssistanceType(selectedItem.assistanceType) : 'لم يتم تحديد نوع'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-black flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        العنوان السكني بالتفصيل
                      </label>
                      <p className="text-black bg-white p-3 rounded border border-slate-200 whitespace-pre-wrap">{selectedItem.address && selectedItem.address.trim() ? selectedItem.address.trim() : 'لم يتم تعيين عنوان'}</p>
                    </div>
                  </>
                )}

                {selectedItem.type === 'job' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-black flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          الاسم الكامل
                        </label>
                        <p className="text-black bg-white p-3 rounded border border-slate-200">{(selectedItem.fullName || '').trim() || 'غير محدد'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-black flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          رقم الهاتف
                        </label>
                        <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.phone || 'غير محدد'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-black flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني
                      </label>
                      <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.email || 'غير محدد'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-black flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        المؤهل العلمي
                      </label>
                      <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.qualifications || 'غير محدد'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-black flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        الخبرات السابقة
                      </label>
                      <p className="text-black bg-white p-3 rounded border border-slate-200 whitespace-pre-wrap">{selectedItem.experience || 'لا توجد خبرات محددة'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-black flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        المهارات
                      </label>
                      <p className="text-black bg-white p-3 rounded border border-slate-200 whitespace-pre-wrap">{selectedItem.skills || 'لا توجد مهارات محددة'}</p>
                    </div>
                    {selectedItem.cvUrl && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-black flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          السيرة الذاتية
                        </label>
                        <a 
                          href={selectedItem.cvUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500 hover:underline bg-white p-3 rounded block border border-slate-200"
                        >
                          عرض السيرة الذاتية
                        </a>
                      </div>
                    )}
                  </>
                )}

                {selectedItem.type === 'contact' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-black flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          الاسم
                        </label>
                        <p className="text-black bg-white p-3 rounded border border-slate-200">{(selectedItem.name || '').trim() || 'غير محدد'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-black flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          رقم الهاتف
                        </label>
                        <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.phone || 'غير محدد'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-black flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني
                      </label>
                      <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.email || 'غير محدد'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-black flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        الرسالة
                      </label>
                      <p className="text-black bg-white p-3 rounded border border-slate-200 whitespace-pre-wrap">{selectedItem.message || 'لا توجد رسالة'}</p>
                    </div>
                  </>
                )}

                {selectedItem.type === 'volunteer' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-black flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          الاسم
                        </label>
                        <p className="text-black bg-white p-3 rounded border border-slate-200">{(selectedItem.name || '').trim() || 'غير محدد'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-black flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          رقم الهاتف
                        </label>
                        <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.phone || 'غير محدد'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-black flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني
                      </label>
                      <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.email || 'غير محدد'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-black flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        فرصة التطوع
                      </label>
                      <p className="text-black bg-white p-3 rounded border border-slate-200">{selectedItem.opportunityTitle || 'غير محدد'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-black flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        الخبرة والدافع للتطوع
                      </label>
                      <p className="text-black bg-white p-3 rounded border border-slate-200 whitespace-pre-wrap">{selectedItem.experience || 'لا توجد معلومات'}</p>
                    </div>
                  </>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-black">
                    <Calendar className="w-4 h-4" />
                    <span>تاريخ الإرسال: {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString('ar-SA') : 'غير محدد'}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}



