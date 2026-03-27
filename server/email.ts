import nodemailer from "nodemailer";

function createSmtpTransport() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

/**
 * Escapes HTML special characters to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

// Configure your email service (Gmail, SendGrid, etc.)
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  options?: { requireProviderDelivery?: boolean }
) {
  try {
    const requireProviderDelivery = options?.requireProviderDelivery === true;
    const smtpUser = process.env.SMTP_USER;
    const fromAddress = process.env.EMAIL_FROM || (smtpUser ? `Bedaih <${smtpUser}>` : "Bedaih <no-reply@localhost>");
    const transporter = createSmtpTransport();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.error("Invalid email address:", to);
      throw new Error("بريد إلكتروني غير صالح");
    }

    // Check if SMTP is configured
    if (!transporter) {
      if (!requireProviderDelivery) {
        console.warn("SMTP not configured. Email was not sent.");
      }
      console.error("SMTP settings are missing. Check your .env file (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)");
      return false;
    }

    // Send email using SMTP (Gmail-compatible)
    await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html: htmlContent,
    });

    console.log("Email sent successfully via SMTP to:", to);
    return true;
  } catch (error) {
    console.error("Error sending email:", error instanceof Error ? error.message : error);
    return false;
  }
}

// Email templates
export function getBeneficiaryConfirmationEmail(name: string) {
  const safeName = escapeHtml(name);
  return `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
      <h2>مرحباً ${safeName}</h2>
      <p>شكراً لتقديمك للمساعدة من جمعيتنا الخيرية.</p>
      <p>سيتم مراجعة طلبك قريباً، وسنتواصل معك في أقرب وقت.</p>
      <p>مع أطيب التحيات،<br/>فريق الجمعية الخيرية</p>
    </div>
  `;
}

export function getJobApplicationConfirmationEmail(name: string, jobTitle: string) {
  const safeName = escapeHtml(name);
  const safeJobTitle = escapeHtml(jobTitle);
  return `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
      <h2>مرحباً ${safeName}</h2>
      <p>شكراً لتقديمك للوظيفة: <strong>${safeJobTitle}</strong></p>
      <p>سيتم مراجعة طلبك قريباً، وسنتواصل معك لإجراء المقابلة إن توافقت مؤهلاتك.</p>
      <p>مع أطيب التحيات،<br/>فريق الموارد البشرية</p>
    </div>
  `;
}

export function getContactConfirmationEmail(name: string) {
  const safeName = escapeHtml(name);
  return `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
      <h2>مرحباً ${safeName}</h2>
      <p>شكراً لتواصلك معنا، سنرد على استفسارك في أقرب وقت.</p>
      <p>مع أطيب التحيات،<br/>فريق الدعم</p>
    </div>
  `;
}

export function getAdminNotificationEmail(
  type: "contact" | "beneficiary" | "job",
  data: any
) {
  const baseStyles =
    "font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;";

  let content = "";

  if (type === "contact") {
    const safeName = escapeHtml(data.name || "");
    const safeEmail = escapeHtml(data.email || "");
    const safeMessage = escapeHtml(data.message || "");
    content = `
      <div style="${baseStyles}">
        <h3>رسالة جديدة من نموذج التواصل</h3>
        <p><strong>الاسم:</strong> ${safeName}</p>
        <p><strong>البريد الإلكتروني:</strong> ${safeEmail}</p>
        <p><strong>الرسالة:</strong></p>
        <p>${safeMessage}</p>
      </div>
    `;
  } else if (type === "beneficiary") {
    const safeFullName = escapeHtml(data.fullName || "");
    const safeEmail = escapeHtml(data.email || "");
    const safePhone = escapeHtml(data.phone || "");
    const safeAddress = escapeHtml(data.address || "");
    const safeAssistanceType = escapeHtml(data.assistanceType || "");
    const safeNationalId = escapeHtml(data.nationalId || "");
    content = `
      <div style="${baseStyles}">
        <h3>طلب مساعدة جديد</h3>
        <p><strong>الاسم الكامل:</strong> ${safeFullName}</p>
        <p><strong>البريد الإلكتروني:</strong> ${safeEmail}</p>
        <p><strong>رقم الهاتف:</strong> ${safePhone}</p>
        <p><strong>نوع الحالة:</strong> ${safeAssistanceType}</p>
        <p><strong>العنوان:</strong> ${safeAddress}</p>
        <p><strong>الهوية الوطنية:</strong> ${safeNationalId}</p>
      </div>
    `;
  } else if (type === "job") {
    const safeFullName = escapeHtml(data.fullName || "");
    const safeEmail = escapeHtml(data.email || "");
    const safePhone = escapeHtml(data.phone || "");
    const safeQualifications = escapeHtml(data.qualifications || "");
    const safeExperience = escapeHtml(data.experience || "");
    const cvUrl = data.cvUrl ? escapeHtml(data.cvUrl) : "";
    content = `
      <div style="${baseStyles}">
        <h3>تقديم طلب وظيفي جديد</h3>
        <p><strong>الاسم الكامل:</strong> ${safeFullName}</p>
        <p><strong>البريد الإلكتروني:</strong> ${safeEmail}</p>
        <p><strong>رقم الهاتف:</strong> ${safePhone}</p>
        <p><strong>المؤهلات:</strong> ${safeQualifications}</p>
        <p><strong>الخبرة:</strong> ${safeExperience}</p>
        ${cvUrl ? `<p><strong>السيرة الذاتية:</strong> <a href="${cvUrl}">${cvUrl}</a></p>` : ''}
      </div>
    `;
  }

  return content;
}

/**
 * Send donation receipt email
 */
