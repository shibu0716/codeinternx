import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL || 'internxcode@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendAdminOTPEmail(email: string, otp: string) {
  try {
    await transporter.sendMail({
      from: `"CodeInternX Security" <${process.env.ADMIN_EMAIL || 'internxcode@gmail.com'}>`,
      to: email,
      subject: 'CodeInternX Admin - Security Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #0f172a; text-align: center;">Admin Verification Required</h2>
          <p style="color: #475569; font-size: 16px;">Hello Admin,</p>
          <p style="color: #475569; font-size: 16px;">A login attempt was made to the CodeInternX Admin Dashboard. Please use the following One-Time Password (OTP) to complete your login. This code will expire in 10 minutes.</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">If you did not attempt to log in, please ignore this email or secure your account.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error };
  }
}

export async function sendApplicationConfirmationEmail(email: string, fullName: string, programTitle: string, applicationId: string) {
  try {
    await transporter.sendMail({
      from: `"CodeInternX Support" <${process.env.ADMIN_EMAIL || 'internxcode@gmail.com'}>`,
      to: email,
      subject: `Application Received - ${programTitle} | CodeInternX`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #0f172a; text-align: center;">Application Received! 🎉</h2>
          <p style="color: #475569; font-size: 16px;">Hello ${fullName},</p>
          <p style="color: #475569; font-size: 16px;">We have successfully received your application for the <strong>${programTitle}</strong> program.</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #475569;"><strong>Application ID:</strong> ${applicationId}</p>
            <p style="margin: 5px 0 0 0; color: #475569;"><strong>Status:</strong> Under Review</p>
          </div>
          
          <p style="color: #475569; font-size: 16px;">Our team will review your application and get back to you shortly. You can track your application status in your student dashboard.</p>
          <br/>
          <p style="color: #64748b; font-size: 14px;">Best Regards,<br/>The CodeInternX Team</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending application confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendOfferLetterEmail(email: string, fullName: string, programTitle: string) {
  try {
    await transporter.sendMail({
      from: `"CodeInternX Support" <${process.env.ADMIN_EMAIL || 'internxcode@gmail.com'}>`,
      to: email,
      subject: `Offer Letter Ready - ${programTitle} | CodeInternX`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #0f172a; text-align: center;">Congratulations! 🎉</h2>
          <p style="color: #475569; font-size: 16px;">Hello ${fullName},</p>
          <p style="color: #475569; font-size: 16px;">We are thrilled to inform you that your application for the <strong>${programTitle}</strong> program has been approved!</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <p style="color: #475569; font-size: 16px; margin-bottom: 20px;">Your official Offer Letter is now ready to view and accept.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://codeinternx.com'}/dashboard/offer-letter" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">View Offer Letter</a>
          </div>
          
          <p style="color: #475569; font-size: 16px;">Please log in to your student dashboard to review the terms and accept your offer. Once accepted, your internship tasks will be unlocked.</p>
          <br/>
          <p style="color: #64748b; font-size: 14px;">Best Regards,<br/>The CodeInternX Team</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending offer letter email:', error);
    return { success: false, error };
  }
}

export async function sendPaymentVerificationEmail(email: string, fullName: string, transactionId: string) {
  try {
    await transporter.sendMail({
      from: `"CodeInternX Finance" <${process.env.ADMIN_EMAIL || 'internxcode@gmail.com'}>`,
      to: email,
      subject: `Payment Verified - CodeInternX`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #16a34a; text-align: center;">Payment Verified! ✅</h2>
          <p style="color: #475569; font-size: 16px;">Hello ${fullName},</p>
          <p style="color: #475569; font-size: 16px;">Great news! Your manual payment proof for transaction <strong>${transactionId}</strong> has been successfully verified by our team.</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <p style="color: #475569; font-size: 16px; margin-bottom: 20px;">Your documents are now unlocked and available in your dashboard.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://codeinternx.com'}/dashboard/certificates" style="background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">View Documents</a>
          </div>
          
          <br/>
          <p style="color: #64748b; font-size: 14px;">Best Regards,<br/>The CodeInternX Finance Team</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending payment verification email:', error);
    return { success: false, error };
  }
}

export async function sendPaymentRejectionEmail(email: string, fullName: string, transactionId: string, reason: string) {
  try {
    await transporter.sendMail({
      from: `"CodeInternX Finance" <${process.env.ADMIN_EMAIL || 'internxcode@gmail.com'}>`,
      to: email,
      subject: `Action Required: Payment Issue - CodeInternX`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #dc2626; text-align: center;">Payment Issue ⚠️</h2>
          <p style="color: #475569; font-size: 16px;">Hello ${fullName},</p>
          <p style="color: #475569; font-size: 16px;">We could not verify your payment proof for transaction <strong>${transactionId}</strong>.</p>
          
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b; font-weight: bold;">Reason for rejection/resubmission:</p>
            <p style="margin: 10px 0 0 0; color: #7f1d1d;">${reason}</p>
          </div>
          
          <p style="color: #475569; font-size: 16px;">Please log in to your dashboard to resubmit a valid payment proof.</p>
          <div style="text-align: center; margin-top: 20px;">
             <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://codeinternx.com'}/payment" style="background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Resubmit Payment Details</a>
          </div>
          <br/>
          <p style="color: #64748b; font-size: 14px;">Best Regards,<br/>The CodeInternX Finance Team</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
     console.error('Error sending payment rejection email:', error);
    return { success: false, error };
  }
}

// ============================================================
// DOCUMENT EMAIL DELIVERY SERVICE
// ============================================================

export type DocumentEmailType = 'OFFER_LETTER' | 'CERTIFICATE' | 'LOR' | 'PERFORMANCE_REPORT';

export interface SendDocumentEmailParams {
  documentType: DocumentEmailType;
  documentId: string;
  studentId: string;
  studentName: string;
  programTitle: string;
  recipientEmail: string;
  pdfBuffer: Buffer;
  viewOnlineUrl: string;
  /** Extra fields used in specific templates */
  metadata?: Record<string, string>;
  /** If true, bypasses the already-SENT idempotency check (for admin resends) */
  forceResend?: boolean;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codeinternx.com';
const FROM_EMAIL = process.env.ADMIN_EMAIL || 'internxcode@gmail.com';

/** Shared branded email wrapper */
function wrapInBrandedEmail(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CodeInternX</title>
<style>
  body { margin: 0; padding: 0; background: #f1f5f9; font-family: 'Helvetica Neue', Arial, sans-serif; }
  .wrapper { max-width: 620px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
  .header { background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px 40px; text-align: center; }
  .header-logo { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
  .header-tagline { font-size: 12px; color: #93c5fd; margin-top: 6px; letter-spacing: 2px; text-transform: uppercase; }
  .body { padding: 40px; color: #374151; }
  .body h2 { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0 0 16px; }
  .body p { font-size: 15px; line-height: 1.7; color: #4b5563; margin: 0 0 14px; }
  .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
  .info-card table { width: 100%; border-collapse: collapse; }
  .info-card td { padding: 7px 0; font-size: 14px; color: #374151; vertical-align: top; }
  .info-card td:first-child { font-weight: 600; color: #1e293b; width: 42%; }
  .cta-btn { display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; margin: 20px 0; letter-spacing: 0.3px; }
  .cta-center { text-align: center; margin: 28px 0; }
  .attachment-note { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px 20px; font-size: 13px; color: #1d4ed8; margin: 20px 0; }
  .attachment-note strong { display: block; margin-bottom: 4px; color: #1e40af; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 28px 0; }
  .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 40px; text-align: center; }
  .footer p { font-size: 12px; color: #9ca3af; margin: 4px 0; }
  .footer a { color: #6b7280; text-decoration: none; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">&#127891; CodeInternX</div>
      <div class="header-tagline">Learn &bull; Intern &bull; Grow &bull; Succeed</div>
    </div>
    <div class="body">
      ${bodyContent}
    </div>
    <div class="footer">
      <p>CodeInternX &mdash; Official Internship Platform</p>
      <p><a href="mailto:support@codeinternx.com">support@codeinternx.com</a> &bull; <a href="${APP_URL}">${APP_URL}</a></p>
      <p style="margin-top:10px;font-size:11px;color:#d1d5db;">This is an automated email. Please do not reply directly to this message.</p>
    </div>
  </div>
</body>
</html>`;
}

function buildDocumentEmailContent(params: SendDocumentEmailParams): { subject: string; html: string; attachmentFilename: string } {
  const { documentType, documentId, studentName, programTitle, viewOnlineUrl } = params;
  const issueDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  switch (documentType) {
    case 'OFFER_LETTER': {
      const subject = `Your CodeInternX Internship Offer Letter`;
      const attachmentFilename = `CodeInternX_Offer_Letter_${documentId}.pdf`;
      const html = wrapInBrandedEmail(`
        <h2>Congratulations! 🎉 Your Offer Letter is Here</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>We are delighted to inform you that your internship application has been <strong>approved</strong>. Your official Offer Letter is attached to this email as a PDF document.</p>
        <div class="attachment-note">
          <strong>📎 Attached: ${attachmentFilename}</strong>
          Your official Offer Letter is attached. Please save it for your records.
        </div>
        <div class="info-card">
          <table>
            <tr><td>Internship:</td><td>${programTitle}</td></tr>
            <tr><td>Offer Letter ID:</td><td>${documentId}</td></tr>
            <tr><td>Issue Date:</td><td>${issueDate}</td></tr>
          </table>
        </div>
        <p>You can also view and accept your Offer Letter securely online using the button below.</p>
        <div class="cta-center">
          <a class="cta-btn" href="${viewOnlineUrl}">View &amp; Accept Offer Letter</a>
        </div>
        <hr class="divider" />
        <p style="font-size:13px;color:#6b7280;">Please log in to your student dashboard to review the terms and formally accept your offer. Once accepted, your internship tasks will be unlocked.</p>
        <p>Welcome aboard!<br/><strong>The CodeInternX Team</strong></p>
      `);
      return { subject, html, attachmentFilename };
    }

    case 'CERTIFICATE': {
      const subject = `Your CodeInternX Internship Certificate`;
      const attachmentFilename = `CodeInternX_Certificate_${documentId}.pdf`;
      const html = wrapInBrandedEmail(`
        <h2>Congratulations on Completing Your Internship! 🏆</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>Congratulations on successfully completing your internship with <strong>CodeInternX</strong>! Your official Internship Completion Certificate is attached to this email as a PDF document.</p>
        <div class="attachment-note">
          <strong>📎 Attached: ${attachmentFilename}</strong>
          Your official Certificate is attached. You may share it on LinkedIn or include it in your portfolio.
        </div>
        <div class="info-card">
          <table>
            <tr><td>Certificate ID:</td><td>${documentId}</td></tr>
            <tr><td>Internship:</td><td>${programTitle}</td></tr>
            <tr><td>Issue Date:</td><td>${issueDate}</td></tr>
          </table>
        </div>
        <p>You can also verify and view your certificate online:</p>
        <div class="cta-center">
          <a class="cta-btn" href="${viewOnlineUrl}">View Certificate Online</a>
        </div>
        <hr class="divider" />
        <p>We wish you all the best in your future endeavors. Thank you for being part of the CodeInternX family!</p>
        <p>Warm Regards,<br/><strong>The CodeInternX Team</strong></p>
      `);
      return { subject, html, attachmentFilename };
    }

    case 'LOR': {
      const subject = `Your CodeInternX Letter of Recommendation`;
      const attachmentFilename = `CodeInternX_LOR_${documentId}.pdf`;
      const html = wrapInBrandedEmail(`
        <h2>Your Letter of Recommendation is Ready 📄</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>Your Letter of Recommendation from <strong>CodeInternX</strong> has been officially issued. The signed LOR is attached to this email as a PDF document.</p>
        <div class="attachment-note">
          <strong>📎 Attached: ${attachmentFilename}</strong>
          Your official Letter of Recommendation is attached.
        </div>
        <div class="info-card">
          <table>
            <tr><td>Document ID:</td><td>${documentId}</td></tr>
            <tr><td>Internship:</td><td>${programTitle}</td></tr>
            <tr><td>Issue Date:</td><td>${issueDate}</td></tr>
          </table>
        </div>
        <p>You can also view the document securely online:</p>
        <div class="cta-center">
          <a class="cta-btn" href="${viewOnlineUrl}">View LOR Online</a>
        </div>
        <p>Best of luck in your future applications!<br/><strong>The CodeInternX Team</strong></p>
      `);
      return { subject, html, attachmentFilename };
    }

    case 'PERFORMANCE_REPORT': {
      const subject = `Your CodeInternX Internship Performance Report`;
      const attachmentFilename = `CodeInternX_Performance_Report_${documentId}.pdf`;
      const html = wrapInBrandedEmail(`
        <h2>Your Performance Report is Ready 📊</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>Your official Internship Performance Report from <strong>CodeInternX</strong> has been finalized. The report is attached to this email as a PDF document.</p>
        <div class="attachment-note">
          <strong>📎 Attached: ${attachmentFilename}</strong>
          Your official Performance Report is attached.
        </div>
        <div class="info-card">
          <table>
            <tr><td>Report ID:</td><td>${documentId}</td></tr>
            <tr><td>Internship:</td><td>${programTitle}</td></tr>
            <tr><td>Issue Date:</td><td>${issueDate}</td></tr>
          </table>
        </div>
        <p>View your performance report online:</p>
        <div class="cta-center">
          <a class="cta-btn" href="${viewOnlineUrl}">View Performance Report</a>
        </div>
        <p>Thank you for your dedication during the internship program.<br/><strong>The CodeInternX Team</strong></p>
      `);
      return { subject, html, attachmentFilename };
    }

    default:
      throw new Error(`Unknown document type: ${documentType}`);
  }
}

/**
 * Sends an official document as a PDF email attachment to the student.
 * Checks idempotency (skips if already SENT, unless forceResend=true).
 * Logs every attempt to the email_logs table.
 */
export async function sendDocumentEmail(params: SendDocumentEmailParams): Promise<{
  success: boolean;
  skipped?: boolean;
  messageId?: string;
  error?: string;
}> {
  const { documentType, documentId, studentId, recipientEmail, pdfBuffer, forceResend } = params;

  // Lazy import Supabase to avoid circular deps — this runs server-side only
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Idempotency check
  if (!forceResend) {
    const { data: existingLog } = await supabase
      .from('email_logs')
      .select('id, status')
      .eq('document_id', documentId)
      .eq('document_type', documentType)
      .maybeSingle();

    if (existingLog?.status === 'SENT') {
      console.log(`[sendDocumentEmail] Skipping — already SENT for ${documentId}`);
      return { success: true, skipped: true };
    }
  }

  // 2. Build email content
  const { subject, html, attachmentFilename } = buildDocumentEmailContent(params);

  // 3. Validate PDF buffer
  if (!pdfBuffer || pdfBuffer.length < 100) {
    const errMsg = 'PDF buffer is empty or invalid — email not sent';
    console.error(`[sendDocumentEmail] ${errMsg}`);
    await supabase.from('email_logs').upsert({
      student_id: studentId,
      document_id: documentId,
      document_type: documentType,
      recipient_email: recipientEmail,
      subject,
      attachment_filename: attachmentFilename,
      status: 'FAILED',
      error_message: errMsg,
      attempt_count: 1,
    }, { onConflict: 'document_id,document_type' });
    return { success: false, error: errMsg };
  }

  // 4. Send email with PDF attachment
  try {
    const info = await transporter.sendMail({
      from: `"CodeInternX" <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject,
      html,
      attachments: [
        {
          filename: attachmentFilename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    // 5. Log success
    await supabase.from('email_logs').upsert({
      student_id: studentId,
      document_id: documentId,
      document_type: documentType,
      recipient_email: recipientEmail,
      subject,
      attachment_filename: attachmentFilename,
      status: 'SENT',
      provider_message_id: info.messageId,
      sent_at: new Date().toISOString(),
      attempt_count: 1,
    }, { onConflict: 'document_id,document_type' });

    console.log(`[sendDocumentEmail] ✓ Sent ${documentType} to ${recipientEmail} — messageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error: any) {
    const errMsg = error?.message || 'Unknown email error';
    console.error(`[sendDocumentEmail] ✗ Failed for ${documentId}:`, errMsg);

    // Log failure
    await supabase.from('email_logs').upsert({
      student_id: studentId,
      document_id: documentId,
      document_type: documentType,
      recipient_email: recipientEmail,
      subject,
      attachment_filename: attachmentFilename,
      status: 'FAILED',
      error_message: errMsg,
      attempt_count: 1,
    }, { onConflict: 'document_id,document_type' });

    return { success: false, error: errMsg };
  }
}
