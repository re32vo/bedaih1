import { z } from "zod";

// Beneficiary Schema - with enhanced validation
export const insertBeneficiarySchema = z.object({
  fullName: z.string()
    .min(2, "يجب أن يكون الاسم على الأقل حرفين")
    .max(100, "الاسم طويل جداً")
    .regex(/^[\u0600-\u06FF\s]+$/, "الاسم يجب أن يحتوي على أحرف عربية فقط"),
  nationalId: z.string()
    .min(1, "رقم الهوية مطلوب")
    .regex(/^[0-9]{10}$/, "رقم الهوية يجب أن يكون 10 أرقام"),
  address: z.string()
    .min(5, "العنوان قصير جداً")
    .max(200, "العنوان طويل جداً"),
  phone: z.string()
    .regex(/^[0-9]{9,15}$/, "رقم الهاتف غير صحيح"),
  email: z.string()
    .email("البريد الإلكتروني غير صحيح")
    .toLowerCase(),
  assistanceType: z.string()
    .min(2, "نوع المساعدة مطلوب")
    .max(100, "نوع المساعدة طويل جداً"),
});

export type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
export interface Beneficiary extends InsertBeneficiary {
  id: number;
  createdAt: Date;
}

// Job Application Schema - with enhanced validation
export const insertJobApplicationSchema = z.object({
  fullName: z.string()
    .min(2, "يجب أن يكون الاسم على الأقل حرفين")
    .max(100, "الاسم طويل جداً"),
  experience: z.string()
    .min(5, "وصف الخبرة قصير جداً")
    .max(1000, "وصف الخبرة طويل جداً"),
  qualifications: z.enum(["ابتدائي", "متوسط", "ثانوي", "دبلوم", "بكالوريوس", "ماجستير", "دكتوراه"], {
    errorMap: () => ({ message: "الرجاء اختيار المؤهل العلمي" }),
  }),
  skills: z.string()
    .min(3, "المهارات قصيرة جداً")
    .max(500, "المهارات طويلة جداً"),
  email: z.string()
    .email("البريد الإلكتروني غير صحيح")
    .toLowerCase(),
  phone: z.string()
    .regex(/^[0-9]{9,15}$/, "رقم الهاتف غير صحيح"),
  cvUrl: z.string()
    .url("رابط السيرة الذاتية غير صحيح")
    .optional()
    .or(z.literal("")),
});

export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export interface JobApplication extends InsertJobApplication {
  id: number;
  createdAt: Date;
}

// Contact Message Schema - with enhanced validation
export const insertContactMessageSchema = z.object({
  name: z.string()
    .min(2, "يجب أن يكون الاسم على الأقل حرفين")
    .max(100, "الاسم طويل جداً"),
  email: z.string()
    .email("البريد الإلكتروني غير صحيح")
    .toLowerCase(),
  phone: z.string()
    .regex(/^[0-9]{9,15}$/, "رقم الهاتف غير صحيح"),
  message: z.string()
    .min(10, "الرسالة قصيرة جداً")
    .max(2000, "الرسالة طويلة جداً"),
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export interface ContactMessage extends InsertContactMessage {
  id: number;
  createdAt: Date;
}