export async function sendDonationReceipt(
  donorEmail: string,
  donorName: string,
  amount: number,
  method: string,
  code: string
) {
  const receiptHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>إيصال التبرع</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- Header with gradient -->
        <div style="background: linear-gradient(135deg, #22574380, #1e7e6680); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">إيصال تبرع</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">جمعية بداية الخيرية</p>
        </div>

        <!-- Main content -->
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 50%; width: 80px; height: 80px; line-height: 76px; font-size: 40px; margin-bottom: 15px;">✓</div>
            <h2 style="color: #1f2937; margin: 15px 0; font-size: 24px;">شكراً لك على تبرعك الكريم!</h2>
            <p style="color: #6b7280; font-size: 16px; margin: 10px 0;">تبرعك يصنع فرقاً في حياة المحتاجين</p>
          </div>

          <!-- Donation details card -->
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">تفاصيل التبرع</h3>
            
            <div style="margin-bottom: 15px;">
              <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 5px;">المتبرع</span>
              <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${escapeHtml(donorName)}</span>
            </div>

            <div style="margin-bottom: 15px;">
              <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 5px;">البريد الإلكتروني</span>
              <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${escapeHtml(donorEmail)}</span>
            </div>

            <div style="margin-bottom: 15px;">
              <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 5px;">المبلغ</span>
              <span style="color: #059669; font-size: 24px; font-weight: bold;">${amount} ريال سعودي</span>
            </div>

            <div style="margin-bottom: 15px;">
              <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 5px;">طريقة الدفع</span>
              <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${escapeHtml(method)}</span>
            </div>

            <div style="margin-bottom: 15px;">
              <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 5px;">رقم الإيصال</span>
              <span style="color: #1f2937; font-size: 16px; font-weight: 600; font-family: monospace; background-color: white; padding: 5px 10px; border-radius: 4px; display: inline-block;">${escapeHtml(code)}</span>
            </div>

            <div>
              <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 5px;">التاريخ</span>
              <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${new Date().toLocaleDateString('ar-SA')}</span>
            </div>
          </div>

          <!-- Thank you message -->
          <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <p style="color: #15803d; margin: 0; font-size: 16px; line-height: 1.6;">
              🌟 تبرعك سيساعد في تحسين حياة الأسر المحتاجة وتوفير الدعم اللازم لهم. نحن ممتنون جداً لكرمك وسخائك.
            </p>
          </div>

          <!-- Contact info -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">للاستفسارات، يرجى التواصل معنا:</p>
            <p style="color: #1f2937; font-size: 14px; margin: 5px 0;">
              📧 info@bedaih.org | 📱 0533170903
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            © 2026 جمعية بداية الخيرية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(donorEmail, "إيصال تبرع - جمعية بداية الخيرية", receiptHtml);
}

export async function sendDonationReviewRequest(
  donorEmail: string,
  donorName: string,
  reviewUrl: string
) {
  const safeName = escapeHtml(donorName || "متبرع");
  const safeUrl = escapeHtml(reviewUrl);

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>شاركنا تقييمك</title>
    </head>
    <body style="font-family: Arial, sans-serif; background:#f8fafc; margin:0; padding:24px;">
      <div style="max-width:600px; margin:0 auto; background:#fff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden;">
        <div style="background:#0ea5e9; color:#fff; padding:24px; text-align:center;">
          <h1 style="margin:0; font-size:24px;">شكرا لك على تبرعك</h1>
        </div>
        <div style="padding:24px; text-align:right; color:#0f172a;">
          <p style="margin:0 0 12px; font-size:16px;">الأخ/الأخت ${safeName}</p>
          <p style="margin:0 0 16px; line-height:1.9; color:#334155;">
            يسعدنا تقييمك لتجربة التبرع، رأيك يساعدنا على تحسين الخدمة.
          </p>
          <div style="text-align:center; margin:28px 0;">
            <a href="${safeUrl}" style="display:inline-block; background:#0f172a; color:#fff; text-decoration:none; padding:12px 22px; border-radius:10px; font-weight:bold;">قيّم تجربتك الآن</a>
          </div>
          <p style="margin:0; color:#64748b; font-size:13px;">
            في حال لم يعمل الزر، استخدم هذا الرابط: ${safeUrl}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(donorEmail, "شاركنا تقييم تجربة التبرع", html);
}
