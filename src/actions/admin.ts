"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { internships } from "@/lib/data";

export async function issueOfferLetter(applicationId: string) {
  const supabase = await createClient();

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // 2. Fetch the application
  const { data: app, error: appError } = await supabase
    .from("applications")
    .select("*, profiles(email, full_name), programs(title, duration_months)")
    .eq("id", applicationId)
    .single();

  if (appError || !app) {
    throw new Error("Application not found");
  }

  // 3. Create the enrollment
  const { data: enrollment, error: enrollError } = await supabase
    .from("enrollments")
    .insert({
      student_id: app.student_id,
      program_id: app.program_id,
      application_id: app.id,
      payment_status: "PENDING",
      enrolled_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (enrollError) {
    // Check if already enrolled (idempotent)
    if (!enrollError.message.includes('duplicate') && !enrollError.message.includes('unique')) {
      throw new Error(`Failed to create enrollment: ${enrollError.message}`);
    }
  }

  // 4. Update application status
  const { error: updateError } = await supabase
    .from("applications")
    .update({ status: "APPROVED" })
    .eq("id", applicationId);

  if (updateError) {
    throw new Error("Failed to update application status");
  }

  // 5. Generate sequential Offer Letter ID
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("internship_documents")
    .select("*", { count: 'exact', head: true })
    .eq("type", "OFFER_LETTER")
    .ilike("document_id", `OL-${year}-%`);

  const nextNum = (count || 0) + 1;
  const documentId = `OL-${year}-${nextNum.toString().padStart(6, '0')}`;

  // Get enrollment id (existing or newly created)
  const enrollmentId = enrollment?.id || (await supabase
    .from("enrollments")
    .select("id")
    .eq("application_id", applicationId)
    .single()
    .then(r => r.data?.id));

  // 6. Generate PDF + save to DB + send email with attachment
  const startDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const durationMonths = app.programs?.duration_months || 1;
  const endDate = new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  if (enrollmentId) {
    try {
      const { generateAndSaveDocument } = await import("@/actions/documents");
      const result = await generateAndSaveDocument({
        type: 'OFFER_LETTER',
        studentId: app.student_id,
        enrollmentId,
        documentId,
        studentEmail: app.profiles?.email,
        studentName: app.profiles?.full_name || 'Student',
        programTitle: app.programs?.title || 'Internship Program',
        data: {
          student_name: app.profiles?.full_name || 'Student',
          position: app.programs?.title || 'Intern',
          department: 'Engineering',
          work_mode: 'Remote',
          start_date: startDate,
          end_date: endDate,
          responsibilities: 'Complete assigned tasks and projects as outlined by your mentor.',
          offer_letter_id: documentId,
          issue_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
          signatory_name: 'CodeInternX Director',
        },
      });
      if (!result.success && result.isPdfFailure) {
        console.error('[issueOfferLetter] PDF generation failed — offer letter not stored');
      }
    } catch (docErr) {
      console.error('[issueOfferLetter] Document generation error:', docErr);
      // Enrollment and application status are already set — fall back to plain email
      try {
        const { sendOfferLetterEmail } = await import("@/lib/email");
        await sendOfferLetterEmail(app.profiles?.email || '', app.profiles?.full_name || 'Student', app.programs?.title || 'Internship Program');
      } catch {}
    }
  }

  revalidatePath("/admin/applications");
  return { success: true };
}


export async function issueCertificate(studentId: string, programId: string, enrollmentId: string) {
  const supabase = await createClient();

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // 2. Fetch necessary data (include email for PDF email delivery)
  const { data: enrollment, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('*, profiles(full_name, email), programs(title)')
    .eq('id', enrollmentId)
    .single();
    
  if (enrollmentError || !enrollment) throw new Error("Enrollment not found");

  // Generate unique certificate ID
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("certificates")
    .select("*", { count: 'exact', head: true })
    .ilike('certificate_id', `CIX-${year}-%`);
    
  const nextNum = (count || 0) + 1;
  const paddedNum = nextNum.toString().padStart(6, '0');
  const certId = `CIX-${year}-${paddedNum}`;

  const issueDate = new Date();
  
  // Prepare dynamic template data
  // Note: generateCertificatePDF must be imported at the top of admin.ts
  const certData = {
    studentName: enrollment.profiles.full_name || 'Unknown Student',
    internshipDomain: enrollment.programs.title || 'Internship Program',
    companyName: 'CodeInternX',
    startDate: new Date(enrollment.enrolled_at).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
    endDate: new Date(issueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
    issueDate: issueDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
    certificateId: certId,
    signatoryName: 'CodeInternX Director'
  };

  // Generate PDF buffer
  const { generateCertificatePDF } = await import('@/lib/pdfGenerator');
  const pdfBuffer = await generateCertificatePDF(certData);

  // Upload to Supabase Storage
  const filename = `${certId}.pdf`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('certificates')
    .upload(filename, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });
    
  if (uploadError) {
    throw new Error(`Failed to upload PDF: ${uploadError.message}`);
  }
  
  const { data: publicUrlData } = supabase.storage.from('certificates').getPublicUrl(filename);
  const certificateUrl = publicUrlData.publicUrl;

  // Insert Certificate Record
  const { error } = await supabase
    .from("certificates")
    .insert({
      certificate_id: certId,
      student_id: studentId,
      program_id: programId,
      enrollment_id: enrollmentId,
      issue_date: issueDate.toISOString().split('T')[0]
    });

  if (error) {
    if (error.code === '23505') {
       throw new Error("A certificate has already been issued for this enrollment.");
    }
    throw new Error(`Failed to issue certificate: ${error.message}`);
  }

  // Update enrollment to is_completed
  await supabase
    .from("enrollments")
    .update({ is_completed: true, completed_at: issueDate.toISOString() })
    .eq("id", enrollmentId);

  // Send certificate PDF email — best-effort
  const studentEmail = enrollment.profiles?.email;
  const studentName = enrollment.profiles?.full_name || 'Student';
  const programTitle = enrollment.programs?.title || 'Internship Program';

  if (studentEmail) {
    try {
      const { sendDocumentEmail } = await import('@/lib/email');
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codeinternx.com';
      await sendDocumentEmail({
        documentType: 'CERTIFICATE',
        documentId: certId,
        studentId,
        studentName,
        programTitle,
        recipientEmail: studentEmail,
        pdfBuffer,
        viewOnlineUrl: `${appUrl}/verify/certificate/${certId}`,
      });
    } catch (emailErr) {
      console.error('[issueCertificate] Email delivery failed (certificate still issued):', emailErr);
    }
  }

  revalidatePath("/admin/certificates");
  return { success: true, certificateId: certId };
}

export async function bulkIssueCertificates(enrollmentsToIssue: { studentId: string, programId: string, enrollmentId: string }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const year = new Date().getFullYear();
  let generated = 0;
  let failed = 0;

  for (const enrollment of enrollmentsToIssue) {
    try {
      // Re-check count to ensure sequence
      const { count } = await supabase
        .from("certificates")
        .select("*", { count: 'exact', head: true })
        .ilike('certificate_id', `CIX-${year}-%`);
        
      let nextNum = (count || 0) + 1;
      let success = false;
      let retryCount = 0;

      while (!success && retryCount < 5) {
        const paddedNum = nextNum.toString().padStart(6, '0');
        const certId = `CIX-${year}-${paddedNum}`;

        const { error } = await supabase.from("certificates").insert({
          certificate_id: certId,
          student_id: enrollment.studentId,
          program_id: enrollment.programId,
          enrollment_id: enrollment.enrollmentId,
          issue_date: new Date().toISOString()
        });

        if (error && error.code === '23505') {
          if (error.message.includes('enrollment_id')) {
            throw new Error("Already issued");
          }
          nextNum++;
          retryCount++;
        } else if (error) {
          throw error;
        } else {
          success = true;
        }
      }

      if (success) generated++;
      else failed++;
    } catch (e) {
      failed++;
    }
  }

  revalidatePath("/admin/certificates");
  return { success: true, generated, failed };
}

export async function initiateRefund(paymentId: string) {
  // Manual payment system: Refunds are handled offline.
  // This function marks the payment as REFUNDED in the database for record-keeping.
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN") {
    throw new Error("Only SUPER_ADMIN can initiate refunds");
  }

  const { data: payment, error: payError } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (payError || !payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "REFUNDED") {
    throw new Error("Payment is already refunded");
  }

  const { error: updateError } = await supabase
    .from("payments")
    .update({ status: "REFUNDED", reviewed_at: new Date().toISOString(), reviewed_by: user.id })
    .eq("id", paymentId);

  if (updateError) {
    throw new Error("Failed to update payment status");
  }

  revalidatePath("/admin/payments");
  return { success: true };
}

export async function updateApplicationStatus(applicationId: string, newStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const allowedStatuses = ["REJECTED", "PENDING", "UNDER_REVIEW"];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error("Invalid status transition");
  }

  const { error } = await supabase
    .from("applications")
    .update({ status: newStatus })
    .eq("id", applicationId);

  if (error) {
    throw new Error(`Failed to update application: ${error.message}`);
  }

  revalidatePath("/admin/applications");
  return { success: true };
}

export async function markApplicationCompleted(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("applications")
    .update({ status: "COMPLETED" })
    .eq("id", applicationId);

  if (error) {
    throw new Error(`Failed to mark application as completed: ${error.message}`);
  }

  revalidatePath("/admin/applications");
  return { success: true };
}

export async function saveProgram(programData: any, programId?: string) {
  const supabase = await createClient();

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (programId) {
    // Update
    const { error } = await supabase
      .from("programs")
      .update(programData)
      .eq("id", programId);
    
    if (error) throw new Error(`Failed to update program: ${error.message}`);
  } else {
    // Insert
    const { error } = await supabase
      .from("programs")
      .insert(programData);

    if (error) throw new Error(`Failed to create program: ${error.message}`);
  }

  revalidatePath("/admin/programs");
  return { success: true };
}

export async function deleteProgram(programId: string) {
  const supabase = await createClient();

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN") {
    throw new Error("Only SUPER_ADMIN can delete programs");
  }

  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programId);

  if (error) {
    throw new Error(`Failed to delete program: ${error.message}`);
  }

  revalidatePath("/admin/programs");
  return { success: true };
}

