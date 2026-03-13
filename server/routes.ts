
import type { Express } from "express";
import type { Server } from "http";
import { randomBytes } from "crypto";
import { api } from "../shared/routes";
import { z } from "zod";
import {
  sendEmail,
  getBeneficiaryConfirmationEmail,
  getJobApplicationConfirmationEmail,
  getContactConfirmationEmail,
  getAdminNotificationEmail,
  sendDonationReceipt,
  escapeHtml,
} from "./email";
import { logAuditEntry, getAuditEntries } from "./audit";
import { sendSMS } from "./sms";
import { generateOTP, storeToken, verifyToken, verifyTokenAsync, isOTPRequestRateLimited, trackOTPRequest, storeOTP, verifyOTP, invalidateToken } from "./otp";
import { Logger } from "./logger";
import {
  upsertDonor,
  createDonation,
  getDonationsByEmail,
  getDonorByEmail,
  getAllDonors,
  updateDonor,
  deleteDonor,
  logAuditToSupabase,
  createBeneficiary,
  getBeneficiariesCount,
  getRecentBeneficiaries,
  createJobApplication,
  getJobApplicationsCount,
  getRecentJobApplications,
  createContactMessage,
  getContactMessagesCount,
  getRecentContactMessages,
  createVolunteer,
  getVolunteersCount,
  getRecentVolunteers,
  getEmployeeByEmail,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  storeOTPToken,
  verifyOTPToken,
  ensurePresidentExists,
} from "./supabase";
import { activityMonitor } from "./activity-monitor";
import { appLogger } from "./advanced-logger";
import { Validator, EnhancedSchemas } from "./validation";
import { SecurityManager } from "./security";

