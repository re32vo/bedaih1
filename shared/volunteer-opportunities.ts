export type VolunteerOpportunity = {
  id: string;
  title: string;
  summary: string;
};

export const volunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: "p1",
    title: "مشروع السلال الغذائية",
    summary: "مساندة الفرق الميدانية في تجهيز وتوزيع السلال للأسر المحتاجة.",
  },
  {
    id: "p2",
    title: "مشروع كسوة الشتاء",
    summary: "تنظيم وفرز المواد الشتوية وتسليمها للمستفيدين في الوقت المناسب.",
  },
  {
    id: "p3",
    title: "مشروع التوعية المجتمعية",
    summary: "المشاركة في حملات التوعية والأنشطة الميدانية داخل الأحياء.",
  },
  {
    id: "p4",
    title: "مشروع الدعم الإداري",
    summary: "المساعدة في إدخال البيانات والمتابعة التنظيمية داخل مقر الجمعية.",
  },
];