export async function importApplications(csvData: any[]) {
  const supabase = await createClient();

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  let successCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (const row of csvData) {
    const email = row["Email"] || row["email"] || row["Email Address"];
    const programTitle = row["Program Title"] || row["program"] || row["Program"];

    if (!email || !programTitle) {
      failedCount++;
      errors.push(`Row missing email or program title: ${JSON.stringify(row)}`);
      continue;
    }

    // Find student profile by email
    const { data: studentProfile } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", email.trim())
      .single();

    if (!studentProfile) {
      failedCount++;
      errors.push(`Student with email ${email} has not signed up on the platform yet.`);
      continue;
    }

    // Find program by title
    const { data: program } = await supabase
      .from("programs")
      .select("id")
      .ilike("title", programTitle.trim())
      .single();

    if (!program) {
      failedCount++;
      errors.push(`Program "${programTitle}" not found in database.`);
      continue;
    }

    // Insert Application
    const appId = `CI-APP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const { error: insertError } = await supabase
      .from("applications")
      .insert({
        application_id: appId,
        student_id: studentProfile.id,
        program_id: program.id,
        source: 'GOOGLE_FORM',
        status: 'PENDING'
      });

    if (insertError) {
      failedCount++;
      if (insertError.code === '23505') {
        errors.push(`${email} has already applied to "${programTitle}".`);
      } else {
        errors.push(`Failed to insert application for ${email}: ${insertError.message}`);
      }
    } else {
      successCount++;
    }
  }

  revalidatePath("/admin/applications");
  return { success: successCount, failed: failedCount, errors };
}

export async function updateUserRole(targetUserId: string, newRole: string) {
  const supabase = await createClient();

  // 1. Verify admin is SUPER_ADMIN
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "SUPER_ADMIN") {
    throw new Error("Only SUPER_ADMIN can change user roles");
  }

  const allowedRoles = ["STUDENT", "EVALUATOR", "ADMIN"];
  if (!allowedRoles.includes(newRole)) {
    throw new Error("Invalid role specified");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole as any })
    .eq("id", targetUserId);

  if (error) {
    throw new Error(`Failed to update role: ${error.message}`);
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function performGlobalSearch(query: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") return [];

  const safeQuery = `%${query.trim()}%`;
  const results: any[] = [];

  // Search profiles (Email, Name)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .or(`full_name.ilike.${safeQuery},email.ilike.${safeQuery}`)
    .limit(5);

  if (profiles) {
    profiles.forEach(p => results.push({
      type: 'USER',
      title: p.full_name,
      subtitle: p.email,
      url: `/admin/users` // In a real app we'd link to user profile
    }));
  }

  // Search applications
  const { data: applications } = await supabase
    .from("applications")
    .select("id, application_id")
    .ilike("application_id", safeQuery)
    .limit(3);

  if (applications) {
    applications.forEach(a => results.push({
      type: 'APPLICATION',
      title: a.application_id,
      subtitle: "Student Application",
      url: `/admin/applications`
    }));
  }

  // Search Payments by transaction ID
  const { data: payments } = await supabase
    .from("payments")
    .select("id, transaction_id, amount")
    .ilike("transaction_id", safeQuery)
    .limit(3);

  if (payments) {
    payments.forEach(p => results.push({
      type: 'PAYMENT',
      title: p.transaction_id,
      subtitle: `Amount: ₹${p.amount}`,
      url: `/admin/payments`
    }));
  }

  // Search Certificates
  const { data: certs } = await supabase
    .from("certificates")
    .select("id, certificate_id")
    .ilike("certificate_id", safeQuery)
    .limit(3);

  if (certs) {
    certs.forEach(c => results.push({
      type: 'CERTIFICATE',
      title: c.certificate_id,
      subtitle: "Issued Certificate",
      url: `/admin/certificates`
    }));
  }

  return results;
}

export async function seedPrograms() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "SUPER_ADMIN" && profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Insert programs ignoring duplicates if possible, or just insert them.
  for (const prog of internships) {
    // Check if it exists
    const { data: existing } = await supabase.from("programs").select("id").eq("slug", prog.slug).single();
    if (!existing) {
      await supabase.from("programs").insert({
        title: prog.title,
        slug: prog.slug,
        description: prog.description,
        category: prog.category,
        duration_weeks: 4, // Default duration
        level: prog.level?.toUpperCase() || 'BEGINNER',
        mode: prog.mode?.toUpperCase() || 'ONLINE',
        technologies: prog.technologies,
        price: 99.00, // Default price
        is_published: prog.isPublished || true
      });
    }
  }

  revalidatePath("/admin/programs");
  return { success: true };
}