// Extend global type for email OTP storage
declare global {
  var emailChangeOTPs: {
    [key: string]: {
      code: string;
      oldEmail: string;
      expiresAt: number;
    };
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Ensure president exists if env provided
  await ensurePresidentExists();

  const logger = new Logger("Routes");

  // Beneficiary Form
  app.post(api.beneficiaries.create.path, async (req, res) => {
    try {
      const input = api.beneficiaries.create.input.parse(req.body);
      const beneficiary = await createBeneficiary(input);
      
      // Log audit entry
      logAuditEntry({
        actor: `مستفيد: ${input.email}`,
        action: "create_beneficiary",
        details: {
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          assistanceType: input.assistanceType,
        }
      });
      
      // Send confirmation email to applicant
      await sendEmail(
        input.email,
        "تأكيد استقبال طلب المساعدة",
        getBeneficiaryConfirmationEmail(input.address)
      );
      
      // Send notification to admin if configured
      if (process.env.ADMIN_EMAIL) {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "طلب مساعدة جديد",
          getAdminNotificationEmail("beneficiary", input)
        );
      }
      
      res.status(201).json(beneficiary);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Job Application Form
  app.post(api.jobs.create.path, async (req, res) => {
    try {
      const input = api.jobs.create.input.parse(req.body);
      const application = await createJobApplication(input);
      
      // Log audit entry
      logAuditEntry({
        actor: `متقدم وظيفة: ${input.email}`,
        action: "create_job",
        details: {
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          qualifications: input.qualifications,
        }
      });
      
      // Send confirmation email to applicant
      await sendEmail(
        input.email,
        "تأكيد استقبال الطلب الوظيفي",
        getJobApplicationConfirmationEmail(input.fullName, "الوظيفة المتقدم لها")
      );
      
      // Send notification to admin if configured
      if (process.env.ADMIN_EMAIL) {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "تطبيق وظيفة جديد",
          getAdminNotificationEmail("job", input)
        );
      }
      
      res.status(201).json(application);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Contact Form
  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const message = await createContactMessage(input);
      
      // Log audit entry
      logAuditEntry({
        actor: `مراسل: ${input.email}`,
        action: "create_contact",
        details: {
          name: input.name,
          email: input.email,
          phone: input.phone,
        }
      });
      
      // Send confirmation email to sender
      await sendEmail(
        input.email,
        "تأكيد استقبال رسالتك",
        getContactConfirmationEmail(input.name)
      );
      
      // Send notification to admin if configured
      if (process.env.ADMIN_EMAIL) {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "رسالة تواصل جديدة من " + input.name,
          getAdminNotificationEmail("contact", input)
        );
      }
      
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Volunteer Form
  app.post(api.volunteers.create.path, async (req, res) => {
    try {
      const input = api.volunteers.create.input.parse(req.body);
      const volunteer = await createVolunteer(input);
      
      // Log audit entry
      logAuditEntry({
        actor: `متطوع: ${input.email}`,
        action: "create_volunteer",
        details: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          opportunityTitle: input.opportunityTitle,
        }
      });
      
      // Send confirmation email to volunteer
      await sendEmail(
        input.email,
        "شكراً لرغبتك بالتطوع",
        `<div style="font-family: Arial, sans-serif; direction: rtl;">
          <h2>مرحباً ${input.name}</h2>
          <p>شكراً لك على اهتمامك بالتطوع معنا في جمعية بَدَائِح الخيرية.</p>
          <p>تم استقبال طلبك بنجاح وسنتواصل معك قريباً.</p>
          <p>بارك الله فيك</p>
        </div>`
      );
      
      // Notify admin if configured
      if (process.env.ADMIN_EMAIL) {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "طلب تطوع جديد من " + input.name,
          `<div style="font-family: Arial, sans-serif; direction: rtl;">
            <h2>طلب تطوع جديد</h2>
            <p><strong>الاسم:</strong> ${input.name}</p>
            <p><strong>البريد:</strong> ${input.email}</p>
            <p><strong>الجوال:</strong> ${input.phone}</p>
            <p><strong>الخبرة:</strong> ${input.experience}</p>
            <p><strong>الفرصة:</strong> ${input.opportunityTitle || "عامة"}</p>
          </div>`
        );
      }
      
      res.status(201).json(volunteer);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Employees: list
  app.get("/api/employees", async (_req, res) => {
    try {
      const employees = await getAllEmployees();
      res.json({ employees });
    } catch (err) {
      res.status(500).json({ message: "حدث خطأ في جلب الموظفين" });
    }
  });

  async function requireAuth(req: any, res: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "غير مصرح" });
      return null;
    }
    const token = authHeader.substring(7);
    const email = verifyToken(token);
    const employee = email ? await getEmployeeByEmail(email) : null;
    if (!employee || !employee.active) {
      res.status(403).json({ message: "غير مصرح" });
      return null;
    }
    return employee;
  }

  function hasPermission(user: any, perm: string) {
    return user?.role === "president" || (Array.isArray(user?.permissions) && (user.permissions.includes(perm) || user.permissions.includes("*")));
  }

  // Employees: add (employees:add or president)
  app.post("/api/employees", async (req, res) => {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!hasPermission(user, "employees:add")) {
        return res.status(403).json({ message: "صلاحية غير كافية للتوظيف" });
      }
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        role: z.string().optional(),
        phone: z.string().optional(),
        notes: z.string().optional(),
        active: z.boolean().default(true),
        permissions: z.array(z.string()).optional(),
      });

      const input = schema.parse(req.body);
      console.log('إضافة موظف جديد:', input);
      
      // منع تعيين رئيس ثانٍ - يجب أن يكون رئيس واحد فقط (فقط إذا كان هناك رئيس بالفعل)
      const presidentEmail = process.env.PRESIDENT_EMAIL || process.env.HEAD_EMAIL;
      if (input.role === "president" && presidentEmail) {
        const employees = await getAllEmployees();
        const existingPresident = employees.find((e: any) => e.role === "president");
        if (existingPresident) {
          return res.status(403).json({ 
            message: "لا يمكن تعيين رئيس ثانٍ - يوجد رئيس واحد فقط في النظام وهو: " + existingPresident.name 
          });
        }
      }
      
      const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const employee = await createEmployee({
        id: newId,
        name: input.name,
        email: input.email,
        role: input.role,
        phone: input.phone,
        notes: input.notes,
        active: input.active,
        permissions: input.permissions || ["beneficiaries:view", "jobs:view", "contact:view", "audit:view"],
      });
      
      // Log action for audit trail only, don't expose sensitive data to console
      logger.info(`Employee added: ${employee.id}`);

      logAuditEntry({
        actor: user.email,
        action: "add_employee",
        details: { id: employee.id, email: employee.email, name: employee.name, role: employee.role },
      });

      // Notify head email
      const headEmail = process.env.HEAD_EMAIL || process.env.ADMIN_EMAIL;
      if (headEmail) {
        await sendEmail(
          headEmail,
          "موظف جديد تمت إضافته",
          `تمت إضافة الموظف ${employee.name} (${employee.email}) بدور ${employee.role || "-"}`
        );
      }

      res.status(201).json(employee);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(400).json({ message: err instanceof Error ? err.message : "خطأ في إضافة الموظف" });
    }
  });

  // Employees: update (PUT /api/employees/:id) - employees:edit or president
  app.put("/api/employees/:id", async (req, res) => {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!hasPermission(user, "employees:edit")) {
        return res.status(403).json({ message: "صلاحية غير كافية للتعديل" });
      }
      const schema = z.object({
        name: z.string().min(2).optional(),
        permissions: z.array(z.string()).optional(),
        active: z.boolean().optional(),
        role: z.string().nullable().optional(),
        phone: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
      });
      const data = schema.parse(req.body);
      // السماح للرئيس بتعديل بياناته، ومنع الآخرين من تعديل الرئيس
      const allEmployees = await getAllEmployees();
      const target = allEmployees.find((e: any) => e.id === req.params.id);
      
      // منع جميع الموظفين (غير الرئيس) من تعديل بيانات أنفسهم تماماً
      const isSelfEdit = target?.email.toLowerCase() === user.email.toLowerCase();
      const presidentEmail = process.env.PRESIDENT_EMAIL || process.env.HEAD_EMAIL;
      const isPresidentUser = user.email.toLowerCase() === presidentEmail?.toLowerCase();
      
      if (isSelfEdit && !isPresidentUser) {
        return res.status(403).json({ message: "لا يمكن تعديل بيانات حسابك الخاص - لا يمكن للموظفين تعديل بيانات أنفسهم" });
      }
      
      // منع تعيين رئيس ثانٍ - يجب أن يكون رئيس واحد فقط (فقط إذا كان هناك رئيس بالفعل)
      if (data.role === "president" && target?.role !== "president" && presidentEmail) {
        const existingPresident = allEmployees.find((e: any) => e.role === "president");
        if (existingPresident) {
          return res.status(403).json({ 
            message: "لا يمكن تعيين رئيس ثانٍ - يوجد رئيس واحد فقط في النظام: " + existingPresident.name 
          });
        }
      }
      
      logger.info(`Employee updated: ${req.params.id}`);
      const updated = await updateEmployee(req.params.id, data);
      
      logAuditEntry({
        actor: user.email,
        action: "update_employee",
        details: { id: req.params.id, ...data },
      });
      
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(400).json({ message: err instanceof Error ? err.message : "تعذر التحديث" });
    }
  });

  // Employees: delete (DELETE /api/employees/:id) - employees:remove or president
  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (!hasPermission(user, "employees:remove")) {
        return res.status(403).json({ message: "صلاحية غير كافية للفصل" });
      }
      const employees = await getAllEmployees();
      const targetEmployee = employees.find((e: any) => e.id === req.params.id);
      
      // منع الموظف من حذف نفسه
      if (targetEmployee?.email.toLowerCase() === user.email.toLowerCase()) {
        return res.status(403).json({ message: "لا يمكن حذف حسابك الخاص - لا يمكن للموظف حذف نفسه" });
      }
      
      // حماية حساب الرئيس من الحذف - التحقق من البريد الإلكتروني من .env
      const presidentEmail = process.env.PRESIDENT_EMAIL || process.env.HEAD_EMAIL;
      if (presidentEmail && targetEmployee?.email.toLowerCase() === presidentEmail.toLowerCase()) {
        return res.status(403).json({ message: "لا يمكن حذف حساب الرئيس - هذا الحساب محمي بشكل دائم" });
      }
      
      // حماية إضافية: منع حذف أي حساب بدور president
      if (targetEmployee?.role === "president") {
        return res.status(403).json({ message: "لا يمكن حذف الرئيس - الرئيس محمي بشكل دائم ولا يمكن حذفه أبداً" });
      }
      
      const removed = await deleteEmployee(req.params.id);
      logAuditEntry({
        actor: user.email,
        action: "delete_employee",
        details: { id: req.params.id, email: targetEmployee?.email },
      });
      res.json({ success: true, message: "تم فصل الموظف بنجاح" });
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "تعذر فصل الموظف" });
    }
  });

  // Employees: update permissions/role/active (head only via x-head-key)
  app.put("/api/employees/:id/permissions", async (req, res) => {
    const headKey = process.env.HEAD_KEY;
    const provided = req.headers["x-head-key"];
    if (!headKey || provided !== headKey) {
      return res.status(403).json({ message: "غير مصرح" });
    }
    try {
      const schema = z.object({
        permissions: z.array(z.string()).optional(),
        active: z.boolean().optional(),
        role: z.string().optional(),
      });
      const data = schema.parse(req.body);
      const updated = await updateEmployee(req.params.id, data);
      logAuditEntry({
        actor: "president",
        action: "update_permissions",
        details: { id: req.params.id, ...data },
      });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(400).json({ message: err instanceof Error ? err.message : "تعذر التحديث" });
    }
  });

  const otpLoginDisabled = process.env.DISABLE_OTP_LOGIN !== "false";

  // Employee Login - Direct Login (temporary while OTP disabled)
  app.post("/api/auth/direct-login", async (req, res) => {
    try {
      const rawEmail = req.body.email;
      const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : rawEmail;

      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
      }

      const employee = await getEmployeeByEmail(email);
      if (!employee || employee.active === false) {
        return res.status(403).json({ message: "الموظف غير مفعّل" });
      }

      const token = randomBytes(32).toString('hex');
      storeToken(token, email);

      logAuditEntry({
        actor: employee.email,
        action: "direct_login",
        details: { method: "direct" },
      });

      res.json({
        success: true,
        token,
        message: "تم تسجيل الدخول بنجاح",
      });
    } catch (err) {
      res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول" });
    }
  });

  // Employee Login - Send OTP Code
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      if (otpLoginDisabled) {
        return res.status(403).json({ message: "تم تعطيل تسجيل الدخول المؤقت حالياً" });
      }
      const rawEmail = req.body.email;
      const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : rawEmail;
      
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
      }

      // Check rate limiting
      const rateLimitCheck = isOTPRequestRateLimited(email);
      if (rateLimitCheck.limited) {
        return res.status(429).json({ message: rateLimitCheck.reason });
      }

      // Track request
      trackOTPRequest(email);

      // Validate it's an authorized employee email from employees list
      const employee = await getEmployeeByEmail(email);
      if (!employee || employee.active === false) {
        console.warn(`Auth OTP requested for unregistered or inactive employee: ${email}`);
        return res.status(403).json({ message: "البريد الإلكتروني غير مسجل كموظف" });
      }

      // Generate OTP code with error handling
      let otp;
      try {
        console.log(`[/api/auth/send-otp] Generating OTP for ${email}`);
        otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        await storeOTPToken(email, otp, expiresAt);
        console.log(`[/api/auth/send-otp] OTP stored successfully`);
      } catch (storeError) {
        console.error("[/api/auth/send-otp] Error storing OTP token:", storeError);
        return res.status(500).json({ message: "خطأ في حفظ كود التحقق - الرجاء المحاولة لاحقاً" });
      }

      const emailHtml = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>كود التحقق</title>
        </head>
        <body style="font-family: Arial, sans-serif; direction: rtl;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(to left, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0;">✓ كود التحقق</h1>
            </div>
            
            <div style="background: white; padding: 30px; margin-top: 20px; border-radius: 10px;">
              <p style="font-size: 16px; color: #333;">مرحباً ${employee.name},</p>
              <p style="color: #666; line-height: 1.6;">استخدم الكود أدناه للدخول إلى لوحة التحكم.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; font-size: 32px; letter-spacing: 8px; font-weight: bold; font-family: monospace;">
                  ${otp}
                </div>
              </div>
              
              <div style="background: #fffbea; border-right: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>⚠️ ملاحظة أمان:</strong><br>
                  • الكود صالح لـ 5 دقائق فقط<br>
                  • لا تشارك هذا الكود مع أحد<br>
                  • إذا لم تطلب ذلك، تجاهل هذه الرسالة
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                هذه رسالة آلية، يرجى عدم الرد عليها
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      const emailSent = await sendEmail(
        email,
        "🔐 كود التحقق - نظام إدارة الجمعية",
        emailHtml,
        { requireProviderDelivery: true }
      );

      if (!emailSent) {
        console.error("[/api/auth/send-otp] Failed to deliver employee OTP via email");
        logger.error("Failed to deliver employee OTP via email", {
          email,
        } as any);
        return res.status(502).json({
          message: "تعذر إرسال كود التحقق إلى البريد الإلكتروني حالياً. يرجى المحاولة لاحقاً أو التواصل مع المسؤول للتأكد من إعدادات Gmail.",
        });
      }

      // تم إيقاف إشعارات البريد للمسؤول عند طلب الدخول لتقليل الإزعاج

      try {
        logAuditEntry({
          actor: employee.email,
          action: "send_otp",
          details: { expiresIn: "5 دقائق" },
        });
      } catch (auditError) {
        console.error("[/api/auth/send-otp] Error logging audit entry:", auditError);
        // Don't fail the entire request if audit logging fails
      }

      console.log(`[/api/auth/send-otp] OTP sent successfully to ${email}`);
      res.json({ 
        message: "تم إرسال كود التحقق إلى بريدك الإلكتروني",
        expiresIn: "5 دقائق"
      });
    } catch (err) {
      console.error("[/api/auth/send-otp] Unhandled error:", err);
      logger.error("OTP error", err);
      res.status(500).json({ message: "حدث خطأ أثناء إرسال كود التحقق" });
    }
  });

  // Employee Login - Verify OTP and login
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      console.log("[/api/auth/verify-otp] Request received");
      
      if (otpLoginDisabled) {
        console.log("[/api/auth/verify-otp] OTP login disabled");
        return res.status(403).json({ message: "تم تعطيل تسجيل الدخول المؤقت حالياً" });
      }
      
      const rawEmail = req.body.email;
      const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : rawEmail;
      const code = req.body.code;

      console.log(`[/api/auth/verify-otp] Email: ${email}, Code length: ${code ? code.length : 0}`);

      if (!email || !code) {
        console.log("[/api/auth/verify-otp] Missing email or code");
        return res.status(400).json({ message: "البريد الإلكتروني والكود مطلوبان" });
      }

      // Verify OTP with error handling
      let otpToken;
      try {
        console.log("[/api/auth/verify-otp] Calling verifyOTPToken...");
        otpToken = await verifyOTPToken(email, code);
        console.log(`[/api/auth/verify-otp] OTP verification result: ${!!otpToken}`);
      } catch (otpError) {
        console.error("[/api/auth/verify-otp] Error verifying OTP token:", otpError);
        return res.status(500).json({ message: "خطأ في التحقق من الكود - الرجاء المحاولة لاحقاً" });
      }

      if (!otpToken) {
        console.log("[/api/auth/verify-otp] OTP token invalid or expired");
        return res.status(401).json({ message: "كود التحقق غير صحيح أو انتهى" });
      }

      // Get employee with error handling
      let employee;
      try {
        console.log("[/api/auth/verify-otp] Fetching employee...");
        employee = await getEmployeeByEmail(email);
        console.log(`[/api/auth/verify-otp] Employee found: ${!!employee}, active: ${employee?.active}`);
      } catch (empError) {
        console.error("[/api/auth/verify-otp] Error fetching employee:", empError);
        return res.status(500).json({ message: "خطأ في البحث عن الموظف - الرجاء المحاولة لاحقاً" });
      }

      if (!employee || !employee.active) {
        console.warn(`[/api/auth/verify-otp] OTP verify attempted for unregistered/inactive employee: ${email}`);
        return res.status(403).json({ message: "الموظف غير مفعّل" });
      }

      // Generate secure token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // Store token with email mapping
      storeToken(token, email);
      console.log("[/api/auth/verify-otp] Token stored");

      const emailHtml = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>تم التحقق</title>
        </head>
        <body style="font-family: Arial, sans-serif; direction: rtl;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(to left, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0;">✓ تم التحقق بنجاح</h1>
            </div>
            
            <div style="background: white; padding: 30px; margin-top: 20px; border-radius: 10px;">
              <p style="font-size: 16px; color: #333;">مرحباً بك</p>
              <p style="color: #666; line-height: 1.6;">تم التحقق من حسابك بنجاح. يمكنك الآن الدخول إلى لوحة التحكم.</p>
              <p style="color: #999; font-size: 12px; margin-top: 20px;">تم التحقق في ${new Date().toLocaleString("ar-SA")}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send verification email with error handling (non-blocking)
      try {
        console.log("[/api/auth/verify-otp] Sending verification email...");
        const emailSent = await sendEmail(
          email,
          "✓ تم التحقق بنجاح - نظام إدارة الجمعية",
          emailHtml
        );
        console.log(`[/api/auth/verify-otp] Email sent result: ${emailSent}`);
      } catch (emailError) {
        console.error("[/api/auth/verify-otp] Error sending email (non-blocking):", emailError);
        // Don't fail the entire request if email fails
      }

      // تم إيقاف إشعارات البريد للمسؤول عند التحقق من الدخول لتقليل الإزعاج

      try {
        logAuditEntry({
          actor: employee.email,
          action: "otp_verified",
          details: { token },
        });
      } catch (auditError) {
        console.error("[/api/auth/verify-otp] Error logging audit entry:", auditError);
        // Don't fail the entire request if audit logging fails
      }

      console.log("[/api/auth/verify-otp] OTP verification successful");
      res.json({ 
        success: true,
        token,
        message: "تم التحقق بنجاح"
      });
    } catch (err) {
      console.error("[/api/auth/verify-otp] Unhandled error:", err);
      logger.error("Verify OTP error", err);
      res.status(500).json({ message: "حدث خطأ أثناء التحقق" });
    }
  });

  // Test endpoint - Get token for testing  
  app.post("/api/test-token", async (req, res) => {
    try {
      const email = req.body.email || "bedaihsa@gmail.com";
      const employee = await getEmployeeByEmail(email);
      if (!employee) {
        return res.status(404).json({ message: "الموظف غير موجود" });
      }

      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      storeToken(token, email);

      res.json({
        success: true,
        token,
        email: employee.email,
        name: employee.name,
        role: employee.role,
        permissions: employee.permissions || [],
        message: "Token created for testing",
      });
    } catch (err) {
      res.status(500).json({ message: "Error creating test token" });
    }
  });

  app.post("/api/auth/verify-token", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      console.log(`[/api/auth/verify-token] Authorization header present: ${!!authHeader}`);
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("[/api/auth/verify-token] No Bearer token provided");
        return res.status(401).json({ message: "غير مصرح" });
      }

      const token = authHeader.substring(7);
      console.log(`[/api/auth/verify-token] Token extracted: ${token.substring(0, 10)}...`);
      
      if (!token) {
        console.log("[/api/auth/verify-token] Token is empty");
        return res.status(401).json({ message: "رابط غير صحيح" });
      }

      // Verify token and get email (check async for cold start recovery)
      let email = verifyToken(token);
      if (!email) {
        // Try async version for database fallback (e.g., after Vercel cold start)
        email = await verifyTokenAsync(token);
      }
      console.log(`[/api/auth/verify-token] Email from token: ${email}`);
      
      if (!email) {
        console.log("[/api/auth/verify-token] Token verification failed");
        return res.status(401).json({ message: "التوكين غير صحيح أو انتهى" });
      }

      const employee = await getEmployeeByEmail(email);
      console.log(`[/api/auth/verify-token] Employee found: ${!!employee}, active: ${employee?.active}`);
      
      if (!employee || !employee.active) {
        console.log("[/api/auth/verify-token] Employee not found or inactive");
        return res.status(403).json({ message: "الموظف غير مفعّل" });
      }
      
      console.log(`[/api/auth/verify-token] Success for ${employee.email}`);
      
      // Ensure permissions is always an array
      let permissions = employee.permissions || [];
      if (typeof permissions === 'string') {
        try {
          permissions = JSON.parse(permissions);
        } catch (e) {
          permissions = [];
        }
      }
      if (!Array.isArray(permissions)) {
        permissions = [];
      }
      
      console.log(`[/api/auth/verify-token] Returning permissions:`, permissions);
      res.json({ 
        success: true,
        email: employee.email,
        name: employee.name,
        role: employee.role,
        permissions: permissions,
        message: "تم التحقق بنجاح"
      });
    } catch (err) {
      console.error("[/api/auth/verify-token] Error:", err);
      res.status(401).json({ message: "فشل التحقق" });
    }
  });

  // Dashboard Stats - Protected (requires valid token)
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      const token = authHeader.substring(7);
      let email = verifyToken(token);
      if (!email) {
        email = await verifyTokenAsync(token);
      }
      if (!email) {
        return res.status(401).json({ message: "التوكين غير صحيح" });
      }

      const employee = await getEmployeeByEmail(email);
      if (!employee || !employee.active) {
        return res.status(403).json({ message: "الموظف غير مفعّل" });
      }

      // Get counts from Supabase
      const beneficiariesCount = await getBeneficiariesCount();
      const jobApplicationsCount = await getJobApplicationsCount();
      const contactMessagesCount = await getContactMessagesCount();
      const volunteersCount = await getVolunteersCount();

      res.json({
        beneficiaries: beneficiariesCount,
        jobs: jobApplicationsCount,
        contacts: contactMessagesCount,
        volunteers: volunteersCount,
        total: beneficiariesCount + jobApplicationsCount + contactMessagesCount + volunteersCount,
      });
    } catch (err) {
      logger.error("Dashboard stats error", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  // Dashboard Recent Items - Protected
  app.get("/api/dashboard/recent", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      const token = authHeader.substring(7);
      let email = verifyToken(token);
      if (!email) {
        email = await verifyTokenAsync(token);
      }
      if (!email) {
        return res.status(401).json({ message: "التوكين غير صحيح" });
      }

      const employee = await getEmployeeByEmail(email);
      if (!employee || !employee.active) {
        return res.status(403).json({ message: "الموظف غير مفعّل" });
      }

      const limit = Number(req.query.limit || 5);
      const recentBeneficiaries = await getRecentBeneficiaries(limit);
      const recentJobs = await getRecentJobApplications(limit);
      const recentContacts = await getRecentContactMessages(limit);
      const recentVolunteers = await getRecentVolunteers(limit);

      res.json({
        beneficiaries: recentBeneficiaries,
        jobs: recentJobs,
        contacts: recentContacts,
        volunteers: recentVolunteers,
      });
    } catch (err) {
      logger.error("Dashboard recent error", err);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  // Audit log - requires 'audit:view' permission (or HEAD_KEY override)
  app.get("/api/audit", async (req, res) => {
    try {
      const headKey = process.env.HEAD_KEY;
      const provided = req.headers["x-head-key"];    

      // Allow secret key override for ops
      if (headKey && provided === headKey) {
        const limit = Number(req.query.limit || 1000);
        const raw = await getAuditEntries(limit > 0 && limit <= 5000 ? limit : 1000);

        // Optional filters: action, from, to (ISO or parseable date)
        const action = (req.query.action as string | undefined)?.trim();
        const from = (req.query.from as string | undefined)?.trim();
        const to = (req.query.to as string | undefined)?.trim();

        const fromTime = from ? Date.parse(from) : undefined;
        const toTime = to ? Date.parse(to) : undefined;

        const entries = raw.filter((e) => {
          const t = Date.parse(e.timestamp);
          const actionOk = action ? e.action === action : true;
          const fromOk = fromTime ? t >= fromTime : true;
          const toOk = toTime ? t <= toTime : true;
          return actionOk && fromOk && toOk;
        });

        return res.json({ entries });
      }

      // Otherwise require authenticated employee with 'audit:view'
      const user = await requireAuth(req as any, res as any);
      if (!user) return;
      
      const hasAuditPermission = user.role === "president" || (Array.isArray(user.permissions) && user.permissions.includes("audit:view"));
      if (!hasAuditPermission) {
        return res.status(403).json({ message: "غير مصرح" });
      }

      const limit = Number(req.query.limit || 1000);
      const raw = await getAuditEntries(limit > 0 && limit <= 5000 ? limit : 1000);

      // Optional filters: action, from, to (ISO or parseable date)
      const action = (req.query.action as string | undefined)?.trim();
      const from = (req.query.from as string | undefined)?.trim();
      const to = (req.query.to as string | undefined)?.trim();

      const fromTime = from ? Date.parse(from) : undefined;
      const toTime = to ? Date.parse(to) : undefined;

      const entries = raw.filter((e) => {
        const t = Date.parse(e.timestamp);
        const actionOk = action ? e.action === action : true;
        const fromOk = fromTime ? t >= fromTime : true;
        const toOk = toTime ? t <= toTime : true;
        return actionOk && fromOk && toOk;
      });

      res.json({ entries });
    } catch (err) {
      console.error("Error in /api/audit:", err);
      res.status(500).json({ message: "خطأ في جلب السجلات", entries: [] });
    }
  });

  // Employee Dashboard (Protected)
  app.get("/api/auth/verify", (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(401).json({ message: "رابط غير صحيح" });
      }

      // In production, verify token from database
      // For now, just return success
      res.json({ 
        success: true,
        message: "تم التحقق بنجاح",
        token 
      });
    } catch (err) {
      res.status(401).json({ message: "فشل التحقق" });
    }
  });

  // Donor OTP System - Send OTP for login/registration
  app.post("/api/donors/send-otp", async (req, res) => {
    try {
      const { email, name, phone, isLogin } = req.body;
      
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: "البريد الإلكتروني غير صالح" });
      }

      // Trim and lowercase email for consistency
      const normalizedEmail = email.trim().toLowerCase();

      // Check if donor exists in database
      const existingDonor = await getDonorByEmail(normalizedEmail);

      // If login mode, require existing account
      if (isLogin && !existingDonor) {
        return res.status(404).json({ 
          message: "الحساب غير موجود. يرجى إنشاء حساب جديد أولاً",
          shouldRegister: true 
        });
      }

      // If registration mode, check for duplicate account
      if (!isLogin && existingDonor) {
        return res.status(409).json({ 
          message: "الحساب موجود مسبقاً. يرجى تسجيل الدخول",
          shouldLogin: true 
        });
      }

      // For registration, require name and phone
      if (!isLogin && (!name || !phone)) {
        return res.status(400).json({ message: "الاسم ورقم الهاتف مطلوبان للتسجيل" });
      }

      // Validate name (Arabic characters only)
      if (!isLogin && name) {
        const arabicNameRegex = /^[\u0600-\u06FF\s]{2,100}$/;
        if (!arabicNameRegex.test(name.trim())) {
          return res.status(400).json({ message: "الاسم يجب أن يحتوي على أحرف عربية فقط" });
        }
      }

      // Validate phone (9-15 digits)
      if (!isLogin && phone) {
        const phoneRegex = /^[0-9]{9,15}$/;
        if (!phoneRegex.test(phone.trim())) {
          return res.status(400).json({ message: "رقم الهاتف يجب أن يحتوي على 9-15 أرقام" });
        }
      }

      // Check rate limiting
      const rateLimitCheck = isOTPRequestRateLimited(normalizedEmail);
      if (rateLimitCheck.limited) {
        return res.status(429).json({ message: rateLimitCheck.reason });
      }

      trackOTPRequest(normalizedEmail);

      // Generate OTP code with error handling
      let otp;
      try {
        console.log(`[/api/donors/send-otp] Generating OTP for ${normalizedEmail}`);
        otp = generateOTP();
        
        // Store OTP token in persistent storage (same behavior as employee OTP)
        const expiresAt = new Date(Date.now() + (isLogin ? 5 : 10) * 60 * 1000);
        const metadata = !isLogin ? { name: name ? name.trim() : "", phone: phone ? phone.trim() : "", isRegistration: true } : undefined;
        await storeOTPToken(normalizedEmail, otp, expiresAt, metadata);
        console.log(`[/api/donors/send-otp] OTP stored successfully for ${normalizedEmail}`);
      } catch (storeError) {
        console.error("[/api/donors/send-otp] Error storing OTP token:", storeError);
        return res.status(500).json({ message: "خطأ في حفظ كود التحقق - الرجاء المحاولة لاحقاً" });
      }

      const safeName = escapeHtml(name || 'عزيزنا المتبرع');
      const emailHtml = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>كود التحقق</title>
        </head>
        <body style="font-family: Arial, sans-serif; direction: rtl;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(to left, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0;">💚 كود التحقق للمتبرعين</h1>
            </div>
            
            <div style="background: white; padding: 30px; margin-top: 20px; border-radius: 10px;">
              <p style="font-size: 16px; color: #333;">مرحباً ${safeName},</p>
              <p style="color: #666; line-height: 1.6;">
                ${isLogin ? 'استخدم الكود أدناه لتسجيل الدخول.' : 'استخدم الكود أدناه لإنشاء حسابك الجديد وتتبع تبرعاتك.'}
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; font-size: 32px; letter-spacing: 8px; font-weight: bold; font-family: monospace;">
                  ${otp}
                </div>
              </div>
              
              <div style="background: ${isLogin ? '#f0fdf4' : '#fffbea'}; border-right: 4px solid ${isLogin ? '#10b981' : '#f59e0b'}; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #333; font-size: 14px;">
                  <strong>${isLogin ? '✓ تسجيل الدخول' : '⚠️ إنشاء حساب جديد'}:</strong><br>
                  • الكود صالح لـ ${isLogin ? '5' : '10'} دقائق فقط<br>
                  • ${isLogin ? 'أدخل الكود للوصول لحسابك' : 'لن يتم إنشاء الحساب إلا بعد إدخال الكود'}<br>
                  • لا تشارك هذا الكود مع أحد
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                شكراً لدعمكم ❤️ - نظام إدارة الجمعية الخيرية
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      const emailSent = await sendEmail(
        normalizedEmail,
        `🔐 كود التحقق - ${isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}`,
        emailHtml,
        { requireProviderDelivery: true }
      );

      if (!emailSent) {
        logger.error("Failed to deliver donor OTP via email", {
          email: normalizedEmail,
          isLogin,
        } as any);
        return res.status(502).json({
          message: "تعذر إرسال كود التحقق إلى البريد الإلكتروني حالياً. يرجى المحاولة لاحقاً أو التواصل مع المسؤول للتأكد من إعدادات Gmail.",
        });
      }

      logAuditEntry({
        actor: `متبرع: ${normalizedEmail}`,
        action: isLogin ? "طلب كود تسجيل دخول" : "طلب كود إنشاء حساب",
        details: { expiresIn: `${isLogin ? '5' : '10'} دقائق` },
      });

      const responsePayload: any = {
        message: "تم إرسال كود التحقق إلى بريدك الإلكتروني",
        expiresIn: `${isLogin ? '5' : '10'} دقائق`
      };

      res.json(responsePayload);
    } catch (err) {
      logger.error("Donor OTP error", err);
      res.status(500).json({ message: "حدث خطأ أثناء إرسال كود التحقق" });
    }
  });

  // Donor Verify OTP
  app.post("/api/donors/verify-otp", async (req, res) => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({ message: "البريد الإلكتروني والكود مطلوبان" });
      }

      const normalizedEmail = email.trim().toLowerCase();
      
      // Verify OTP token with error handling
      let tokenRecord;
      try {
        console.log(`[/api/donors/verify-otp] Verifying OTP for ${normalizedEmail}`);
        tokenRecord = await verifyOTPToken(normalizedEmail, code);
        console.log(`[/api/donors/verify-otp] OTP verification result: ${!!tokenRecord}`);
      } catch (otpError) {
        console.error("[/api/donors/verify-otp] Error verifying OTP token:", otpError);
        return res.status(500).json({ message: "خطأ في التحقق من الكود - الرجاء المحاولة لاحقاً" });
      }

      if (!tokenRecord) {
        return res.status(401).json({ message: "كود التحقق غير صحيح أو انتهى" });
      }

      const isRegistration = Boolean((tokenRecord as any)?.metadata?.isRegistration);

      // Prepare donor data
      let donorData: any = {
        email: normalizedEmail,
        lastLogin: true,
      };

      if (isRegistration) {
        donorData.name = (tokenRecord as any)?.metadata?.name || "";
        donorData.phone = (tokenRecord as any)?.metadata?.phone || "";
      }
      
      // Save to database with error handling
      let donor;
      try {
        console.log(`[/api/donors/verify-otp] Saving donor data...`);
        donor = await upsertDonor(donorData);
        console.log(`[/api/donors/verify-otp] Donor saved successfully`);
      } catch (dbError) {
        console.error("[/api/donors/verify-otp] Error saving donor:", dbError);
        return res.status(500).json({ message: "خطأ في حفظ البيانات - الرجاء المحاولة لاحقاً" });
      }

      // If this is registration, create the account now
      try {
        if (isRegistration) {
          logAuditEntry({
            actor: `متبرع: ${normalizedEmail}`,
            action: "تسجيل حساب متبرع جديد",
            details: {
              email: donor.email,
              name: donor.name,
              phone: donor.phone,
              type: "donor_registration"
            }
          });
        } else {
          logAuditEntry({
            actor: `متبرع: ${normalizedEmail}`,
            action: "تسجيل دخول متبرع",
            details: {
              email: donor.email,
              name: donor.name,
              phone: donor.phone,
              type: "donor_login"
            }
          });
        }
      } catch (auditError) {
        console.error("[/api/donors/verify-otp] Error logging audit entry:", auditError);
        // Don't fail the entire request if audit logging fails
      }

      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      storeToken(token, normalizedEmail);
      
      console.log(`[/api/donors/verify-otp] Token generated and stored for ${normalizedEmail}`);

      res.json({ 
        success: true,
        message: isRegistration ? "تم إنشاء الحساب بنجاح" : "تم تسجيل الدخول بنجاح",
        token
      });
    } catch (err) {
      console.error("[/api/donors/verify-otp] Unhandled error:", err);
      logger.error("Donor verify OTP error", err);
      res.status(500).json({ message: "حدث خطأ أثناء التحقق" });
    }
  });

  // Donor Registration & Login (New routes for tracking donations)
  app.post("/api/donors/login", async (req, res) => {
    try {
      const { email } = req.body;
      const normalizedEmail = (email || "").toString().trim().toLowerCase();

      // Log the login in audit log
      logAuditEntry({
        actor: `متبرع: ${normalizedEmail}`,
        action: "تسجيل دخول متبرع",
        details: {
          email: normalizedEmail,
          type: "donor_login"
        }
      });

      // Best-effort: send SMS notification to donor if phone exists
      (async () => {
        try {
          const donor = await getDonorByEmail(normalizedEmail);
          if (donor && donor.phone) {
            const safeName = donor.name || "متبرع";
            const message = `مرحباً ${safeName}، تم تسجيل دخولك بنجاح إلى حسابك في جمعية بَدَائِح. شكراً لكونك معنا.`;
            await sendSMS(donor.phone, message);
          }
        } catch (smsErr) {
          logger.error("Failed to send SMS after donor login", smsErr);
        }
      })();

      res.status(200).json({ 
        success: true,
        message: "تم تسجيل الدخول بنجاح"
      });
    } catch (err) {
      logger.error("Donor login error", err);
      res.status(500).json({ message: "خطأ في تسجيل الدخول" });
    }
  });

  // Create donor account directly (for admin/initial setup)
  app.post("/api/donors/create-account", async (req, res) => {
    try {
      const headKey = process.env.HEAD_KEY;
      const provided = req.headers["x-head-key"];
      
      // Allow secret key override for admin only
      if (!headKey || provided !== headKey) {
        return res.status(403).json({ message: "غير مصرح" });
      }

      const { email, name, phone } = req.body;
      
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check if donor exists
      const existingDonor = await getDonorByEmail(normalizedEmail);
      if (existingDonor) {
        return res.status(409).json({ 
          message: "الحساب موجود مسبقاً",
          donor: existingDonor 
        });
      }

      // Create new donor account
      const donor = await upsertDonor({
        email: normalizedEmail,
        name: name || "متبرع",
        phone: phone || "",
        lastLogin: true
      });

      logAuditEntry({
        actor: "Administrator",
        action: "create_donor_account",
        details: {
          email: normalizedEmail,
          name: donor?.name,
          phone: donor?.phone,
        }
      });

      res.status(201).json({ 
        success: true,
        message: "تم إنشاء حساب المتبرع بنجاح",
        donor
      });
    } catch (err) {
      logger.error("Error creating donor account", err);
      res.status(500).json({ message: "خطأ في إنشاء الحساب" });
    }
  });

  app.post("/api/donors/register", async (req, res) => {
    try {
      const { email, name, phone } = req.body;
      
      // Log the registration in audit log
      logAuditEntry({
        actor: `متبرع: ${email}`,
        action: "تسجيل حساب متبرع جديد",
        details: {
          email,
          name,
          phone,
          type: "donor_registration"
        }
      });

      res.status(201).json({ 
        success: true,
        message: "تم التسجيل بنجاح"
      });
    } catch (err) {
      res.status(500).json({ message: "خطأ في التسجيل" });
    }
  });

  app.post("/api/donors/donation", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const { email, amount, method, code, name } = req.body;

      // Verify token if provided (for logged in donors)
      let donorEmail = email;
      let donorName = (typeof name === 'string' && name.trim()) ? name.trim() : "متبرع";
      
      if (token) {
        const verifiedEmail = verifyToken(token);
        if (verifiedEmail) {
          donorEmail = verifiedEmail; // Use verified email from token
          
          // Get donor name from database
          const donor = await getDonorByEmail(donorEmail);
          if (donor) {
            donorName = donor.name || "متبرع";
          }
        }
      }

      const isAnonymousDonation = typeof donorEmail === 'string' && donorEmail.endsWith('@donation.local');

      // Ensure donor record exists for dashboard/admin tracking
      if (isAnonymousDonation) {
        donorName = "فاعل خير";
        await upsertDonor({
          email: donorEmail,
          name: donorName,
          phone: "",
          lastLogin: false,
        });
      } else if (donorEmail) {
        await upsertDonor({
          email: donorEmail,
          name: donorName,
          lastLogin: false,
        });
      }

      // Save to Supabase
      await createDonation({
        email: donorEmail,
        amount: Number(amount) || 0,
        method: method || "unknown",
        code,
      });
      
      // Log the donation in audit log
      logAuditEntry({
        actor: `متبرع: ${donorEmail}`,
        action: "تبرع جديد",
        details: {
          email: donorEmail,
          amount,
          method,
          code,
          type: "donor_donation"
        }
      });

      // Send receipt email if not anonymous donation
      if (!isAnonymousDonation) {
        try {
          await sendDonationReceipt(donorEmail, donorName, Number(amount), method, code);
        } catch (emailErr) {
          logger.error("Failed to send donation receipt", emailErr);
          // Log but don't fail the donation
          logAuditEntry({
            actor: `متبرع: ${donorEmail}`,
            action: "تجاهل خطأ إرسال إيصال التبرع",
            details: {
              amount,
              method,
              error: emailErr instanceof Error ? emailErr.message : String(emailErr)
            }
          });
        }
      }

      res.status(201).json({ 
        success: true,
        message: "تم تسجيل التبرع بنجاح"
      });
    } catch (err) {
      logger.error("Donation save error", err);
      res.status(500).json({ message: "خطأ في تسجيل التبرع" });
    }
  });

  // Get donor dashboard data (profile + donations)
  app.get("/api/donors/dashboard", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      let email = verifyToken(token);
      
      // Fallback to async verification from database
      if (!email) {
        email = await verifyTokenAsync(token);
        if (!email) {
          return res.status(401).json({ message: "رمز غير صالح" });
        }
      }

      const donor = await getDonorByEmail(email);
      if (!donor) {
        return res.status(404).json({ message: "المتبرع غير موجود" });
      }

      const donations = await getDonationsByEmail(email);

      res.json({
        donor: {
          name: donor.name,
          email: donor.email,
          phone: donor.phone
        },
        donations: donations.map((d: any) => ({
          id: d.id.toString(),
          amount: d.amount,
          date: d.createdAt ? (typeof d.createdAt === 'string' ? d.createdAt.split('T')[0] : new Date(d.createdAt).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
          method: d.method,
          code: d.code
        })),
        stats: {
          totalDonations: donations.reduce((sum: number, d: any) => sum + d.amount, 0),
          donationCount: donations.length,
          avgDonation: donations.length > 0 ? Math.round(donations.reduce((sum: number, d: any) => sum + d.amount, 0) / donations.length) : 0
        }
      });
    } catch (err) {
      logger.error("Dashboard fetch error", err);
      res.status(500).json({ message: "خطأ في جلب البيانات" });
    }
  });

  // Verify donor token endpoint
  app.post("/api/donors/verify-token", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ success: false, message: "غير مصرح" });
      }

      let email = verifyToken(token);
      
      // Fallback to async verification from database
      if (!email) {
        email = await verifyTokenAsync(token);
        if (!email) {
          return res.status(401).json({ success: false, message: "رمز غير صالح" });
        }
      }

      const donor = await getDonorByEmail(email);
      if (!donor) {
        return res.status(404).json({ success: false, message: "المتبرع غير موجود" });
      }

      res.json({
        success: true,
        email: donor.email,
        name: donor.name,
        message: "تم التحقق بنجاح"
      });
    } catch (err) {
      logger.error("Donor token verification error", err);
      res.status(401).json({ success: false, message: "فشل التحقق" });
    }
  });

  // Update donor email endpoint
  app.put("/api/donors/email", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      let currentEmail = verifyToken(token);
      
      // Fallback to async verification from database
      if (!currentEmail) {
        currentEmail = await verifyTokenAsync(token);
        if (!currentEmail) {
          return res.status(401).json({ message: "رمز غير صالح" });
        }
      }

      const donor = await getDonorByEmail(currentEmail);
      if (!donor) {
        return res.status(404).json({ message: "المتبرع غير موجود" });
      }

      const { newEmail, verificationCode } = req.body;
      if (!newEmail) {
        return res.status(400).json({ message: "البريد الجديد مطلوب" });
      }

      // إذا لم يكن هناك verification code، أرسل OTP
      if (!verificationCode) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // حفظ الـ OTP مؤقتاً
        if (!global.emailChangeOTPs) global.emailChangeOTPs = {};
        global.emailChangeOTPs[newEmail] = {
          code: otp,
          oldEmail: currentEmail,
          expiresAt: Date.now() + 10 * 60 * 1000 // 10 دقائق
        };

        // إرسال الرسالة
        const emailHtml = `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <title>رمز التحقق من تغيير البريد</title>
          </head>
          <body style="font-family: Arial, sans-serif; direction: rtl;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
              <div style="background: linear-gradient(to left, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0;">🔐 رمز التحقق</h1>
              </div>
              
              <div style="background: white; padding: 30px; margin-top: 20px; border-radius: 10px;">
                <p style="font-size: 16px; color: #333;">مرحباً بك،</p>
                <p style="color: #666; line-height: 1.6;">تم طلب تغيير البريد الإلكتروني المرتبط بحسابك. استخدم الرمز أدناه للتحقق:</p>
                
                <div style="background: #f0f0f0; border: 2px dashed #10b981; padding: 20px; text-align: center; margin: 30px 0; border-radius: 10px;">
                  <p style="font-size: 32px; font-weight: bold; color: #059669; margin: 0; letter-spacing: 5px;">${otp}</p>
                </div>
                
                <p style="color: #999; font-size: 12px;">⏱️ الرمز صالح لمدة 10 دقائق فقط</p>
                <p style="color: #999; font-size: 12px;">إذا لم تطلب هذا التغيير، يرجى تجاهل هذا البريد</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendEmail(
          newEmail,
          "🔐 رمز التحقق من تغيير البريد - نظام إدارة الجمعية",
          emailHtml
        );

        return res.json({ 
          success: true, 
          message: "تم إرسال رمز التحقق للبريد الجديد",
          requiresVerification: true,
          newEmail: newEmail
        });
      }

      // تحقق من الـ OTP
      const otpData = global.emailChangeOTPs?.[newEmail];
      if (!otpData) {
        return res.status(400).json({ message: "لا يوجد طلب تحقق لهذا البريد" });
      }

      if (otpData.code !== verificationCode) {
        return res.status(400).json({ message: "رمز التحقق غير صحيح" });
      }

      if (otpData.expiresAt < Date.now()) {
        delete global.emailChangeOTPs[newEmail];
        return res.status(400).json({ message: "رمز التحقق انتهت صلاحيته" });
      }

      // تحقق من أن البريد الجديد غير مستخدم
      const existingDonor = await getDonorByEmail(newEmail);
      if (existingDonor) {
        return res.status(400).json({ message: "هذا البريد الإلكتروني مستخدم بالفعل" });
      }

      // حذف الـ OTP
      delete global.emailChangeOTPs[newEmail];

      // تحديث البريد
      const updates = { newEmail };
      let updatedDonor;
      try {
        updatedDonor = await updateDonor(currentEmail, updates);
      } catch (updateError: any) {
        logger.error("Error updating donor:", updateError);
        return res.status(400).json({ 
          message: updateError.message || "فشل تحديث البريد الإلكتروني"
        });
      }

      // حذف الـ token القديم من النظام
      const oldToken = req.headers.authorization?.split(' ')[1];
      if (oldToken) {
        invalidateToken(oldToken);
      }

      // توليد token جديد بالبريد الجديد
      const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      storeToken(newToken, newEmail);

      logAuditEntry({
        actor: `متبرع: ${donor.name} (${currentEmail})`,
        action: "تحديث_بريد",
        details: {
          oldEmail: currentEmail,
          newEmail: newEmail,
          type: "donor_email_update"
        }
      });

      res.json({ success: true, donor: updatedDonor, token: newToken });
    } catch (err) {
      logger.error("Update donor email error", err);
      res.status(500).json({ message: "خطأ في تحديث البريد" });
    }
  });

  app.post("/api/donors/profile-update", async (req, res) => {
    try {
      const { email, name, phone, oldEmail } = req.body;
      
      // Log the profile update in audit log
      logAuditEntry({
        actor: `متبرع: ${oldEmail || email}`,
        action: "تحديث بيانات الحساب",
        details: {
          oldEmail,
          newEmail: email,
          name,
          phone,
          type: "donor_profile_update"
        }
      });

      res.status(200).json({ 
        success: true,
        message: "تم تحديث البيانات بنجاح"
      });
    } catch (err) {
      res.status(500).json({ message: "خطأ في تحديث البيانات" });
    }
  });

  // Update donor profile
  app.put("/api/donors/profile", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      let email = verifyToken(token);
      
      // Fallback to async verification from database
      if (!email) {
        email = await verifyTokenAsync(token);
        if (!email) {
          return res.status(401).json({ message: "صلاحية غير صحيحة أو منتهية" });
        }
      }

      const { name, phone } = req.body;

      // Validate name (Arabic only)
      if (name) {
        const arabicNameRegex = /^[\u0600-\u06FF\s]{2,100}$/;
        if (!arabicNameRegex.test(name.trim())) {
          return res.status(400).json({ message: "الاسم يجب أن يحتوي على أحرف عربية فقط" });
        }
      }

      // Validate phone
      if (phone) {
        const phoneRegex = /^[0-9]{9,15}$/;
        if (!phoneRegex.test(phone.trim())) {
          return res.status(400).json({ message: "رقم الهاتف يجب أن يحتوي على 9-15 أرقام" });
        }
      }

      const updated = await updateDonor(email, {
        name: name?.trim(),
        phone: phone?.trim()
      });

      res.json({
        success: true,
        message: "تم تحديث البيانات بنجاح",
        donor: {
          name: updated.name,
          email: updated.email,
          phone: updated.phone
        }
      });
    } catch (err) {
      logger.error("Update donor profile error", err);
      res.status(500).json({ message: "خطأ في تحديث البيانات" });
    }
  });

  // ============= Admin: Donor Management =============
  // Get all donors (requires employee authentication)
  app.get("/api/admin/donors", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      const email = verifyToken(token);
      if (!email) {
        return res.status(401).json({ message: "رمز غير صالح" });
      }

      const employee = await getEmployeeByEmail(email);
      if (!employee || !employee.active) {
        return res.status(403).json({ message: "غير مصرح" });
      }

      // Check permission - president has all permissions automatically
      const hasPermission = employee.role === "president" || 
                           (employee.permissions && employee.permissions.includes('manage_donors'));
      
      if (!hasPermission) {
        return res.status(403).json({ message: "ليس لديك صلاحية إدارة المتبرعين" });
      }

      const donors = await getAllDonors();
      
      // Get donations count for each donor
      const donorsWithStats = await Promise.all(
        donors.map(async (donor: any) => {
          const donations = await getDonationsByEmail(donor.email);
          return {
            ...donor,
            donationsCount: donations.length,
            totalDonations: donations.reduce((sum: number, d: any) => sum + d.amount, 0)
          };
        })
      );

      res.json({ donors: donorsWithStats });
    } catch (err) {
      logger.error("Get donors error", err);
      res.status(500).json({ message: "خطأ في جلب البيانات" });
    }
  });

  // Update donor (requires employee authentication)
  app.put("/api/admin/donors/:email", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      const empEmail = verifyToken(token);
      if (!empEmail) {
        return res.status(401).json({ message: "رمز غير صالح" });
      }

      const employee = await getEmployeeByEmail(empEmail);
      if (!employee || !employee.active) {
        return res.status(403).json({ message: "غير مصرح" });
      }

      // Check permission - president has all permissions automatically
      const hasPermission = employee.role === "president" || 
                           (employee.permissions && employee.permissions.includes('manage_donors'));
      
      if (!hasPermission) {
        return res.status(403).json({ message: "ليس لديك صلاحية إدارة المتبرعين" });
      }

      const { email } = req.params;
      const { name, phone, email: newEmail, verificationCode } = req.body;

      // إذا كان هناك تغيير في البريد وليس هناك verification code بعد
      if (newEmail && newEmail !== email && !verificationCode) {
        // إرسال OTP للبريد الجديد
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // حفظ الـ OTP مؤقتاً (في التطبيق الحقيقي يكون في قاعدة البيانات)
        if (!global.emailChangeOTPs) global.emailChangeOTPs = {};
        global.emailChangeOTPs[newEmail] = {
          code: otp,
          oldEmail: email,
          expiresAt: Date.now() + 10 * 60 * 1000 // 10 دقائق
        };

        // إرسال الرسالة
        const emailHtml = `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <title>رمز التحقق من تغيير البريد</title>
          </head>
          <body style="font-family: Arial, sans-serif; direction: rtl;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
              <div style="background: linear-gradient(to left, #3b82f6, #1e40af); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0;">🔐 رمز التحقق</h1>
              </div>
              
              <div style="background: white; padding: 30px; margin-top: 20px; border-radius: 10px;">
                <p style="font-size: 16px; color: #333;">مرحباً،</p>
                <p style="color: #666; line-height: 1.6;">تم طلب تغيير البريد الإلكتروني المرتبط بحسابك. استخدم الرمز أدناه للتحقق:</p>
                
                <div style="background: #f0f0f0; border: 2px dashed #3b82f6; padding: 20px; text-align: center; margin: 30px 0; border-radius: 10px;">
                  <p style="font-size: 32px; font-weight: bold; color: #1e40af; margin: 0; letter-spacing: 5px;">${otp}</p>
                </div>
                
                <p style="color: #999; font-size: 12px;">⏱️ الرمز صالح لمدة 10 دقائق فقط</p>
                <p style="color: #999; font-size: 12px;">إذا لم تطلب هذا التغيير، يرجى تجاهل هذا البريد</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendEmail(
          newEmail,
          "🔐 رمز التحقق من تغيير البريد - نظام إدارة الجمعية",
          emailHtml
        );

        return res.json({ 
          success: true, 
          message: "تم إرسال رمز التحقق للبريد الجديد",
          requiresVerification: true,
          newEmail: newEmail
        });
      }

      // إذا كان هناك verification code، تحقق منه
      if (newEmail && newEmail !== email && verificationCode) {
        const otpData = global.emailChangeOTPs?.[newEmail];
        if (!otpData) {
          return res.status(400).json({ message: "لا يوجد طلب تحقق لهذا البريد" });
        }

        if (otpData.code !== verificationCode) {
          return res.status(400).json({ message: "رمز التحقق غير صحيح" });
        }

        if (otpData.expiresAt < Date.now()) {
          delete global.emailChangeOTPs[newEmail];
          return res.status(400).json({ message: "رمز التحقق انتهت صلاحيته" });
        }

        // تحقق من أن البريد الجديد غير مستخدم
        const existingDonor = await getDonorByEmail(newEmail);
        if (existingDonor) {
          return res.status(400).json({ message: "هذا البريد الإلكتروني مستخدم بالفعل" });
        }

        // حذف الـ OTP
        delete global.emailChangeOTPs[newEmail];
      }

      // تحديث البيانات
      const updates: any = {};
      if (name) updates.name = name;
      if (phone) updates.phone = phone;
      if (newEmail && newEmail !== email) updates.newEmail = newEmail;

      const updatedDonor = await updateDonor(email, updates);

      logAuditEntry({
        actor: `موظف: ${employee.name} (${empEmail})`,
        action: "تحديث بيانات متبرع",
        details: {
          donorEmail: email,
          newEmail: newEmail !== email ? newEmail : undefined,
          updatedFields: updates,
          type: "admin_donor_update"
        }
      });

      res.json({ success: true, donor: updatedDonor });
    } catch (err) {
      logger.error("Update donor error", err);
      res.status(500).json({ message: "خطأ في تحديث البيانات" });
    }
  });

  // Delete donor (requires employee authentication)
  app.delete("/api/admin/donors/:email", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      const empEmail = verifyToken(token);
      if (!empEmail) {
        return res.status(401).json({ message: "رمز غير صالح" });
      }

      const employee = await getEmployeeByEmail(empEmail);
      if (!employee || !employee.active) {
        return res.status(403).json({ message: "غير مصرح" });
      }

      // Check permission - president has all permissions automatically
      const hasPermission = employee.role === "president" || 
                           (employee.permissions && employee.permissions.includes('manage_donors'));
      
      if (!hasPermission) {
        return res.status(403).json({ message: "ليس لديك صلاحية إدارة المتبرعين" });
      }

      const { email } = req.params;
      
      const success = await deleteDonor(email);

      if (success) {
        logAuditEntry({
          actor: `موظف: ${employee.name} (${empEmail})`,
          action: "حذف متبرع",
          details: {
            donorEmail: email,
            type: "admin_donor_delete"
          }
        });

        res.json({ success: true, message: "تم حذف المتبرع بنجاح" });
      } else {
        res.status(500).json({ message: "فشل حذف المتبرع" });
      }
    } catch (err) {
      logger.error("Delete donor error", err);
      res.status(500).json({ message: "خطأ في حذف المتبرع" });
    }
  });

  // Send Welcome Email to New Employee
  app.post("/api/email/welcome", async (req, res) => {
    try {
      const { email, name, role } = req.body;
      
      if (!email || !name) {
        return res.status(400).json({ message: "البريد والاسم مطلوبان" });
      }

      const welcomeHtml = `
        <!DOCTYPE html>
        <html dir="rtl" style="direction: rtl;">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
            .header p { margin: 10px 0 0 0; font-size: 18px; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .welcome-box { background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border-right: 5px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .welcome-box h2 { color: #047857; margin: 0 0 10px 0; font-size: 20px; }
            .welcome-box p { color: #059669; margin: 5px 0; line-height: 1.6; }
            .info-section { margin: 30px 0; }
            .info-section h3 { color: #10b981; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #d1fae5; padding-bottom: 10px; }
            .info-item { display: flex; align-items: center; margin: 12px 0; padding: 10px; background: #f3f4f6; border-radius: 6px; }
            .info-icon { color: #10b981; font-size: 20px; margin-left: 10px; }
            .info-text { color: #374151; font-size: 15px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .cta-button:hover { opacity: 0.9; }
            .features { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .feature-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; }
            .feature-icon { font-size: 28px; margin-bottom: 8px; }
            .feature-title { color: #374151; font-weight: 600; margin: 8px 0; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb; }
            .footer p { margin: 5px 0; }
            .separator { height: 2px; background: linear-gradient(to left, #10b981, transparent); margin: 30px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 مرحباً بك ${escapeHtml(name)}</h1>
              <p>انضممت إلى عائلة بداية</p>
            </div>
            
            <div class="content">
              <div class="welcome-box">
                <h2>✨ تهانينا!</h2>
                <p>لقد تم قبول تعيينك كموظف جديد في منظمة <strong>بداية</strong></p>
                <p style="margin: 10px 0 0 0;">نفتخر بانضمامك إلى فريقنا المتميز</p>
              </div>

              <div class="info-section">
                <h3>📋 بيانات وظيفتك</h3>
                <div class="info-item">
                  <span class="info-text"><strong>الاسم:</strong> ${escapeHtml(name)}</span>
                </div>
                <div class="info-item">
                  <span class="info-text"><strong>المنصب:</strong> ${escapeHtml(role || "موظف")}</span>
                </div>
                <div class="info-item">
                  <span class="info-text"><strong>المؤسسة:</strong> بداية</span>
                </div>
              </div>

              <div class="features">
                <div class="feature-card">
                  <div class="feature-icon">🚀</div>
                  <div class="feature-title">ابدأ فوراً</div>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">🤝</div>
                  <div class="feature-title">فريق متميز</div>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">🎯</div>
                  <div class="feature-title">رسالة نبيلة</div>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">💡</div>
                  <div class="feature-title">نمو وتطور</div>
                </div>
              </div>

              <div class="separator"></div>

              <div class="info-section">
                <h3>📌 خطواتك الأولى</h3>
                <div class="info-item">
                  <span class="info-icon">1️⃣</span>
                  <span class="info-text">قم بتسجيل الدخول إلى بوابة الموظفين</span>
                </div>
                <div class="info-item">
                  <span class="info-icon">2️⃣</span>
                  <span class="info-text">اطّلع على لوحة التحكم الخاصة بك</span>
                </div>
                <div class="info-item">
                  <span class="info-icon">3️⃣</span>
                  <span class="info-text">تعرّف على الفريق والمشاريع</span>
                </div>
                <div class="info-item">
                  <span class="info-icon">4️⃣</span>
                  <span class="info-text">لا تتردد في التواصل مع الإدارة</span>
                </div>
              </div>

              <center>
                <a href="https://bedaih.com/login" class="cta-button">دخول لوحة التحكم</a>
              </center>

              <div class="info-section" style="background: #fef3c7; border-right: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #d97706; margin-top: 0;">💬 هل تحتاج مساعدة؟</h3>
                <p style="color: #92400e; margin: 5px 0;">لا تتردد في التواصل مع فريق الدعم لدينا في أي وقت</p>
              </div>

              <p style="text-align: center; color: #10b981; font-size: 16px; font-weight: 600; margin-top: 30px;">
                🌟 نتطلع للعمل معك والمساهمة في رسالتنا الإنسانية النبيلة
              </p>
            </div>

            <div class="footer">
              <p><strong>مؤسسة بداية</strong></p>
              <p>نحن هنا لخدمتك والعمل معاً لبناء مجتمع أفضل</p>
              <p style="margin-top: 15px; color: #9ca3af;">© 2026 بداية - جميع الحقوق محفوظة</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail(
        email,
        `مرحباً بك في فريق بداية 🎉 - ${role || "موظف"}`,
        welcomeHtml
      );

      res.json({ success: true, message: "تم إرسال بريد الترحيب بنجاح" });
    } catch (err) {
      logger.error("Welcome email error", err);
      res.status(500).json({ message: "خطأ في إرسال البريد الترحيبي" });
    }
  });

  // Seed Data (Optional, for demo purposes)
  // You might want to remove this in production or check if data exists
  // For now, we leave it empty or add a manual seed endpoint if needed.
  // app.post('/api/seed', async (req, res) => { ... });

  return httpServer;
}
