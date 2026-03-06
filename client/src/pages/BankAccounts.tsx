import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Copy } from "lucide-react";

export default function BankAccounts() {
  const accounts = [
    {
      bank: "البنك الأهلي السعودي",
      accountName: "جمعية بداية للأعمال الخيرية",
      accountNumber: "1234567890123456",
      iban: "SA0310000001234567890123",
    },
    {
      bank: "البنك السعودي للاستثمار",
      accountName: "جمعية بداية للأعمال الخيرية",
      accountNumber: "9876543210123456",
      iban: "SA9850000002345678901234",
    },
    {
      bank: "بنك الراجين",
      accountName: "جمعية بداية للأعمال الخيرية",
      accountNumber: "1111222233334444",
      iban: "SA6350000003456789012345",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم نسخ الرقم بنجاح!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">الحسابات البنكية</h1>
          <p className="text-xl text-slate-600">تبرع آمن وسريع لدعم أعمالنا الخيرية</p>
        </div>

        {/* Bank Accounts */}
        <div className="space-y-6 mb-12">
          {accounts.map((account, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-6 h-6" />
                  <CardTitle className="text-white">{account.bank}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-1">اسم الحساب</p>
                  <p className="text-slate-900">{account.accountName}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-1">رقم الحساب</p>
                  <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg">
                    <p className="text-slate-900 font-mono">{account.accountNumber}</p>
                    <button
                      onClick={() => copyToClipboard(account.accountNumber)}
                      className="p-2 hover:bg-slate-200 rounded transition"
                    >
                      <Copy className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-1">IBAN</p>
                  <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg">
                    <p className="text-slate-900 font-mono text-sm">{account.iban}</p>
                    <button
                      onClick={() => copyToClipboard(account.iban)}
                      className="p-2 hover:bg-slate-200 rounded transition"
                    >
                      <Copy className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Notes */}
        <Card>
          <CardHeader>
            <CardTitle>ملاحظات مهمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <ul className="list-disc list-inside space-y-2">
              <li>تأكد من صحة بيانات الحساب قبل التحويل</li>
              <li>تحويلاتك معفاة من الرسوم البنكية</li>
              <li>ستتلقى إيصال رسمي عند استقبال المبلغ</li>
              <li>يمكنك التحويل من أي بنك محلي أو دولي</li>
              <li>اسأل بنكك عن أي رسوم قد تكون مطبقة من جهته</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






