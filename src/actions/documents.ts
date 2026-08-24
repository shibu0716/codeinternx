'use server';

import { createClient } from '@supabase/supabase-js';
import { generateDocumentHtml, DocumentType } from '../services/document-generator';
import { generatePdf } from '../services/pdf-generator';
import { sendDocumentEmail, DocumentEmailType } from '../lib/email';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codeinternx.com';

export interface GenerateDocumentParams {
  type: DocumentType;
  studentId: string;
  enrollmentId: string;
  documentId: string;
  data: any;
  studentEmail?: string;
  studentName?: string;
  programTitle?: string;
}

export async function generateAndSaveDocument(params: GenerateDocumentParams) {
  const { type, studentId, enrollmentId, documentId, data, studentEmail, studentName, programTitle } = params;

  try {
    // 1. Generate HTML from template
    const html = await generateDocumentHtml(type, data);

    // 2. Generate PDF — if this fails we do NOT email
    const isCertificate = type === 'CERTIFICATE';
    const pdfBuffer = await generatePdf(html, { format: 'A4', landscape: isCertificate });

    if (!pdfBuffer || pdfBuffer.length < 100) {
      throw new Error('PDF_GENERATION_FAILED: Generated PDF is empty');
    }

    // 3. Upload to Supabase Storage
    const fileName = `${documentId}.pdf`;
    const filePath = `${studentId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, pdfBuffer, { contentType: 'application/pdf', upsert: true });

    if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

    const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(filePath);
    const pdfUrl = publicUrlData.publicUrl;

    // 4. Determine view URL
    const viewOnlineUrl = type === 'OFFER_LETTER'
      ? `${APP_URL}/dashboard/offer-letter`
      : type === 'CERTIFICATE'
      ? `${APP_URL}/verify/certificate/${documentId}`
      : type === 'LOR'
      ? `${APP_URL}/verify/lor/${documentId}`
      : `${APP_URL}/student/documents`;

    // 5. Save to Database with ISSUED status
    const { error: dbError } = await supabase.from('internship_documents').upsert({
      document_id: documentId,
      type,
      student_id: studentId,
      enrollment_id: enrollmentId,
      status: 'ISSUED',
      issue_date: new Date().toISOString().split('T')[0],
      pdf_url: pdfUrl,
      verification_url: viewOnlineUrl,
      metadata: data,
    }, { onConflict: 'type,enrollment_id' });

    if (dbError) throw new Error(`Database insert failed: ${dbError.message}`);

    // 6. Send PDF email — best-effort (document stays ISSUED even if email fails)
    let emailResult: { success: boolean; skipped?: boolean; error?: string } = { success: false, error: 'No email address provided' };
    if (studentEmail) {
      try {
        emailResult = await sendDocumentEmail({
          documentType: type as DocumentEmailType,
          documentId,
          studentId,
          studentName: studentName || 'Student',
          programTitle: programTitle || 'Internship Program',
          recipientEmail: studentEmail,
          pdfBuffer,
          viewOnlineUrl,
        });
      } catch (emailErr: any) {
        emailResult = { success: false, error: emailErr.message };
      }
    }

    revalidatePath('/admin/documents');
    return {
      success: true,
      pdfUrl,
      documentId,
      emailSent: emailResult.success && !emailResult.skipped,
      emailSkipped: emailResult.skipped,
      emailError: !emailResult.success ? emailResult.error : undefined,
    };
  } catch (error: any) {
    console.error('[generateAndSaveDocument] Error:', error);
    return {
      success: false,
      error: error.message,
      isPdfFailure: error.message?.includes('PDF_GENERATION_FAILED'),
    };
  }
}

/**
 * Admin action: resend the document email using the already-stored PDF.
 * Does NOT regenerate the document.
 */
export async function resendDocumentEmail(documentId: string): Promise<{ success: boolean; error?: string }> {
  const { data: doc, error: docErr } = await supabase
    .from('internship_documents')
    .select('document_id, type, student_id, pdf_url, profiles(full_name, email), enrollments(programs(title))')
    .eq('document_id', documentId)
    .single();

  if (docErr || !doc) return { success: false, error: 'Document not found' };

  const studentEmail = (doc.profiles as any)?.email;
  const studentName = (doc.profiles as any)?.full_name || 'Student';
  const programTitle = (doc.enrollments as any)?.programs?.title || 'Internship Program';

  if (!studentEmail) return { success: false, error: 'Student email not found' };

  // Download the stored PDF
  let pdfBuffer: Buffer;
  try {
    const filePath = `${doc.student_id}/${documentId}.pdf`;
    const { data: fileData, error: dlError } = await supabase.storage.from('documents').download(filePath);
    if (dlError || !fileData) throw new Error(dlError?.message || 'No data');
    pdfBuffer = Buffer.from(await fileData.arrayBuffer());
  } catch (dlErr: any) {
    return { success: false, error: `Could not retrieve stored PDF: ${dlErr.message}` };
  }

  const type = doc.type as DocumentEmailType;
  const viewOnlineUrl = type === 'OFFER_LETTER'
    ? `${APP_URL}/dashboard/offer-letter`
    : type === 'CERTIFICATE'
    ? `${APP_URL}/verify/certificate/${documentId}`
    : type === 'LOR'
    ? `${APP_URL}/verify/lor/${documentId}`
    : `${APP_URL}/student/documents`;

  const result = await sendDocumentEmail({
    documentType: type,
    documentId,
    studentId: doc.student_id,
    studentName,
    programTitle,
    recipientEmail: studentEmail,
    pdfBuffer,
    viewOnlineUrl,
    forceResend: true,
  });

  // Increment attempt_count
  if (result.success) {
    await supabase
      .from('email_logs')
      .update({ attempt_count: supabase.rpc as any })
      .eq('document_id', documentId);
    // Simple increment via raw update
    await supabase.rpc('increment_email_attempt', { p_document_id: documentId }).catch(() => null);
  }

  revalidatePath('/admin/documents');
  return result;
}
