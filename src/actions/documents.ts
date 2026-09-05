'use server';

import { checkRateLimit } from "@/lib/rate-limit";
import { logAuditAction } from "@/lib/audit-logger";
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { generateDocumentHtml, DocumentType, OfferLetterData, CertificateData, PerformanceReportData, LorData } from '../services/document-generator';
import { generatePdf } from '../services/pdf-generator';
import { sendDocumentEmail, DocumentEmailType } from '../lib/email';
import { revalidatePath } from 'next/cache';
import { checkDocumentEligibility } from '../services/eligibility';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codeinternx.com';

/**
 * Securely request a document generation for an enrollment.
 * Only the owner of the enrollment or an Admin/SuperAdmin can call this.
 * The system independently verifies eligibility and generates the document.
 */
export async function generateAndSaveDocument(
  enrollmentId: string, 
  type: DocumentType,
  customOverrides?: Record<string, any>,
  updateProfileToo: boolean = false
) {
  const allowed = await checkRateLimit("generateDocument", 10, 3600);
  if (!allowed) {
    throw new Error("Too many document generation requests. Please try again later.");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Get current user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'SUPER_ADMIN' || profile?.role === 'ADMIN';

  // Perform eligibility check
  const eligibility = await checkDocumentEligibility(enrollmentId, type);

  if (!eligibility.isEligible || !eligibility.data) {
    throw new Error(`Eligibility check failed: ${eligibility.reasons.join(' ')}`);
  }

  const { studentId, studentName, studentEmail, programTitle, enrolledAt, performanceScore } = eligibility.data;

  // Authorization: Only the student themselves or an admin can request this
  if (!isAdmin && user.id !== studentId) {
    throw new Error('Forbidden: You can only request documents for your own enrollments.');
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch candidate profile for phone and address
  const { data: profileInfo } = await supabaseAdmin
    .from('profiles')
    .select('phone, address')
    .eq('id', studentId)
    .single();

  const candidatePhone = profileInfo?.phone || '';
  const candidateAddress = profileInfo?.address || '';

  // Generate unique document ID
  const year = new Date().getFullYear();
  let typePrefix = '';
  if (type === 'OFFER_LETTER') typePrefix = 'OFFER';
  else if (type === 'CERTIFICATE') typePrefix = 'CERT';
  else if (type === 'PERFORMANCE_REPORT') typePrefix = 'PERF';
  else if (type === 'LOR') typePrefix = 'LOR';

  const { count } = await supabaseAdmin
    .from("internship_documents")
    .select("*", { count: 'exact', head: true })
    .eq('type', type);
    
  const nextNum = (count || 0) + 1;
  const paddedNum = nextNum.toString().padStart(6, '0');
  let docId = `CIX-${year}-${typePrefix}-${paddedNum}`;
  if (type === 'CERTIFICATE') docId = `CIX-CERT-${year}-${paddedNum}`;
  else if (type === 'PERFORMANCE_REPORT') docId = `CIX-PERF-${year}-${paddedNum}`;
  
  const issueDate = new Date();
  const issueDateStr = issueDate.toISOString().split('T')[0];
  
  const formatCertDate = (d: Date | string) => {
    const dt = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(dt.getTime())) return '';
    const day = dt.getDate().toString().padStart(2, '0');
    const month = dt.toLocaleDateString('en-US', { month: 'long' });
    const y = dt.getFullYear();
    return `${day} ${month} ${y}`;
  };

  const formattedIssueDate = formatCertDate(issueDate);
  const formattedStartDate = formatCertDate(enrolledAt);
  const formattedEndDate = formattedIssueDate;

  // Check if document already exists to avoid duplicates
  const { data: existingDoc } = await supabaseAdmin
    .from('internship_documents')
    .select('document_id')
    .eq('enrollment_id', enrollmentId)
    .eq('type', type)
    .single();

  if (existingDoc) {
    throw new Error(`A ${type} has already been issued for this enrollment.`);
  }

  // Generate Document Data based on Type
  let documentData: any = {
    issueDate: formattedIssueDate,
    issue_date: formattedIssueDate,
    signatoryName: 'Shani Bharadwaj',
    signatory_name: 'Shani Bharadwaj',
    signatoryTitle: 'Co-Founder',
    companyPhone: '9508574636',
    companyEmail: 'internxcode@gmail.com',
    companyWebsite: 'codeinternx.com',
    certificateTemplateVersion: '2026-v1',
  };

  if (type === 'OFFER_LETTER') {
    documentData = {
      ...documentData,
      recipientName: studentName,
      recipientPhone: candidatePhone,
      recipientAddress: candidateAddress,
      position: 'Intern',
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      employmentStatus: 'Internship',
      compensation: 'Unpaid / Project-based',
      domain: programTitle,
      department: 'Engineering',
      workMode: 'Online / Remote',
      offerLetterId: docId
    } as OfferLetterData;
  } else if (type === 'CERTIFICATE') {
    documentData = {
      ...documentData,
      recipientName: studentName,
      domain: programTitle,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      issueDate: formattedIssueDate,
      certificateId: docId,
      // Backward-compatibility aliases
      student_name: studentName,
      internship_domain: programTitle,
      company_name: 'CodeInternX',
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      certificate_id: docId,
    } as CertificateData;
  } else if (type === 'PERFORMANCE_REPORT') {
    const pScore = performanceScore || 4.7;
    const getRating = (score: number) => {
      if (score >= 4.5) return 'Excellent';
      if (score >= 4.0) return 'Very Good';
      if (score >= 3.5) return 'Good';
      if (score >= 3.0) return 'Satisfactory';
      return 'Needs Improvement';
    };

    const techScore = Math.min(5, pScore + 0.1);
    const probScore = Math.min(5, pScore);
    const commScore = Math.min(5, pScore - 0.2 > 3.5 ? pScore - 0.2 : 4.5);
    const teamScore = Math.min(5, pScore + 0.1);
    const profScore = Math.min(5, pScore + 0.2);

    documentData = {
      ...documentData,
      recipientName: studentName,
      position: `${programTitle} Intern`,
      domain: programTitle,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      workMode: 'Remote',

      technicalSkillsRating: getRating(techScore),
      technicalSkillsScore: `${techScore.toFixed(1)}/5`,
      technicalSkillsRemarks: 'Demonstrated strong practical understanding of core technologies.',

      problemSolvingRating: getRating(probScore),
      problemSolvingScore: `${probScore.toFixed(1)}/5`,
      problemSolvingRemarks: 'Consistently solved assigned technical problems effectively.',

      communicationRating: getRating(commScore),
      communicationScore: `${commScore.toFixed(1)}/5`,
      communicationRemarks: 'Communicated clearly with mentors and team members.',

      teamworkRating: getRating(teamScore),
      teamworkScore: `${teamScore.toFixed(1)}/5`,
      teamworkRemarks: 'Worked effectively with the team and contributed positively.',

      professionalismRating: getRating(profScore),
      professionalismScore: `${profScore.toFixed(1)}/5`,
      professionalismRemarks: 'Highly professional, reliable, and consistent throughout the internship.',

      overallRating: getRating(pScore),
      overallScore: pScore.toFixed(1),
      attendancePercentage: '96',

      achievements: 'Successfully completed assigned development tasks and contributed to project implementation.',
      projectName: `CodeInternX ${programTitle} Platform`,
      projectDescription: 'Full-stack hands-on internship project implementation.',
      finalRemarks: `${studentName} demonstrated excellent technical ability, professionalism, and willingness to learn throughout the internship.`,

      issueDate: formattedIssueDate,
      performanceReportId: docId,
      signatoryName: 'Shani Bharadwaj',
      signatoryTitle: 'Co-Founder',

      // Backward-compatibility aliases
      intern_name: studentName,
      intern_id: `CIX-${studentId.substring(0,6)}`.toUpperCase(),
      program_role: programTitle,
      department: 'Engineering',
      internship_duration: '4 Weeks',
      reporting_manager: 'Program Manager',
      technical_skills_rating: techScore.toFixed(1),
      technical_skills_comment: 'Good technical grasp',
      quality_of_work_rating: probScore.toFixed(1),
      quality_of_work_comment: 'High quality output',
      timeliness_rating: teamScore.toFixed(1),
      timeliness_comment: 'Meets deadlines',
      teamwork_rating: teamScore.toFixed(1),
      teamwork_comment: 'Good collaboration',
      communication_rating: commScore.toFixed(1),
      communication_comment: 'Clear and concise',
      initiative_learning_rating: profScore.toFixed(1),
      initiative_learning_comment: 'Fast learner',
      professionalism_rating: profScore.toFixed(1),
      professionalism_comment: 'Maintains professional conduct',
      overall_rating: pScore.toFixed(1),
      manager_comments: 'Successfully completed the required milestones.',
      performance_report_id: docId
    } as PerformanceReportData;
  } else if (type === 'LOR') {
    documentData = {
      ...documentData,
      recipientName: studentName,
      candidateName: studentName,
      position: 'Intern',
      domain: programTitle,
      documentId: docId
    } as LorData;
  }

  // Apply custom overrides if supplied by admin
  if (customOverrides && Object.keys(customOverrides).length > 0) {
    documentData = {
      ...documentData,
      ...customOverrides,
      // Ensure canonical IDs stay aligned
      documentId: customOverrides.documentId || customOverrides.certificateId || customOverrides.performanceReportId || docId,
      certificateId: customOverrides.certificateId || docId,
      performanceReportId: customOverrides.performanceReportId || docId,
      offerLetterId: customOverrides.offerLetterId || docId,
    };
  }

  // Validate Issue Date Rule for Offer Letters
  if (type === 'OFFER_LETTER') {
    if (!customOverrides?.manualIssueDateOverride) {
      const sDate = new Date(documentData.startDate);
      if (!isNaN(sDate.getTime())) {
        sDate.setDate(sDate.getDate() - 5);
        const expectedIssueDate = formatCertDate(sDate);
        if (documentData.issueDate !== expectedIssueDate && documentData.issue_date !== expectedIssueDate) {
          throw new Error("Offer Letter issue date must be exactly 5 days before the internship start date.");
        }
      }
    }
  }

  // Optionally update master student profile if requested by Admin
  if (updateProfileToo && isAdmin && customOverrides) {
    const profileUpdates: any = {};
    if (customOverrides.recipientName) profileUpdates.full_name = customOverrides.recipientName;
    if (customOverrides.recipientPhone) profileUpdates.phone = customOverrides.recipientPhone;
    if (customOverrides.recipientAddress) profileUpdates.address = customOverrides.recipientAddress;
    if (Object.keys(profileUpdates).length > 0) {
      await supabaseAdmin.from('profiles').update(profileUpdates).eq('id', studentId);
    }
  }

  // Generate HTML and then PDF
  const { html: htmlContent, width, height } = await generateDocumentHtml(type, documentData);
  const pdfBuffer = await generatePdf(htmlContent, { width, height, printBackground: true });

  // Upload to Supabase Storage
  const filename = `${docId}.pdf`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from('documents')
    .upload(`${studentId}/${filename}`, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });
    
  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw new Error(`Failed to upload PDF: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from('documents')
    .getPublicUrl(`${studentId}/${filename}`);
  const pdfUrl = publicUrlData.publicUrl;

  const viewOnlineUrl = type === 'CERTIFICATE' 
    ? `${APP_URL}/verify/certificate/${docId}`
    : type === 'PERFORMANCE_REPORT'
    ? `${APP_URL}/verify/performance-report/${docId}`
    : `${APP_URL}/verify/${type.toLowerCase().replace('_', '-')}/${docId}`;

  // Save to Documents table
  const { error: dbError } = await supabaseAdmin.from('internship_documents').upsert({
    document_id: docId,
    type: type,
    student_id: studentId,
    enrollment_id: enrollmentId,
    status: 'ISSUED',
    issue_date: issueDateStr,
    pdf_url: pdfUrl,
    verification_url: viewOnlineUrl,
    metadata: documentData,
  }, { onConflict: 'type,enrollment_id' });

  if (dbError) {
    console.error("Document insert error:", dbError);
    throw new Error("Failed to save document record");
  }

  if (type === 'CERTIFICATE') {
    // Update enrollment to completed only if a certificate is issued
    await supabaseAdmin
      .from("enrollments")
      .update({ is_completed: true, completed_at: issueDate.toISOString() })
      .eq("id", enrollmentId);
  }

  // Send PDF email
  let emailResult: { success: boolean; error?: string } = { success: false, error: 'No email provided' };
  if (studentEmail) {
    try {
      emailResult = await sendDocumentEmail({
        documentType: type as DocumentEmailType,
        documentId: docId,
        studentId,
        studentName,
        programTitle,
        recipientEmail: studentEmail,
        pdfBuffer,
        viewOnlineUrl,
      });
    } catch (emailErr: any) {
      emailResult = { success: false, error: emailErr.message };
    }
  }

  revalidatePath('/admin/documents');
  revalidatePath('/admin/certificates');
  revalidatePath('/student/documents');
  
  const auditDetails: any = { enrollmentId, studentId, programTitle };
  if (type === 'OFFER_LETTER' && customOverrides?.manualIssueDateOverride) {
    auditDetails.manualIssueDateOverride = true;
    auditDetails.issueDate = documentData.issueDate;
  }
  await logAuditAction(user.id, `ISSUE_${type}`, type, docId, auditDetails);

  return {
    success: true,
    pdfUrl,
    documentId: docId,
    emailSent: emailResult.success,
  };
}

/**
 * Revoke an issued document (e.g. Certificate, Performance Report)
 */
export async function revokeDocument(documentId: string, reason: string = 'Administrative decision') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'SUPER_ADMIN' && profile?.role !== 'ADMIN') {
    throw new Error('Forbidden: Only admins can revoke documents.');
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: doc, error: fetchErr } = await supabaseAdmin
    .from('internship_documents')
    .select('*')
    .eq('document_id', documentId)
    .single();

  if (fetchErr || !doc) {
    throw new Error('Document not found');
  }

  const { error: updateErr } = await supabaseAdmin
    .from('internship_documents')
    .update({
      status: 'REVOKED',
      metadata: {
        ...(doc.metadata || {}),
        revocationReason: reason,
        revokedAt: new Date().toISOString(),
        revokedBy: user.id
      }
    })
    .eq('document_id', documentId);

  if (updateErr) {
    throw new Error(`Failed to revoke document: ${updateErr.message}`);
  }

  await logAuditAction(user.id, `REVOKE_${doc.type}` as any, doc.type, documentId, { reason });

  revalidatePath('/admin/documents');
  revalidatePath('/admin/certificates');
  revalidatePath(`/verify/${doc.type.toLowerCase().replace('_', '-')}/${documentId}`);
  revalidatePath(`/verify/certificate/${documentId}`);

  return { success: true };
}

/**
 * Fetch default populated data for universal document editor
 */
export async function getDocumentDataForEdit(enrollmentId: string, type: DocumentType) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'SUPER_ADMIN' && profile?.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required.');
  }

  const eligibility = await checkDocumentEligibility(enrollmentId, type);
  if (!eligibility.data) {
    throw new Error('Enrollment data not found');
  }

  const { studentId, studentName, programTitle, enrolledAt, performanceScore } = eligibility.data;

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profileInfo } = await supabaseAdmin
    .from('profiles')
    .select('phone, address')
    .eq('id', studentId)
    .single();

  const formatCertDate = (d: Date | string) => {
    const dt = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(dt.getTime())) return '';
    const day = dt.getDate().toString().padStart(2, '0');
    const month = dt.toLocaleDateString('en-US', { month: 'long' });
    const y = dt.getFullYear();
    return `${day} ${month} ${y}`;
  };

  let formattedIssueDate = formatCertDate(new Date());
  if (type === 'OFFER_LETTER' && enrolledAt) {
    const sDate = typeof enrolledAt === 'string' ? new Date(enrolledAt) : new Date(enrolledAt.getTime());
    if (!isNaN(sDate.getTime())) {
      sDate.setDate(sDate.getDate() - 5);
      formattedIssueDate = formatCertDate(sDate);
    }
  }

  const formattedStartDate = formatCertDate(enrolledAt);
  const formattedEndDate = formatCertDate(new Date());

  // Check if document already exists
  const { data: existingDoc } = await supabaseAdmin
    .from('internship_documents')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .eq('type', type)
    .maybeSingle();

  if (existingDoc && existingDoc.metadata) {
    return {
      ...existingDoc.metadata,
      isExisting: true,
      documentId: existingDoc.document_id,
      status: existingDoc.status
    };
  }

  // Otherwise return calculated defaults
  const pScore = performanceScore || 4.7;
  const getRating = (score: number) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 4.0) return 'Very Good';
    if (score >= 3.5) return 'Good';
    if (score >= 3.0) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const techScore = Math.min(5, pScore + 0.1);
  const probScore = Math.min(5, pScore);
  const commScore = Math.min(5, pScore - 0.2 > 3.5 ? pScore - 0.2 : 4.5);
  const teamScore = Math.min(5, pScore + 0.1);
  const profScore = Math.min(5, pScore + 0.2);

  return {
    isExisting: false,
    recipientName: studentName,
    candidateName: studentName,
    recipientPhone: profileInfo?.phone || '',
    recipientAddress: profileInfo?.address || '',
    position: `${programTitle} Intern`,
    domain: programTitle,
    department: 'Engineering',
    workMode: 'Remote',
    employmentStatus: 'Internship',
    compensation: 'Unpaid / Project-based',
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    issueDate: formattedIssueDate,
    signatoryName: 'Shani Bharadwaj',
    signatoryTitle: 'Co-Founder',
    
    // Performance details
    technicalSkillsRating: getRating(techScore),
    technicalSkillsScore: `${techScore.toFixed(1)}/5`,
    technicalSkillsRemarks: 'Demonstrated strong practical understanding of frontend technologies.',
    problemSolvingRating: getRating(probScore),
    problemSolvingScore: `${probScore.toFixed(1)}/5`,
    problemSolvingRemarks: 'Consistently solved assigned technical problems effectively.',
    communicationRating: getRating(commScore),
    communicationScore: `${commScore.toFixed(1)}/5`,
    communicationRemarks: 'Communicated clearly with mentors and team members.',
    teamworkRating: getRating(teamScore),
    teamworkScore: `${teamScore.toFixed(1)}/5`,
    teamworkRemarks: 'Worked effectively with the team and contributed positively.',
    professionalismRating: getRating(profScore),
    professionalismScore: `${profScore.toFixed(1)}/5`,
    professionalismRemarks: 'Highly professional, reliable, and consistent throughout the internship.',
    overallRating: getRating(pScore),
    overallScore: pScore.toFixed(1),
    attendancePercentage: '96',
    achievements: 'Successfully completed assigned frontend development tasks and contributed to project implementation.',
    projectName: `CodeInternX ${programTitle} Platform`,
    projectDescription: 'Internship platform features and interactive components.',
    finalRemarks: `${studentName} demonstrated excellent technical ability, professionalism, and willingness to learn throughout the internship.`
  };
}

/**
 * Preview document HTML without issuing or persisting
 */
export async function previewDocumentHtmlAction(
  enrollmentId: string,
  type: DocumentType,
  customOverrides?: Record<string, any>
) {
  const defaultData = await getDocumentDataForEdit(enrollmentId, type);
  const mergedData = {
    ...defaultData,
    ...(customOverrides || {}),
    certificateId: customOverrides?.certificateId || defaultData.documentId || 'CIX-CERT-PREVIEW-000001',
    performanceReportId: customOverrides?.performanceReportId || defaultData.documentId || 'CIX-PERF-PREVIEW-000001',
    offerLetterId: customOverrides?.offerLetterId || defaultData.documentId || 'CIX-OFFER-PREVIEW-000001',
    documentId: customOverrides?.documentId || defaultData.documentId || 'CIX-DOC-PREVIEW-000001'
  };

  const result = await generateDocumentHtml(type, mergedData);
  return { html: result.html, width: result.width, height: result.height };
}

/**
 * Securely resend a document email.
 */
export async function resendDocumentEmail(documentId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'SUPER_ADMIN' || profile?.role === 'ADMIN';

  const { data: doc, error: docErr } = await supabase
    .from('internship_documents')
    .select('document_id, type, student_id, pdf_url, profiles(full_name, email), enrollments(programs(title))')
    .eq('document_id', documentId)
    .single();

  if (docErr || !doc) return { success: false, error: 'Document not found or access denied.' };

  if (!isAdmin && doc.student_id !== user.id) {
    return { success: false, error: 'Forbidden: You do not own this document.' };
  }

  const studentEmail = (doc.profiles as any)?.email;
  const studentName = (doc.profiles as any)?.full_name || 'Student';
  const programTitle = (doc.enrollments as any)?.programs?.title || 'Internship Program';

  if (!studentEmail) return { success: false, error: 'Student email not found' };

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let pdfBuffer: Buffer;
  try {
    const filePath = `${doc.student_id}/${documentId}.pdf`;
    
    const { data: fileData, error: dlError } = await supabaseAdmin.storage.from('documents').download(filePath);
    if (dlError || !fileData) throw new Error(dlError?.message || 'No data');
    pdfBuffer = Buffer.from(await fileData.arrayBuffer());
  } catch (dlErr: any) {
    return { success: false, error: `Could not retrieve stored PDF: ${dlErr.message}` };
  }

  const type = doc.type as DocumentEmailType;
  const viewOnlineUrl = `${APP_URL}/verify/${type.toLowerCase().replace('_', '-')}/${documentId}`;

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

  return result;
}
