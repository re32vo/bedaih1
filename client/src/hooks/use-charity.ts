import { useMutation } from "@tanstack/react-query";
import { insertBeneficiarySchema, insertJobApplicationSchema, insertContactMessageSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

async function parseResponseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export function useCreateBeneficiary() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertBeneficiary) => {
      const parsed = insertBeneficiarySchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(parsed.error.errors[0]?.message || "بيانات غير صحيحة");
      }
      
      const response = await fetch("/api/beneficiaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const body = await parseResponseBody(response);

      if (!response.ok) {
        throw new Error(body?.message || "فشل إرسال البيانات");
      }

      return body;
    },
    onSuccess: () => {
      toast({
        title: "تم الإرسال بنجاح",
        description: "تم استلام بيانات المستفيد وسيتم مراجعتها قريباً.",
        variant: "default",
        className: "bg-green-600 text-white border-none"
      });
    },
    onError: (error: any) => {
      toast({
        title: "حدث خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useApplyJob() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertJobApplication) => {
      const parsed = insertJobApplicationSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(parsed.error.errors[0]?.message || "بيانات غير صحيحة");
      }
      
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const body = await parseResponseBody(response);

      if (!response.ok) {
        throw new Error(body?.message || "فشل إرسال الطلب");
      }

      return body;
    },
    onSuccess: () => {
      toast({
        title: "تم استلام الطلب",
        description: "شكراً لاهتمامك بالانضمام إلينا. سنتواصل معك في حال تطابق المؤهلات.",
        variant: "default",
        className: "bg-green-600 text-white border-none"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في الإرسال",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useContactMessage() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const parsed = insertContactMessageSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(parsed.error.errors[0]?.message || "بيانات غير صحيحة");
      }
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const body = await parseResponseBody(response);

      if (!response.ok) {
        throw new Error(body?.message || "فشل إرسال الرسالة");
      }

      return body;
    },
    onSuccess: () => {
      toast({
        title: "تم إرسال الرسالة",
        description: "شكراً لتواصلك معنا. سنقوم بالرد عليك قريباً.",
        variant: "default",
        className: "bg-blue-600 text-white border-none"
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
