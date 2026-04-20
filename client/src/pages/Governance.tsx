import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";

type GovernanceDocument = {
  id: string;
  fileName: string;
  title: string;
  category: string;
  type: string;
  url: string;
};

export default function Governance() {
  const [documents, setDocuments] = useState<GovernanceDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<GovernanceDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    const blockKeyboardShortcuts = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S")) {
        e.preventDefault();
      }
    };
    const style = document.createElement("style");
    style.id = "governance-no-print";
    style.textContent = "@media print { body { display: none !important; } }";
    document.head.appendChild(style);
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeyboardShortcuts);
    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeyboardShortcuts);
      document.getElementById("governance-no-print")?.remove();
    };
  }, []);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await fetch("/api/governance/files");
        const data = await response.json();
        const incoming = Array.isArray(data.documents) ? data.documents : [];
        setDocuments(incoming);
        setSelectedDocument(incoming[0] || null);
      } catch {
        setDocuments([]);
        setSelectedDocument(null);
      } finally {
        setLoading(false);
      }
    };

    void loadDocuments();
  }, []);

  const groupedDocuments = useMemo(() => {
    return documents.reduce<Record<string, GovernanceDocument[]>>((accumulator, document) => {
      const group = document.category || "مستندات الحوكمة";
      accumulator[group] = accumulator[group] || [];
      accumulator[group].push(document);
      return accumulator;
    }, {});
  }, [documents]);

  const categories = useMemo(() => Object.keys(groupedDocuments), [groupedDocuments]);

  return (
    <div className="min-h-screen bg-[#f6f8fc]" dir="rtl">
      <div className="bg-[#33457c] py-10 text-center text-white">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">الحوكمة</h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4 order-2 lg:order-1">
            {loading ? (
              <Card className="border-slate-200 bg-white">
                <CardContent className="flex items-center gap-2 p-6 text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري تحميل ملفات الحوكمة...
                </CardContent>
              </Card>
            ) : categories.length === 0 ? (
              <Card className="border-slate-200 bg-white">
                <CardContent className="p-6 text-sm text-slate-600">
                  لا توجد ملفات حوكمة متاحة حالياً.
                </CardContent>
              </Card>
            ) : (
              categories.map((category) => (
                <Card key={category} className="border-slate-200 bg-white">
                  <CardContent className="p-4">
                    <h2 className="mb-3 text-lg font-bold text-slate-800">{category}</h2>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {groupedDocuments[category].map((document) => {
                        const active = selectedDocument?.fileName === document.fileName;
                        return (
                          <li key={document.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedDocument(document)}
                              className={`w-full rounded-md px-3 py-2 text-right leading-7 transition ${active ? "bg-[#edf2ff] text-[#33457c] font-bold" : "hover:bg-slate-50"}`}
                            >
                              {document.title}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              ))
            )}
          </aside>

          <section className="order-1 lg:order-2">
            <Card className="overflow-hidden border-slate-200 bg-white">
              <CardContent className="p-0">
                {selectedDocument ? (
                  <div>
                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="mb-1 text-sm font-medium text-slate-500">بيانات الملف</p>
                          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{selectedDocument.title}</h2>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {selectedDocument.type}
                            </span>
                            <span>{selectedDocument.category}</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="bg-[#eef3f9] p-3 sm:p-4">
                      <div className="relative h-[80vh] rounded-xl border border-slate-200 bg-white overflow-hidden">
                        {/* طبقة شفافة تمنع الكلك يمين والتفاعل المباشر مع الـ PDF */}
                        <div
                          className="absolute inset-0 z-10"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                        <iframe
                          key={selectedDocument.url}
                          src={`${selectedDocument.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                          title={selectedDocument.title}
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[420px] items-center justify-center p-8 text-center text-slate-500">
                    اختر ملفاً من القائمة لعرضه.
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}






